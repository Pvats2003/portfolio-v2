import type { ReactNode } from 'react';

/**
 * One log entry: a marker in the timestamp column (SOD / EOD or an entry number),
 * a short label under it, and the content on the right. The site's core layout unit.
 */
export function LogSection({
  id,
  marker,
  label,
  heading,
  children,
  className = '',
  hideHeading = false,
  stack = false,
}: {
  id?: string;
  marker: string;
  label: string;
  /** Visible section heading. Omit only when the content supplies its own h1/h2. */
  heading?: string;
  children: ReactNode;
  className?: string;
  /** Heading kept for screen readers and the outline, but not shown (when it would only repeat the label). */
  hideHeading?: boolean;
  /** Marker and label sit above the content (full width) instead of in the timestamp column. */
  stack?: boolean;
}) {
  const headingId = id ? `${id}-h` : undefined;
  return (
    <section
      id={id}
      aria-labelledby={heading ? headingId : undefined}
      className={`grid scroll-mt-4 gap-4 border-t border-line py-10 sm:gap-8 sm:py-16 ${stack ? 'sm:gap-6' : 'sm:grid-cols-[7rem_1fr]'} ${className}`}
    >
      <p className={`font-mono text-xs text-muted ${stack ? '' : 'sm:pt-1.5'}`}>
        <span className="font-medium text-accent">{marker}</span>
        <span aria-hidden className={`mx-1.5 ${stack ? '' : 'sm:hidden'}`}>
          ·
        </span>
        <span className={`uppercase tracking-wider ${stack ? '' : 'sm:mt-1 sm:block'}`}>{label}</span>
      </p>
      <div className="min-w-0">
        {heading && (
          <h2 id={headingId} className={hideHeading ? 'sr-only' : 'mb-8 max-w-2xl text-2xl font-semibold leading-tight tracking-tight sm:text-3xl'}>
            {heading}
          </h2>
        )}
        {children}
      </div>
    </section>
  );
}
