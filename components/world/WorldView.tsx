'use client';

// /world: poster first, then (on capable devices) the live town fades in over it.
// Everything you can do in the scene is also plain HTML: pins are buttons, the dialogue is a DOM region,
// and the list view shows every place with real links (WORLD.md §5, §7).
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react';
import type { CameraControlsImpl } from '@react-three/drei';
import { Chip } from '@/components/site/Chip';
import type { Place } from '@/content/world';
import { worldCopy as copy } from '@/content/world';
import type { Mood } from './palette';
import { probeDevice, useReducedMotion, useSiteMood } from './useEnv';

const Scene = dynamic(() => import('./Scene'), { ssr: false });

type Phase = 'poster' | 'loading' | 'live' | 'fallback';

// Test override (?world=force, ?shot=…): development and preview builds only, never production.
const TEST_OK = process.env.NEXT_PUBLIC_WORLD_TEST === '1';

export function WorldView({ places, overview }: { places: Place[]; overview: Place['view'] }) {
  const siteMood = useSiteMood();
  const reducedMotion = useReducedMotion();
  const [phase, setPhase] = useState<Phase>('poster');
  const [canTry, setCanTry] = useState(false);
  const [test, setTest] = useState<{ force: boolean; shot: Mood | null; open: string | null; hero: boolean }>({
    force: false,
    shot: null,
    open: null,
    hero: false,
  });
  const [activeId, setActiveId] = useState<string | null>(null);
  const [listOpen, setListOpen] = useState(false);
  const controls = useRef<CameraControlsImpl | null>(null);
  const opener = useRef<HTMLElement | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const sceneBox = useRef<HTMLDivElement>(null);
  const pinRefs = useRef(new Map<string, HTMLElement>());

  // Decide, after the page is interactive, whether to load the 3D at all.
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const force = TEST_OK && (q.get('world') === 'force' || q.has('shot'));
    const shotParam = q.get('shot');
    const shot: Mood | null = TEST_OK && (shotParam === 'day' || shotParam === 'night' || shotParam === 'dusk') ? shotParam : null;
    const t = { force, shot, open: TEST_OK ? q.get('open') : null, hero: shot !== null && q.get('mode') === 'hero' };
    const start = () => {
      setTest(t);
      if (force) return setPhase('loading');
      const probe = probeDevice();
      if (probe === 'ok') return setPhase('loading');
      setCanTry(probe === 'weak');
      setPhase('fallback');
      setListOpen(true);
    };
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
    if (w.requestIdleCallback) w.requestIdleCallback(start, { timeout: 1500 });
    else setTimeout(start, 200);
  }, []);

  const open = useCallback((id: string) => {
    opener.current = document.activeElement as HTMLElement | null;
    setListOpen(false);
    setActiveId(id);
  }, []);
  const close = useCallback(() => {
    setActiveId((prev) => {
      if (prev) {
        const back = opener.current;
        requestAnimationFrame(() => (back && document.contains(back) ? back : sceneBox.current)?.focus());
      }
      return null;
    });
  }, []);

  // Move focus into the dialogue when it opens.
  useEffect(() => {
    if (activeId) dialogRef.current?.focus();
  }, [activeId]);

  // Test hook for screenshots: ?open=depot opens a place once the scene is live.
  useEffect(() => {
    if (phase !== 'live' || !test.open) return;
    const r = requestAnimationFrame(() => open(test.open!));
    return () => cancelAnimationFrame(r);
  }, [phase, test.open, open]);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      if (activeId) close();
      else if (listOpen) setListOpen(false);
      return;
    }
    // Arrow keys look around while the town itself has focus.
    if (e.target === sceneBox.current && controls.current) {
      const step = 0.12;
      const map: Record<string, [number, number]> = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] };
      const d = map[e.key];
      if (d) {
        e.preventDefault();
        void controls.current.rotate(d[0], d[1], !reducedMotion);
      }
    }
  };

  const mood: Mood = test.shot ?? siteMood;
  const active = places.find((p) => p.id === activeId) ?? null;
  const live = phase === 'live';
  const shot = test.shot !== null;

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
        An illustrated town where each project is a place. The same content is in the list view and on the rest of the site.
      </p>

      {!shot && (
        <>
          {/* Always visible: the way back to the normal site. First thing you can tab to. */}
          <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-start justify-between gap-3 p-3 sm:p-4">
            <Link href="/" className="world-btn pointer-events-auto">
              <span aria-hidden>←</span> {copy.skip}
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

        </>
      )}

      {/* Poster: always painted first; stays if the 3D can't run. */}
      <div aria-hidden className={`world-poster absolute inset-0 transition-opacity duration-700 ${live ? 'opacity-0' : 'opacity-100'}`} />

      {(phase === 'loading' || phase === 'live') && (
        <div
          ref={sceneBox}
          tabIndex={0}
          role="group"
          aria-label="The town. Use the arrow keys to look around, or Tab to the places."
          className={`absolute inset-0 outline-none transition-opacity duration-700 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent ${live ? 'opacity-100' : 'opacity-0'}`}
        >
          <Scene
            mood={mood}
            mode={test.hero ? 'hero' : 'world'}
            places={places}
            overview={overview}
            activeId={activeId}
            onOpen={open}
            onClose={close}
            reducedMotion={reducedMotion}
            shot={shot}
            force={test.force}
            controlsRef={controls}
            pinRefs={pinRefs}
            onReady={() => setPhase('live')}
            onFail={() => {
              setCanTry(false);
              setPhase('fallback');
              setListOpen(true);
            }}
          />
        </div>
      )}

      {live && !shot && (
        <div className={`pointer-events-none absolute inset-0 z-20 overflow-hidden ${activeId ? 'hidden' : ''}`}>
          {places.map((p) => (
            <button
              key={p.id}
              type="button"
              ref={(el) => {
                if (el) pinRefs.current.set(p.id, el);
                else pinRefs.current.delete(p.id);
              }}
              className="world-pin pointer-events-auto absolute left-0 top-0"
              style={{ visibility: 'hidden' }}
              data-active={activeId === p.id || undefined}
              aria-haspopup="dialog"
              onClick={() => open(p.id)}
            >
              {p.name}
            </button>
          ))}
        </div>
      )}

      {!shot && (
        <>
          {(phase === 'poster' || phase === 'loading') && (
            <p role="status" className="world-status absolute bottom-3 left-3 z-20 sm:bottom-4 sm:left-4">
              {copy.loading}
            </p>
          )}
          {phase === 'fallback' && (
            <div role="status" className="world-status absolute bottom-3 left-3 right-3 z-20 flex flex-wrap items-center gap-3 sm:bottom-4 sm:left-4 sm:right-auto sm:max-w-md">
              <span>{copy.fallback}</span>
              {canTry && (
                <button
                  type="button"
                  className="underline decoration-line underline-offset-4 hover:text-accent"
                  onClick={() => {
                    setListOpen(false);
                    setPhase('loading');
                  }}
                >
                  {copy.tryAnyway}
                </button>
              )}
            </div>
          )}

          {listOpen && (
            <div
              id="world-list"
              className="world-panel absolute inset-x-3 top-16 z-30 max-h-[calc(100%-9.5rem)] overflow-y-auto p-5 sm:inset-x-auto sm:right-4 sm:max-h-[calc(100%-6rem)] sm:w-[26rem]"
            >
              <h2 className="font-mono text-xs uppercase tracking-wider text-muted">Places in the town</h2>
              <ul className="mt-4 space-y-6">
                {places.map((p) => (
                  <li key={p.id}>
                    <PlaceBody place={p} headingLevel={3} />
                  </li>
                ))}
              </ul>
            </div>
          )}

          {active && (
            <div
              ref={dialogRef}
              role="dialog"
              aria-modal="false"
              aria-labelledby="world-dialog-title"
              tabIndex={-1}
              className="world-dialog absolute inset-x-3 bottom-3 z-40 outline-none sm:left-1/2 sm:right-auto sm:bottom-6 sm:w-[36rem] sm:-translate-x-1/2"
            >
              <p id="world-dialog-title" className="world-speaker">
                {active.name}
              </p>
              <PlaceBody place={active} dialog onBack={close} />
            </div>
          )}
        </>
      )}
    </section>
  );
}

function PlaceBody({ place, dialog, onBack, headingLevel }: { place: Place; dialog?: boolean; onBack?: () => void; headingLevel?: 3 }) {
  return (
    <div>
      {headingLevel && <h3 className="mb-2 font-semibold">{place.name}</h3>}
      <div className={`space-y-2 text-sm leading-relaxed ${dialog ? 'sm:text-[0.9375rem]' : ''}`}>
        {place.lines.map((l) => (
          <p key={l}>{l}</p>
        ))}
      </div>
      {(place.proof || place.note) && (
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
          {place.proof && <Chip tone={place.proof.tone}>{place.proof.label}</Chip>}
          {place.note && <span className="text-xs text-muted">{place.note}</span>}
        </div>
      )}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        {place.links.map((l) => (
          <Link key={l.href} href={l.href} className={l.primary ? 'world-cta' : 'world-btn'}>
            {l.label} <span aria-hidden>→</span>
          </Link>
        ))}
        {onBack && (
          <button type="button" className="world-btn" onClick={onBack}>
            {copy.back}
          </button>
        )}
      </div>
    </div>
  );
}
