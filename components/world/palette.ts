// World colours (WORLD.md §2.2). Built from the site tokens so the town and the UI read as one product.
// "day" = golden hour (light theme), "night" = night shift (dark theme), "dusk" = the homepage hero (always dark).

export type Mood = 'day' | 'night' | 'dusk' | 'aDay' | 'aNight';
// "aDay"/"aNight": the look-development palettes for style A (pushed anime 3D) — more saturated golden hour,
// and a rich blue night with warm lights.

export type Role =
  | 'roof'
  | 'roofDark'
  | 'lime'
  | 'laterite'
  | 'wood'
  | 'grass'
  | 'grassDark'
  | 'soil'
  | 'sand'
  | 'paving'
  | 'road'
  | 'rail'
  | 'metal'
  | 'screenFrame'
  | 'leaf'
  | 'bloom'
  | 'trunk'
  | 'skin'
  | 'hair'
  | 'shirtA'
  | 'shirtB'
  | 'shirtC'
  | 'trousers'
  | 'hiVis'
  | 'rig'
  | 'lens'
  | 'window'
  | 'led'
  | 'white'
  // Village (look-dev)
  | 'kawara'
  | 'kawaraLine'
  | 'plaster'
  | 'woodDark'
  | 'lantern'
  | 'noren'
  | 'blossom'
  | 'paddy'
  | 'stone'
  | 'water'
  | 'path'
  | 'mtn'
  | 'mtnFar'
  | 'forest'
  | 'vending';

export type Palette = {
  roles: Record<Role, string>;
  sky: { top: string; mid: string; horizon: string; glow: string; sun: string };
  sea: string;
  seaDeep: string;
  foam: string;
  outline: string;
  key: { color: string; intensity: number; position: [number, number, number] };
  ambient: { color: string; intensity: number };
  /** How strongly lit windows and screens glow. */
  glow: number;
  fog: string;
  /** Sky disc: sun by day, moon at night. */
  sunDir: [number, number, number];
  sunSize: number;
  stars: boolean;
  /** Flat cloud cards (Phase 2 look). */
  cloud: { tint: string; opacity: number };
  /** Strength of the warm light pools under the street lamps (0 = off). */
  lamps: number;
  /** Rim light on silhouettes facing the key light (style A only). */
  rim: { color: string; strength: number };
  /** Big toon-shaded cumulus (style A only). */
  cumulus: { lit: string; shade: string; rim: string };
};

const common = {
  skin: '#b27a55',
  hair: '#2b1d14',
  lens: '#1a1714',
};

