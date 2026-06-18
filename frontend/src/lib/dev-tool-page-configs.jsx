import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import {
  beautifyCss,
  convertIntegerBases,
  decodeHtml,
  diffLines,
  encodeHtml,
  explainCronExpression,
  formatColorSummary,
  markdownToHtml,
  minifyCss,
  parseColorInput,
  parseTimestampInput,
  summarizeJwt,
  describeRegex
} from './dev-utils';

function codeBlock(text) {
  return <pre className="overflow-auto rounded-lg border bg-muted/30 p-4 text-sm leading-6">{text}</pre>;
}

function summaryCard(label, value) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-lg">{value}</CardTitle>
      </CardHeader>
    </Card>
  );
}

function renderKeyValueList(items) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map(([label, value]) => (
        <Card key={label}>
          <CardHeader className="pb-2">
            <CardDescription>{label}</CardDescription>
            <CardTitle className="text-lg break-all">{value}</CardTitle>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}

function renderDiffLines(result) {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        {summaryCard('Added lines', result.additions)}
        {summaryCard('Removed lines', result.removals)}
        {summaryCard('Shared lines', result.unchanged)}
      </div>
      <pre className="overflow-auto rounded-lg border bg-muted/30 p-4 text-sm leading-6">
        {result.unified}
      </pre>
    </div>
  );
}

function renderColorOutput(result) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-[140px_1fr]">
        <div className="h-36 rounded-xl border shadow-sm" style={{ backgroundColor: result.hex }} />
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{result.hex}</Badge>
            <Badge variant="outline">{result.rgbText}</Badge>
            <Badge variant="outline">{result.hslText}</Badge>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {summaryCard('HEX', result.hex)}
            {summaryCard('RGB', result.rgbText)}
            {summaryCard('HSL', result.hslText)}
            {summaryCard('Lightness', `${result.hsl.l}%`)}
          </div>
        </div>
      </div>
    </div>
  );
}

function formatPrefixedBase(prefix, value) {
  const text = String(value);
  return text.startsWith('-') ? `-${prefix}${text.slice(1)}` : `${prefix}${text}`;
}

