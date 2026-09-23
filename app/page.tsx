import Link from 'next/link';
import { headlineOptions } from '@/content/lab';

// Phase 1 placeholder home: an index of the three visual directions.
// Replaced by the real homepage once a direction is chosen.
const directions = [
  { href: '/lab/a', name: 'A · Field Log', says: 'An operator who writes things down.' },
  { href: '/lab/b', name: 'B · Control Room', says: 'Runs systems at scale.' },
  { href: '/lab/c', name: 'C · Editorial Case Files', says: 'A product thinker with taste.' },
];

export default function Home() {
  return (
    <main id="main" className="mx-auto max-w-3xl px-5 py-16 font-[system-ui] sm:py-24">
      <p className="text-sm text-muted">Priyanshu Vats · portfolio rebuild</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Phase 1 — pick a visual direction</h1>
      <p className="mt-4 text-muted">
        Each direction renders the same hero, proof strip, and flagship card from the same content file, so you can judge
        design alone. Use the theme switch at the top of each page to see light and dark.
      </p>
      <ul className="mt-10 divide-y divide-line border-y border-line">
        {directions.map((d) => (
          <li key={d.href}>
            <Link href={d.href} className="flex items-baseline justify-between gap-4 py-5 hover:text-muted">
              <span className="text-lg font-medium">{d.name}</span>
              <span className="text-sm text-muted">“{d.says}” →</span>
            </Link>
          </li>
        ))}
      </ul>
      <h2 className="mt-14 text-lg font-semibold">Headline options</h2>
      <p className="mt-2 text-sm text-muted">
        Each direction shows a different one; any headline works in any direction.
      </p>
      <ol className="mt-4 space-y-4">
        {headlineOptions.map((h) => (
          <li key={h.id} className="border-l-2 border-line pl-4">
            <span className="text-xs font-medium text-muted">Option {h.id} (shown in direction {h.id})</span>
            <p className="mt-1">{h.lines.join(' ')}</p>
          </li>
        ))}
      </ol>
    </main>
  );
}
