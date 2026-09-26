// Turns the painted plates in art/plates/ into web-ready layers for /world (see art/plates/CHECKLIST.md).
//
//   npm run world:plates
//
// For each plate it:
//   1. checks the size: any aspect, at least 1920 wide (narrower images are skipped); crops to 16:9 around the centre,
//   2. for layers painted on flat magenta (#FF00FF): keys the magenta out with soft edges and removes
//      the magenta fringe ("despill"), unmixing the pink band along the cut edges, so nothing pink halos around the art,
//   3. scales every plate to exactly 3840 × 2160 (upscaling only if smaller; warns if it will look soft),
//   4. writes AVIF + WebP at several widths to public/world/plates/,
//   5. writes content/world-plates.json, which tells the page which plates exist.
// Missing plates are fine: the page falls back to the code-drawn village for anything not supplied.

import { readdir, mkdir, writeFile, stat } from 'node:fs/promises';
import { join, parse, resolve } from 'node:path';
import sharp from 'sharp';

const ROOT = process.cwd();
// Source folder: art/plates by default; another folder can be passed for testing.
const SRC = resolve(ROOT, process.argv[2] ?? 'art/plates');
const OUT = join(ROOT, 'public/world/plates');
const MANIFEST = join(ROOT, 'content/world-plates.json');

/** The plates, back to front. `key`: painted on flat magenta, to be cut out. */
const LAYERS = [
  { id: 'sky', key: false },
  { id: 'land', key: true },
  { id: 'foreground', key: true },
];
const MOODS = ['day', 'night'];
const WIDTHS = [3840, 2560, 1600, 960];
const ASPECT = 16 / 9;
const TARGET = [3840, 2160];
/** Narrower images are skipped. */
const MIN_WIDTH = 1920;
/** Below this (after cropping), the upscale to 3840 visibly softens the painting: warn. */
const SHARP_WIDTH = 2560;

// Keying thresholds, as distance from magenta in the colour plane (Cb/Cr, 0–255 scale).
// Under INNER: fully transparent. Over OUTER: fully opaque. In between: soft edge.
const INNER = 42;
const OUTER = 88;
const KEY = rgbToCbCr(255, 0, 255);

function rgbToCbCr(r, g, b) {
  return [128 - 0.168736 * r - 0.331264 * g + 0.5 * b, 128 + 0.5 * r - 0.418688 * g - 0.081312 * b];
}

const smooth = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/** Magenta → alpha, with despill on everything near the key colour. Returns stats for warnings. */
function chromaKey(data, w) {
  let clear = 0;
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const [cb, cr] = rgbToCbCr(r, g, b);
    const d = Math.hypot(cb - KEY[0], cr - KEY[1]);
    const a = smooth(INNER, OUTER, d);
    if (a === 0) {
      clear++;
      data[i + 3] = 0;
      continue;
    }
    // Despill: pull red and blue down toward green where the pixel still leans magenta.
    if (d < OUTER + 30) {
      const m = Math.min(r, b);
      if (m > g) {
        const spill = (m - g) * (1 - smooth(OUTER - 10, OUTER + 30, d));
        data[i] = Math.max(0, r - spill);
        data[i + 2] = Math.max(0, b - spill);
      }
    }
    data[i + 3] = Math.round(a * data[i + 3]);
  }
  edgeDespill(data, w);
  return { clearShare: clear / (data.length / 4) };
}

/**
 * Image tools antialias and compress the art against the magenta, which leaves a band of pink along every cut
 * edge that is too far from pure magenta for the key to catch. For each pixel in that band, take the colour of the
 * nearest clean pixel further inside the art and remove only the magenta that was mixed into it, keeping its
 * brightness (unmixing in YCbCr). Pink things in the art, like blossom or flowers, keep their own pink.
 */
function edgeDespill(data, w) {
  const n = data.length / 4;
  const h = n / w;
  const band = Math.max(6, Math.round(w / 300));
  const FAR = 0xffff;
  // Distance to the nearest fully transparent pixel (two-pass city-block chamfer), capped at the band width.
  const dist = new Uint16Array(n).fill(band);
  for (let p = 0; p < n; p++) if (data[p * 4 + 3] === 0) dist[p] = 0;
  chamfer(dist, null, w, h);
  // Nearest clean pixel (at least `band` from the edge) for every pixel, and how far away it is.
  const dClean = new Uint16Array(n).fill(FAR);
  const src = new Int32Array(n).fill(-1);
  for (let p = 0; p < n; p++) {
    if (dist[p] >= band) {
      dClean[p] = 0;
      src[p] = p;
    }
  }
  chamfer(dClean, src, w, h);

  const kx = KEY[0] - 128;
  const ky = KEY[1] - 128;
  for (let p = 0; p < n; p++) {
    if (dist[p] === 0 || dist[p] >= band) continue;
    // Thin details with no clean interior nearby (a twig, a few petals) are left alone.
    if (src[p] < 0 || dClean[p] > band * 2) continue;
    const i = p * 4;
    const j = src[p] * 4;
    const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
    const y = 0.299 * r + 0.587 * g + 0.114 * b;
    const [cb, cr] = rgbToCbCr(r, g, b);
    const [fb, fr] = rgbToCbCr(data[j], data[j + 1], data[j + 2]);
    // The pixel's chroma ≈ clean chroma + t × (magenta − clean chroma): solve for t, then take that part out.
    const [ex, ey] = [kx - (fb - 128), ky - (fr - 128)];
    const t = Math.min(1, Math.max(0, ((cb - fb) * ex + (cr - fr) * ey) / (ex * ex + ey * ey)));
    if (t === 0) continue;
    const cb2 = cb - 128 - t * ex;
    const cr2 = cr - 128 - t * ey;
    data[i] = y + 1.402 * cr2;
    data[i + 1] = y - 0.344136 * cb2 - 0.714136 * cr2;
    data[i + 2] = y + 1.772 * cb2;
  }
}

