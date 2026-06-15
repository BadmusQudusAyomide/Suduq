import { useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'suduq.videoDownloadHistory';
const MAX_ITEMS = 12;

function readHistory() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeHistory(items) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, MAX_ITEMS)));
}

export function useVideoDownloadHistory() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    setHistory(readHistory());
  }, []);

  const upsertHistoryItem = (entry) => {
    setHistory((current) => {
      const existing = current.find((item) => item.id === entry.id);
      const next = existing
        ? current.map((item) => (item.id === entry.id ? { ...item, ...entry } : item))
        : [entry, ...current];

      writeHistory(next);
      return next.slice(0, MAX_ITEMS);
    });
  };

  const clearHistory = () => {
    setHistory([]);
    writeHistory([]);
  };

  return useMemo(
    () => ({
      history,
      upsertHistoryItem,
      clearHistory
    }),
    [history]
  );
}
