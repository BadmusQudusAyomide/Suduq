import { useMemo, useState } from 'react';
import { Copy, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import ToolShell from './ToolShell';

function isValidHandler(handler) {
  return typeof handler === 'function';
}

export default function TextToolPage({
  title,
  description,
  initialInput = '',
  inputLabel = 'Input',
  inputPlaceholder = 'Type or paste your text here...',
  controls = [],
  primaryActionLabel = 'Process',
  secondaryActionLabel = 'Reset',
  onProcess,
  onReset,
  tabs,
  liveOutput = false,
  outputLabel = 'Output',
  outputDescription = 'Result',
  formatOutput
}) {
  const [input, setInput] = useState(initialInput);
  const [controlValues, setControlValues] = useState(
    controls.reduce((acc, control) => {
      acc[control.name] = control.defaultValue ?? '';
      return acc;
    }, {})
  );
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const derivedOutput = useMemo(() => {
    if (!liveOutput || !isValidHandler(onProcess)) {
      return result;
    }

    try {
      return String(onProcess(input, controlValues) ?? '');
    } catch (err) {
      return '';
    }
  }, [controlValues, input, liveOutput, onProcess, result]);

  const handleControlChange = (name, value) => {
    setControlValues((current) => ({ ...current, [name]: value }));
  };

  const handleProcess = () => {
    setError('');

    if (!isValidHandler(onProcess)) {
      return;
    }

    try {
      const next = onProcess(input, controlValues);
      if (next instanceof Promise) {
        next
          .then((value) => {
            setResult(String(value ?? ''));
          })
          .catch((err) => {
            setError(err.message || 'Something went wrong.');
          });
        return;
      }

      setResult(String(next ?? ''));
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    }
  };

  const handleReset = () => {
    setInput(initialInput);
    setControlValues(
      controls.reduce((acc, control) => {
        acc[control.name] = control.defaultValue ?? '';
        return acc;
      }, {})
    );
    setResult('');
    setError('');
    if (isValidHandler(onReset)) {
      onReset();
    }
  };

  const copyResult = async () => {
    const value = liveOutput ? derivedOutput : result;
    if (!value) {
      return;
    }

    await navigator.clipboard.writeText(value);
    setCopied(true);
    toast.success('Copied to clipboard');
    window.setTimeout(() => setCopied(false), 1200);
  };

  const outputValue = liveOutput ? derivedOutput : result;
  const formattedOutput = formatOutput ? formatOutput(outputValue) : outputValue;

  return (
    <ToolShell
      categoryLabel="Text tools"
      title={title}
      description={description}
      rightTitle={outputLabel}
      rightDescription={outputDescription}
      rightHeaderAction={
        <Button type="button" variant="outline" size="sm" onClick={copyResult} disabled={!outputValue}>
          <Copy size={14} />
          {copied ? 'Copied' : 'Copy'}
        </Button>
      }
      leftChildren={
        <form className="space-y-6" onSubmit={(event) => event.preventDefault()}>
          <div className="space-y-2">
            <Label htmlFor="tool-input">{inputLabel}</Label>
            <Textarea
              id="tool-input"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={inputPlaceholder}
              className="min-h-[260px]"
            />
          </div>

          {controls.length ? (
            <div className="grid gap-4 md:grid-cols-2">
              {controls.map((control) => (
                <div key={control.name} className="space-y-2">
                  <Label htmlFor={control.name}>{control.label}</Label>
                  {control.type === 'select' ? (
                    <select
                      id={control.name}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={controlValues[control.name]}
                      onChange={(event) => handleControlChange(control.name, event.target.value)}
                    >
                      {control.options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : control.type === 'checkbox' ? (
                    <label className="flex items-center gap-2 rounded-md border bg-muted/20 px-3 py-2 text-sm">
                      <input
                        type="checkbox"
                        checked={Boolean(controlValues[control.name])}
                        onChange={(event) => handleControlChange(control.name, event.target.checked)}
                        className="h-4 w-4 rounded border-input"
                      />
                      <span>{control.checkboxLabel || control.label}</span>
                    </label>
                  ) : (
                    <Input
                      id={control.name}
                      type={control.type || 'text'}
                      min={control.min}
                      max={control.max}
                      step={control.step}
                      value={controlValues[control.name]}
                      onChange={(event) => handleControlChange(control.name, event.target.value)}
                      placeholder={control.placeholder}
                    />
                  )}
                </div>
              ))}
            </div>
          ) : null}

          <div className="flex flex-wrap gap-3">
            {!liveOutput ? (
              <Button type="button" onClick={handleProcess}>
                <RefreshCw size={16} />
                {primaryActionLabel}
              </Button>
            ) : null}
            <Button type="button" variant="outline" onClick={handleReset}>
              {secondaryActionLabel}
            </Button>
          </div>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}
        </form>
      }
      rightChildren={
        tabs?.length ? (
          <Tabs defaultValue={tabs[0].value} className="space-y-4">
            <TabsList>
              {tabs.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {tabs.map((tab) => (
              <TabsContent key={tab.value} value={tab.value}>
                {tab.render({ input, result: outputValue, controlValues })}
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <Textarea
            readOnly
            value={formattedOutput}
            placeholder="The result will appear here."
            className="min-h-[360px] text-sm leading-6"
          />
        )
      }
    />
  );
}
