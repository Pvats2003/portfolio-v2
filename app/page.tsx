import type { Metadata } from 'next';
import Link from 'next/link';
import { LogSection } from '@/components/site/LogSection';
import { FlagshipCard, WorkCardView } from '@/components/home/WorkCards';
import { CountUp } from '@/components/motion/CountUp';
import { DevicePair } from '@/components/visual/DevicePair';
import { Plate } from '@/components/visual/Frames';
import { contact, hero, howIWork, proof, record, SITE_DESCRIPTION, SITE_URL } from '@/content/site';
import { education, experience, identity } from '@/content/resume';
import { pageMetadata } from '@/lib/seo';
import { archive, selectedWork } from '@/content/work';

// Homepage: hero (headline + proof + product, all on the first screen) → flagship → selected work
// → how I work → archive → experience → contact. Visual and text sections alternate so no phone
// screen is only text for long.
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
      {/* Hero: night-shift panel in both themes. First screen = headline + proof + real product. */}
      <section aria-labelledby="hero-h" className="night relative overflow-hidden">
        <div aria-hidden className="dot-grid absolute inset-0" />
        <div className="relative mx-auto grid max-w-6xl gap-5 px-4 pb-10 pt-5 sm:px-6 sm:pb-14 sm:pt-10 lg:grid-cols-[0.92fr_1.25fr] lg:gap-x-12 lg:gap-y-6 lg:pb-16 lg:pt-14">
          <div className="lg:col-start-1 lg:row-start-1">
            <p className="font-mono text-xs text-muted">
              <span className="font-medium text-accent">SOD</span>
              <span aria-hidden className="mx-1.5">·</span>
              <span className="uppercase tracking-wider">Start of day · Bengaluru</span>
            </p>
            <h1 id="hero-h" className="mt-3 text-[1.95rem] font-semibold leading-[1.05] tracking-[-0.025em] sm:text-5xl lg:text-[3.25rem]">
              {hero.headline[0]} <span className="text-accent">{hero.headline[1]}</span>
            </h1>
          </div>

          <ul aria-label="Proof" className="grid grid-cols-3 gap-2 sm:gap-3 lg:col-start-1 lg:row-start-3">
            {proof.map((s) => (
              <li key={s.key} className="rounded-frame border border-line bg-surface px-3 py-2.5 sm:px-4 sm:py-3.5">
                <p className="text-2xl font-semibold leading-none tracking-tight sm:text-4xl lg:text-[2rem]">
                  <CountUp value={s.value} />
                </p>
                <p className="mt-1.5 text-[0.6875rem] leading-snug text-muted sm:text-xs">{s.label}</p>
              </li>
            ))}
          </ul>

          <div className="lg:col-start-2 lg:row-span-3 lg:row-start-1 lg:self-center">
            <DevicePair
              desktop="cityOpsDesktop"
              phone="cityOpsPhone"
              desktopLabel="City Ops OS · manager"
              phoneLabel="Field officer"
              sizes="(min-width: 1152px) 560px, (min-width: 1024px) 48vw, 80vw"
              eager
            />
          </div>

          <div className="lg:col-start-1 lg:row-start-2">
            <p className="max-w-xl text-base leading-relaxed text-muted sm:text-lg">{hero.subline}</p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Link
                href={hero.primaryCta.href}
                className="inline-flex min-h-11 items-center rounded-full bg-accent px-5 text-sm font-semibold text-on-accent hover:bg-ink hover:text-bg"
              >
                {hero.primaryCta.label} <span aria-hidden className="ml-2">→</span>
              </Link>
              <a
                href={hero.secondaryCta.href}
                className="inline-flex min-h-11 items-center rounded-full border border-line px-5 font-mono text-sm hover:border-ink"
              >
                {hero.secondaryCta.label}
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Flagship */}
        <LogSection id="work" marker="01" label="Shipped" heading="Flagship: City Ops OS" hideHeading stack className="border-t-0">
          <FlagshipCard />
        </LogSection>

        {/* Selected work */}
        <LogSection id="selected" marker="02" label="Selected work" heading="More I’ve shipped and scoped" stack>
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {selectedWork.map((card) => (
              <WorkCardView key={card.slug} card={card} />
            ))}
          </div>
        </LogSection>

        {/* How I work */}
        <LogSection id="method" marker="03" label="How I work" heading="How I work" hideHeading stack>
          <ol className="grid grid-cols-2 gap-2 sm:grid-cols-5 sm:gap-3">
            {howIWork.map((s, i) => (
              <li key={s.step} className={`rounded-frame border border-line bg-surface p-3.5 sm:p-4 ${i === 4 ? 'col-span-2 sm:col-span-1' : ''}`}>
                <p className="font-mono text-xs text-accent tabular">{String(i + 1).padStart(2, '0')}</p>
                <p className="mt-1 font-semibold">{s.step}</p>
                <p className="mt-0.5 text-sm leading-snug text-muted">{s.line}</p>
              </li>
            ))}
          </ol>
        </LogSection>

        {/* Archive — placed between the two text sections so no phone screen is text-only for long */}
        <LogSection id="archive" marker="04" label="Archive" heading="Archive" hideHeading stack>
          <div className="grid gap-10 sm:grid-cols-2 sm:gap-6">
            {archive.map((card) => (
              <WorkCardView key={card.slug} card={card} />
            ))}
          </div>
        </LogSection>

        {/* Experience & leadership */}
        <LogSection id="record" marker="05" label="Experience" heading="Experience" hideHeading stack>
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

        {/* Contact */}
        <LogSection id="contact" marker="EOD" label="End of day" heading={contact.short} stack>
          <Plate pad="p-3 sm:p-6" className="max-w-4xl">
            <ul className="grid grid-cols-2 overflow-hidden rounded-frame border-l border-t border-line">
              {contact.links.map((l) => (
                <li key={l.label} className={`border-b border-r border-line bg-surface ${l.label === 'Email' || l.label === 'LinkedIn' ? 'col-span-2 sm:col-span-1' : ''} sm:last:odd:col-span-2`}>
                  <a
                    href={l.href}
                    className="block min-h-11 p-3.5 hover:bg-bg sm:p-5"
                    {...(l.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  >
                    <span className="block font-mono text-xs uppercase tracking-wider text-muted">{l.label}</span>
                    <span className="mt-1 block break-words text-sm font-medium underline decoration-line underline-offset-4 sm:mt-2 sm:text-base">{l.value}</span>
                  </a>
                </li>
              ))}
            </ul>
          </Plate>
        </LogSection>
      </div>
    </>
  );
}
