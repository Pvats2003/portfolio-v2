import type { Metadata } from 'next';
import { IBM_Plex_Mono, IBM_Plex_Sans } from 'next/font/google';
import type { CSSProperties, ReactNode } from 'react';
import { ctas, flagship, headlineOptions, stats, subline } from '@/content/lab';
import { SpecSheet, type Spec } from '@/components/lab/SpecSheet';

// Only this direction's fonts, so this page downloads nothing else.
const plexSans = IBM_Plex_Sans({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-plex-sans' });
const plexMono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-plex-mono' });
const fontsA = `${plexSans.variable} ${plexMono.variable}`;

export const metadata: Metadata = { title: 'Direction A · Field Log' };

const headline = headlineOptions.find((h) => h.id === 'A')!;

const spec: Spec = {
  direction: 'A · Field Log',
  says: 'An operator who writes things down.',
  display: 'IBM Plex Sans',
  text: 'IBM Plex Mono for log metadata',
  licence: 'both SIL Open Font Licence, self-hosted via next/font',
  motif:
    'The shift gutter: every section is a log entry stamped SOD / MOD / EOD in a left-hand timestamp column, on ruled lines over a quiet dot grid. Status chips (LIVE, BEING INTEGRATED) come from the ops reports he runs.',
  motion:
    '“Entries get logged”: secondary blocks fade in top-to-bottom once, 70 ms apart. The headline is never animated, so reading never waits. Off under reduced motion.',
  themeNote: 'Paper by default; “night shift” dark follows the OS or the toggle.',
  swatches: [
    { name: 'bg', light: '#f3eee4', dark: '#17140f' },
    { name: 'surface', light: '#fbf8f2', dark: '#201c16' },
    { name: 'ink', light: '#1e1a15', dark: '#eee7da' },
    { name: 'muted', light: '#5e564b', dark: '#aba190' },
    { name: 'line', light: '#d6ccbb', dark: '#3b352c' },
    { name: 'accent', light: '#a63a1b', dark: '#f08a5d' },
    { name: 'ok', light: '#2f6b3a', dark: '#7cc48a' },
  ],
};

function Chip({ children, tone = 'muted' }: { children: ReactNode; tone?: 'muted' | 'ok' | 'accent' }) {
  const color = tone === 'ok' ? 'text-ok border-ok' : tone === 'accent' ? 'text-accent border-accent' : 'text-muted border-line';
  return (
    <span className={`inline-flex items-center gap-1.5 border px-1.5 py-0.5 font-mono text-[11px] uppercase tracking-wider ${color}`}>
      {tone === 'ok' && <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-ok" />}
      {children}
    </span>
  );
}

/** One log entry: shift marker in the gutter, content on the right. */
function Entry({ shift, label, children, id }: { shift: string; label: string; children: ReactNode; id?: string }) {
  return (
    <section id={id} aria-labelledby={id ? `${id}-h` : undefined} className="grid gap-3 border-t border-line py-10 sm:grid-cols-[7rem_1fr] sm:gap-8 sm:py-14">
      <div className="font-mono text-xs text-muted sm:pt-1.5">
        <span className="font-medium text-accent">{shift}</span>
        <span className="mx-1.5 sm:hidden">·</span>
        <span className="sm:mt-1 sm:block">{label}</span>
      </div>
      <div className="min-w-0">{children}</div>
    </section>
  );
}

export default function FieldLogLab() {
  return (
    <>
    <div className={`dir-a a-grid ${fontsA}`}>
      <main id="main" className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="pt-10 font-mono text-xs uppercase tracking-wider text-muted sm:pt-16">
          Ops log · Priyanshu Vats · Bengaluru
        </p>

        <Entry shift="SOD" label="Start of day">
          <h1 className="max-w-3xl font-display text-[2.1rem] font-semibold leading-[1.1] tracking-tight sm:text-5xl lg:text-[3.5rem]">
            {headline.lines[0]} <span className="text-muted">{headline.lines[1]}</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">{subline}</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href={ctas.primary.href} className="inline-flex min-h-11 items-center bg-ink px-5 text-sm font-medium text-bg hover:bg-accent hover:text-on-accent">
              {ctas.primary.label} <span aria-hidden className="ml-2">→</span>
            </a>
            <a href={ctas.secondary.href} className="inline-flex min-h-11 items-center border border-ink px-5 font-mono text-sm hover:bg-ink hover:text-bg">
              {ctas.secondary.label}
            </a>
          </div>
        </Entry>

        <Entry shift="MOD" label="Mid-day report">
          <h2 className="sr-only">Proof</h2>
          <ul className="grid grid-cols-1 border-l border-t border-line sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s, i) => (
              <li
                key={s.key}
                className="a-log-in border-b border-r border-line bg-surface/70 p-5"
                style={{ '--i': i } as CSSProperties}
              >
                <p className="font-mono text-[11px] uppercase tracking-wider text-muted">{s.key}</p>
                <p className={`mt-3 font-display font-semibold tabular leading-none ${s.count ? 'text-4xl' : 'text-2xl'}`}>{s.value}</p>
                <p className="mt-2 text-sm leading-snug text-muted">{s.label}</p>
              </li>
            ))}
          </ul>
        </Entry>

        <Entry shift="EOD" label="Shipped" id="flagship">
          <article className="a-log-in border border-line bg-surface" style={{ '--i': 4 } as CSSProperties}>
            <header className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-5 py-3">
              <p className="font-mono text-xs uppercase tracking-wider text-muted">{flagship.eyebrow}</p>
              <div className="flex gap-2">
                <Chip tone="ok">{flagship.status}</Chip>
                <Chip>{flagship.period}</Chip>
              </div>
            </header>
            <div className="grid gap-8 p-5 sm:p-8 lg:grid-cols-[1.2fr_1fr]">
              <div>
                <h2 id="flagship-h" className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">{flagship.title}</h2>
                <p className="mt-1 font-mono text-xs text-muted">{flagship.kicker}</p>
                <p className="mt-5 max-w-lg text-base leading-relaxed">{flagship.summary}</p>
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
                <p className="mt-5 text-xs text-muted">{flagship.stack.join(' · ')}</p>
              </div>
            </div>
            <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-5 py-3">
              <p className="flex items-center gap-2 text-sm">
                <Chip tone="accent">Being integrated</Chip>
                <span className="text-muted">{flagship.outcome}</span>
              </p>
              <a href="#flagship" className="font-mono text-sm underline decoration-line underline-offset-4 hover:decoration-accent">
                {flagship.cta} →
              </a>
            </footer>
          </article>
        </Entry>
      </main>
      <footer className="mx-auto max-w-6xl border-t border-line px-4 py-6 font-mono text-xs text-muted sm:px-6">
        End of log · direction A
      </footer>
    </div>
    <SpecSheet spec={spec} />
    </>
  );
}
