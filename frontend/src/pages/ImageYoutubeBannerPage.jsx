import { useEffect, useMemo, useState } from 'react';
import { Download, Image as ImageIcon, LoaderCircle, Upload } from 'lucide-react';
import ToolShell from '../components/ToolShell';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { processImage } from '../lib/imageApi';
import { formatFileSize, getFileStem } from '../lib/tool-utils';

const BANNER_WIDTH = 2048;
const BANNER_HEIGHT = 1152;
const SAFE_WIDTH = 1235;
const SAFE_HEIGHT = 338;
const SAFE_LEFT = ((BANNER_WIDTH - SAFE_WIDTH) / 2 / BANNER_WIDTH) * 100;
const SAFE_TOP = ((BANNER_HEIGHT - SAFE_HEIGHT) / 2 / BANNER_HEIGHT) * 100;
const SAFE_WIDTH_PCT = (SAFE_WIDTH / BANNER_WIDTH) * 100;
const SAFE_HEIGHT_PCT = (SAFE_HEIGHT / BANNER_HEIGHT) * 100;

const formatOptions = [
  { value: 'jpeg', label: 'JPG' },
  { value: 'webp', label: 'WEBP' },
  { value: 'png', label: 'PNG' }
];

const fitOptions = [
  { value: 'cover', label: 'Cover' },
  { value: 'contain', label: 'Contain' }
];

function getExtension(format) {
  if (format === 'jpeg') return 'jpg';
  if (format === 'webp') return 'webp';
  return 'png';
}

