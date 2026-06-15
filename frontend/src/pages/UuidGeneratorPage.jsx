import { useState } from 'react';
import { Copy, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Textarea } from '../components/ui/textarea';
import { generateUuid } from '../lib/text-utils';

export default function UuidGeneratorPage() {
  const [value, setValue] = useState(generateUuid());

  const regenerate = () => {
    setValue(generateUuid());
  };

  const copy = async () => {
    await navigator.clipboard.writeText(value);
    toast.success('UUID copied to clipboard');
  };

  return (
    <section className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
      <Card>
        <CardHeader>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">Text tools</p>
          <CardTitle>UUID Generator</CardTitle>
          <CardDescription>Generate a version 4 UUID in one click.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button type="button" onClick={regenerate}>
            <RefreshCw size={16} />
            Generate UUID
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle className="text-lg">UUID output</CardTitle>
              <CardDescription>Copy the generated identifier or make a new one.</CardDescription>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={copy}>
              <Copy size={14} />
              Copy
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Textarea readOnly value={value} className="min-h-[180px] text-lg font-mono" />
        </CardContent>
      </Card>
    </section>
  );
}
