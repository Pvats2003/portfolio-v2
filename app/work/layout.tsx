import { IBM_Plex_Mono, IBM_Plex_Sans, IBM_Plex_Serif } from 'next/font/google';
import { SiteHeader } from '@/components/site/SiteHeader';

// The Field Log identity (IBM Plex Sans + Mono) plus Plex Serif for long-form reading.
// One superfamily, so the reading column and the frame feel like one system.
const plexSans = IBM_Plex_Sans({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-plex-sans' });
const plexMono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-plex-mono' });
const plexSerif = IBM_Plex_Serif({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-plex-serif',
});

export default function WorkLayout({ children }: LayoutProps<'/work'>) {
  return (
    <div className={`dir-a ${plexSans.variable} ${plexMono.variable} ${plexSerif.variable}`}>
      <SiteHeader />
      <main id="main">{children}</main>
    </div>
  );
}
