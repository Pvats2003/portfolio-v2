import Image from 'next/image';
import type { ReactNode } from 'react';
import { media, type MediaKey } from '@/content/media';
import { BrowserFrame, PhoneFrame } from './Frames';

/**
 * A framed screenshot. Lazy by default; pass `preload` only for an image that is the first thing on screen.
 * `sizes` must describe the rendered width so the browser picks the right file.
 */
export function Shot({
  id,
  sizes,
  preload = false,
  overlay,
  hideDemo = false,
}: {
  id: MediaKey;
  sizes: string;
  preload?: boolean;
  /** Absolutely positioned content over the image (e.g. numbered callouts). */
  overlay?: ReactNode;
  /** The parent shows the "Demo data" label instead. */
  hideDemo?: boolean;
}) {
  const m = media[id];
  const demo = !hideDemo && 'demo' in m && m.demo;
  const img = (
    <>
      <Image
        src={m.src}
        alt={m.alt}
        sizes={sizes}
        placeholder="blur"
        preload={preload}
        loading={preload ? 'eager' : 'lazy'}
        className="block h-auto w-full"
      />
      {overlay}
    </>
  );
  return m.frame === 'phone' ? (
    <PhoneFrame demo={demo}>{img}</PhoneFrame>
  ) : (
    <BrowserFrame bar={'bar' in m ? m.bar : undefined} demo={demo}>
      {img}
    </BrowserFrame>
  );
}
