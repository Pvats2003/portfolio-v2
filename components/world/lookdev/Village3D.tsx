'use client';

// Look-development frames A and C (WORLD.md, look-dev round): the village with the inn at golden hour.
//   A: pushed 3D — two-band cel shading with a thin mid, hard shadows, rim light, thick ink, bloom, big
//      toon-shaded cumulus, drifting cherry petals, saturated grade, a low path-level camera.
//   C: the same 3D village in front of style B's painted sky, clouds, mountains and forest (planes in depth).
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { Ball, Batch, Box, Cone, Cyl, Gable, Hip, Kit, KitProvider, Taper, useKit, type KitStyle } from '../kit';
import { palettes, type Mood } from '../palette';
import { Sky } from '../props';
import { paintedLayers, type PaintMood } from './painted';

const ANIME: KitStyle = { bands: 'anime', line: 3.2, rim: true };
const EYE = new THREE.Vector3(1.5, 1.7, 14);
const LOOK = new THREE.Vector3(-0.8, 4.6, -12);

export type Lookdev3DProps = {
  night: boolean;
  backdrop: 'sky' | 'painted';
  still?: boolean;
  /** Test switch: render without bloom/grade to compare. */
  noPost?: boolean;
  onOpen: () => void;
  onStats?: (s: { calls: number; triangles: number }) => void;
};

