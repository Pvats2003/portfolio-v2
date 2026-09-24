import Link from 'next/link';
import { Chip } from '@/components/site/Chip';
import { Plate } from '@/components/visual/Frames';
import { illustrations } from '@/components/visual/Illustrations';
import { demoTag, Shot } from '@/components/visual/Shot';
import type { WorkCard } from '@/content/work';
import { flagship } from '@/content/work';

const linkClass = 'inline-flex min-h-11 items-center font-mono text-sm underline decoration-line underline-offset-4 hover:decoration-accent';
const lift = 'motion-safe:transition-transform motion-safe:duration-300 motion-safe:hover:-translate-y-1 motion-safe:focus-within:-translate-y-1';

/** Flagship: full width, visual-first — the manager's command center and the field officer's phone, side by side. */
export function FlagshipCard() {
  return (
    <article aria-labelledby="flagship-title" className="group">
      <div data-reveal className="grid gap-3 sm:grid-cols-[1fr_16rem] sm:gap-4 lg:grid-cols-[1fr_19rem]">
        <Plate tag={demoTag('cityOpsDesktop')} pad="p-3 pt-11 sm:p-7 sm:pt-12" className="flex items-center">
          <div className="w-full">
            <Shot id="cityOpsDesktop" aspect="2.25 / 1" focus="100% 0%" sizes="(min-width: 1152px) 780px, (min-width: 640px) 60vw, 92vw" zoom />
          </div>
        </Plate>
        <Plate pad="px-10 pt-8 sm:px-8 sm:pt-12" className="hidden items-start justify-center sm:flex">
          <div className="w-full max-w-[12rem]">
            <Shot id="cityOpsPhone" aspect="9 / 16" focus="center top" sizes="192px" zoom />
          </div>
        </Plate>
      </div>
      <div className="mt-5 flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
        <div className="max-w-2xl">
          <h3 id="flagship-title" className="text-2xl font-semibold tracking-tight sm:text-3xl">
            <Link href={flagship.href} className="hover:text-accent">
              {flagship.title}
            </Link>{' '}
            <span className="text-accent">· {flagship.label}</span>
          </h3>
          <p className="mt-2 leading-relaxed text-muted">{flagship.blurb}</p>
        </div>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <Chip tone={flagship.proof.tone}>{flagship.proof.label}</Chip>
          <Link href={flagship.href} className={linkClass}>
            Decision log →
          </Link>
        </div>
      </div>
    </article>
  );
}

/** Work card: the visual is the card. Then title, one line, one chip. Lifts gently on hover/focus. */
export function WorkCardView({ card }: { card: WorkCard }) {
  const v = card.visual;
  const Illustration = v.kind === 'illustration' ? illustrations[v.name] : null;
  return (
    <article aria-labelledby={`${card.slug}-title`} className={`group relative flex flex-col ${lift}`}>
      <div data-reveal>
        <Plate
          tag={v.kind === 'shot' ? demoTag(v.media) : 'Illustration'}
          pad="p-4 pt-11 sm:p-6 sm:pt-12"
          className="flex items-center justify-center sm:aspect-[5/4]"
        >
          {v.kind === 'shot' ? (
            <div className="w-full">
              <Shot id={v.media} aspect="16 / 11" focus={v.focus} sizes="(min-width: 1024px) 320px, (min-width: 640px) 44vw, 86vw" zoom />
            </div>
          ) : (
            Illustration && (
              <div className="flex w-full justify-center motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-[1.03]">
                <Illustration />
              </div>
            )
          )}
        </Plate>
      </div>
      <div className="mt-4 flex-1">
        <h3 id={`${card.slug}-title`} className="text-xl font-semibold tracking-tight">
          {/* The title link covers the whole card, so the visual is clickable too. */}
          <Link href={card.href} className="after:absolute after:inset-0 hover:text-accent">
            {card.title}
          </Link>
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-muted">{card.blurb}</p>
      </div>
      <p className="relative z-10 mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
        <Chip tone={card.proof.tone}>{card.proof.label}</Chip>
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
