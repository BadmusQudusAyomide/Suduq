export function formatFileSize(bytes) {
  if (!bytes && bytes !== 0) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function getFileStem(name) {
  return name.replace(/\.[^.]+$/, '');
}

export async function copyText(value) {
  if (!value) {
    return false;
  }

  await navigator.clipboard.writeText(value);
  return true;
}

export function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Failed to read file.'));
    reader.readAsDataURL(file);
  });
}

export function rgbToHex(r, g, b) {
  return `#${[r, g, b]
    .map((value) => value.toString(16).padStart(2, '0'))
    .join('')}`;
}

export function formatRgb(color) {
  return `rgb(${color.r}, ${color.g}, ${color.b})`;
}

export function extractPalette(imageData, limit = 6) {
  const buckets = new Map();
  const { data } = imageData;

  for (let index = 0; index < data.length; index += 4) {
    const alpha = data[index + 3];
    if (alpha < 32) {
      continue;
    }

    const r = Math.round(data[index] / 32) * 32;
    const g = Math.round(data[index + 1] / 32) * 32;
    const b = Math.round(data[index + 2] / 32) * 32;
    const key = `${r},${g},${b}`;
    buckets.set(key, (buckets.get(key) || 0) + 1);
  }

  return [...buckets.entries()]
    .sort((left, right) => right[1] - left[1])
    .slice(0, limit)
    .map(([key, count]) => {
      const [r, g, b] = key.split(',').map(Number);
      return {
        hex: rgbToHex(r, g, b),
        rgb: { r, g, b },
        count
      };
    });
}
