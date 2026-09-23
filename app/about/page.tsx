import type { Metadata } from 'next';
import Link from 'next/link';
import { pageMetadata } from '@/lib/seo';
import { LogSection } from '@/components/site/LogSection';
import { about, contact } from '@/content/site';
import { education } from '@/content/resume';

export const metadata: Metadata = pageMetadata({
  title: 'About',
  description: 'From Bihar to MIT Manipal ECE, into field operations in Andhra Pradesh, and now building the tools those operations need.',
  path: '/about',
});

export default function AboutPage() {
  return (
    <>
      <header className="dot-grid border-b border-line">
        <div className="mx-auto grid max-w-6xl gap-4 px-4 py-12 sm:grid-cols-[7rem_1fr] sm:gap-8 sm:px-6 sm:py-16">
          <p className="font-mono text-xs text-muted sm:pt-3">
            <span className="font-medium text-accent">About</span>
          </p>
          <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            Operator first. Then the tools.
          </h1>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <LogSection marker="01" label="The route" className="border-t-0">
          <h2 className="sr-only">The route</h2>
          <div className="space-y-6">
            {about.story.map((p) => (
              <p key={p} className="reading">
                {p}
              </p>
            ))}
          </div>
        </LogSection>

        <LogSection marker="02" label="How I build" heading="How I build">
          <p className="reading">{about.aiBuilding}</p>
        </LogSection>

        <LogSection marker="03" label="In my words" heading="Outside the resume">
          <p className="max-w-[38rem] border border-dashed border-accent px-4 py-3 text-sm leading-relaxed">
            <span className="mr-2 font-mono text-xs font-medium uppercase tracking-wider text-accent">TODO(priyanshu)</span>
            {about.personalTodo}
          </p>
        </LogSection>

        <LogSection marker="04" label="Credentials" heading="Education & certifications">
          <p className="font-semibold">
            {education.degree} <span className="font-normal text-muted">· {education.school} · {education.period}</span>
          </p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {education.certifications.map((c) => (
              <li key={c} className="border border-line bg-surface px-3 py-1.5 text-sm">
                {c}
              </li>
            ))}
          </ul>
        </LogSection>

        <LogSection marker="05" label="Contact" heading={contact.line}>
          <p className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-sm">
            {contact.links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="inline-flex min-h-11 items-center underline decoration-line underline-offset-4 hover:decoration-accent"
                {...(l.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                {l.label}
              </a>
            ))}
            <Link href="/#work" className="inline-flex min-h-11 items-center underline decoration-line underline-offset-4 hover:decoration-accent">
              See the work →
            </Link>
          </p>
        </LogSection>
      </div>
    </>
  );
}
