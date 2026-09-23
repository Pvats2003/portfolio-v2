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
          <p className="pt-10 font-mono text-xs uppercase tracking-wider text-muted sm:pt-16">{hero.eyebrow}</p>
          <section aria-labelledby="hero-h" className="grid gap-3 py-10 sm:grid-cols-[7rem_1fr] sm:gap-8 sm:py-14">
            <p className="font-mono text-xs text-muted sm:pt-3">
              <span className="font-medium text-accent">SOD</span>
              <span aria-hidden className="mx-1.5 sm:hidden">
                ·
              </span>
              <span className="uppercase tracking-wider sm:mt-1 sm:block">Start of day</span>
            </p>
            <div className="min-w-0">
              <h1 id="hero-h" className="max-w-4xl text-[2.25rem] font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
                {hero.headline[0]} <span className="text-accent">{hero.headline[1]}</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">{hero.subline}</p>
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
        <LogSection marker="01" label="Field report" className="border-t-0 pt-0 sm:pt-0">
          <h2 className="sr-only">Proof</h2>
          <ul className="grid grid-cols-1 border-l border-t border-line sm:grid-cols-2 lg:grid-cols-4">
            {proof.map((s, i) => (
              <li key={s.key} className="log-in border-b border-r border-line bg-surface p-5" style={{ '--i': i } as CSSProperties}>
                <p className="font-mono text-xs uppercase tracking-wider text-muted">{s.key}</p>
                <p className={`mt-3 font-semibold leading-none tabular ${s.numeric ? 'text-4xl' : 'text-2xl'}`}>{s.value}</p>
                <p className="mt-2 text-sm leading-snug text-muted">{s.label}</p>
              </li>
            ))}
          </ul>
        </LogSection>

        {/* Flagship */}
        <LogSection id="work" marker="02" label="Shipped" heading="The story: from WhatsApp threads to one view per city">
          <FlagshipCard />
        </LogSection>

        {/* Selected work */}
        <LogSection id="selected" marker="03" label="Selected work" heading="Other things I’ve shipped and scoped">
          <div className="grid gap-4 lg:grid-cols-3">
            {selectedWork.map((card) => (
              <WorkCardView key={card.slug} card={card} />
            ))}
          </div>
        </LogSection>

        {/* How I work */}
        <LogSection id="method" marker="04" label="How I work" heading="Discover → Structure → Build → Operate → Iterate">
          <ol className="border-t border-line">
            {howIWork.map((s, i) => (
              <li key={s.step} className="grid gap-2 border-b border-line py-5 sm:grid-cols-[10rem_1fr_1.4fr] sm:gap-6">
                <p className="font-mono text-sm">
                  <span className="text-accent tabular">{String(i + 1).padStart(2, '0')}</span> {s.step}
                </p>
                <p className="font-medium">{s.line}</p>
                <p className="text-sm leading-relaxed text-muted">
                  <span className="font-mono text-xs uppercase tracking-wider">Example · </span>
                  {s.example}
                </p>
              </li>
            ))}
          </ol>
        </LogSection>

        {/* Experience & leadership */}
        <LogSection id="record" marker="05" label="Experience" heading="Experience & leadership">
          <ol className="border-t border-line">
            {record.map((r) => (
              <li key={r.title} className="grid gap-2 border-b border-line py-5 sm:grid-cols-[10rem_1fr] sm:gap-6">
                <p className="font-mono text-xs text-muted sm:pt-1">{r.period}</p>
                <div>
                  <p className="font-semibold">
                    {r.title} <span className="font-normal text-muted">· {r.org}</span>
                  </p>
                  <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted">{r.line}</p>
                </div>
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
        <LogSection id="archive" marker="06" label="Archive" heading="Archive">
          <div className="grid gap-4 sm:grid-cols-2">
            {archive.map((card) => (
              <WorkCardView key={card.slug} card={card} compact />
            ))}
          </div>
        </LogSection>

        {/* Contact */}
        <LogSection id="contact" marker="EOD" label="End of day" heading={contact.line}>
          <ul className="grid max-w-3xl border-l border-t border-line sm:grid-cols-2">
            {contact.links.map((l) => (
              <li key={l.label} className="border-b border-r border-line bg-surface">
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
