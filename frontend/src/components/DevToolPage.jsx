import { useMemo, useState } from 'react';
import { Copy, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import ToolShell from './ToolShell';

function isHandler(value) {
  return typeof value === 'function';
}

function serializeValue(value) {
  if (value === null || value === undefined) {
    return '';
  }

  if (typeof value === 'string') {
    return value;
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  return JSON.stringify(value, null, 2);
}

function buildInitialValues(fields = []) {
  return fields.reduce((acc, field) => {
    const value = typeof field.defaultValue === 'function' ? field.defaultValue() : field.defaultValue;
    acc[field.name] = value ?? (field.type === 'checkbox' ? false : '');
    return acc;
  }, {});
}

export default function DevToolPage({
  categoryLabel = 'Dev tools',
  title,
  description,
  fields = [],
  onProcess,
  onReset,
  liveOutput = true,
  outputLabel = 'Result',
  outputDescription = 'Output',
  primaryActionLabel = 'Process',
  secondaryActionLabel = 'Reset',
  renderOutput,
  formatOutput,
  copyValue
}) {
  const [values, setValues] = useState(() => buildInitialValues(fields));
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const computedResult = useMemo(() => {
    if (!liveOutput || !isHandler(onProcess)) {
      return result;
    }

    try {
      return onProcess(values);
    } catch (nextError) {
      return nextError;
    }
  }, [liveOutput, onProcess, result, values]);

  const computedError = computedResult instanceof Error ? computedResult.message : error;
  const outputValue = computedResult instanceof Error ? null : computedResult;
  const outputText = serializeValue(outputValue);
  const formattedOutput = formatOutput ? formatOutput(outputText, outputValue, values) : outputText;
  const copyText = copyValue ? copyValue({ result: outputValue, text: formattedOutput, values }) : outputText;
  const canCopy = copyText !== null && copyText !== undefined && String(copyText) !== '';

  const handleChange = (name, value) => {
    setValues((current) => ({ ...current, [name]: value }));
  };

  const handleProcess = () => {
    setError('');

    if (!isHandler(onProcess)) {
      return;
    }

    try {
      const next = onProcess(values);

      if (next instanceof Promise) {
        next
          .then((value) => {
            setResult(value);
          })
          .catch((nextError) => {
            setError(nextError.message || 'Something went wrong.');
          });
        return;
      }

      setResult(next);
    } catch (nextError) {
      setError(nextError.message || 'Something went wrong.');
    }
  };

  const handleReset = () => {
    setValues(buildInitialValues(fields));
    setResult(null);
    setError('');

    if (isHandler(onReset)) {
      onReset();
    }
  };

  const copyResult = async () => {
    if (!canCopy) {
      return;
    }

    await navigator.clipboard.writeText(String(copyText));
    setCopied(true);
    toast.success('Copied to clipboard');
    window.setTimeout(() => setCopied(false), 1200);
  };

  return (
    <ToolShell
      categoryLabel={categoryLabel}
      title={title}
      description={description}
      rightTitle={outputLabel}
      rightDescription={outputDescription}
      rightHeaderAction={
        <Button type="button" variant="outline" size="sm" onClick={copyResult} disabled={!canCopy}>
          <Copy size={14} />
          {copied ? 'Copied' : 'Copy'}
        </Button>
      }
      leftChildren={
        <form className="space-y-6" onSubmit={(event) => event.preventDefault()}>
          <div className="grid gap-4 md:grid-cols-2">
            {fields.map((field) => {
              const spanClass = field.fullWidth ? 'md:col-span-2' : '';

              return (
                <div key={field.name} className={`space-y-2 ${spanClass}`}>
                  <Label htmlFor={field.name}>{field.label}</Label>

                  {field.type === 'textarea' ? (
                    <Textarea
                      id={field.name}
                      rows={field.rows || 8}
                      value={values[field.name]}
                      onChange={(event) => handleChange(field.name, event.target.value)}
                      placeholder={field.placeholder}
                      className={field.className}
                    />
                  ) : field.type === 'select' ? (
                    <select
                      id={field.name}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={values[field.name]}
                      onChange={(event) => handleChange(field.name, event.target.value)}
                    >
                      {field.options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : field.type === 'checkbox' ? (
                    <label className="flex items-center gap-2 rounded-md border bg-muted/20 px-3 py-2 text-sm">
                      <input
                        type="checkbox"
                        checked={Boolean(values[field.name])}
                        onChange={(event) => handleChange(field.name, event.target.checked)}
                        className="h-4 w-4 rounded border-input"
                      />
                      <span>{field.checkboxLabel || field.label}</span>
                    </label>
                  ) : (
                    <Input
                      id={field.name}
                      type={field.type || 'text'}
                      min={field.min}
                      max={field.max}
                      step={field.step}
                      value={values[field.name]}
                      onChange={(event) => handleChange(field.name, event.target.value)}
                      placeholder={field.placeholder}
                      className={field.className}
                    />
                  )}
                </div>
              );
            })}
          </div>

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

          {error || computedError ? (
            <p className="text-sm text-destructive">{error || computedError}</p>
          ) : null}
        </form>
      }
      rightChildren={
        renderOutput ? (
          renderOutput({ result: outputValue, text: formattedOutput, values, error: error || computedError })
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
