'use client';

import { useSyncExternalStore } from 'react';

/** Day (light theme) or night (dark theme), following the site's theme control and the OS setting. */
export function useSiteMood(): 'day' | 'night' {
  return useSyncExternalStore(subscribeTheme, readMood, () => 'day');
}

function readMood(): 'day' | 'night' {
  const t = document.documentElement.dataset.theme;
  if (t === 'light') return 'day';
  if (t === 'dark') return 'night';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'night' : 'day';
}

function subscribeTheme(cb: () => void) {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  mq.addEventListener('change', cb);
  return () => {
    mo.disconnect();
    mq.removeEventListener('change', cb);
  };
}

export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      mq.addEventListener('change', cb);
      return () => mq.removeEventListener('change', cb);
    },
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    () => false,
  );
}
