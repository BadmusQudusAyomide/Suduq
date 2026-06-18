const CRON_MONTH_NAMES = {
  '1': 'January',
  '2': 'February',
  '3': 'March',
  '4': 'April',
  '5': 'May',
  '6': 'June',
  '7': 'July',
  '8': 'August',
  '9': 'September',
  '10': 'October',
  '11': 'November',
  '12': 'December'
};

const CRON_WEEKDAY_NAMES = {
  '0': 'Sunday',
  '1': 'Monday',
  '2': 'Tuesday',
  '3': 'Wednesday',
  '4': 'Thursday',
  '5': 'Friday',
  '6': 'Saturday',
  '7': 'Sunday'
};

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function normalizeHex(input) {
  const trimmed = input.trim().replace(/^#/, '');

  if (/^[0-9a-f]{3}$/i.test(trimmed)) {
    return trimmed
      .split('')
      .map((char) => char + char)
      .join('')
      .toLowerCase();
  }

  if (/^[0-9a-f]{6}$/i.test(trimmed)) {
    return trimmed.toLowerCase();
  }

  throw new Error('Enter a valid HEX color.');
}

export function hexToRgb(input) {
  const hex = normalizeHex(input);
  return {
    r: Number.parseInt(hex.slice(0, 2), 16),
    g: Number.parseInt(hex.slice(2, 4), 16),
    b: Number.parseInt(hex.slice(4, 6), 16)
  };
}

export function rgbToHex(r, g, b) {
  return `#${[r, g, b]
    .map((value) => clamp(Number(value), 0, 255).toString(16).padStart(2, '0'))
    .join('')}`;
}

export function rgbToHsl(r, g, b) {
  const red = clamp(Number(r), 0, 255) / 255;
  const green = clamp(Number(g), 0, 255) / 255;
  const blue = clamp(Number(b), 0, 255) / 255;

  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const delta = max - min;

  let hue = 0;
  let saturation = 0;
  const lightness = (max + min) / 2;

  if (delta !== 0) {
    saturation = delta / (1 - Math.abs(2 * lightness - 1));

    switch (max) {
      case red:
        hue = ((green - blue) / delta) % 6;
        break;
      case green:
        hue = (blue - red) / delta + 2;
        break;
      default:
        hue = (red - green) / delta + 4;
        break;
    }
  }

  const degrees = Math.round((hue * 60 + 360) % 360);

  return {
    h: degrees,
    s: Math.round(saturation * 100),
    l: Math.round(lightness * 100)
  };
}

export function hslToRgb(h, s, l) {
  const hue = ((Number(h) % 360) + 360) % 360;
  const saturation = clamp(Number(s), 0, 100) / 100;
  const lightness = clamp(Number(l), 0, 100) / 100;

  if (saturation === 0) {
    const neutral = Math.round(lightness * 255);
    return { r: neutral, g: neutral, b: neutral };
  }

  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const section = hue / 60;
  const secondary = chroma * (1 - Math.abs((section % 2) - 1));
  let red = 0;
  let green = 0;
  let blue = 0;

  if (section >= 0 && section < 1) {
    red = chroma;
    green = secondary;
  } else if (section < 2) {
    red = secondary;
    green = chroma;
  } else if (section < 3) {
    green = chroma;
    blue = secondary;
  } else if (section < 4) {
    green = secondary;
    blue = chroma;
  } else if (section < 5) {
    red = secondary;
    blue = chroma;
  } else {
    red = chroma;
    blue = secondary;
  }

  const match = lightness - chroma / 2;

  return {
    r: Math.round((red + match) * 255),
    g: Math.round((green + match) * 255),
    b: Math.round((blue + match) * 255)
  };
}

export function formatRgb(color) {
  return `rgb(${color.r}, ${color.g}, ${color.b})`;
}

export function formatHsl(color) {
  return `hsl(${color.h}, ${color.s}%, ${color.l}%)`;
}

export function parseColorInput(value, inputFormat = 'auto') {
  const raw = value.trim();

  if (!raw) {
    throw new Error('Enter a color value.');
  }

  if (inputFormat === 'hex' || (inputFormat === 'auto' && raw.startsWith('#'))) {
    return hexToRgb(raw);
  }

  if (inputFormat === 'rgb' || (inputFormat === 'auto' && /^rgb/i.test(raw))) {
    const match = raw.match(/rgba?\(([^)]+)\)/i);
    const parts = match ? match[1].split(',') : raw.split(',');

    if (parts.length < 3) {
      throw new Error('Enter a valid RGB color.');
    }

    return {
      r: clamp(Number(parts[0]), 0, 255),
      g: clamp(Number(parts[1]), 0, 255),
      b: clamp(Number(parts[2]), 0, 255)
    };
  }

  if (inputFormat === 'hsl' || (inputFormat === 'auto' && /^hsl/i.test(raw))) {
    const match = raw.match(/hsla?\(([^)]+)\)/i);
    const parts = match ? match[1].split(',') : raw.split(',');

    if (parts.length < 3) {
      throw new Error('Enter a valid HSL color.');
    }

    return hslToRgb(
      Number(parts[0]),
      Number(String(parts[1]).replace('%', '')),
      Number(String(parts[2]).replace('%', ''))
    );
  }

  if (inputFormat === 'auto' && /^[0-9a-f]{3,6}$/i.test(raw.replace(/^#/, ''))) {
    return hexToRgb(raw);
  }

  throw new Error('Unsupported color format.');
}

export function decodeJwt(token) {
  const parts = token.trim().split('.');

  if (parts.length !== 3) {
    throw new Error('JWTs must contain exactly three parts.');
  }

  const decodePart = (part) => {
    const normalized = part.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);
    return decodeURIComponent(
      window
        .atob(padded)
        .split('')
        .map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, '0')}`)
        .join('')
    );
  };

  const parseJson = (part) => {
    try {
      return JSON.parse(decodePart(part));
    } catch {
      return decodePart(part);
    }
  };

  const header = parseJson(parts[0]);
  const payload = parseJson(parts[1]);
  const signature = parts[2];

  return {
    header,
    payload,
    signature,
    signatureLength: signature.length
  };
}

function normalizeBaseString(value) {
  return value.trim().replace(/[_\s]/g, '');
}

export function parseInteger(value, base = 'auto') {
  const normalized = normalizeBaseString(value);

  if (!normalized) {
    throw new Error('Enter a number to convert.');
  }

  let detectedBase = base;
  let digits = normalized;
  let sign = 1n;

  if (digits.startsWith('-')) {
    sign = -1n;
    digits = digits.slice(1);
  } else if (digits.startsWith('+')) {
    digits = digits.slice(1);
  }

  if (detectedBase === 'auto') {
    if (/^0b/i.test(digits)) {
      detectedBase = '2';
      digits = digits.replace(/^0b/i, '');
    } else if (/^0o/i.test(digits)) {
      detectedBase = '8';
      digits = digits.replace(/^0o/i, '');
    } else if (/^0x/i.test(digits)) {
      detectedBase = '16';
      digits = digits.replace(/^0x/i, '');
    } else if (/^[0-9]+$/.test(digits)) {
      detectedBase = '10';
    } else if (/^[0-9a-f]+$/i.test(digits)) {
      detectedBase = '16';
    } else {
      throw new Error('Unable to auto-detect the base.');
    }
  }

  if (detectedBase === '2' && /^0b/i.test(digits)) {
    digits = digits.replace(/^0b/i, '');
  }

  if (detectedBase === '8' && /^0o/i.test(digits)) {
    digits = digits.replace(/^0o/i, '');
  }

  if (detectedBase === '16' && /^0x/i.test(digits)) {
    digits = digits.replace(/^0x/i, '');
  }

  const unsigned = digits;
  const radix = Number(detectedBase);

  if (radix < 2 || radix > 36) {
    throw new Error('Base must be between 2 and 36.');
  }

  if (!unsigned) {
    throw new Error('Enter a valid integer.');
  }

  let result = 0n;

  for (const char of unsigned.toLowerCase()) {
    const digit = Number.parseInt(char, radix);
    if (Number.isNaN(digit) || digit >= radix) {
      throw new Error(`"${char}" is not valid for base ${radix}.`);
    }
    result = result * BigInt(radix) + BigInt(digit);
  }

  return sign * result;
}

export function convertIntegerBases(value, base = 'auto') {
  const integer = parseInteger(value, base);

  return {
    decimal: integer.toString(10),
    hexadecimal: integer.toString(16),
    octal: integer.toString(8),
    binary: integer.toString(2)
  };
}

function stripCssComments(input) {
  let output = '';
  let index = 0;
  let inString = false;
  let stringChar = '';

  while (index < input.length) {
    const char = input[index];
    const next = input[index + 1];

    if (inString) {
      output += char;
      if (char === '\\') {
        output += next || '';
        index += 2;
        continue;
      }

      if (char === stringChar) {
        inString = false;
      }

      index += 1;
      continue;
    }

    if (char === '"' || char === "'") {
      inString = true;
      stringChar = char;
      output += char;
      index += 1;
      continue;
    }

    if (char === '/' && next === '*') {
      index += 2;
      while (index < input.length && !(input[index] === '*' && input[index + 1] === '/')) {
        index += 1;
      }
      index += 2;
      continue;
    }

    output += char;
    index += 1;
  }

  return output;
}

export function minifyCss(input) {
  const withoutComments = stripCssComments(input);
  return withoutComments
    .replace(/\s+/g, ' ')
    .replace(/\s*{\s*/g, '{')
    .replace(/\s*}\s*/g, '}')
    .replace(/\s*;\s*/g, ';')
    .replace(/\s*:\s*/g, ':')
    .replace(/\s*,\s*/g, ',')
    .replace(/;}/g, '}')
    .trim();
}

export function beautifyCss(input) {
  const withoutComments = stripCssComments(input).trim();
  let output = '';
  let indent = 0;
  let inString = false;
  let stringChar = '';
  let shouldIndent = true;

  for (let index = 0; index < withoutComments.length; index += 1) {
    const char = withoutComments[index];
    const next = withoutComments[index + 1];

    if (inString) {
      output += char;
      if (char === '\\') {
        output += next || '';
        index += 1;
      } else if (char === stringChar) {
        inString = false;
      }
      continue;
    }

    if (char === '"' || char === "'") {
      inString = true;
      stringChar = char;
      output += char;
      continue;
    }

    if (char === '{') {
      output = output.trimEnd() + ' {\n';
      indent += 1;
      shouldIndent = true;
      continue;
    }

    if (char === '}') {
      output = output.trimEnd() + '\n';
      indent = Math.max(0, indent - 1);
      output += `${'  '.repeat(indent)}}`;
      if (next && next !== '}') {
        output += '\n';
        shouldIndent = true;
      }
      continue;
    }

    if (char === ';') {
      output = output.trimEnd() + ';\n';
      shouldIndent = true;
      continue;
    }

    if (char === '\n' || char === '\r') {
      continue;
    }

    if (shouldIndent && !/\s/.test(char)) {
      output += `${'  '.repeat(indent)}`;
      shouldIndent = false;
    }

    output += char;
  }

  return output.replace(/\n{3,}/g, '\n\n').trim();
}

export function encodeHtml(input) {
  return escapeHtml(input);
}

export function decodeHtml(input) {
  return input
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&');
}

export function diffLines(left, right) {
  const a = left.replace(/\r/g, '').split('\n');
  const b = right.replace(/\r/g, '').split('\n');
  const rows = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));

  for (let i = a.length - 1; i >= 0; i -= 1) {
    for (let j = b.length - 1; j >= 0; j -= 1) {
      rows[i][j] = a[i] === b[j] ? rows[i + 1][j + 1] + 1 : Math.max(rows[i + 1][j], rows[i][j + 1]);
    }
  }

  const parts = [];
  let i = 0;
  let j = 0;

  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      parts.push({ type: 'equal', value: a[i], leftLine: i + 1, rightLine: j + 1 });
      i += 1;
      j += 1;
      continue;
    }

    if (rows[i + 1][j] >= rows[i][j + 1]) {
      parts.push({ type: 'remove', value: a[i], leftLine: i + 1 });
      i += 1;
    } else {
      parts.push({ type: 'add', value: b[j], rightLine: j + 1 });
      j += 1;
    }
  }

  while (i < a.length) {
    parts.push({ type: 'remove', value: a[i], leftLine: i + 1 });
    i += 1;
  }

  while (j < b.length) {
    parts.push({ type: 'add', value: b[j], rightLine: j + 1 });
    j += 1;
  }

  const additions = parts.filter((part) => part.type === 'add').length;
  const removals = parts.filter((part) => part.type === 'remove').length;
  const unchanged = parts.filter((part) => part.type === 'equal').length;

  return {
    parts,
    additions,
    removals,
    unchanged,
    unified: parts
      .map((part) => {
        if (part.type === 'add') return `+ ${part.value}`;
        if (part.type === 'remove') return `- ${part.value}`;
        return `  ${part.value}`;
      })
      .join('\n')
  };
}

function parseCronField(value, unitLabel, map = {}) {
  const raw = value.trim();

  if (raw === '*') {
    return `every ${unitLabel}`;
  }

  if (/^\*\/(\d+)$/.test(raw)) {
    const step = raw.match(/^\*\/(\d+)$/)[1];
    return `every ${step} ${Number(step) === 1 ? unitLabel : `${unitLabel}s`}`;
  }

  if (/^(\d+)-(\d+)(?:\/(\d+))?$/.test(raw)) {
    const [, start, end, step] = raw.match(/^(\d+)-(\d+)(?:\/(\d+))?$/);
    const range = `${map[start] || start} through ${map[end] || end}`;
    if (step) {
      return `every ${step} ${Number(step) === 1 ? unitLabel : `${unitLabel}s`} from ${range}`;
    }
    return range;
  }

  if (raw.includes(',')) {
    return raw
      .split(',')
      .map((part) => map[part.trim()] || part.trim())
      .join(', ');
  }

  if (/^\d+$/.test(raw)) {
    return map[raw] || `${unitLabel} ${raw}`;
  }

  return map[raw] || raw;
}

export function explainCronExpression(expression) {
  const trimmed = expression.trim();

  if (!trimmed) {
    throw new Error('Enter a cron expression.');
  }

  const macros = {
    '@yearly': 'Runs once a year.',
    '@annually': 'Runs once a year.',
    '@monthly': 'Runs once a month.',
    '@weekly': 'Runs once a week.',
    '@daily': 'Runs once a day.',
    '@midnight': 'Runs at midnight each day.',
    '@hourly': 'Runs once every hour.'
  };

  if (macros[trimmed.toLowerCase()]) {
    return {
      expression: trimmed,
      description: macros[trimmed.toLowerCase()],
      fields: []
    };
  }

  const parts = trimmed.split(/\s+/);

  if (parts.length !== 5 && parts.length !== 6) {
    throw new Error('Cron expressions usually have 5 or 6 fields.');
  }

  const fieldNames = parts.length === 6
    ? ['Second', 'Minute', 'Hour', 'Day of month', 'Month', 'Day of week']
    : ['Minute', 'Hour', 'Day of month', 'Month', 'Day of week'];

  const fieldDescriptions = parts.map((part, index) => {
    const fieldName = fieldNames[index];

    if (fieldName === 'Month') {
      return {
        field: fieldName,
        value: parseCronField(part, 'month', CRON_MONTH_NAMES)
      };
    }

    if (fieldName === 'Day of week') {
      return {
        field: fieldName,
        value: parseCronField(part, 'day', CRON_WEEKDAY_NAMES)
      };
    }

    return {
      field: fieldName,
      value: parseCronField(part, fieldName.toLowerCase())
    };
  });

  return {
    expression: trimmed,
    description: `Runs ${fieldDescriptions.map((item) => item.value).join(', ')}.`,
    fields: fieldDescriptions
  };
}

export function formatUnixTimestamp(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error('Enter a valid timestamp.');
  }

  return {
    date,
    iso: date.toISOString(),
    utc: date.toUTCString(),
    local: date.toLocaleString(),
    unixSeconds: Math.floor(date.getTime() / 1000),
    unixMilliseconds: date.getTime()
  };
}

export function parseTimestampInput(value, mode = 'auto') {
  const raw = value.trim();

  if (!raw) {
    throw new Error('Enter a timestamp or date.');
  }

  if (mode === 'date') {
    return formatUnixTimestamp(Date.parse(raw));
  }

  if (mode === 'seconds' || mode === 'milliseconds') {
    const parsed = Number(raw);

    if (!Number.isFinite(parsed)) {
      throw new Error('Enter a numeric timestamp.');
    }

    return formatUnixTimestamp(mode === 'seconds' ? parsed * 1000 : parsed);
  }

  if (/^\d+$/.test(raw)) {
    const numeric = Number(raw);
    return formatUnixTimestamp(raw.length <= 10 ? numeric * 1000 : numeric);
  }

  return formatUnixTimestamp(Date.parse(raw));
}

export function markdownToHtml(markdown) {
  const lines = String(markdown || '').replace(/\r/g, '').split('\n');
  const output = [];
  let inCodeBlock = false;
  let codeBuffer = [];
  let inList = false;
  let listType = '';
  let inQuote = false;

  const flushList = () => {
    if (inList) {
      output.push(listType === 'ol' ? '</ol>' : '</ul>');
      inList = false;
      listType = '';
    }
  };

  const flushQuote = () => {
    if (inQuote) {
      output.push('</blockquote>');
      inQuote = false;
    }
  };

  const inline = (value) =>
    escapeHtml(value)
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/~~([^~]+)~~/g, '<del>$1</del>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith('```')) {
      if (inCodeBlock) {
        output.push(`<pre><code>${escapeHtml(codeBuffer.join('\n'))}</code></pre>`);
        codeBuffer = [];
        inCodeBlock = false;
      } else {
        flushList();
        flushQuote();
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      continue;
    }

    if (!trimmed) {
      flushList();
      flushQuote();
      continue;
    }

    if (/^>\s?/.test(trimmed)) {
      flushList();
      if (!inQuote) {
        output.push('<blockquote>');
        inQuote = true;
      }
      output.push(`<p>${inline(trimmed.replace(/^>\s?/, ''))}</p>`);
      continue;
    }

    const heading = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (heading) {
      flushList();
      flushQuote();
      const level = heading[1].length;
      output.push(`<h${level}>${inline(heading[2])}</h${level}>`);
      continue;
    }

    const unordered = trimmed.match(/^[-*+]\s+(.+)$/);
    if (unordered) {
      flushQuote();
      if (!inList || listType !== 'ul') {
        flushList();
        output.push('<ul>');
        inList = true;
        listType = 'ul';
      }
      output.push(`<li>${inline(unordered[1])}</li>`);
      continue;
    }

    const ordered = trimmed.match(/^\d+\.\s+(.+)$/);
    if (ordered) {
      flushQuote();
      if (!inList || listType !== 'ol') {
        flushList();
        output.push('<ol>');
        inList = true;
        listType = 'ol';
      }
      output.push(`<li>${inline(ordered[1])}</li>`);
      continue;
    }

    flushList();
    flushQuote();
    output.push(`<p>${inline(trimmed)}</p>`);
  }

  if (inCodeBlock) {
    output.push(`<pre><code>${escapeHtml(codeBuffer.join('\n'))}</code></pre>`);
  }

  flushList();
  flushQuote();

  return output.join('');
}

