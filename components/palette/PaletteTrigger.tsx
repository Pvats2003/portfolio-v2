'use client';

import { lazy, Suspense, useEffect, useState, useSyncExternalStore } from 'react';
import type { PaletteItem } from '@/content/palette';

// The palette itself (cmdk) is only downloaded the first time someone opens it or hovers the button,
// so it costs nothing on first load.
const CommandPalette = lazy(() => import('./CommandPalette'));

const noop = () => () => {};
const isApple = () => /Mac|iPhone|iPad/.test(navigator.platform);

export function PaletteTrigger({ items }: { items: PaletteItem[] }) {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const apple = useSyncExternalStore(noop, isApple, () => false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && !e.altKey && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setLoaded(true);
        setOpen((o) => !o);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <button
        type="button"
        aria-haspopup="dialog"
        aria-keyshortcuts="Meta+K Control+K"
        onPointerEnter={() => setLoaded(true)}
        onFocus={() => setLoaded(true)}
        onClick={() => {
          setLoaded(true);
          setOpen(true);
        }}
        className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 font-mono text-xs uppercase tracking-wider text-muted hover:text-ink sm:min-w-0"
      >
        <svg aria-hidden viewBox="0 0 16 16" className="h-4 w-4 sm:hidden" fill="none" stroke="currentColor" strokeWidth="1.6">
          <circle cx="7" cy="7" r="4.5" />
          <path d="M10.5 10.5L14 14" />
        </svg>
        <span className="sr-only sm:not-sr-only">Jump to</span>
        <kbd className="hidden rounded-sm border border-line px-1.5 py-0.5 font-mono text-xs normal-case tracking-normal sm:inline">
          {apple ? '⌘K' : 'Ctrl K'}
        </kbd>
      </button>
      {loaded && (
        <Suspense fallback={null}>
          <CommandPalette items={items} open={open} onClose={() => setOpen(false)} />
        </Suspense>
      )}
    </>
  );
}
