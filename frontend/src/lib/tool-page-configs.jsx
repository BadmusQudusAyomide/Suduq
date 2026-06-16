import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import {
  countText,
  decodeBase64,
  decodeUrl,
  encodeBase64,
  encodeUrl,
  generateLorem,
  generatePassword,
  generateUuid,
  md5Hash,
  sha256Hash,
  toCamelCase,
  toSnakeCase,
  toTitleCase
} from './text-utils';
import { apiUrl } from './api-base';

const imageToolPageConfigs = {
  compress: {
    title: 'Image Compress',
    description: 'Reduce file size while keeping the result clean enough for sharing and web use.',
    endpoint: apiUrl('/api/images/compress'),
    actionLabel: 'Compress image',
    fields: [
      {
        name: 'quality',
        label: 'Quality',
        type: 'range',
        min: 30,
        max: 95,
        step: 1,
        defaultValue: 80
      },
      {
        name: 'format',
        label: 'Output format',
        type: 'select',
        defaultValue: 'webp',
        options: [
          { value: 'webp', label: 'WEBP' },
          { value: 'jpeg', label: 'JPG' },
          { value: 'png', label: 'PNG' }
        ]
      }
    ],
    onBuildFields: (values) => ({
      quality: values.quality,
      format: values.format
    })
  },
  resize: {
    title: 'Image Resize',
    description: 'Set a target width and height, then let Sharp handle the export.',
    endpoint: apiUrl('/api/images/resize'),
    actionLabel: 'Resize image',
    fields: [
      {
        name: 'width',
        label: 'Width (px)',
        type: 'number',
        min: 1,
        defaultValue: 1200,
        placeholder: '1200'
      },
      {
        name: 'height',
        label: 'Height (px)',
        type: 'number',
        min: 1,
        defaultValue: 1200,
        placeholder: '1200'
      }
    ],
    onBuildFields: (values) => ({
      width: values.width,
      height: values.height
    })
  },
  convert: {
    title: 'Image Convert',
    description: 'Convert images between PNG, JPG, and WEBP in one place.',
    endpoint: apiUrl('/api/images/convert'),
    actionLabel: 'Convert image',
    fields: [
      {
        name: 'format',
        label: 'Output format',
        type: 'select',
        defaultValue: 'png',
        options: [
          { value: 'png', label: 'PNG' },
          { value: 'jpeg', label: 'JPG' },
          { value: 'webp', label: 'WEBP' }
        ]
      }
    ],
    onBuildFields: (values) => ({
      format: values.format
    })
  },
  base64: {
    title: 'Image to Base64',
    description: 'Convert a local image to a Base64 string for previews, embeds, and quick testing.',
    rightTitle: 'Base64 output',
    rightDescription: 'Copy or reuse the generated data URL.'
  },
  'color-picker': {
    title: 'Color Picker from Image',
    description: 'Upload an image, click any pixel, and pull out a useful palette.',
    rightTitle: 'Selected color',
    rightDescription: 'Click the image to sample a pixel color.'
  },
  'remove-bg': {
    title: 'Background Remover',
    description: 'Upload an image, remove the background, and compare before versus after.',
    rightTitle: 'Before / After',
    rightDescription: 'Drag the slider or use the buttons to compare the original image with the cutout.'
  }
};

