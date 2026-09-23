import type { MediaKey } from '@/content/media';
import { DemoTag } from './Frames';
import { Shot } from './Shot';

/**
 * A desktop screenshot with a phone screenshot of the same product overlapping its corner:
 * one system, two roles. Scales as one unit, so it reads the same at 375px and 1440px.
 */
export function DevicePair({
  desktop,
  phone,
  desktopLabel,
  phoneLabel,
  preload = false,
}: {
  desktop: MediaKey;
  phone: MediaKey;
  desktopLabel: string;
  phoneLabel: string;
  preload?: boolean;
}) {
  return (
    <figure>
      <div className="relative pb-[7%] pr-[13%]">
        <Shot id={desktop} preload={preload} sizes="(min-width: 1152px) 800px, 87vw" />
        <div className="absolute bottom-0 right-0 w-[21%]">
          <Shot id={phone} sizes="(min-width: 1152px) 200px, 21vw" hideDemo />
        </div>
      </div>
      <figcaption className="mt-3 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 font-mono text-xs uppercase tracking-wider text-muted">
        <span>{desktopLabel}</span>
        <span className="flex items-center gap-3">
          {phoneLabel}
          <DemoTag />
        </span>
      </figcaption>
    </figure>
  );
}
