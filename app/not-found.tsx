import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Not found', robots: { index: false, follow: false } };

export default function NotFound() {
  return (
    <div className="dot-grid">
      <div className="mx-auto grid max-w-6xl gap-4 px-4 py-20 sm:grid-cols-[7rem_1fr] sm:gap-8 sm:px-6 sm:py-28">
        <p className="font-mono text-xs text-muted sm:pt-3">
          <span className="font-medium text-accent">404</span>
          <span aria-hidden className="mx-1.5 sm:hidden">
            ·
          </span>
          <span className="uppercase tracking-wider sm:mt-1 sm:block">No entry</span>
        </p>
        <div>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">There’s no log entry at this address.</h1>
          <p className="mt-4 max-w-xl text-lg text-muted">The page may have moved in the rebuild. These are the places that exist:</p>
          <ul className="mt-8 flex flex-wrap gap-3 font-mono text-sm">
            <li>
              <Link href="/" className="inline-flex min-h-11 items-center bg-ink px-5 text-bg hover:bg-accent hover:text-on-accent">
                Home
              </Link>
            </li>
            <li>
              <Link href="/work/city-ops-os" className="inline-flex min-h-11 items-center border border-ink px-5 hover:bg-ink hover:text-bg">
                City Ops OS story
              </Link>
            </li>
            <li>
              <Link href="/resume" className="inline-flex min-h-11 items-center border border-ink px-5 hover:bg-ink hover:text-bg">
                Resume
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
