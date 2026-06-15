import { useState } from 'react';
import { Copy, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Textarea } from '../components/ui/textarea';

export default function ImageBase64Page() {
  const [value, setValue] = useState('');
  const [copied, setCopied] = useState(false);

  const handleFile = (file) => {
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setValue(String(reader.result || ''));
    reader.readAsDataURL(file);
  };

  const copyValue = async () => {
    if (!value) {
      return;
    }

    await navigator.clipboard.writeText(value);
    setCopied(true);
    toast.success('Base64 copied to clipboard');
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <section className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
      <Card>
        <CardHeader>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Image tools
          </p>
          <CardTitle>Image to Base64</CardTitle>
          <CardDescription>
            Convert a local image to a Base64 string for previews, embeds, and quick testing.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed bg-muted/30 px-6 py-10 text-center transition-colors hover:bg-muted/60">
            <Upload className="mb-3 text-muted-foreground" size={26} />
            <span className="font-medium">Choose an image</span>
            <input
              className="hidden"
              type="file"
              accept="image/*"
              onChange={(event) => handleFile(event.target.files?.[0] ?? null)}
            />
          </label>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle className="text-lg">Base64 output</CardTitle>
              <CardDescription>Copy or reuse the generated data URL.</CardDescription>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={copyValue} disabled={!value}>
              <Copy size={14} />
              {copied ? 'Copied' : 'Copy'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Textarea
            readOnly
            value={value}
            placeholder="The Base64 string will appear here."
            className="min-h-[22rem] text-xs leading-6"
          />
        </CardContent>
      </Card>
    </section>
  );
}
