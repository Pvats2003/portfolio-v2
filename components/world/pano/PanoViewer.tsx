'use client';

// The 360° viewer at /world. Each viewpoint is a cube of six painted faces (scripts/world-pano.mjs) shown with CSS 3D
// transforms, so there's no WebGL or 3D library to download. Hotspots live in the same 3D space as the faces, so they
// stay pinned to the scenery as you look around. Drag or swipe to look, scroll or pinch to zoom, arrow keys and +/−
// work too, and phones can opt in to device tilt. Arrows on the ground hop to the next viewpoint.
import { Fragment, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { worldCopy as copy } from '@/content/world';
import { faceSizes, firstSpot, spots, type Hotspot, type PlaceId, type SpotId } from '@/content/world-pano';
import { lookFromOrientation, requestTilt, tiltAvailable } from '../tilt';

const FACES = ['f', 'r', 'b', 'l', 'u', 'd'] as const;
/** How each face sits on the cube, looking inward from the centre (matches the face maths in world-pano.mjs). */
const FACE_TURN: Record<(typeof FACES)[number], string> = {
  f: '',
  r: 'rotateY(-90deg)',
  b: 'rotateY(180deg)',
  l: 'rotateY(90deg)',
  u: 'rotateX(-90deg)',
  d: 'rotateX(90deg)',
};
const FOV_MIN = 30;
const FOV_MAX = 95;
const PITCH_MAX = 82;
const KEY_TURN = 80; // degrees per second
const LABEL: Record<PlaceId, string> = { inn: copy.innLabel, resume: copy.resume, contact: copy.contact };

type Props = {
  /** Dark theme: the moonlit faces, glowing windows and fireflies. */
  night: boolean;
  /** Off for screenshots (?shot): no dragging or keys. */
  interactive: boolean;
  /** prefers-reduced-motion: no gliding, no inertia, instant hops. */
  reduced: boolean;
  /** A dialog or the list is open: keys are left alone. */
  paused: boolean;
  onPlace: (id: PlaceId) => void;
};

export default function PanoViewer({ night, interactive, reduced, paused, onPlace }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const cube = useRef<HTMLDivElement>(null);
  const [spotId, setSpotId] = useState<SpotId>(firstSpot);
  // Night faces are only downloaded once the dark theme is actually used, then kept; they fade in when all six are in.
  const [wantNight, setWantNight] = useState(night);
  const [nightReady, setNightReady] = useState<SpotId | null>(null);
  const nightLoads = useRef(new Set<string>());
  if (night && !wantNight) setWantNight(true);
  const [fading, setFading] = useState(false);
  const [hint, setHint] = useState(true);
  const [tilt, setTilt] = useState<'off' | 'on' | 'denied'>('off');
  const [coarse] = useState(() => typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches);
  const [canTilt] = useState(() => tiltAvailable());
  // Phones get the smaller faces (less to download and less GPU memory).
  const size = coarse ? faceSizes[faceSizes.length - 1] : faceSizes[0];
  const R = size / 2 - 24; // hotspots float just inside the cube
  const current = spots[spotId];

  const view = useRef({
    yaw: current.start.yaw,
    pitch: current.start.pitch,
    fov: coarse ? 72 : 68,
    vy: 0,
    vp: 0,
    keys: { yaw: 0, pitch: 0, zoom: 0 },
    tween: null as null | { from: [number, number, number]; to: [number, number, number]; t0: number; ms: number; done?: () => void },
    tiltOn: false,
    tiltOffset: null as null | [number, number],
    tiltLook: null as null | [number, number],
    paused: false,
    reduced: false,
    night: false,
    raf: 0,
    last: 0,
    kick: () => {},
  });
  useEffect(() => {
    view.current.paused = paused;
    view.current.reduced = reduced;
    view.current.night = night;
  }, [paused, reduced, night]);

  // Camera: the cube sits at the eye; perspective sets the field of view.
  useLayoutEffect(() => {
    const v = view.current;
    const el = root.current;
    if (!el) return;
    const wrap = (a: number) => ((((a + 180) % 360) + 360) % 360) - 180;
    const apply = () => {
      const h = el.clientHeight || 1;
      const P = h / 2 / Math.tan((v.fov * Math.PI) / 360);
      if (stage.current) stage.current.style.perspective = `${P.toFixed(1)}px`;
      if (cube.current) {
        cube.current.style.transform = `translateZ(${P.toFixed(1)}px) rotateX(${v.pitch.toFixed(3)}deg) rotateY(${v.yaw.toFixed(3)}deg)`;
        cube.current.style.setProperty('--hs', (R / P).toFixed(4));
      }
    };
    const tick = (t: number) => {
      const dt = Math.min(0.05, v.last ? (t - v.last) / 1000 : 0.016);
      v.last = t;
      let moving = false;
      if (v.tween) {
        if (v.tween.t0 < 0) v.tween.t0 = t; // stamped on the first frame
        const k = Math.min(1, (t - v.tween.t0) / v.tween.ms);
        const e = k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2;
        const [y0, p0, f0] = v.tween.from;
        const [y1, p1, f1] = v.tween.to;
        v.yaw = y0 + wrap(y1 - y0) * e;
        v.pitch = p0 + (p1 - p0) * e;
        v.fov = f0 + (f1 - f0) * e;
        moving = true;
        if (k >= 1) {
          const done = v.tween.done;
          v.tween = null;
          done?.();
        }
      } else {
        if (v.keys.yaw || v.keys.pitch || v.keys.zoom) {
          v.yaw += v.keys.yaw * KEY_TURN * dt;
          v.pitch += v.keys.pitch * KEY_TURN * dt;
          v.fov *= Math.exp(v.keys.zoom * dt * 1.2);
          moving = true;
        }
        if (Math.abs(v.vy) > 0.5 || Math.abs(v.vp) > 0.5) {
          v.yaw += v.vy * dt;
          v.pitch += v.vp * dt;
          const decay = Math.pow(0.02, dt);
          v.vy *= decay;
          v.vp *= decay;
          moving = true;
        } else {
          v.vy = v.vp = 0;
        }
        if (v.tiltOn && v.tiltLook) {
          if (!v.tiltOffset) v.tiltOffset = [v.yaw - v.tiltLook[0], v.pitch - v.tiltLook[1]];
          const ty = v.tiltLook[0] + v.tiltOffset[0];
          const tp = v.tiltLook[1] + v.tiltOffset[1];
          v.yaw += wrap(ty - v.yaw) * Math.min(1, dt * 10);
          v.pitch += (tp - v.pitch) * Math.min(1, dt * 10);
          moving = true;
        }
      }
      v.yaw = wrap(v.yaw);
      v.pitch = Math.max(-PITCH_MAX, Math.min(PITCH_MAX, v.pitch));
      v.fov = Math.max(FOV_MIN, Math.min(FOV_MAX, v.fov));
      apply();
      v.raf = moving ? requestAnimationFrame(tick) : 0;
      if (!moving) v.last = 0;
    };
    v.kick = () => {
      if (!v.raf) v.raf = requestAnimationFrame(tick);
    };
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(el);
    return () => {
      ro.disconnect();
      cancelAnimationFrame(v.raf);
      v.raf = 0;
    };
  }, [R]);

  // Input: drag / swipe, pinch, wheel, keys.
  useEffect(() => {
    const v = view.current;
    const el = root.current;
    if (!el || !interactive) return;
    const pts = new Map<number, { x: number; y: number }>();
    let pinch: null | { d: number; fov: number } = null;
    let samples: { x: number; y: number; t: number }[] = [];
    const degPerPx = () => v.fov / (el.clientHeight || 1);
    const spread = () => {
      const [a, b] = [...pts.values()];
      return Math.hypot(a.x - b.x, a.y - b.y);
    };
    const onDown = (e: PointerEvent) => {
      if ((e.target as Element).closest('button, a')) return;
      el.setPointerCapture(e.pointerId);
      pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
      v.vy = v.vp = 0;
      v.tween = null;
      samples = [{ x: e.clientX, y: e.clientY, t: e.timeStamp }];
      if (pts.size === 2) pinch = { d: spread(), fov: v.fov };
      el.classList.add('dragging');
      setHint(false);
    };
    const onMove = (e: PointerEvent) => {
      const p = pts.get(e.pointerId);
      if (!p) return;
      const dx = e.clientX - p.x;
      const dy = e.clientY - p.y;
      p.x = e.clientX;
      p.y = e.clientY;
      if (pinch && pts.size === 2) {
        v.fov = pinch.fov * (pinch.d / Math.max(1, spread()));
      } else if (pts.size === 1) {
        const k = degPerPx();
        // Drag the scenery: moving right turns you left. With tilt on, dragging shifts the tilt's starting point.
        if (v.tiltOn && v.tiltOffset) {
          v.tiltOffset[0] -= dx * k;
          v.tiltOffset[1] += dy * k;
        } else {
          v.yaw -= dx * k;
          v.pitch += dy * k;
        }
        samples.push({ x: e.clientX, y: e.clientY, t: e.timeStamp });
        if (samples.length > 6) samples.shift();
      }
      v.kick();
    };
    const onUp = (e: PointerEvent) => {
      if (!pts.has(e.pointerId)) return;
      pts.delete(e.pointerId);
      if (pts.size < 2) pinch = null;
      if (pts.size === 0) {
        el.classList.remove('dragging');
        const a = samples[0];
        const b = samples[samples.length - 1];
        const ms = b ? b.t - a.t : 0;
        if (!v.reduced && !v.tiltOn && ms > 0 && ms < 160) {
          const k = degPerPx();
          v.vy = (-(b.x - a.x) / ms) * 1000 * k;
          v.vp = ((b.y - a.y) / ms) * 1000 * k;
        }
        v.kick();
      }
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      v.tween = null;
      v.fov *= Math.exp(e.deltaY * 0.0012);
      setHint(false);
      v.kick();
    };
    const typing = (t: EventTarget | null) => t instanceof HTMLElement && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));
    const KEYS: Record<string, [keyof typeof v.keys, number]> = {
      ArrowLeft: ['yaw', -1],
      ArrowRight: ['yaw', 1],
      ArrowUp: ['pitch', 1],
      ArrowDown: ['pitch', -1],
      '+': ['zoom', -1],
      '=': ['zoom', -1],
      '-': ['zoom', 1],
    };
    const onKey = (e: KeyboardEvent) => {
      const k = KEYS[e.key];
      if (!k || v.paused || typing(e.target)) return;
      e.preventDefault();
      v.tween = null;
      v.keys[k[0]] = k[1];
      setHint(false);
      v.kick();
    };
    const onKeyUp = (e: KeyboardEvent) => {
      const k = KEYS[e.key];
      if (k) v.keys[k[0]] = 0;
    };
    const stop = () => {
      v.keys = { yaw: 0, pitch: 0, zoom: 0 };
    };
    el.addEventListener('pointerdown', onDown);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerup', onUp);
    el.addEventListener('pointercancel', onUp);
    el.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKey);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', stop);
    return () => {
      el.removeEventListener('pointerdown', onDown);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerup', onUp);
      el.removeEventListener('pointercancel', onUp);
      el.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', stop);
    };
  }, [interactive]);

  // Device tilt, once the visitor turns it on.
  useEffect(() => {
    const v = view.current;
    if (tilt !== 'on') return;
    v.tiltOn = true;
    v.tiltOffset = null;
    const onOrient = (e: DeviceOrientationEvent) => {
      if (e.alpha === null || e.beta === null || e.gamma === null) return;
      v.tiltLook = lookFromOrientation(e.alpha, e.beta, e.gamma, screen.orientation?.angle ?? 0);
      v.kick();
    };
    window.addEventListener('deviceorientation', onOrient);
    return () => {
      window.removeEventListener('deviceorientation', onOrient);
      v.tiltOn = false;
      v.tiltLook = null;
    };
  }, [tilt]);

  // Once the visitor starts looking around (the hint goes away), fetch the next viewpoints' faces so hops are quick.
  // Not before: a visitor who only glances at the first view downloads just that one.
  useEffect(() => {
    if (hint) return;
    const t = setTimeout(() => {
      for (const h of current.hotspots) {
        if (h.kind !== 'go') continue;
        for (const f of FACES) new Image().src = faceSrc(h.to, f, size);
      }
    }, 800);
    return () => clearTimeout(t);
  }, [current, size, hint]);

  const glideTo = (yaw: number, pitch: number, fov: number, ms: number, done?: () => void) => {
    const v = view.current;
    v.vy = v.vp = 0;
    if (v.reduced) {
      [v.yaw, v.pitch, v.fov] = [yaw, pitch, fov];
      v.kick();
      done?.();
      return;
    }
    v.tween = { from: [v.yaw, v.pitch, v.fov], to: [yaw, pitch, fov], t0: -1, ms, done };
    v.kick();
  };

  const hop = (h: Extract<Hotspot, { kind: 'go' }>) => {
    const v = view.current;
    const fovBefore = v.fov;
    setHint(false);
    // Turn toward the arrow and push in, fade, swap the panorama, then open back out facing onward.
    glideTo(h.yaw, Math.max(-20, h.pitch + 10), Math.max(FOV_MIN, fovBefore * 0.6), 420);
    setFading(true);
    window.setTimeout(
      () => {
        const next = spots[h.to];
        Promise.all(FACES.map((f) => decodeImage(faceSrc(h.to, f, size, view.current.night)))).finally(() => {
          setSpotId(h.to);
          const facing = h.to === 'square' ? next.start.yaw : v.yaw;
          [v.yaw, v.pitch, v.fov] = [facing, next.start.pitch, Math.max(FOV_MIN, fovBefore * 0.8)];
          v.kick();
          requestAnimationFrame(() => {
            setFading(false);
            glideTo(facing, next.start.pitch, fovBefore, 450);
          });
        });
      },
      view.current.reduced ? 120 : 380,
    );
  };

  const toggleTilt = async () => {
    if (tilt === 'on') return setTilt('off');
    setTilt((await requestTilt()) ? 'on' : 'denied');
    setHint(false);
  };

  return (
    <div ref={root} className={`pano absolute inset-0 overflow-hidden ${interactive ? 'pano-live' : ''} ${night ? 'is-night' : ''} ${nightReady === spotId ? 'night-ready' : ''} ${reduced ? 'reduced' : ''}`}>
      <div ref={stage} className="pano-stage absolute inset-0">
        <div ref={cube} className="pano-cube">
          {FACES.map((f) => {
            const style = { width: size, height: size, left: -size / 2, top: -size / 2, transform: `${FACE_TURN[f]} translateZ(${-size / 2}px) scale(1.004)` };
            return (
              <Fragment key={`${spotId}-${f}`}>
                {/* eslint-disable-next-line @next/next/no-img-element -- six fixed-size faces placed in 3D; next/image adds nothing here */}
                <img src={faceSrc(spotId, f, size)} alt="" aria-hidden draggable={false} decoding="async" className="pano-face" style={style} />
                {wantNight && (
                  // eslint-disable-next-line @next/next/no-img-element -- as above: the same face in moonlight, faded in over the day one
                  <img
                    src={faceSrc(spotId, f, size, true)}
                    alt=""
                    aria-hidden
                    draggable={false}
                    decoding="async"
                    className="pano-face pano-face-night"
                    style={style}
                    onLoad={() => {
                      nightLoads.current.add(`${spotId}-${f}`);
                      if (FACES.every((g) => nightLoads.current.has(`${spotId}-${g}`))) setNightReady(spotId);
                    }}
                  />
                )}
              </Fragment>
            );
          })}
          {current.glows.map((g, i) => (
            <span
              key={`${spotId}-glow-${i}`}
              aria-hidden
              className="pano-glow"
              style={{
                width: 2 * R * Math.tan((g.w * Math.PI) / 360),
                height: 2 * R * Math.tan((g.h * Math.PI) / 360),
                transform: `rotateY(${(-g.yaw).toFixed(2)}deg) rotateX(${(-g.pitch).toFixed(2)}deg) translateZ(${-(R + 12)}px) translate(-50%, -50%)`,
              }}
            />
          ))}
          {night &&
            FIREFLIES.map((q, i) => (
              <span
                key={`fly-${i}`}
                aria-hidden
                className="world-firefly"
                style={{ transform: `rotateY(${(-q.yaw).toFixed(2)}deg) rotateX(${(-q.pitch).toFixed(2)}deg) translateZ(${-(R + 6)}px)` }}
              >
                <i style={{ animationDelay: `${q.delay}s` }} />
              </span>
            ))}
          {current.hotspots.map((h, i) => {
            const place = `rotateY(${(-h.yaw).toFixed(2)}deg) rotateX(${(-h.pitch).toFixed(2)}deg) translateZ(${-R}px) translate(-50%, -50%) scale(var(--hs, 1))`;
            if (h.kind === 'place') {
              return (
                <button
                  key={`${spotId}-${i}`}
                  type="button"
                  className="pano-hot world-pin"
                  style={{ transform: place }}
                  aria-haspopup="dialog"
                  aria-label={h.id === 'inn' ? `${copy.inn}: ${copy.innLabel.toLowerCase()}` : LABEL[h.id]}
                  onFocus={() => glideTo(h.yaw, h.pitch, view.current.fov, 500)}
                  onClick={() => onPlace(h.id)}
                >
                  {LABEL[h.id]}
                </button>
              );
            }
            return (
              <button
                key={`${spotId}-${i}`}
                type="button"
                className="pano-go"
                style={{ transform: place }}
                aria-label={`${copy.goTo} ${spots[h.to].label.toLowerCase()}`}
                onFocus={() => glideTo(h.yaw, h.pitch + 12, view.current.fov, 500)}
                onClick={() => hop(h)}
              >
                <span aria-hidden className="pano-go-ring">
                  ↑
                </span>
                <span className="pano-go-label">{spots[h.to].label}</span>
              </button>
            );
          })}
        </div>
      </div>
      <div aria-hidden className={`pano-fade pointer-events-none absolute inset-0 ${fading ? 'on' : ''}`} />
      {current.standIn && (
        <p className="world-status pointer-events-none absolute left-3 top-16 sm:left-4">
          Stand-in panorama · {current.label}
        </p>
      )}
      {interactive && (
        <div className="absolute bottom-3 right-3 flex items-end gap-2 sm:bottom-4 sm:right-4">
          {canTilt && (
            <button type="button" className="world-btn" aria-pressed={tilt === 'on'} onClick={toggleTilt}>
              {tilt === 'on' ? 'Tilt: on' : tilt === 'denied' ? 'Tilt blocked' : 'Tilt to look'}
            </button>
          )}
          <div className="flex gap-2">
            <button type="button" className="world-btn" aria-label="Zoom in" onClick={() => glideTo(view.current.yaw, view.current.pitch, view.current.fov / 1.35, 250)}>
              +
            </button>
            <button type="button" className="world-btn" aria-label="Zoom out" onClick={() => glideTo(view.current.yaw, view.current.pitch, view.current.fov * 1.35, 250)}>
              −
            </button>
          </div>
        </div>
      )}
      {interactive && hint && (
        <p aria-hidden className="world-hint pointer-events-none absolute bottom-[4.25rem] left-3 sm:bottom-4 sm:left-1/2 sm:-translate-x-1/2">
          {coarse ? 'Drag to look · pinch to zoom · tap a sign' : 'Drag to look · scroll to zoom · click a sign'}
        </p>
      )}
    </div>
  );
}

const faceSrc = (spot: SpotId, face: string, size: number, night = false) => `/world/pano/${spot}/${face}-${size}${night ? '-night' : ''}.webp`;

/** Fireflies at night: fixed, seeded directions, mostly low over the paddies on the right. */
const FIREFLIES = (() => {
  let seed = 23;
  const r = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  return Array.from({ length: 26 }, (_, i) => ({
    yaw: i < 18 ? 12 + r() * 70 : -70 + r() * 60,
    pitch: -22 + r() * 16,
    delay: -r() * 6,
  }));
})();

function decodeImage(src: string) {
  const img = new Image();
  img.src = src;
  return img.decode().catch(() => undefined);
}
