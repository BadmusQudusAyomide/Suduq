export function countText(text) {
  const trimmed = text.trim();
  const words = trimmed ? trimmed.match(/\b[\p{L}\p{N}'’-]+\b/gu) || [] : [];
  const sentences = trimmed ? trimmed.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [] : [];
  const lines = text ? text.split(/\r?\n/).length : 0;

  return {
    words: words.length,
    characters: text.length,
    charactersNoSpaces: text.replace(/\s/g, '').length,
    sentences: sentences.filter((part) => part.trim()).length,
    lines
  };
}

export function toTitleCase(text) {
  return text
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .replace(/\s+/g, ' ')
    .trim();
}

export function toCamelCase(text) {
  const parts = text
    .replace(/[_-]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.toLowerCase());

  if (!parts.length) {
    return '';
  }

  return parts[0] + parts.slice(1).map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join('');
}

export function toSnakeCase(text) {
  return text
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/[\s-]+/g, '_')
    .replace(/__+/g, '_')
    .toLowerCase();
}

export function encodeBase64(text) {
  return window.btoa(unescape(encodeURIComponent(text)));
}

export function decodeBase64(text) {
  return decodeURIComponent(escape(window.atob(text.trim())));
}

export function encodeUrl(text) {
  return encodeURIComponent(text);
}

export function decodeUrl(text) {
  return decodeURIComponent(text);
}

export function generateLorem(paragraphs = 3) {
  const source = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
  ];

  return Array.from({ length: Math.max(1, paragraphs) }, (_, index) => {
    const first = source[index % source.length];
    const second = source[(index + 1) % source.length];
    const third = source[(index + 2) % source.length];
    return `${first} ${second} ${third}`;
  }).join('\n\n');
}

export function formatJsonText(text) {
  const parsed = JSON.parse(text);
  return JSON.stringify(parsed, null, 2);
}

