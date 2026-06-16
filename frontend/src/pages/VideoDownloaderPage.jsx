import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Clapperboard, Link as LinkIcon, Download, Pause, Clock3, CircleAlert } from 'lucide-react';
import { toast } from 'sonner';
import ToolShell from '../components/ToolShell';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { getToolByKey } from '../lib/tool-registry';
import { getVideoPreset } from '../lib/video-presets';
import {
  cancelVideoJob,
  downloadVideoFile,
  startVideoDownload,
  waitForVideoJob
} from '../lib/videoApi';
import { useVideoDownloadHistory } from '../hooks/useVideoDownloadHistory';

const defaultPlatform = 'youtube';
const terminalStatuses = new Set(['done', 'failed', 'cancelled']);

function formatTimestamp(value) {
  if (!value) {
    return '';
  }

  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  }).format(new Date(value));
}

function statusTone(status) {
  switch (status) {
    case 'done':
      return 'secondary';
    case 'failed':
      return 'outline';
    case 'cancelled':
      return 'outline';
    default:
      return 'default';
  }
}

function statusLabel(status) {
  switch (status) {
    case 'queued':
      return 'Queued';
    case 'initializing':
      return 'Preparing';
    case 'downloading':
      return 'Downloading';
    case 'packaging':
      return 'Packaging';
    case 'done':
      return 'Completed';
    case 'failed':
      return 'Failed';
    case 'cancelled':
      return 'Cancelled';
    default:
      return status || 'Unknown';
  }
}

function buildHistoryEntry(job, preset, overrides = {}) {
  return {
    id: job.id,
    platform: job.platform,
    title: job.title || preset.label,
    preset: preset.title,
    description: preset.description,
    url: job.url,
    filename: job.filename || null,
    status: job.status,
    progress: job.progress || 0,
    error: job.error || '',
    startedAt: job.createdAt || new Date().toISOString(),
    updatedAt: job.updatedAt || new Date().toISOString(),
    completedAt: job.status === 'done' ? job.updatedAt || new Date().toISOString() : null,
    ...overrides
  };
}

