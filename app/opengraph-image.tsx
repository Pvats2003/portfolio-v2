import { hero } from '@/content/site';
import { ogImage, ogSize } from '@/lib/og';

export const alt = `Priyanshu Vats: ${hero.headline.join(' ')}`;
export const size = ogSize;
export const contentType = 'image/png';

export default function Image() {
  return ogImage({ marker: 'SOD', eyebrow: 'Ops log · Bengaluru', title: hero.headline[0], accentLine: hero.headline[1] });
}
