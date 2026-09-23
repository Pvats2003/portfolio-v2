import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';
import { RESUME_PDF } from '@/content/lab';

// Draft site header in the Field Log identity. Links are limited to pages that exist today.
export function SiteHeader() {
  return (
    <header className="border-b border-line">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link href="/" className="font-mono text-xs uppercase tracking-wider hover:text-accent">
          Priyanshu Vats
        </Link>
        <nav aria-label="Primary" className="flex items-center gap-5 font-mono text-xs uppercase tracking-wider text-muted">
          <Link href="/" className="hover:text-ink">
            Work
          </Link>
          <a href={RESUME_PDF} className="hover:text-ink">
            Resume
          </a>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
