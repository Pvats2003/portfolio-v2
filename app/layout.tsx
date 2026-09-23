import type { Metadata } from 'next';
import { IBM_Plex_Mono, IBM_Plex_Sans, IBM_Plex_Serif } from 'next/font/google';
import { SiteHeader } from '@/components/site/SiteHeader';
import { SiteFooter } from '@/components/site/SiteFooter';
import { SITE_URL, identity } from '@/content/site';
import './globals.css';

// One superfamily: Plex Sans (UI + headings), Plex Mono (log metadata), Plex Serif (long-form reading).
const plexSans = IBM_Plex_Sans({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-plex-sans' });
const plexMono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-plex-mono' });
const plexSerif = IBM_Plex_Serif({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-plex-serif',
  // Only case studies use the serif; don't make every page preload it.
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${identity.name} — field operations & product`, template: `%s — ${identity.name}` },
  description:
    'I run robotics data-collection operations in the field and ship the tools that fix them. Open to APM, Product Ops, and Founder’s Office roles in Bengaluru.',
  // Kept out of search engines until "go live", so the preview doesn't compete with the current site.
  robots: { index: false, follow: false },
};

// Runs before first paint so a saved theme choice never flashes the wrong theme.
const themeScript = `try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${plexSans.variable} ${plexMono.variable} ${plexSerif.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
