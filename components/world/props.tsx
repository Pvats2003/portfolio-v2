'use client';

// Scenery for the town: sky, clouds, sea, the diorama tile, trees, houses, rails and people.
import { useFrame, useThree } from '@react-three/fiber';
import { useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Ball, Box, Cone, Cyl, Gable, Pill, Slab, Taper, roundedRect, useKit, type V3 } from './kit';
import { palettes, type Mood, type Role } from './palette';

// ---------- Sky: a painterly gradient dome with soft banding, a sun/moon disc and (at night) a few stars ----------
const skyVertex = /* glsl */ `
  varying vec3 vDir;
  void main() {
    vDir = normalize(position);
    vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    gl_Position = p.xyww;
  }
`;
const skyFragment = /* glsl */ `
  uniform vec3 top; uniform vec3 mid; uniform vec3 horizon; uniform vec3 glow; uniform vec3 sun;
  uniform vec3 sunDir; uniform float stars; uniform float sunSize;
  varying vec3 vDir;
  float hash(vec3 p) { return fract(sin(dot(p, vec3(12.9898, 78.233, 45.164))) * 43758.5453); }
  void main() {
    vec3 d = normalize(vDir);
    float h = max(d.y, 0.0);
    // Below the horizon (the backdrop behind the tile): a soft fall-off, not a flat colour.
    float below = smoothstep(0.0, 0.8, -d.y);
    // Soft posterised bands: half smooth, half stepped.
    float hb = mix(h, floor(h * 9.0) / 9.0, 0.45);
    vec3 col = mix(horizon, mid, smoothstep(0.0, 0.22, hb));
    col = mix(col, top, smoothstep(0.18, 0.62, hb));
    float s = max(dot(d, normalize(sunDir)), 0.0);
    col = mix(col, glow, pow(s, 6.0) * 0.55 * (1.0 - smoothstep(0.0, 0.5, h)));
    col = mix(col, sun, smoothstep(sunSize - 0.001, sunSize, s));
    col = mix(col, mix(horizon, top, 0.55), below * 0.75);
    if (stars > 0.5 && h > 0.18) {
      vec3 cell = floor(d * 260.0);
      float st = step(0.9975, hash(cell));
      col = mix(col, vec3(0.93, 0.9, 0.85), st * smoothstep(0.18, 0.4, h) * 0.8);
    }
    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }
`;

function paintSky(material: THREE.ShaderMaterial, mood: Mood) {
  const p = palettes[mood].sky;
  const u = material.uniforms;
  u.top.value.set(p.top);
  u.mid.value.set(p.mid);
  u.horizon.value.set(p.horizon);
  u.glow.value.set(p.glow);
  u.sun.value.set(p.sun);
  // Sun low in the west by day, moon high in the north-east at night; at dusk the sun sits right of centre
  // (behind the product plate on desktop, clear of any text on phones).
  const pal = palettes[mood];
  u.sunDir.value.set(...pal.sunDir);
  u.sunSize.value = pal.sunSize;
  u.stars.value = pal.stars ? 1 : 0;
}

export function Sky({ mood }: { mood: Mood }) {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          top: { value: new THREE.Color() },
          mid: { value: new THREE.Color() },
          horizon: { value: new THREE.Color() },
          glow: { value: new THREE.Color() },
          sun: { value: new THREE.Color() },
          sunDir: { value: new THREE.Vector3() },
          stars: { value: 0 },
          sunSize: { value: 0.9975 },
        },
        vertexShader: skyVertex,
        fragmentShader: skyFragment,
        side: THREE.BackSide,
        depthWrite: false,
        depthTest: true,
        fog: false,
      }),
    [],
  );
  useLayoutEffect(() => paintSky(material, mood), [mood, material]);
  return (
    <mesh material={material} renderOrder={-1} frustumCulled={false}>
      <sphereGeometry args={[400, 32, 16]} />
    </mesh>
  );
}

