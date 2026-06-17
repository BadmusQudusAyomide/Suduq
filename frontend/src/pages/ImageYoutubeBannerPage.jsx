import { useEffect, useMemo, useRef, useState } from 'react';
import { Download, Image as ImageIcon, LoaderCircle, RotateCcw, Upload } from 'lucide-react';
import ToolShell from '../components/ToolShell';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
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

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function useElementSize(ref) {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return undefined;
    }

    const update = () => {
      const rect = element.getBoundingClientRect();
      setSize({
        width: rect.width,
        height: rect.height
      });
    };

    update();

    const observer = new ResizeObserver(update);
    observer.observe(element);

    return () => observer.disconnect();
  }, [ref]);

  return size;
}

async function loadImageInfo(file) {
  const url = URL.createObjectURL(file);

  try {
    const image = new Image();
    image.src = url;

    await new Promise((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error('Failed to load image.'));
    });

    return {
      url,
      width: image.naturalWidth,
      height: image.naturalHeight
    };
  } catch (error) {
    URL.revokeObjectURL(url);
    throw error;
  }
}

async function renderBannerBlob(image, { pan, fit, format, quality, transparentBackground = false }) {
  const canvas = document.createElement('canvas');
  canvas.width = BANNER_WIDTH;
  canvas.height = BANNER_HEIGHT;
  const context = canvas.getContext('2d');

  if (!context) {
    throw new Error('Canvas is not available in this browser.');
  }

  if (format !== 'png' || !transparentBackground) {
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
  }

  const scaleBase =
    fit === 'contain'
      ? Math.min(canvas.width / image.naturalWidth, canvas.height / image.naturalHeight)
      : Math.max(canvas.width / image.naturalWidth, canvas.height / image.naturalHeight);
  const scale = scaleBase;
  const renderWidth = image.naturalWidth * scale;
  const renderHeight = image.naturalHeight * scale;
  const offsetX = pan.x * canvas.width;
  const offsetY = pan.y * canvas.height;
  const left = (canvas.width - renderWidth) / 2 + offsetX;
  const top = (canvas.height - renderHeight) / 2 + offsetY;

  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = 'high';
  context.drawImage(image, left, top, renderWidth, renderHeight);

  const mimeType =
    format === 'jpeg' ? 'image/jpeg' : format === 'webp' ? 'image/webp' : 'image/png';

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Unable to export banner image.'));
          return;
        }

        resolve(blob);
      },
      mimeType,
      mimeType === 'image/png' ? undefined : clamp(quality / 100, 0.4, 0.95)
    );
  });
}