export default function Lookdev3D({ night, backdrop, still, noPost, onOpen, onStats }: Lookdev3DProps) {
  const mood: Mood = night ? 'aNight' : 'aDay';
  const kit = useMemo(() => new Kit(ANIME), []);
  useEffect(() => () => kit.dispose(), [kit]);
  return (
    <Canvas
      flat
      shadows="percentage"
      dpr={[1, 1.75]}
      frameloop="always"
      camera={{ position: EYE.toArray(), fov: 45, near: 0.3, far: 1400 }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      onCreated={({ gl, camera }) => {
        gl.domElement.setAttribute('aria-hidden', 'true');
        camera.lookAt(LOOK);
      }}
    >
      <KitProvider kit={kit}>
        <Frame mood={mood} backdrop={backdrop} still={!!still} noPost={!!noPost} onOpen={onOpen} onStats={onStats} />
      </KitProvider>
    </Canvas>
  );
}

function Frame({ mood, backdrop, still, noPost, onOpen, onStats }: { mood: Mood; backdrop: 'sky' | 'painted'; still: boolean; noPost: boolean; onOpen: () => void; onStats?: Lookdev3DProps['onStats'] }) {
  const kit = useKit();
  useLayoutEffect(() => kit.setMood(mood), [kit, mood]);
  const p = palettes[mood];
  return (
    <>
      <OutlineSize />
      <color attach="background" args={[p.sky.horizon]} />
      <fog attach="fog" args={[p.fog, 110, 420]} />
      <ambientLight color={p.ambient.color} intensity={p.ambient.intensity} />
      <Key mood={mood} />
      {backdrop === 'sky' ? (
        <>
          <Sky mood={mood} />
          <Cumulus mood={mood} still={still} />
        </>
      ) : (
        <PaintedBackdrop night={mood === 'aNight'} still={still} />
      )}
      <Suspense fallback={null}>
        <Village painted={backdrop === 'painted'} />
        <Inn onOpen={onOpen} />
      </Suspense>
      <Wires night={mood === 'aNight'} />
      <Petals night={mood === 'aNight'} still={still} />
      <Sway still={still} />
      {!noPost && <Post night={mood === 'aNight'} />}
      {onStats && <Stats onStats={onStats} />}
    </>
  );
}

function OutlineSize() {
  const kit = useKit();
  const size = useThree((s) => s.size);
  const dpr = useThree((s) => s.viewport.dpr);
  useLayoutEffect(() => kit.setOutlineSize(size.width, size.height, dpr), [kit, size, dpr]);
  return null;
}

/** Low golden sun from the west (day) or a high blue moon (night); crisp shadows over a tight area; drives the rim. */
function Key({ mood }: { mood: Mood }) {
  const kit = useKit();
  const light = useRef<THREE.DirectionalLight>(null);
  const k = palettes[mood].key;
  const dir = useMemo(() => new THREE.Vector3(), []);
  useLayoutEffect(() => {
    const l = light.current!;
    const c = l.shadow.camera;
    Object.assign(c, { left: -24, right: 24, top: 20, bottom: -20, near: 1, far: 120 });
    c.updateProjectionMatrix();
    l.shadow.mapSize.set(2048, 2048);
    l.shadow.bias = -0.0006;
    l.shadow.normalBias = 0.03;
    l.shadow.radius = 1;
  }, []);
  useFrame(({ camera }) => {
    dir.set(...k.position).normalize();
    kit.rim.uRimDir.value.copy(dir).transformDirection(camera.matrixWorldInverse);
  });
  return <directionalLight ref={light} color={k.color} intensity={k.intensity} position={k.position} castShadow />;
}

/** The village around the inn: stream and bridge, stepping stones, a neighbour's house with laundry and a bicycle,
 *  terraced rice paddies, utility poles and wires, a cherry tree, forest and mountains (A only; C paints those). */
function Village({ painted }: { painted: boolean }) {
  const stones = useMemo(() => {
    const r = rng(17);
    return Array.from({ length: 70 }, (_, i) => [-34 + (i % 35) * 2 + r() * 0.8, i < 35 ? 2.75 : 5.3, 0.35 + r() * 0.3] as const);
  }, []);
  const shoots = useMemo(() => {
    const out: [number, number][] = [];
    for (const z of [-2.4, 0.2, 2.8]) for (let i = 0; i < 18; i++) for (let k = 0; k < 4; k++) out.push([7.6 + i * 0.9, z - 0.7 + k * 0.45]);
    return out;
  }, []);
  const bridge = Array.from({ length: 9 }, (_, i) => {
    const t = -1 + i / 4;
    return { x: t * 1.9, y: 0.12 + 0.62 * (1 - t * t), rz: Math.atan((-2 * 0.62 * t) / 1.9) };
  });
  return (
    <Batch>
      <Box role="grass" p={[0, -0.1, -30]} s={[220, 0.2, 150]} outline={false} />
      {/* stream, banks, bridge, stepping stones, path */}
      <Box role="water" p={[0, 0.02, 4]} s={[220, 0.04, 2.5]} outline={false} shadow={false} />
      {stones.map(([x, z, r], i) => (
        <Ball key={i} role="stone" p={[x, 0.08, z]} s={[r * 1.6, r * 0.5, r * 1.1]} outline={false} />
      ))}
      {bridge.map((b, i) => (
        <group key={i}>
          <Box role="stone" p={[b.x, b.y, 4]} s={[0.5, 0.24, 1.7]} r={[0, 0, b.rz]} />
          <Box role="stone" p={[b.x, b.y + 0.28, 3.2]} s={[0.5, 0.34, 0.14]} r={[0, 0, b.rz]} />
          <Box role="stone" p={[b.x, b.y + 0.28, 4.8]} s={[0.5, 0.34, 0.14]} r={[0, 0, b.rz]} />
        </group>
      ))}
      {[
        [0.1, 6.5, 0.9],
        [-0.2, 7.7, 1.0],
        [0.25, 9.0, 1.15],
        [-0.1, 10.5, 1.3],
      ].map(([x, z, s]) => (
        <Cyl key={z} role="stone" p={[x, 0.05, z]} s={[s, 0.12, s * 0.66]} />
      ))}
      <Box role="path" p={[0, 0.03, -0.9]} s={[1.6, 0.06, 4.4]} outline={false} shadow={false} />
      {/* neighbour's house */}
      <group position={[-9.5, 0, -4.5]} rotation={[0, 0.35, 0]}>
        <Box role="stone" p={[0, 0.15, 0]} s={[6, 0.3, 4.6]} />
        <Box role="wood" p={[0, 1.5, 0]} s={[5.5, 2.4, 4]} />
        <Box role="plaster" p={[-1.3, 1.75, 2.01]} s={[1.8, 1.1, 0.04]} outline={false} />
        <Box role="plaster" p={[1.3, 1.75, 2.01]} s={[1.8, 1.1, 0.04]} outline={false} />
        <Gable role="kawara" variant="tiles" p={[0, 2.7, 0]} s={[6.4, 1.5, 5]} />
        <Box role="kawaraLine" p={[0, 4.22, 0]} s={[6.5, 0.2, 0.3]} />
        {/* laundry */}
        <Box role="woodDark" p={[3.4, 1.3, 2.6]} s={[0.08, 2.6, 0.08]} />
        <Box role="woodDark" p={[4.6, 2.4, 2.6]} s={[2.4, 0.05, 0.05]} />
        <Box role="plaster" p={[3.9, 2.0, 2.6]} s={[0.5, 0.7, 0.03]} outline={false} />
        <Box role="noren" p={[4.5, 2.05, 2.6]} s={[0.45, 0.6, 0.03]} outline={false} />
        <Box role="blossom" p={[5.1, 1.95, 2.6]} s={[0.55, 0.8, 0.03]} outline={false} />
        {/* bicycle */}
        <Cyl role="woodDark" p={[-1.6, 0.42, 2.35]} s={[0.8, 0.05, 0.8]} r={[Math.PI / 2, 0, 0]} outline={false} />
        <Cyl role="woodDark" p={[-0.5, 0.42, 2.35]} s={[0.8, 0.05, 0.8]} r={[Math.PI / 2, 0, 0]} outline={false} />
        <Box role="shirtA" p={[-1.05, 0.62, 2.35]} s={[1.1, 0.06, 0.06]} r={[0, 0, 0.1]} outline={false} />
      </group>
      {/* a second house further back */}
      <group position={[10.5, 0, -14]} rotation={[0, -0.4, 0]}>
        <Box role="wood" p={[0, 1.3, 0]} s={[5, 2.2, 3.6]} />
        <Gable role="kawara" variant="tiles" p={[0, 2.4, 0]} s={[5.8, 1.3, 4.6]} />
      </group>
      {/* terraced rice paddies */}
      {[-2.4, 0.2, 2.8].map((z, i) => (
        <group key={z}>
          <Box role="paddy" p={[15.5, 0.05 + i * 0.02, z]} s={[17, 0.06, 2.2]} outline={false} shadow={false} />
          <Box role="path" p={[15.5, 0.1, z + 1.2]} s={[17, 0.16, 0.24]} outline={false} />
        </group>
      ))}
      {shoots.map(([x, z], i) => (
        <Box key={i} role="grassDark" p={[x, 0.2, z]} s={[0.05, 0.3, 0.05]} outline={false} shadow={false} />
      ))}
      {/* utility poles */}
      {[
        [4.4, -2.6],
        [-15, -1],
      ].map(([x, z]) => (
        <group key={x} position={[x, 0, z]}>
          <Cyl role="woodDark" p={[0, 3.6, 0]} s={[0.22, 7.2, 0.22]} />
          <Box role="woodDark" p={[0, 6.8, 0]} s={[1.5, 0.12, 0.12]} />
          <Box role="woodDark" p={[0, 6.3, 0]} s={[1.1, 0.1, 0.1]} />
        </group>
      ))}
      {/* vending machine by the inn */}
      <Box role="vending" p={[5.6, 0.95, -4.6]} s={[0.9, 1.9, 0.7]} />
      <Box role="window" variant="glow" p={[5.6, 1.55, -4.24]} s={[0.7, 0.45, 0.02]} outline={false} />
      {/* cherry tree */}
      <group position={[-4.8, 0, 1.4]}>
        <Taper role="trunk" p={[0, 1.4, 0]} s={[0.55, 2.8, 0.55]} />
        <Cyl role="trunk" p={[0.6, 2.9, 0]} s={[0.22, 1.6, 0.22]} r={[0, 0, -0.7]} />
        <Cyl role="trunk" p={[-0.6, 3.0, 0.2]} s={[0.2, 1.5, 0.2]} r={[0.2, 0, 0.8]} />
        {[
          [0, 3.8, 0, 2.6],
          [1.3, 3.5, 0.3, 2.0],
          [-1.3, 3.6, -0.2, 2.1],
          [0.4, 4.6, -0.3, 1.9],
          [-0.6, 4.3, 0.8, 1.7],
          [1.0, 4.2, -0.9, 1.6],
        ].map(([x, y, z, s], i) => (
          <Ball key={i} role="blossom" p={[x, y, z]} s={[s, s * 0.7, s]} />
        ))}
      </group>
      {!painted && (
        <>
          {/* forest band and mountains (C uses the painted versions instead) */}
          {Array.from({ length: 26 }, (_, i) => (
            <Ball key={i} role="forest" p={[-65 + i * 5.2, 0.6, -34 - (i % 3) * 3]} s={[7, 5 + (i % 4), 6]} />
          ))}
          <Cone role="mtn" p={[-14, 36, -160]} s={[170, 72, 110]} />
          <Cone role="mtnFar" p={[72, 20, -190]} s={[170, 40, 90]} />
        </>
      )}
    </Batch>
  );
}

/** A plane with text in the site's mono font (the inn's PROJECTS sign). */
function CanvasSign({ text, position, width }: { text: string; position: [number, number, number]; width: number }) {
  const [tex, setTex] = useState<THREE.CanvasTexture | null>(null);
  useEffect(() => {
    let t: THREE.CanvasTexture | null = null;
    document.fonts.ready.then(() => {
      const c = document.createElement('canvas');
      c.width = 512;
      c.height = 96;
      const g = c.getContext('2d')!;
      g.fillStyle = '#3a2618';
      g.fillRect(0, 0, 512, 96);
      const family = getComputedStyle(document.body).getPropertyValue('--font-plex-mono').trim() || 'monospace';
      g.font = `500 44px ${family}`;
      g.fillStyle = '#f6eedc';
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      if ('letterSpacing' in g) (g as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = '8px';
      g.fillText(text, 256, 50);
      t = new THREE.CanvasTexture(c);
      t.colorSpace = THREE.SRGBColorSpace;
      setTex(t);
    });
    return () => t?.dispose();
  }, [text]);
  if (!tex) return null;
  return (
    <mesh position={position}>
      <planeGeometry args={[width, width * 0.1875]} />
      <meshBasicMaterial map={tex} color="#e6e6e6" toneMapped={false} />
    </mesh>
  );
}

/** The inn: two storeys, shoji, noren, paper lanterns, pent roof, hip roof with a gable. Click = projects. */
function Inn({ onOpen }: { onOpen: () => void }) {
  return (
    <group position={[0, 0, -7]}>
      <Batch>
        <Box role="stone" p={[0, 0.15, 0]} s={[9.4, 0.3, 6.4]} />
        <Box role="wood" p={[0, 1.55, 0]} s={[9, 2.5, 6]} />
        {[-3.4, -2.0, 2.0, 3.4].map((x) => (
          <Box key={x} role="window" variant="glow" p={[x, 1.5, 3.01]} s={[1.2, 1.8, 0.04]} outline={false} />
        ))}
        {[-4.5, -2.7, -1.3, 1.3, 2.7, 4.5].map((x) => (
          <Box key={x} role="woodDark" p={[x, 1.55, 3.03]} s={[0.16, 2.5, 0.1]} outline={false} />
        ))}
        <Box role="woodDark" p={[0, 1.4, 2.99]} s={[2.5, 2.2, 0.03]} outline={false} />
        <Box role="window" variant="glow" p={[0, 1.1, 3.0]} s={[2.1, 1.3, 0.02]} outline={false} />
        <Box role="noren" p={[0, 2.1, 3.07]} s={[2.3, 0.9, 0.03]} outline={false} />
        {[-1.55, 1.55].map((x) => (
          <group key={x}>
            <Ball role="lantern" variant="glow" p={[x, 2.25, 3.3]} s={[0.42, 0.56, 0.42]} />
            <Cyl role="woodDark" p={[x, 2.56, 3.3]} s={[0.26, 0.08, 0.26]} outline={false} />
            <Cyl role="woodDark" p={[x, 1.95, 3.3]} s={[0.26, 0.08, 0.26]} outline={false} />
          </group>
        ))}
        <Hip role="kawara" variant="tiles" p={[0, 3.15, 0]} s={[10.6, 0.7, 7.6]} />
        <Box role="plaster" p={[0, 3.9, -0.3]} s={[7.6, 1.9, 5]} />
        {[-3.8, -1.9, 0, 1.9, 3.8].map((x) => (
          <Box key={x} role="woodDark" p={[x, 3.85, 2.21]} s={[0.14, 1.9, 0.08]} outline={false} />
        ))}
        {[-2.85, 2.85].map((x) => (
          <Box key={x} role="window" variant="glow" p={[x, 3.95, 2.21]} s={[1.4, 0.9, 0.04]} outline={false} />
        ))}
        <Box role="woodDark" p={[0, 3.3, 2.38]} s={[7.8, 0.1, 0.1]} />
        <Hip role="kawara" variant="tiles" p={[0, 5.55, -0.3]} s={[9.8, 1.5, 7.2]} />
        <Gable role="kawara" variant="tiles" p={[0, 6.25, -0.3]} s={[4.6, 1.1, 3.2]} />
        <Box role="kawaraLine" p={[0, 7.38, -0.3]} s={[4.9, 0.26, 0.36]} />
        <Box role="woodDark" p={[3.2, 6.4, 0.6]} s={[0.35, 1.0, 0.35]} />
      </Batch>
      <CanvasSign text="PROJECTS" position={[0, 2.8, 3.12]} width={3} />
      <mesh
        position={[0, 3.5, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onOpen();
        }}
        onPointerOver={() => (document.body.style.cursor = 'pointer')}
        onPointerOut={() => (document.body.style.cursor = '')}
      >
        <boxGeometry args={[11, 7.5, 8]} />
        <meshBasicMaterial colorWrite={false} depthWrite={false} />
      </mesh>
    </group>
  );
}

/** Sagging power lines between the poles: a very ordinary, lived-in detail. */
function Wires({ night }: { night: boolean }) {
  const tubes = useMemo(() => {
    const spans: [THREE.Vector3, THREE.Vector3][] = [];
    for (const [dy, dx] of [
      [6.8, 0.7],
      [6.8, -0.7],
      [6.3, 0.5],
    ]) {
      spans.push([new THREE.Vector3(4.4 + dx, dy, -2.6), new THREE.Vector3(-15 + dx, dy, -1)]);
      spans.push([new THREE.Vector3(4.4 + dx, dy, -2.6), new THREE.Vector3(34, dy + 0.4, -6)]);
    }
    return spans.map(([a, b]) => {
      const mid = a.clone().lerp(b, 0.5);
      mid.y -= 1.1;
      return new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(a, mid, b), 40, 0.025, 4, false);
    });
  }, []);
  useEffect(() => () => tubes.forEach((t) => t.dispose()), [tubes]);
  return (
    <>
      {tubes.map((g, i) => (
        <mesh key={i} geometry={g}>
          <meshBasicMaterial color={night ? '#0a0e1e' : '#2e2a28'} />
        </mesh>
      ))}
    </>
  );
}

// ---------- Big toon-shaded cumulus: instanced spheres, two tones with a hard terminator and a bright rim ----------
const cloudVert = /* glsl */ `
  uniform vec3 uSunView;
  varying float vLit;
  varying float vRim;
  #include <common>
  #include <fog_pars_vertex>
  void main() {
    vec4 mvPosition = modelViewMatrix * instanceMatrix * vec4(position, 1.0);
    vec3 n = normalize(normalMatrix * mat3(instanceMatrix) * normal);
    vLit = dot(n, uSunView);
    vRim = 1.0 - max(dot(n, normalize(-mvPosition.xyz)), 0.0);
    gl_Position = projectionMatrix * mvPosition;
    #include <fog_vertex>
  }
`;
const cloudFrag = /* glsl */ `
  uniform vec3 uLit;
  uniform vec3 uShade;
  uniform vec3 uRimC;
  varying float vLit;
  varying float vRim;
  #include <common>
  #include <fog_pars_fragment>
  void main() {
    vec3 col = mix(uShade, uLit, smoothstep(-0.08, 0.02, vLit));
    col = mix(col, uRimC, smoothstep(0.6, 0.68, vRim) * smoothstep(-0.3, 0.2, vLit) * 0.85);
    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
    #include <fog_fragment>
  }
`;

function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A cumulus tower as a heap of spheres: a wide flat base, narrowing, with big round tops. */
function heap(cx: number, by: number, cz: number, w: number, h: number, seed: number) {
  const r = rng(seed);
  const out: [number, number, number, number][] = [];
  const rows = 5;
  for (let k = 0; k < rows; k++) {
    const t = k / (rows - 1);
    const rowW = w * (1 - t * 0.62);
    const n = Math.max(2, Math.round(7 - t * 5));
    const rad = (w / 7) * (1 + t * 0.45);
    for (let i = 0; i < n; i++) {
      const x = cx - rowW / 2 + (rowW * (i + 0.5)) / n + (r() - 0.5) * rad * 0.5;
      const y = by + t * h * 0.78 + (r() - 0.2) * rad * 0.35;
      const z = cz + (r() - 0.5) * rad * 0.8;
      out.push([x, y, z, rad * (0.8 + r() * 0.4)]);
    }
  }
  return out;
}

function Cumulus({ mood, still }: { mood: Mood; still: boolean }) {
  const puffs = useMemo(
    () => [
      ...heap(-120, 40, -300, 130, 95, 3),
      ...heap(60, 55, -340, 160, 130, 7),
      ...heap(230, 30, -290, 100, 70, 11),
      ...heap(-260, 25, -280, 90, 50, 19),
    ],
    [],
  );
  const mesh = useRef<THREE.InstancedMesh>(null);
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: THREE.UniformsUtils.merge([
          THREE.UniformsLib.fog,
          { uSunView: { value: new THREE.Vector3() }, uLit: { value: new THREE.Color() }, uShade: { value: new THREE.Color() }, uRimC: { value: new THREE.Color() } },
        ]),
        vertexShader: cloudVert,
        fragmentShader: cloudFrag,
        fog: true,
      }),
    [],
  );
  useLayoutEffect(() => paintClouds(mat, mood), [mat, mood]);
  useLayoutEffect(() => {
    const m = mesh.current!;
    const o = new THREE.Object3D();
    puffs.forEach(([x, y, z, s], i) => {
      o.position.set(x, y, z);
      o.scale.setScalar(s);
      o.updateMatrix();
      m.setMatrixAt(i, o.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
  }, [puffs]);
  const sun = useMemo(() => new THREE.Vector3(), []);
  const group = useRef<THREE.Group>(null);
  useFrame(({ camera, clock }) => {
    sun.set(...palettes[mood].key.position).normalize().transformDirection(camera.matrixWorldInverse);
    mat.uniforms.uSunView.value.copy(sun);
    if (group.current && !still) group.current.position.x = Math.sin(clock.elapsedTime * 0.02) * 6;
  });
  return (
    <group ref={group}>
      <instancedMesh ref={mesh} args={[undefined, undefined, puffs.length]} material={mat} frustumCulled={false}>
        <sphereGeometry args={[1, 20, 14]} />
      </instancedMesh>
    </group>
  );
}

function paintClouds(mat: THREE.ShaderMaterial, mood: Mood) {
  const c = palettes[mood].cumulus;
  mat.uniforms.uLit.value.set(c.lit);
  mat.uniforms.uShade.value.set(c.shade);
  mat.uniforms.uRimC.value.set(c.rim);
}

// ---------- Style C: painted sky, clouds and far hills (style B's layers) as planes at depth ----------
function useSvgTexture(svg: string, w: number, h: number) {
  const [tex, setTex] = useState<THREE.CanvasTexture | null>(null);
  useEffect(() => {
    let alive = true;
    const img = new Image();
    img.onload = () => {
      if (!alive) return;
      const c = document.createElement('canvas');
      c.width = w;
      c.height = h;
      c.getContext('2d')!.drawImage(img, 0, 0, w, h);
      const t = new THREE.CanvasTexture(c);
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 4;
      setTex(t);
    };
    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
    return () => {
      alive = false;
    };
  }, [svg, w, h]);
  useEffect(() => () => tex?.dispose(), [tex]);
  return tex;
}

function PaintedPlane({ svg, z, y, width, still, drift = 0 }: { svg: string; z: number; y: number; width: number; still: boolean; drift?: number }) {
  // Layers are painted on a 1600 × 1000 canvas.
  const tex = useSvgTexture(svg, 2048, 1280);
  const mesh = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (mesh.current && drift && !still) mesh.current.position.x = Math.sin(clock.elapsedTime * 0.03) * drift;
  });
  if (!tex) return null;
  return (
    <mesh ref={mesh} position={[0, y, z]} renderOrder={-2}>
      <planeGeometry args={[width, width * 0.625]} />
      <meshBasicMaterial map={tex} transparent depthWrite={false} fog={false} toneMapped={false} />
    </mesh>
  );
}

