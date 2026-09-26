'use client';

// The "3D photo" test at /world/depth: the land plate drawn as a mesh pushed toward you by a depth map
// (Depth Anything V2 Small, run locally: scripts/world-depth.py), so moving the mouse, dragging on a phone or tilting it
// shifts the view slightly and the near grass slides against the far hills. Plain WebGL, about 5 KB of code: no 3D
// library. The inn stays clickable: its outline is projected through the same camera every frame.
import { useEffect, useRef, useState } from 'react';
import { worldCopy as copy } from '@/content/world';
import { plateScene } from '@/content/world-scene';
import { requestTilt, tiltAvailable } from '../tilt';

const TEXTURE = (w: number) => `/world/plates/land-day-${w}.webp`;
const DEPTH = '/world/depth/land-day-depth.png';
const ASPECT = 16 / 9;
/** How far the nearest thing sits in front of the far hills, in plate heights. */
const RELIEF = 0.42;
/** How far the camera moves at full mouse/tilt deflection, in plate heights. */
const SWING = { x: 0.22, y: 0.1 };
const CAMERA = 3.2;

type Props = { interactive: boolean; reduced: boolean; onOpen: () => void };

export default function DepthPhoto({ interactive, reduced, onOpen }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const hot = useRef<HTMLButtonElement>(null);
  const pin = useRef<HTMLSpanElement>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'nogl'>('loading');
  const [hint, setHint] = useState(true);
  const [tilt, setTilt] = useState<'off' | 'on' | 'denied'>('off');
  const [canTilt] = useState(() => tiltAvailable());
  const [coarse] = useState(() => typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches);
  const aim = useRef({ tx: 0, ty: 0, x: 0, y: 0, kick: () => {}, tiltBase: null as null | [number, number] });

  useEffect(() => {
    const el = root.current;
    const cv = canvas.current;
    if (!el || !cv) return;
    const gl = cv.getContext('webgl', { alpha: true, antialias: true, premultipliedAlpha: true });
    if (!gl) {
      setStatus('nogl');
      return;
    }
    let disposed = false;
    let raf = 0;
    const cleanup: (() => void)[] = [];
    const a = aim.current;
    const grid = coarse ? [150, 84] : [240, 135];

    Promise.all([loadImage(TEXTURE(coarse ? 1600 : 2560)), loadImage(DEPTH)]).then(([tex, dep]) => {
      if (disposed) return;
      // Depth values from the map (0 far … 1 near).
      const dc = document.createElement('canvas');
      dc.width = dep.naturalWidth;
      dc.height = dep.naturalHeight;
      const dctx = dc.getContext('2d')!;
      dctx.drawImage(dep, 0, 0);
      const dpx = dctx.getImageData(0, 0, dc.width, dc.height).data;
      const depthAt = (u: number, v: number) => {
        const x = Math.min(dc.width - 1, Math.max(0, Math.round(u * (dc.width - 1))));
        const y = Math.min(dc.height - 1, Math.max(0, Math.round(v * (dc.height - 1))));
        return dpx[(y * dc.width + x) * 4] / 255;
      };
      const toWorld = (u: number, v: number): [number, number, number] => [(u - 0.5) * 2 * ASPECT, (0.5 - v) * 2, depthAt(u, v) * RELIEF * 2];

      // The mesh: a grid over the plate, each vertex pushed toward the camera by its depth.
      const [gx, gy] = grid;
      const pos = new Float32Array((gx + 1) * (gy + 1) * 5);
      let o = 0;
      for (let j = 0; j <= gy; j++) {
        for (let i = 0; i <= gx; i++) {
          const u = i / gx;
          const v = j / gy;
          const [x, y, z] = toWorld(u, v);
          pos.set([x, y, z, u, v], o);
          o += 5;
        }
      }
      const idx = new Uint32Array(gx * gy * 6);
      o = 0;
      for (let j = 0; j < gy; j++) {
        for (let i = 0; i < gx; i++) {
          const k = j * (gx + 1) + i;
          idx.set([k, k + 1, k + gx + 1, k + 1, k + gx + 2, k + gx + 1], o);
          o += 6;
        }
      }
      gl.getExtension('OES_element_index_uint');
      const prog = program(
        gl,
        `attribute vec3 p; attribute vec2 t; uniform mat4 m; varying vec2 vt;
         void main() { vt = t; gl_Position = m * vec4(p, 1.0); }`,
        `precision mediump float; uniform sampler2D s; varying vec2 vt;
         void main() { gl_FragColor = texture2D(s, vt); }`,
      );
      const vb = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, vb);
      gl.bufferData(gl.ARRAY_BUFFER, pos, gl.STATIC_DRAW);
      const ib = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, idx, gl.STATIC_DRAW);
      gl.useProgram(prog);
      const aP = gl.getAttribLocation(prog, 'p');
      const aT = gl.getAttribLocation(prog, 't');
      gl.enableVertexAttribArray(aP);
      gl.enableVertexAttribArray(aT);
      gl.vertexAttribPointer(aP, 3, gl.FLOAT, false, 20, 0);
      gl.vertexAttribPointer(aT, 2, gl.FLOAT, false, 20, 12);
      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.enable(gl.DEPTH_TEST);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      const uM = gl.getUniformLocation(prog, 'm');

      // The inn's outline and label in plate space, at the inn's depth.
      const { polygon, label } = plateScene.inn;
      const innDepth = depthAt(0.5, 0.5) * RELIEF * 2;
      const innPoly = polygon.map(([u, v]) => [(u - 0.5) * 2 * ASPECT, (0.5 - v) * 2, innDepth] as [number, number, number]);
      const labelPt: [number, number, number] = [(label[0] - 0.5) * 2 * ASPECT, (0.5 - label[1]) * 2, innDepth];

      const draw = () => {
        const w = el.clientWidth;
        const h = el.clientHeight;
        const dpr = Math.min(2, window.devicePixelRatio || 1);
        if (cv.width !== Math.round(w * dpr) || cv.height !== Math.round(h * dpr)) {
          cv.width = Math.round(w * dpr);
          cv.height = Math.round(h * dpr);
        }
        gl.viewport(0, 0, cv.width, cv.height);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        // Cover the view with the plate (like object-fit: cover), with a margin so the edges never show as it moves.
        const aspect = w / h;
        const halfH = (aspect < ASPECT ? 1 : ASPECT / aspect) * 0.9;
        const fov = 2 * Math.atan(halfH / CAMERA);
        const eye: [number, number, number] = [a.x * SWING.x * 2, a.y * SWING.y * 2, CAMERA];
        // Look at a point in the middle distance, so it stays put and the near and far parts swing against it.
        const target: [number, number, number] = [0, 0, RELIEF * 0.55];
        const m = mul(perspective(fov, aspect, 0.1, 20), lookAt(eye, target));
        gl.uniformMatrix4fv(uM, false, m);
        gl.drawElements(gl.TRIANGLES, idx.length, gl.UNSIGNED_INT, 0);
        // Project the inn outline and label into CSS pixels.
        const project = ([x, y, z]: [number, number, number]) => {
          const cx = m[0] * x + m[4] * y + m[8] * z + m[12];
          const cy = m[1] * x + m[5] * y + m[9] * z + m[13];
          const cw = m[3] * x + m[7] * y + m[11] * z + m[15];
          return [((cx / cw) * 0.5 + 0.5) * w, (0.5 - (cy / cw) * 0.5) * h];
        };
        if (hot.current) hot.current.style.clipPath = `polygon(${innPoly.map((p) => project(p).map((n) => `${n.toFixed(1)}px`).join(' ')).join(', ')})`;
        if (pin.current) {
          const [px, py] = project(labelPt);
          pin.current.style.transform = `translate(${px.toFixed(1)}px, ${py.toFixed(1)}px) translate(-50%, -100%)`;
        }
      };
      const tick = () => {
        a.x += (a.tx - a.x) * 0.08;
        a.y += (a.ty - a.y) * 0.08;
        draw();
        raf = Math.abs(a.tx - a.x) + Math.abs(a.ty - a.y) > 0.0005 ? requestAnimationFrame(tick) : 0;
      };
      a.kick = () => {
        if (!raf) raf = requestAnimationFrame(tick);
      };
      draw();
      setStatus('ready');
      const ro = new ResizeObserver(() => draw());
      ro.observe(el);
      cleanup.push(() => ro.disconnect());
    });

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      cleanup.forEach((f) => f());
    };
  }, [coarse]);

  // Mouse (desktop) or a finger dragging (phones) moves the view; so does tilt once it's on. Off for reduced motion.
  useEffect(() => {
    const el = root.current;
    const a = aim.current;
    if (!el || !interactive || reduced) return;
    const toAim = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      a.tx = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1));
      a.ty = Math.max(-1, Math.min(1, 1 - ((e.clientY - r.top) / r.height) * 2));
      setHint(false);
      a.kick();
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' || e.buttons) toAim(e);
    };
    const onLeave = () => {
      a.tx = a.ty = 0;
      a.kick();
    };
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerdown', toAim);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerdown', toAim);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, [interactive, reduced]);

  useEffect(() => {
    const a = aim.current;
    if (tilt !== 'on') return;
    a.tiltBase = null;
    const onOrient = (e: DeviceOrientationEvent) => {
      if (e.beta === null || e.gamma === null) return;
      if (!a.tiltBase) a.tiltBase = [e.beta, e.gamma];
      a.tx = Math.max(-1, Math.min(1, (e.gamma - a.tiltBase[1]) / 18));
      a.ty = Math.max(-1, Math.min(1, -(e.beta - a.tiltBase[0]) / 18));
      a.kick();
    };
    window.addEventListener('deviceorientation', onOrient);
    return () => window.removeEventListener('deviceorientation', onOrient);
  }, [tilt]);

  const toggleTilt = async () => {
    if (tilt === 'on') return setTilt('off');
    setTilt((await requestTilt()) ? 'on' : 'denied');
    setHint(false);
  };

  return (
    <div ref={root} className="depth-photo absolute inset-0 overflow-hidden">
      <div aria-hidden className="plate-sky-fallback absolute inset-0" />
      <canvas ref={canvas} aria-hidden className="absolute inset-0 h-full w-full" />
      {status === 'nogl' && <p className="world-status absolute left-3 top-16">This test needs WebGL, which this browser has turned off.</p>}
      {/* Rendered from the start (hidden until the mesh is up) so the first frame can place them. */}
      <button
        ref={hot}
        type="button"
        className={`plate-hotspot absolute inset-0 cursor-pointer ${status === 'ready' ? '' : 'invisible'}`}
        aria-haspopup="dialog"
        aria-label={`${copy.inn}: ${copy.innLabel.toLowerCase()}`}
        onClick={onOpen}
      />
      <span ref={pin} aria-hidden className={`world-pin pointer-events-none absolute left-0 top-0 ${status === 'ready' ? '' : 'invisible'}`}>
        {copy.innLabel}
      </span>
      <p className="world-status pointer-events-none absolute left-3 top-16 sm:left-4">3D photo test · depth map from Depth Anything V2</p>
      {interactive && canTilt && !reduced && (
        <button type="button" className="world-btn absolute bottom-3 right-3" aria-pressed={tilt === 'on'} onClick={toggleTilt}>
          {tilt === 'on' ? 'Tilt: on' : tilt === 'denied' ? 'Tilt blocked' : 'Tilt to look'}
        </button>
      )}
      {interactive && hint && !reduced && (
        <p aria-hidden className="world-hint pointer-events-none absolute bottom-16 left-1/2 -translate-x-1/2 sm:bottom-4">
          {coarse ? 'Drag or tilt to look · tap the inn' : 'Move the mouse to look · click the inn'}
        </p>
      )}
    </div>
  );
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function program(gl: WebGLRenderingContext, vs: string, fs: string) {
  const make = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  };
  const p = gl.createProgram()!;
  gl.attachShader(p, make(gl.VERTEX_SHADER, vs));
  gl.attachShader(p, make(gl.FRAGMENT_SHADER, fs));
  gl.linkProgram(p);
  return p;
}

