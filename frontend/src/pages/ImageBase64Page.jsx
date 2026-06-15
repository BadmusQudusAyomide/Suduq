import { useState } from 'react';
import { Copy, Upload } from 'lucide-react';
import { toast } from 'sonner';
import ToolShell from '../components/ToolShell';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { getImageSpecialPageConfig } from '../lib/tool-page-configs';
import { copyText, readFileAsDataUrl } from '../lib/tool-utils';

const config = getImageSpecialPageConfig('base64');

export default function ImageBase64Page() {
  const [value, setValue] = useState('');
  const [copied, setCopied] = useState(false);

  const handleFile = (file) => {
    if (!file) {
      return;
    }

    readFileAsDataUrl(file)
      .then(setValue)
      .catch(() => {});
  };

  const copyValue = async () => {
    if (!value) {
      return;
    }

    await copyText(value);
    setCopied(true);
    toast.success('Base64 copied to clipboard');
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <ToolShell
      categoryLabel="Image tools"
      title={config.title}
      description={config.description}
      rightTitle={config.rightTitle}
      rightDescription={config.rightDescription}
      rightHeaderAction={
        <Button type="button" variant="outline" size="sm" onClick={copyValue} disabled={!value}>
          <Copy size={14} />
          {copied ? 'Copied' : 'Copy'}
        </Button>
      }
      leftChildren={
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed bg-muted/30 px-6 py-10 text-center transition-colors hover:bg-muted/60">
          <Upload className="mb-3 text-muted-foreground" size={26} />
          <span className="font-medium">Choose an image</span>
          <span className="mt-1 text-sm text-muted-foreground">The file will convert to a data URL instantly.</span>
          <input
            className="hidden"
            type="file"
            accept="image/*"
            onChange={(event) => handleFile(event.target.files?.[0] ?? null)}
          />
        </label>
      }
      rightChildren={
        <Textarea
          readOnly
          value={value}
          placeholder="The Base64 string will appear here."
          className="min-h-[22rem] text-xs leading-6"
        />
      }
    />
  );
}
