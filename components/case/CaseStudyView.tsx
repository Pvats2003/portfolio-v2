import Link from 'next/link';
import type { ReactNode } from 'react';
import type { Block, CaseStudy, Chapter } from '@/content/types';
import { Chip } from '@/components/site/Chip';
import { ReadTracker } from '@/components/analytics/ReadTracker';
import { nextCaseStudy } from '@/content/projects';
import { SHOW_TODOS } from '@/content/site';
import { ConvergeDiagram, SprawlDiagram } from './Diagrams';
import { BeforeAfter, Board, DataTable, Personas, Pipeline } from './Blocks';
import { AnnotatedScreenshot } from '@/components/visual/AnnotatedScreenshot';
import { DevicePair } from '@/components/visual/DevicePair';
import { Gallery } from '@/components/visual/Gallery';
import { demoTag, Shot } from '@/components/visual/Shot';
import { Plate } from '@/components/visual/Frames';
import { illustrations } from '@/components/visual/Illustrations';

// The case-study template: Field Log frame (timestamp column, shift-style markers, chips)
// around a long-form reading column (serif body, pull-quotes, generous measure).

/** Visible placeholder for missing information. Every one is also listed in TODO.md. */
function Todo({ children }: { children: ReactNode }) {
  return (
    <p className="max-w-[38rem] border border-dashed border-accent px-4 py-3 font-sans text-sm leading-relaxed">
      <span className="mr-2 font-mono text-xs font-medium uppercase tracking-wider text-accent">TODO(priyanshu)</span>
      {children}
    </p>
  );
}

function PullQuote({ children }: { children: ReactNode }) {
  return (
    <p className="max-w-[38rem] border-l-2 border-accent py-1 pl-5 font-serif text-2xl leading-snug sm:text-[1.75rem]">
      {children}
    </p>
  );
}

const TEXT_BLOCKS = new Set<Block['type']>(['p', 'list', 'quote', 'todo']);

// Widths the chapter column renders at, so next/image picks the right file.
const CHAPTER_SIZES = '(min-width: 1152px) 900px, (min-width: 640px) 80vw, 100vw';

