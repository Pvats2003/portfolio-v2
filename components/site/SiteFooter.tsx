import { contact } from '@/content/site';

export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-6 font-mono text-xs text-muted sm:px-6">
        <p>End of log · Priyanshu Vats · Bengaluru</p>
        <ul className="flex flex-wrap gap-x-5 gap-y-2">
          {contact.links.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                className="inline-flex min-h-11 items-center uppercase tracking-wider hover:text-ink"
                {...(l.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
