import { apiUrl } from './api-base';

export async function processImage(endpoint, file, fields = {}) {
  const formData = new FormData();
  formData.append('file', file);

  Object.entries(fields).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      formData.append(key, String(value));
    }
  });

  const response = await fetch(apiUrl(endpoint), {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Image processing failed');
  }

  return response.blob();
}
