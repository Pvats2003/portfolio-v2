'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './ThemeToggle';

const directions = [
  { href: '/lab/a', label: 'A · Field Log' },
  { href: '/lab/b', label: 'B · Control Room' },
  { href: '/lab/c', label: 'C · Editorial' },
];

// Neutral review chrome — deliberately plain so it doesn't bias the comparison.
export function LabBar() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/95 font-[system-ui] text-ink backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-2 sm:px-6">
        <Link href="/" className="text-xs font-medium text-muted hover:text-ink">
          Phase 1 · Visual directions
        </Link>
        <nav aria-label="Directions" className="flex gap-1 text-xs">
          {directions.map((d) => {
            const current = pathname === d.href;
            return (
              <Link
                key={d.href}
                href={d.href}
                aria-current={current ? 'page' : undefined}
                className={`rounded px-2.5 py-1 ${current ? 'bg-ink text-bg' : 'text-muted hover:text-ink'}`}
              >
                {d.label}
              </Link>
            );
          })}
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
