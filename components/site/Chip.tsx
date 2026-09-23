import type { ReactNode } from 'react';
import type { ChipTone } from '@/content/types';

/** Status chip, as used in daily ops reports: LIVE, BEING INTEGRATED, dates. */
export function Chip({ children, tone = 'muted' }: { children: ReactNode; tone?: ChipTone }) {
  const color =
    tone === 'ok' ? 'text-ok border-ok' : tone === 'accent' ? 'text-accent border-accent' : 'text-muted border-line';
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap border px-1.5 py-0.5 font-mono text-xs uppercase tracking-wider ${color}`}>
      {tone === 'ok' && <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-ok" />}
      {children}
    </span>
  );
}
