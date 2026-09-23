import { IBM_Plex_Serif } from 'next/font/google';

// Case studies open with serif text above the fold, so this section preloads the serif
// (the root layout loads it lazily for everywhere else). Same files, so nothing downloads twice.
const plexSerif = IBM_Plex_Serif({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-plex-serif',
});

export default function WorkLayout({ children }: LayoutProps<'/work'>) {
  return <div className={plexSerif.variable}>{children}</div>;
}
