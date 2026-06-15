import { useEffect, useMemo, useState } from 'react';
import { getToolByPath } from '../lib/tool-registry';

const STORAGE_KEY = 'suduq.recentTools';
const MAX_ITEMS = 5;

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

export function useRecentTools(pathname) {
  const [paths, setPaths] = useState([]);

  useEffect(() => {
    setPaths(readStoredPaths());
  }, []);

  useEffect(() => {
    const tool = getToolByPath(pathname);

    if (!tool) {
      return;
    }

    const nextPaths = [tool.path, ...readStoredPaths().filter((path) => path !== tool.path)];
    writeStoredPaths(nextPaths);
    setPaths(nextPaths.slice(0, MAX_ITEMS));
  }, [pathname]);

  return useMemo(() => {
    return paths
      .map((path) => getToolByPath(path))
      .filter(Boolean)
      .slice(0, MAX_ITEMS);
  }, [paths]);
}
