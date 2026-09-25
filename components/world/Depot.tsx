'use client';

// The Field Ops Depot (City Ops OS): an open-fronted hall with a rigs rack, field officers loading rigs,
// a parked scooter, and a big outdoor screen showing the City Ops command center with demo data.
import { useTexture } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import * as THREE from 'three';
import { Batch, Box, Cyl, Gable } from './kit';
import { Figure, Gulmohar, Palm } from './props';
import type { Mood } from './palette';

const W = 10; // hall width (x)
const D = 6; // hall depth (z)
const H = 3.4; // wall height
const PITCH = 0.5;

function signTexture(text: string) {
  const c = document.createElement('canvas');
  c.width = 1024;
  c.height = 144;
  const g = c.getContext('2d')!;
  g.fillStyle = '#3b2a1f';
  g.fillRect(0, 0, c.width, c.height);
  g.strokeStyle = '#f3eee4';
  g.lineWidth = 6;
  g.strokeRect(14, 14, c.width - 28, c.height - 28);
  const family = getComputedStyle(document.body).getPropertyValue('--font-plex-mono').trim() || 'monospace';
  g.font = `500 64px ${family}`;
  g.fillStyle = '#f3eee4';
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  if ('letterSpacing' in g) (g as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = '10px';
  g.fillText(text, c.width / 2, c.height / 2 + 3);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

function Sign() {
  const [tex, setTex] = useState<THREE.CanvasTexture | null>(null);
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    let t: THREE.CanvasTexture | null = null;
    // Wait for the page's fonts so the sign uses IBM Plex Mono, like the rest of the site.
    document.fonts.ready.then(() => {
      t = signTexture('FIELD OPS DEPOT');
      setTex(t);
      invalidate();
    });
    return () => t?.dispose();
  }, [invalidate]);
  if (!tex) return null;
  return (
    <mesh position={[0, 0.1 + H + 0.05, D / 2 + 0.62]}>
      <planeGeometry args={[5.6, 0.79]} />
      <meshBasicMaterial map={tex} toneMapped={false} />
    </mesh>
  );
}

function prepScreen(tex: THREE.Texture) {
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  tex.needsUpdate = true;
}

function Screen() {
  const tex = useTexture('/world/depot-screen.webp');
  useLayoutEffect(() => prepScreen(tex), [tex]);
  // 1024 × 476 source → keep the aspect.
  const w = 5.4;
  const h = (w * 476) / 1024;
  return (
    <group position={[8.6, 0, 1.2]} rotation={[0, 0.32, 0]}>
      <mesh position={[0, 1.7 + h / 2, 0.1]}>
        <planeGeometry args={[w, h]} />
        <meshBasicMaterial map={tex} toneMapped={false} />
      </mesh>
    </group>
  );
}

function ScreenFrame() {
  const w = 5.4;
  const h = (w * 476) / 1024;
  return (
    <group position={[8.6, 0, 1.2]} rotation={[0, 0.32, 0]}>
      <Box role="screenFrame" p={[0, 1.7 + h / 2, 0]} s={[w + 0.35, h + 0.35, 0.16]} />
      <Box role="metal" p={[-w * 0.32, 0.85, -0.1]} s={[0.22, 1.7, 0.22]} />
      <Box role="metal" p={[w * 0.32, 0.85, -0.1]} s={[0.22, 1.7, 0.22]} />
      <Box role="laterite" p={[0, 0.12, -0.1]} s={[w * 0.9, 0.24, 0.9]} />
    </group>
  );
}

function Rig({ p }: { p: [number, number, number] }) {
  return (
    <group position={p}>
      <Box role="rig" p={[0, 0, 0]} s={[0.42, 0.3, 0.3]} />
      <Cyl role="lens" p={[0, 0.02, 0.17]} s={[0.16, 0.08, 0.16]} r={[Math.PI / 2, 0, 0]} outline={false} />
      <Box role="led" variant="glow" p={[0.14, 0.1, 0.155]} s={[0.05, 0.05, 0.02]} outline={false} shadow={false} />
    </group>
  );
}

