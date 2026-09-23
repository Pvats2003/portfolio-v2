import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { education, experience, identity, products, RESUME_PDF, skills, summary } from '@/content/resume';

export const metadata: Metadata = pageMetadata({
  title: 'Resume',
  description: `${identity.name} — ${identity.title}.`,
  path: '/resume',
});

// Rendered from content/resume.ts, which is transcribed line-for-line from the PDF offered here.

function Heading({ id, children }: { id: string; children: string }) {
  return (
    <h2 id={id} className="border-b border-ink pb-2 font-mono text-xs font-medium uppercase tracking-wider">
      {children}
    </h2>
  );
}

export default function ResumePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <header className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight">{identity.name}</h1>
          <p className="mt-2 max-w-xl text-sm text-muted">{identity.title}</p>
          <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs text-muted">
            <span>{identity.location}</span>
            <a href={`mailto:${identity.email}`} className="underline decoration-line underline-offset-4 hover:text-ink">
              {identity.email}
            </a>
            <a href={identity.linkedin.href} target="_blank" rel="noopener noreferrer" className="underline decoration-line underline-offset-4 hover:text-ink">
              {identity.linkedin.label}
            </a>
            <a href={identity.github.href} target="_blank" rel="noopener noreferrer" className="underline decoration-line underline-offset-4 hover:text-ink">
              {identity.github.label}
            </a>
          </p>
        </div>
        <a
          href={RESUME_PDF}
          download
          className="inline-flex min-h-11 items-center bg-ink px-5 text-sm font-medium text-bg hover:bg-accent hover:text-on-accent"
        >
          Download PDF
        </a>
      </header>

      <p className="mt-8 leading-relaxed">{summary}</p>

      <section aria-labelledby="exp-h" className="mt-10">
        <Heading id="exp-h">Experience</Heading>
        <div className="mt-5 space-y-8">
          {experience.map((r) => (
            <div key={r.title}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                <h3 className="font-semibold">
                  {r.title} <span className="font-normal text-muted">| {r.org}</span>
                </h3>
                <p className="font-mono text-xs text-muted">{r.period}</p>
              </div>
              {r.context && <p className="mt-1 text-sm text-muted">{r.context}</p>}
              <ul className="mt-3 space-y-2 text-sm leading-relaxed">
                {r.bullets.map((b) => (
                  <li key={b} className="grid grid-cols-[1rem_1fr]">
                    <span aria-hidden className="text-accent">
                      •
                    </span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="prod-h" className="mt-10">
        <Heading id="prod-h">Products</Heading>
        <div className="mt-5 space-y-7">
          {products.map((p) => (
            <div key={p.name}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                <h3 className="font-semibold">
                  {p.name} <span className="font-normal text-muted">— {p.tagline}</span>
                </h3>
              </div>
              <p className="mt-1 font-mono text-xs text-muted">
                {p.meta}
                {p.link && (
                  <>
                    {' · '}
                    <a href={p.link.href} target="_blank" rel="noopener noreferrer" className="underline decoration-line underline-offset-4 hover:text-ink">
                      {p.link.label}
                    </a>
                  </>
                )}
              </p>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed">
                {p.bullets.map((b) => (
                  <li key={b} className="grid grid-cols-[1rem_1fr]">
                    <span aria-hidden className="text-accent">
                      •
                    </span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="skills-h" className="mt-10">
        <Heading id="skills-h">Skills</Heading>
        <dl className="mt-5 space-y-3 text-sm leading-relaxed">
          {skills.map((s) => (
            <div key={s.group}>
              <dt className="inline font-semibold">{s.group}: </dt>
              <dd className="inline">{s.items}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="edu-h" className="mt-10">
        <Heading id="edu-h">Education & leadership</Heading>
        <div className="mt-5 flex flex-wrap items-baseline justify-between gap-x-4">
          <h3 className="font-semibold">
            {education.degree} <span className="font-normal text-muted">| {education.school}</span>
          </h3>
          <p className="font-mono text-xs text-muted">{education.period}</p>
        </div>
        <ul className="mt-3 space-y-2 text-sm leading-relaxed">
          <li className="grid grid-cols-[1rem_1fr]">
            <span aria-hidden className="text-accent">
              •
            </span>
            <span>Certifications: {education.certifications.join(', ')}.</span>
          </li>
          <li className="grid grid-cols-[1rem_1fr]">
            <span aria-hidden className="text-accent">
              •
            </span>
            <span>{education.leadership}</span>
          </li>
        </ul>
      </section>
    </div>
  );
}