export default function ImageYoutubeBannerPage() {
  const stageRef = useRef(null);
  const imageRef = useRef(null);
  const dragStateRef = useRef(null);
  const stageSize = useElementSize(stageRef);

  const [file, setFile] = useState(null);
  const [imageInfo, setImageInfo] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [resultUrl, setResultUrl] = useState('');
  const [resultName, setResultName] = useState('');
  const [resultSize, setResultSize] = useState(0);
  const [previewUrl, setPreviewUrl] = useState('');
  const [format, setFormat] = useState('jpeg');
  const [fit, setFit] = useState('cover');
  const [quality, setQuality] = useState(82);
  const [zoom, setZoom] = useState(100);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    if (!file) {
      setPreviewUrl('');
      setImageInfo(null);
      return undefined;
    }

    let isMounted = true;

    loadImageInfo(file)
      .then((info) => {
        if (!isMounted) {
          URL.revokeObjectURL(info.url);
          return;
        }

        setPreviewUrl(info.url);
        setImageInfo({
          width: info.width,
          height: info.height
        });
      })
      .catch((loadError) => {
        if (isMounted) {
          setError(loadError instanceof Error ? loadError.message : 'Failed to load image.');
        }
      });

    return () => {
      isMounted = false;
    };
  }, [file]);

  useEffect(() => {
    return () => {
      if (resultUrl) {
        URL.revokeObjectURL(resultUrl);
      }
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [resultUrl, previewUrl]);

  const displayGeometry = useMemo(() => {
    if (!stageSize.width || !stageSize.height || !imageInfo) {
      return null;
    }

    const baseScale =
      fit === 'contain'
        ? Math.min(stageSize.width / imageInfo.width, stageSize.height / imageInfo.height)
        : Math.max(stageSize.width / imageInfo.width, stageSize.height / imageInfo.height);
    const scale = baseScale * (zoom / 100);
    const width = imageInfo.width * scale;
    const height = imageInfo.height * scale;
    const left = (stageSize.width - width) / 2 + pan.x * stageSize.width;
    const top = (stageSize.height - height) / 2 + pan.y * stageSize.height;

    return { width, height, left, top };
  }, [stageSize.width, stageSize.height, imageInfo, fit, zoom, pan]);

  const handlePointerDown = (event) => {
    if (!imageInfo || !stageSize.width || !stageSize.height) {
      return;
    }

    event.currentTarget.setPointerCapture(event.pointerId);
    dragStateRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startPan: pan
    };
    setDragging(true);
  };

  useEffect(() => {
    const onMove = (event) => {
      const dragState = dragStateRef.current;

      if (!dragState || dragState.pointerId !== event.pointerId || !stageSize.width || !stageSize.height) {
        return;
      }

      const deltaX = event.clientX - dragState.startX;
      const deltaY = event.clientY - dragState.startY;

      setPan({
        x: clamp(dragState.startPan.x + deltaX / stageSize.width, -0.75, 0.75),
        y: clamp(dragState.startPan.y + deltaY / stageSize.height, -0.75, 0.75)
      });
    };

    const onUp = (event) => {
      const dragState = dragStateRef.current;

      if (!dragState || dragState.pointerId !== event.pointerId) {
        return;
      }

      dragStateRef.current = null;
      setDragging(false);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);

    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, [stageSize.width, stageSize.height]);

  const handleExport = async (event) => {
    event.preventDefault();
    setError('');

    if (!file || !imageRef.current) {
      setError('Please choose an image first.');
      return;
    }

    setBusy(true);

    try {
      const blob = await renderBannerBlob(imageRef.current, {
        pan,
        fit,
        format,
        quality,
        transparentBackground: false
      });

      const url = URL.createObjectURL(blob);
      const extension = getExtension(format);

      setResultUrl(url);
      setResultName(`suduq-${getFileStem(file.name)}-youtube-banner.${extension}`);
      setResultSize(blob.size);
    } catch (exportError) {
      setError(exportError instanceof Error ? exportError.message : 'Something went wrong.');
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
    setPan({ x: 0, y: 0 });
    setZoom(100);
  };

  const handleCenter = () => {
    setPan({ x: 0, y: 0 });
  };

  return (
    <ToolShell
      categoryLabel="Creators tools"
      title="YouTube Banner"
      description="Drag your image into position, keep it inside YouTube's safe area, and export a banner-sized file."
      rightTitle="Banner canvas"
      rightDescription="This preview matches the 2048 x 1152 export, with the safe area shown on top."
      leftChildren={
        <form className="space-y-6" onSubmit={handleExport}>
          <label className="flex cursor-pointer flex-col gap-4 rounded-2xl border border-dashed bg-muted/25 p-6 transition-colors hover:bg-muted/50">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <Upload className="text-muted-foreground" size={26} />
                <div>
                  <span className="block font-medium">Upload banner art</span>
                  <span className="text-sm text-muted-foreground">
                    We will let you reposition the artwork inside the exact YouTube banner canvas.
                  </span>
                </div>
              </div>
              <Badge variant="secondary">2048 x 1152</Badge>
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
                setPan({ x: 0, y: 0 });
                setZoom(100);
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
              JPG and WEBP use this setting. PNG stays lossless, so it is usually the heaviest export.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="banner-zoom">Zoom</Label>
              <span className="text-xs text-muted-foreground">{zoom}%</span>
            </div>
            <Input
              id="banner-zoom"
              type="range"
              min={50}
              max={150}
              step={1}
              value={zoom}
              onChange={(event) => setZoom(Number(event.target.value))}
            />
            <p className="text-xs text-muted-foreground">
              Use this to crop in or out before exporting.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit" disabled={busy}>
              {busy ? <LoaderCircle className="animate-spin" size={16} /> : <ImageIcon size={16} />}
              {busy ? 'Exporting banner...' : 'Export banner'}
            </Button>
            <Button type="button" variant="outline" onClick={handleCenter} disabled={!file}>
              Center image
            </Button>
            <Button type="button" variant="outline" onClick={handleReset} disabled={!file && !resultUrl && !error}>
              <RotateCcw size={16} />
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
                  Safe area: {SAFE_WIDTH} x {SAFE_HEIGHT} px. The preview shows the exact banner canvas.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">6 MB max</Badge>
                <Badge variant="outline">{fit.toUpperCase()}</Badge>
                <Badge variant="outline">{format.toUpperCase()}</Badge>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border bg-slate-950">
              <div
                ref={stageRef}
                className={`relative aspect-[16/9] w-full ${file ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'}`}
                onPointerDown={handlePointerDown}
              >
                {imageInfo && previewUrl && displayGeometry ? (
                  <img
                    ref={imageRef}
                    src={previewUrl}
                    alt="Selected banner preview"
                    draggable="false"
                    className="absolute select-none"
                    style={{
                      width: `${displayGeometry.width}px`,
                      height: `${displayGeometry.height}px`,
                      left: `${displayGeometry.left}px`,
                      top: `${displayGeometry.top}px`
                    }}
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
                      Keep titles and faces inside this box
                    </div>
                  </div>
                  {dragging ? (
                    <div className="absolute left-4 top-4 rounded-full bg-black/70 px-3 py-1 text-xs text-white">
                      Dragging to reposition
                    </div>
                  ) : null}
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
                Exporting uses the exact composition you built in the preview.
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
                    This export is over 6 MB. Try JPG, WEBP, or a lower quality setting.
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
                  <p className="text-sm">Upload an image, drag it into place, then export the banner.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      }
    />
  );
}
