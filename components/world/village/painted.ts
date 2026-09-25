// Painted layers for look-dev frames B and C: the village with the inn, golden hour (and a rich blue night).
// SVG strings on a 1600 × 1000 canvas, built from a palette. B stacks them as DOM layers with parallax;
// C rasterises sky, clouds and mountains into textures behind the 3D village.
// Every shape is drawn here in code (circles, curves, gradients). No traced or borrowed artwork.

export type PaintMood = 'day' | 'night';

export type PaintPalette = {
  sky: [string, string, string, string];
  sunGlow: string;
  sun: string;
  night: boolean;
  streak: string;
  cloudLit: string;
  cloudShade: string;
  cloudDeep: string;
  mtnFarLit: string;
  mtnFarShade: string;
  mtnLit: string;
  mtnShade: string;
  mtnRidge: string;
  haze: string;
  forest: string;
  forestLit: string;
  forestShade: string;
  grass: string;
  grassLit: string;
  grassShade: string;
  blossom: string;
  blossomLit: string;
  blossomShade: string;
  trunk: string;
  fence: string;
  fenceShade: string;
};

export const paint: Record<PaintMood, PaintPalette> = {
  day: {
    sky: ['#3574c8', '#8cc2e8', '#ffdcaa', '#ffba78'],
    sunGlow: '#ffb45c',
    sun: '#fff5da',
    night: false,
    streak: '#ffffff',
    cloudLit: '#fff6e6',
    cloudShade: '#ebbbb2',
    cloudDeep: '#cf97a2',
    mtnFarLit: '#a9bfd0',
    mtnFarShade: '#8298b4',
    mtnLit: '#94b2a4',
    mtnShade: '#62818c',
    mtnRidge: '#50707e',
    haze: '#ffd7a8',
    forest: '#3c7646',
    forestLit: '#72a852',
    forestShade: '#2c5a3c',
    grass: '#8fc052',
    grassLit: '#c2e070',
    grassShade: '#5f9440',
    blossom: '#f6b4c6',
    blossomLit: '#ffe2ea',
    blossomShade: '#e08aa6',
    trunk: '#5a3a2c',
    fence: '#8a6a4a',
    fenceShade: '#65492f',
  },
  night: {
    sky: ['#061433', '#153c80', '#3a6fb6', '#5186c8'],
    sunGlow: '#8fbaf4',
    sun: '#fff6e2',
    night: true,
    streak: '#a8c8ff',
    cloudLit: '#6f8fc8',
    cloudShade: '#2c4a84',
    cloudDeep: '#213a6c',
    mtnFarLit: '#3a5f98',
    mtnFarShade: '#284a80',
    mtnLit: '#34588c',
    mtnShade: '#213f6c',
    mtnRidge: '#1a335c',
    haze: '#4a7ac0',
    forest: '#163852',
    forestLit: '#24506e',
    forestShade: '#0f2a40',
    grass: '#24506a',
    grassLit: '#3a6a88',
    grassShade: '#173c54',
    blossom: '#a47ea6',
    blossomLit: '#d6b6d8',
    blossomShade: '#6e5484',
    trunk: '#1e1e30',
    fence: '#34405e',
    fenceShade: '#232c46',
  },
};

export const W = 1600;
export const H = 1000;
const svg = (body: string, defs = '') =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" preserveAspectRatio="xMidYMax slice"><defs>${defs}</defs>${body}</svg>`;

export function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const f = (n: number) => Math.round(n * 10) / 10;

// ---------- Sky: gradient, low sun (or moon and stars), dry-brush streaks ----------
export function skySvg(p: PaintPalette) {
  const [a, b, c, d] = p.sky;
  const sunX = p.night ? 1250 : 1290;
  const sunY = p.night ? 190 : 560;
  const r = rng(5);
  const stars = p.night
    ? Array.from({ length: 120 }, () => `<circle cx="${f(r() * W)}" cy="${f(r() * 540)}" r="${f(0.7 + r() * 1.5)}" fill="#fff" opacity="${f(0.35 + r() * 0.65)}"/>`).join('')
    : '';
  const streaks = [
    [240, 150, 360, 9],
    [640, 110, 280, 7],
    [980, 200, 420, 11],
    [1400, 140, 250, 7],
    [420, 290, 330, 8],
  ]
    .map(([x, y, w, h]) => `<ellipse cx="${x}" cy="${y}" rx="${w}" ry="${h}" fill="${p.streak}" opacity="${p.night ? 0.1 : 0.16}"/>`)
    .join('');
  const defs = `
    <linearGradient id="sk" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${a}"/><stop offset="0.44" stop-color="${b}"/><stop offset="0.78" stop-color="${c}"/><stop offset="1" stop-color="${d}"/>
    </linearGradient>
    <radialGradient id="sg" cx="${sunX}" cy="${sunY}" r="${p.night ? 300 : 600}" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="${p.sunGlow}" stop-opacity="${p.night ? 0.5 : 0.9}"/><stop offset="1" stop-color="${p.sunGlow}" stop-opacity="0"/>
    </radialGradient>`;
  return svg(
    `<rect width="${W}" height="${H}" fill="url(#sk)"/>${stars}${streaks}<rect width="${W}" height="${H}" fill="url(#sg)"/>` +
      `<circle cx="${sunX}" cy="${sunY}" r="${p.night ? 58 : 74}" fill="${p.sun}" opacity="0.25"/>` +
      `<circle cx="${sunX}" cy="${sunY}" r="${p.night ? 38 : 50}" fill="${p.sun}"/>` +
      (p.night ? `<circle cx="${sunX + 11}" cy="${sunY - 8}" r="8" fill="#e6dfcc" opacity="0.6"/><circle cx="${sunX - 13}" cy="${sunY + 11}" r="6" fill="#e6dfcc" opacity="0.5"/>` : ''),
    defs,
  );
}

