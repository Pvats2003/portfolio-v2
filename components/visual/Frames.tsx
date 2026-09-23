import type { ReactNode } from 'react';

// Device frames in Field Log tokens: hairline borders, surface chrome, mono labels. Theme-aware.

export function DemoTag() {
  return (
    <span className="whitespace-nowrap border border-line bg-bg px-1.5 py-0.5 font-mono text-[0.6875rem] uppercase tracking-wider text-muted">
      Demo data
    </span>
  );
}

/** A browser window: three dots, an address bar, then the screenshot. */
export function BrowserFrame({ bar, demo, children }: { bar?: string; demo?: boolean; children: ReactNode }) {
  return (
    <div className="overflow-hidden border border-line bg-surface">
      <div className="flex items-center gap-3 border-b border-line px-3 py-2">
        <span aria-hidden className="flex gap-1.5">
          <span className="h-2 w-2 rounded-full border border-line bg-bg" />
          <span className="h-2 w-2 rounded-full border border-line bg-bg" />
          <span className="h-2 w-2 rounded-full border border-line bg-bg" />
        </span>
        {bar && <span className="min-w-0 flex-1 truncate bg-bg px-2 py-0.5 font-mono text-[0.6875rem] text-muted">{bar}</span>}
        {!bar && <span className="flex-1" />}
        {demo && <DemoTag />}
      </div>
      <div className="relative">{children}</div>
    </div>
  );
}

/** A phone: ink outline, speaker slot, rounded screen. */
export function PhoneFrame({ demo, children }: { demo?: boolean; children: ReactNode }) {
  return (
    <div>
      <div className="rounded-[1.75rem] border-2 border-ink bg-surface p-1.5">
        <div aria-hidden className="mx-auto mb-1.5 mt-0.5 h-1 w-10 rounded-full bg-line" />
        <div className="relative overflow-hidden rounded-[1.25rem] border border-line">{children}</div>
      </div>
      {demo && (
        <p className="mt-2 text-center">
          <DemoTag />
        </p>
      )}
    </div>
  );
}

/** A diagram sheet: dot-grid paper with a mono label, for projects that have no screenshot. */
export function DiagramSheet({ label = 'Diagram', fit = false, children }: { label?: string; fit?: boolean; children: ReactNode }) {
  return (
    <div className="overflow-hidden border border-line bg-surface">
      <div className="flex items-center justify-between border-b border-line px-3 py-2 font-mono text-[0.6875rem] uppercase tracking-wider text-muted">
        <span>{label}</span>
      </div>
      {/* Cards use the screenshots' proportions so a row lines up; `fit` lets a large diagram size itself. */}
      <div className={`dot-grid flex items-center p-3 sm:p-4 ${fit ? 'sm:p-6' : 'aspect-[1890/826] overflow-hidden'}`}>{children}</div>
    </div>
  );
}