/** Column-major 4×4 matrices, as WebGL wants them. */
function perspective(fovy: number, aspect: number, near: number, far: number) {
  const f = 1 / Math.tan(fovy / 2);
  const nf = 1 / (near - far);
  return new Float32Array([f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) * nf, -1, 0, 0, 2 * far * near * nf, 0]);
}
function lookAt(eye: [number, number, number], at: [number, number, number]) {
  const norm = (v: number[]) => {
    const l = Math.hypot(...v) || 1;
    return v.map((x) => x / l);
  };
  const cross = (a: number[], b: number[]) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const z = norm([eye[0] - at[0], eye[1] - at[1], eye[2] - at[2]]);
  const x = norm(cross([0, 1, 0], z));
  const y = cross(z, x);
  const dot = (a: number[], b: number[]) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  return new Float32Array([x[0], y[0], z[0], 0, x[1], y[1], z[1], 0, x[2], y[2], z[2], 0, -dot(x, eye), -dot(y, eye), -dot(z, eye), 1]);
}
function mul(a: Float32Array, b: Float32Array) {
  const out = new Float32Array(16);
  for (let c = 0; c < 4; c++) for (let r = 0; r < 4; r++) out[c * 4 + r] = a[r] * b[c * 4] + a[4 + r] * b[c * 4 + 1] + a[8 + r] * b[c * 4 + 2] + a[12 + r] * b[c * 4 + 3];
  return out;
}
