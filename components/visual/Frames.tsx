import type { ReactNode } from 'react';

// One frame system in Field Log tokens: every visual sits on a Plate, inside a BrowserFrame or PhoneFrame.
// Same radius, border, shadow and padding everywhere, in both themes.

export type PlateTag = 'Demo data' | 'Illustration';

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="whitespace-nowrap rounded-full border border-line bg-surface px-2 py-0.5 font-mono text-[0.6875rem] uppercase tracking-wider text-muted">
      {children}
    </span>
  );
}

/** The tinted presentation plate behind a visual. `tag` labels demo data or illustrations. */
export function Plate({
  tag,
  children,
  className = '',
  pad = 'p-4 sm:p-8',
}: {
  tag?: PlateTag;
  children: ReactNode;
  className?: string;
  pad?: string;
}) {
  return (
    <div className={`plate relative overflow-hidden ${pad} ${className}`}>
      {tag && (
        <span className="absolute right-3 top-3 z-10 sm:right-4 sm:top-4">
          <Tag>{tag}</Tag>
        </span>
      )}
      {children}
    </div>
  );
}

/** Minimal browser chrome: three dots and, optionally, the address. */
export function BrowserFrame({ bar, children }: { bar?: string; children: ReactNode }) {
  return (
    <div className="frame-shadow overflow-hidden rounded-frame border border-line bg-surface">
      <div className="flex items-center gap-3 border-b border-line px-3 py-1.5">
        <span aria-hidden className="flex gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-line" />
          <span className="h-1.5 w-1.5 rounded-full bg-line" />
          <span className="h-1.5 w-1.5 rounded-full bg-line" />
        </span>
        {bar && <span className="min-w-0 truncate font-mono text-[0.625rem] text-muted">{bar}</span>}
      </div>
      <div className="relative overflow-hidden">{children}</div>
    </div>
  );
}

/** A simple phone bezel. No notch art, no reflections. */
export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="frame-shadow rounded-[1.75rem] border border-line bg-surface p-1.5">
      <div className="relative overflow-hidden rounded-[1.35rem] border border-line">{children}</div>
    </div>
  );
}
