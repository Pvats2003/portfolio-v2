import type { Metadata } from 'next';
import { Fraunces, Instrument_Sans } from 'next/font/google';
import { ctas, flagship, headlineOptions, stats, subline } from '@/content/lab';
import { SpecSheet, type Spec } from '@/components/lab/SpecSheet';

// Only this direction's fonts, so this page downloads nothing else.
const fraunces = Fraunces({ subsets: ['latin'], axes: ['opsz'], style: ['normal', 'italic'], variable: '--font-fraunces' });
const instrumentSans = Instrument_Sans({ subsets: ['latin'], variable: '--font-instrument-sans' });
const fontsC = `${fraunces.variable} ${instrumentSans.variable}`;

export const metadata: Metadata = { title: 'Direction C · Editorial Case Files' };

const headline = headlineOptions.find((h) => h.id === 'C')!;

const spec: Spec = {
  direction: 'C · Editorial Case Files',
  says: 'A product thinker with taste.',
  display: 'Fraunces (variable, optical sizes)',
  text: 'Instrument Sans',
  licence: 'both SIL Open Font Licence, self-hosted via next/font',
  motif:
    'The case file: each project opens with a folder tab (“Case 01”), a hanging numeral in the margin, a drop cap, and a pull-quote for the key trade-off. Stats are set as big editorial numerals over hairline rules.',
  motion:
    '“The page holds still”: nothing animates on its own. Only links respond — an underline draws in on hover or focus. Under reduced motion the underline simply appears.',
  themeNote: 'Paper-white by default; the dark “night edition” follows the OS or the toggle.',
  swatches: [
    { name: 'bg', light: '#faf7f1', dark: '#131210' },
    { name: 'surface', light: '#ffffff', dark: '#1b1a17' },
    { name: 'ink', light: '#16140f', dark: '#f2ede4' },
    { name: 'muted', light: '#5a554c', dark: '#a8a194' },
    { name: 'line', light: '#e2dccf', dark: '#2f2c27' },
    { name: 'accent', light: '#8c2a1c', dark: '#e58467' },
  ],
};

export default function EditorialLab() {
  return (
    <>
      <div className={`dir-c ${fontsC}`}>
        <main id="main" className="mx-auto max-w-6xl px-5 pb-20 sm:px-8">
          <div className="flex items-baseline justify-between border-b border-ink pb-3 pt-8 text-xs uppercase tracking-[0.18em] sm:pt-12">
            <span className="font-medium">Priyanshu Vats — Case Files</span>
            <span className="text-muted">Bengaluru</span>
          </div>

          <section aria-labelledby="hero-h" className="py-16 sm:py-24">
            <h1
              id="hero-h"
              className="max-w-4xl font-display text-[2.4rem] font-normal leading-[1.05] tracking-[-0.02em] [font-optical-sizing:auto] sm:text-6xl lg:text-7xl"
            >
              {headline.lines[0]} <em className="text-accent">{headline.lines[1]}</em>
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted">{subline}</p>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
              <a href={ctas.primary.href} className="inline-flex min-h-11 items-center rounded-full bg-ink px-6 text-sm font-medium text-bg hover:bg-accent hover:text-on-accent">
                {ctas.primary.label}
              </a>
              <a href={ctas.secondary.href} className="c-underline inline-flex min-h-11 items-center text-sm font-medium">
                {ctas.secondary.label} <span aria-hidden className="ml-1.5">↓</span>
              </a>
            </div>
          </section>

          <section aria-label="Proof" className="grid grid-cols-1 gap-x-8 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.key} className="border-t border-ink pt-4 pb-10">
                <p className={`font-display leading-none tracking-[-0.02em] tabular ${s.count ? 'text-6xl' : 'text-4xl italic'}`}>{s.value}</p>
                <p className="mt-3 max-w-[16rem] text-sm leading-snug text-muted">{s.label}</p>
              </div>
            ))}
          </section>

          <article id="flagship" aria-labelledby="flagship-h" className="relative mt-16 sm:mt-24">
            {/* folder tab */}
            <div className="inline-flex items-center gap-3 rounded-t-md border border-b-0 border-line bg-surface px-4 py-2 text-xs uppercase tracking-[0.18em]">
              <span className="font-medium text-accent">Case 01</span>
              <span className="text-muted">{flagship.eyebrow.replace('Flagship · ', '')}</span>
            </div>
            <div className="grid gap-10 border border-line bg-surface p-6 sm:p-10 lg:grid-cols-[5rem_1fr_18rem] lg:gap-12">
              <p aria-hidden className="hidden font-display text-7xl leading-none text-muted lg:block">01</p>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-muted">
                  {flagship.status} · {flagship.period}
                </p>
                <h2 id="flagship-h" className="mt-3 font-display text-4xl leading-tight tracking-[-0.02em] sm:text-5xl">
                  {flagship.title}
                </h2>
                <p className="mt-2 font-display text-lg italic text-muted">{flagship.kicker}</p>
                <p className="mt-6 max-w-xl text-lg leading-relaxed first-letter:float-left first-letter:mr-2 first-letter:mt-1 first-letter:font-display first-letter:text-6xl first-letter:leading-[0.8] first-letter:text-accent">
                  {flagship.summary}
                </p>
                <blockquote className="mt-8 max-w-xl border-l-2 border-accent pl-5 font-display text-xl italic leading-snug sm:text-2xl">
                  {flagship.tradeoff}
                </blockquote>
              </div>
              <aside aria-label="At a glance" className="text-sm">
                <table className="w-full text-left">
                  <caption className="pb-2 text-left text-xs uppercase tracking-[0.18em] text-muted">Was → Now</caption>
                  <tbody>
                    {flagship.before.map((b) => (
                      <tr key={b} className="border-t border-line">
                        <td className="py-2 text-muted">{b}</td>
                      </tr>
                    ))}
                    <tr className="border-t border-ink">
                      <td className="py-2 font-display text-lg">→ {flagship.after}</td>
                    </tr>
                  </tbody>
                </table>
                <p className="mt-6 text-xs uppercase tracking-[0.18em] text-muted">Stack</p>
                <p className="mt-1 leading-relaxed">{flagship.stack.join(', ')}</p>
                <p className="mt-6 text-xs uppercase tracking-[0.18em] text-muted">Outcome</p>
                <p className="mt-1 leading-relaxed">{flagship.outcome}</p>
                <a href="#flagship" className="c-underline mt-8 inline-flex min-h-11 items-center font-medium text-accent">
                  {flagship.cta} →
                </a>
              </aside>
            </div>
          </article>
        </main>
      </div>
      <SpecSheet spec={spec} />
    </>
  );
}
