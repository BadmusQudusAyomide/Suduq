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

function toNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toBoolean(value) {
  return value === true || value === 'true' || value === 1 || value === '1' || value === 'on';
}

export function executeTextTool(toolKey, input, controlValues = {}) {
  switch (toolKey) {
    case 'counter':
      return JSON.stringify(countText(input), null, 2);
    case 'case': {
      switch (controlValues.mode) {
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
    case 'lorem':
      return generateLorem(toNumber(controlValues.paragraphs, 3));
    case 'json':
      return JSON.stringify(JSON.parse(input), null, toNumber(controlValues.indent, 2));
    case 'base64':
      return controlValues.mode === 'decode' ? decodeBase64(input) : encodeBase64(input);
    case 'url':
      return controlValues.mode === 'decode' ? decodeUrl(input) : encodeUrl(input);
    case 'password':
      return generatePassword(toNumber(controlValues.length, 16), {
        lowercase: toBoolean(controlValues.lowercase),
        uppercase: toBoolean(controlValues.uppercase),
        numbers: toBoolean(controlValues.numbers),
        symbols: toBoolean(controlValues.symbols)
      });
    case 'uuid':
      return generateUuid();
    case 'hash':
      return controlValues.algorithm === 'md5' ? md5Hash(input) : sha256Hash(input);
    default:
      throw new Error(`No client executor is registered for "${toolKey}".`);
  }
}

export async function runTool(tool, input, controlValues = {}) {
  if (!tool) {
    throw new Error('Tool not found.');
  }

  if (tool.category === 'text' && tool.execution === 'client') {
    return executeTextTool(tool.key, input, controlValues);
  }

  throw new Error(`Execution for "${tool.key}" is handled elsewhere.`);
}
