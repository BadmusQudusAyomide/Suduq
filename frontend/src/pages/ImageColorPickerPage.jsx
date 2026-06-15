import { useEffect, useMemo, useRef, useState } from 'react';
import { Copy, Upload, Pipette } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';

function rgbToHex(r, g, b) {
  return `#${[r, g, b]
    .map((value) => value.toString(16).padStart(2, '0'))
    .join('')}`;
}

function formatRgb(color) {
  return `rgb(${color.r}, ${color.g}, ${color.b})`;
}

function extractPalette(imageData, limit = 6) {
  const buckets = new Map();
  const { data } = imageData;

  for (let index = 0; index < data.length; index += 4) {
    const alpha = data[index + 3];
    if (alpha < 32) {
      continue;
    }

    const r = Math.round(data[index] / 32) * 32;
    const g = Math.round(data[index + 1] / 32) * 32;
    const b = Math.round(data[index + 2] / 32) * 32;
    const key = `${r},${g},${b}`;
    buckets.set(key, (buckets.get(key) || 0) + 1);
  }

  return [...buckets.entries()]
    .sort((left, right) => right[1] - left[1])
    .slice(0, limit)
    .map(([key, count]) => {
      const [r, g, b] = key.split(',').map(Number);
      return {
        hex: rgbToHex(r, g, b),
        rgb: { r, g, b },
        count
      };
    });
}

export default function ImageColorPickerPage() {
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [selectedColor, setSelectedColor] = useState(null);
  const [palette, setPalette] = useState([]);
  const [copied, setCopied] = useState('');

  useEffect(() => {
    if (!file) {
      setPreviewUrl('');
      setPalette([]);
      setSelectedColor(null);
      return undefined;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  const loadImage = (url) => {
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) {
        return;
      }

      const context = canvas.getContext('2d', { willReadFrequently: true });
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(img, 0, 0);

      try {
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        setPalette(extractPalette(imageData));
      } catch (error) {
        setPalette([]);
      }
    };
    img.src = url;
    imageRef.current = img;
  };

  useEffect(() => {
    if (previewUrl) {
      loadImage(previewUrl);
    }
  }, [previewUrl]);

  const sampleColor = (event) => {
    const canvas = canvasRef.current;
    const image = imageRef.current;

    if (!canvas || !image) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = Math.floor((event.clientX - rect.left) * scaleX);
    const y = Math.floor((event.clientY - rect.top) * scaleY);
    const context = canvas.getContext('2d', { willReadFrequently: true });
    const pixels = context.getImageData(x, y, 1, 1).data;

    if (!pixels.length || pixels[3] === 0) {
      return;
    }

    setSelectedColor({
      hex: rgbToHex(pixels[0], pixels[1], pixels[2]),
      rgb: { r: pixels[0], g: pixels[1], b: pixels[2] }
    });
  };

  const copyValue = async (value) => {
    await navigator.clipboard.writeText(value);
    setCopied(value);
    toast.success('Color copied to clipboard');
    window.setTimeout(() => setCopied(''), 1200);
  };

  const summary = useMemo(() => {
    if (!selectedColor) {
      return null;
    }

    return {
      hex: selectedColor.hex.toUpperCase(),
      rgb: formatRgb(selectedColor.rgb)
    };
  }, [selectedColor]);

  return (
    <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
      <Card>
        <CardHeader>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Image tools
          </p>
          <CardTitle>Color Picker from Image</CardTitle>
          <CardDescription>
            Upload an image, click any pixel, and pull out a useful palette.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed bg-muted/30 px-6 py-10 text-center transition-colors hover:bg-muted/60">
            <Upload className="mb-3 text-muted-foreground" size={26} />
            <span className="font-medium">Upload an image</span>
            <span className="mt-1 text-sm text-muted-foreground">Click the preview to sample a color</span>
            <Input
              className="hidden"
              type="file"
              accept="image/*"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            />
          </label>

          <div className="rounded-xl border bg-muted/20 p-3">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Uploaded preview"
                onClick={sampleColor}
                className="max-h-[420px] w-full cursor-crosshair rounded-lg border object-contain"
              />
            ) : (
              <div className="grid min-h-[320px] place-items-center rounded-lg border border-dashed bg-background text-sm text-muted-foreground">
                Your image preview will appear here
              </div>
            )}
          </div>
          <canvas ref={canvasRef} className="hidden" />
        </CardContent>
      </Card>

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Selected color</CardTitle>
            <CardDescription>Click the image to sample a pixel color.</CardDescription>
          </CardHeader>
          <CardContent>
            {summary ? (
              <div className="space-y-4">
                <div
                  className="h-36 rounded-xl border"
                  style={{ backgroundColor: summary.hex }}
                />
                <div className="space-y-2 text-sm">
                  <p className="font-medium">HEX: {summary.hex}</p>
                  <p className="text-muted-foreground">RGB: {summary.rgb}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={() => copyValue(summary.hex)}>
                    <Copy size={14} />
                    {copied === summary.hex ? 'Copied' : 'Copy HEX'}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => copyValue(summary.rgb)}>
                    <Copy size={14} />
                    {copied === summary.rgb ? 'Copied' : 'Copy RGB'}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid min-h-56 place-items-center rounded-lg border border-dashed bg-muted/30 text-muted-foreground">
                <div className="text-center">
                  <Pipette className="mx-auto mb-3" size={26} />
                  <p>No color sampled yet</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Palette</CardTitle>
            <CardDescription>Approximate dominant colors extracted from the image.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {palette.length ? (
              palette.map((color) => (
                <button
                  key={color.hex}
                  type="button"
                  onClick={() => copyValue(color.hex)}
                  className="flex items-center gap-3 rounded-lg border p-2 text-left transition-colors hover:bg-muted/40"
                >
                  <span
                    className="h-12 w-12 shrink-0 rounded-md border"
                    style={{ backgroundColor: color.hex }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{color.hex}</p>
                    <p className="text-xs text-muted-foreground">{formatRgb(color.rgb)}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{color.count}</span>
                </button>
              ))
            ) : (
              <div className="grid min-h-40 place-items-center rounded-lg border border-dashed bg-muted/30 text-sm text-muted-foreground">
                Palette will appear after you upload an image
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
