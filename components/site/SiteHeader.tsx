import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';
import { PaletteTrigger } from '@/components/palette/PaletteTrigger';
import { paletteItems } from '@/content/palette';

const nav = [
  { label: 'Work', href: '/#work' },
  { label: 'About', href: '/about' },
  { label: 'Resume', href: '/resume' },
];

// One row on desktop; on phones the nav drops to a slim second row so the hero starts high.
export function SiteHeader() {
  return (
    <header className="border-b border-line">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-5 px-4 sm:px-6">
        <Link href="/" className="inline-flex min-h-12 items-center font-mono text-xs font-medium uppercase tracking-wider hover:text-accent">
          Priyanshu Vats
        </Link>
        <nav aria-label="Primary" className="order-last -mx-4 w-[calc(100%+2rem)] border-t border-line px-4 sm:order-none sm:mx-0 sm:ml-auto sm:w-auto sm:border-0 sm:px-0">
          <ul className="flex items-center gap-5 font-mono text-xs uppercase tracking-wider text-muted">
            {nav.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="inline-flex min-h-10 items-center hover:text-ink sm:min-h-12">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-3 sm:gap-5">
          <PaletteTrigger items={paletteItems()} />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