export function describeRegex(pattern, flags, input, replacement = '') {
  if (!pattern.trim()) {
    throw new Error('Enter a regular expression pattern.');
  }

  const regex = new RegExp(pattern, flags);
  regex.lastIndex = 0;
  const test = regex.test(input);
  const globalRegex = flags.includes('g') ? regex : new RegExp(pattern, `${flags}g`);
  globalRegex.lastIndex = 0;
  const matches = [...input.matchAll(globalRegex)].map((match) => ({
    match: match[0],
    index: match.index,
    groups: match.slice(1),
    namedGroups: match.groups || {}
  }));

  return {
    test,
    flags,
    pattern,
    matches,
    replaced: replacement ? input.replace(regex, replacement) : ''
  };
}

export function summarizeJwt(token) {
  const { header, payload, signature, signatureLength } = decodeJwt(token);
  const exp = payload && typeof payload === 'object' ? payload.exp : undefined;
  const iat = payload && typeof payload === 'object' ? payload.iat : undefined;
  const nbf = payload && typeof payload === 'object' ? payload.nbf : undefined;

  return {
    header,
    payload,
    signature,
    signatureLength,
    issuedAt: typeof iat === 'number' ? new Date(iat * 1000).toISOString() : null,
    expiresAt: typeof exp === 'number' ? new Date(exp * 1000).toISOString() : null,
    notBefore: typeof nbf === 'number' ? new Date(nbf * 1000).toISOString() : null
  };
}

export function formatColorSummary({ r, g, b }) {
  const hsl = rgbToHsl(r, g, b);

  return {
    hex: rgbToHex(r, g, b),
    rgb: { r, g, b },
    hsl,
    rgbText: formatRgb({ r, g, b }),
    hslText: formatHsl(hsl)
  };
}
