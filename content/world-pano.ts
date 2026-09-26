// The 360° viewpoints at /world (WORLD.md): which panoramas exist, where you start looking, and the hotspots.
// A hotspot is a direction: yaw = degrees to the right of straight ahead, pitch = degrees up.
// While the panoramas are stand-ins painted from the land plate (scripts/world-pano.mjs), hotspot directions are
// worked out from points on that plate, so they land on the inn, the houses and the paths. When a real 360° image
// arrives for a viewpoint, its hotspots switch to `onImage(...)`: positions measured on the panorama image itself.
import spotsJson from './world-pano-spots.json';
import { plateScene } from './world-scene';
import manifest from './world-pano.json';

export type SpotId = keyof typeof spotsJson;
export type PlaceId = 'inn' | 'resume' | 'contact';
export type Hotspot =
  | { kind: 'place'; id: PlaceId; yaw: number; pitch: number }
  | { kind: 'go'; to: SpotId; yaw: number; pitch: number };
/** A warm window glow at night: centre direction and angular size, in degrees. */
export type Glow = { yaw: number; pitch: number; w: number; h: number };
export type Spot = { id: SpotId; label: string; standIn: boolean; start: { yaw: number; pitch: number }; hotspots: Hotspot[]; glows: Glow[] };

const DEG = 180 / Math.PI;
/** The direction of point (x, y) on the land plate (0–1 from the top left), as seen from a stand-in viewpoint. */
function onPlate(spot: SpotId, x: number, y: number) {
  const { cx, cy, zoom } = spotsJson[spot].standIn;
  const u = (x - cx) * 2 * zoom;
  const v = (y - cy) * 1.125 * zoom;
  const yaw = Math.atan(u);
  return { yaw: yaw * DEG, pitch: Math.atan(-v * Math.cos(yaw)) * DEG };
}

/**
 * The direction of a point on a real 360° panorama, from its position in the source image (x, y as fractions 0–1 of
 * the equirectangular image's width and height), allowing for the viewpoint's `rotate`.
 */
export function onImage(spot: SpotId, x: number, y: number) {
  const rotate = (spotsJson[spot] as { rotate?: number }).rotate ?? 0;
  const yaw = (((x - 0.5) * 360 - rotate + 540) % 360) - 180;
  return { yaw, pitch: (0.5 - y) * 180 };
}

/**
 * The direction of a point on one of the four stitched views (art/pano/<spot>-front/right/back/left), from its
 * position in that square picture (x, y as fractions 0–1). Each view is a 90° cube face, turning right from the inn.
 */
export function onView(view: 'front' | 'right' | 'back' | 'left', x: number, y: number) {
  const u = x * 2 - 1;
  const v = y * 2 - 1;
  const d = { front: [u, -v, -1], right: [1, -v, u], back: [-u, -v, 1], left: [-1, -v, -u] }[view];
  return { yaw: Math.atan2(d[0], -d[2]) * DEG, pitch: Math.atan2(d[1], Math.hypot(d[0], d[2])) * DEG };
}

/** The inn's windows, glowing at night. On a stand-in they come from the land plate; real panoramas need them measured. */
function plateGlows(spot: SpotId): Glow[] {
  return plateScene.windows.map(({ at: [x, y], w, h }) => {
    const a = onPlate(spot, x, y);
    const b = onPlate(spot, x + w, y + h);
    return { yaw: (a.yaw + b.yaw) / 2, pitch: (a.pitch + b.pitch) / 2, w: Math.abs(b.yaw - a.yaw), h: Math.abs(b.pitch - a.pitch) };
  });
}

const spot = (id: SpotId, start: Spot['start'], hotspots: Hotspot[], glows?: Glow[]): Spot => {
  const standIn = manifest.spots[id]?.source === 'stand-in';
  return { id, label: spotsJson[id].label, standIn, start, hotspots, glows: glows ?? (standIn ? plateGlows(id) : []) };
};

export const spots: Record<SpotId, Spot> = {
  square: spot('square', { yaw: 0, pitch: 2 }, [
    { kind: 'place', id: 'inn', ...onPlate('square', 0.5, 0.5) },
    // Placeholders until the real panorama (where they go on the notice board and the post box): the house on the
    // left and the shed on the right.
    { kind: 'place', id: 'resume', ...onPlate('square', 0.08, 0.49) },
    { kind: 'place', id: 'contact', ...onPlate('square', 0.79, 0.44) },
    { kind: 'go', to: 'doorstep', ...onPlate('square', 0.5, 0.8) },
    { kind: 'go', to: 'footbridge', ...onPlate('square', 0.73, 0.68) },
  ]),
  doorstep: spot('doorstep', { yaw: 0, pitch: 6 }, [
    { kind: 'place', id: 'inn', ...onPlate('doorstep', 0.5, 0.5) },
    { kind: 'go', to: 'footbridge', ...onPlate('doorstep', 0.74, 0.68) },
    { kind: 'go', to: 'square', yaw: 180, pitch: -28 },
  ]),
  footbridge: spot('footbridge', { yaw: 0, pitch: 3 }, [
    { kind: 'place', id: 'inn', ...onPlate('footbridge', 0.5, 0.5) },
    { kind: 'place', id: 'contact', ...onPlate('footbridge', 0.79, 0.44) },
    { kind: 'go', to: 'doorstep', ...onPlate('footbridge', 0.5, 0.7) },
    { kind: 'go', to: 'square', yaw: 180, pitch: -28 },
  ]),
};

export const firstSpot: SpotId = 'square';
export const faceSizes = manifest.sizes;
