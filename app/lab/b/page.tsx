import type { Metadata } from 'next';
import { Barlow, Barlow_Condensed, IBM_Plex_Mono } from 'next/font/google';
import type { ReactNode } from 'react';
import { ctas, flagship, headlineOptions, stats, subline } from '@/content/lab';
import { CountUp } from '@/components/lab/CountUp';
import { SpecSheet, type Spec } from '@/components/lab/SpecSheet';

// Only this direction's fonts, so this page downloads nothing else.
const barlow = Barlow({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-barlow' });
const barlowCondensed = Barlow_Condensed({ subsets: ['latin'], weight: ['500', '600'], variable: '--font-barlow-condensed' });
const plexMono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400'], variable: '--font-plex-mono' });
const fontsB = `${barlow.variable} ${barlowCondensed.variable} ${plexMono.variable}`;

export const metadata: Metadata = { title: 'Direction B · Control Room' };

const headline = headlineOptions.find((h) => h.id === 'B')!;

const spec: Spec = {
  direction: 'B · Control Room',
  says: 'Runs systems at scale.',
  display: 'Barlow Condensed',
  text: 'Barlow, with IBM Plex Mono for channel labels',
  licence: 'all SIL Open Font Licence, self-hosted via next/font',
  motif:
    'The data line: a single 1 px signal rail runs down the page, with a node where each panel plugs in. Panels are labelled like instrument channels (CH-01…). No glows, gradients or neon — near-black, hairlines, and one sodium-amber accent reserved for status and the primary action.',
  motion:
    '“Instruments settle”: counters tick up once when they enter view, one slow pulse marks live status, and a faint scan tick travels the rail. Real values are in the HTML from the start; all motion is off under reduced motion.',
  themeNote: 'Dark by identity. The light “day shift” theme only applies when chosen with the toggle.',
  swatches: [
    { name: 'bg', light: '#edf1f2', dark: '#0a0d0e' },
    { name: 'surface', light: '#f9fbfb', dark: '#10161a' },
    { name: 'ink', light: '#0d1417', dark: '#e3eaec' },
    { name: 'muted', light: '#4c5b62', dark: '#8d9ea5' },
    { name: 'line', light: '#c7d2d6', dark: '#22303a' },
    { name: 'accent', light: '#9a5800', dark: '#f5a524' },
  ],
};

function Panel({ channel, title, children, id, status }: { channel: string; title: string; children: ReactNode; id?: string; status?: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${channel}-h`} className="relative border border-line bg-surface">
      {/* node where the panel plugs into the data line */}
      <span aria-hidden className="absolute -left-[calc(1.5rem+4.5px)] top-5 hidden h-2 w-2 rounded-full border border-accent bg-bg lg:-left-[calc(2.5rem+4.5px)] sm:block" />
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-2.5 sm:px-5">
        <h2 id={`${channel}-h`} className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
          {channel} · {title}
        </h2>
        {status}
      </header>
      {children}
    </section>
  );
}

function FourToOne() {
  // Resume R-P1.1: four separate systems consolidated into one per-city view.
  const ys = [12.5, 37.5, 62.5, 87.5];
  return (
    <figure aria-label="Four systems consolidated into one per-city view" className="grid grid-cols-[minmax(0,auto)_3.5rem_minmax(0,1fr)] items-center gap-x-2 sm:grid-cols-[minmax(0,auto)_5rem_minmax(0,1fr)]">
      <ul className="grid grid-rows-4 font-mono text-xs text-muted">
        {flagship.before.map((b) => (
          <li key={b} className="flex h-8 items-center justify-end whitespace-nowrap text-right">{b}</li>
        ))}
      </ul>
      <svg aria-hidden viewBox="0 0 100 100" preserveAspectRatio="none" className="h-32 w-full">
        {ys.map((y) => (
          <path key={y} d={`M0 ${y} C 55 ${y}, 45 50, 100 50`} fill="none" stroke="var(--line)" strokeWidth="1.25" vectorEffect="non-scaling-stroke" />
        ))}
      </svg>
      <p className="flex items-center gap-2 font-display text-lg font-medium uppercase leading-tight tracking-wide">
        <span aria-hidden className="h-2.5 w-2.5 shrink-0 rounded-full bg-accent" />
        {flagship.after}
      </p>
    </figure>
  );
}

export default function ControlRoomLab() {
  return (
    <>
      <div className={`dir-b ${fontsB}`}>
        <main id="main" className="relative mx-auto max-w-6xl px-4 pb-16 sm:px-6">
          {/* the data line */}
          <div aria-hidden className="pointer-events-none absolute bottom-0 left-4 top-0 hidden w-px overflow-hidden bg-line sm:left-6 sm:block lg:left-6">
            <span className="b-scan block h-24 w-px bg-gradient-to-b from-transparent via-accent/60 to-transparent" />
          </div>

          <div className="sm:pl-6 lg:pl-10">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line py-4 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
              <span>Ops console · Priyanshu Vats · Bengaluru</span>
              <span className="flex items-center gap-2">
                <span aria-hidden className="b-pulse h-1.5 w-1.5 rounded-full bg-accent" />
                Available for APM · Product Ops · Founder’s Office
              </span>
            </div>

            <section aria-labelledby="hero-h" className="py-14 sm:py-20">
              <h1 id="hero-h" className="max-w-4xl font-display font-semibold uppercase leading-[0.95] tracking-tight">
                <span className="block text-[2.6rem] sm:text-6xl lg:text-7xl tabular">{headline.lines[0]}</span>
                <span className="mt-4 block max-w-3xl text-xl font-medium normal-case leading-snug tracking-normal text-muted sm:text-2xl">
                  {headline.lines[1]}
                </span>
              </h1>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-muted">{subline}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href={ctas.primary.href} className="inline-flex min-h-11 items-center bg-accent px-5 font-display text-base font-semibold uppercase tracking-wide text-on-accent hover:brightness-110">
                  {ctas.primary.label}
                </a>
                <a href={ctas.secondary.href} className="inline-flex min-h-11 items-center border border-line px-5 font-display text-base font-medium uppercase tracking-wide hover:border-ink">
                  {ctas.secondary.label}
                </a>
              </div>
            </section>

            <div className="space-y-6">
              <Panel channel="CH-01" title="Field telemetry">
                <ul className="grid grid-cols-2 lg:grid-cols-4">
                  {stats.map((s, i) => (
                    <li key={s.key} className={`border-line p-4 sm:p-5 ${i % 2 === 1 ? 'border-l' : ''} ${i >= 2 ? 'border-t lg:border-t-0' : ''} ${i === 2 ? 'lg:border-l' : ''}`}>
                      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">{s.key}</p>
                      <p className={`mt-2 font-display font-semibold tabular leading-none ${s.count ? 'text-4xl sm:text-5xl' : 'text-2xl uppercase sm:text-3xl'}`}>
                        {s.count ? <CountUp to={s.count} suffix={s.suffix} /> : s.value}
                      </p>
                      <p className="mt-2 text-sm leading-snug text-muted">{s.label}</p>
                    </li>
                  ))}
                </ul>
              </Panel>

              <Panel
                channel="CH-02"
                title={flagship.eyebrow}
                id="flagship"
                status={
                  <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em]">
                    <span aria-hidden className="b-pulse h-1.5 w-1.5 rounded-full bg-accent" />
                    <span className="text-accent">{flagship.status}</span>
                    <span className="text-muted">· {flagship.period}</span>
                  </span>
                }
              >
                <div className="grid gap-8 p-4 sm:p-6 lg:grid-cols-[1fr_1.1fr] lg:gap-12">
                  <div>
                    <h3 className="font-display text-4xl font-semibold uppercase tracking-tight sm:text-5xl">{flagship.title}</h3>
                    <p className="mt-1 font-mono text-xs text-muted">{flagship.kicker}</p>
                    <p className="mt-5 max-w-md text-base leading-relaxed">{flagship.summary}</p>
                  </div>
                  <FourToOne />
                </div>
                <dl className="grid border-t border-line text-sm sm:grid-cols-3">
                  <div className="p-4 sm:p-5">
                    <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">Trade-off</dt>
                    <dd className="mt-1.5 leading-snug">{flagship.tradeoff}</dd>
                  </div>
                  <div className="border-t border-line p-4 sm:border-l sm:border-t-0 sm:p-5">
                    <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">Stack</dt>
                    <dd className="mt-1.5 leading-snug">{flagship.stack.join(' · ')}</dd>
                  </div>
                  <div className="border-t border-line p-4 sm:border-l sm:border-t-0 sm:p-5">
                    <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">Outcome</dt>
                    <dd className="mt-1.5 leading-snug">{flagship.outcome}</dd>
                  </div>
                </dl>
                <div className="border-t border-line px-4 py-3 sm:px-5">
                  <a href="#flagship" className="font-display text-base font-medium uppercase tracking-wide text-accent hover:underline">
                    {flagship.cta} →
                  </a>
                </div>
              </Panel>
            </div>
          </div>
        </main>
      </div>
      <SpecSheet spec={spec} />
    </>
  );
}
