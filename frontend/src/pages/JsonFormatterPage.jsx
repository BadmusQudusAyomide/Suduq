import TextToolPage from '../components/TextToolPage';

export default function JsonFormatterPage() {
  return (
    <TextToolPage
      title="JSON Formatter & Validator"
      description="Format JSON with indentation and catch invalid syntax immediately."
      inputLabel="JSON"
      inputPlaceholder='{"name":"Suduq","owner":"Qudus"}'
      primaryActionLabel="Format JSON"
      secondaryActionLabel="Reset"
      outputLabel="Formatted JSON"
      outputDescription="Pretty-printed JSON appears in the tabs below."
      controls={[
        {
          name: 'indent',
          label: 'Indent size',
          type: 'select',
          defaultValue: '2',
          options: [
            { value: '2', label: '2 spaces' },
            { value: '4', label: '4 spaces' }
          ]
        }
      ]}
      onProcess={(input, controls) => {
        const parsed = JSON.parse(input);
        return JSON.stringify(parsed, null, Number(controls.indent || 2));
      }}
      tabs={[
        {
          value: 'pretty',
          label: 'Pretty',
          render: ({ result }) => (
            <pre className="overflow-auto rounded-lg border bg-muted/30 p-4 text-sm">
              {result || 'Run the formatter to see the result.'}
            </pre>
          )
        },
        {
          value: 'minified',
          label: 'Minified',
          render: ({ result }) => {
            if (!result) {
              return <p className="text-sm text-muted-foreground">Run the formatter first.</p>;
            }

            try {
              return (
                <pre className="overflow-auto rounded-lg border bg-muted/30 p-4 text-sm">
                  {JSON.stringify(JSON.parse(result))}
                </pre>
              );
            } catch {
              return <p className="text-sm text-muted-foreground">Invalid JSON output.</p>;
            }
          }
        }
      ]}
    />
  );
}