// ---------- Clouds: cumulus in two cel tones (shade body, lit tops offset toward the sun) ----------
type Puff = [number, number, number];

function heap(cx: number, baseY: number, w: number, h: number, seed: number): Puff[] {
  const r = rng(seed);
  const out: Puff[] = [];
  const rows = 5;
  for (let k = 0; k < rows; k++) {
    const t = k / (rows - 1);
    const rowW = w * (1 - t * 0.6);
    const n = Math.max(2, Math.round(7 - t * 5));
    const rad = (w / 7) * (1 + t * 0.4);
    for (let i = 0; i < n; i++) {
      out.push([cx - rowW / 2 + (rowW * (i + 0.5)) / n + (r() - 0.5) * rad * 0.5, baseY - t * h * 0.75 - r() * rad * 0.3, rad * (0.8 + r() * 0.4)]);
    }
  }
  return out;
}

function cloud(id: string, puffs: Puff[], baseY: number, p: PaintPalette) {
  const circles = (dx: number, dy: number, fill: string) =>
    puffs.map(([x, y, r]) => `<circle cx="${f(x + dx * r)}" cy="${f(y + dy * r)}" r="${f(r)}" fill="${fill}"/>`).join('');
  const clip = `<clipPath id="${id}">${puffs.map(([x, y, r]) => `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}"/>`).join('')}</clipPath>`;
  const flat = `<clipPath id="${id}b"><rect x="0" y="0" width="${W}" height="${baseY + 18}"/></clipPath>`;
  return {
    defs: clip + flat,
    body:
      `<g clip-path="url(#${id}b)">` +
      circles(0, 0, p.cloudShade) +
      `<g clip-path="url(#${id})">${circles(0.16, -0.24, p.cloudLit)}` +
      `<rect x="0" y="${baseY - 26}" width="${W}" height="60" fill="${p.cloudDeep}" opacity="0.5"/></g></g>`,
  };
}

export function cloudsSvg(p: PaintPalette) {
  const parts = [
    cloud('c1', heap(290, 430, 460, 320, 3), 430, p),
    cloud('c2', heap(1010, 380, 520, 360, 7), 380, p),
    cloud('c3', heap(1500, 440, 220, 150, 11), 440, p),
    cloud('c4', heap(720, 500, 980, 70, 19), 500, p),
  ];
  return svg(parts.map((x) => x.body).join(''), parts.map((x) => x.defs).join(''));
}

// ---------- Mountains: a big mountain lit from the sun side, a far ridge, atmospheric haze at the base ----------
export function mountainsSvg(p: PaintPalette) {
  const far =
    `<path d="M-60 610 C 300 560, 700 470, 1000 400 Q 1180 330 1260 350 C 1420 420, 1560 470, 1680 520 L1680 700 L-60 700 Z" fill="${p.mtnFarShade}"/>` +
    `<path d="M1180 342 Q 1230 332 1260 350 C 1420 420, 1560 470, 1680 520 L1680 700 L1240 700 C 1260 560, 1200 440, 1180 342 Z" fill="${p.mtnFarLit}"/>`;
  const main =
    `<path d="M-80 640 C 140 540, 380 300, 540 252 Q 566 243 594 255 C 770 330, 990 520, 1180 640 Z" fill="${p.mtnShade}"/>` +
    // lit (sun-side) face, with a jagged ridge line down the middle
    `<path d="M566 246 Q 580 247 594 255 C 770 330, 990 520, 1180 640 L 760 640 L 720 560 L 690 500 L 660 440 L 640 380 L 610 320 L 588 280 Z" fill="${p.mtnLit}"/>` +
    [
      'M540 262 Q 500 360 430 470',
      'M520 290 Q 470 400 360 520',
      'M620 300 Q 650 380 700 470',
      'M660 330 Q 720 420 820 520',
      'M590 270 Q 600 330 620 400',
    ]
      .map((d) => `<path d="${d}" fill="none" stroke="${p.mtnRidge}" stroke-width="5" stroke-linecap="round" opacity="0.55"/>`)
      .join('');
  const haze = `<rect x="0" y="520" width="${W}" height="140" fill="url(#hz)"/>`;
  const defs = `<linearGradient id="hz" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.haze}" stop-opacity="0"/><stop offset="1" stop-color="${p.haze}" stop-opacity="${p.night ? 0.35 : 0.55}"/></linearGradient>`;
  return svg(far + main + haze, defs);
}

