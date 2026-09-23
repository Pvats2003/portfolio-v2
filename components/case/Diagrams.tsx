import { fourSystems } from '@/content/projects/city-ops-os';

// Hand-built, theme-aware diagrams. Labels are real HTML text (readable and selectable at 375px);
// SVG draws only the connecting lines, and stretches to fit whatever height the labels take.

/** Turning point: one city's ops spread across four separate systems (R-E1.4, R-P1.1). */
export function SprawlDiagram() {
  return (
    <figure className="relative max-w-3xl">
      <div className="relative grid grid-cols-2 gap-x-6 gap-y-10 sm:gap-x-16 sm:gap-y-14">
        <svg aria-hidden viewBox="0 0 100 100" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full">
          {[
            [25, 25],
            [75, 25],
            [25, 75],
            [75, 75],
          ].map(([x, y]) => (
            <line key={`${x}-${y}`} x1="50" y1="50" x2={x} y2={y} stroke="currentColor" strokeOpacity="0.45" strokeWidth="1" strokeDasharray="3 3" vectorEffect="non-scaling-stroke" />
          ))}
        </svg>
        {fourSystems.map((s) => (
          <div key={s.name} className="relative border border-current/30 bg-ink p-3 sm:p-4">
            <p className="font-mono text-xs uppercase tracking-wider sm:text-sm">{s.name}</p>
            <p className="mt-1 text-xs text-line sm:text-sm">{s.from}</p>
          </div>
        ))}
        <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-current bg-ink px-3 py-1 font-mono text-xs uppercase tracking-wider">
          1 city
        </p>
      </div>
      <figcaption className="mt-4 font-mono text-xs text-line">Four separate systems for a single city.</figcaption>
    </figure>
  );
}

/** What was built: the four systems consolidated into one per-city view (R-P1.1). */
export function ConvergeDiagram() {
  const ys = [12.5, 37.5, 62.5, 87.5];
  return (
    <figure className="max-w-[38rem] border border-line bg-surface p-4 sm:p-6">
      <div className="grid grid-cols-[minmax(0,auto)_2.5rem_minmax(0,1fr)] items-center gap-x-2 sm:grid-cols-[minmax(0,auto)_5rem_minmax(0,1fr)] sm:gap-x-3">
        <ul className="grid grid-rows-4">
          {fourSystems.map((s) => (
            <li key={s.name} className="flex h-10 flex-col justify-center text-right">
              <span className="font-mono text-xs text-muted line-through decoration-accent/60">{s.name}</span>
            </li>
          ))}
        </ul>
        <svg aria-hidden viewBox="0 0 100 100" preserveAspectRatio="none" className="h-40 w-full">
          {ys.map((y) => (
            <path key={y} d={`M0 ${y} C 55 ${y}, 45 50, 100 50`} fill="none" stroke="var(--line)" strokeWidth="1.25" vectorEffect="non-scaling-stroke" />
          ))}
          <path d="M70 50 L100 50" stroke="var(--accent)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
        </svg>
        <div className="border-l-2 border-accent pl-3">
          <p className="font-sans text-lg font-semibold leading-tight sm:text-xl">City Ops OS</p>
          <p className="mt-1 font-mono text-xs text-muted">one per-city view</p>
        </div>
      </div>
      <figcaption className="mt-4 font-mono text-xs text-muted">
        Before → after: four systems consolidated into one local-first app.
      </figcaption>
    </figure>
  );
}
