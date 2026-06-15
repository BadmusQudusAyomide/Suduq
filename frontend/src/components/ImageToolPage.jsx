import { useEffect, useState } from 'react';
import { Upload, Download, Image as ImageIcon, LoaderCircle } from 'lucide-react';
import { processImage } from '../lib/imageApi';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import ToolShell from './ToolShell';

export default function ImageToolPage({
  title,
  description,
  endpoint,
  actionLabel,
  fields,
  onBuildFields
}) {
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [resultUrl, setResultUrl] = useState('');
  const [resultName, setResultName] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const initialState = fields.reduce((acc, field) => {
    acc[field.name] = field.defaultValue ?? '';
    return acc;
  }, {});
  const [values, setValues] = useState(initialState);

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

  const updateValue = (name, value) => {
    setValues((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!file) {
      setError('Please choose an image first.');
      return;
    }

    setBusy(true);

    try {
      const payload = onBuildFields ? onBuildFields(values) : values;
      const blob = await processImage(endpoint, file, payload);
      const url = URL.createObjectURL(blob);
      const extension = blob.type === 'image/jpeg' ? 'jpg' : blob.type === 'image/png' ? 'png' : 'webp';
      setResultUrl(url);
      setResultName(`suduq-${title.toLowerCase().replace(/\s+/g, '-')}.${extension}`);
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <ToolShell
      categoryLabel="Image tools"
      title={title}
      description={description}
      rightTitle="Preview and output"
      rightDescription="See the input file before processing and download the result after it is generated."
      leftChildren={
        <form className="space-y-6" onSubmit={handleSubmit}>
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed bg-muted/30 px-6 py-10 text-center transition-colors hover:bg-muted/60">
            <Upload className="mb-3 text-muted-foreground" size={26} />
            <span className="font-medium">Upload an image</span>
            <span className="mt-1 text-sm text-muted-foreground">PNG, JPG, WEBP, and more</span>
            <input
              className="hidden"
              type="file"
              accept="image/*"
              onChange={(event) => {
                const next = event.target.files?.[0] ?? null;
                setFile(next);
                setError('');
                setResultUrl('');
                setResultName('');
              }}
            />
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            {fields.map((field) => (
              <div key={field.name} className="space-y-2">
                <Label htmlFor={field.name}>{field.label}</Label>
                {field.type === 'select' ? (
                  <select
                    id={field.name}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={values[field.name]}
                    onChange={(event) => updateValue(field.name, event.target.value)}
                  >
                    {field.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <Input
                    id={field.name}
                    type={field.type || 'text'}
                    min={field.min}
                    max={field.max}
                    step={field.step}
                    value={values[field.name]}
                    onChange={(event) => updateValue(field.name, event.target.value)}
                    placeholder={field.placeholder}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit" disabled={busy}>
              {busy ? <LoaderCircle className="animate-spin" size={16} /> : <ImageIcon size={16} />}
              {busy ? 'Processing...' : actionLabel}
            </Button>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
          </div>
        </form>
      }
      rightChildren={
        <div className="grid gap-4">
          <div className="rounded-lg border bg-background p-4">
            <div className="mb-3">
              <p className="text-sm font-medium">Preview</p>
              <p className="text-sm text-muted-foreground">See the input file before processing.</p>
            </div>
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Selected preview"
                className="max-h-72 w-full rounded-lg border object-contain"
              />
            ) : (
              <div className="grid min-h-56 place-items-center rounded-lg border border-dashed bg-muted/30 text-muted-foreground">
                <div className="text-center">
                  <ImageIcon className="mx-auto mb-3" size={26} />
                  <p>No image selected yet</p>
                </div>
              </div>
            )}
          </div>

          <div className="rounded-lg border bg-background p-4">
            <div className="mb-3">
              <p className="text-sm font-medium">Output</p>
              <p className="text-sm text-muted-foreground">Download the processed result after it is generated.</p>
            </div>
            {resultUrl ? (
              <div className="space-y-4">
                <img
                  src={resultUrl}
                  alt="Processed output"
                  className="max-h-72 w-full rounded-lg border object-contain"
                />
                <Button asChild variant="outline" className="w-full">
                  <a href={resultUrl} download={resultName}>
                    <Download size={16} />
                    Download result
                  </a>
                </Button>
              </div>
            ) : (
              <div className="grid min-h-56 place-items-center rounded-lg border border-dashed bg-muted/30 text-muted-foreground">
                Processed output will appear here
              </div>
            )}
          </div>
        </div>
      }
    />
  );
}
