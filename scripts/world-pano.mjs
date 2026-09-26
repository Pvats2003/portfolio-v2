// Builds the 360° panoramas for /world as cube faces (six square images per viewpoint), which the viewer shows as a
// CSS 3D cube: no WebGL, no 3D library.
//
//   npm run world:pano
//
// For each viewpoint in content/world-pano-spots.json:
//   - if art/pano/<spot>.(jpg|png|webp) exists, it's treated as an equirectangular 360° image (2:1, e.g. 8192 × 4096)
//     and cut into cube faces (turned by the viewpoint's optional `rotate`, in degrees, so the inn is straight ahead);
//   - if art/pano/<spot>-front/-right/-back/-left.(png|jpg|webp) exist (four square 90° views: facing the inn, then
//     turning right each time), they're stitched into the cube with blended seams, a painted sky overhead and grass
//     underfoot (scripts/pano-stitch.mjs; the free route with Gemini, see art/pano/README.md). Every view is checked for
//     Gemini's visible watermark first; if one has it, the script names the file and stops (--allow-watermark skips this);
//   - otherwise a STAND-IN is painted from the land plate (public/world/plates/land-day-3840.webp): the painting
//     wrapped around you four times (mirrored every other quarter so the edges meet), a gradient sky with soft clouds
//     above it and the grass extended below. Obviously fake; it's there so the viewer can be judged before the art.
// Faces are written to public/world/pano/<spot>/<face>-<size>.webp (faces: f r b l u d), plus a night version of each
// (<face>-<size>-night.webp: blue moonlight, darker starry sky) for the dark theme, and listed in
// content/world-pano.json.
import { mkdir, readdir, readFile, stat, writeFile } from 'node:fs/promises';
import { join, parse } from 'node:path';
import sharp from 'sharp';
import { findSparkle, stitchViews } from './pano-stitch.mjs';

const ROOT = process.cwd();
const SPOTS = JSON.parse(await readFile(join(ROOT, 'content/world-pano-spots.json'), 'utf8'));
const OUT = join(ROOT, 'public/world/pano');
const MANIFEST = join(ROOT, 'content/world-pano.json');
const PLATE = join(ROOT, 'public/world/plates/land-day-3840.webp');
const FACE = 2048;
const SIZES = [2048, 1536];
const FACES = ['f', 'r', 'b', 'l', 'u', 'd'];
const VIEWS = ['front', 'right', 'back', 'left'];
const { PI, atan2, asin, tan, cos, hypot, round, min, max, exp } = Math;

/** Direction (X right, Y up, Z back; forward is −Z) for pixel (u, v) in −1…1 on each face, matching the CSS cube. */
function dirOf(face, u, v) {
  switch (face) {
    case 'f': return [u, -v, -1];
    case 'r': return [1, -v, u];
    case 'b': return [-u, -v, 1];
    case 'l': return [-1, -v, -u];
    case 'u': return [u, 1, -v];
    default: return [u, -1, v];
  }
}

async function rgba(file) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return { data, w: info.width, h: info.height };
}

/** Bilinear sample of an RGBA image at (x, y) in pixels; returns [r, g, b, a] (0–255). */
function sample(img, x, y) {
  const x0 = max(0, min(img.w - 2, Math.floor(x)));
  const y0 = max(0, min(img.h - 2, Math.floor(y)));
  const fx = min(1, max(0, x - x0));
  const fy = min(1, max(0, y - y0));
  const out = [0, 0, 0, 0];
  for (let c = 0; c < 4; c++) {
    const i = (y0 * img.w + x0) * 4 + c;
    const a = img.data[i] * (1 - fx) + img.data[i + 4] * fx;
    const b = img.data[i + img.w * 4] * (1 - fx) + img.data[i + img.w * 4 + 4] * fx;
    out[c] = a * (1 - fy) + b * fy;
  }
  return out;
}