export function generatePassword(length = 16, options = {}) {
  const {
    lowercase = true,
    uppercase = true,
    numbers = true,
    symbols = true
  } = options;

  const sets = [];
  if (lowercase) sets.push('abcdefghijklmnopqrstuvwxyz');
  if (uppercase) sets.push('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
  if (numbers) sets.push('0123456789');
  if (symbols) sets.push('!@#$%^&*()-_=+[]{};:,.<>?');

  const pool = sets.join('');
  if (!pool) {
    return '';
  }

  const cryptoObj = window.crypto || window.msCrypto;
  const randomValues = new Uint32Array(length);
  cryptoObj.getRandomValues(randomValues);

  return Array.from({ length }, (_, index) => {
    const bucket = sets[index % sets.length];
    const bucketChar = bucket[randomValues[index] % bucket.length];
    return bucketChar || pool[randomValues[index] % pool.length];
  }).join('');
}

export function generateUuid() {
  return window.crypto.randomUUID();
}

export async function sha256Hash(text) {
  const encoder = new TextEncoder();
  const buffer = await window.crypto.subtle.digest('SHA-256', encoder.encode(text));
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

function rotateLeft(value, count) {
  return (value << count) | (value >>> (32 - count));
}

function addUnsigned(left, right) {
  const lsw = left & 0xffff;
  const msw = left >>> 16;
  const rsw = right & 0xffff;
  const mswRight = right >>> 16;
  const low = (lsw + rsw) & 0xffff;
  const high = (msw + mswRight + ((lsw + rsw) >>> 16)) & 0xffff;
  return (high << 16) | low;
}

function md5cmn(q, a, b, x, s, t) {
  return addUnsigned(rotateLeft(addUnsigned(addUnsigned(a, q), addUnsigned(x, t)), s), b);
}

function md5ff(a, b, c, d, x, s, t) {
  return md5cmn((b & c) | (~b & d), a, b, x, s, t);
}

function md5gg(a, b, c, d, x, s, t) {
  return md5cmn((b & d) | (c & ~d), a, b, x, s, t);
}

function md5hh(a, b, c, d, x, s, t) {
  return md5cmn(b ^ c ^ d, a, b, x, s, t);
}

function md5ii(a, b, c, d, x, s, t) {
  return md5cmn(c ^ (b | ~d), a, b, x, s, t);
}

function toWordArray(input) {
  const message = unescape(encodeURIComponent(input));
  const length = message.length;
  const words = [];

  for (let i = 0; i < length; i += 1) {
    words[i >> 2] = words[i >> 2] || 0;
    words[i >> 2] |= message.charCodeAt(i) << ((i % 4) * 8);
  }

  words[length >> 2] = words[length >> 2] || 0;
  words[length >> 2] |= 0x80 << ((length % 4) * 8);
  words[(((length + 8) >> 6) * 16) + 14] = length * 8;

  return words;
}

function wordToHex(value) {
  let output = '';
  for (let i = 0; i <= 3; i += 1) {
    const byte = (value >>> (i * 8)) & 0xff;
    output += byte.toString(16).padStart(2, '0');
  }
  return output;
}

export function md5Hash(text) {
  const x = toWordArray(text);
  let a = 0x67452301;
  let b = 0xefcdab89;
  let c = 0x98badcfe;
  let d = 0x10325476;

  for (let i = 0; i < x.length; i += 16) {
    const aa = a;
    const bb = b;
    const cc = c;
    const dd = d;

    a = md5ff(a, b, c, d, x[i + 0] || 0, 7, 0xd76aa478);
    d = md5ff(d, a, b, c, x[i + 1] || 0, 12, 0xe8c7b756);
    c = md5ff(c, d, a, b, x[i + 2] || 0, 17, 0x242070db);
    b = md5ff(b, c, d, a, x[i + 3] || 0, 22, 0xc1bdceee);
    a = md5ff(a, b, c, d, x[i + 4] || 0, 7, 0xf57c0faf);
    d = md5ff(d, a, b, c, x[i + 5] || 0, 12, 0x4787c62a);
    c = md5ff(c, d, a, b, x[i + 6] || 0, 17, 0xa8304613);
    b = md5ff(b, c, d, a, x[i + 7] || 0, 22, 0xfd469501);
    a = md5ff(a, b, c, d, x[i + 8] || 0, 7, 0x698098d8);
    d = md5ff(d, a, b, c, x[i + 9] || 0, 12, 0x8b44f7af);
    c = md5ff(c, d, a, b, x[i + 10] || 0, 17, 0xffff5bb1);
    b = md5ff(b, c, d, a, x[i + 11] || 0, 22, 0x895cd7be);
    a = md5ff(a, b, c, d, x[i + 12] || 0, 7, 0x6b901122);
    d = md5ff(d, a, b, c, x[i + 13] || 0, 12, 0xfd987193);
    c = md5ff(c, d, a, b, x[i + 14] || 0, 17, 0xa679438e);
    b = md5ff(b, c, d, a, x[i + 15] || 0, 22, 0x49b40821);

    a = md5gg(a, b, c, d, x[i + 1] || 0, 5, 0xf61e2562);
    d = md5gg(d, a, b, c, x[i + 6] || 0, 9, 0xc040b340);
    c = md5gg(c, d, a, b, x[i + 11] || 0, 14, 0x265e5a51);
    b = md5gg(b, c, d, a, x[i + 0] || 0, 20, 0xe9b6c7aa);
    a = md5gg(a, b, c, d, x[i + 5] || 0, 5, 0xd62f105d);
    d = md5gg(d, a, b, c, x[i + 10] || 0, 9, 0x02441453);
    c = md5gg(c, d, a, b, x[i + 15] || 0, 14, 0xd8a1e681);
    b = md5gg(b, c, d, a, x[i + 4] || 0, 20, 0xe7d3fbc8);
    a = md5gg(a, b, c, d, x[i + 9] || 0, 5, 0x21e1cde6);
    d = md5gg(d, a, b, c, x[i + 14] || 0, 9, 0xc33707d6);
    c = md5gg(c, d, a, b, x[i + 3] || 0, 14, 0xf4d50d87);
    b = md5gg(b, c, d, a, x[i + 8] || 0, 20, 0x455a14ed);
    a = md5gg(a, b, c, d, x[i + 13] || 0, 5, 0xa9e3e905);
    d = md5gg(d, a, b, c, x[i + 2] || 0, 9, 0xfcefa3f8);
    c = md5gg(c, d, a, b, x[i + 7] || 0, 14, 0x676f02d9);
    b = md5gg(b, c, d, a, x[i + 12] || 0, 20, 0x8d2a4c8a);

    a = md5hh(a, b, c, d, x[i + 5] || 0, 4, 0xfffa3942);
    d = md5hh(d, a, b, c, x[i + 8] || 0, 11, 0x8771f681);
    c = md5hh(c, d, a, b, x[i + 11] || 0, 16, 0x6d9d6122);
    b = md5hh(b, c, d, a, x[i + 14] || 0, 23, 0xfde5380c);
    a = md5hh(a, b, c, d, x[i + 1] || 0, 4, 0xa4beea44);
    d = md5hh(d, a, b, c, x[i + 4] || 0, 11, 0x4bdecfa9);
    c = md5hh(c, d, a, b, x[i + 7] || 0, 16, 0xf6bb4b60);
    b = md5hh(b, c, d, a, x[i + 10] || 0, 23, 0xbebfbc70);
    a = md5hh(a, b, c, d, x[i + 13] || 0, 4, 0x289b7ec6);
    d = md5hh(d, a, b, c, x[i + 0] || 0, 11, 0xeaa127fa);
    c = md5hh(c, d, a, b, x[i + 3] || 0, 16, 0xd4ef3085);
    b = md5hh(b, c, d, a, x[i + 6] || 0, 23, 0x04881d05);
    a = md5hh(a, b, c, d, x[i + 9] || 0, 4, 0xd9d4d039);
    d = md5hh(d, a, b, c, x[i + 12] || 0, 11, 0xe6db99e5);
    c = md5hh(c, d, a, b, x[i + 15] || 0, 16, 0x1fa27cf8);
    b = md5hh(b, c, d, a, x[i + 2] || 0, 23, 0xc4ac5665);

    a = md5ii(a, b, c, d, x[i + 0] || 0, 6, 0xf4292244);
    d = md5ii(d, a, b, c, x[i + 7] || 0, 10, 0x432aff97);
    c = md5ii(c, d, a, b, x[i + 14] || 0, 15, 0xab9423a7);
    b = md5ii(b, c, d, a, x[i + 5] || 0, 21, 0xfc93a039);
    a = md5ii(a, b, c, d, x[i + 12] || 0, 6, 0x655b59c3);
    d = md5ii(d, a, b, c, x[i + 3] || 0, 10, 0x8f0ccc92);
    c = md5ii(c, d, a, b, x[i + 10] || 0, 15, 0xffeff47d);
    b = md5ii(b, c, d, a, x[i + 1] || 0, 21, 0x85845dd1);
    a = md5ii(a, b, c, d, x[i + 8] || 0, 6, 0x6fa87e4f);
    d = md5ii(d, a, b, c, x[i + 15] || 0, 10, 0xfe2ce6e0);
    c = md5ii(c, d, a, b, x[i + 6] || 0, 15, 0xa3014314);
    b = md5ii(b, c, d, a, x[i + 13] || 0, 21, 0x4e0811a1);
    a = md5ii(a, b, c, d, x[i + 4] || 0, 6, 0xf7537e82);
    d = md5ii(d, a, b, c, x[i + 11] || 0, 10, 0xbd3af235);
    c = md5ii(c, d, a, b, x[i + 2] || 0, 15, 0x2ad7d2bb);
    b = md5ii(b, c, d, a, x[i + 9] || 0, 21, 0xeb86d391);

    a = addUnsigned(a, aa);
    b = addUnsigned(b, bb);
    c = addUnsigned(c, cc);
    d = addUnsigned(d, dd);
  }

  return (wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d)).toLowerCase();
}
