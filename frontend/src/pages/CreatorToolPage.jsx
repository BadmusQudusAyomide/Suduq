import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import ToolShell from '../components/ToolShell';
import { getToolByKey } from '../lib/tool-registry';

function formatSeconds(value) {
  const total = Math.max(0, Number(value) || 0);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = Math.floor(total % 60);
  const parts = [hours, minutes, seconds].map((part) => String(part).padStart(2, '0'));

  return hours > 0 ? `${parts[0]}:${parts[1]}:${parts[2]}` : `${parts[1]}:${parts[2]}`;
}

function extractYouTubeVideoId(value) {
  const input = String(value || '').trim();

  if (!input) {
    return '';
  }

  const patterns = [
    /(?:v=|\/shorts\/|\/embed\/|youtu\.be\/)([a-zA-Z0-9_-]{6,})/,
    /youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{6,})/
  ];

  for (const pattern of patterns) {
    const match = input.match(pattern);
    if (match?.[1]) {
      return match[1];
    }
  }

  return '';
}

function toolCopy(toolKey) {
  switch (toolKey) {
    case 'monetization-checker':
      return {
        label: 'Channel URL',
        placeholder: 'Paste a YouTube channel link',
        button: 'Check eligibility',
        helper: 'Use this to prepare a monetization status lookup.'
      };
    case 'channel-stats':
      return {
        label: 'Channel URL or handle',
        placeholder: 'Paste a YouTube channel link or @handle',
        button: 'Load stats',
        helper: 'This will later connect to a stats API.'
      };
    case 'video-tag-extractor':
      return {
        label: 'Video URL',
        placeholder: 'Paste a YouTube video link',
        button: 'Extract tags',
        helper: 'Great for SEO planning and keyword ideas.'
      };
    case 'thumbnail-downloader':
      return {
        label: 'Video URL',
        placeholder: 'Paste a YouTube video link',
        button: 'Get thumbnail',
        helper: 'We can generate the thumbnail link right in the browser.'
      };
    case 'channel-id-finder':
      return {
        label: 'Channel URL or handle',
        placeholder: 'Paste a channel link, custom URL, or @handle',
        button: 'Find channel ID',
        helper: 'Some channel formats will need an API lookup later.'
      };
    case 'video-duration-formatter':
      return {
        label: 'Duration in seconds',
        placeholder: 'e.g. 125 or 3600',
        button: 'Format duration',
        helper: 'Useful for turning raw durations into readable time.'
      };
    case 'youtube-to-mp3':
    default:
      return {
        label: 'YouTube URL',
        placeholder: 'Paste a YouTube video link',
        button: 'Prepare MP3',
        helper: 'This UI is ready for your API later.'
      };
  }
}

export default function CreatorToolPage() {
  const { toolKey } = useParams();
  const tool = useMemo(() => getToolByKey(toolKey) || getToolByKey('youtube-to-mp3'), [toolKey]);
  const copy = useMemo(() => toolCopy(tool?.key), [tool]);
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!input.trim()) {
      setResult('Paste a link or value first.');
      return;
    }

    if (tool?.key === 'video-duration-formatter') {
      setResult(formatSeconds(input.trim()));
      return;
    }

    if (tool?.key === 'thumbnail-downloader') {
      const videoId = extractYouTubeVideoId(input);

      if (videoId) {
        setResult(`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`);
        return;
      }

      setResult('Could not detect a YouTube video ID yet.');
      return;
    }

    if (tool?.key === 'channel-id-finder' && input.trim().toLowerCase().includes('/channel/')) {
      setResult(input.trim().split('/channel/')[1].split(/[/?#]/)[0]);
      return;
    }

    if (tool?.key === 'youtube-to-mp3') {
      setResult('API hook ready. Connect your converter endpoint here.');
      return;
    }

    setResult('UI ready. Connect the API for live results.');
  };

  return (
    <ToolShell
      categoryLabel="Creators tools"
      title={tool?.label || 'Creators tool'}
      description={tool?.description || 'YouTube-first creator utilities with room for more social tools later.'}
      rightTitle="Result"
      rightDescription="Keep the interface simple and connect the API when you are ready."
      leftChildren={
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="creator-input">
              {copy.label}
            </label>
            <Input
              id="creator-input"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={copy.placeholder}
            />
            <p className="text-xs text-muted-foreground">{copy.helper}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit">{copy.button}</Button>
            <Badge variant="secondary">UI first</Badge>
          </div>
        </form>
      }
      rightChildren={
        <div className="space-y-4">
          <div className="rounded-lg border bg-muted/20 p-4">
            <p className="text-sm font-medium">What this page does</p>
            <p className="mt-1 text-sm text-muted-foreground">
              These creator tools stay lightweight now and can connect to APIs later.
            </p>
          </div>

          <div className="rounded-lg border bg-background p-4">
            <p className="text-sm font-medium">Output</p>
            <p className="mt-2 break-all text-sm text-muted-foreground">
              {result || 'Run the tool to see the output here.'}
            </p>
          </div>
        </div>
      }
    />
  );
}
