import type { MediaKey } from '@/content/media';
import { Shot } from './Shot';

/** Two to four screenshots side by side, each with a one-line caption. */
export function Gallery({ items }: { items: { id: MediaKey; caption: string }[] }) {
  const cols = items.length >= 3 ? 'sm:grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-2';
  return (
    <div className={`grid gap-6 ${cols}`}>
      {items.map((it) => (
        <figure key={it.id}>
          <Shot id={it.id} sizes="(min-width: 1024px) 480px, (min-width: 640px) 50vw, 100vw" />
          <figcaption className="mt-2 font-mono text-xs text-muted">{it.caption}</figcaption>
        </figure>
      ))}
    </div>
  );
}