// ---------- Clouds: flat cards with soft edges, drawn in code ----------
function cloudTexture() {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 128;
  const g = c.getContext('2d')!;
  const blobs: [number, number, number][] = [
    [70, 80, 38],
    [115, 62, 48],
    [165, 72, 40],
    [200, 86, 28],
    [45, 92, 24],
  ];
  g.fillStyle = '#fff';
  for (const [x, y, r] of blobs) {
    g.beginPath();
    g.arc(x, y, r, 0, Math.PI * 2);
    g.fill();
  }
  g.clearRect(0, 96, 256, 32); // flat bottoms, like painted clouds
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export function Clouds({ mood, animate }: { mood: Mood; animate: boolean }) {
  const tex = useMemo(() => cloudTexture(), []);
  const group = useRef<THREE.Group>(null);
  const { tint, opacity } = palettes[mood].cloud;
  const spots = useMemo(
    () =>
      [
        [-120, 48, -150, 70],
        [-30, 62, -170, 90],
        [70, 44, -160, 64],
        [150, 56, -100, 80],
        [-160, 40, -40, 60],
        [120, 70, 60, 70],
      ] as [number, number, number, number][],
    [],
  );
  useFrame((_, dt) => {
    if (animate && group.current) group.current.rotation.y += dt * 0.004;
  });
  return (
    <group ref={group}>
      {spots.map(([x, y, z, w], i) => (
        <sprite key={i} position={[x, y, z]} scale={[w, w / 2, 1]}>
          <spriteMaterial map={tex} color={tint} transparent opacity={opacity} depthWrite={false} fog={false} />
        </sprite>
      ))}
    </group>
  );
}

// ---------- Ground: a rounded diorama tile, a sea along the south, beach, roads ----------
export function Tile() {
  const base = useMemo(() => roundedRect(-30, -20, 30, 21, 4), []);
  const land = useMemo(() => roundedRect(-30, -20, 30, 12, 4), []);
  return (
    <group>
      <Slab shape={base} depth={2.6} role="soil" y={-3} />
      <Slab shape={land} depth={3} role="grass" y={-3} />
      {/* beach band along the south edge of the land */}
      <Box role="sand" p={[0, 0.02, 10.6]} s={[57.5, 0.04, 2.8]} outline={false} shadow={false} />
      {/* main road east–west, and the lane down to the plaza */}
      <Box role="road" p={[0, 0.03, 5]} s={[60, 0.06, 2.6]} outline={false} shadow={false} />
      {Array.from({ length: 14 }, (_, i) => (
        <Box key={i} role="white" p={[-26 + i * 4, 0.07, 5]} s={[1.6, 0.02, 0.18]} outline={false} shadow={false} />
      ))}
    </group>
  );
}

export function Sea({ mood, animate }: { mood: Mood; animate: boolean }) {
  const kit = useKit();
  const water = useMemo(() => new THREE.MeshToonMaterial({ gradientMap: kit.gradient }), [kit]);
  const foam = useMemo(() => new THREE.MeshBasicMaterial({ transparent: true }), []);
  useLayoutEffect(() => {
    water.color.set(palettes[mood].sea);
    foam.color.set(palettes[mood].foam);
  }, [mood, water, foam]);
  const shape = useMemo(() => roundedRect(-29.9, 8, 29.9, 20.9, 3.9), []);
  const geo = useMemo(() => {
    const g = new THREE.ShapeGeometry(shape, 8);
    g.rotateX(-Math.PI / 2);
    return g;
  }, [shape]);
  const f1 = useRef<THREE.Mesh>(null);
  const f2 = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    const t = animate ? clock.elapsedTime : 0;
    if (f1.current) {
      f1.current.position.z = 12.35 + Math.sin(t * 0.8) * 0.18;
      (f1.current.material as THREE.MeshBasicMaterial).opacity = 0.75 + Math.sin(t * 0.8) * 0.2;
    }
    if (f2.current) f2.current.position.z = 13.4 + Math.sin(t * 0.8 + 1.8) * 0.25;
  });
  return (
    <group>
      <mesh geometry={geo} material={water} position={[0, -0.32, 0]} receiveShadow />
      <mesh ref={f1} material={foam} position={[0, -0.28, 12.35]}>
        <boxGeometry args={[57, 0.02, 0.22]} />
      </mesh>
      <mesh ref={f2} material={foam} position={[0, -0.29, 13.4]}>
        <boxGeometry args={[40, 0.02, 0.12]} />
      </mesh>
    </group>
  );
}

// ---------- Trees ----------
export function Palm({ p, lean = 0.18, turn = 0, h = 4.2 }: { p: V3; lean?: number; turn?: number; h?: number }) {
  const segs = 5;
  const top: V3 = [Math.sin(lean) * h * 0.9, h, 0];
  return (
    <group position={p} rotation={[0, turn, 0]}>
      {Array.from({ length: segs }, (_, i) => {
        const t = (i + 0.5) / segs;
        const x = Math.sin(lean) * h * t * t;
        return <Cyl key={i} role="trunk" p={[x, h * t, 0]} s={[0.32 - t * 0.08, h / segs + 0.05, 0.32 - t * 0.08]} r={[0, 0, -lean * t * 1.4]} />;
      })}
      <group position={top}>
        {Array.from({ length: 7 }, (_, i) => (
          <group key={i} rotation={[0, (i / 7) * Math.PI * 2 + 0.3, 0]}>
            <Ball role="leaf" p={[0, -0.25, 1.05]} s={[0.55, 0.1, 2.3]} r={[0.42, 0, 0]} />
          </group>
        ))}
        <Ball role="trunk" p={[0.18, -0.25, 0.1]} s={0.28} outline={false} />
        <Ball role="trunk" p={[-0.12, -0.28, -0.14]} s={0.26} outline={false} />
      </group>
    </group>
  );
}