function PaintedBackdrop({ night, still }: { night: boolean; still: boolean }) {
  const layers = useMemo(() => paintedLayers(night ? 'night' : ('day' as PaintMood)), [night]);
  return (
    <group>
      <PaintedPlane svg={layers.sky} z={-560} y={150} width={1400} still={still} />
      <PaintedPlane svg={layers.clouds} z={-440} y={95} width={600} still={still} drift={8} />
      <PaintedPlane svg={layers.mountains} z={-320} y={37} width={420} still={still} />
      <PaintedPlane svg={layers.forest} z={-60} y={12.5} width={200} still={still} />
    </group>
  );
}

// ---------- Gulmohar petals drifting through the shot ----------
function Petals({ night, still }: { night: boolean; still: boolean }) {
  const N = 140;
  const mesh = useRef<THREE.InstancedMesh>(null);
  const seeds = useMemo(() => {
    const r = rng(41);
    return Array.from({ length: N }, () => ({ x: -10 + r() * 18, y: r() * 9, z: -2 + r() * 12, sp: 0.35 + r() * 0.5, ph: r() * 6.28, spin: 0.6 + r() * 2 }));
  }, []);
  const o = useMemo(() => new THREE.Object3D(), []);
  useFrame(({ clock }) => {
    const m = mesh.current;
    if (!m) return;
    const t = still ? 12 : clock.elapsedTime;
    seeds.forEach((s, i) => {
      const fall = (s.y - t * s.sp * 0.6) % 9;
      o.position.set(s.x + ((t * 0.5 * s.sp) % 22) - 4 + Math.sin(t * 0.9 + s.ph) * 0.6, fall < 0 ? fall + 9 : fall, s.z + Math.cos(t * 0.7 + s.ph) * 0.4);
      o.rotation.set(t * s.spin + s.ph, t * s.spin * 0.7, s.ph);
      o.scale.set(1, 0.62, 1);
      o.updateMatrix();
      m.setMatrixAt(i, o.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
  });
  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, N]} frustumCulled={false}>
      <circleGeometry args={[0.07, 7]} />
      <meshBasicMaterial color={night ? '#c9a4c8' : '#f7b8ca'} side={THREE.DoubleSide} toneMapped={false} />
    </instancedMesh>
  );
}

