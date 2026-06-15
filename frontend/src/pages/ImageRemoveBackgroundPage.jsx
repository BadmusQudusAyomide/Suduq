import { useEffect, useState } from 'react';
import { Download, LoaderCircle, RefreshCcw, Upload } from 'lucide-react';
import BeforeAfterSlider from '../components/BeforeAfterSlider';
import { processImage } from '../lib/imageApi';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';

function formatFileSize(bytes) {
  if (!bytes && bytes !== 0) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function fileLabel(name) {
  return name.replace(/\.[^.]+$/, '');
}

export default function ImageRemoveBackgroundPage() {
  const [file, setFile] = useState(null);
  const [beforeUrl, setBeforeUrl] = useState('');
  const [afterUrl, setAfterUrl] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [resultName, setResultName] = useState('');

  useEffect(() => {
    if (!file) {
      setBeforeUrl('');
      return undefined;
    }

    const url = URL.createObjectURL(file);
    setBeforeUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  useEffect(() => {
    return () => {
      if (afterUrl) {
        URL.revokeObjectURL(afterUrl);
      }
    };
  }, [afterUrl]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!file) {
      setError('Please choose an image first.');
      return;
    }

    setBusy(true);

    try {
      const blob = await processImage('/api/images/remove-bg', file);
      const url = URL.createObjectURL(blob);
      setAfterUrl(url);
      setResultName(`suduq-${fileLabel(file.name)}-no-bg.png`);
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setBusy(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setBeforeUrl('');
    setAfterUrl('');
    setError('');
    setResultName('');
  };

  return (
    <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
      <Card>
        <CardHeader>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Image tools
          </p>
          <CardTitle>Background Remover</CardTitle>
          <CardDescription>
            Upload an image, remove the background, and compare before versus after.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <label className="flex cursor-pointer flex-col gap-4 rounded-2xl border border-dashed bg-muted/25 p-6 transition-colors hover:bg-muted/50">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <Upload className="text-muted-foreground" size={26} />
                  <div>
                    <span className="block font-medium">Upload an image</span>
                    <span className="text-sm text-muted-foreground">
                      JPG, PNG, WEBP. Best with clean foreground edges.
                    </span>
                  </div>
                </div>
                <Badge variant="secondary">Client preview</Badge>
              </div>

              <Input
                className="hidden"
                type="file"
                accept="image/*"
                onChange={(event) => {
                  const next = event.target.files?.[0] ?? null;
                  setFile(next);
                  setError('');
                  setAfterUrl('');
                  setResultName('');
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

            {beforeUrl ? (
              <div className="space-y-3 rounded-2xl border bg-background p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">Uploaded preview</p>
                    <p className="text-xs text-muted-foreground">This is the file currently loaded for processing.</p>
                  </div>
                  <Badge variant="secondary">Ready</Badge>
                </div>
                <div className="overflow-hidden rounded-xl border bg-muted/20">
                  <img
                    src={beforeUrl}
                    alt={file ? `Uploaded preview of ${file.name}` : 'Uploaded preview'}
                    className="h-56 w-full object-contain"
                  />
                </div>
              </div>
            ) : null}

            <div className="flex flex-wrap items-center gap-3">
              <Button type="submit" disabled={busy}>
                {busy ? <LoaderCircle className="animate-spin" size={16} /> : <Upload size={16} />}
                {busy ? 'Removing background...' : 'Remove background'}
              </Button>
              <Button type="button" variant="outline" onClick={handleReset} disabled={!file && !afterUrl && !error}>
                <RefreshCcw size={16} />
                Reset
              </Button>
              {error ? <p className="text-sm text-destructive">{error}</p> : null}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Before / After</CardTitle>
          <CardDescription>
            Drag the slider or use the buttons to compare the original image with the cutout.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {beforeUrl && afterUrl ? (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-background px-4 py-3">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">Background removed</p>
                  <p className="text-xs text-muted-foreground">
                    Original image on the left, cutout on the right.
                  </p>
                </div>
                <Badge variant="secondary">Processed</Badge>
              </div>

              <BeforeAfterSlider
                before={beforeUrl}
                after={afterUrl}
                alt="Background removal comparison"
                beforeLabel="Original"
                afterLabel="Cutout"
              />

              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Original: {file?.name || 'image'}</Badge>
                <Badge variant="outline">Output: {resultName || 'suduq-output.png'}</Badge>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <a
                  href={afterUrl}
                  download={resultName}
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground"
                >
                  <Download size={16} />
                  Download result
                </a>
                <Button type="button" variant="outline" onClick={handleReset}>
                  <RefreshCcw size={16} />
                  Try another image
                </Button>
              </div>
            </>
          ) : (
            <div className="grid min-h-56 place-items-center rounded-lg border border-dashed bg-muted/25 text-center text-muted-foreground">
              <div className="space-y-2">
                <p className="font-medium text-foreground">No image processed yet</p>
                <p className="text-sm text-muted-foreground">
                  Upload an image on the left and we’ll show the cutout here.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
