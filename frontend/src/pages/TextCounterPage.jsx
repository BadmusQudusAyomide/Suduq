import TextToolPage from '../components/TextToolPage';
import { countText } from '../lib/text-utils';
import { Card, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

export default function TextCounterPage() {
  return (
    <TextToolPage
      title="Word / Character / Sentence Counter"
      description="Count the key text metrics instantly as you type."
      inputLabel="Text"
      liveOutput
      outputLabel="Live Metrics"
      outputDescription="Counts update instantly with the current text."
      onProcess={(input) => JSON.stringify(countText(input))}
      tabs={[
        {
          value: 'metrics',
          label: 'Metrics',
          render: ({ input }) => {
            const stats = countText(input);
            return (
              <div className="grid gap-3 sm:grid-cols-2">
                {Object.entries(stats).map(([label, value]) => (
                  <Card key={label}>
                    <CardHeader className="pb-2">
                      <CardDescription className="capitalize">{label.replace(/([A-Z])/g, ' $1')}</CardDescription>
                      <CardTitle className="text-2xl">{value}</CardTitle>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            );
          }
        },
        {
          value: 'raw',
          label: 'Raw',
          render: ({ input }) => (
            <pre className="overflow-auto rounded-lg border bg-muted/30 p-4 text-sm">
              {JSON.stringify(countText(input), null, 2)}
            </pre>
          )
        }
      ]}
    />
  );
}
