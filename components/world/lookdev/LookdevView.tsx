'use client';

// /world/lookdev: the three look-development frames of the Field Ops Depot, switchable, with day/night from the
// site theme, a frame-rate meter and the device check, so they can be judged on real laptops and phones.
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import type { Place } from '@/content/world';
import { PlaceBody } from '../WorldView';
import { probeDevice, useSiteMood, type Probe } from '../useEnv';

const Lookdev3D = dynamic(() => import('./Village3D'), { ssr: false });
const VillageB = dynamic(() => import('./VillageB'), { ssr: false });

type Style = 'a' | 'b' | 'c';
const STYLES: { id: Style; name: string; line: string }[] = [
  { id: 'a', name: 'A · Pushed 3D', line: 'Cel shading, rim light, thick ink, bloom, 3D cumulus, petals, street-level camera.' },
  { id: 'b', name: 'B · 2.5D painted', line: 'Layered illustrated planes with parallax. No WebGL.' },
  { id: 'c', name: 'C · Hybrid', line: 'The 3D town from A in front of the painted sky and clouds from B.' },
];

export function LookdevView({ depot }: { depot: Place }) {
  const siteMood = useSiteMood();
  const [style, setStyle] = useState<Style>('a');
  const [override, setOverride] = useState<{ night: boolean | null; shot: boolean; noPost: boolean }>({ night: null, shot: false, noPost: false });
  const [open, setOpen] = useState(false);
  const [probe, setProbe] = useState<Probe | null>(null);
  const [stats, setStats] = useState<{ calls: number; triangles: number } | null>(null);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const s = q.get('style');
    const m = q.get('mood');
    // One-time read of the URL and the device (both unavailable during server render).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (s === 'a' || s === 'b' || s === 'c') setStyle(s);
    setOverride({ night: m === 'night' ? true : m === 'day' ? false : null, shot: q.has('shot'), noPost: q.get('post') === '0' });
    setProbe(probeDevice());
  }, []);

  const night = override.night ?? siteMood === 'night';
  const current = STYLES.find((s) => s.id === style)!;
  const pick = (s: Style) => {
    setStyle(s);
    setStats(null);
    const q = new URLSearchParams(window.location.search);
    q.set('style', s);
    window.history.replaceState(null, '', `?${q.toString()}`);
  };

  return (
    <section aria-labelledby="lookdev-title" className="world relative isolate h-[calc(100svh-90px)] min-h-[520px] overflow-hidden sm:h-[calc(100svh-49px)]">
      <h1 id="lookdev-title" className="sr-only">
        World look-dev: {current.name}
      </h1>
      <div className="absolute inset-0">
        {style === 'b' ? (
          <VillageB key="b" night={night} still={override.shot} onOpen={() => setOpen(true)} />
        ) : (
          <Lookdev3D key={style} night={night} backdrop={style === 'c' ? 'painted' : 'sky'} still={override.shot} noPost={override.noPost} onOpen={() => setOpen(true)} onStats={setStats} />
        )}
      </div>

      {!override.shot && (
        <>
          <div className="absolute inset-x-0 top-0 z-30 flex flex-wrap items-start justify-between gap-2 p-3 sm:p-4">
            <Link href="/world" className="world-btn">
              <span aria-hidden>←</span> Back to /world
            </Link>
            <div role="group" aria-label="Style" className="flex flex-wrap gap-2">
              {STYLES.map((s) => (
                <button key={s.id} type="button" aria-pressed={style === s.id} className={style === s.id ? 'world-cta' : 'world-btn'} onClick={() => pick(s.id)}>
                  {s.name}
                </button>
              ))}
            </div>
          </div>
          <div className="world-status absolute bottom-3 left-3 z-30 max-w-[calc(100%-1.5rem)] space-y-1 sm:bottom-4 sm:left-4 sm:max-w-md">
            <p>
              <strong>{current.name}.</strong> {current.line} Day/night follows the theme switch.
            </p>
            <Fps />
            {stats && (
              <p className="font-mono text-xs text-muted">
                {stats.calls} draw calls · {Math.round(stats.triangles / 1000)}k triangles per frame
              </p>
            )}
            {probe && (
              <details className="text-xs text-muted">
                <summary className="cursor-pointer">Device check: {probe.verdict === 'ok' ? 'would load the 3D' : `would show the still (${probe.reason})`}</summary>
                <p className="mt-1 break-words font-mono">{probe.details}</p>
              </details>
            )}
          </div>
          {open && (
            <div role="dialog" aria-labelledby="lookdev-dialog-title" className="world-dialog absolute inset-x-3 bottom-3 z-40 sm:left-1/2 sm:right-auto sm:bottom-6 sm:w-[36rem] sm:-translate-x-1/2">
              <p id="lookdev-dialog-title" className="world-speaker">
                {depot.name}
              </p>
              <PlaceBody place={depot} dialog onBack={() => setOpen(false)} />
            </div>
          )}
        </>
      )}
    </section>
  );
}

/** Frames per second of the page, averaged over the last second. */
function Fps() {
  const [fps, setFps] = useState(0);
  const frames = useRef(0);
  useEffect(() => {
    let raf = 0;
    let t0 = performance.now();
    const loop = (now: number) => {
      frames.current++;
      if (now - t0 >= 1000) {
        setFps(Math.round((frames.current * 1000) / (now - t0)));
        frames.current = 0;
        t0 = now;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);
  return <p className="font-mono text-xs text-muted">{fps} fps on this device</p>;
}
