'use client';

// The village from painted plates (art/plates → scripts/world-plates.mjs → public/world/plates).
// Three layers with parallax — sky, land (mountains, village, inn, stream), foreground — all on the same 16:9
// canvas, cropped around a focus point so phones keep the inn in view. Hotspots and glows are placed in plate
// coordinates (content/world-scene.ts), so they stay pinned to the painting at any screen size.
import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import plates from '@/content/world-plates.json';
import { plateScene, type Pt } from '@/content/world-scene';
import { worldCopy as copy } from '@/content/world';

type LayerId = 'sky' | 'land' | 'foreground';
type Manifest = { plates: Partial<Record<LayerId, Partial<Record<'day' | 'night', number[]>>>> };
const manifest = plates as Manifest;

/** True when at least the land day plate exists (without a sky plate, a plain gradient sky stands in). */
export const hasPlates = !!manifest.plates.land?.day;

const DEPTH: Record<LayerId, number> = { sky: 8, land: 30, foreground: 96 };

export default function PlateScene({ night, calm, onOpen }: { night: boolean; calm: boolean; onOpen: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const refs = useRef<Partial<Record<LayerId, HTMLDivElement | null>>>({});
  const [box, setBox] = useState<{ left: number; top: number; width: number; height: number } | null>(null);
  // Phones crop the plate heavily (the box is much wider than the screen): ask for less resolution to save data.
  const [coarse] = useState(() => typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches);
  const sizes = box ? `${Math.round(coarse ? Math.min(box.width, 1100) : box.width)}px` : '100vw';

  // The plate box: 16:9, covering the (parallax-padded) layer, cropped around the focus point.
  useLayoutEffect(() => {
    const el = refs.current.land;
    if (!el) return;
    const measure = () => {
      const cw = el.clientWidth;
      const ch = el.clientHeight;
      const width = Math.max(cw, (ch * 16) / 9);
      const height = (width * 9) / 16;
      setBox({ width, height, left: (cw - width) * plateScene.focus.x, top: (ch - height) * plateScene.focus.y });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Pointer parallax, eased; off when calm (reduced motion, phones on first load, screenshots).
  useEffect(() => {
    if (calm) return;
    const el = root.current!;
    let tx = 0;
    let ty = 0;
    let x = 0;
    let y = 0;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width) * 2 - 1;
      ty = ((e.clientY - r.top) / r.height) * 2 - 1;
    };
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const dx = tx - x;
      const dy = ty - y;
      if (Math.abs(dx) < 0.001 && Math.abs(dy) < 0.001) return;
      x += dx * 0.08;
      y += dy * 0.08;
      const scale = el.clientWidth / 1600;
      for (const id of Object.keys(DEPTH) as LayerId[]) {
        const node = refs.current[id];
        if (node) node.style.transform = `translate3d(${(-x * DEPTH[id] * scale).toFixed(2)}px, ${(-y * DEPTH[id] * 0.4 * scale).toFixed(2)}px, 0)`;
      }
    };
    el.addEventListener('pointermove', onMove);
    raf = requestAnimationFrame(loop);
    return () => {
      el.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
    };
  }, [calm]);

  const layer = (id: LayerId, children?: React.ReactNode) => {
    const widths = manifest.plates[id]?.[night ? 'night' : 'day'] ?? manifest.plates[id]?.day;
    const mood = manifest.plates[id]?.[night ? 'night' : 'day'] ? (night ? 'night' : 'day') : 'day';
    // Night without night plates: grade the day plates in CSS (glows are added on top).
    const graded = night && mood === 'day';
    return (
      <div
        key={id}
        ref={(n) => {
          refs.current[id] = n;
        }}
        className={`pointer-events-none absolute -inset-[6%] ${id === 'sky' && !calm ? 'plate-drift' : ''}`}
      >
        {!widths && id === 'sky' && <div className="plate-sky-fallback absolute inset-0" />}
        {box && widths && (
          <div className="absolute" style={{ left: box.left, top: box.top, width: box.width, height: box.height }}>
            <picture>
              <source type="image/avif" srcSet={widths.map((w) => `/world/plates/${id}-${mood}-${w}.avif ${w}w`).join(', ')} sizes={sizes} />
              <img
                src={`/world/plates/${id}-${mood}-${widths[widths.length - 1]}.webp`}
                srcSet={widths.map((w) => `/world/plates/${id}-${mood}-${w}.webp ${w}w`).join(', ')}
                sizes={sizes}
                alt=""
                aria-hidden
                decoding="async"
                fetchPriority={id === 'land' ? 'high' : 'auto'}
                className={`absolute inset-0 h-full w-full select-none ${graded ? 'plate-night-grade' : ''}`}
                draggable={false}
              />
            </picture>
            {graded && <div className="plate-night-tint absolute inset-0" />}
            {children}
          </div>
        )}
      </div>
    );
  };

  return (
    <div ref={root} className={`plate-scene absolute inset-0 overflow-hidden ${calm ? 'calm' : ''}`} data-mood={night ? 'night' : 'day'}>
      {layer('sky')}
      {layer(
        'land',
        <>
          <Glows night={night} />
          {plateScene.smoke && !calm && <Smoke at={plateScene.smoke} />}
          {night && !calm && <Fireflies area={plateScene.fireflies} />}
          <InnHotspot onOpen={onOpen} />
        </>,
      )}
      {layer('foreground')}
      {!calm && <Petals night={night} />}
      <div aria-hidden className="lookdev-grain pointer-events-none absolute inset-0" />
    </div>
  );
}

const pct = (v: number) => `${(v * 100).toFixed(3)}%`;

function InnHotspot({ onOpen }: { onOpen: () => void }) {
  const { polygon, label } = plateScene.inn;
  const xs = polygon.map((p) => p[0]);
  const ys = polygon.map((p) => p[1]);
  const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  const clip = polygon.map(([x, y]) => `${(((x - x0) / (x1 - x0)) * 100).toFixed(2)}% ${(((y - y0) / (y1 - y0)) * 100).toFixed(2)}%`).join(', ');
  return (
    <>
      <button
        type="button"
        aria-label={`${copy.inn}: ${copy.innLabel.toLowerCase()}`}
        aria-haspopup="dialog"
        onClick={onOpen}
        className="plate-hotspot pointer-events-auto absolute cursor-pointer"
        style={{ left: pct(x0), top: pct(y0), width: pct(x1 - x0), height: pct(y1 - y0), clipPath: `polygon(${clip})` }}
      />
      <span aria-hidden className="world-pin pointer-events-none absolute" style={{ left: pct(label[0]), top: pct(label[1]), transform: 'translate(-50%, -100%)' }}>
        {copy.innLabel}
      </span>
    </>
  );
}

function Glows({ night }: { night: boolean }) {
  return (
    <>
      {plateScene.lanterns.map((l, i) => (
        <span
          key={i}
          aria-hidden
          className="plate-glow lookdev-flicker pointer-events-none absolute"
          style={{ left: pct(l.at[0]), top: pct(l.at[1]), width: pct(l.r * 2), aspectRatio: '1', opacity: night ? 0.9 : 0.35 }}
        />
      ))}
      {night &&
        plateScene.windows.map((w, i) => (
          <span key={i} aria-hidden className="plate-window pointer-events-none absolute" style={{ left: pct(w.at[0]), top: pct(w.at[1]), width: pct(w.w), height: pct(w.h) }} />
        ))}
    </>
  );
}

function Smoke({ at }: { at: Pt }) {
  return (
    <span aria-hidden className="plate-smoke pointer-events-none absolute" style={{ left: pct(at[0]), top: pct(at[1]) }}>
      <i />
      <i />
      <i />
    </span>
  );
}

function lcg(seed: number) {
  let s = seed;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

function Fireflies({ area }: { area: [number, number, number, number] }) {
  const flies = useMemo(() => {
    const r = lcg(11);
    return Array.from({ length: 20 }, () => ({ x: area[0] + r() * (area[2] - area[0]), y: area[1] + r() * (area[3] - area[1]), d: -r() * 6 }));
  }, [area]);
  return (
    <>
      {flies.map((q, i) => (
        <span key={i} aria-hidden className="plate-firefly pointer-events-none absolute" style={{ left: pct(q.x), top: pct(q.y), animationDelay: `${q.d}s` }} />
      ))}
    </>
  );
}

function Petals({ night }: { night: boolean }) {
  const petals = useMemo(() => {
    const r = lcg(7);
    return Array.from({ length: 22 }, () => ({ left: r() * 60, delay: -r() * 14, dur: 10 + r() * 7, size: 6 + r() * 6, sway: 30 + r() * 60 }));
  }, []);
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {petals.map((q, i) => (
        <span
          key={i}
          className="lookdev-petal"
          style={
            {
              left: `${q.left}%`,
              width: q.size,
              height: q.size * 0.62,
              background: night ? '#c9a4c8' : '#f7b8ca',
              animationDuration: `${q.dur}s`,
              animationDelay: `${q.delay}s`,
              '--sway': `${q.sway}px`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