export const devToolPageConfigs = {
  regex: {
    title: 'Regex Tester',
    description: 'Write a pattern, set the flags, and inspect matches as you type.',
    fields: [
      {
        name: 'pattern',
        label: 'Pattern',
        type: 'text',
        defaultValue: '^[a-z0-9_-]+$',
        placeholder: 'Enter a regex pattern'
      },
      {
        name: 'flags',
        label: 'Flags',
        type: 'text',
        defaultValue: 'gi',
        placeholder: 'gim'
      },
      {
        name: 'replacement',
        label: 'Replacement',
        type: 'text',
        defaultValue: '',
        placeholder: 'Optional replacement text'
      },
      {
        name: 'input',
        label: 'Test text',
        type: 'textarea',
        rows: 10,
        defaultValue: 'alpha\nbeta\nAlpha_01',
        placeholder: 'Paste text to test against the pattern',
        fullWidth: true
      }
    ],
    outputLabel: 'Regex result',
    outputDescription: 'Matches, capture groups, and replacements appear here.',
    renderOutput: ({ result }) => {
      if (!result) {
        return <p className="text-sm text-muted-foreground">Write a pattern to see the result.</p>;
      }

      return (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            {summaryCard('Matches', result.matches.length)}
            {summaryCard('Test result', result.test ? 'Matched' : 'No match')}
          </div>
          <div className="space-y-3">
            {result.matches.length ? (
              result.matches.map((match, index) => (
                <Card key={`${match.index}-${index}`}>
                  <CardHeader className="pb-2">
                    <CardDescription>Match {index + 1}</CardDescription>
                    <CardTitle className="text-base break-all">{match.match}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-muted-foreground">
                    <p>Index: {match.index}</p>
                    {match.groups.length ? <p>Groups: {JSON.stringify(match.groups)}</p> : null}
                    {Object.keys(match.namedGroups).length ? (
                      <pre className="overflow-auto rounded-md border bg-muted/30 p-3 text-xs text-foreground">
                        {JSON.stringify(match.namedGroups, null, 2)}
                      </pre>
                    ) : null}
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No matches found.</p>
            )}
          </div>
          {result.replaced ? (
            <div className="space-y-2">
              <p className="text-sm font-medium">Replacement</p>
              {codeBlock(result.replaced)}
            </div>
          ) : null}
        </div>
      );
    },
    onProcess: ({ pattern, flags, input, replacement }) => {
      const normalizedFlags = String(flags || '').replace(/[^dgimsuvy]/g, '');
      return describeRegex(pattern, normalizedFlags, input, replacement);
    }
  },
  jwt: {
    title: 'JWT Decoder',
    description: 'Decode the header and payload of a JSON Web Token without verifying the signature.',
    fields: [
      {
        name: 'token',
        label: 'JWT',
        type: 'textarea',
        rows: 10,
        defaultValue:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjMiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MTg1MDQwMDB9.signature',
        placeholder: 'Paste a JWT here',
        fullWidth: true
      }
    ],
    outputLabel: 'Decoded JWT',
    outputDescription: 'Read the decoded payload and key metadata.',
    renderOutput: ({ result }) => {
      if (!result) {
        return <p className="text-sm text-muted-foreground">Paste a token to inspect it.</p>;
      }

      return (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            {summaryCard('Signature length', result.signatureLength)}
            {summaryCard('Issued at', result.issuedAt || 'n/a')}
            {summaryCard('Expires at', result.expiresAt || 'n/a')}
          </div>
          <Tabs defaultValue="header" className="space-y-4">
            <TabsList>
              <TabsTrigger value="header">Header</TabsTrigger>
              <TabsTrigger value="payload">Payload</TabsTrigger>
              <TabsTrigger value="signature">Signature</TabsTrigger>
            </TabsList>
            <TabsContent value="header">{codeBlock(JSON.stringify(result.header, null, 2))}</TabsContent>
            <TabsContent value="payload">{codeBlock(JSON.stringify(result.payload, null, 2))}</TabsContent>
            <TabsContent value="signature">{codeBlock(result.signature)}</TabsContent>
          </Tabs>
        </div>
      );
    },
    onProcess: ({ token }) => summarizeJwt(token)
  },
  color: {
    title: 'Color Converter',
    description: 'Switch between HEX, RGB, and HSL with a live preview swatch.',
    fields: [
      {
        name: 'value',
        label: 'Color value',
        type: 'text',
        defaultValue: '#4f46e5',
        placeholder: '#4f46e5'
      },
      {
        name: 'inputFormat',
        label: 'Input format',
        type: 'select',
        defaultValue: 'auto',
        options: [
          { value: 'auto', label: 'Auto detect' },
          { value: 'hex', label: 'HEX' },
          { value: 'rgb', label: 'RGB' },
          { value: 'hsl', label: 'HSL' }
        ]
      }
    ],
    outputLabel: 'Converted color',
    outputDescription: 'Preview the color and copy the representation you need.',
    renderOutput: ({ result }) => {
      if (!result) {
        return <p className="text-sm text-muted-foreground">Enter a color value to see the conversion.</p>;
      }

      return renderColorOutput(result);
    },
    onProcess: ({ value, inputFormat }) => formatColorSummary(parseColorInput(value, inputFormat)),
    copyValue: ({ result }) => result?.hex || ''
  },
  diff: {
    title: 'Diff Checker',
    description: 'Compare two text blocks and see what changed line by line.',
    fields: [
      {
        name: 'left',
        label: 'Original text',
        type: 'textarea',
        rows: 12,
        defaultValue: 'const status = "draft";\nconsole.log(status);',
        placeholder: 'Paste the first block here'
      },
      {
        name: 'right',
        label: 'Updated text',
        type: 'textarea',
        rows: 12,
        defaultValue: 'const status = "published";\nconsole.log(status);\nconsole.log("saved");',
        placeholder: 'Paste the second block here'
      }
    ],
    outputLabel: 'Diff result',
    outputDescription: 'Added, removed, and shared lines are summarized here.',
    renderOutput: ({ result }) => {
      if (!result) {
        return <p className="text-sm text-muted-foreground">Paste both sides to compare them.</p>;
      }

      return renderDiffLines(result);
    },
    onProcess: ({ left, right }) => diffLines(left, right),
    copyValue: ({ result }) => result?.unified || ''
  },
  markdown: {
    title: 'Markdown Previewer',
    description: 'Write Markdown on the left and preview the rendered output on the right.',
    fields: [
      {
        name: 'markdown',
        label: 'Markdown input',
        type: 'textarea',
        rows: 14,
        defaultValue:
          '# Build faster\n\n- Ship the tool\n- Preview the result\n\n> Markdown helps us move quicker.\n\n**Bold** and *italic* text both work.',
        placeholder: 'Write Markdown here',
        fullWidth: true
      }
    ],
    outputLabel: 'Preview',
    outputDescription: 'A rendered preview of the Markdown input.',
    renderOutput: ({ result, text }) => (
      <div className="space-y-4">
        <div
          className="rounded-xl border bg-background p-4 shadow-sm space-y-4 [&_h1]:text-3xl [&_h1]:font-semibold [&_h2]:text-2xl [&_h2]:font-semibold [&_h3]:text-xl [&_h3]:font-semibold [&_p]:leading-7 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_blockquote]:border-l-4 [&_blockquote]:border-primary/40 [&_blockquote]:pl-4 [&_blockquote]:italic [&_a]:text-primary [&_a]:underline [&_code]:rounded [&_code]:bg-muted/50 [&_code]:px-1 [&_code]:py-0.5 [&_pre]:overflow-auto [&_pre]:rounded-lg [&_pre]:border [&_pre]:bg-muted/30 [&_pre]:p-4"
          dangerouslySetInnerHTML={{ __html: result || '' }}
        />
        <div className="space-y-2">
          <p className="text-sm font-medium">Rendered HTML</p>
          {codeBlock(text)}
        </div>
      </div>
    ),
    onProcess: ({ markdown }) => markdownToHtml(markdown)
  },
  cron: {
    title: 'Cron Expression Explainer',
    description: 'Paste a cron string and get a plain-English explanation plus field breakdown.',
    fields: [
      {
        name: 'expression',
        label: 'Cron expression',
        type: 'text',
        defaultValue: '0 9 * * 1-5',
        placeholder: '0 9 * * 1-5',
        fullWidth: true
      }
    ],
    outputLabel: 'Cron breakdown',
    outputDescription: 'See how each field is interpreted.',
    renderOutput: ({ result }) => {
      if (!result) {
        return <p className="text-sm text-muted-foreground">Paste a cron expression to explain it.</p>;
      }

      return (
        <div className="space-y-4">
          {summaryCard('Plain English', result.description)}
          {result.fields.length ? (
            <div className="grid gap-3">
              {result.fields.map((field) => (
                <Card key={field.field}>
                  <CardHeader className="pb-2">
                    <CardDescription>{field.field}</CardDescription>
                    <CardTitle className="text-base">{field.value}</CardTitle>
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : null}
        </div>
      );
    },
    onProcess: ({ expression }) => explainCronExpression(expression)
  },
  timestamp: {
    title: 'Timestamp Converter',
    description: 'Convert Unix timestamps to readable dates and back again.',
    fields: [
      {
        name: 'value',
        label: 'Timestamp or date',
        type: 'text',
        defaultValue: () => String(Math.floor(Date.now() / 1000)),
        placeholder: '1720000000',
        fullWidth: true
      },
      {
        name: 'mode',
        label: 'Input mode',
        type: 'select',
        defaultValue: 'auto',
        options: [
          { value: 'auto', label: 'Auto detect' },
          { value: 'seconds', label: 'Seconds' },
          { value: 'milliseconds', label: 'Milliseconds' },
          { value: 'date', label: 'Date string' }
        ]
      }
    ],
    outputLabel: 'Converted timestamp',
    outputDescription: 'Human-readable time plus Unix formats.',
    renderOutput: ({ result }) => {
      if (!result) {
        return <p className="text-sm text-muted-foreground">Enter a timestamp to convert it.</p>;
      }

      return renderKeyValueList([
        ['ISO', result.iso],
        ['Local', result.local],
        ['UTC', result.utc],
        ['Unix seconds', result.unixSeconds],
        ['Unix milliseconds', result.unixMilliseconds]
      ]);
    },
    onProcess: ({ value, mode }) => parseTimestampInput(value, mode),
    copyValue: ({ result }) => (result ? result.iso : '')
  },
  'number-base': {
    title: 'Number Base Converter',
    description: 'Convert integers between binary, octal, decimal, and hexadecimal.',
    fields: [
      {
        name: 'value',
        label: 'Number',
        type: 'text',
        defaultValue: '255',
        placeholder: '255',
        fullWidth: true
      },
      {
        name: 'base',
        label: 'Input base',
        type: 'select',
        defaultValue: 'auto',
        options: [
          { value: 'auto', label: 'Auto detect' },
          { value: '2', label: 'Binary' },
          { value: '8', label: 'Octal' },
          { value: '10', label: 'Decimal' },
          { value: '16', label: 'Hexadecimal' }
        ]
      }
    ],
    outputLabel: 'Converted number',
    outputDescription: 'See the value in each base.',
    renderOutput: ({ result }) => {
      if (!result) {
        return <p className="text-sm text-muted-foreground">Enter a number to convert it.</p>;
      }

      return renderKeyValueList([
        ['Binary', formatPrefixedBase('0b', result.binary)],
        ['Octal', formatPrefixedBase('0o', result.octal)],
        ['Decimal', result.decimal],
        ['Hexadecimal', formatPrefixedBase('0x', result.hexadecimal)]
      ]);
    },
    onProcess: ({ value, base }) => convertIntegerBases(value, base),
    copyValue: ({ result }) => (result ? result.decimal : '')
  },
  css: {
    title: 'CSS Minifier / Beautifier',
    description: 'Shrink CSS for shipping or reformat it for easier reading.',
    fields: [
      {
        name: 'css',
        label: 'CSS input',
        type: 'textarea',
        rows: 14,
        defaultValue: '.button {\n  color: white;\n  background: linear-gradient(45deg, #111827, #374151);\n}',
        placeholder: 'Paste CSS here',
        fullWidth: true
      }
    ],
    outputLabel: 'Formatted CSS',
    outputDescription: 'Switch between the beautified and minified output.',
    renderOutput: ({ result }) => {
      if (!result) {
        return <p className="text-sm text-muted-foreground">Paste CSS to format it.</p>;
      }

      return (
        <Tabs defaultValue="beautified" className="space-y-4">
          <TabsList>
            <TabsTrigger value="beautified">Beautified</TabsTrigger>
            <TabsTrigger value="minified">Minified</TabsTrigger>
          </TabsList>
          <TabsContent value="beautified">{codeBlock(result.beautified)}</TabsContent>
          <TabsContent value="minified">{codeBlock(result.minified)}</TabsContent>
        </Tabs>
      );
    },
    onProcess: ({ css }) => ({
      beautified: beautifyCss(css),
      minified: minifyCss(css)
    }),
    copyValue: ({ result }) => (result ? result.minified : '')
  },
  html: {
    title: 'HTML Encoder / Decoder',
    description: 'Encode HTML entities for safe display or decode them back to plain markup.',
    fields: [
      {
        name: 'mode',
        label: 'Mode',
        type: 'select',
        defaultValue: 'encode',
        options: [
          { value: 'encode', label: 'Encode' },
          { value: 'decode', label: 'Decode' }
        ]
      },
      {
        name: 'value',
        label: 'HTML text',
        type: 'textarea',
        rows: 12,
        defaultValue: '<div class="card">Hello & welcome!</div>',
        placeholder: 'Paste HTML or encoded entities',
        fullWidth: true
      }
    ],
    outputLabel: 'Converted HTML',
    outputDescription: 'The converted text appears here.',
    renderOutput: ({ result }) => {
      if (!result) {
        return <p className="text-sm text-muted-foreground">Paste some HTML to encode or decode it.</p>;
      }

      return codeBlock(result);
    },
    onProcess: ({ mode, value }) => (mode === 'decode' ? decodeHtml(value) : encodeHtml(value))
  }
};

export function getDevToolPageConfig(key) {
  return devToolPageConfigs[key];
}
