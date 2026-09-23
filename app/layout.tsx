import type { Metadata } from 'next';
import { IBM_Plex_Mono, IBM_Plex_Sans, IBM_Plex_Serif } from 'next/font/google';
import { SiteHeader } from '@/components/site/SiteHeader';
import { SiteFooter } from '@/components/site/SiteFooter';
import { ClickTracker } from '@/components/analytics/ClickTracker';
import { RevealObserver } from '@/components/motion/RevealObserver';
import { INDEXABLE, RESUME_PDF, SITE_DESCRIPTION, SITE_URL, identity } from '@/content/site';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

// One superfamily: Plex Sans (UI + headings), Plex Mono (log metadata), Plex Serif (long-form reading).
const plexSans = IBM_Plex_Sans({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-plex-sans' });
const plexMono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-plex-mono' });
const plexSerif = IBM_Plex_Serif({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-plex-serif',
  // Only case studies use the serif; don't make every page preload it.
  preload: false,
});

export const metadata: Metadata = {
  // Defaults for any page that doesn't set its own; every real page calls pageMetadata() with its path.
  description: SITE_DESCRIPTION,
  openGraph: { siteName: identity.name, type: 'website', locale: 'en_IN' },
  twitter: { card: 'summary_large_image' },
  metadataBase: new URL(SITE_URL),
  title: { default: `${identity.name} — field operations & product`, template: `%s — ${identity.name}` },
  // Kept out of search engines until "go live", so the preview doesn't compete with the current site.
  robots: INDEXABLE ? { index: true, follow: true } : { index: false, follow: false },
};

// Runs before first paint: marks JS as available (for scroll-reveal) and applies a saved theme without a flash.
const themeScript = `document.documentElement.classList.add('js');try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}`;

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
        <RevealObserver />
        <ClickTracker resume={RESUME_PDF} linkedin={identity.linkedin.href} github={identity.github.href} />
        {/* Cookieless page views. Only loads on Vercel, where the /_vercel/insights script exists. */}
        {process.env.VERCEL && <Analytics />}
      </body>
    </html>
  );
}
