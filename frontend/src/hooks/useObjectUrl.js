import { useEffect, useState } from 'react';

export function useObjectUrl(value) {
  const [url, setUrl] = useState('');

  useEffect(() => {
    if (!value) {
      setUrl('');
      return undefined;
    }

    const nextUrl = URL.createObjectURL(value);
    setUrl(nextUrl);

    return () => {
      URL.revokeObjectURL(nextUrl);
    };
  }, [value]);

  return url;
}
