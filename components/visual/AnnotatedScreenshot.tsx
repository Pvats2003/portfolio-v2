import { media, type MediaKey } from '@/content/media';
import { Plate } from './Frames';
import { demoTag, Shot } from './Shot';

export type Callout = { x: number; y: number; label: string };

function Marker({ n, className = '' }: { n: number; className?: string }) {
  return (
    <span
      className={`flex items-center justify-center rounded-full bg-accent font-mono font-medium text-on-accent ${className}`}
      style={{ boxShadow: '0 0 0 3px color-mix(in oklab, var(--accent) 28%, transparent), 0 2px 6px rgba(0,0,0,.25)' }}
    >
      {n}
    </span>
  );
}

/** A screenshot on its plate with numbered accent markers (x/y in % of the image) and aligned one-line labels. */
export function AnnotatedScreenshot({
  id,
  callouts,
  sizes,
  caption,
  preload,
}: {
  id: MediaKey;
  callouts: Callout[];
  sizes: string;
  caption?: string;
  preload?: boolean;
}) {
  const phone = media[id].frame === 'phone';
  const shot = (
    <Shot
      id={id}
      sizes={phone ? '240px' : sizes}
      preload={preload}
      overlay={callouts.map((c, i) => (
        <span key={c.label} aria-hidden className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${c.x}%`, top: `${c.y}%` }}>
          <Marker n={i + 1} className="h-6 w-6 text-xs sm:h-7 sm:w-7" />
        </span>
      ))}
    />
  );
  const labels = (
    <figcaption>
      {caption && <p className="mb-3 font-mono text-xs uppercase tracking-wider text-muted">{caption}</p>}
      <ol className={`grid gap-x-8 gap-y-3 text-sm leading-snug ${phone ? '' : 'sm:grid-cols-2'}`}>
        {callouts.map((c, i) => (
          <li key={c.label} className="grid grid-cols-[1.75rem_1fr] items-start">
            <Marker n={i + 1} className="h-5 w-5 text-[0.6875rem]" />
            <span className="pt-px">{c.label}</span>
          </li>
        ))}
      </ol>
    </figcaption>
  );
  return phone ? (
    <figure className="grid items-center gap-6 sm:grid-cols-[17rem_1fr] sm:gap-10">
      <Plate tag={demoTag(id)} pad="px-8 pt-10 pb-8">
        <div className="mx-auto max-w-[12.5rem]">{shot}</div>
      </Plate>
      {labels}
    </figure>
  ) : (
    <figure className="space-y-5">
      <Plate tag={demoTag(id)} pad="p-3 pt-10 sm:p-8 sm:pt-12">
        {shot}
      </Plate>
      {labels}
    </figure>
  );
}
