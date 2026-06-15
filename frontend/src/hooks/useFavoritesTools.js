import { useEffect, useMemo, useState } from 'react';
import { getToolByPath } from '../lib/tool-registry';

const STORAGE_KEY = 'suduq.favoriteTools';
const MAX_ITEMS = 6;

function readStoredPaths() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeStoredPaths(paths) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(paths.slice(0, MAX_ITEMS)));
}

export function useFavoritesTools() {
  const [paths, setPaths] = useState([]);

  useEffect(() => {
    setPaths(readStoredPaths());
  }, []);

  const favoriteTools = useMemo(() => {
    return paths.map((path) => getToolByPath(path)).filter(Boolean).slice(0, MAX_ITEMS);
  }, [paths]);

  const isFavorite = (path) => paths.includes(path);

  const toggleFavorite = (toolOrPath) => {
    const path = typeof toolOrPath === 'string' ? toolOrPath : toolOrPath.path;
    const nextPaths = isFavorite(path)
      ? paths.filter((item) => item !== path)
      : [path, ...paths].slice(0, MAX_ITEMS);

    setPaths(nextPaths);
    writeStoredPaths(nextPaths);
  };

  return {
    favoriteTools,
    favoriteCount: favoriteTools.length,
    isFavorite,
    toggleFavorite
  };
}
