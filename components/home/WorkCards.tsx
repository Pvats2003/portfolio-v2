import Link from 'next/link';
import type { CSSProperties } from 'react';
import { Chip } from '@/components/site/Chip';
import type { WorkCard } from '@/content/work';
import { flagship } from '@/content/work';

/** The flagship card: before → after, trade-off, outcome. */
export function FlagshipCard() {
  return (
    <article aria-labelledby="flagship-title" className="log-in border border-line bg-surface" style={{ '--i': 4 } as CSSProperties}>
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-5 py-3">
        <p className="font-mono text-xs uppercase tracking-wider text-muted">Flagship · Instawork Robotics Labs</p>
        <div className="flex flex-wrap gap-2">
          {flagship.chips.map((c) => (
            <Chip key={c.label} tone={c.tone}>
              {c.label}
            </Chip>
          ))}
        </div>
      </header>
      <div className="grid gap-8 p-5 sm:p-8 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <h3 id="flagship-title" className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {flagship.title}
          </h3>
          <p className="mt-1 font-mono text-xs text-muted">Local-first operating system for city field ops</p>
          <p className="mt-5 max-w-lg text-base leading-relaxed sm:text-lg">{flagship.summary}</p>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted">
            <span className="font-mono text-xs uppercase tracking-wider text-accent">Trade-off · </span>
            {flagship.tradeoff}
          </p>
        </div>
        <div className="font-mono text-sm">
          <p className="text-xs uppercase tracking-wider text-muted">Before</p>
          <ol className="mt-2 space-y-1.5">
            {flagship.before.map((b, i) => (
              <li key={b} className="flex gap-3 border-b border-dashed border-line pb-1.5 text-muted">
                <span className="tabular">{String(i + 1).padStart(2, '0')}</span>
                <span className="line-through decoration-accent/70">{b}</span>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-xs uppercase tracking-wider text-muted">After</p>
          <p className="mt-2 border-l-2 border-accent pl-3 text-base text-ink">{flagship.after}</p>
          <p className="mt-5 text-xs text-muted">{flagship.stack}</p>
        </div>
      </div>
      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-5 py-3">
        <p className="flex flex-wrap items-center gap-2 text-sm">
          <Chip tone="accent">Being integrated</Chip>
          <span className="text-muted">{flagship.outcome}</span>
        </p>
        <Link
          href={flagship.href!}
          className="inline-flex min-h-11 items-center font-mono text-sm underline decoration-line underline-offset-4 hover:decoration-accent"
        >
          Read the decision log →
        </Link>
      </footer>
    </article>
  );
}

/** Work card: links to its case study, plus an optional external link (e.g. a live product). */
export function WorkCardView({ card, compact = false }: { card: WorkCard; compact?: boolean }) {
  return (
    <article aria-labelledby={`${card.slug}-title`} className="flex flex-col border border-line bg-surface">
      <div className="flex-1 p-5 sm:p-6">
        <div className="flex flex-wrap gap-2">
          {card.chips.map((c) => (
            <Chip key={c.label} tone={c.tone}>
              {c.label}
            </Chip>
          ))}
        </div>
        <h3 id={`${card.slug}-title`} className={`mt-4 font-semibold tracking-tight ${compact ? 'text-xl' : 'text-2xl'}`}>
          {card.title}
        </h3>
        <p className="mt-1 font-mono text-xs text-muted">{card.kicker}</p>
        <p className="mt-4 text-base leading-relaxed">{card.summary}</p>
        {card.points.length > 0 && (
          <ul className="mt-3 space-y-1.5 text-sm leading-relaxed text-muted">
            {card.points.map((p) => (
              <li key={p} className="grid grid-cols-[1rem_1fr]">
                <span aria-hidden className="font-mono text-accent">
                  —
                </span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        )}
        {card.quote && (
          <p className="mt-5 border-l-2 border-accent pl-3 font-serif text-lg leading-snug">{card.quote}</p>
        )}
      </div>
      <footer className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-line px-5 py-3 sm:px-6">
        <span className="font-mono text-xs text-muted">{card.stack ?? ''}</span>
        <span className="flex flex-wrap gap-x-5">
          {card.external && (
            <a
              href={card.external.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center font-mono text-sm underline decoration-line underline-offset-4 hover:decoration-accent"
            >
              {card.external.label} ↗<span className="sr-only"> (opens in a new tab)</span>
            </a>
          )}
          {card.href && (
            <Link href={card.href} className="inline-flex min-h-11 items-center font-mono text-sm underline decoration-line underline-offset-4 hover:decoration-accent">
              Case study →
            </Link>
          )}
        </span>
      </footer>
    </article>
  );
}
