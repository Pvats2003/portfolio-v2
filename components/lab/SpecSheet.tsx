export type Swatch = { name: string; light: string; dark: string };

export type Spec = {
  direction: string;
  says: string;
  display: string;
  text: string;
  licence: string;
  motif: string;
  motion: string;
  themeNote?: string;
  swatches: Swatch[];
};

// Neutral review panel (outside the direction's own styling).
export function SpecSheet({ spec }: { spec: Spec }) {
  return (
    <aside aria-label="Direction spec" className="border-t border-line bg-bg font-[system-ui] text-ink">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <h2 className="text-sm font-semibold">Spec — {spec.direction}</h2>
        <p className="mt-1 max-w-2xl text-sm text-muted">Says: “{spec.says}”</p>
        <dl className="mt-6 grid gap-x-8 gap-y-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs uppercase tracking-wide text-muted">Type pairing</dt>
            <dd className="mt-1">
              {spec.display} (display) + {spec.text} (text) — {spec.licence}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-muted">Signature motif</dt>
            <dd className="mt-1">{spec.motif}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-muted">Motion principle</dt>
            <dd className="mt-1">{spec.motion}</dd>
          </div>
          {spec.themeNote && (
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted">Themes</dt>
              <dd className="mt-1">{spec.themeNote}</dd>
            </div>
          )}
        </dl>
        <table className="mt-6 w-full max-w-xl text-left text-xs">
          <caption className="sr-only">Colour tokens</caption>
          <thead className="text-muted">
            <tr>
              <th scope="col" className="py-1 font-normal">Token</th>
              <th scope="col" className="py-1 font-normal">Light</th>
              <th scope="col" className="py-1 font-normal">Dark</th>
            </tr>
          </thead>
          <tbody>
            {spec.swatches.map((s) => (
              <tr key={s.name} className="border-t border-line">
                <th scope="row" className="py-1.5 font-mono font-normal">{s.name}</th>
                {[s.light, s.dark].map((hex) => (
                  <td key={hex} className="py-1.5">
                    <span className="inline-flex items-center gap-2 font-mono">
                      <span aria-hidden className="h-4 w-4 rounded-sm border border-line" style={{ background: hex }} />
                      {hex}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </aside>
  );
}
