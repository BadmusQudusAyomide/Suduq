import { Image, FileType2, ScanText, Hash, Sparkles, Clapperboard } from 'lucide-react';

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
    icon: Hash,
    description: 'Base64, URL, JWT, regex, color, and hashing utilities.'
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

export const toolRegistry = [...imageTools, ...textTools, ...videoTools, ...creatorTools];

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
