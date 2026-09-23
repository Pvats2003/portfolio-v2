import type { Metadata } from 'next';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import { LogSection } from '@/components/site/LogSection';
import { FlagshipCard, WorkCardView } from '@/components/home/WorkCards';
import { contact, hero, howIWork, proof, record, SITE_DESCRIPTION, SITE_URL } from '@/content/site';
import { education, experience, identity } from '@/content/resume';
import { pageMetadata } from '@/lib/seo';
import { archive, selectedWork } from '@/content/work';

// Homepage, in the order set in the brief:
// hero → proof → flagship → selected work → how I work → experience → archive → contact.
// The hero opens the log (SOD, start of day) and contact closes it (EOD, end of day);
// every section in between is a numbered entry.

export const metadata: Metadata = pageMetadata({ description: SITE_DESCRIPTION, path: '/' });

// Structured data for search engines: who this site is about, and where else they are.
const person = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: identity.name,
  url: SITE_URL,
  email: `mailto:${identity.email}`,
  telephone: identity.phone,
  jobTitle: experience[0].title,
  worksFor: { '@type': 'Organization', name: experience[0].org },
  alumniOf: { '@type': 'CollegeOrUniversity', name: education.school },
  address: { '@type': 'PostalAddress', addressLocality: 'Bengaluru', addressRegion: 'KA', addressCountry: 'IN' },
  sameAs: [identity.linkedin.href, identity.github.href],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        // Escape "<" so the JSON can never close the script tag early.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(person).replace(/</g, '\\u003c') }}
      />
      {/* Hero */}
      <div className="dot-grid">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="pt-8 font-mono text-xs uppercase tracking-wider text-muted sm:pt-10">{hero.eyebrow}</p>
          <section aria-labelledby="hero-h" className="grid gap-3 pb-10 pt-6 sm:grid-cols-[7rem_1fr] sm:gap-8 sm:pb-12 sm:pt-8">
            <p className="font-mono text-xs text-muted sm:pt-3">
              <span className="font-medium text-accent">SOD</span>
              <span aria-hidden className="mx-1.5 sm:hidden">
                ·
              </span>
              <span className="uppercase tracking-wider sm:mt-1 sm:block">Start of day</span>
            </p>
            <div className="min-w-0">
              <h1 id="hero-h" className="max-w-4xl text-[2.25rem] font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.5rem]">
                {hero.headline[0]} <span className="text-accent">{hero.headline[1]}</span>
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">{hero.subline}</p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href={hero.primaryCta.href}
                  className="inline-flex min-h-11 items-center bg-ink px-5 text-sm font-medium text-bg hover:bg-accent hover:text-on-accent"
                >
                  {hero.primaryCta.label} <span aria-hidden className="ml-2">→</span>
                </Link>
                <a
                  href={hero.secondaryCta.href}
                  className="inline-flex min-h-11 items-center border border-ink px-5 font-mono text-sm hover:bg-ink hover:text-bg"
                >
                  {hero.secondaryCta.label}
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Proof strip — directly under the hero */}
        <LogSection marker="01" label="Field report" className="border-t-0 pt-0 pb-10 sm:pt-0 sm:pb-12">
          <h2 className="sr-only">Proof</h2>
          <ul className="grid grid-cols-3 border-l border-t border-line">
            {proof.map((s, i) => (
              <li key={s.key} className="log-in border-b border-r border-line bg-surface px-3 py-3 sm:px-5 sm:py-4" style={{ '--i': i } as CSSProperties}>
                <p className="font-mono text-xs uppercase tracking-wider text-muted">{s.key}</p>
                <p className="mt-2 text-xl font-semibold leading-none tabular sm:text-4xl">{s.value}</p>
                <p className="mt-1.5 text-xs leading-snug text-muted sm:mt-2 sm:text-sm">{s.label}</p>
              </li>
            ))}
          </ul>
        </LogSection>

        {/* Flagship */}
        <LogSection id="work" marker="02" label="Shipped" heading="Flagship: City Ops OS" hideHeading className="pt-10 sm:pt-12">
          <FlagshipCard />
        </LogSection>

        {/* Selected work */}
        <LogSection id="selected" marker="03" label="Selected work" heading="More I’ve shipped and scoped">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {selectedWork.map((card) => (
              <WorkCardView key={card.slug} card={card} />
            ))}
          </div>
        </LogSection>

        {/* How I work */}
        <LogSection id="method" marker="04" label="How I work" heading="How I work" hideHeading>
          <ol className="grid border-l border-t border-line sm:grid-cols-5">
            {howIWork.map((s, i) => (
              <li key={s.step} className="border-b border-r border-line p-4">
                <p className="font-mono text-xs text-accent tabular">{String(i + 1).padStart(2, '0')}</p>
                <p className="mt-1 font-semibold">{s.step}</p>
                <p className="mt-1 text-sm leading-snug text-muted">{s.line}</p>
              </li>
            ))}
          </ol>
        </LogSection>

        {/* Experience & leadership */}
        <LogSection id="record" marker="05" label="Experience" heading="Experience" hideHeading>
          <ol className="relative border-l border-line">
            {record.map((r) => (
              <li key={r.title} className="relative grid gap-0.5 pb-5 pl-5 last:pb-0 sm:grid-cols-[9rem_1fr] sm:gap-4">
                <span aria-hidden className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full border border-accent bg-bg" />
                <p className="font-mono text-xs text-muted sm:pt-0.5">{r.period}</p>
                <p className="text-sm">
                  <span className="font-semibold">{r.title}</span> <span className="text-muted">· {r.org}</span>
                </p>
              </li>
            ))}
          </ol>
          <p className="mt-6">
            <Link href="/resume" className="font-mono text-sm underline decoration-line underline-offset-4 hover:decoration-accent">
              Full resume →
            </Link>
          </p>
        </LogSection>

        {/* Archive */}
        <LogSection id="archive" marker="06" label="Archive" heading="Archive" hideHeading>
          <div className="grid gap-10 sm:grid-cols-2 sm:gap-6">
            {archive.map((card) => (
              <WorkCardView key={card.slug} card={card} />
            ))}
          </div>
        </LogSection>

        {/* Contact */}
        <LogSection id="contact" marker="EOD" label="End of day" heading={contact.short}>
          <ul className="grid max-w-3xl border-l border-t border-line sm:grid-cols-2">
            {contact.links.map((l) => (
              <li key={l.label} className="border-b border-r border-line bg-surface sm:last:odd:col-span-2">
                <a
                  href={l.href}
                  className="block min-h-11 p-5 hover:bg-bg"
                  {...(l.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  <span className="block font-mono text-xs uppercase tracking-wider text-muted">{l.label}</span>
                  <span className="mt-2 block break-words text-base font-medium underline decoration-line underline-offset-4">{l.value}</span>
                </a>
              </li>
            ))}
          </ul>
        </LogSection>
      </div>
    </>
  );
}