export default function VideoDownloaderPage() {
  const { platform: platformParam } = useParams();
  const platform = platformParam || defaultPlatform;
  const tool = useMemo(() => getToolByKey(platform) || getToolByKey(defaultPlatform), [platform]);
  const preset = useMemo(() => getVideoPreset(platform), [platform]);
  const { history, upsertHistoryItem, clearHistory } = useVideoDownloadHistory();
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [activeJob, setActiveJob] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [cancelRequested, setCancelRequested] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  const syncHistory = (job, overrides = {}) => {
    upsertHistoryItem(buildHistoryEntry(job, preset, overrides));
  };

  const handleCancel = async () => {
    if (!activeJob) {
      return;
    }

    try {
      setCancelRequested(true);
      await cancelVideoJob(activeJob.id);
      toast.info('Download cancelled');
    } catch (cancelError) {
      setError(cancelError instanceof Error ? cancelError.message : 'Unable to cancel the download');
    } finally {
      setCancelRequested(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedUrl = url.trim();

    if (!trimmedUrl) {
      setError('Paste a video URL first.');
      return;
    }

    setError('');
    setIsDownloading(true);

    try {
      const job = await startVideoDownload(platform, trimmedUrl);
      if (!mountedRef.current) {
        return;
      }

      setActiveJob(job);
      syncHistory(job);

      const finalJob = await waitForVideoJob(job.id, (nextJob) => {
        if (!mountedRef.current) {
          return;
        }

        setActiveJob(nextJob);
        syncHistory(nextJob);
      });

      if (!mountedRef.current) {
        return;
      }

      if (finalJob.status !== 'done') {
        const message = finalJob.error || 'Video download failed';
        setError(message);
        syncHistory(finalJob, { error: message });
        return;
      }

      const { blob, filename } = await downloadVideoFile(finalJob.id);

      if (!mountedRef.current) {
        return;
      }

      const objectUrl = URL.createObjectURL(blob);
      const anchor = document.createElement('a');

      anchor.href = objectUrl;
      anchor.download = filename;
      anchor.style.display = 'none';
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();

      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);

      setError('');
      syncHistory(finalJob, {
        filename,
        status: 'done',
        completedAt: new Date().toISOString()
      });
      toast.success('Download started');
    } catch (downloadError) {
      const message = downloadError instanceof Error ? downloadError.message : 'Video download failed';
      setError(message);

      if (activeJob?.id) {
        syncHistory(
          {
            ...activeJob,
            status: 'failed',
            error: message
          },
          { error: message, status: 'failed' }
        );
      }
    } finally {
      if (mountedRef.current) {
        setIsDownloading(false);
      }
    }
  };

  const liveJob = activeJob && !terminalStatuses.has(activeJob.status) ? activeJob : null;
  const progressValue = Math.max(0, Math.min(100, Number(liveJob?.progress || 0)));
  const compactHistory = history.slice(0, 5);

  return (
    <ToolShell
      categoryLabel="Video tools"
      title={tool?.label || 'Video Downloader'}
      description={tool?.description || 'Paste a public video link and download it in one step.'}
      rightTitle="Download status"
      rightDescription="Quick status here, browser history below."
      leftChildren={
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="video-url">
              Paste video link
            </label>
            <div className="relative">
              <LinkIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <Input
                id="video-url"
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                placeholder="Paste a public video link here"
                className="pl-9"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Public links only. {preset.hint}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit" disabled={isDownloading}>
              <Download size={16} />
              {isDownloading ? 'Downloading...' : 'Download now'}
            </Button>
            {liveJob && !terminalStatuses.has(liveJob.status) ? (
              <Button type="button" variant="outline" onClick={handleCancel} disabled={cancelRequested}>
                <Pause size={16} />
                {cancelRequested ? 'Cancelling...' : 'Cancel'}
              </Button>
            ) : null}
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
          </div>
        </form>
      }
      rightChildren={
        <div className="grid gap-4">
          <div className="rounded-lg border bg-background p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium">Current status</p>
                <p className="text-sm text-muted-foreground">
                  {liveJob ? 'Downloading in progress.' : 'Ready when you are.'}
                </p>
              </div>
              <Badge variant={liveJob ? 'secondary' : 'outline'}>{liveJob ? statusLabel(liveJob.status) : 'Idle'}</Badge>
            </div>

            {liveJob ? (
              <div className="mt-4 space-y-4">
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">{liveJob.title || preset.label}</span>
                    <span className="text-muted-foreground">{progressValue}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progressValue}%` }} />
                  </div>
                </div>

                <div className="rounded-lg border bg-muted/20 p-3">
                  <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Details</p>
                  <p className="mt-1 text-sm font-medium">{statusLabel(liveJob.status)}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {liveJob.totalSize ? `Size: ${liveJob.totalSize}` : liveJob.currentSpeed || liveJob.eta || 'Working...'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-4 grid min-h-48 place-items-center rounded-lg border border-dashed bg-muted/30 text-center text-muted-foreground">
                <div className="space-y-2">
                  <Clapperboard className="mx-auto" size={28} />
                  <p className="font-medium text-foreground">Ready to download</p>
                  <p className="text-sm text-muted-foreground">Start a job and the live progress card will fill in here.</p>
                </div>
              </div>
            )}
          </div>

          <div className="rounded-lg border bg-background p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium">Recent downloads</p>
                <p className="text-sm text-muted-foreground">Saved in this browser only. No account needed.</p>
              </div>
              <Button type="button" variant="ghost" size="sm" onClick={clearHistory} disabled={!history.length}>
                Clear
              </Button>
            </div>

            <div className="mt-4 space-y-3">
              {compactHistory.length ? (
                compactHistory.map((item) => (
                  <div key={item.id} className="rounded-lg border p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">{item.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.platform?.toUpperCase()} {item.preset ? `- ${item.preset}` : ''}
                        </p>
                      </div>
                      <Badge variant={statusTone(item.status)}>{statusLabel(item.status)}</Badge>
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock3 size={12} />
                        {formatTimestamp(item.completedAt || item.updatedAt || item.startedAt)}
                      </span>
                      <span>{item.progress ? `${item.progress}%` : '0%'}</span>
                    </div>

                    {item.error ? (
                      <p className="mt-2 flex items-start gap-2 text-sm text-destructive">
                        <CircleAlert size={14} className="mt-0.5 shrink-0" />
                        <span>{item.error}</span>
                      </p>
                    ) : null}

                    {item.filename ? <p className="mt-2 text-xs text-muted-foreground">{item.filename}</p> : null}
                  </div>
                ))
              ) : (
                <div className="rounded-lg border border-dashed px-4 py-6 text-sm text-muted-foreground">
                  Your downloads will appear here after the first successful job.
                </div>
              )}
            </div>
          </div>
        </div>
      }
    />
  );
}