const mix = (a, b, t) => a.map((x, i) => x + (b[i] - x) * t);
const smooth = (a, b, x) => {
  const t = min(1, max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

// ---- stand-in painter ----
const HORIZON = [246, 226, 194];
const MID = [185, 208, 224];
const ZENITH = [111, 159, 210];
const CLOUDS = [
  [-62, 26, 26, 6], [8, 33, 34, 7], [78, 22, 22, 5], [148, 30, 30, 7], [-128, 21, 24, 5], [40, 52, 40, 9], [-20, 62, 50, 10], [115, 48, 34, 8],
];
function sky(lon, lat) {
  const d = (lat * 180) / PI;
  let c = d < 25 ? mix(HORIZON, MID, smooth(0, 25, d)) : mix(MID, ZENITH, smooth(25, 90, d));
  for (const [cl, ct, sl, st] of CLOUDS) {
    let dl = (lon * 180) / PI - cl;
    dl = ((dl + 540) % 360) - 180;
    const k = exp(-((dl / sl) ** 2 + ((d - ct) / st) ** 2) * 2.2);
    if (k > 0.01) c = mix(c, [255, 251, 243], k * 0.75);
  }
  return c;
}
let groundBase = null; // per plate column: the average colour of the painting's bottom rows, blurred sideways
function prepGround(plate) {
  const cols = new Array(plate.w);
  for (let x = 0; x < plate.w; x++) {
    let r = 0, g = 0, b = 0;
    for (let y = plate.h - 60; y < plate.h; y++) {
      const i = (y * plate.w + x) * 4;
      r += plate.data[i]; g += plate.data[i + 1]; b += plate.data[i + 2];
    }
    cols[x] = [r / 60, g / 60, b / 60];
  }
  const R = 520;
  groundBase = cols.map((_, x) => {
    const acc = [0, 0, 0];
    let n = 0;
    for (let k = -R; k <= R; k += 8) {
      const c = cols[max(0, min(plate.w - 1, x + k))];
      acc[0] += c[0]; acc[1] += c[1]; acc[2] += c[2]; n++;
    }
    return acc.map((v) => v / n);
  });
}
const FAR_GROUND = [84, 110, 60];
const grain = (x, y) => {
  const h = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return h - Math.floor(h);
};
function standInColour(plate, view, lon, lat) {
  const k = round(lon / (PI / 2));
  const mirrored = ((k % 2) + 2) % 2 === 1;
  const lonL = lon - (k * PI) / 2;
  let u = tan(lonL);
  if (mirrored) u = -u;
  const vf = lat <= -PI / 2 + 1e-6 ? 1e6 : -tan(lat) / cos(lonL);
  let px = view.cx + u / (2 * view.zoom);
  const py = view.cy + vf / (1.125 * view.zoom);
  if (px < 0) px = -px;
  if (px > 1) px = 2 - px;
  if (py < 0) return [...sky(lon, lat), 1];
  if (py > 1) {
    // Below the painting: its bottom colours, heavily blurred, fading into plain grass, with a little grain.
    const base = groundBase[max(0, min(plate.w - 1, round(px * (plate.w - 1))))];
    const edge = sample(plate, px * (plate.w - 1), plate.h - 1).slice(0, 3);
    const near = mix(edge, base, smooth(0, 0.015 * view.zoom, py - 1));
    const n = (grain(round(lon * 900), round(lat * 900)) - 0.5) * 14;
    return [...mix(near, FAR_GROUND, smooth(0.02, 0.7, py - 1)).map((x) => x + n), 0];
  }
  const s = sample(plate, px * (plate.w - 1), py * (plate.h - 1));
  return [...mix(sky(lon, lat), s.slice(0, 3), s[3] / 255), 1 - s[3] / 255];
}

// ---- equirectangular → cube ----
function equirectColour(img, lon, lat) {
  const x = (lon / (2 * PI) + 0.5) * img.w;
  const y = (0.5 - lat / PI) * img.h;
  return sample(img, ((x % img.w) + img.w) % img.w, y);
}

// ---- night: the same faces in blue moonlight, with a darker, starry sky ----
const NIGHT_LOW = [118, 152, 226]; // moonlight multiply near the ground…
const NIGHT_HIGH = [78, 110, 196]; // …and higher up
const SKY_HORIZON = [44, 66, 124];
const SKY_ZENITH = [10, 20, 54];
/** How sky-like a pixel is when we don't know (real panoramas, stitched views): high up, bright and bluish. */
function guessSky(c, latDeg) {
  const [r, g, b] = c;
  const bright = (r + g + b) / 3;
  return smooth(4, 16, latDeg) * smooth(120, 170, bright) * smooth(-10, 12, b - r);
}
function nightColour(c, lon, lat, skyness) {
  const d = (lat * 180) / PI;
  const lum = 0.3 * c[0] + 0.59 * c[1] + 0.11 * c[2];
  const tint = mix(NIGHT_LOW, NIGHT_HIGH, smooth(-10, 50, d));
  const land = c.map((x, i) => (x + (lum - x) * 0.35) * (tint[i] / 255) * 0.92);
  // Night sky: deep blue, a trace of the day's clouds, and a sprinkle of stars well above the horizon.
  let skyC = mix(SKY_HORIZON, SKY_ZENITH, smooth(0, 70, d));
  skyC = mix(skyC, land, 0.22);
  const cell = grain(round(lon * 1400), round(lat * 1400));
  if (d > 14 && cell > 0.9978) skyC = mix(skyC, [236, 240, 255], 0.55 + (cell - 0.9978) * 200);
  return mix(land, skyC, skyness);
}

async function writeFaces(spot, faces, skyMasks = null) {
  const dir = join(OUT, spot);
  await mkdir(dir, { recursive: true });
  let bytes = 0;
  let nightBytes = 0;
  for (const face of FACES) {
    const day = faces[face];
    const night = Buffer.alloc(day.length);
    for (let j = 0; j < FACE; j++) {
      const v = ((j + 0.5) / FACE) * 2 - 1;
      for (let i = 0; i < FACE; i++) {
        const u = ((i + 0.5) / FACE) * 2 - 1;
        const [X, Y, Z] = dirOf(face, u, v);
        const lon = atan2(X, -Z);
        const lat = asin(Y / hypot(X, Y, Z));
        const o = (j * FACE + i) * 3;
        const c = [day[o], day[o + 1], day[o + 2]];
        const sky = skyMasks ? skyMasks[face][j * FACE + i] : guessSky(c, (lat * 180) / PI);
        const n = nightColour(c, lon, lat, sky);
        night[o] = n[0]; night[o + 1] = n[1]; night[o + 2] = n[2];
      }
    }
    for (const size of SIZES) {
      for (const [buf, suffix] of [[day, ''], [night, '-night']]) {
        const file = join(dir, `${face}-${size}${suffix}.webp`);
        await sharp(buf, { raw: { width: FACE, height: FACE, channels: 3 } }).resize(size, size).webp({ quality: 82, effort: 5 }).toFile(file);
        if (size !== SIZES[0]) continue;
        if (suffix) nightBytes += (await stat(file)).size;
        else bytes += (await stat(file)).size;
      }
    }
  }
  return [bytes, nightBytes];
}

/** Renders all six faces from a colour-by-direction function (lon, lat in radians); a 4th channel, if given, is how much of the pixel is sky. */
async function build(spot, colourAt) {
  const faces = {};
  const masks = {};
  let hasMask = true;
  for (const face of FACES) {
    const buf = Buffer.alloc(FACE * FACE * 3);
    const mask = new Float32Array(FACE * FACE);
    for (let j = 0; j < FACE; j++) {
      const v = ((j + 0.5) / FACE) * 2 - 1;
      for (let i = 0; i < FACE; i++) {
        const u = ((i + 0.5) / FACE) * 2 - 1;
        const [X, Y, Z] = dirOf(face, u, v);
        const c = colourAt(atan2(X, -Z), asin(Y / hypot(X, Y, Z)));
        const o = (j * FACE + i) * 3;
        buf[o] = c[0]; buf[o + 1] = c[1]; buf[o + 2] = c[2];
        if (c.length > 3) mask[j * FACE + i] = c[3];
        else hasMask = false;
      }
    }
    faces[face] = buf;
    masks[face] = mask;
  }
  return writeFaces(spot, faces, hasMask ? masks : null);
}

const artFiles = await readdir(join(ROOT, 'art/pano')).catch(() => []);

// Safety net: a Gemini view with the visible watermark would put a sparkle in the finished 360° (low down, near each
// seam), so check every stitched view's bottom-right corner first and stop before writing anything.
// --allow-watermark skips the check (for a false alarm).
if (!process.argv.includes('--allow-watermark')) {
  const flagged = [];
  for (const spot of Object.keys(SPOTS)) {
    for (const v of VIEWS) {
      const f = artFiles.find((n) => parse(n).name.toLowerCase() === `${spot}-${v}` && /\.(jpe?g|png|webp)$/i.test(n));
      if (!f) continue;
      const hit = await findSparkle(join(ROOT, 'art/pano', f));
      if (hit.found) flagged.push(`  ✖ art/pano/${f}: the Gemini watermark (sparkle) at about ${round(hit.x * 100)}% across, ${round(hit.y * 100)}% down.`);
    }
  }
  if (flagged.length) {
    console.error(`Stopped: ${flagged.length === 1 ? 'this view has' : 'these views have'} the visible Gemini watermark, which would show in the 360°:\n${flagged.join('\n')}`);
    console.error('Export the view again without it (Google AI Studio doesn\'t add it), replace the file, and run again.');
    console.error('Nothing was written. If it\'s a false alarm, run: node scripts/world-pano.mjs --allow-watermark');
    process.exit(1);
  }
}
const manifest = { sizes: SIZES, spots: {} };
let plate = null;
for (const [spot, cfg] of Object.entries(SPOTS)) {
  const find = (name) => artFiles.find((f) => parse(f).name.toLowerCase() === name && /\.(jpe?g|png|webp)$/i.test(f));
  const src = find(spot);
  const views = Object.fromEntries(VIEWS.map((v) => [v, find(`${spot}-${v}`)]));
  const haveViews = VIEWS.filter((v) => views[v]);
  let bytes;
  if (!src && haveViews.length === 4) {
    // Four square views (inn ahead, right, behind, left) stitched into a cube: scripts/pano-stitch.mjs.
    const faces = await stitchViews(Object.fromEntries(VIEWS.map((v) => [v, join(ROOT, 'art/pano', views[v])])), FACE, (m) => console.warn(`⚠ ${m}`));
    bytes = await writeFaces(spot, faces);
    manifest.spots[spot] = { source: `4 views (${VIEWS.map((v) => views[v]).join(', ')})` };
  } else if (src) {
    const img = await rgba(join(ROOT, 'art/pano', src));
    if (Math.abs(img.w / img.h - 2) > 0.02) console.warn(`⚠ ${src}: ${img.w} × ${img.h} isn't 2:1 — is it an equirectangular 360° image?`);
    if (img.w < 4096) console.warn(`⚠ ${src}: only ${img.w} px wide; 360° images need about 8192 × 4096 to look sharp.`);
    // `rotate` (degrees, optional): turns the panorama so the inn sits straight ahead; + turns the view right.
    const turn = ((cfg.rotate ?? 0) * PI) / 180;
    bytes = await build(spot, (lon, lat) => equirectColour(img, lon + turn, lat));
    manifest.spots[spot] = { source: src };
  } else {
    if (haveViews.length) console.warn(`⚠ ${spot}: only ${haveViews.join(', ')} of the four views (front, right, back, left); using the stand-in until all four are there.`);
    if (!plate) {
      plate = await rgba(PLATE);
      prepGround(plate);
    }
    bytes = await build(spot, (lon, lat) => standInColour(plate, cfg.standIn, lon, lat));
    manifest.spots[spot] = { source: 'stand-in' };
  }
  manifest.spots[spot].night = true;
  console.log(`  ${spot}: ${manifest.spots[spot].source}, six ${SIZES[0]} px faces = ${(bytes[0] / 1024).toFixed(0)} KB day, ${(bytes[1] / 1024).toFixed(0)} KB night`);
}
await writeFile(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Wrote ${MANIFEST.replace(`${ROOT}/`, '')}.`);
