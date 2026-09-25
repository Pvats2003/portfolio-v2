'use client';

// The 3D scene. Loaded lazily by WorldView, only after the device checks pass (WORLD.md §5).
import { CameraControls, CameraControlsImpl, PerformanceMonitor } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState, type MutableRefObject } from 'react';
import * as THREE from 'three';
import type { Place } from '@/content/world';
import { Batch, Kit, KitProvider, useKit } from './kit';
import { palettes, type Mood } from './palette';
import { Clouds, Gulmohar, House, Palm, Rails, Sea, Sky, Tile } from './props';
import { Depot } from './Depot';
import { Ball } from './kit';

export type SceneProps = {
  mood: Mood;
  /** "world": the explorable town. "hero": a fixed, low dusk view of the town for the homepage. */
  mode: 'world' | 'hero';
  places: Place[];
  overview: Place['view'];
  activeId: string | null;
  onOpen: (id: string) => void;
  onClose: () => void;
  reducedMotion: boolean;
  /** Poster rendering: freeze motion and hide pins. */
  shot?: boolean;
  /** Keep going even if the frame rate is low (test override). */
  force?: boolean;
  onReady: () => void;
  onFail: (reason: string) => void;
  controlsRef?: MutableRefObject<CameraControlsImpl | null>;
  /** DOM pins (owned by WorldView) that follow their places on screen. */
  pinRefs?: MutableRefObject<Map<string, HTMLElement>>;
  className?: string;
};

const { ACTION } = CameraControlsImpl;