// ---------- Forest: a band of rounded canopies in front of the mountains, lit tops toward the sun ----------
export function forestSvg(p: PaintPalette) {
  const r = rng(13);
  let shade = '';
  let lit = '';
  for (let x = -40; x < W + 60; x += 46 + r() * 30) {
    const y = 600 + Math.sin(x / 190) * 14 + r() * 16;
    const rad = 34 + r() * 26;
    shade += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(rad)}"/>`;
    lit += `<circle cx="${f(x + rad * 0.28)}" cy="${f(y - rad * 0.3)}" r="${f(rad * 0.62)}"/>`;
  }
  return svg(
    `<rect x="-20" y="620" width="${W + 40}" height="${H - 620}" fill="${p.forestShade}"/>` +
      `<g fill="${p.forest}">${shade}</g><g fill="${p.forestLit}" opacity="0.8">${lit}</g>`,
  );
}

// ---------- Foreground: a cherry tree framing the left, a wooden fence, grass tufts ----------
function blossomCluster(cx: number, cy: number, rad: number, p: PaintPalette, seed: number) {
  const r = rng(seed);
  let base = '';
  let inner = '';
  let hi = '';
  for (let i = 0; i < 16; i++) {
    const a = r() * Math.PI * 2;
    const d = r() * rad;
    const x = cx + Math.cos(a) * d;
    const y = cy + Math.sin(a) * d * 0.7;
    const s = rad * (0.28 + r() * 0.22);
    base += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(s)}"/>`;
    inner += `<circle cx="${f(x + s * 0.08)}" cy="${f(y - s * 0.1)}" r="${f(s * 0.84)}"/>`;
    if (Math.cos(a) > -0.2 && Math.sin(a) < 0.3) hi += `<circle cx="${f(x + s * 0.25)}" cy="${f(y - s * 0.3)}" r="${f(s * 0.55)}"/>`;
  }
  return `<g fill="${p.blossomShade}">${base}</g><g fill="${p.blossom}">${inner}</g><g fill="${p.blossomLit}" opacity="0.85">${hi}</g>`;
}

function grassTuft(x: number, y: number, s: number, p: PaintPalette, seed: number) {
  const r = rng(seed);
  let d = '';
  for (let i = 0; i < 9; i++) {
    const bx = x + (r() - 0.5) * 40 * s;
    const h = (40 + r() * 50) * s;
    const lean = (r() - 0.3) * 26 * s;
    d += `M${f(bx - 4 * s)} ${y} Q${f(bx + lean * 0.4)} ${f(y - h * 0.6)} ${f(bx + lean)} ${f(y - h)} Q${f(bx + lean * 0.3 + 3 * s)} ${f(y - h * 0.5)} ${f(bx + 4 * s)} ${y} Z `;
  }
  return `<path d="${d}" fill="${p.grassShade}"/><path d="${d}" fill="${p.grassLit}" opacity="0.35" transform="translate(2 -2)"/>`;
}

export function foregroundSvg(p: PaintPalette) {
  const trunk =
    `<path d="M-30 1010 C 10 820, 40 640, 90 470 C 110 400, 150 330, 210 280 L 228 296 C 175 345, 140 410, 122 480 C 90 640, 70 830, 60 1010 Z" fill="${p.trunk}"/>` +
    `<path d="M112 430 C 170 380, 260 330, 380 300 L 384 314 C 270 346, 180 392, 124 446 Z" fill="${p.trunk}"/>` +
    `<path d="M150 340 C 150 260, 180 190, 240 130 L 252 140 C 196 200, 170 262, 166 336 Z" fill="${p.trunk}"/>`;
  const blossoms =
    blossomCluster(240, 120, 110, p, 1) +
    blossomCluster(90, 190, 120, p, 2) +
    blossomCluster(360, 250, 100, p, 3) +
    blossomCluster(180, 300, 90, p, 4) +
    blossomCluster(20, 360, 90, p, 5) +
    blossomCluster(460, 170, 70, p, 6);
  const fence =
    [30, 120, 210, 300].map((x) => `<rect x="${x}" y="850" width="14" height="120" fill="${p.fence}"/><rect x="${x}" y="850" width="5" height="120" fill="${p.fenceShade}"/>`).join('') +
    `<rect x="0" y="872" width="330" height="9" fill="${p.fence}"/><rect x="0" y="912" width="330" height="9" fill="${p.fence}"/>`;
  const tufts = grassTuft(80, 1000, 1.2, p, 7) + grassTuft(330, 1000, 0.9, p, 8) + grassTuft(1300, 1000, 1.1, p, 9) + grassTuft(1540, 1000, 1.3, p, 10);
  return svg(fence + trunk + blossoms + tufts);
}

export function paintedLayers(mood: PaintMood) {
  const p = paint[mood];
  return { sky: skySvg(p), clouds: cloudsSvg(p), mountains: mountainsSvg(p), forest: forestSvg(p), foreground: foregroundSvg(p) };
}
