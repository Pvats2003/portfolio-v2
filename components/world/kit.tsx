'use client';

// The world's drawing kit: toon materials, ink outlines and static batching (WORLD.md §2.1, §6).
// Everything is built from a handful of unit primitives, scaled per use. Static parts are merged per material
// at mount so the whole town costs a few dozen draw calls.
import { createContext, useContext, useLayoutEffect, useMemo, useRef, type ReactNode } from 'react';
import * as THREE from 'three';
import { mergeGeometries, mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { palettes, type Mood, type Role } from './palette';

export type V3 = [number, number, number];

// ---------- Outline: an inverted hull pushed out a constant number of pixels in clip space ----------
const outlineVertex = /* glsl */ `
  uniform float thickness;
  uniform vec2 resolution;
  #include <common>
  #include <fog_pars_vertex>
  void main() {
    mat4 model = modelMatrix;
    #ifdef USE_INSTANCING
      model = modelMatrix * instanceMatrix;
    #endif
    vec4 mvPosition = viewMatrix * model * vec4(position, 1.0);
    vec4 clip = projectionMatrix * mvPosition;
    vec3 n = normalize(mat3(viewMatrix) * mat3(model) * normal);
    vec2 dir = (projectionMatrix * vec4(n, 0.0)).xy;
    float len = length(dir);
    if (len > 0.0001) clip.xy += dir / len * thickness * clip.w * 2.0 / resolution;
    gl_Position = clip;
    #include <fog_vertex>
  }
`;
const outlineFragment = /* glsl */ `
  uniform vec3 color;
  #include <common>
  #include <fog_pars_fragment>
  void main() {
    gl_FragColor = vec4(color, 1.0);
    #include <colorspace_fragment>
    #include <fog_fragment>
  }
`;

function makeGradient() {
  // Three hard steps: shadow, mid, lit — the cel look.
  const data = new Uint8Array([110, 110, 110, 255, 185, 185, 185, 255, 255, 255, 255, 255]);
  const tex = new THREE.DataTexture(data, 3, 1, THREE.RGBAFormat);
  tex.minFilter = THREE.NearestFilter;
  tex.magFilter = THREE.NearestFilter;
  tex.generateMipmaps = false;
  tex.needsUpdate = true;
  return tex;
}

function stripes(size: number, bands: number, dark: number) {
  // Mangalore roof tiles / paving: soft horizontal bands drawn in code.
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d')!;
  g.fillStyle = '#fff';
  g.fillRect(0, 0, size, size);
  const step = size / bands;
  for (let i = 0; i < bands; i++) {
    g.fillStyle = `rgba(0,0,0,${dark})`;
    g.fillRect(0, i * step + step * 0.72, size, step * 0.28);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** One per canvas: materials by role, the outline material and the unit primitives. Colours follow the mood. */
export class Kit {
  gradient = makeGradient();
  materials = new Map<string, THREE.MeshToonMaterial>();
  tileTex = stripes(64, 4, 0.22);
  outline = new THREE.ShaderMaterial({
    uniforms: THREE.UniformsUtils.merge([
      THREE.UniformsLib.fog,
      { color: { value: new THREE.Color() }, thickness: { value: 1.5 }, resolution: { value: new THREE.Vector2(1, 1) } },
    ]),
    vertexShader: outlineVertex,
    fragmentShader: outlineFragment,
    side: THREE.BackSide,
    fog: true,
  });
  geo = {
    box: new THREE.BoxGeometry(1, 1, 1),
    cyl: new THREE.CylinderGeometry(0.5, 0.5, 1, 14),
    cone: new THREE.CylinderGeometry(0, 0.5, 1, 14),
    taper: new THREE.CylinderGeometry(0.35, 0.5, 1, 12),
    sphere: new THREE.SphereGeometry(0.5, 18, 12),
    capsule: new THREE.CapsuleGeometry(0.5, 1, 6, 12),
    prism: makePrism(),
  };
  private hulls = new WeakMap<THREE.BufferGeometry, THREE.BufferGeometry>();
  mood: Mood = 'day';

  mat(role: Role, variant: 'plain' | 'tiles' | 'glow' = 'plain') {
    const key = `${role}:${variant}`;
    let m = this.materials.get(key);
    if (!m) {
      m = new THREE.MeshToonMaterial({ gradientMap: this.gradient });
      if (variant === 'tiles') {
        m.map = this.tileTex;
      }
      m.userData = { role, variant };
      this.materials.set(key, m);
      this.paint(m);
    }
    return m;
  }

  /** Smooth-normal copy of a geometry for the outline hull (split normals would crack at corners). */
  hull(g: THREE.BufferGeometry) {
    let h = this.hulls.get(g);
    if (!h) {
      h = smoothHull(g);
      this.hulls.set(g, h);
    }
    return h;
  }

  private paint(m: THREE.MeshToonMaterial) {
    const p = palettes[this.mood];
    const { role, variant } = m.userData as { role: Role; variant: string };
    m.color.set(p.roles[role]);
    if (variant === 'glow') {
      m.emissive.set(p.roles[role]);
      m.emissiveIntensity = p.glow;
    }
  }

  setOutlineSize(width: number, height: number, dpr: number) {
    this.outline.uniforms.resolution.value.set(width * dpr, height * dpr);
    this.outline.uniforms.thickness.value = 2 * dpr;
  }

  setMood(mood: Mood) {
    this.mood = mood;
    this.materials.forEach((m) => this.paint(m));
    this.outline.uniforms.color.value.set(palettes[mood].outline);
  }

  dispose() {
    this.materials.forEach((m) => m.dispose());
    this.outline.dispose();
    this.gradient.dispose();
    this.tileTex.dispose();
    Object.values(this.geo).forEach((g) => g.dispose());
  }
}

/** A gable: triangular prism along x, base 1 wide (z) at y = 0, apex at y = 1. Flat-shaded. */
function makePrism() {
  const g = new THREE.CylinderGeometry(0.5, 0.5, 1, 3, 1).toNonIndexed();
  g.rotateZ(Math.PI / 2);
  g.rotateX(-Math.PI / 2);
  g.translate(0, 0.25, 0);
  g.scale(1, 1 / 0.75, 1 / 0.866);
  g.computeVertexNormals();
  return g;
}

export function smoothHull(g: THREE.BufferGeometry) {
  const c = new THREE.BufferGeometry();
  c.setAttribute('position', g.getAttribute('position').clone());
  if (g.index) c.setIndex(g.index.clone());
  const merged = mergeVertices(c, 1e-4);
  merged.computeVertexNormals();
  return merged;
}

const KitContext = createContext<Kit | null>(null);
export const KitProvider = ({ kit, children }: { kit: Kit; children: ReactNode }) => (
  <KitContext.Provider value={kit}>{children}</KitContext.Provider>
);
export function useKit() {
  const k = useContext(KitContext);
  if (!k) throw new Error('useKit outside KitProvider');
  return k;
}

// ---------- Primitives ----------
type PartProps = {
  role: Role;
  p?: V3;
  s?: V3 | number;
  r?: V3;
  variant?: 'plain' | 'tiles' | 'glow';
  outline?: boolean;
  shadow?: boolean;
};

function Part({ geo, role, p, s = 1, r, variant = 'plain', outline = true, shadow = true }: PartProps & { geo: keyof Kit['geo'] }) {
  const kit = useKit();
  const g = kit.geo[geo];
  const scale: V3 = typeof s === 'number' ? [s, s, s] : s;
  return (
    <group position={p} rotation={r} scale={scale}>
      <mesh geometry={g} material={kit.mat(role, variant)} castShadow={shadow} receiveShadow userData={{ part: true }} />
      {outline && <mesh geometry={kit.hull(g)} material={kit.outline} userData={{ hull: true }} />}
    </group>
  );
}

export const Box = (p: PartProps) => <Part geo="box" {...p} />;
export const Cyl = (p: PartProps) => <Part geo="cyl" {...p} />;
export const Cone = (p: PartProps) => <Part geo="cone" {...p} />;
export const Taper = (p: PartProps) => <Part geo="taper" {...p} />;
export const Ball = (p: PartProps) => <Part geo="sphere" {...p} />;
export const Pill = (p: PartProps) => <Part geo="capsule" {...p} />;
export const Gable = (p: PartProps) => <Part geo="prism" {...p} />;

/** A shape extruded upward (e.g. the rounded diorama tile). Shape is drawn in x/z. */
export function Slab({ shape, depth, role, y = 0, outline = true }: { shape: THREE.Shape; depth: number; role: Role; y?: number; outline?: boolean }) {
  const kit = useKit();
  const g = useMemo(() => {
    const e = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false, curveSegments: 8 });
    e.rotateX(-Math.PI / 2);
    return e;
  }, [shape, depth]);
  return (
    <group position={[0, y, 0]}>
      <mesh geometry={g} material={kit.mat(role)} receiveShadow userData={{ part: true }} />
      {outline && <mesh geometry={kit.hull(g)} material={kit.outline} userData={{ hull: true }} />}
    </group>
  );
}

export function roundedRect(x0: number, z0: number, x1: number, z1: number, r: number) {
  // Drawn in the x/y plane with y = -z, so after rotateX(-90°) it lands on x/z.
  const s = new THREE.Shape();
  const [a, b, c, d] = [x0, -z1, x1, -z0];
  s.moveTo(a + r, b);
  s.lineTo(c - r, b);
  s.quadraticCurveTo(c, b, c, b + r);
  s.lineTo(c, d - r);
  s.quadraticCurveTo(c, d, c - r, d);
  s.lineTo(a + r, d);
  s.quadraticCurveTo(a, d, a, d - r);
  s.lineTo(a, b + r);
  s.quadraticCurveTo(a, b, a + r, b);
  return s;
}

/**
 * Merges every static part inside it into one mesh per material (plus one outline mesh) after mount.
 * Children render once as normal meshes, get baked, then the originals are hidden.
 */
export function Batch({ children, shadows = true }: { children: ReactNode; shadows?: boolean }) {
  const kit = useKit();
  const src = useRef<THREE.Group>(null);
  const out = useRef<THREE.Group>(null);
  useLayoutEffect(() => {
    const root = src.current!;
    const target = out.current!;
    root.updateWorldMatrix(true, true);
    const inv = root.matrixWorld.clone().invert();
    const buckets = new Map<THREE.Material, THREE.BufferGeometry[]>();
    const hulls: THREE.BufferGeometry[] = [];
    const m = new THREE.Matrix4();
    root.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      m.multiplyMatrices(inv, mesh.matrixWorld);
      if (mesh.userData.hull) {
        const h = mesh.geometry.clone().applyMatrix4(m);
        // Re-smooth after baking so non-uniform scales keep an even line.
        hulls.push(smoothHull(h));
        h.dispose();
      } else if (mesh.userData.part) {
        const g = mesh.geometry.clone();
        g.applyMatrix4(m);
        for (const name of Object.keys(g.attributes)) if (!['position', 'normal', 'uv'].includes(name)) g.deleteAttribute(name);
        const geoms = buckets.get(mesh.material as THREE.Material) ?? [];
        geoms.push(g.index ? g.toNonIndexed() : g);
        buckets.set(mesh.material as THREE.Material, geoms);
      }
    });
    const made: THREE.Mesh[] = [];
    buckets.forEach((geoms, material) => {
      const merged = mergeGeometries(geoms, false);
      geoms.forEach((g) => g.dispose());
      if (!merged) return;
      const mesh = new THREE.Mesh(merged, material);
      mesh.castShadow = shadows;
      mesh.receiveShadow = true;
      made.push(mesh);
    });
    if (hulls.length) {
      const merged = mergeGeometries(hulls.map((h) => (h.index ? h.toNonIndexed() : h)), false);
      if (merged) made.push(new THREE.Mesh(merged, kit.outline));
    }
    made.forEach((x) => target.add(x));
    root.visible = false;
    return () => {
      made.forEach((x) => {
        target.remove(x);
        x.geometry.dispose();
      });
      root.visible = true;
    };
  }, [kit, shadows]);
  return (
    <>
      <group ref={src}>{children}</group>
      <group ref={out} />
    </>
  );
}