export function Gulmohar({ p, s = 1 }: { p: V3; s?: number }) {
  return (
    <group position={p} scale={s}>
      <Taper role="trunk" p={[0, 1.1, 0]} s={[0.45, 2.2, 0.45]} />
      <Ball role="leaf" p={[0, 2.35, 0]} s={[3.2, 1.2, 3.0]} />
      <Ball role="bloom" p={[-0.7, 2.85, 0.3]} s={[2.2, 1.1, 2.0]} />
      <Ball role="bloom" p={[0.8, 2.75, -0.2]} s={[2.0, 1.0, 2.1]} />
      <Ball role="bloom" p={[0.1, 3.2, 0.1]} s={[1.8, 0.9, 1.7]} />
    </group>
  );
}

// ---------- A coastal house: lime or laterite walls, a laterite plinth, a Mangalore-tile gable roof ----------
export function House({
  p,
  turn = 0,
  w = 3.6,
  d = 3,
  h = 2.2,
  walls = 'lime',
}: {
  p: V3;
  turn?: number;
  w?: number;
  d?: number;
  h?: number;
  walls?: Role;
}) {
  const pitch = 0.55;
  const half = d / 2 + 0.35;
  const slope = half / Math.cos(pitch);
  const rise = Math.tan(pitch) * half;
  return (
    <group position={p} rotation={[0, turn, 0]}>
      <Box role="laterite" p={[0, 0.2, 0]} s={[w + 0.3, 0.4, d + 0.3]} />
      <Box role={walls} p={[0, 0.4 + h / 2, 0]} s={[w, h, d]} />
      {/* gable ends */}
      <Gable role={walls} p={[0, 0.4 + h, 0]} s={[w, rise, d]} outline={false} />
      {/* roof slopes */}
      <Box role="roof" variant="tiles" p={[0, 0.4 + h + rise / 2, half / 2]} s={[w + 0.7, 0.14, slope]} r={[pitch, 0, 0]} />
      <Box role="roof" variant="tiles" p={[0, 0.4 + h + rise / 2, -half / 2]} s={[w + 0.7, 0.14, slope]} r={[-pitch, 0, 0]} />
      <Box role="roofDark" p={[0, 0.4 + h + rise + 0.02, 0]} s={[w + 0.75, 0.16, 0.22]} />
      {/* door and windows on the front (+z) */}
      <Box role="wood" p={[-w * 0.22, 0.4 + 0.75, d / 2 + 0.02]} s={[0.7, 1.5, 0.06]} outline={false} />
      <Box role="window" variant="glow" p={[w * 0.22, 0.4 + h * 0.58, d / 2 + 0.02]} s={[0.8, 0.7, 0.06]} outline={false} />
      <Box role="wood" p={[w * 0.22, 0.4 + h * 0.58, d / 2 + 0.05]} s={[0.08, 0.7, 0.04]} outline={false} />
    </group>
  );
}

export function Rails({ z = -13 }: { z?: number }) {
  return (
    <group position={[0, 0.02, z]}>
      <Box role="soil" p={[0, 0.04, 0]} s={[60, 0.08, 2.2]} outline={false} shadow={false} />
      {Array.from({ length: 30 }, (_, i) => (
        <Box key={i} role="wood" p={[-29 + i * 2, 0.12, 0]} s={[0.36, 0.08, 1.9]} outline={false} shadow={false} />
      ))}
      <Box role="rail" p={[0, 0.22, -0.55]} s={[60, 0.1, 0.1]} outline={false} />
      <Box role="rail" p={[0, 0.22, 0.55]} s={[60, 0.1, 0.1]} outline={false} />
    </group>
  );
}

// ---------- People: small chibi figures (two dot eyes, no faces modelled on anyone) ----------
export type Shirt = 'shirtA' | 'shirtB' | 'shirtC';

