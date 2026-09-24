import type { MediaKey } from '@/content/media';
import { Plate } from './Frames';
import { demoTag, Shot } from './Shot';

/**
 * One system, two roles: a desktop screenshot with the phone screenshot overlapping its corner.
 * The phone runs past the plate's bottom edge and is clipped — a partial view, on purpose.
 */
export function DevicePair({
  desktop,
  phone,
  desktopLabel,
  phoneLabel,
  preload = false,
  eager = false,
  sizes = '(min-width: 1152px) 620px, 80vw',
}: {
  desktop: MediaKey;
  phone: MediaKey;
  desktopLabel: string;
  phoneLabel: string;
  preload?: boolean;
  eager?: boolean;
  /** Rendered width of the desktop screenshot. */
  sizes?: string;
}) {
  return (
    <figure>
      <Plate tag={demoTag(desktop, phone)} pad="px-4 pt-10 sm:px-8 sm:pt-12">
        <div className="relative pb-[13%]">
          <div className="w-[87%]">
            <Shot id={desktop} preload={preload} eager={eager} sizes={sizes} />
          </div>
          <div className="absolute right-0 top-[20%] w-[25%]">
            <Shot id={phone} aspect="9 / 16" focus="center top" eager={preload || eager} sizes="(min-width: 1152px) 190px, 25vw" />
          </div>
        </div>
      </Plate>
      <figcaption className="mt-3 flex flex-wrap justify-between gap-x-6 gap-y-1 font-mono text-[0.6875rem] uppercase tracking-wider text-muted">
        <span>{desktopLabel}</span>
        <span>{phoneLabel}</span>
      </figcaption>
    </figure>
  );
}