/** Two-pass city-block distance transform in place; optionally carries along the index of the nearest seed. */
function chamfer(dist, src, w, h) {
  const step = (p, q) => {
    if (dist[q] + 1 < dist[p]) {
      dist[p] = dist[q] + 1;
      if (src) src[p] = src[q];
    }
  };
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const p = y * w + x;
      if (x > 0) step(p, p - 1);
      if (y > 0) step(p, p - w);
    }
  }
  for (let y = h - 1; y >= 0; y--) {
    for (let x = w - 1; x >= 0; x--) {
      const p = y * w + x;
      if (x < w - 1) step(p, p + 1);
      if (y < h - 1) step(p, p + w);
    }
  }
}

/** Are the corners magenta? (If not, the background probably isn't flat magenta.) */
function cornersLookKeyed(data, w) {
  const at = (x, y) => {
    const i = (y * w + x) * 4;
    const [cb, cr] = rgbToCbCr(data[i], data[i + 1], data[i + 2]);
    return Math.hypot(cb - KEY[0], cr - KEY[1]) < INNER;
  };
  // Four corners and the top centre; foreground art may legitimately cover one or two of them.
  const h = data.length / 4 / w;
  const pts = [
    [2, 2],
    [w - 3, 2],
    [Math.round(w / 2), 2],
    [2, h - 3],
    [w - 3, h - 3],
  ];
  return pts.filter(([x, y]) => at(x, y)).length;
}

async function findSource(id, mood) {
  const files = await readdir(SRC).catch(() => []);
  const hit = files.find((f) => parse(f).name.toLowerCase() === `${id}-${mood}` && /\.(png|jpe?g|webp)$/i.test(f));
  return hit ? join(SRC, hit) : null;
}

/**
 * Crops any aspect to 16:9 around the centre. The checklist centres the inn horizontally, with its roof at about
 * 38% and its base at about 78% of the height, so a centre crop keeps it unless the image is extremely wide or tall.
 */
function cropTo16x9(w, h) {
  const aspect = w / h;
  if (Math.abs(aspect - ASPECT) < 0.001) return { left: 0, top: 0, width: w, height: h };
  const width = aspect > ASPECT ? Math.round(h * ASPECT) : w;
  const height = aspect > ASPECT ? h : Math.round(w / ASPECT);
  return { left: Math.round((w - width) / 2), top: Math.round((h - height) / 2), width, height };
}

// Where the checklist puts the inn, as fractions of the painted image: x range, then y range (with some margin).
const INN_BAND = { x: [0.375, 0.625], y: [0.33, 0.82] };

