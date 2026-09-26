'use client';

// The village from painted plates (art/plates → scripts/world-plates.mjs → public/world/plates).
// Three layers — sky, land (mountains, village, inn, stream), foreground — on the same 16:9 canvas. On wide screens
// the painting is drawn a little wider than the view, so you can look left and right (drag, swipe or the arrow keys),
// with the sky moving less than the land. A small guide robot walks the painted paths to wherever you click or tap;
// walking to the inn opens the projects. Hotspots, glows and paths are placed in plate coordinates
// (content/world-scene.ts), so they stay pinned to the painting at any screen size.
import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type MouseEvent } from 'react';
import plates from '@/content/world-plates.json';
import { plateScene, type Pt } from '@/content/world-scene';
import { worldCopy as copy } from '@/content/world';
import { GuideRobot } from './Guide';
import { netDist, project, route } from './roam';

type LayerId = 'sky' | 'land' | 'foreground';
type Manifest = { plates: Partial<Record<LayerId, Partial<Record<'day' | 'night', number[]>>>> };
const manifest = plates as Manifest;

/** True when at least the land day plate exists (without a sky plate, a plain gradient sky stands in). */
export const hasPlates = !!manifest.plates.land?.day;

/** On wide screens the painting is this much wider than the view, so there's room to look around. */
const ZOOM = 1.25;
/** How far each layer moves when you look around, relative to the land. */
const DEPTH: Record<LayerId, number> = { sky: 0.5, land: 1, foreground: 1 };
/** The guide's height, as a fraction of the plate height, at plate row v (further up the painting = further away). */
const guideHeight = (v: number) => Math.max(0.018, 0.022 + (v - 0.5) * 0.16);
/** Walking speed, in guide heights per second (so it slows down with distance, like the painting's perspective). */
const WALK = 2.6;
/** Arrow-key look speed, px per second. */
const KEY_PAN = 700;

const net = plateScene.walk;
const START = net.nodes[net.start];
const INN = net.nodes[net.inn];

type Box = { width: number; height: number; top: number; cw: number; ch: number };
type Props = {
  night: boolean;
  /** No ambient motion (reduced motion, phones on first load, screenshots). */
  calm: boolean;
  /** prefers-reduced-motion: the guide steps straight to where you click and the view doesn't glide. */
  reduced: boolean;
  /** Off for screenshots: no walking or looking around, and the whole painting fits. */
  interactive: boolean;
  /** A dialog or the list is open: arrow keys are left alone. */
  paused: boolean;
  onOpen: () => void;
};

