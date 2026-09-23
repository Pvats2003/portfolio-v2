import { media, type MediaKey } from '@/content/media';
import { Shot } from './Shot';

export type Callout = { x: number; y: number; label: string };

/** A screenshot with numbered markers (x/y in % of the image) and a matching list of one-line labels. */
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
  return (
    <figure className={phone ? 'grid items-start gap-6 sm:grid-cols-[13rem_1fr]' : undefined}>
      <div className={phone ? 'mx-auto w-full max-w-[13rem]' : undefined}>
        <Shot
          id={id}
          sizes={phone ? '208px' : sizes}
          preload={preload}
          overlay={callouts.map((c, i) => (
            <span
              key={c.label}
              aria-hidden
              className="absolute flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-surface bg-accent font-mono text-xs font-medium text-on-accent shadow-sm"
              style={{ left: `${c.x}%`, top: `${c.y}%` }}
            >
              {i + 1}
            </span>
          ))}
        />
      </div>
      <figcaption className={phone ? 'sm:pt-10' : 'mt-3'}>
        {caption && <p className="mb-2 font-mono text-xs uppercase tracking-wider text-muted">{caption}</p>}
        <ol className={`grid gap-x-6 gap-y-1.5 text-sm leading-snug ${phone ? '' : 'sm:grid-cols-2'}`}>
          {callouts.map((c, i) => (
            <li key={c.label} className="grid grid-cols-[1.75rem_1fr]">
              <span className="font-mono text-xs text-accent tabular">{String(i + 1).padStart(2, '0')}</span>
              <span>{c.label}</span>
            </li>
          ))}
        </ol>
      </figcaption>
    </figure>
  );
}