/** The camera leans a little with the pointer, so the frame feels alive (and the painted planes show parallax). */
function Sway({ still }: { still: boolean }) {
  const cur = useMemo(() => EYE.clone(), []);
  const goal = useMemo(() => new THREE.Vector3(), []);
  useFrame(({ camera, pointer }) => {
    goal.set(EYE.x + (still ? 0 : pointer.x * 0.9), EYE.y + (still ? 0 : pointer.y * 0.35), EYE.z);
    cur.lerp(goal, 0.05);
    camera.position.copy(cur);
    camera.lookAt(LOOK);
  });
  return null;
}

// ---------- Post: bloom on lights and the screen, then a saturated grade with split toning and a vignette ----------
const GradeShader = {
  uniforms: {
    tDiffuse: { value: null },
    uSat: { value: 1.18 },
    uShadow: { value: new THREE.Vector3(0.93, 0.96, 1.08) },
    uHigh: { value: new THREE.Vector3(1.05, 1.0, 0.94) },
    uVignette: { value: 0.22 },
    uGrain: { value: 0.018 },
    uTime: { value: 0 },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform float uSat; uniform vec3 uShadow; uniform vec3 uHigh; uniform float uVignette; uniform float uGrain; uniform float uTime;
    varying vec2 vUv;
    float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233)) + uTime) * 43758.5453); }
    void main() {
      vec4 c = texture2D(tDiffuse, vUv);
      vec3 col = c.rgb;
      float l = dot(col, vec3(0.2126, 0.7152, 0.0722));
      col = mix(vec3(l), col, uSat);
      col *= mix(uShadow, uHigh, smoothstep(0.02, 0.5, l));
      float d = distance(vUv, vec2(0.5));
      col *= 1.0 - uVignette * smoothstep(0.3, 0.85, d);
      col += (hash(vUv * 1000.0) - 0.5) * uGrain;
      gl_FragColor = vec4(max(col, 0.0), c.a);
    }
  `,
};

function Post({ night }: { night: boolean }) {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);
  const post = useMemo(() => {
    const composer = new EffectComposer(gl);
    composer.addPass(new RenderPass(scene, camera));
    const bloom = new UnrealBloomPass(new THREE.Vector2(512, 512), 0.6, 0.55, 0.85);
    composer.addPass(bloom);
    const grade = new ShaderPass(GradeShader);
    composer.addPass(grade);
    composer.addPass(new OutputPass());
    return { composer, bloom, grade };
  }, [gl, scene, camera]);
  useLayoutEffect(() => tunePost(post, night), [post, night]);
  useEffect(() => {
    post.composer.setPixelRatio(gl.getPixelRatio());
    post.composer.setSize(size.width, size.height);
  }, [post, gl, size]);
  useEffect(() => () => post.composer.dispose(), [post]);
  useFrame(({ clock }, dt) => renderPost(post, clock.elapsedTime, dt), 1);
  return null;
}

function renderPost(post: { composer: EffectComposer; grade: ShaderPass }, t: number, dt: number) {
  post.grade.uniforms.uTime.value = t % 10;
  post.composer.render(dt);
}

function setAutoReset(gl: THREE.WebGLRenderer, on: boolean) {
  gl.info.autoReset = on;
}

function tunePost(post: { bloom: UnrealBloomPass; grade: ShaderPass }, night: boolean) {
  // Only genuinely glowing things bloom: the sun/moon, lamps, lit windows and (softly) the screen.
  post.bloom.strength = night ? 0.5 : 0.3;
  post.bloom.threshold = night ? 0.95 : 0.97;
  post.bloom.radius = 0.45;
  const u = post.grade.uniforms;
  u.uSat.value = night ? 1.12 : 1.2;
  u.uShadow.value.set(...(night ? [0.9, 0.97, 1.12] : [0.93, 0.96, 1.08]));
  u.uHigh.value.set(...(night ? [1.08, 1.0, 0.9] : [1.05, 1.0, 0.94]));
  u.uVignette.value = night ? 0.3 : 0.22;
}

function Stats({ onStats }: { onStats: NonNullable<Lookdev3DProps['onStats']> }) {
  const gl = useThree((s) => s.gl);
  const last = useRef(0);
  // Count every pass of the frame (scene, shadow map and post), not just the last one.
  useEffect(() => {
    setAutoReset(gl, false);
    return () => setAutoReset(gl, true);
  }, [gl]);
  // Priority 0 so R3F still renders by itself when post is off: read last frame's totals, then reset.
  useFrame(({ clock }) => {
    if (clock.elapsedTime - last.current >= 1) {
      last.current = clock.elapsedTime;
      onStats({ calls: gl.info.render.calls, triangles: gl.info.render.triangles });
    }
    gl.info.reset();
  });
  return null;
}