function Scooter({ p, turn = 0 }: { p: [number, number, number]; turn?: number }) {
  return (
    <group position={p} rotation={[0, turn, 0]}>
      <Cyl role="rig" p={[0, 0.28, 0.72]} s={[0.56, 0.16, 0.56]} r={[0, 0, Math.PI / 2]} />
      <Cyl role="rig" p={[0, 0.28, -0.72]} s={[0.56, 0.16, 0.56]} r={[0, 0, Math.PI / 2]} />
      <Box role="shirtA" p={[0, 0.55, -0.25]} s={[0.5, 0.42, 1.2]} />
      <Box role="shirtA" p={[0, 0.72, 0.62]} s={[0.46, 0.9, 0.16]} r={[-0.25, 0, 0]} />
      <Box role="rig" p={[0, 0.85, -0.35]} s={[0.4, 0.12, 0.8]} />
      <Box role="metal" p={[0, 1.2, 0.72]} s={[0.9, 0.07, 0.07]} />
      <Box role="window" variant="glow" p={[0, 1.02, 0.8]} s={[0.18, 0.12, 0.06]} outline={false} />
    </group>
  );
}

function poolTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d')!;
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.5, 'rgba(255,255,255,0.45)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/** Street lamps on the plaza; after dark they throw warm pools of light on the paving. */
function Lamps({ mood }: { mood: Mood }) {
  const tex = useMemo(() => poolTexture(), []);
  const spots: [number, number][] = [
    [-5.6, 3.9],
    [4.2, 4.0],
  ];
  const opacity = mood === 'day' ? 0 : mood === 'night' ? 0.5 : 0.4;
  return (
    <>
      {spots.map(([x, z]) => (
        <mesh key={`${x}`} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.08, z]} visible={opacity > 0}>
          <planeGeometry args={[5, 5]} />
          <meshBasicMaterial map={tex} color="#ffc27a" transparent opacity={opacity} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
        </mesh>
      ))}
    </>
  );
}

function LampPosts() {
  return (
    <>
      {([
        [-5.6, 3.9],
        [4.2, 4.0],
      ] as [number, number][]).map(([x, z]) => (
        <group key={x} position={[x, 0, z]}>
          <Cyl role="metal" p={[0, 1.5, 0]} s={[0.12, 3, 0.12]} />
          <Box role="metal" p={[0, 3.05, 0]} s={[0.5, 0.12, 0.5]} />
          <Box role="window" variant="glow" p={[0, 2.9, 0]} s={[0.34, 0.22, 0.34]} outline={false} />
        </group>
      ))}
    </>
  );
}

function hitsFigure(o: THREE.Object3D | null): boolean {
  for (let x = o; x; x = x.parent) if (x.userData.figure) return true;
  return false;
}

