import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';
import { PaletteTrigger } from '@/components/palette/PaletteTrigger';
import { paletteItems } from '@/content/palette';

const nav = [
  { label: 'Work', href: '/#work' },
  { label: 'About', href: '/about' },
  { label: 'Resume', href: '/resume' },
];

export function SiteHeader() {
  return (
    <header className="border-b border-line">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-4 py-3 sm:px-6">
        <Link href="/" className="font-mono text-xs font-medium uppercase tracking-wider hover:text-accent">
          Priyanshu Vats
        </Link>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <nav aria-label="Primary">
            <ul className="flex items-center gap-5 font-mono text-xs uppercase tracking-wider text-muted">
              {nav.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="inline-flex min-h-11 items-center hover:text-ink">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <PaletteTrigger items={paletteItems()} />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