export default function PlateScene({ night, calm, reduced, interactive, paused, onOpen }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const layers = useRef<Partial<Record<LayerId, HTMLDivElement | null>>>({});
  const guide = useRef<HTMLDivElement>(null);
  const marker = useRef<HTMLSpanElement>(null);
  const [box, setBox] = useState<Box | null>(null);
  const [hint, setHint] = useState(true);
  // Phones crop the plate heavily (the box is much wider than the screen): ask for less resolution to save data.
  const [coarse] = useState(() => typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches);
  const sizes = box ? `${Math.round(coarse ? Math.min(box.width, 1100) : box.width)}px` : '100vw';

  // Everything the animation loop reads and writes, outside React state so a moving frame never re-renders.
  const sim = useRef({
    box: null as Box | null,
    ready: false,
    pan: 0,
    panTarget: 0,
    vel: 0,
    keyDir: 0,
    dragging: false,
    suppressClick: false,
    down: null as null | { x: number; pan: number; id: number },
    samples: [] as { x: number; t: number }[],
    pos: START,
    path: [] as Pt[],
    toInn: false,
    facing: 1,
    raf: 0,
    last: 0,
    paused: false,
    reduced: false,
  });
  const api = useRef<{ walkToInn: () => void } | null>(null);
  const openRef = useRef(onOpen);
  useEffect(() => {
    openRef.current = onOpen;
    sim.current.paused = paused;
    sim.current.reduced = reduced;
  }, [onOpen, paused, reduced]);

  // The plate box: 16:9, at least as tall as the view, and (when roaming) a little wider than it.
  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const measure = () => {
      const cw = el.clientWidth;
      const ch = el.clientHeight;
      const width = Math.max((ch * 16) / 9, cw * (interactive ? ZOOM : 1));
      const height = (width * 9) / 16;
      setBox({ width, height, top: (ch - height) * plateScene.focus.y, cw, ch });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [interactive]);

  // Walking, looking around and the camera, all in one loop that runs only while something moves.
  useEffect(() => {
    const s = sim.current;
    const el = root.current;
    if (!box || !el) return;
    s.box = box;
    const maxPan = () => Math.max(0, box.width - box.cw);
    const clamp = (x: number) => Math.min(maxPan(), Math.max(0, x));
    if (!s.ready) {
      s.pan = s.panTarget = maxPan() * plateScene.focus.x;
      s.ready = true;
    } else {
      s.pan = s.panTarget = clamp(s.panTarget);
    }

    const apply = () => {
      for (const id of Object.keys(DEPTH) as LayerId[]) {
        const node = layers.current[id];
        if (node) node.style.transform = `translate3d(${(-s.pan * DEPTH[id]).toFixed(1)}px, 0, 0)`;
      }
      const g = guide.current;
      if (g) {
        const scale = (guideHeight(s.pos[1]) * box.height) / 56;
        g.style.transform = `translate3d(${(s.pos[0] * box.width - 20).toFixed(1)}px, ${(s.pos[1] * box.height - 56).toFixed(1)}px, 0) scale(${scale.toFixed(3)})`;
        (g.firstElementChild as HTMLElement).style.transform = `scaleX(${s.facing})`;
      }
    };

    const arrive = () => {
      guide.current?.classList.remove('walking');
      if (s.toInn) {
        s.toInn = false;
        openRef.current();
      }
    };

    const tick = (t: number) => {
      const dt = Math.min(0.05, s.last ? (t - s.last) / 1000 : 0.016);
      s.last = t;
      let moving = false;
      if (s.path.length) {
        moving = true;
        const [tx, ty] = s.path[0];
        const dx = (tx - s.pos[0]) * box.width;
        const dy = (ty - s.pos[1]) * box.height;
        const d = Math.hypot(dx, dy);
        const step = guideHeight(s.pos[1]) * box.height * WALK * dt;
        if (Math.abs(dx) > 0.5) s.facing = dx > 0 ? 1 : -1;
        if (d <= step) {
          s.pos = s.path.shift()!;
          if (!s.path.length) arrive();
        } else {
          s.pos = [s.pos[0] + ((dx / d) * step) / box.width, s.pos[1] + ((dy / d) * step) / box.height];
        }
        // The camera keeps the guide in the middle 40% of the view.
        if (!s.dragging) {
          const sx = s.pos[0] * box.width - s.panTarget;
          if (sx < box.cw * 0.3) s.panTarget -= box.cw * 0.3 - sx;
          else if (sx > box.cw * 0.7) s.panTarget += sx - box.cw * 0.7;
        }
      }
      if (s.keyDir) {
        s.panTarget += s.keyDir * KEY_PAN * dt;
        moving = true;
      }
      if (!s.dragging && Math.abs(s.vel) > 8) {
        s.panTarget += s.vel * dt;
        s.vel *= Math.pow(0.03, dt);
        moving = true;
      } else if (!s.dragging) {
        s.vel = 0;
      }
      s.panTarget = clamp(s.panTarget);
      const gap = s.panTarget - s.pan;
      if (s.dragging || s.reduced || Math.abs(gap) < 0.3) s.pan = s.panTarget;
      else {
        s.pan += gap * Math.min(1, dt * 7);
        moving = true;
      }
      apply();
      s.raf = moving ? requestAnimationFrame(tick) : 0;
      if (!moving) s.last = 0;
    };
    const kick = () => {
      if (!s.raf) s.raf = requestAnimationFrame(tick);
    };

    const walkTo = (p: Pt, toInn: boolean) => {
      setHint(false);
      const to = project(net, p);
      s.toInn = toInn || netDist(to.pt, INN) < 0.02;
      if (s.reduced) {
        s.pos = to.pt;
        s.path = [];
        s.panTarget = clamp(s.pos[0] * box.width - box.cw / 2);
        s.pan = s.panTarget;
        apply();
        arrive();
        return;
      }
      s.path = route(net, project(net, s.pos), to);
      guide.current?.classList.add('walking');
      if (marker.current) {
        const m = marker.current;
        m.style.left = `${(to.pt[0] * 100).toFixed(3)}%`;
        m.style.top = `${(to.pt[1] * 100).toFixed(3)}%`;
        m.classList.remove('on');
        void m.offsetWidth; // restart the ping animation
        m.classList.add('on');
      }
      kick();
    };
    api.current = { walkToInn: () => walkTo(INN, true) };
    apply();
    if (!interactive) return;

    const onDown = (e: PointerEvent) => {
      if (!e.isPrimary || e.button > 0) return;
      s.down = { x: e.clientX, pan: s.pan, id: e.pointerId };
      s.samples = [{ x: e.clientX, t: e.timeStamp }];
      s.suppressClick = false;
      s.vel = 0;
    };
    const onMove = (e: PointerEvent) => {
      if (!s.down || e.pointerId !== s.down.id) return;
      const dx = e.clientX - s.down.x;
      if (!s.dragging && Math.abs(dx) > 8 && maxPan() > 0) {
        s.dragging = true;
        el.setPointerCapture(e.pointerId);
        el.classList.add('dragging');
        setHint(false);
      }
      if (!s.dragging) return;
      s.panTarget = clamp(s.down.pan - dx);
      s.samples.push({ x: e.clientX, t: e.timeStamp });
      if (s.samples.length > 6) s.samples.shift();
      kick();
    };
    const onUp = (e: PointerEvent) => {
      if (!s.down || e.pointerId !== s.down.id) return;
      if (s.dragging) {
        const a = s.samples[0];
        const b = s.samples[s.samples.length - 1];
        const ms = b.t - a.t;
        s.vel = ms > 0 && ms < 200 && !s.reduced ? (-(b.x - a.x) / ms) * 1000 : 0;
        s.dragging = false;
        s.suppressClick = true;
        el.classList.remove('dragging');
      }
      s.down = null;
      kick();
    };
    const onClick = (e: globalThis.MouseEvent) => {
      if (s.suppressClick) {
        s.suppressClick = false;
        return;
      }
      if ((e.target as Element).closest('button, a')) return;
      const r = el.getBoundingClientRect();
      walkTo([(e.clientX - r.left + s.pan) / box.width, (e.clientY - r.top - box.top) / box.height], false);
    };
    const typing = (t: EventTarget | null) => t instanceof HTMLElement && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));
    const onKey = (e: KeyboardEvent) => {
      if (s.paused || typing(e.target) || (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight')) return;
      e.preventDefault();
      s.keyDir = e.key === 'ArrowLeft' ? -1 : 1;
      setHint(false);
      kick();
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if ((e.key === 'ArrowLeft' && s.keyDir < 0) || (e.key === 'ArrowRight' && s.keyDir > 0)) s.keyDir = 0;
    };
    const stopKeys = () => {
      s.keyDir = 0;
    };
    el.addEventListener('pointerdown', onDown);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerup', onUp);
    el.addEventListener('pointercancel', onUp);
    el.addEventListener('click', onClick);
    window.addEventListener('keydown', onKey);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', stopKeys);
    return () => {
      el.removeEventListener('pointerdown', onDown);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerup', onUp);
      el.removeEventListener('pointercancel', onUp);
      el.removeEventListener('click', onClick);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', stopKeys);
      cancelAnimationFrame(s.raf);
      s.raf = 0;
    };
  }, [box, interactive]);

  const openInn = (e: MouseEvent) => {
    e.stopPropagation();
    // Keyboard (Enter/Space) opens straight away; a click or tap walks there first.
    if (e.detail === 0 || !interactive) onOpen();
    else api.current?.walkToInn();
  };

  const layer = (id: LayerId, children?: React.ReactNode) => {
    const widths = manifest.plates[id]?.[night ? 'night' : 'day'] ?? manifest.plates[id]?.day;
    const mood = manifest.plates[id]?.[night ? 'night' : 'day'] ? (night ? 'night' : 'day') : 'day';
    if (!widths && id !== 'sky') return null;
    // Night without night plates: grade the day plates in CSS (glows are added on top).
    const graded = night && mood === 'day';
    return (
      <div
        key={id}
        ref={(n) => {
          layers.current[id] = n;
        }}
        className={`pointer-events-none absolute inset-0 ${id === 'sky' && !calm ? 'plate-drift' : ''}`}
      >
        {box && (
          <div className="absolute" style={{ left: 0, top: box.top, width: box.width, height: box.height }}>
            {widths ? (
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
            ) : (
              <SkyFallback />
            )}
            {graded && widths && <div className="plate-night-tint absolute inset-0" />}
            {children}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      ref={root}
      className={`plate-scene absolute inset-0 overflow-hidden ${calm ? 'calm' : ''} ${interactive ? 'roam' : ''}`}
      data-mood={night ? 'night' : 'day'}
    >
      {layer('sky')}
      {layer(
        'land',
        <>
          <Glows night={night} />
          {plateScene.smoke && !calm && <Smoke at={plateScene.smoke} />}
          {night && !calm && <Fireflies area={plateScene.fireflies} />}
          <span ref={marker} aria-hidden className="walk-marker pointer-events-none absolute" />
          <div ref={guide} aria-hidden className="guide pointer-events-none absolute left-0 top-0">
            <div>
              <GuideRobot />
            </div>
          </div>
          <InnHotspot onOpen={openInn} />
        </>,
      )}
      {layer('foreground')}
      {!calm && <Petals night={night} />}
      <div aria-hidden className="lookdev-grain pointer-events-none absolute inset-0" />
      {interactive && hint && (
        <p aria-hidden className="world-hint pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2">
          {coarse ? 'Tap to walk · swipe to look around' : 'Click to walk · drag or ← → to look around'}
        </p>
      )}
    </div>
  );
}

const pct = (v: number) => `${(v * 100).toFixed(3)}%`;

/** Until a sky plate exists: a golden-hour gradient with a few soft clouds, so the sky's parallax still reads. */
const CLOUDS: [number, number, number][] = [
  [4, 5, 17],
  [27, 11, 12],
  [45, 3, 20],
  [70, 9, 15],
  [88, 2, 13],
];
function SkyFallback() {
  return (
    <div className="plate-sky-fallback absolute inset-0">
      {CLOUDS.map(([left, top, width], i) => (
        <i key={i} className="plate-cloud" style={{ left: `${left}%`, top: `${top}%`, width: `${width}%` }} />
      ))}
    </div>
  );
}

function InnHotspot({ onOpen }: { onOpen: (e: MouseEvent) => void }) {
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
