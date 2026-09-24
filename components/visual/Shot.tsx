import Image from 'next/image';
import type { ReactNode } from 'react';
import { media, type MediaKey } from '@/content/media';
import { BrowserFrame, PhoneFrame } from './Frames';

/**
 * A framed screenshot. Lazy by default; `preload` only for the first thing on screen.
 * `aspect` crops in CSS to the strongest region (with `focus` as the object-position);
 * `sizes` must describe the rendered width so the browser picks the right file.
 */
export function Shot({
  id,
  sizes,
  preload = false,
  aspect,
  focus,
  overlay,
  zoom = false,
  eager = false,
}: {
  id: MediaKey;
  sizes: string;
  preload?: boolean;
  aspect?: string;
  focus?: string;
  overlay?: ReactNode;
  /** Slight zoom on hover/focus of the surrounding `group` (cards). */
  zoom?: boolean;
  /** Load immediately (above the fold) without a preload link — for when text, not this image, is the LCP. */
  eager?: boolean;
}) {
  const m = media[id];
  const zoomCls = zoom ? 'motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-[1.03] motion-safe:group-focus-within:scale-[1.03]' : '';
  const img = aspect ? (
    <div className="relative" style={{ aspectRatio: aspect }}>
      <Image
        src={m.src}
        alt={m.alt}
        fill
        sizes={sizes}
        placeholder="blur"
        preload={preload}
        loading={preload || eager ? 'eager' : 'lazy'}
        className={`object-cover ${zoomCls}`}
        style={{ objectPosition: focus ?? 'left top' }}
      />
      {overlay}
    </div>
  ) : (
    <>
      <Image
        src={m.src}
        alt={m.alt}
        sizes={sizes}
        placeholder="blur"
        preload={preload}
        loading={preload || eager ? 'eager' : 'lazy'}
        className={`block h-auto w-full ${zoomCls}`}
      />
      {overlay}
    </>
  );
  return m.frame === 'phone' ? <PhoneFrame>{img}</PhoneFrame> : <BrowserFrame bar={'bar' in m ? m.bar : undefined}>{img}</BrowserFrame>;
}

/** The plate tag a set of screenshots needs: "Demo data" if any of them shows made-up data. */
export function demoTag(...ids: MediaKey[]) {
  return ids.some((id) => 'demo' in media[id] && media[id].demo) ? ('Demo data' as const) : undefined;
}
