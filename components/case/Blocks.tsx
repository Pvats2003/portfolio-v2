import { Fragment } from 'react';
import type { Block } from '@/content/types';
import { Chip } from '@/components/site/Chip';

// Renderers for the richer case-study blocks. All hand-built, theme-aware, and readable at 375px.

type Of<T extends Block['type']> = Extract<Block, { type: T }>;

/** Stages in a flow: a horizontal row with arrows on wide screens, a numbered vertical list on phones. */
export function Pipeline({ block }: { block: Of<'pipeline'> }) {
  return (
    <figure className="max-w-4xl">
      <ol className="grid gap-0 border-l border-line lg:flex lg:flex-wrap lg:items-stretch lg:gap-y-3 lg:border-l-0">
        {block.steps.map((s, i) => (
          <Fragment key={s.label}>
            <li className="relative flex gap-3 py-2 pl-4 lg:block lg:w-[9.5rem] lg:flex-none lg:border lg:border-line lg:bg-surface lg:px-3 lg:py-3">
              <span aria-hidden className="absolute -left-[5px] top-4 h-2 w-2 rounded-full border border-line bg-bg lg:hidden" />
              <span className="font-mono text-xs text-accent tabular lg:block">{String(i + 1).padStart(2, '0')}</span>
              <span>
                <span className={`block text-sm font-semibold leading-snug ${s.accent ? 'text-accent' : ''}`}>{s.label}</span>
                {s.detail && <span className="mt-0.5 block text-xs leading-snug text-muted">{s.detail}</span>}
              </span>
            </li>
            {i < block.steps.length - 1 && (
              <li aria-hidden className="hidden items-center px-1 text-muted lg:flex">
                <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M2 8h11M9 4l4 4-4 4" />
                </svg>
              </li>
            )}
          </Fragment>
        ))}
      </ol>
      <figcaption className="mt-3 font-mono text-xs text-muted">{block.caption}</figcaption>
    </figure>
  );
}

export function Personas({ block }: { block: Of<'personas'> }) {
  return (
    <div className="grid max-w-4xl gap-4 md:grid-cols-3">
      {block.items.map((p) => (
        <article key={p.title} aria-label={`Persona: ${p.title}`} className="flex flex-col border border-line bg-surface">
          <header className="border-b border-line px-4 py-3">
            <Chip tone={p.tier === 'Primary' ? 'accent' : 'muted'}>{p.tier}</Chip>
            <h3 className="mt-3 text-lg font-semibold leading-snug">{p.title}</h3>
            <p className="mt-1 text-sm text-muted">{p.role}</p>
            <p className="mt-1 font-mono text-xs text-muted">{p.context}</p>
          </header>
          <dl className="space-y-3 px-4 py-3 text-sm leading-snug">
            {(
              [
                ['Pain', p.pain],
                ['Goal', p.goal],
                ['Today', p.today],
              ] as const
            ).map(([k, v]) => (
              <div key={k}>
                <dt className="font-mono text-xs uppercase tracking-wider text-muted">{k}</dt>
                <dd className="mt-0.5">{v}</dd>
              </div>
            ))}
          </dl>
        </article>
      ))}
    </div>
  );
}

export function Board({ block }: { block: Of<'board'> }) {
  return (
    <figure className="max-w-4xl">
      <div className="grid gap-4 md:grid-cols-3">
        {block.columns.map((col) => (
          <section key={col.label} aria-label={col.label} className="border border-line bg-surface">
            <h3 className="flex items-center justify-between border-b border-line px-4 py-2.5 font-mono text-xs font-medium uppercase tracking-wider">
              {col.label}
              <span className="text-muted tabular">{col.items.length}</span>
            </h3>
            <ul className="divide-y divide-line">
              {col.items.map((item) => (
                <li key={item.id ?? item.text} className="px-4 py-3 text-sm leading-snug">
                  <div className="flex items-center justify-between gap-2">
                    {item.id && <span className="font-mono text-xs text-muted">{item.id}</span>}
                    {item.status && <Chip tone={item.status.tone}>{item.status.label}</Chip>}
                  </div>
                  <p className="mt-1.5">{item.text}</p>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <figcaption className="mt-3 font-mono text-xs text-muted">{block.caption}</figcaption>
    </figure>
  );
}

export function BeforeAfter({ block }: { block: Of<'beforeAfter'> }) {
  return (
    <div className="grid max-w-3xl items-stretch gap-3 sm:grid-cols-[1fr_auto_1.4fr]">
      <div className="border border-dashed border-line px-4 py-4">
        <p className="font-mono text-xs uppercase tracking-wider text-muted">{block.before.label}</p>
        <ul className="mt-2 space-y-1 font-mono text-sm text-muted">
          {block.before.points.map((p) => (
            <li key={p} className="line-through decoration-accent/70">
              {p}
            </li>
          ))}
        </ul>
      </div>
      <div aria-hidden className="flex items-center justify-center text-accent">
        <svg viewBox="0 0 16 16" className="h-5 w-5 rotate-90 sm:rotate-0" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M2 8h11M9 4l4 4-4 4" />
        </svg>
      </div>
      <div className="border border-line border-l-2 border-l-accent bg-surface px-4 py-4">
        <p className="font-mono text-xs uppercase tracking-wider text-muted">{block.after.label}</p>
        <ul className="mt-2 space-y-1.5 text-sm leading-snug">
          {block.after.points.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function DataTable({ block }: { block: Of<'table'> }) {
  return (
    <div className="max-w-[38rem]">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <caption className="pb-3 text-left font-mono text-xs uppercase tracking-wider text-muted">{block.caption}</caption>
          <thead>
            <tr className="border-b border-ink">
              {block.head.map((h) => (
                <th key={h} scope="col" className="py-2 pr-4 font-mono text-xs font-normal uppercase tracking-wider text-muted">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row) => (
              <tr key={row.join('|')} className="border-b border-line align-top">
                {row.map((cell, i) =>
                  i === 0 ? (
                    <th key={i} scope="row" className={`py-2.5 pr-4 font-medium ${cell.length <= 10 ? 'font-mono text-xs' : 'text-sm'}`}>
                      {cell}
                    </th>
                  ) : (
                    <td key={i} className="py-2.5 pr-4 leading-snug">
                      {cell}
                    </td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {block.note && <p className="mt-3 text-xs leading-relaxed text-muted">{block.note}</p>}
    </div>
  );
}
