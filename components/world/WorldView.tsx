'use client';

// /world: the painted village. Uses the painted plates when they exist (content/world-plates.json), otherwise the
// code-drawn village (frame B). No WebGL. Everything you can do in the scene is also plain HTML: the inn is a
// button, its projects open in a dialog with real links, and the list view shows the same content.
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { Chip } from '@/components/site/Chip';
import { worldCopy as copy, type InnProject } from '@/content/world';
import { hasPlates } from './village/PlateScene';
import { useReducedMotion, useSiteMood } from './useEnv';

const PlateScene = dynamic(() => import('./village/PlateScene'), { ssr: false });
const VillageSvg = dynamic(() => import('./village/VillageSvg'), { ssr: false });

// Test override (?shot=day|night: fixed mood, no motion) outside production only.
const TEST_OK = process.env.NEXT_PUBLIC_WORLD_TEST === '1';

export function WorldView({ projects }: { projects: InnProject[] }) {
  const siteMood = useSiteMood();
  const reducedMotion = useReducedMotion();
  const [shot, setShot] = useState<'day' | 'night' | null>(null);
  const [phone, setPhone] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [innOpen, setInnOpen] = useState(false);
  const [listOpen, setListOpen] = useState(false);
  const opener = useRef<HTMLElement | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const s = q.get('shot');
    // One-time read of the URL and the device (unavailable during server render).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (TEST_OK && (s === 'day' || s === 'night')) setShot(s);
    // Phones start on the still picture (no parallax or ambient motion); "Animate" turns it on.
    setPhone(window.matchMedia('(pointer: coarse)').matches && Math.min(screen.width, screen.height) < 768);
  }, []);

  const open = useCallback(() => {
    opener.current = document.activeElement as HTMLElement | null;
    setListOpen(false);
    setInnOpen(true);
  }, []);
  const close = useCallback(() => {
    setInnOpen(false);
    const back = opener.current;
    requestAnimationFrame(() => back?.focus());
  }, []);
  useEffect(() => {
    if (innOpen) dialogRef.current?.focus();
  }, [innOpen]);

  const onKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key !== 'Escape') return;
    if (innOpen) close();
    else if (listOpen) setListOpen(false);
  };

  const night = (shot ?? siteMood) === 'night';
  const calm = shot !== null || reducedMotion || (phone && !animate);

  return (
    <section
      aria-labelledby="world-title"
      className="world relative isolate h-[calc(100svh-90px)] min-h-[520px] overflow-hidden sm:h-[calc(100svh-49px)]"
      onKeyDown={onKeyDown}
    >
      <h1 id="world-title" className="sr-only">
        {copy.title}
      </h1>
      <p className="sr-only">A painted village with a small guide robot you can walk along the paths. The inn holds the projects: its button opens them, and the same content is in the list view and on the rest of the site.</p>

      {!shot && (
        <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-start justify-between gap-3 p-3 sm:p-4">
          <Link href="/" className="world-btn pointer-events-auto">
            <span aria-hidden>←</span> <span className="sm:hidden">Quick view</span>
            <span className="hidden sm:inline">{copy.skip}</span>
          </Link>
          <div className="pointer-events-auto flex gap-2">
            {phone && !reducedMotion && (
              <button type="button" className="world-btn" aria-pressed={animate} onClick={() => setAnimate((a) => !a)}>
                {animate ? 'Still' : 'Animate'}
              </button>
            )}
            <button type="button" className="world-btn" aria-expanded={listOpen} aria-controls="world-list" onClick={() => setListOpen((o) => !o)}>
              {copy.listView}
            </button>
          </div>
        </div>
      )}

      <div className="absolute inset-0">
        {hasPlates ? (
          <PlateScene night={night} calm={calm} reduced={reducedMotion} interactive={!shot} paused={innOpen || listOpen} onOpen={open} />
        ) : (
          <VillageSvg night={night} still={calm} onOpen={open} />
        )}
      </div>

      {!shot && listOpen && (
        <div
          id="world-list"
          className="world-panel absolute inset-x-3 top-16 z-30 max-h-[calc(100%-5rem)] overflow-y-auto p-5 sm:inset-x-auto sm:right-4 sm:max-h-[calc(100%-6rem)] sm:w-[26rem]"
        >
          <h2 className="font-mono text-xs uppercase tracking-wider text-muted">Places in the village</h2>
          <h3 className="mt-4 font-semibold">
            {copy.inn} · {copy.innLabel}
          </h3>
          <ProjectList projects={projects} />
        </div>
      )}

      {!shot && innOpen && (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="false"
          aria-labelledby="world-dialog-title"
          tabIndex={-1}
          className="world-dialog absolute inset-x-3 bottom-3 z-40 flex max-h-[calc(100%-6.5rem)] flex-col outline-none sm:left-1/2 sm:right-auto sm:bottom-6 sm:w-[38rem] sm:-translate-x-1/2"
        >
          <p id="world-dialog-title" className="world-speaker">
            {copy.inn} · {copy.innLabel}
          </p>
          {/* Scrolls inside, so the speaker tab above the box is never clipped. */}
          <div className="min-h-0 overflow-y-auto">
            <ProjectList projects={projects} />
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
