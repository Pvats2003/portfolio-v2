// Turns the painted plates in art/plates/ into web-ready layers for /world (see art/plates/CHECKLIST.md).
//
//   npm run world:plates
//
// For each plate it:
//   1. checks the size (16:9, at least 1920 wide; center-crops to 16:9 if slightly off),
//   2. for layers painted on flat magenta (#FF00FF): keys the magenta out with soft edges and removes
//      the magenta fringe ("despill") so nothing pink halos around the art,
//   3. writes AVIF + WebP at several widths to public/world/plates/,
//   4. writes content/world-plates.json, which tells the page which plates exist.
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
function chromaKey(data) {
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
  return { clearShare: clear / (data.length / 4) };
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

async function processPlate(layer, mood, file, warnings) {
  let img = sharp(file).rotate();
  const meta = await img.metadata();
  let { width: w, height: h } = meta;
  const label = `${layer.id}-${mood}`;
  // Center-crop to exactly 16:9 if the tool gave something close.
  const aspect = w / h;
  if (Math.abs(aspect - ASPECT) / ASPECT > 0.12) warnings.push(`${label}: aspect ${aspect.toFixed(3)} is far from 16:9 — cropping, but the framing may suffer.`);
  if (Math.abs(aspect - ASPECT) > 0.001) {
    const cw = aspect > ASPECT ? Math.round(h * ASPECT) : w;
    const ch = aspect > ASPECT ? h : Math.round(w / ASPECT);
    img = img.extract({ left: Math.round((w - cw) / 2), top: Math.round((h - ch) / 2), width: cw, height: ch });
    w = cw;
    h = ch;
  }
  if (w < 1920) warnings.push(`${label}: only ${w}px wide — upscale to 3840 × 2160 in your image tool for a sharp result.`);

  let pipeline;
  if (layer.key) {
    const { data, info } = await img.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const corners = cornersLookKeyed(data, info.width);
    if (corners < 2) warnings.push(`${label}: the top corners aren't flat magenta — was it generated on #FF00FF?`);
    const { clearShare } = chromaKey(data);
    if (clearShare < 0.05) warnings.push(`${label}: almost nothing was keyed out (${(clearShare * 100).toFixed(1)}%).`);
    pipeline = () => sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } });
    console.log(`  ${label}: keyed, ${(clearShare * 100).toFixed(0)}% transparent`);
  } else {
    const buf = await img.removeAlpha().toBuffer();
    pipeline = () => sharp(buf);
  }

  const widths = WIDTHS.filter((x) => x <= Math.max(w, 960));
  let bytes = 0;
  for (const width of widths) {
    const base = join(OUT, `${label}-${width}`);
    const resized = () => pipeline().resize({ width, withoutEnlargement: true });
    await resized().avif({ quality: layer.key ? 58 : 52, effort: 4 }).toFile(`${base}.avif`);
    await resized().webp({ quality: 80, alphaQuality: 90 }).toFile(`${base}.webp`);
    bytes += (await stat(`${base}.avif`)).size;
  }
  console.log(`  ${label}: ${widths.join(', ')} px (AVIF total ${(bytes / 1024).toFixed(0)} KB)`);
  return widths;
}

async function main() {
  await mkdir(OUT, { recursive: true });
  const manifest = { size: [3840, 2160], plates: {} };
  const warnings = [];
  let found = 0;
  for (const layer of LAYERS) {
    for (const mood of MOODS) {
      const file = await findSource(layer.id, mood);
      if (!file) continue;
      found++;
      const widths = await processPlate(layer, mood, file, warnings);
      manifest.plates[layer.id] ??= {};
      manifest.plates[layer.id][mood] = widths;
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
  console.log(`Wrote ${MANIFEST.replace(`${ROOT}/`, '')} (${found} plate${found === 1 ? '' : 's'}).`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
