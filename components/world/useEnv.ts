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

export type Probe = 'ok' | 'weak' | 'none';

/** Can this device run the scene smoothly? Checked before any 3D code is downloaded (WORLD.md §5). */
export function probeDevice(): Probe {
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  const strict = tryContext({ failIfMajorPerformanceCaveat: true });
  if (!strict) return tryContext({}) ? 'weak' : 'none';
  if (nav.connection?.saveData) return 'weak';
  if (nav.deviceMemory && nav.deviceMemory < 4) return 'weak';
  if (nav.hardwareConcurrency && nav.hardwareConcurrency <= 4) return 'weak';
  return 'ok';
}

function tryContext(attrs: WebGLContextAttributes): boolean {
  try {
    const c = document.createElement('canvas');
    const gl = (c.getContext('webgl2', attrs) ?? c.getContext('webgl', attrs)) as WebGLRenderingContext | null;
    if (!gl) return false;
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return true;
  } catch {
    return false;
  }
}