async function processPlate(layer, mood, file, warnings) {
  const label = `${layer.id}-${mood}`;
  let img = sharp(file).rotate();
  const meta = await img.metadata();
  // EXIF rotation swaps the sides for portrait-tagged images.
  const [w, h] = (meta.orientation ?? 1) >= 5 ? [meta.height, meta.width] : [meta.width, meta.height];

  if (w < MIN_WIDTH) {
    warnings.push(`${label}: SKIPPED — only ${w} × ${h} px. It needs to be at least ${MIN_WIDTH} px wide (best: ${TARGET[0]} × ${TARGET[1]}).`);
    return null;
  }

  // 1. Crop to 16:9 around the centre.
  const crop = cropTo16x9(w, h);
  if (crop.width !== w || crop.height !== h) {
    img = img.extract(crop);
    const cut = crop.width < w ? `${Math.round((1 - crop.width / w) * 100)}% of the width` : `${Math.round((1 - crop.height / h) * 100)}% of the height`;
    console.log(`  ${label}: ${w} × ${h} → cropped to 16:9 around the centre, ${crop.width} × ${crop.height} (removed ${cut})`);
    const inX = crop.left / w <= INN_BAND.x[0] && (crop.left + crop.width) / w >= INN_BAND.x[1];
    const inY = crop.top / h <= INN_BAND.y[0] && (crop.top + crop.height) / h >= INN_BAND.y[1];
    if (layer.id === 'land' && !(inX && inY)) {
      warnings.push(`${label}: the ${w} × ${h} image is so far from 16:9 that the centre crop may cut the inn's ${inX ? 'roof or base' : 'sides'}. Check the screenshots, or regenerate at 16:9.`);
    }
  }

  // 2. Key out the magenta at the source resolution (before any upscaling, so edges are cut from real pixels).
  let pipeline;
  if (layer.key) {
    const { data, info } = await img.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const corners = cornersLookKeyed(data, info.width);
    if (corners < 2) warnings.push(`${label}: the top corners aren't flat magenta — was it generated on #FF00FF?`);
    const { clearShare } = chromaKey(data, info.width);
    if (clearShare < 0.05) warnings.push(`${label}: almost nothing was keyed out (${(clearShare * 100).toFixed(1)}%).`);
    pipeline = () => sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } });
    console.log(`  ${label}: keyed, ${(clearShare * 100).toFixed(0)}% transparent`);
  } else {
    const buf = await img.removeAlpha().toBuffer();
    pipeline = () => sharp(buf);
  }

  // 3. Every plate ends up exactly 3840 × 2160, so all layers line up: upscaled only if smaller, scaled down if larger.
  const factor = TARGET[0] / crop.width;
  if (factor > 1) {
    if (crop.width < SHARP_WIDTH) {
      warnings.push(
        `${label}: upscaled ${factor.toFixed(1)}× (from ${crop.width} px wide after cropping). It will look soft on large and high-resolution screens — upscale it in your image tool to ${TARGET[0]} × ${TARGET[1]} and add it again.`,
      );
    } else {
      console.log(`  ${label}: upscaled ${factor.toFixed(2)}× to ${TARGET[0]} px wide (from ${crop.width})`);
    }
  }
  // Kept as raw pixels (lossless) between steps.
  const master = await pipeline().resize({ width: TARGET[0], height: TARGET[1], fit: 'fill', kernel: 'lanczos3' }).raw().toBuffer({ resolveWithObject: true });

  // 4. Web files at each width.
  let bytes = 0;
  for (const width of WIDTHS) {
    const base = join(OUT, `${label}-${width}`);
    const resized = () => sharp(master.data, { raw: master.info }).resize({ width });
    await resized().avif({ quality: layer.key ? 58 : 52, effort: 4 }).toFile(`${base}.avif`);
    await resized().webp({ quality: 80, alphaQuality: 90 }).toFile(`${base}.webp`);
    bytes += (await stat(`${base}.avif`)).size;
  }
  console.log(`  ${label}: ${WIDTHS.join(', ')} px (AVIF total ${(bytes / 1024).toFixed(0)} KB)`);
  return { widths: WIDTHS, aspect: w / h };
}

async function main() {
  await mkdir(OUT, { recursive: true });
  const manifest = { size: TARGET, plates: {} };
  const warnings = [];
  const aspects = { day: {}, night: {} };
  let found = 0;
  let written = 0;
  for (const layer of LAYERS) {
    for (const mood of MOODS) {
      const file = await findSource(layer.id, mood);
      if (!file) continue;
      found++;
      const done = await processPlate(layer, mood, file, warnings);
      if (!done) continue;
      written++;
      manifest.plates[layer.id] ??= {};
      manifest.plates[layer.id][mood] = done.widths;
      aspects[mood][layer.id] = done.aspect;
    }
  }
  // Plates of one mood are cropped independently, so they only line up if they started at the same shape.
  for (const mood of MOODS) {
    const list = Object.entries(aspects[mood]);
    const [min, max] = [Math.min(...list.map((e) => e[1])), Math.max(...list.map((e) => e[1]))];
    if (list.length > 1 && max / min > 1.01) {
      warnings.push(`The ${mood} plates have different shapes (${list.map(([id, a]) => `${id} ${a.toFixed(2)}:1`).join(', ')}), so after cropping they may not line up. Generate them at the same size.`);
    }
  }
  await writeFile(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`);
  if (!found) console.log(`No plates found in ${SRC} — the page keeps the code-drawn village.`);
  const missing = ['sky-day', 'land-day', 'foreground-day'].filter((n) => {
    const [id, mood] = n.split('-');
    return !manifest.plates[id]?.[mood];
  });
  if (found && missing.length) warnings.push(`Missing required plates: ${missing.join(', ')}. The page needs sky-day and land-day at least.`);
  for (const w of warnings) console.warn(`⚠ ${w}`);
  const skipped = found - written;
  console.log(`Wrote ${MANIFEST.replace(`${ROOT}/`, '')} (${written} plate${written === 1 ? '' : 's'}${skipped ? `; ${skipped} skipped` : ''}).`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
