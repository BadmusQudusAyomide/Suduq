const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || '';

export function apiUrl(path) {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  if (!rawBaseUrl) {
    return normalizedPath;
  }

  return `${rawBaseUrl.replace(/\/+$/, '')}${normalizedPath}`;
}
