import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Clapperboard, Link as LinkIcon, Download } from 'lucide-react';
import ToolShell from '../components/ToolShell';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { getToolByKey } from '../lib/tool-registry';

const defaultPlatform = 'youtube';

export default function VideoDownloaderPage() {
  const { platform: platformParam } = useParams();
  const platform = platformParam || defaultPlatform;
  const tool = useMemo(() => getToolByKey(platform) || getToolByKey(defaultPlatform), [platform]);
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!url.trim()) {
      setError('Paste a video URL first.');
      return;
    }

    setError('');
  };

  return (
    <ToolShell
      categoryLabel="Video tools"
      title={tool?.label || 'Video Downloader'}
      description={tool?.description || 'Download social video links from a platform-specific section.'}
      rightTitle="Download status"
      rightDescription="This section is scaffolded and ready for a backend downloader connector."
      leftChildren={
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="video-url">
              Video URL
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
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border bg-background p-4">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">Platform</p>
              <p className="mt-2 text-sm font-medium">{tool?.label || platform}</p>
              <p className="mt-1 text-sm text-muted-foreground">Each platform gets its own section.</p>
            </div>
            <div className="rounded-xl border bg-background p-4">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">Status</p>
              <Badge className="mt-2 w-fit" variant="secondary">
                Ready for connector
              </Badge>
              <p className="mt-2 text-sm text-muted-foreground">
                The UI is ready; the actual downloader service can be plugged in next.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit">
              <Download size={16} />
              Prepare download
            </Button>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
          </div>
        </form>
      }
      rightChildren={
        <div className="grid gap-4">
          <div className="grid min-h-56 place-items-center rounded-lg border border-dashed bg-muted/30 text-center text-muted-foreground">
            <div className="space-y-2">
              <Clapperboard className="mx-auto" size={28} />
              <p className="font-medium text-foreground">Video download section</p>
              <p className="text-sm text-muted-foreground">
                Add the backend downloader service here when you are ready.
              </p>
            </div>
          </div>

          <div className="rounded-lg border bg-background p-4">
            <p className="text-sm font-medium">Supported sections</p>
            <p className="text-sm text-muted-foreground">
              YouTube, TikTok, Instagram, Facebook, X, and LinkedIn each have their own page.
            </p>
          </div>
        </div>
      }
    />
  );
}
