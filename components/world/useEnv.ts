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

export type Probe = {
  verdict: 'ok' | 'weak' | 'none';
  /** Plain-language reason shown to the visitor when the 3D is skipped. */
  reason?: string;
  /** What the browser reported, for "why?" details. */
  details: string;
};

/**
 * Can this device run the scene? Checked before any 3D code is downloaded (WORLD.md §5).
 * Deliberately conservative about saying no: CPU thread counts are not used (many good laptops report 4, and
 * privacy modes in Brave and Firefox report fake low numbers). Real frame rate is measured once the scene is up.
 */
export function probeDevice(): Probe {
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  const strict = tryContext({ failIfMajorPerformanceCaveat: true });
  const loose = strict.ok ? strict : tryContext({});
  const details = [
    `renderer: ${loose.renderer ?? 'unknown'}`,
    `hardware-accelerated: ${strict.ok ? 'yes' : 'no'}`,
    `memory: ${nav.deviceMemory ? `${nav.deviceMemory} GB` : 'not reported'}`,
    `threads: ${nav.hardwareConcurrency ?? 'not reported'} (not used)`,
    `data saver: ${nav.connection?.saveData ? 'on' : 'off'}`,
  ].join(' · ');
  if (!loose.ok) return { verdict: 'none', reason: 'this browser has WebGL turned off or unavailable', details };
  if (!strict.ok)
    return {
      verdict: 'weak',
      reason: 'the browser is drawing 3D without the graphics card (hardware acceleration may be off), so it would be slow',
      details,
    };
  if (nav.connection?.saveData) return { verdict: 'weak', reason: 'Data Saver is on', details };
  if (nav.deviceMemory && nav.deviceMemory < 4) return { verdict: 'weak', reason: 'this device reports under 4 GB of memory', details };
  return { verdict: 'ok', details };
}

function tryContext(attrs: WebGLContextAttributes): { ok: boolean; renderer?: string } {
  try {
    const c = document.createElement('canvas');
    const gl = (c.getContext('webgl2', attrs) ?? c.getContext('webgl', attrs)) as WebGLRenderingContext | null;
    if (!gl) return { ok: false };
    const dbg = gl.getExtension('WEBGL_debug_renderer_info');
    const renderer = dbg ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL)) : undefined;
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return { ok: true, renderer };
  } catch {
    return { ok: false };
  }
}