export default function ImageYoutubeBannerPage() {
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [resultUrl, setResultUrl] = useState('');
  const [resultName, setResultName] = useState('');
  const [resultSize, setResultSize] = useState(0);
  const [previewUrl, setPreviewUrl] = useState('');
  const [format, setFormat] = useState('jpeg');
  const [fit, setFit] = useState('cover');
  const [quality, setQuality] = useState(82);

  useEffect(() => {
    if (!file) {
      setPreviewUrl('');
      return undefined;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  useEffect(() => {
    return () => {
      if (resultUrl) {
        URL.revokeObjectURL(resultUrl);
      }
    };
  }, [resultUrl]);

  const previewFitClass = useMemo(() => (fit === 'contain' ? 'object-contain' : 'object-cover'), [fit]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!file) {
      setError('Please choose an image first.');
      return;
    }

    setBusy(true);

    try {
      const blob = await processImage('/api/images/resize', file, {
        width: BANNER_WIDTH,
        height: BANNER_HEIGHT,
        fit,
        format,
        quality,
        withoutEnlargement: false
      });

      const url = URL.createObjectURL(blob);
      const extension = getExtension(format);

      setResultUrl(url);
      setResultName(`suduq-${getFileStem(file.name)}-youtube-banner.${extension}`);
      setResultSize(blob.size);
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setBusy(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setError('');
    setResultUrl('');
    setResultName('');
    setResultSize(0);
  };

  return (
    <ToolShell
      categoryLabel="Creators tools"
      title="YouTube Banner"
      description="Resize an image to YouTube's minimum banner spec, then export it with the right safe area in mind."
      rightTitle="Canvas preview"
      rightDescription="Use the overlay to keep text and logos inside the safe zone."
      leftChildren={
        <form className="space-y-6" onSubmit={handleSubmit}>
          <label className="flex cursor-pointer flex-col gap-4 rounded-2xl border border-dashed bg-muted/25 p-6 transition-colors hover:bg-muted/50">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <Upload className="text-muted-foreground" size={26} />
                <div>
                  <span className="block font-medium">Upload your banner art</span>
                  <span className="text-sm text-muted-foreground">
                    We will fit it into a 2048 x 1152 canvas with the YouTube safe area centered.
                  </span>
                </div>
              </div>
              <Badge variant="secondary">16:9 canvas</Badge>
            </div>

            <Input
              className="hidden"
              type="file"
              accept="image/*"
              onChange={(event) => {
                const next = event.target.files?.[0] ?? null;
                setFile(next);
                setError('');
                setResultUrl('');
                setResultName('');
                setResultSize(0);
              }}
            />
          </label>

          {file ? (
            <div className="flex flex-wrap items-center gap-2 rounded-xl border bg-background px-4 py-3 text-sm">
              <Badge variant="outline">{file.type || 'image'}</Badge>
              <span className="font-medium text-foreground">{file.name}</span>
              <span className="text-muted-foreground">{formatFileSize(file.size)}</span>
            </div>
          ) : null}

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="banner-fit">Fit mode</Label>
              <select
                id="banner-fit"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={fit}
                onChange={(event) => setFit(event.target.value)}
              >
                {fitOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="banner-format">Export format</Label>
              <select
                id="banner-format"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={format}
                onChange={(event) => setFormat(event.target.value)}
              >
                {formatOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="banner-quality">Quality</Label>
              <span className="text-xs text-muted-foreground">{quality}%</span>
            </div>
            <Input
              id="banner-quality"
              type="range"
              min={40}
              max={95}
              step={1}
              value={quality}
              onChange={(event) => setQuality(Number(event.target.value))}
            />
            <p className="text-xs text-muted-foreground">
              Quality mainly affects JPG and WEBP. PNG stays lossless, so it is usually larger.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit" disabled={busy}>
              {busy ? <LoaderCircle className="animate-spin" size={16} /> : <ImageIcon size={16} />}
              {busy ? 'Creating banner...' : 'Create banner'}
            </Button>
            <Button type="button" variant="outline" onClick={handleReset} disabled={!file && !resultUrl && !error}>
              Reset
            </Button>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
          </div>
        </form>
      }
      rightChildren={
        <div className="space-y-4">
          <div className="rounded-2xl border bg-background p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-sm font-medium text-foreground">Preview</p>
                <p className="text-xs text-muted-foreground">
                  Safe area: {SAFE_WIDTH} x {SAFE_HEIGHT} px. Upload minimum: {BANNER_WIDTH} x {BANNER_HEIGHT} px.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">6 MB max</Badge>
                <Badge variant="outline">{fit.toUpperCase()}</Badge>
                <Badge variant="outline">{format.toUpperCase()}</Badge>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border bg-slate-950">
              <div className="relative aspect-[16/9] w-full">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Selected banner preview"
                    className={`absolute inset-0 h-full w-full ${previewFitClass}`}
                  />
                ) : (
                  <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-slate-100 via-white to-slate-200 text-center text-slate-500">
                    <div className="space-y-2 px-6">
                      <ImageIcon className="mx-auto" size={28} />
                      <p className="font-medium text-slate-700">Drop in a banner image</p>
                      <p className="text-sm">We will show the YouTube safe zone here.</p>
                    </div>
                  </div>
                )}

                <div className="pointer-events-none absolute inset-0">
                  <div className="absolute inset-0 border-2 border-sky-400/90" />
                  <div
                    className="absolute rounded-md border border-sky-300 bg-sky-400/10"
                    style={{
                      left: `${SAFE_LEFT}%`,
                      top: `${SAFE_TOP}%`,
                      width: `${SAFE_WIDTH_PCT}%`,
                      height: `${SAFE_HEIGHT_PCT}%`
                    }}
                  >
                    <div className="absolute -top-8 left-0 rounded-full bg-white/90 px-3 py-1 text-[11px] font-medium text-slate-700 shadow-sm">
                      Viewable on all devices
                    </div>
                    <div className="absolute -bottom-8 left-0 rounded-full bg-white/90 px-3 py-1 text-[11px] font-medium text-slate-700 shadow-sm">
                      Safe area for text and logos
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              <Badge variant="outline" className="justify-center py-2">
                Full banner: 2048 x 1152
              </Badge>
              <Badge variant="outline" className="justify-center py-2">
                Safe zone: 1235 x 338
              </Badge>
              <Badge variant="outline" className="justify-center py-2">
                Aspect ratio: 16:9
              </Badge>
            </div>
          </div>

          <div className="rounded-2xl border bg-background p-4">
            <div className="mb-3">
              <p className="text-sm font-medium text-foreground">Output</p>
              <p className="text-sm text-muted-foreground">
                The downloaded file keeps the banner dimensions. JPG and WEBP are the easiest ways to stay under 6 MB.
              </p>
            </div>

            {resultUrl ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-3 rounded-xl border bg-muted/20 px-4 py-3 text-sm">
                  <span className="font-medium text-foreground">{resultName}</span>
                  <span className="text-muted-foreground">{formatFileSize(resultSize)}</span>
                </div>

                {resultSize > 6 * 1024 * 1024 ? (
                  <p className="text-sm text-amber-600">
                    This export is over 6 MB. Try JPG with a lower quality setting.
                  </p>
                ) : null}

                <img
                  src={resultUrl}
                  alt="Processed banner output"
                  className="max-h-72 w-full rounded-lg border object-contain"
                />

                <Button asChild variant="outline" className="w-full">
                  <a href={resultUrl} download={resultName}>
                    <Download size={16} />
                    Download banner
                  </a>
                </Button>
              </div>
            ) : (
              <div className="grid min-h-56 place-items-center rounded-lg border border-dashed bg-muted/20 text-center text-muted-foreground">
                <div className="space-y-2">
                  <p className="font-medium text-foreground">No export yet</p>
                  <p className="text-sm">Upload an image, choose a format, then create the banner.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      }
    />
  );
}
