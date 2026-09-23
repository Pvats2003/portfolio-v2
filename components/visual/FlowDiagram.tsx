import { Fragment } from 'react';

/** A compact left-to-right flow of labelled boxes; wraps on narrow cards. Used where there is no screenshot. */
export function FlowDiagram({ steps, label }: { steps: { label: string; detail?: string; accent?: boolean }[]; label: string }) {
  return (
    <ol aria-label={label} className="flex w-full flex-wrap items-center gap-x-1.5 gap-y-2">
      {steps.map((s, i) => (
        <Fragment key={s.label}>
          <li
            className={`border bg-surface px-2.5 py-1.5 ${s.accent ? 'border-accent' : 'border-line'}`}
          >
            <span className={`block text-xs font-semibold leading-tight ${s.accent ? 'text-accent' : ''}`}>{s.label}</span>
            {s.detail && <span className="block font-mono text-[0.6875rem] leading-tight text-muted">{s.detail}</span>}
          </li>
          {i < steps.length - 1 && (
            <li aria-hidden className="text-muted">
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M2 8h11M9 4l4 4-4 4" />
              </svg>
            </li>
          )}
        </Fragment>
      ))}
    </ol>
  );
}
