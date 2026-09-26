'use client';

// /world and /world/depth: the scene fills the screen, with "Quick view" and the list view always on top. Everything
// you can reach in the scene is also plain HTML: hotspots are buttons, their panels hold real links, and the list
// view shows the same content. Two scenes are being compared (WORLD.md): the 360° panorama and the 3D photo test.
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { Chip } from '@/components/site/Chip';
import { RESUME_PDF } from '@/content/resume';
import { contact } from '@/content/site';
import { worldCopy as copy, type InnProject } from '@/content/world';
import type { PlaceId } from '@/content/world-pano';
import { useReducedMotion } from './useEnv';

const PanoViewer = dynamic(() => import('./pano/PanoViewer'), { ssr: false });
const DepthPhoto = dynamic(() => import('./depth/DepthPhoto'), { ssr: false });

// Test override (?shot: fixed view, no input) outside production only.
const TEST_OK = process.env.NEXT_PUBLIC_WORLD_TEST === '1';
const SPEAKER: Record<PlaceId, string> = { inn: `${copy.inn} · ${copy.innLabel}`, resume: copy.resume, contact: copy.contact };

export function WorldView({ projects, scene }: { projects: InnProject[]; scene: 'pano' | 'depth' }) {
  const reducedMotion = useReducedMotion();
  const [shot, setShot] = useState(false);
  const [panel, setPanel] = useState<PlaceId | null>(null);
  const [listOpen, setListOpen] = useState(false);
  const opener = useRef<HTMLElement | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // One-time read of the URL (unavailable during server render).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (TEST_OK && new URLSearchParams(window.location.search).has('shot')) setShot(true);
  }, []);

  const open = useCallback((id: PlaceId) => {
    opener.current = document.activeElement as HTMLElement | null;
    setListOpen(false);
    setPanel(id);
  }, []);
  const close = useCallback(() => {
    setPanel(null);
    const back = opener.current;
    requestAnimationFrame(() => back?.focus());
  }, []);
  useEffect(() => {
    if (panel) dialogRef.current?.focus();
  }, [panel]);

  const onKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key !== 'Escape') return;
    if (panel) close();
    else if (listOpen) setListOpen(false);
  };

  return (
    <section
      aria-labelledby="world-title"
      className="world relative isolate h-[calc(100svh-90px)] min-h-[520px] overflow-hidden sm:h-[calc(100svh-49px)]"
      onKeyDown={onKeyDown}
    >
      <h1 id="world-title" className="sr-only">
        {copy.title}
      </h1>
      <p className="sr-only">
        {scene === 'pano'
          ? 'A 360° view of a painted village. Signs in the scene are buttons: the inn holds the projects, and there are signs for the resume and contact details. The same content is in the list view.'
          : 'A painted village that shifts slightly in 3D as you move. The inn is a button that opens the projects; the same content is in the list view.'}
      </p>

      <div className="absolute inset-0">
        {scene === 'pano' ? (
          <PanoViewer interactive={!shot} reduced={reducedMotion} paused={!!panel || listOpen} onPlace={open} />
        ) : (
          <DepthPhoto interactive={!shot} reduced={reducedMotion} onOpen={() => open('inn')} />
        )}
      </div>

      {!shot && (
        <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-start justify-between gap-3 p-3 sm:p-4">
          <Link href="/" className="world-btn pointer-events-auto">
            <span aria-hidden>←</span> <span className="sm:hidden">Quick view</span>
            <span className="hidden sm:inline">{copy.skip}</span>
          </Link>
          <button
            type="button"
            className="world-btn pointer-events-auto"
            aria-expanded={listOpen}
            aria-controls="world-list"
            onClick={() => setListOpen((o) => !o)}
          >
            {copy.listView}
          </button>
        </div>
      )}

      {!shot && listOpen && (
        <div
          id="world-list"
          className="world-panel absolute inset-x-3 top-16 z-30 max-h-[calc(100%-5rem)] overflow-y-auto p-5 sm:inset-x-auto sm:right-4 sm:max-h-[calc(100%-6rem)] sm:w-[26rem]"
        >
          <h2 className="font-mono text-xs uppercase tracking-wider text-muted">{copy.places}</h2>
          <h3 className="mt-4 font-semibold">{SPEAKER.inn}</h3>
          <ProjectList projects={projects} />
          <h3 className="mt-5 font-semibold">{copy.resume}</h3>
          <ResumeLinks />
          <h3 className="mt-5 font-semibold">{copy.contact}</h3>
          <ContactLinks />
        </div>
      )}

      {!shot && panel && (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="false"
          aria-labelledby="world-dialog-title"
          tabIndex={-1}
          className="world-dialog absolute inset-x-3 bottom-3 z-40 flex max-h-[calc(100%-6.5rem)] flex-col outline-none sm:left-1/2 sm:right-auto sm:bottom-6 sm:w-[38rem] sm:-translate-x-1/2"
        >
          <p id="world-dialog-title" className="world-speaker">
            {SPEAKER[panel]}
          </p>
          {/* Scrolls inside, so the speaker tab above the box is never clipped. */}
          <div className="min-h-0 overflow-y-auto">
            {panel === 'inn' && <ProjectList projects={projects} />}
            {panel === 'resume' && <ResumeLinks />}
            {panel === 'contact' && <ContactLinks />}
            <div className="mt-4">
              <button type="button" className="world-btn" onClick={close}>
                {copy.back}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function ProjectList({ projects }: { projects: InnProject[] }) {
  return (
    <ul className="mt-3 divide-y divide-line">
      {projects.map((p) => (
        <li key={p.slug} className="py-3 first:pt-0">
          <Link href={`/work/${p.slug}`} className="group block">
            <span className="font-semibold group-hover:text-accent">{p.title}</span> <span aria-hidden className="text-accent">→</span>
            <span className="mt-0.5 block text-sm leading-snug text-muted">{p.kicker}</span>
          </Link>
          {p.proof && (
            <div className="mt-2">
              <Chip tone={p.proof.tone} wrap>
                {p.proof.label}
              </Chip>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

function ResumeLinks() {
  return (
    <ul className="mt-3 space-y-2">
      <li>
        <Link href="/resume" className="font-semibold hover:text-accent">
          {copy.resumePage} <span aria-hidden className="text-accent">→</span>
        </Link>
      </li>
      <li>
        <a href={RESUME_PDF} className="font-semibold hover:text-accent">
          {copy.resumePdf} <span aria-hidden className="text-accent">↓</span>
        </a>
      </li>
    </ul>
  );
}

function ContactLinks() {
  return (
    <>
      <p className="mt-3 text-sm text-muted">{contact.line}</p>
      <ul className="mt-2 space-y-2">
        {contact.links
          .filter((l) => l.label !== 'Resume')
          .map((l) => (
            <li key={l.label}>
              <a href={l.href} className="hover:text-accent" {...(l.href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}>
                <span className="font-mono text-xs uppercase tracking-wider text-muted">{l.label}</span> <span className="font-semibold">{l.value}</span>
              </a>
            </li>
          ))}
      </ul>
    </>
  );
}
