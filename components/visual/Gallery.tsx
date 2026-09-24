import type { MediaKey } from '@/content/media';
import { Plate } from './Frames';
import { demoTag, Shot } from './Shot';

/** Two to four screenshots, each on its own plate, with a one-line caption. */
export function Gallery({ items }: { items: { id: MediaKey; caption: string }[] }) {
  const cols = items.length >= 3 ? 'sm:grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-2';
  return (
    <div className={`grid gap-6 ${cols}`}>
      {items.map((it) => (
        <figure key={it.id}>
          <Plate tag={demoTag(it.id)} pad="p-3 pt-10 sm:p-5 sm:pt-11">
            <Shot id={it.id} sizes="(min-width: 1024px) 440px, (min-width: 640px) 45vw, 90vw" />
          </Plate>
          <figcaption className="mt-2 font-mono text-xs text-muted">{it.caption}</figcaption>
        </figure>
      ))}
    </div>
  );
}