export function Figure({
  p,
  turn = 0,
  shirt = 'shirtA',
  carry = false,
  walk,
  phase = 0,
  animate,
  onWave,
}: {
  p: V3;
  turn?: number;
  shirt?: Shirt;
  carry?: boolean;
  /** Walk back and forth between p and this point. */
  walk?: V3;
  phase?: number;
  animate: boolean;
  onWave?: () => void;
}) {
  const root = useRef<THREE.Group>(null);
  const body = useRef<THREE.Group>(null);
  const armR = useRef<THREE.Group>(null);
  const legL = useRef<THREE.Group>(null);
  const legR = useRef<THREE.Group>(null);
  const waveAt = useRef(-10);
  const waveReq = useRef(false);
  const invalidateNow = useThree((st) => st.invalidate);
  const start = useMemo(() => new THREE.Vector3(...p), [p]);
  const end = useMemo(() => (walk ? new THREE.Vector3(...walk) : null), [walk]);
  useFrame(({ clock, invalidate }) => {
    const t = clock.elapsedTime;
    if (waveReq.current) {
      waveReq.current = false;
      waveAt.current = t;
    }
    const r = root.current;
    if (!r) return;
    let stride = 0;
    if (end && animate) {
      // Out, pause, back, pause — 14 s loop.
      const loop = ((t + phase * 3) % 14) / 14;
      const k = loop < 0.4 ? loop / 0.4 : loop < 0.5 ? 1 : loop < 0.9 ? 1 - (loop - 0.5) / 0.4 : 0;
      const moving = (loop < 0.4 || (loop >= 0.5 && loop < 0.9)) as boolean;
      r.position.lerpVectors(start, end, k * k * (3 - 2 * k));
      const dir = loop < 0.45 ? end.clone().sub(start) : start.clone().sub(end);
      r.rotation.y = Math.atan2(dir.x, dir.z);
      stride = moving ? Math.sin(t * 9) : 0;
    }
    if (body.current) body.current.position.y = animate ? Math.abs(Math.sin(t * 2 + phase)) * 0.04 + Math.abs(stride) * 0.05 : 0;
    if (legL.current) legL.current.rotation.x = stride * 0.5;
    if (legR.current) legR.current.rotation.x = -stride * 0.5;
    if (armR.current) {
      const w = t - waveAt.current;
      armR.current.rotation.z = w < 1.6 ? 2.5 + Math.sin(w * 14) * 0.35 : carry ? 0.9 : 0.12;
      armR.current.rotation.x = carry && w >= 1.6 ? -0.9 : 0;
      // The frame loop is on demand: keep frames coming while the wave plays.
      if (w < 1.7) invalidate();
    }
  });
  return (
    <group
      ref={root}
      position={p}
      rotation={[0, turn, 0]}
      userData={{ figure: true }}
      onClick={(e) => {
        e.stopPropagation();
        waveReq.current = true;
        invalidateNow();
        onWave?.();
      }}
    >
      <group ref={body}>
        {/* legs */}
        <group ref={legL} position={[-0.13, 0.42, 0]}>
          <Cyl role="trousers" p={[0, -0.2, 0]} s={[0.17, 0.42, 0.17]} />
        </group>
        <group ref={legR} position={[0.13, 0.42, 0]}>
          <Cyl role="trousers" p={[0, -0.2, 0]} s={[0.17, 0.42, 0.17]} />
        </group>
        {/* body, hi-vis sash, chest rig */}
        <Taper role={shirt} p={[0, 0.78, 0]} s={[0.62, 0.62, 0.46]} />
        <Box role="hiVis" p={[0, 0.8, 0.02]} s={[0.12, 0.66, 0.5]} r={[0, 0, 0.6]} outline={false} />
        <Box role="rig" p={[0, 0.86, 0.25]} s={[0.22, 0.16, 0.1]} outline={false} />
        <Cyl role="lens" p={[0, 0.86, 0.31]} s={[0.09, 0.05, 0.09]} r={[Math.PI / 2, 0, 0]} outline={false} />
        {/* arms */}
        <group position={[-0.34, 1.0, 0]} rotation={[0, 0, -0.12]}>
          <Pill role={shirt} p={[0, -0.22, 0]} s={[0.13, 0.2, 0.13]} />
        </group>
        <group ref={armR} position={[0.34, 1.0, 0]}>
          <Pill role={shirt} p={[0, -0.22, 0]} s={[0.13, 0.2, 0.13]} />
          {carry && <Box role="rig" p={[0, -0.45, 0.12]} s={[0.26, 0.2, 0.2]} />}
        </group>
        {/* head, hair, eyes */}
        <Ball role="skin" p={[0, 1.42, 0]} s={0.62} />
        <Ball role="hair" p={[0, 1.55, -0.04]} s={[0.66, 0.44, 0.64]} />
        <Ball role="lens" p={[-0.11, 1.42, 0.29]} s={0.07} outline={false} shadow={false} />
        <Ball role="lens" p={[0.11, 1.42, 0.29]} s={0.07} outline={false} shadow={false} />
      </group>
      {/* a soft round shadow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[0.38, 16]} />
        <meshBasicMaterial color="#000" transparent opacity={0.18} depthWrite={false} />
      </mesh>
    </group>
  );
}

// Re-export for places that need raw primitives.
export { Box, Ball, Cone, Cyl, Pill, Taper };
