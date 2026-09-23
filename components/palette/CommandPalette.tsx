'use client';

import { Command } from 'cmdk';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import type { PaletteItem } from '@/content/palette';
import { trackEvent } from '@/lib/analytics';

const groups: PaletteItem['group'][] = ['Case studies', 'Pages', 'Actions'];

// Plain word matching instead of cmdk's fuzzy default, so "career" shows Career OS and nothing else.
// Labels that start with the query rank first.
function filter(value: string, search: string, keywords: string[] = []) {
  const haystack = `${value} ${keywords.join(' ')}`.toLowerCase();
  const words = search.toLowerCase().trim().split(/\s+/);
  if (!words.every((w) => haystack.includes(w))) return 0;
  return value.toLowerCase().startsWith(words[0]) ? 1 : 0.5;
}

// A native modal <dialog>: the browser traps focus, makes the page behind it inert, closes on Esc,
// and hands focus back to the button that opened it.
export default function CommandPalette({
  items,
  open,
  onClose,
}: {
  items: PaletteItem[];
  open: boolean;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');
  const router = useRouter();

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      input.current?.focus();
    } else if (!open && d.open) {
      d.close();
    }
  }, [open]);

  function run(item: PaletteItem) {
    const a = item.action;
    if (a.kind === 'copy') {
      navigator.clipboard.writeText(a.text).then(
        () => setStatus(`Copied ${a.text}`),
        () => setStatus(`Couldn’t copy. The address is ${a.text}`),
      );
      trackEvent({ name: 'contact_click', channel: 'email', from: 'palette' });
      return;
    }
    if (a.kind === 'go') router.push(a.href);
    if (a.kind === 'download') {
      trackEvent({ name: 'resume_download', from: 'palette' });
      const link = document.createElement('a');
      link.href = a.href;
      link.download = '';
      link.click();
    }
    if (a.kind === 'external') {
      trackEvent({ name: 'contact_click', channel: a.href.includes('linkedin') ? 'linkedin' : 'github', from: 'palette' });
      window.open(a.href, '_blank', 'noopener,noreferrer');
    }
    onClose();
  }

  return (
    <dialog
      ref={dialog}
      aria-label="Jump to"
      className="palette"
      onClose={() => {
        setQuery('');
        setStatus('');
        onClose();
      }}
      // A click on the backdrop lands on the dialog element itself.
      onClick={(e) => e.target === dialog.current && onClose()}
    >
      <Command label="Jump to a page or action" loop filter={filter}>
        <div className="flex items-center gap-3 border-b-2 border-line px-4 focus-within:border-accent">
          <span aria-hidden className="font-mono text-xs text-accent">
            ›
          </span>
          <Command.Input
            ref={input}
            value={query}
            onValueChange={setQuery}
            placeholder="Search case studies, pages, actions…"
            className="min-h-12 w-full bg-transparent py-3 text-base placeholder:text-muted focus-visible:outline-none"
          />
        </div>
        <Command.List className="max-h-[min(24rem,60vh)] overflow-y-auto p-2">
          <Command.Empty className="px-3 py-6 text-center text-sm text-muted">No matches.</Command.Empty>
          {groups.map((g) => (
            <Command.Group key={g} heading={g}>
              {items
                .filter((i) => i.group === g)
                .map((item) => (
                  <Command.Item
                    key={item.id}
                    value={item.label}
                    keywords={item.keywords}
                    onSelect={() => run(item)}
                    className="group flex min-h-11 cursor-pointer items-center justify-between gap-4 px-3 py-2 text-sm aria-selected:bg-ink aria-selected:text-bg"
                  >
                    <span>{item.label}</span>
                    {item.hint && <span className="truncate font-mono text-xs text-muted group-aria-selected:text-bg">{item.hint}</span>}
                  </Command.Item>
                ))}
            </Command.Group>
          ))}
        </Command.List>
      </Command>
      <div className="flex items-center justify-between gap-4 border-t border-line px-4 py-2 font-mono text-xs text-muted">
        <p role="status" className="min-h-4 text-ok">
          {status}
        </p>
        <p aria-hidden className="hidden sm:block">
          ↑↓ move · Enter select · Esc close
        </p>
      </div>
    </dialog>
  );
}
