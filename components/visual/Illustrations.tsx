// Illustrations for projects with no screenshot. Built only from sourced facts, always shown with an
// "Illustration" tag. No real plate numbers, no invented metrics.

function Check() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 text-ok" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M3 8.5l3 3 7-7" />
    </svg>
  );
}
function Stop() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 text-accent" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="8" cy="8" r="6" />
      <path d="M4 12l8-8" />
    </svg>
  );
}
function Human() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 text-accent" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <circle cx="8" cy="5" r="2.5" />
      <path d="M3 14c.6-3 2.6-4.5 5-4.5s4.4 1.5 5 4.5" />
    </svg>
  );
}

/** Career OS: the pipeline as a status card, with the real test count as the hero stat. */
export function CareerOsIllustration() {
  const stages = [
    { label: 'Discover', detail: 'Greenhouse · Lever', icon: <Check /> }, // R-P2.1
    { label: 'De-duplicate', detail: 'cross-source', icon: <Check /> }, // R-P2.1
    { label: 'Match', detail: 'rules, then AI', icon: <Check /> }, // R-P2.1
    { label: 'Hard stops', detail: 'salary · visa · MFA', icon: <Human /> }, // R-P2.2
    { label: 'Submit', detail: 'never automatic', icon: <Stop /> }, // R-P2.2
  ];
  return (
    <div className="frame-shadow w-full max-w-[22rem] rounded-frame border border-line bg-surface p-4">
      <p className="flex items-center justify-between font-mono text-[0.625rem] uppercase tracking-wider text-muted">
        <span>Career OS · pipeline</span>
        <span className="text-ok">● passing</span>
      </p>
      <p className="mt-3 flex items-baseline gap-2">
        <span className="text-4xl font-semibold leading-none tracking-tight tabular sm:text-5xl">350</span>
        <span className="text-sm text-muted">tests passing</span>
      </p>
      <ul className="mt-3 divide-y divide-line border-t border-line text-xs">
        {stages.map((s) => (
          <li key={s.label} className="flex items-center justify-between gap-3 py-1">
            <span className="font-semibold">{s.label}</span>
            <span className="flex items-center gap-2 font-mono text-[0.625rem] text-muted">
              {s.detail}
              {s.icon}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** ANPR: a stylised camera frame with a detection box around a placeholder plate. Camera colours in both themes. */
export function AnprIllustration() {
  return (
    <svg
      viewBox="0 0 400 250"
      role="img"
      aria-label="Illustration: a detection box labelled plate, drawn around a placeholder number plate reading XX 00 XX 0000 on a stylised car."
      className="frame-shadow block h-auto w-full rounded-frame"
    >
      <rect width="400" height="250" rx="10" fill="#16130f" />
      <path d="M0 250 L150 150 L250 150 L400 250 Z" fill="#221e18" />
      {/* car */}
      <path d="M95 205 L120 120 Q125 105 145 102 L255 102 Q275 105 280 120 L305 205 Z" fill="#2e2922" stroke="#4a4338" strokeWidth="2" />
      <path d="M135 125 Q140 112 155 111 L245 111 Q260 112 265 125 L272 150 L128 150 Z" fill="#1b1814" />
      <circle cx="128" cy="172" r="9" fill="#eee7da" opacity=".75" />
      <circle cx="272" cy="172" r="9" fill="#eee7da" opacity=".75" />
      <rect x="85" y="200" width="230" height="14" rx="4" fill="#26221c" />
      {/* plate */}
      <rect x="152" y="166" width="96" height="24" rx="3" fill="#eee7da" />
      <text x="200" y="183" textAnchor="middle" fontFamily="var(--font-plex-mono), monospace" fontSize="12" fontWeight="500" fill="#17140f">
        XX 00 XX 0000
      </text>
      {/* detection box */}
      <rect x="146" y="160" width="108" height="36" fill="none" stroke="#f08a5d" strokeWidth="2.5" />
      <rect x="146" y="145" width="42" height="15" fill="#f08a5d" />
      <text x="151" y="156" fontFamily="var(--font-plex-mono), monospace" fontSize="9.5" fontWeight="500" fill="#17140f">
        plate
      </text>
      {/* HUD corners */}
      <g stroke="#aba190" strokeWidth="2" fill="none" opacity=".7">
        <path d="M18 38 V18 H38" />
        <path d="M362 18 H382 V38" />
        <path d="M18 212 V232 H38" />
        <path d="M382 212 V232 H362" />
      </g>
      <text x="30" y="46" fontFamily="var(--font-plex-mono), monospace" fontSize="10" fill="#aba190">
        YOLOv8n · detect
      </text>
    </svg>
  );
}

/** ITC powerhouse: a simplified single-line diagram — three supply paths, a changeover, 15+ boards. Theme-aware. */
export function ItcIllustration() {
  const mono = { fontFamily: 'var(--font-plex-mono), monospace' };
  const sources = [
    { x: 40, label: 'RUPS' },
    { x: 160, label: 'BYPASS' },
    { x: 280, label: 'DG' },
  ];
  return (
    <svg
      viewBox="0 0 400 250"
      role="img"
      aria-label="Illustration: a single-line diagram with three supply paths — RUPS, bypass and DG — meeting at a changeover, feeding a busbar and 15 or more sub-distribution boards."
      className="frame-shadow block h-auto w-full rounded-frame"
    >
      <rect width="400" height="250" rx="10" fill="var(--surface)" stroke="var(--line)" />
      {sources.map((s) => (
        <g key={s.label}>
          <rect x={s.x} y="22" width="80" height="30" rx="4" fill="var(--bg)" stroke="var(--line)" />
          <text x={s.x + 40} y="41" textAnchor="middle" fontSize="11" fontWeight="500" fill="var(--ink)" style={mono}>
            {s.label}
          </text>
          <path d={`M${s.x + 40} 52 V78 H200 V96`} fill="none" stroke="var(--muted)" strokeWidth="1.5" />
        </g>
      ))}
      {/* changeover */}
      <circle cx="200" cy="108" r="12" fill="var(--bg)" stroke="var(--accent)" strokeWidth="2" />
      <path d="M193 114 L207 101" stroke="var(--accent)" strokeWidth="2" />
      <text x="220" y="112" fontSize="10" fill="var(--accent)" style={mono}>
        changeover
      </text>
      <path d="M200 120 V140" stroke="var(--ink)" strokeWidth="2" />
      {/* busbar */}
      <path d="M40 140 H360" stroke="var(--ink)" strokeWidth="4" strokeLinecap="round" />
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const x = 52 + i * 52;
        return (
          <g key={i}>
            <path d={`M${x + 14} 140 V168`} stroke="var(--muted)" strokeWidth="1.5" />
            <rect x={x} y="168" width="28" height="24" rx="3" fill="var(--bg)" stroke="var(--line)" />
            <text x={x + 14} y="184" textAnchor="middle" fontSize="8" fill="var(--muted)" style={mono}>
              SDB
            </text>
          </g>
        );
      })}
      <text x="200" y="222" textAnchor="middle" fontSize="11" fill="var(--ink)" style={mono}>
        15+ sub-distribution boards
      </text>
    </svg>
  );
}

export const illustrations = { 'career-os': CareerOsIllustration, anpr: AnprIllustration, itc: ItcIllustration } as const;
export type IllustrationName = keyof typeof illustrations;
