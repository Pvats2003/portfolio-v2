import Link from 'next/link';
import { Chip } from '@/components/site/Chip';
import { DevicePair } from '@/components/visual/DevicePair';
import { DiagramSheet } from '@/components/visual/Frames';
import { FlowDiagram } from '@/components/visual/FlowDiagram';
import { Shot } from '@/components/visual/Shot';
import type { WorkCard } from '@/content/work';
import { flagship } from '@/content/work';

const linkClass = 'inline-flex min-h-11 items-center font-mono text-sm underline decoration-line underline-offset-4 hover:decoration-accent';

/** The flagship: City Ops OS on desktop and phone — one system, two roles. */
export function FlagshipCard() {
  return (
    <article aria-labelledby="flagship-title">
      <DevicePair desktop="cityOpsDesktop" phone="cityOpsPhone" desktopLabel="Manager · command center" phoneLabel="Field officer · cockpit" />
      <div className="mt-6 grid gap-4 border-t border-line pt-5 sm:grid-cols-[1fr_auto] sm:items-end">
        <div>
          <h3 id="flagship-title" className="text-2xl font-semibold tracking-tight">
            {flagship.title} <span className="text-accent">· {flagship.label}</span>
          </h3>
          <p className="mt-2 max-w-xl leading-relaxed">{flagship.blurb}</p>
          <p className="mt-3">
            <Chip tone={flagship.proof.tone}>{flagship.proof.label}</Chip>
          </p>
        </div>
        <Link href={flagship.href} className={linkClass}>
          Decision log →
        </Link>
      </div>
    </article>
  );
}

/** Work card: the visual leads, then title, one short line and one proof chip. */
export function WorkCardView({ card }: { card: WorkCard }) {
  return (
    <article aria-labelledby={`${card.slug}-title`} className="flex flex-col">
      {card.visual.kind === 'shot' ? (
        <Shot id={card.visual.media} sizes="(min-width: 1024px) 340px, (min-width: 640px) 50vw, 100vw" />
      ) : (
        <DiagramSheet label="Diagram">
          <FlowDiagram label={card.visual.label} steps={card.visual.steps} />
        </DiagramSheet>
      )}
      <div className="mt-4 flex-1">
        <h3 id={`${card.slug}-title`} className="text-xl font-semibold tracking-tight">
          <Link href={card.href} className="hover:text-accent">
            {card.title}
          </Link>
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-muted">{card.blurb}</p>
        <p className="mt-3">
          <Chip tone={card.proof.tone}>{card.proof.label}</Chip>
        </p>
      </div>
      <p className="mt-2 flex flex-wrap gap-x-5">
        <Link href={card.href} aria-label={`${card.title} case study`} className={linkClass}>
          Case study →
        </Link>
        {card.external && (
          <a
            href={card.external.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${card.title} ${card.external.label} (opens in a new tab)`}
            className={linkClass}
          >
            {card.external.label} ↗
          </a>
        )}
      </p>
    </article>
  );
}