export default function Scene(props: SceneProps) {
  const { mood, mode, force, onFail, className } = props;
  const kit = useMemo(() => {
    const k = new Kit();
    k.setMood(mood);
    return k;
    // One kit per canvas; mood changes are applied in place.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => () => kit.dispose(), [kit]);
  const [dpr, setDpr] = useState(1.5);
  const phone = typeof window !== 'undefined' && window.matchMedia('(max-width: 640px)').matches;
  const maxDpr = phone ? 1.5 : 1.75;
  const heroCam = { position: [0, 6, 90] as [number, number, number], fov: 30, near: 1, far: 1200 };
  return (
    <Canvas
      className={className}
      flat
      shadows={phone ? false : 'percentage'}
      dpr={[1, Math.min(dpr, maxDpr)]}
      frameloop="demand"
      camera={mode === 'hero' ? heroCam : { position: props.overview.position, fov: 30, near: 1, far: 1200 }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.domElement.setAttribute('aria-hidden', 'true');
        gl.domElement.addEventListener('webglcontextlost', (e) => {
          e.preventDefault();
          onFail('context-lost');
        });
      }}
      onPointerMissed={() => props.onClose()}
    >
      <KitProvider kit={kit}>
        <PerformanceMonitor
          bounds={() => [15, 24]}
          flipflops={3}
          onDecline={() => setDpr(1)}
          onFallback={() => {
            if (!force) onFail('slow');
          }}
        />
        <World {...props} />
      </KitProvider>
    </Canvas>
  );
}

function World(props: SceneProps) {
  const { mood, mode, reducedMotion, shot } = props;
  const kit = useKit();
  const invalidate = useThree((s) => s.invalidate);
  const animate = !reducedMotion && !shot;
  useLayoutEffect(() => {
    kit.setMood(mood);
    invalidate();
  }, [kit, mood, invalidate]);
  const p = palettes[mood];
  return (
    <>
      <OutlineResolution />
      <color attach="background" args={[p.sky.horizon]} />
      <fog attach="fog" args={[p.fog, mode === 'hero' ? 60 : 90, mode === 'hero' ? 260 : 320]} />
      <ambientLight color={p.ambient.color} intensity={p.ambient.intensity} />
      <KeyLight mood={mood} />
      <Sky mood={mood} />
      <Clouds mood={mood} animate={animate} />
      {mode === 'hero' && <HorizonSea mood={mood} />}
      <Suspense fallback={null}>
        <Tile />
        <Sea mood={mood} animate={animate} />
        <Town />
        <Depot mood={mood} animate={animate} onOpen={() => props.onOpen('depot')} onHover={setCursor} />
        <Ready onReady={props.onReady} />
      </Suspense>
      {mode === 'world' && <Rig {...props} />}
      {mode === 'hero' && <HeroCamera />}
      {mode === 'world' && !shot && props.pinRefs && <PinProjector places={props.places} pinRefs={props.pinRefs} />}
      {animate && <Ambient />}
    </>
  );
}

function setCursor(on: boolean) {
  document.body.style.cursor = on ? 'pointer' : '';
}

function KeyLight({ mood }: { mood: Mood }) {
  const light = useRef<THREE.DirectionalLight>(null);
  const k = palettes[mood].key;
  useLayoutEffect(() => {
    const l = light.current;
    if (!l) return;
    const c = l.shadow.camera;
    c.left = -36;
    c.right = 36;
    c.top = 26;
    c.bottom = -26;
    c.near = 1;
    c.far = 120;
    c.updateProjectionMatrix();
    l.shadow.mapSize.set(2048, 2048);
    l.shadow.bias = -0.0008;
    l.shadow.normalBias = 0.04;
  }, []);
  return <directionalLight ref={light} color={k.color} intensity={k.intensity} position={k.position} castShadow />;
}

/** Keeps outlines a constant width in pixels whatever the canvas size or pixel ratio. */
function OutlineResolution() {
  const kit = useKit();
  const size = useThree((s) => s.size);
  const dpr = useThree((s) => s.viewport.dpr);
  useLayoutEffect(() => {
    kit.setOutlineSize(size.width, size.height, dpr);
  }, [kit, size, dpr]);
  return null;
}

/** Filler buildings and trees around the depot, all merged into a few draw calls. */
function Town() {
  return (
    <Batch>
      <Rails />
      <House p={[-20, 0, -6]} turn={0.1} />
      <House p={[-14.5, 0, -8.2]} w={3} walls="laterite" turn={-0.15} />
      <House p={[18.5, 0, -7]} w={4.2} />
      <House p={[24, 0, -1.8]} walls="laterite" turn={-0.3} />
      <House p={[-22.5, 0, 0.5]} walls="laterite" turn={0.2} w={3.2} />
      <House p={[17, 0, 1]} w={3} d={2.6} h={2} />
      <House p={[-19, 0, 8]} w={3.2} d={2.6} />
      <Palm p={[-25.5, 0, 9.6]} lean={0.28} turn={2.4} />
      <Palm p={[-12, 0, 9.9]} lean={0.22} turn={3.6} h={4.6} />
      <Palm p={[4, 0, 9.7]} lean={0.3} turn={4.4} h={3.8} />
      <Palm p={[14.5, 0, 9.5]} lean={0.24} turn={3.2} />
      <Palm p={[26, 0, 9.8]} lean={0.26} turn={4.0} h={4.4} />
      <Gulmohar p={[-16, 0, -2]} />
      <Gulmohar p={[13, 0, -10]} s={0.9} />
      <Gulmohar p={[-4, 0, -9.2]} s={1.1} />
      <Gulmohar p={[21, 0, 5.8]} s={0.8} />
      {/* hills beyond the railway */}
      <Ball role="grassDark" p={[-19, -0.8, -18.2]} s={[16, 5, 5]} />
      <Ball role="grassDark" p={[6, -1, -18.6]} s={[20, 6.4, 4.6]} />
      <Ball role="grassDark" p={[23, -0.8, -17.8]} s={[12, 4.4, 5]} />
    </Batch>
  );
}

/** Hero: a fixed, low view from over the sea, looking a little above the town so it sits along the bottom. */
function HeroCamera() {
  const camera = useThree((s) => s.camera);
  const invalidate = useThree((s) => s.invalidate);
  useLayoutEffect(() => {
    // Puts the town's base about 90% of the way down the frame: a skyline on the horizon.
    camera.lookAt(0, 19.3, 0);
    invalidate();
  }, [camera, invalidate]);
  return null;
}

/** Hero only: the sea runs out to the horizon, so the town sits on a coast rather than floating. */
function HorizonSea({ mood }: { mood: Mood }) {
  const kit = useKit();
  const m = useMemo(() => new THREE.MeshToonMaterial({ gradientMap: kit.gradient }), [kit]);
  useLayoutEffect(() => {
    m.color.set(palettes[mood].seaDeep);
  }, [m, mood]);
  return (
    <mesh material={m} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.34, 0]}>
      <planeGeometry args={[2400, 2400]} />
    </mesh>
  );
}

/**
 * Frames a view for the canvas shape: wide screens use it as authored; narrower ones pull back, and for
 * place views on phones also drop the target so the place sits above the dialogue box.
 */