export const palettes: Record<Mood, Palette> = {
  day: {
    roles: {
      ...common,
      roof: '#a63a1b',
      roofDark: '#7e2a12',
      lime: '#f3eee4',
      laterite: '#c9744f',
      wood: '#8a5a3b',
      grass: '#9dbb6f',
      grassDark: '#7f9d58',
      soil: '#8b5e3c',
      sand: '#ecd9b4',
      paving: '#e3d3b5',
      road: '#6b645a',
      rail: '#5b534a',
      metal: '#8d8a84',
      screenFrame: '#2a2622',
      leaf: '#5f8f4a',
      bloom: '#d9532b',
      trunk: '#7a5236',
      shirtA: '#3f6f8f',
      shirtB: '#6b8f5a',
      shirtC: '#8f5a7a',
      trousers: '#3b3a45',
      hiVis: '#f08a3d',
      rig: '#2f2b27',
      window: '#ffe2b0',
      led: '#3fae5a',
      white: '#fbf8f2',
      kawara: '#4d5a70',
      kawaraLine: '#323a48',
      plaster: '#f4ecda',
      woodDark: '#4f3424',
      lantern: '#e2472a',
      noren: '#2f4f86',
      blossom: '#f7b3c6',
      paddy: '#9fd0ea',
      stone: '#b8b0a4',
      water: '#6fb0d6',
      path: '#cdb592',
      mtn: '#6f8f8a',
      mtnFar: '#8fa6ba',
      forest: '#3f7a4a',
      vending: '#e6e8f0',
    },
    sky: { top: '#8fb4cf', mid: '#e9c7a3', horizon: '#f6b27a', glow: '#ffd8a8', sun: '#fff1d6' },
    sea: '#5fa8a8',
    seaDeep: '#3f7f86',
    foam: '#fbf8f2',
    outline: '#3a2a1f',
    key: { color: '#ffd9a8', intensity: 2.4, position: [-30, 22, 18] },
    ambient: { color: '#f3e3cf', intensity: 1.15 },
    glow: 0.15,
    fog: '#f1cfa6',
    sunDir: [-0.8, 0.12, -0.35],
    sunSize: 0.9975,
    stars: false,
    cloud: { tint: '#fff4e6', opacity: 0.95 },
    lamps: 0,
    rim: { color: '#ffd9a0', strength: 0 },
    cumulus: { lit: '#fff6ea', shade: '#e3c9c9', rim: '#ffe6c0' },
  },
  night: {
    roles: {
      ...common,
      skin: '#7d5a45',
      hair: '#140e0a',
      roof: '#6a2a16',
      roofDark: '#4a1c0e',
      lime: '#7d7a86',
      laterite: '#6e4535',
      wood: '#4e3626',
      grass: '#3d5446',
      grassDark: '#2c3e34',
      soil: '#3b2a1f',
      sand: '#6d6573',
      paving: '#5f5a66',
      road: '#2e2c33',
      rail: '#2a2830',
      metal: '#55545e',
      screenFrame: '#141216',
      leaf: '#2e4a3c',
      bloom: '#8a3a2a',
      trunk: '#3b2a20',
      shirtA: '#2e4a63',
      shirtB: '#3f5a3f',
      shirtC: '#5a3f55',
      trousers: '#23222b',
      hiVis: '#c86a30',
      rig: '#1a1816',
      window: '#ffcf8a',
      led: '#7cc48a',
      white: '#b9b6c2',
      kawara: '#26304a',
      kawaraLine: '#141a2a',
      plaster: '#8fa6d0',
      woodDark: '#1e1e30',
      lantern: '#ff6a3a',
      noren: '#1c2c5a',
      blossom: '#b88aa6',
      paddy: '#2a4f86',
      stone: '#56709e',
      water: '#1f4a86',
      path: '#4c6a9c',
      mtn: '#1f3f68',
      mtnFar: '#2a4f80',
      forest: '#173a4a',
      vending: '#dde6ff',
    },
    sky: { top: '#0f0c08', mid: '#1f2a3d', horizon: '#3d3550', glow: '#7a4a3a', sun: '#eee7da' },
    sea: '#1d3140',
    seaDeep: '#132230',
    foam: '#5d6e80',
    outline: '#0b0906',
    key: { color: '#8ea6c8', intensity: 1.8, position: [25, 30, -10] },
    ambient: { color: '#6a7a9a', intensity: 1.5 },
    glow: 1.6,
    fog: '#2a2d42',
    sunDir: [0.45, 0.55, -0.7],
    sunSize: 0.9986,
    stars: true,
    cloud: { tint: '#39405a', opacity: 0.7 },
    lamps: 0.5,
    rim: { color: '#9fc4ff', strength: 0 },
    cumulus: { lit: '#5f7fb8', shade: '#2a4478', rim: '#cfe0ff' },
  },
  dusk: {
    roles: {
      ...common,
      skin: '#8a6048',
      hair: '#1a120d',
      roof: '#7a2f18',
      roofDark: '#55200f',
      lime: '#8f8494',
      laterite: '#7a4a38',
      wood: '#57392a',
      grass: '#46573f',
      grassDark: '#34432f',
      soil: '#42301f',
      sand: '#7a6a6a',
      paving: '#6a6068',
      road: '#322e33',
      rail: '#2c2830',
      metal: '#5d5a62',
      screenFrame: '#141216',
      leaf: '#34493a',
      bloom: '#9a3f28',
      trunk: '#402c20',
      shirtA: '#34506a',
      shirtB: '#465e40',
      shirtC: '#604459',
      trousers: '#26242c',
      hiVis: '#d06f34',
      rig: '#1c1917',
      window: '#ffc27a',
      led: '#7cc48a',
      white: '#c2bcc4',
      kawara: '#26304a',
      kawaraLine: '#141a2a',
      plaster: '#8fa6d0',
      woodDark: '#1e1e30',
      lantern: '#ff6a3a',
      noren: '#1c2c5a',
      blossom: '#b88aa6',
      paddy: '#2a4f86',
      stone: '#56709e',
      water: '#1f4a86',
      path: '#4c6a9c',
      mtn: '#1f3f68',
      mtnFar: '#2a4f80',
      forest: '#173a4a',
      vending: '#dde6ff',
    },
    // Dark where the headline sits, warm only near the horizon (keeps the cream text at AA contrast).
    sky: { top: '#0f0c08', mid: '#1c1a24', horizon: '#5a3a3a', glow: '#c0673c', sun: '#f4b27a' },
    sea: '#233444',
    seaDeep: '#172433',
    foam: '#6d7684',
    outline: '#0b0906',
    key: { color: '#f0a070', intensity: 1.2, position: [-40, 8, -20] },
    ambient: { color: '#6a5a78', intensity: 1.0 },
    glow: 1.4,
    fog: '#3a2c30',
    sunDir: [0.3, 0.025, -1],
    sunSize: 0.9986,
    stars: true,
    cloud: { tint: '#6a4a52', opacity: 0.7 },
    lamps: 0.4,
    rim: { color: '#f0a070', strength: 0 },
    cumulus: { lit: '#8a6a78', shade: '#4a3a4a', rim: '#f4b27a' },
  },
  aDay: {
    roles: {
      skin: '#b07048',
      hair: '#2a1a12',
      lens: '#141214',
      roof: '#c8461c',
      roofDark: '#8a2a10',
      lime: '#fff3df',
      laterite: '#dc6f3c',
      wood: '#7a5236',
      grass: '#93c255',
      grassDark: '#6fa246',
      soil: '#8b5a36',
      sand: '#f7d99c',
      paving: '#f2d29e',
      road: '#6e5a5a',
      rail: '#5a4a48',
      metal: '#8a8ca4',
      screenFrame: '#23202a',
      leaf: '#4a8f46',
      bloom: '#ff5226',
      trunk: '#5a3a2c',
      shirtA: '#2f6fb8',
      shirtB: '#46a04a',
      shirtC: '#bf4f80',
      trousers: '#34324a',
      hiVis: '#ff8a24',
      rig: '#2a2626',
      window: '#ffe6b0',
      led: '#3fe070',
      white: '#fffaf0',
      kawara: '#4f5d74',
      kawaraLine: '#323a48',
      plaster: '#f6eedc',
      woodDark: '#4f3424',
      lantern: '#e2472a',
      noren: '#2f4f86',
      blossom: '#ffc8ea',
      paddy: '#a8d4ec',
      stone: '#bdb4a6',
      water: '#72b4da',
      path: '#d2b994',
      mtn: '#6f9290',
      mtnFar: '#93abc2',
      forest: '#3c7848',
      vending: '#e6e8f0',
    },
    sky: { top: '#2a6cc8', mid: '#86c4ee', horizon: '#ffd296', glow: '#ffae5a', sun: '#fff4d8' },
    sea: '#36b2b2',
    seaDeep: '#228a98',
    foam: '#ffffff',
    outline: '#2a1810',
    key: { color: '#ffc98a', intensity: 2.3, position: [-34, 14, 22] },
    ambient: { color: '#ffe0c8', intensity: 0.75 },
    glow: 0.08,
    fog: '#ffd0a0',
    sunDir: [-0.82, 0.1, -0.3],
    sunSize: 0.9975,
    stars: false,
    cloud: { tint: '#fff4e6', opacity: 0.95 },
    lamps: 0,
    rim: { color: '#ffe0a8', strength: 1.0 },
    cumulus: { lit: '#fff7ec', shade: '#e9b9b0', rim: '#ffe2b4' },
  },
  aNight: {
    roles: {
      skin: '#86695e',
      hair: '#0c0a14',
      lens: '#08080e',
      roof: '#5a2c38',
      roofDark: '#3a1a24',
      lime: '#8facdc',
      laterite: '#4f6c9c',
      wood: '#34405e',
      grass: '#2a5a6a',
      grassDark: '#1f4a5a',
      soil: '#23304f',
      sand: '#56709e',
      paving: '#4c6a9c',
      road: '#1b2848',
      rail: '#1a2440',
      metal: '#5a6a90',
      screenFrame: '#0c0e18',
      leaf: '#1e4f5a',
      bloom: '#8a3a48',
      trunk: '#2a3048',
      shirtA: '#2a5a9a',
      shirtB: '#2f6a6a',
      shirtC: '#7a4a7a',
      trousers: '#1a1f36',
      hiVis: '#ffae4a',
      rig: '#10121c',
      window: '#ffc26a',
      led: '#6fffa0',
      white: '#b9cdf0',
      kawara: '#26304a',
      kawaraLine: '#141a2a',
      plaster: '#8fa6d0',
      woodDark: '#1e1e30',
      lantern: '#ff6a3a',
      noren: '#1c2c5a',
      blossom: '#b88aa6',
      paddy: '#2a4f86',
      stone: '#56709e',
      water: '#1f4a86',
      path: '#4c6a9c',
      mtn: '#1f3f68',
      mtnFar: '#2a4f80',
      forest: '#173a4a',
      vending: '#dde6ff',
    },
    sky: { top: '#061740', mid: '#163f84', horizon: '#3b70b8', glow: '#7fb2f2', sun: '#fff6e2' },
    sea: '#12305a',
    seaDeep: '#0b2248',
    foam: '#6f8fc0',
    outline: '#050a18',
    key: { color: '#a4c2ff', intensity: 1.7, position: [22, 30, -14] },
    ambient: { color: '#5a7ab8', intensity: 1.2 },
    glow: 1.35,
    fog: '#1f4580',
    sunDir: [0.35, 0.42, -0.84],
    sunSize: 0.9982,
    stars: true,
    cloud: { tint: '#39405a', opacity: 0.7 },
    lamps: 0.75,
    rim: { color: '#a8c8ff', strength: 0.75 },
    cumulus: { lit: '#6e8ec8', shade: '#27457e', rim: '#d6e6ff' },
  },
};
