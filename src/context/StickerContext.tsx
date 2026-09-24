'use client';

import {
  createContext,
  useCallback,
  useContext,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react';
import { STICKERS } from '@/lib/stickers';

const STORAGE_KEY = 'tifltoys.stickers.v1';

interface StickerContextType {
  /** Ids of stickers found this browser, restored from localStorage on mount. */
  found: Set<string>;
  foundCount: number;
  total: number;
  isFound: (id: string) => boolean;
  /** Marks a sticker as found. Returns true only the first time (so callers
   *  can gate the celebration animation to a genuine new find). */
  find: (id: string) => boolean;
  /** True once every sticker has been found. */
  complete: boolean;
  /** Have we finished reading localStorage yet? Avoids a flash of "not found"
   *  stickers rendering as findable right before they're revealed as found. */
  hydrated: boolean;
}

const StickerContext = createContext<StickerContextType | null>(null);

function readStorage(): Set<string> {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const ids = JSON.parse(raw);
    return Array.isArray(ids) ? new Set(ids.filter((id) => typeof id === 'string')) : new Set();
  } catch {
    // Private browsing / storage disabled / corrupted value — start empty.
    return new Set();
  }
}

function writeStorage(found: Set<string>) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...found]));
  } catch {
    // Best-effort only; the hunt still works for the current page view.
  }
}

// Standard SSR-safe "have we hydrated yet" flag via useSyncExternalStore
// (React's recommended replacement for a setState-in-effect mount flag):
// getServerSnapshot always returns false, getSnapshot returns true, and the
// store never changes, so this just flips once on the client after hydration.
function useHydrated() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function StickerProvider({ children }: { children: ReactNode }) {
  // Lazy-init from localStorage so the client's first render already has the
  // right state (SSR always renders the `new Set()` branch since `window` is
  // undefined there, then hydrates from storage on the client's first pass —
  // same "empty" value either way, so there's no hydration mismatch).
  const [found, setFound] = useState<Set<string>>(() =>
    typeof window === 'undefined' ? new Set() : readStorage(),
  );
  const hydrated = useHydrated();

  const isFound = useCallback((id: string) => found.has(id), [found]);

  const find = useCallback((id: string) => {
    let didAdd = false;
    setFound((prev) => {
      if (prev.has(id)) return prev;
      didAdd = true;
      const next = new Set(prev);
      next.add(id);
      writeStorage(next);
      return next;
    });
    return didAdd;
  }, []);

  const total = STICKERS.length;

  return (
    <StickerContext.Provider
      value={{
        found,
        foundCount: found.size,
        total,
        isFound,
        find,
        complete: found.size >= total,
        hydrated,
      }}
    >
      {children}
    </StickerContext.Provider>
  );
}

export function useStickers() {
  const ctx = useContext(StickerContext);
  if (!ctx) throw new Error('useStickers must be used within StickerProvider');
  return ctx;
}