function fit(v: Place['view'], aspect: number, kind: 'overview' | 'place'): Place['view'] {
  const k = kind === 'overview' ? (aspect < 1 ? 0.95 : aspect < 1.4 ? 1.15 : 1) : Math.max(1, 1.2 / aspect);
  const [tx, ty, tz] = v.target;
  const offset = new THREE.Vector3(v.position[0] - tx, v.position[1] - ty, v.position[2] - tz);
  const sph = new THREE.Spherical().setFromVector3(offset);
  sph.radius *= k;
  // On tall screens look down more steeply, so the town fills the frame instead of the sky.
  if (kind === 'overview' && aspect < 1) sph.phi = 0.75;
  offset.setFromSpherical(sph);
  const lift = kind === 'place' && aspect < 1 ? 2.2 * k : 0;
  return { position: [tx + offset.x, ty + offset.y, tz + offset.z], target: [tx, ty - lift, tz] };
}

function Rig({ places, overview, activeId, reducedMotion, controlsRef }: SceneProps) {
  const ref = useRef<CameraControlsImpl>(null);
  const first = useRef(true);
  const size = useThree((s) => s.size);
  const aspect = size.width / Math.max(1, size.height);
  const shape = aspect < 1 ? 'tall' : aspect < 1.4 ? 'square' : 'wide';
  useEffect(() => {
    if (controlsRef) controlsRef.current = ref.current;
  }, [controlsRef]);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const place = places.find((x) => x.id === activeId);
    const v = place ? fit(place.view, aspect, 'place') : fit(overview, aspect, 'overview');
    const smooth = !first.current && !reducedMotion;
    first.current = false;
    void c.setLookAt(...v.position, ...v.target, smooth);
    // Re-frame only when the place or the screen shape changes, not on every resize.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId, places, overview, reducedMotion, shape]);
  const az = Math.atan2(overview.position[0] - overview.target[0], overview.position[2] - overview.target[2]);
  return (
    <CameraControls
      ref={ref}
      makeDefault
      minDistance={10}
      maxDistance={110}
      minPolarAngle={0.52}
      maxPolarAngle={1.2}
      minAzimuthAngle={az - 1.05}
      maxAzimuthAngle={az + 1.05}
      truckSpeed={0}
      smoothTime={reducedMotion ? 0 : 0.45}
      draggingSmoothTime={0.1}
      mouseButtons={{ left: ACTION.ROTATE, middle: ACTION.DOLLY, right: ACTION.NONE, wheel: ACTION.DOLLY }}
      touches={{ one: ACTION.TOUCH_ROTATE, two: ACTION.TOUCH_DOLLY, three: ACTION.NONE }}
    />
  );
}

/** Moves each DOM pin to its place's position on screen whenever a frame is drawn. */
function PinProjector({ places, pinRefs }: { places: Place[]; pinRefs: MutableRefObject<Map<string, HTMLElement>> }) {
  const v = useMemo(() => new THREE.Vector3(), []);
  useFrame(({ camera, size }) => {
    for (const pl of places) {
      const el = pinRefs.current.get(pl.id);
      if (!el) continue;
      v.set(...pl.pin).project(camera);
      const behind = v.z > 1;
      el.style.visibility = behind ? 'hidden' : 'visible';
      el.style.transform = `translate3d(${((v.x + 1) / 2) * size.width}px, ${((1 - v.y) / 2) * size.height}px, 0) translate(-50%, -100%)`;
    }
  });
  return null;
}

/** Ambient motion at 30 fps (20 fps after 20 s without input); nothing while hidden or off-screen. */
function Ambient() {
  const invalidate = useThree((s) => s.invalidate);
  const el = useThree((s) => s.gl.domElement);
  useEffect(() => {
    let visible = true;
    let last = 0;
    let lastInput = performance.now();
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
    });
    io.observe(el);
    const onInput = () => {
      lastInput = performance.now();
    };
    el.addEventListener('pointermove', onInput);
    window.addEventListener('keydown', onInput);
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible || document.hidden) return;
      const fps = now - lastInput > 20000 ? 20 : 30;
      if (now - last >= 1000 / fps - 2) {
        last = now;
        invalidate();
      }
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      el.removeEventListener('pointermove', onInput);
      window.removeEventListener('keydown', onInput);
    };
  }, [el, invalidate]);
  return null;
}

/** Fires once everything inside the Suspense boundary has loaded: compile shaders, draw, then report ready. */
function Ready({ onReady }: { onReady: () => void }) {
  const { gl, scene, camera, invalidate } = useThree();
  useEffect(() => {
    gl.compile(scene, camera);
    invalidate();
    let r2 = 0;
    const r1 = requestAnimationFrame(() => {
      r2 = requestAnimationFrame(() => onReady());
    });
    return () => {
      cancelAnimationFrame(r1);
      cancelAnimationFrame(r2);
    };
  }, [gl, scene, camera, invalidate, onReady]);
  return null;
}
