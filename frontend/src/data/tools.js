import { Image, FileType2, ScanText, Sparkles, Clapperboard, Code2 } from 'lucide-react';

const defaultOutput = (label) => [
  {
    name: 'result',
    label,
    type: 'output'
  }
];

const imageInputSchemas = {
  compress: [
    { name: 'quality', label: 'Quality', type: 'range', min: 30, max: 95, step: 1, defaultValue: 80 },
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
  resize: [
    { name: 'width', label: 'Width (px)', type: 'number', min: 1, defaultValue: 1200 },
    { name: 'height', label: 'Height (px)', type: 'number', min: 1, defaultValue: 1200 }
  ],
  convert: [
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
  base64: [],
  'remove-bg': [],
  'color-picker': []
};

const textInputSchemas = {
  counter: [],
  case: [
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
  lorem: [
    {
      name: 'paragraphs',
      label: 'Paragraphs',
      type: 'number',
      min: 1,
      max: 10,
      defaultValue: 3
    }
  ],
  json: [
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
  base64: [
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
  url: [
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
  password: [
    {
      name: 'length',
      label: 'Length',
      type: 'number',
      min: 8,
      max: 64,
      defaultValue: 16
    },
    {
      name: 'lowercase',
      label: 'Include lowercase',
      type: 'checkbox',
      defaultValue: true,
      checkboxLabel: 'Lowercase'
    },
    {
      name: 'uppercase',
      label: 'Include uppercase',
      type: 'checkbox',
      defaultValue: true,
      checkboxLabel: 'Uppercase'
    },
    {
      name: 'numbers',
      label: 'Include numbers',
      type: 'checkbox',
      defaultValue: true,
      checkboxLabel: 'Numbers'
    },
    {
      name: 'symbols',
      label: 'Include symbols',
      type: 'checkbox',
      defaultValue: true,
      checkboxLabel: 'Symbols'
    }
  ],
  uuid: [],
  hash: [
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
  ]
};

function createTool(tool, category, execution, inputSchema = [], outputSchema = []) {
  return {
    ...tool,
    category,
    execution,
    inputSchema,
    outputSchema
  };
}

export const categories = [
  {
    key: 'images',
    label: 'Image Tools',
    icon: Image,
    description: 'Compress, resize, convert, and inspect images quickly.'
  },
  {
    key: 'text',
    label: 'Text Tools',
    icon: ScanText,
    description: 'Format text, compare content, and validate markdown/JSON.'
  },
  {
    key: 'dev',
    label: 'Dev Tools',
    icon: Code2,
    description: 'Regex, JWT, color, diff, markdown, cron, and conversion utilities.'
  },
  {
    key: 'ai',
    label: 'AI Tools',
    icon: Sparkles,
    description: 'Summaries, grammar fixes, explanations, and captions.'
  },
  {
    key: 'utility',
    label: 'Utility Tools',
    icon: FileType2,
    description: 'QR codes, passwords, UUIDs, timestamps, and file sizes.'
  },
  {
    key: 'video',
    label: 'Video Tools',
    icon: Clapperboard,
    description: 'Download-ready sections for social media video workflows.'
  },
  {
    key: 'creators',
    label: 'Creators Tools',
    icon: Sparkles,
    description: 'YouTube tools now, with room for TikTok, Instagram, and more later.'
  }
];

export const imageTools = [
  createTool(
    {
      key: 'compress',
      label: 'Compress',
      description: 'Reduce image file size with a quality slider.',
      path: '/tools/images/compress'
    },
    'images',
    'server',
    imageInputSchemas.compress,
    defaultOutput('Compressed file')
  ),
  createTool(
    {
      key: 'resize',
      label: 'Resize',
      description: 'Change width and height without losing control.',
      path: '/tools/images/resize'
    },
    'images',
    'server',
    imageInputSchemas.resize,
    defaultOutput('Resized file')
  ),
  createTool(
    {
      key: 'convert',
      label: 'Convert',
      description: 'Switch between PNG, JPG, and WEBP.',
      path: '/tools/images/convert'
    },
    'images',
    'server',
    imageInputSchemas.convert,
    defaultOutput('Converted file')
  ),
  createTool(
    {
      key: 'base64',
      label: 'Base64',
      description: 'Encode an image into a reusable Base64 string.',
      path: '/tools/images/base64'
    },
    'images',
    'client',
    imageInputSchemas.base64,
    defaultOutput('Base64 string')
  ),
  createTool(
    {
      key: 'remove-bg',
      label: 'Background Remover',
      description: 'Remove the background and export a transparent PNG.',
      path: '/tools/images/remove-bg'
    },
    'images',
    'server',
    imageInputSchemas['remove-bg'],
    defaultOutput('Transparent PNG')
  ),
  createTool(
    {
      key: 'color-picker',
      label: 'Color Picker',
      description: 'Sample colors and extract a palette from an image.',
      path: '/tools/images/color-picker'
    },
    'images',
    'client',
    imageInputSchemas['color-picker'],
    defaultOutput('Color value')
  )
];

export const textTools = [
  createTool(
    {
      key: 'counter',
      label: 'Counter',
      description: 'Count words, characters, sentences, and lines.',
      path: '/tools/text/counter'
    },
    'text',
    'client',
    textInputSchemas.counter,
    defaultOutput('Text metrics')
  ),
  createTool(
    {
      key: 'case',
      label: 'Case Converter',
      description: 'Change text to upper, lower, title, camel, or snake case.',
      path: '/tools/text/case'
    },
    'text',
    'client',
    textInputSchemas.case,
    defaultOutput('Converted text')
  ),
  createTool(
    {
      key: 'lorem',
      label: 'Lorem Ipsum',
      description: 'Generate placeholder paragraphs on demand.',
      path: '/tools/text/lorem'
    },
    'text',
    'client',
    textInputSchemas.lorem,
    defaultOutput('Generated copy')
  ),
  createTool(
    {
      key: 'json',
      label: 'JSON Formatter',
      description: 'Format and validate JSON quickly.',
      path: '/tools/text/json'
    },
    'text',
    'client',
    textInputSchemas.json,
    defaultOutput('Formatted JSON')
  ),
  createTool(
    {
      key: 'base64',
      label: 'Base64',
      description: 'Encode or decode text as Base64.',
      path: '/tools/text/base64'
    },
    'text',
    'client',
    textInputSchemas.base64,
    defaultOutput('Encoded text')
  ),
  createTool(
    {
      key: 'url',
      label: 'URL Encode',
      description: 'Encode or decode URL-safe text.',
      path: '/tools/text/url'
    },
    'text',
    'client',
    textInputSchemas.url,
    defaultOutput('URL-safe text')
  ),
  createTool(
    {
      key: 'password',
      label: 'Password Generator',
      description: 'Create secure random passwords.',
      path: '/tools/text/password'
    },
    'text',
    'client',
    textInputSchemas.password,
    defaultOutput('Generated password')
  ),
  createTool(
    {
      key: 'uuid',
      label: 'UUID Generator',
      description: 'Generate a v4 UUID instantly.',
      path: '/tools/text/uuid'
    },
    'text',
    'client',
    textInputSchemas.uuid,
    defaultOutput('UUID value')
  ),
  createTool(
    {
      key: 'hash',
      label: 'Hash Generator',
      description: 'Generate MD5 and SHA-256 hashes.',
      path: '/tools/text/hash'
    },
    'text',
    'client',
    textInputSchemas.hash,
    defaultOutput('Hash output')
  )
];

export const videoTools = [
  createTool(
    {
      key: 'youtube',
      label: 'YouTube Downloader',
      description: 'Paste a YouTube link and prepare a downloadable video flow.',
      path: '/tools/video/youtube'
    },
    'video',
    'server',
    [],
    defaultOutput('Video file')
  ),
  createTool(
    {
      key: 'tiktok',
      label: 'TikTok Downloader',
      description: 'Download TikTok clips from a shared link.',
      path: '/tools/video/tiktok'
    },
    'video',
    'server',
    [],
    defaultOutput('Video file')
  ),
  createTool(
    {
      key: 'instagram',
      label: 'Instagram Downloader',
      description: 'Save Instagram reels and video posts.',
      path: '/tools/video/instagram'
    },
    'video',
    'server',
    [],
    defaultOutput('Video file')
  ),
  createTool(
    {
      key: 'facebook',
      label: 'Facebook Downloader',
      description: 'Grab public Facebook video links for offline use.',
      path: '/tools/video/facebook'
    },
    'video',
    'server',
    [],
    defaultOutput('Video file')
  ),
  createTool(
    {
      key: 'x',
      label: 'X Downloader',
      description: 'Download public X video posts from a URL.',
      path: '/tools/video/x'
    },
    'video',
    'server',
    [],
    defaultOutput('Video file')
  ),
  createTool(
    {
      key: 'linkedin',
      label: 'LinkedIn Downloader',
      description: 'Save LinkedIn video posts into a usable file flow.',
      path: '/tools/video/linkedin'
    },
    'video',
    'server',
    [],
    defaultOutput('Video file')
  )
];

export const devTools = [
  createTool(
    {
      key: 'regex',
      label: 'Regex Tester',
      description: 'Check a regular expression against sample text in real time.',
      path: '/tools/dev/regex'
    },
    'dev',
    'client',
    [],
    defaultOutput('Regex match')
  ),
  createTool(
    {
      key: 'jwt',
      label: 'JWT Decoder',
      description: 'Decode JWT headers and payloads without verifying the signature.',
      path: '/tools/dev/jwt'
    },
    'dev',
    'client',
    [],
    defaultOutput('Decoded token')
  ),
  createTool(
    {
      key: 'color',
      label: 'Color Converter',
      description: 'Convert between HEX, RGB, and HSL with a live color preview.',
      path: '/tools/dev/color'
    },
    'dev',
    'client',
    [],
    defaultOutput('Color values')
  ),
  createTool(
    {
      key: 'diff',
      label: 'Diff Checker',
      description: 'Compare two text blocks and inspect the line-by-line differences.',
      path: '/tools/dev/diff'
    },
    'dev',
    'client',
    [],
    defaultOutput('Diff output')
  ),
  createTool(
    {
      key: 'markdown',
      label: 'Markdown Previewer',
      description: 'Write Markdown and preview the rendered HTML live.',
      path: '/tools/dev/markdown'
    },
    'dev',
    'client',
    [],
    defaultOutput('Markdown preview')
  ),
  createTool(
    {
      key: 'cron',
      label: 'Cron Explainer',
      description: 'Turn cron expressions into plain English.',
      path: '/tools/dev/cron'
    },
    'dev',
    'client',
    [],
    defaultOutput('Cron explanation')
  ),
  createTool(
    {
      key: 'timestamp',
      label: 'Timestamp Converter',
      description: 'Convert Unix timestamps and readable dates both ways.',
      path: '/tools/dev/timestamp'
    },
    'dev',
    'client',
    [],
    defaultOutput('Timestamp conversion')
  ),
  createTool(
    {
      key: 'number-base',
      label: 'Number Base Converter',
      description: 'Convert integers between binary, octal, decimal, and hex.',
      path: '/tools/dev/number-base'
    },
    'dev',
    'client',
    [],
    defaultOutput('Base conversion')
  ),
  createTool(
    {
      key: 'css',
      label: 'CSS Minifier / Beautifier',
      description: 'Compact CSS for shipping or format it for editing.',
      path: '/tools/dev/css'
    },
    'dev',
    'client',
    [],
    defaultOutput('CSS output')
  ),
  createTool(
    {
      key: 'html',
      label: 'HTML Encoder / Decoder',
      description: 'Escape HTML entities or decode them back into markup.',
      path: '/tools/dev/html'
    },
    'dev',
    'client',
    [],
    defaultOutput('HTML output')
  )
];

export const utilityTools = [
  createTool(
    {
      key: 'unit',
      label: 'Unit Converter',
      description: 'Convert length, weight, temperature, speed, area, and volume units.',
      path: '/tools/utility/unit'
    },
    'utility',
    'client',
    [],
    defaultOutput('Converted value')
  ),
  createTool(
    {
      key: 'currency',
      label: 'Currency Converter',
      description: 'Convert between currencies using live exchange rates.',
      path: '/tools/utility/currency'
    },
    'utility',
    'client',
    [],
    defaultOutput('Converted currency')
  ),
  createTool(
    {
      key: 'number-base',
      label: 'Number Base Converter',
      description: 'Convert between binary, octal, decimal, and hexadecimal values.',
      path: '/tools/utility/number-base'
    },
    'utility',
    'client',
    [],
    defaultOutput('Base conversion')
  ),
  createTool(
    {
      key: 'roman',
      label: 'Roman Numeral Converter',
      description: 'Convert Roman numerals to numbers and back.',
      path: '/tools/utility/roman'
    },
    'utility',
    'client',
    [],
    defaultOutput('Roman conversion')
  ),
  createTool(
    {
      key: 'number-to-words',
      label: 'Number to Words',
      description: 'Write whole numbers as words.',
      path: '/tools/utility/number-to-words'
    },
    'utility',
    'client',
    [],
    defaultOutput('Number words')
  ),
  createTool(
    {
      key: 'file-size',
      label: 'File Size Converter',
      description: 'Convert bytes, KB, MB, GB, and TB values.',
      path: '/tools/utility/file-size'
    },
    'utility',
    'client',
    [],
    defaultOutput('Converted size')
  ),
  createTool(
    {
      key: 'color',
      label: 'Color Converter',
      description: 'Convert between HEX, RGB, and HSL values.',
      path: '/tools/utility/color'
    },
    'utility',
    'client',
    [],
    defaultOutput('Color values')
  ),
  createTool(
    {
      key: 'age-calculator',
      label: 'Age Calculator',
      description: 'Calculate age from a date of birth.',
      path: '/tools/utility/age-calculator'
    },
    'utility',
    'client',
    [],
    defaultOutput('Age result')
  ),
  createTool(
    {
      key: 'date-difference',
      label: 'Date Difference Calculator',
      description: 'Compare two dates and see the difference in days.',
      path: '/tools/utility/date-difference'
    },
    'utility',
    'client',
    [],
    defaultOutput('Date difference')
  ),
  createTool(
    {
      key: 'timezone',
      label: 'Timezone Converter',
      description: 'Convert dates and times between timezones.',
      path: '/tools/utility/timezone'
    },
    'utility',
    'client',
    [],
    defaultOutput('Timezone result')
  ),
  createTool(
    {
      key: 'countdown',
      label: 'Countdown Timer',
      description: 'Track time remaining until a target date.',
      path: '/tools/utility/countdown'
    },
    'utility',
    'client',
    [],
    defaultOutput('Countdown')
  ),
  createTool(
    {
      key: 'working-days',
      label: 'Working Days Calculator',
      description: 'Count business days while skipping weekends and holidays.',
      path: '/tools/utility/working-days'
    },
    'utility',
    'client',
    [],
    defaultOutput('Working days')
  ),
  createTool(
    {
      key: 'percentage',
      label: 'Percentage Calculator',
      description: 'Calculate percentages and comparisons quickly.',
      path: '/tools/utility/percentage'
    },
    'utility',
    'client',
    [],
    defaultOutput('Percentage result')
  ),
  createTool(
    {
      key: 'scientific',
      label: 'Scientific Calculator',
      description: 'Run core math operations on numeric inputs.',
      path: '/tools/utility/scientific'
    },
    'utility',
    'client',
    [],
    defaultOutput('Result')
  ),
  createTool(
    {
      key: 'bmi',
      label: 'BMI Calculator',
      description: 'Estimate BMI from weight and height.',
      path: '/tools/utility/bmi'
    },
    'utility',
    'client',
    [],
    defaultOutput('BMI result')
  ),
  createTool(
    {
      key: 'tip',
      label: 'Tip Calculator',
      description: 'Calculate tips and split bills across people.',
      path: '/tools/utility/tip'
    },
    'utility',
    'client',
    [],
    defaultOutput('Tip result')
  ),
  createTool(
    {
      key: 'loan-emi',
      label: 'Loan / EMI Calculator',
      description: 'Estimate EMIs and total loan costs.',
      path: '/tools/utility/loan-emi'
    },
    'utility',
    'client',
    [],
    defaultOutput('EMI result')
  ),
  createTool(
    {
      key: 'prime',
      label: 'Prime Number Checker',
      description: 'Check whether a number is prime.',
      path: '/tools/utility/prime'
    },
    'utility',
    'client',
    [],
    defaultOutput('Prime result')
  ),
  createTool(
    {
      key: 'gcd-lcm',
      label: 'GCD & LCM Calculator',
      description: 'Find greatest common divisors and least common multiples.',
      path: '/tools/utility/gcd-lcm'
    },
    'utility',
    'client',
    [],
    defaultOutput('GCD / LCM')
  ),
  createTool(
    {
      key: 'random-number',
      label: 'Random Number Generator',
      description: 'Generate random integers in a chosen range.',
      path: '/tools/utility/random-number'
    },
    'utility',
    'client',
    [],
    defaultOutput('Random numbers')
  ),
  createTool(
    {
      key: 'area',
      label: 'Area Calculator',
      description: 'Calculate area and perimeter for common shapes.',
      path: '/tools/utility/area'
    },
    'utility',
    'client',
    [],
    defaultOutput('Area result')
  ),
  createTool(
    {
      key: 'pythagorean',
      label: 'Pythagorean Theorem Solver',
      description: 'Solve right triangle values from side lengths.',
      path: '/tools/utility/pythagorean'
    },
    'utility',
    'client',
    [],
    defaultOutput('Right triangle result')
  ),
  createTool(
    {
      key: 'volume',
      label: 'Volume Calculator',
      description: 'Calculate volume for common 3D shapes.',
      path: '/tools/utility/volume'
    },
    'utility',
    'client',
    [],
    defaultOutput('Volume result')
  ),
  createTool(
    {
      key: 'ip-lookup',
      label: 'IP Address Lookup',
      description: 'Look up your current public IP address.',
      path: '/tools/utility/ip-lookup'
    },
    'utility',
    'client',
    [],
    defaultOutput('Public IP')
  ),
  createTool(
    {
      key: 'dns-lookup',
      label: 'DNS Lookup',
      description: 'Check DNS records for a hostname.',
      path: '/tools/utility/dns-lookup'
    },
    'utility',
    'client',
    [],
    defaultOutput('DNS records')
  ),
  createTool(
    {
      key: 'http-status',
      label: 'HTTP Status Code Reference',
      description: 'Look up the meaning of common HTTP status codes.',
      path: '/tools/utility/http-status'
    },
    'utility',
    'client',
    [],
    defaultOutput('Status info')
  ),
  createTool(
    {
      key: 'user-agent',
      label: 'User Agent Parser',
      description: 'Parse browser and platform details from a user agent string.',
      path: '/tools/utility/user-agent'
    },
    'utility',
    'client',
    [],
    defaultOutput('Parsed user agent')
  ),
  createTool(
    {
      key: 'ssl-checker',
      label: 'SSL Certificate Checker',
      description: 'Check whether a URL appears to use HTTPS.',
      path: '/tools/utility/ssl-checker'
    },
    'utility',
    'client',
    [],
    defaultOutput('SSL result')
  ),
  createTool(
    {
      key: 'ping',
      label: 'Ping Tool (Simulated)',
      description: 'Estimate simulated response latency for a host.',
      path: '/tools/utility/ping'
    },
    'utility',
    'client',
    [],
    defaultOutput('Ping result')
  ),
  createTool(
    {
      key: 'qr-code',
      label: 'QR Code Generator',
      description: 'Generate a QR code image for your text.',
      path: '/tools/utility/qr-code'
    },
    'utility',
    'client',
    [],
    defaultOutput('QR code')
  ),
  createTool(
    {
      key: 'barcode',
      label: 'Barcode Generator',
      description: 'Generate a barcode image.',
      path: '/tools/utility/barcode'
    },
    'utility',
    'client',
    [],
    defaultOutput('Barcode')
  ),
  createTool(
    {
      key: 'fake-data',
      label: 'Fake Data Generator',
      description: 'Create sample names, emails, and addresses.',
      path: '/tools/utility/fake-data'
    },
    'utility',
    'client',
    [],
    defaultOutput('Generated data')
  ),
  createTool(
    {
      key: 'invoice-number',
      label: 'Invoice Number Generator',
      description: 'Generate a formatted invoice number.',
      path: '/tools/utility/invoice-number'
    },
    'utility',
    'client',
    [],
    defaultOutput('Invoice number')
  ),
  createTool(
    {
      key: 'color-palette',
      label: 'Color Palette Generator',
      description: 'Generate a small palette from a seed color.',
      path: '/tools/utility/color-palette'
    },
    'utility',
    'client',
    [],
    defaultOutput('Palette')
  ),
  createTool(
    {
      key: 'gradient',
      label: 'Gradient Generator',
      description: 'Create CSS gradients from color stops.',
      path: '/tools/utility/gradient'
    },
    'utility',
    'client',
    [],
    defaultOutput('Gradient')
  ),
  createTool(
    {
      key: 'favicon',
      label: 'Favicon Generator',
      description: 'Generate a simple favicon from text.',
      path: '/tools/utility/favicon'
    },
    'utility',
    'client',
    [],
    defaultOutput('Generated favicon')
  ),
  createTool(
    {
      key: 'password-strength',
      label: 'Password Strength Checker',
      description: 'Evaluate password complexity.',
      path: '/tools/utility/password-strength'
    },
    'utility',
    'client',
    [],
    defaultOutput('Strength result')
  ),
  createTool(
    {
      key: 'hmac',
      label: 'HMAC Generator',
      description: 'Generate a SHA-256 HMAC signature.',
      path: '/tools/utility/hmac'
    },
    'utility',
    'client',
    [],
    defaultOutput('HMAC signature')
  ),
  createTool(
    {
      key: 'jwt',
      label: 'JWT Generator',
      description: 'Generate a signed JSON web token.',
      path: '/tools/utility/jwt'
    },
    'utility',
    'client',
    [],
    defaultOutput('JWT token')
  ),
  createTool(
    {
      key: 'bcrypt-hash',
      label: 'Bcrypt Hash Generator',
      description: 'Hash values with bcrypt.',
      path: '/tools/utility/bcrypt-hash'
    },
    'utility',
    'client',
    [],
    defaultOutput('Hash result')
  ),
  createTool(
    {
      key: 'rsa-keygen',
      label: 'RSA Key Pair Generator',
      description: 'Generate RSA public and private keys.',
      path: '/tools/utility/rsa-keygen'
    },
    'utility',
    'client',
    [],
    defaultOutput('RSA keys')
  ),
  createTool(
    {
      key: 'csv-to-json',
      label: 'CSV to JSON',
      description: 'Convert CSV text into JSON objects.',
      path: '/tools/utility/csv-to-json'
    },
    'utility',
    'client',
    [],
    defaultOutput('JSON output')
  ),
  createTool(
    {
      key: 'json-to-csv',
      label: 'JSON to CSV',
      description: 'Convert JSON into CSV text.',
      path: '/tools/utility/json-to-csv'
    },
    'utility',
    'client',
    [],
    defaultOutput('CSV output')
  ),
  createTool(
    {
      key: 'xml-to-json',
      label: 'XML to JSON',
      description: 'Convert XML markup into JSON.',
      path: '/tools/utility/xml-to-json'
    },
    'utility',
    'client',
    [],
    defaultOutput('JSON output')
  ),
  createTool(
    {
      key: 'yaml-to-json',
      label: 'YAML to JSON',
      description: 'Convert YAML data into JSON.',
      path: '/tools/utility/yaml-to-json'
    },
    'utility',
    'client',
    [],
    defaultOutput('JSON output')
  ),
  createTool(
    {
      key: 'word-frequency',
      label: 'Word Frequency Analyzer',
      description: 'Count word frequency in text.',
      path: '/tools/utility/word-frequency'
    },
    'utility',
    'client',
    [],
    defaultOutput('Word frequency')
  ),
  createTool(
    {
      key: 'reading-time',
      label: 'Reading Time Estimator',
      description: 'Estimate reading time for text.',
      path: '/tools/utility/reading-time'
    },
    'utility',
    'client',
    [],
    defaultOutput('Reading estimate')
  ),
  createTool(
    {
      key: 'palindrome',
      label: 'Palindrome Checker',
      description: 'Check whether text reads the same forward and backward.',
      path: '/tools/utility/palindrome'
    },
    'utility',
    'client',
    [],
    defaultOutput('Palindrome result')
  )
];

export const creatorTools = [
  createTool(
    {
      key: 'monetization-checker',
      label: 'Monetization Checker',
      description: 'Check whether a channel is likely monetization-ready.',
      path: '/tools/creators/monetization-checker'
    },
    'creators',
    'ui',
    [],
    defaultOutput('Monetization status')
  ),
  createTool(
    {
      key: 'channel-stats',
      label: 'Channel Stats Lookup',
      description: 'See channel-level stats in a quick lookup view.',
      path: '/tools/creators/channel-stats'
    },
    'creators',
    'ui',
    [],
    defaultOutput('Channel stats')
  ),
  createTool(
    {
      key: 'video-tag-extractor',
      label: 'Video Tag Extractor',
      description: 'Prepare tags and keywords from a YouTube video.',
      path: '/tools/creators/video-tag-extractor'
    },
    'creators',
    'ui',
    [],
    defaultOutput('Video tags')
  ),
  createTool(
    {
      key: 'thumbnail-downloader',
      label: 'Thumbnail Downloader',
      description: 'Pull a YouTube thumbnail into a quick-download flow.',
      path: '/tools/creators/thumbnail-downloader'
    },
    'creators',
    'ui',
    [],
    defaultOutput('Thumbnail file')
  ),
  createTool(
    {
      key: 'channel-id-finder',
      label: 'Channel ID Finder',
      description: 'Look up a YouTube channel ID from a URL or handle.',
      path: '/tools/creators/channel-id-finder'
    },
    'creators',
    'ui',
    [],
    defaultOutput('Channel ID')
  ),
  createTool(
    {
      key: 'video-duration-formatter',
      label: 'Video Duration Formatter',
      description: 'Turn raw duration values into a readable format.',
      path: '/tools/creators/video-duration-formatter'
    },
    'creators',
    'ui',
    [],
    defaultOutput('Formatted duration')
  ),
  createTool(
    {
      key: 'youtube-banner',
      label: 'YouTube Banner Resizer',
      description: 'Resize an image to the 2048 x 1152 YouTube banner spec.',
      path: '/tools/creators/youtube-banner'
    },
    'creators',
    'server',
    [],
    defaultOutput('Banner image')
  ),
  createTool(
    {
      key: 'youtube-to-mp3',
      label: 'YouTube to MP3',
      description: 'Simple UI for sending a YouTube link to an audio API later.',
      path: '/tools/creators/youtube-to-mp3'
    },
    'creators',
    'ui',
    [],
    defaultOutput('MP3 file')
  )
];

export const toolRegistry = [
  ...imageTools,
  ...textTools,
  ...videoTools,
  ...creatorTools,
  ...devTools,
  ...utilityTools
];

export const highlights = [
  {
    label: 'Client-first',
    value: 'Fast local processing where possible'
  },
  {
    label: 'API ready',
    value: 'Backend hooks for Sharp and AI workflows'
  },
  {
    label: 'SEO clean',
    value: 'Branding aligned to Suduq by Qudus'
  }
];

export function getToolByKey(key) {
  return toolRegistry.find((tool) => tool.key === key);
}

export function getToolByPath(path) {
  return toolRegistry.find((tool) => tool.path === path);
}

export function getToolsByCategory(category) {
  return toolRegistry.filter((tool) => tool.category === category);
}

export function searchTools(query) {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return toolRegistry;
  }

  return toolRegistry.filter((tool) => {
    return [tool.label, tool.description, tool.category].some((value) =>
      value.toLowerCase().includes(normalized)
    );
  });
}