/** Static parts of the depot, merged into a few draw calls. */
function DepotStatic() {
  const half = D / 2 + 0.6;
  const slope = half / Math.cos(PITCH);
  const rise = Math.tan(PITCH) * half;
  const top = 0.1 + H;
  return (
    <Batch>
      {/* plaza paving and the depot floor */}
      <Box role="paving" variant="tiles" p={[1.5, 0.03, -0.5]} s={[21, 0.06, 11]} outline={false} shadow={false} />
      <Box role="laterite" p={[0, 0.06, -1]} s={[W + 0.6, 0.12, D + 0.6]} />
      {/* walls: lime-wash above a laterite band */}
      <Box role="lime" p={[0, 0.1 + H / 2, -1 - D / 2]} s={[W, H, 0.3]} />
      <Box role="lime" p={[-W / 2, 0.1 + H / 2, -1]} s={[0.3, H, D]} />
      <Box role="lime" p={[W / 2, 0.1 + H / 2, -1]} s={[0.3, H, D]} />
      <Box role="laterite" p={[-W / 2 - 0.02, 0.55, -1]} s={[0.34, 0.9, D]} outline={false} />
      <Box role="laterite" p={[W / 2 + 0.02, 0.55, -1]} s={[0.34, 0.9, D]} outline={false} />
      {/* gable ends */}
      <Gable role="lime" p={[0, top, -1]} s={[W, rise, D]} outline={false} />
      {/* front pillars and beam */}
      {[-4.55, -1.55, 1.55, 4.55].map((x) => (
        <Cyl key={x} role="laterite" p={[x, 0.1 + H / 2, -1 + D / 2]} s={[0.42, H, 0.42]} />
      ))}
      <Box role="wood" p={[0, top - 0.1, -1 + D / 2]} s={[W + 0.2, 0.3, 0.36]} />
      {/* Mangalore-tile roof */}
      <Box role="roof" variant="tiles" p={[0, top + rise / 2, -1 + half / 2]} s={[W + 1.2, 0.18, slope]} r={[PITCH, 0, 0]} />
      <Box role="roof" variant="tiles" p={[0, top + rise / 2, -1 - half / 2]} s={[W + 1.2, 0.18, slope]} r={[-PITCH, 0, 0]} />
      <Box role="roofDark" p={[0, top + rise + 0.03, -1]} s={[W + 1.3, 0.2, 0.28]} />
      {/* sign board backing */}
      <Box role="wood" p={[0, top + 0.05, -1 + D / 2 + 0.26]} s={[6, 1.0, 0.1]} r={[0.12, 0, 0]} />
      {/* rigs rack on the back wall */}
      <Box role="wood" p={[-2.2, 1.2, -3.6]} s={[4.4, 0.1, 0.8]} />
      <Box role="wood" p={[-2.2, 2.2, -3.6]} s={[4.4, 0.1, 0.8]} />
      <Box role="wood" p={[-4.35, 1.45, -3.6]} s={[0.12, 2.7, 0.8]} />
      <Box role="wood" p={[-0.05, 1.45, -3.6]} s={[0.12, 2.7, 0.8]} />
      {[-3.6, -2.7, -1.8, -0.9].map((x) => (
        <Rig key={`a${x}`} p={[x, 1.42, -3.5]} />
      ))}
      {[-3.6, -2.7, -1.8].map((x) => (
        <Rig key={`b${x}`} p={[x, 2.42, -3.5]} />
      ))}
      {/* workbench with rigs charging */}
      <Box role="wood" p={[2.4, 0.95, -2.2]} s={[2.8, 0.12, 1.2]} />
      <Box role="wood" p={[1.15, 0.5, -2.2]} s={[0.12, 0.9, 1.0]} />
      <Box role="wood" p={[3.65, 0.5, -2.2]} s={[0.12, 0.9, 1.0]} />
      <Rig p={[1.9, 1.17, -2.2]} />
      <Rig p={[2.9, 1.17, -2.2]} />
      {/* lamps under the roof: warm pools of light at night */}
      <Box role="wood" p={[-2.6, top - 0.55, -1]} s={[0.04, 0.7, 0.04]} outline={false} />
      <Box role="wood" p={[2.6, top - 0.55, -1]} s={[0.04, 0.7, 0.04]} outline={false} />
      <Box role="window" variant="glow" p={[-2.6, top - 1.0, -1]} s={[0.36, 0.3, 0.36]} />
      <Box role="window" variant="glow" p={[2.6, top - 1.0, -1]} s={[0.36, 0.3, 0.36]} />
      {/* crates out front */}
      <Box role="wood" p={[-6.4, 0.4, 0.2]} s={[0.9, 0.8, 0.9]} />
      <Box role="wood" p={[-6.1, 1.05, 0.1]} s={[0.7, 0.5, 0.7]} r={[0, 0.3, 0]} />
      <ScreenFrame />
      <LampPosts />
      <Scooter p={[-7.6, 0, 3]} turn={0.9} />
      <Palm p={[-9.5, 0, -2]} lean={0.2} turn={0.4} h={4.6} />
      <Palm p={[11.8, 0, -4]} lean={0.16} turn={2.6} h={4.2} />
      <Gulmohar p={[-9, 0, -6.5]} s={1.05} />
    </Batch>
  );
}

export function Depot({
  mood,
  animate,
  onOpen,
  onHover,
}: {
  mood: Mood;
  animate: boolean;
  onOpen: () => void;
  onHover: (on: boolean) => void;
}) {
  return (
    <group>
      <DepotStatic />
      <Sign />
      <Screen />
      <Lamps mood={mood} />
      <Figure p={[-2.4, 0.12, -2.6]} walk={[-3.2, 0.06, 2.8]} shirt="shirtA" carry animate={animate} phase={0} />
      <Figure p={[6.4, 0.06, 3.1]} turn={2.6} shirt="shirtB" animate={animate} phase={1.3} />
      <Figure p={[2.5, 0.12, -1.3]} turn={Math.PI} shirt="shirtC" animate={animate} phase={2.1} />
      {/* One generous, invisible hit area so the depot is easy to tap. */}
      <mesh
        position={[1.8, 2.8, -1]}
        onClick={(e) => {
          // A tap that also hits a person makes them wave instead.
          if (e.intersections.some((i) => hitsFigure(i.object))) return;
          e.stopPropagation();
          onOpen();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover(true);
        }}
        onPointerOut={() => onHover(false)}
      >
        <boxGeometry args={[18, 5.8, 9.5]} />
        <meshBasicMaterial colorWrite={false} depthWrite={false} />
      </mesh>
    </group>
  );
}
