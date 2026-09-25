// World colours (WORLD.md §2.2). Built from the site tokens so the town and the UI read as one product.
// "day" = golden hour (light theme), "night" = night shift (dark theme), "dusk" = the homepage hero (always dark).

export type Mood = 'day' | 'night' | 'dusk';

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
  | 'white';

type Palette = {
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
  },
};