const textToolPageConfigs = {
  counter: {
    title: 'Word / Character / Sentence Counter',
    description: 'Count the key text metrics instantly as you type.',
    inputLabel: 'Text',
    liveOutput: true,
    outputLabel: 'Live Metrics',
    outputDescription: 'Counts update instantly with the current text.',
    onProcess: (input) => JSON.stringify(countText(input)),
    tabs: [
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
    ]
  },
  case: {
    title: 'Case Converter',
    description: 'Switch text between UPPER, lower, Title, camelCase, and snake_case.',
    liveOutput: true,
    outputLabel: 'Converted Text',
    outputDescription: 'The result updates as you change the selected case.',
    controls: [
      {
        name: 'mode',
        label: 'Case type',
        type: 'select',
        defaultValue: 'upper',
        options: [
          { value: 'upper', label: 'UPPER' },
          { value: 'lower', label: 'lower' },
          { value: 'title', label: 'Title Case' },
          { value: 'camel', label: 'camelCase' },
          { value: 'snake', label: 'snake_case' }
        ]
      }
    ],
    onProcess: (input, controls) => {
      switch (controls.mode) {
        case 'lower':
          return input.toLowerCase();
        case 'title':
          return toTitleCase(input);
        case 'camel':
          return toCamelCase(input);
        case 'snake':
          return toSnakeCase(input);
        case 'upper':
        default:
          return input.toUpperCase();
      }
    }
  },
  lorem: {
    title: 'Lorem Ipsum Generator',
    description: 'Generate placeholder paragraphs for layouts, demos, and mockups.',
    inputLabel: 'Controls',
    inputPlaceholder: 'Use the controls below to generate placeholder copy.',
    controls: [
      {
        name: 'paragraphs',
        label: 'Paragraphs',
        type: 'number',
        min: 1,
        max: 10,
        step: 1,
        defaultValue: 3,
        placeholder: '3'
      }
    ],
    primaryActionLabel: 'Generate lorem ipsum',
    secondaryActionLabel: 'Clear',
    onProcess: (_, controls) => generateLorem(Number(controls.paragraphs || 3)),
    outputLabel: 'Generated Text',
    outputDescription: 'Use the copy button or regenerate as needed.'
  },
  json: {
    title: 'JSON Formatter & Validator',
    description: 'Format JSON with indentation and catch invalid syntax immediately.',
    inputLabel: 'JSON',
    inputPlaceholder: '{"name":"Suduq","owner":"Qudus"}',
    primaryActionLabel: 'Format JSON',
    secondaryActionLabel: 'Reset',
    outputLabel: 'Formatted JSON',
    outputDescription: 'Pretty-printed JSON appears in the tabs below.',
    controls: [
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
    ],
    onProcess: (input, controls) => {
      const parsed = JSON.parse(input);
      return JSON.stringify(parsed, null, Number(controls.indent || 2));
    },
    tabs: [
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
    ]
  },
  base64: {
    title: 'Base64 Encode / Decode',
    description: 'Turn plain text into Base64 or convert Base64 back to readable text.',
    controls: [
      {
        name: 'mode',
        label: 'Mode',
        type: 'select',
        defaultValue: 'encode',
        options: [
          { value: 'encode', label: 'Encode' },
          { value: 'decode', label: 'Decode' }
        ]
      }
    ],
    primaryActionLabel: 'Process Base64',
    outputLabel: 'Result',
    outputDescription: 'Convert text in either direction.',
    onProcess: (input, controls) =>
      controls.mode === 'decode' ? decodeBase64(input) : encodeBase64(input)
  },
  url: {
    title: 'URL Encode / Decode',
    description: 'Encode text for URLs or decode a URL-encoded string back to plain text.',
    controls: [
      {
        name: 'mode',
        label: 'Mode',
        type: 'select',
        defaultValue: 'encode',
        options: [
          { value: 'encode', label: 'Encode' },
          { value: 'decode', label: 'Decode' }
        ]
      }
    ],
    primaryActionLabel: 'Process URL',
    outputLabel: 'Result',
    outputDescription: 'The output changes based on the selected mode.',
    onProcess: (input, controls) => (controls.mode === 'decode' ? decodeUrl(input) : encodeUrl(input))
  },
  password: {
    title: 'Password Generator',
    description: 'Create strong passwords with the character sets you want.',
    inputLabel: 'Result',
    inputPlaceholder: 'Use the controls to generate a password.',
    controls: [
      {
        name: 'length',
        label: 'Length',
        type: 'number',
        min: 8,
        max: 64,
        step: 1,
        defaultValue: 16,
        placeholder: '16'
      },
      {
        name: 'lowercase',
        label: 'Lowercase',
        type: 'checkbox',
        defaultValue: true
      },
      {
        name: 'uppercase',
        label: 'Uppercase',
        type: 'checkbox',
        defaultValue: true
      },
      {
        name: 'numbers',
        label: 'Numbers',
        type: 'checkbox',
        defaultValue: true
      },
      {
        name: 'symbols',
        label: 'Symbols',
        type: 'checkbox',
        defaultValue: true
      }
    ],
    primaryActionLabel: 'Generate password',
    secondaryActionLabel: 'Reset',
    onProcess: (_, controls) =>
      generatePassword(Number(controls.length || 16), {
        lowercase: Boolean(controls.lowercase),
        uppercase: Boolean(controls.uppercase),
        numbers: Boolean(controls.numbers),
        symbols: Boolean(controls.symbols)
      }),
    outputLabel: 'Generated Password',
    outputDescription: 'Copy the generated password and keep it safe.'
  },
  uuid: {
    title: 'UUID Generator',
    description: 'Generate a version 4 UUID in one click.',
    inputLabel: 'UUID',
    inputPlaceholder: 'Generate a UUID below.',
    primaryActionLabel: 'Generate UUID',
    secondaryActionLabel: 'Reset',
    onProcess: () => generateUuid(),
    outputLabel: 'UUID output',
    outputDescription: 'Copy the generated identifier or make a new one.'
  },
  hash: {
    title: 'Hash Generator',
    description: 'Generate MD5 and SHA-256 hashes from text input.',
    inputLabel: 'Text',
    inputPlaceholder: 'Enter the text you want to hash...',
    controls: [
      {
        name: 'algorithm',
        label: 'Algorithm',
        type: 'select',
        defaultValue: 'sha256',
        options: [
          { value: 'md5', label: 'MD5' },
          { value: 'sha256', label: 'SHA-256' }
        ]
      }
    ],
    primaryActionLabel: 'Generate hash',
    secondaryActionLabel: 'Reset',
    outputLabel: 'Hash output',
    outputDescription: 'The selected algorithm runs when you press the button.',
    onProcess: async (input, controls) => {
      if (controls.algorithm === 'md5') {
        return md5Hash(input);
      }

      return sha256Hash(input);
    }
  }
};

export function getImageToolPageConfig(key) {
  return imageToolPageConfigs[key];
}

export function getImageSpecialPageConfig(key) {
  return imageToolPageConfigs[key];
}

export function getTextToolPageConfig(key) {
  return textToolPageConfigs[key];
}