function renderBlock(block: Block, i: number, preload = false) {
  switch (block.type) {
    case 'shot':
      return block.callouts ? (
        <AnnotatedScreenshot key={i} id={block.media} callouts={block.callouts} caption={block.caption} sizes={CHAPTER_SIZES} preload={preload} />
      ) : (
        <figure key={i}>
          <Plate tag={demoTag(block.media)} pad="p-3 pt-10 sm:p-8 sm:pt-12">
            <Shot id={block.media} sizes={CHAPTER_SIZES} preload={preload} />
          </Plate>
          {block.caption && <figcaption className="mt-2 font-mono text-xs text-muted">{block.caption}</figcaption>}
        </figure>
      );
    case 'illustration': {
      const Illustration = illustrations[block.name];
      return (
        <Plate key={i} tag="Illustration" pad="px-5 pb-8 pt-12 sm:px-10 sm:pb-10 sm:pt-14" className="flex justify-center">
          <div className="flex w-full max-w-xl justify-center">
            <Illustration />
          </div>
        </Plate>
      );
    }
    case 'gallery':
      return <Gallery key={i} items={block.items.map((it) => ({ id: it.media, caption: it.caption }))} />;
    case 'devicePair':
      return (
        <DevicePair
          key={i}
          desktop={block.desktop}
          phone={block.phone}
          desktopLabel={block.desktopLabel}
          phoneLabel={block.phoneLabel}
          preload={preload}
          sizes="(min-width: 1152px) 770px, 80vw"
        />
      );
    case 'p':
      return (
        <p key={i} className="reading">
          {block.text}
        </p>
      );
    case 'list':
      return (
        <ul key={i} className="reading space-y-3">
          {block.items.map((item) => (
            <li key={item} className="grid grid-cols-[1.25rem_1fr]">
              <span aria-hidden className="font-mono text-base text-accent">—</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    case 'facts':
      return (
        <dl key={i} className={`grid border-l border-t border-line ${block.items.length === 2 ? 'max-w-[26rem] grid-cols-2' : 'max-w-[38rem] grid-cols-2 sm:grid-cols-3'}`}>
          {block.items.map((f) => (
            <div key={f.label} className="flex flex-col-reverse border-b border-r border-line bg-surface px-4 py-3">
              <dt className="mt-1 text-sm text-muted">{f.label}</dt>
              <dd className="font-sans text-2xl font-semibold tabular leading-tight">{f.value}</dd>
            </div>
          ))}
        </dl>
      );
    case 'quote':
      return <PullQuote key={i}>{block.text}</PullQuote>;
    case 'todo':
      return <Todo key={i}>{block.text}</Todo>;
    case 'diagram':
      return <div key={i}>{block.name === 'sprawl' ? <SprawlDiagram /> : <ConvergeDiagram />}</div>;
    case 'pipeline':
      return <Pipeline key={i} block={block} />;
    case 'personas':
      return <Personas key={i} block={block} />;
    case 'board':
      return <Board key={i} block={block} />;
    case 'beforeAfter':
      return <BeforeAfter key={i} block={block} />;
    case 'table':
      return <DataTable key={i} block={block} />;
    case 'tradeoff':
      return (
        <table key={i} className="w-full max-w-[38rem] border-collapse text-left">
          <caption className="pb-3 text-left font-mono text-xs uppercase tracking-wider text-muted">{block.caption}</caption>
          <thead>
            <tr className="border-b border-ink font-mono text-xs uppercase tracking-wider text-muted">
              <th scope="col" className="py-2 pr-4 font-normal">{block.columnLabel ?? 'Choice'}</th>
              <th scope="col" className="py-2 pr-4 font-normal">Result</th>
              <th scope="col" className="hidden py-2 font-normal sm:table-cell">
                <span className="sr-only">Gained or given up</span>
              </th>
            </tr>
          </thead>
          <tbody className="font-serif text-lg">
            {block.rows.map((r) => (
              <tr key={r.dimension} className="border-b border-line align-top">
                <th scope="row" className="py-3 pr-4 font-sans text-base font-medium">{r.dimension}</th>
                <td className="py-3 pr-4">
                  {r.result}
                  <span className="mt-1.5 block sm:hidden">
                    <Chip tone={r.kind === 'gained' ? 'ok' : 'accent'}>{r.kind === 'gained' ? 'Gained' : 'Given up'}</Chip>
                  </span>
                </td>
                <td className="hidden py-3 text-right sm:table-cell">
                  <Chip tone={r.kind === 'gained' ? 'ok' : 'accent'}>{r.kind === 'gained' ? 'Gained' : 'Given up'}</Chip>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
  }
}

function ChapterEntry({ chapter, n }: { chapter: Chapter; n: number }) {
  const num = String(n).padStart(2, '0');
  const turning = chapter.section === 'Turning point';
  return (
    <section
      id={chapter.id}
      aria-labelledby={`${chapter.id}-h`}
      className={
        turning
          ? '-mx-4 my-6 grid gap-4 bg-ink px-4 py-12 text-bg sm:-mx-6 sm:grid-cols-[7rem_1fr] sm:gap-8 sm:px-6 sm:py-16'
          : 'grid gap-4 border-t border-line py-12 sm:grid-cols-[7rem_1fr] sm:gap-8 sm:py-16'
      }
    >
      {/* timestamp column */}
      <p className={`font-mono text-xs sm:pt-2 ${turning ? '' : 'text-muted'}`}>
        <span className={`font-medium ${turning ? '' : 'text-accent'}`}>{num}</span>
        <span className="mx-1.5 sm:hidden">·</span>
        <span className="uppercase tracking-wider sm:mt-1 sm:block">{chapter.section}</span>
      </p>
      <div className="min-w-0 space-y-6">
        <h2
          id={`${chapter.id}-h`}
          className={
            turning
              ? 'max-w-3xl font-sans text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl'
              : 'max-w-[38rem] font-sans text-2xl font-semibold leading-tight tracking-tight sm:text-3xl'
          }
        >
          {chapter.heading}
        </h2>
        {chapter.blocks.map((b, i) =>
          TEXT_BLOCKS.has(b.type) ? (
            renderBlock(b, i)
          ) : (
            // Marks visuals, so QA can measure how much text sits between them.
            <div key={i} data-visual="">
              {renderBlock(b, i)}
            </div>
          ),
        )}
      </div>
    </section>
  );
}

export function CaseStudyView({ study }: { study: CaseStudy }) {
  const chapters = SHOW_TODOS
    ? study.chapters
    : study.chapters
        .map((ch) => ({ ...ch, blocks: ch.blocks.filter((b) => b.type !== 'todo') }))
        .filter((ch) => ch.blocks.length > 0);
  const next = nextCaseStudy(study.slug);
  return (
    <article>
      {/* Case header: the one place the dot grid shows, so the reading area stays clean paper. */}
      <header className="dot-grid border-b border-line">
        <div className="mx-auto max-w-6xl px-4 pb-12 pt-8 sm:px-6 sm:pb-16 sm:pt-12">
          <Link href="/" className="font-mono text-xs text-muted hover:text-accent">
            ← All work
          </Link>
          <div className="mt-6 grid gap-4 sm:grid-cols-[7rem_1fr] sm:gap-8">
            <p className="font-mono text-xs text-muted sm:pt-3">
              <span className="font-medium text-accent">CASE {study.index}</span>
              <span className="mx-1.5 sm:hidden">·</span>
              <span className="sm:mt-1 sm:block">{study.org}</span>
            </p>
            <div>
              <div className="flex flex-wrap gap-2">
                {study.chips.map((c) => (
                  <Chip key={c.label} tone={c.tone}>
                    {c.label}
                  </Chip>
                ))}
              </div>
              <h1 className="mt-4 font-sans text-4xl font-semibold tracking-tight sm:text-5xl">{study.title}</h1>
              <p className="mt-2 font-mono text-sm text-muted">{study.kicker}</p>
              {study.links && (
                <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-1">
                  {study.links.map((l) => (
                    <li key={l.href}>
                      <a
                        href={l.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-11 items-center font-mono text-sm underline decoration-line underline-offset-4 hover:decoration-accent"
                      >
                        {l.label} ↗<span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {study.hero && (
            <div data-visual="" className="mt-8 max-w-4xl sm:mt-10">
              {renderBlock(study.hero, 0, true)}
            </div>
          )}

          <div className="mt-10 grid gap-4 sm:grid-cols-[7rem_1fr] sm:gap-8">
            <p className="font-mono text-xs uppercase tracking-wider text-muted sm:pt-2">TL;DR</p>
            <ol className="max-w-[40rem] space-y-3 font-serif text-xl leading-snug sm:text-[1.375rem]">
              {study.tldr.map((line, i) => (
                <li key={line} className="grid grid-cols-[2rem_1fr]">
                  <span aria-hidden className="pt-1 font-mono text-xs text-accent tabular">{String(i + 1).padStart(2, '0')}</span>
                  <span>{line}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Role & timeline */}
        <section aria-label="Role and timeline" className="grid gap-4 py-10 sm:grid-cols-[7rem_1fr] sm:gap-8">
          <p className="font-mono text-xs uppercase tracking-wider text-muted sm:pt-3">Role &amp; timeline</p>
          <dl data-visual="" className="grid grid-cols-1 border-l border-t border-line sm:grid-cols-2 lg:grid-cols-3">
            {study.meta.map((m) => (
              <div key={m.label} className="border-b border-r border-line bg-surface px-4 py-3">
                <dt className="font-mono text-xs uppercase tracking-wider text-muted">{m.label}</dt>
                <dd className="mt-1 text-sm leading-snug">
                  {m.value}
                  {SHOW_TODOS && m.todo && (
                    <span className="mt-1 block font-mono text-xs text-accent">TODO(priyanshu): {m.todo}</span>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {chapters.map((ch, i) => (
          <ChapterEntry key={ch.id} chapter={ch} n={i + 1} />
        ))}
        <ReadTracker slug={study.slug} />

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-line py-8 font-mono text-xs text-muted">
          <span>End of case log · {study.title}</span>
          <span className="flex flex-wrap gap-x-6 gap-y-2">
            <Link href="/#work" className="inline-flex min-h-11 items-center hover:text-accent">
              ← All work
            </Link>
            <Link href={`/work/${next.slug}`} className="inline-flex min-h-11 items-center text-ink hover:text-accent">
              Next case: {next.title} →
            </Link>
          </span>
        </footer>
      </div>
    </article>
  );
}
