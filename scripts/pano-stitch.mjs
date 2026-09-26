// Stitches four square views (facing the inn, then 90° right, behind, 90° left: each a 90° field of view) into the
// six faces of a cube-map panorama for /world. Used by world-pano.mjs when art/pano/<spot>-front/right/back/left exist.
//
// Four separately generated pictures never meet perfectly, so at each vertical seam it:
//   1. matches colour: works out, row by row, how far apart the two edges are (broadly, not pixel by pixel) and
//      shifts each picture half-way toward the other, fading the shift out over the outer 30% of each picture;
//   2. crossfades a narrow band (about 1.5°) either side of the seam so hard lines soften instead of snapping.
// The sky overhead is painted from the four pictures' top edges, blurred and blended into a zenith blue with a few
// soft clouds; the ground underfoot grows from their bottom edges into painted grass, with the dirt path running
// from the inn behind you if the front and back views stand on it.
import sharp from 'sharp';

const { min, max, abs, exp, floor, round, sin } = Math;
const smooth = (a, b, x) => {
  const t = min(1, max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
const mix3 = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];

/** Loads a view as float RGB at N × N; crops to square around the centre first if it isn't square. */
async function loadView(file, N, warn) {
  const img = sharp(file).rotate();
  const { width: w, height: h } = await img.metadata();
  if (abs(w / h - 1) > 0.02) warn(`${file.split('/').pop()}: ${w} × ${h} isn't square; cropping the middle square.`);
  if (min(w, h) < 1024) warn(`${file.split('/').pop()}: only ${min(w, h)} px; upscale to 2048 × 2048 (Upscayl 2×) for a sharp result.`);
  const s = min(w, h);
  const raw = await img
    .extract({ left: round((w - s) / 2), top: round((h - s) / 2), width: s, height: s })
    .resize(N, N, { kernel: 'lanczos3' })
    .removeAlpha()
    .raw()
    .toBuffer();
  return Float32Array.from(raw);
}

/** 1-D gaussian blur of a list of RGB triples (clamped ends). */
function blurProfile(p, sigma) {
  const r = Math.ceil(sigma * 2.5);
  const k = Array.from({ length: 2 * r + 1 }, (_, i) => exp(-(((i - r) / sigma) ** 2) / 2));
  const ks = k.reduce((a, b) => a + b, 0);
  return p.map((_, i) => {
    const acc = [0, 0, 0];
    for (let j = -r; j <= r; j++) {
      const q = p[min(p.length - 1, max(0, i + j))];
      const w = k[j + r];
      acc[0] += q[0] * w;
      acc[1] += q[1] * w;
      acc[2] += q[2] * w;
    }
    return acc.map((v) => v / ks);
  });
}

const px = (img, N, x, y) => {
  const i = (y * N + x) * 3;
  return [img[i], img[i + 1], img[i + 2]];
};

/** Average of `k` columns at the left or right edge, per row. */
function edgeColumns(img, N, side, k) {
  const out = [];
  for (let y = 0; y < N; y++) {
    const acc = [0, 0, 0];
    for (let d = 0; d < k; d++) {
      const c = px(img, N, side === 'left' ? d : N - 1 - d, y);
      acc[0] += c[0];
      acc[1] += c[1];
      acc[2] += c[2];
    }
    out.push(acc.map((v) => v / k));
  }
  return out;
}
/** Average of `k` rows at the top or bottom edge, per column. */
function edgeRows(img, N, side, k) {
  const out = [];
  for (let x = 0; x < N; x++) {
    const acc = [0, 0, 0];
    for (let d = 0; d < k; d++) {
      const c = px(img, N, x, side === 'top' ? d : N - 1 - d);
      acc[0] += c[0];
      acc[1] += c[1];
      acc[2] += c[2];
    }
    out.push(acc.map((v) => v / k));
  }
  return out;
}

/** Smooth value noise in 0…1, for the painted grass and clouds. */
function valueNoise(x, y, seed) {
  const h = (i, j) => {
    const s = sin(i * 127.1 + j * 311.7 + seed * 74.7) * 43758.5453;
    return s - floor(s);
  };
  const xi = floor(x);
  const yi = floor(y);
  const fx = x - xi;
  const fy = y - yi;
  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);
  const a = h(xi, yi) + (h(xi + 1, yi) - h(xi, yi)) * ux;
  const b = h(xi, yi + 1) + (h(xi + 1, yi + 1) - h(xi, yi + 1)) * ux;
  return a + (b - a) * uy;
}

/**
 * @param {{ front: string, right: string, back: string, left: string }} files
 * @returns {Promise<Record<'f'|'r'|'b'|'l'|'u'|'d', Buffer>>} RGB faces, N × N
 */
export async function stitchViews(files, N, warn = console.warn) {
  const s = N / 2048; // measurements below are tuned at 2048 px
  const views = {
    f: await loadView(files.front, N, warn),
    r: await loadView(files.right, N, warn),
    b: await loadView(files.back, N, warn),
    l: await loadView(files.left, N, warn),
  };

  // ---- 1. colour matching across the four vertical seams (turning right: f → r → b → l → f) ----
  const seams = [
    ['f', 'r'],
    ['r', 'b'],
    ['b', 'l'],
    ['l', 'f'],
  ];
  const edgeK = max(2, round(8 * s));
  const shifts = { f: {}, r: {}, b: {}, l: {} };
  for (const [a, b] of seams) {
    const ra = blurProfile(edgeColumns(views[a], N, 'right', edgeK), 40 * s);
    const lb = blurProfile(edgeColumns(views[b], N, 'left', edgeK), 40 * s);
    shifts[a].right = ra.map((c, y) => c.map((v, i) => ((v + lb[y][i]) / 2 - v)));
    shifts[b].left = lb.map((c, y) => c.map((v, i) => ((v + ra[y][i]) / 2 - v)));
  }
  const reach = N * 0.3;
  for (const f of ['f', 'r', 'b', 'l']) {
    const img = views[f];
    for (let y = 0; y < N; y++) {
      for (let x = 0; x < N; x++) {
        const wl = 1 - smooth(0, reach, x);
        const wr = 1 - smooth(0, reach, N - 1 - x);
        if (wl <= 0 && wr <= 0) continue;
        const i = (y * N + x) * 3;
        for (let c = 0; c < 3; c++) img[i + c] += shifts[f].left[y][c] * wl + shifts[f].right[y][c] * wr;
      }
    }
  }

  // ---- 2. narrow crossfade either side of each seam ----
  const band = max(4, round(36 * s));
  for (const [a, b] of seams) {
    const A = views[a];
    const B = views[b];
    for (let y = 0; y < N; y++) {
      for (let d = 0; d < band; d++) {
        const t = 0.5 * (1 - d / band); // 0.5 at the seam, so both sides meet on the same colour
        const ia = (y * N + (N - 1 - d)) * 3;
        const ib = (y * N + d) * 3;
        for (let c = 0; c < 3; c++) {
          const va = A[ia + c];
          const vb = B[ib + c];
          A[ia + c] = va + (vb - va) * t;
          B[ib + c] = vb + (va - vb) * t;
        }
      }
    }
  }

  // ---- 3. sky overhead and ground underfoot, grown from the four pictures' edges ----
  const rowK = max(2, round(6 * s));
  const tops = {};
  const bottoms = {};
  for (const f of ['f', 'r', 'b', 'l']) {
    const t = edgeRows(views[f], N, 'top', rowK);
    const b = edgeRows(views[f], N, 'bottom', rowK);
    tops[f] = { sharp: blurProfile(t, 4 * s), soft: blurProfile(t, 260 * s) };
    bottoms[f] = { sharp: blurProfile(b, 4 * s), soft: blurProfile(b, 260 * s) };
  }
  const avg = (list) => list.reduce((a, c) => a.map((v, i) => v + c[i] / list.length), [0, 0, 0]);
  const skyEdge = avg(['f', 'r', 'b', 'l'].flatMap((f) => tops[f].soft));
  const zenith = mix3(skyEdge, [104, 152, 208], 0.45);
  const cloud = mix3(skyEdge, [255, 251, 244], 0.7);
  const centre = (f, p) => p[f].soft[N >> 1];
  const path = avg([centre('f', bottoms), centre('b', bottoms)]);
  const grass = mix3(avg([centre('l', bottoms), centre('r', bottoms)]), [86, 116, 60], 0.35);

  /** Colour at an edge point of the top/bottom face, from the side face it touches. `e` in −1…1 along that edge. */
  const edgeAt = (profiles, face, e, which) => profiles[face][which][min(N - 1, max(0, round(((e + 1) / 2) * (N - 1))))];

  const up = Buffer.alloc(N * N * 3);
  const down = Buffer.alloc(N * N * 3);
  for (let j = 0; j < N; j++) {
    const v = ((j + 0.5) / N) * 2 - 1;
    for (let i = 0; i < N; i++) {
      const u = ((i + 0.5) / N) * 2 - 1;
      const m = max(abs(u), abs(v)); // 1 at the face's edge, 0 at its centre
      const ue = u / m;
      const ve = v / m;
      // Which side face this point runs out to, and where along its top/bottom edge (matches the cube layout).
      let upFace, upE, dnFace, dnE;
      if (abs(ve) >= abs(ue)) {
        [upFace, upE] = ve > 0 ? ['f', ue] : ['b', -ue];
        [dnFace, dnE] = ve < 0 ? ['f', ue] : ['b', -ue];
      } else {
        [upFace, upE] = ue > 0 ? ['r', -ve] : ['l', ve];
        [dnFace, dnE] = ue > 0 ? ['r', ve] : ['l', -ve];
      }
      const inward = 1 - m;

      // sky: the picture's own top edge, then its blurred colour, then the zenith, with soft clouds in between
      let c = mix3(edgeAt(tops, upFace, upE, 'sharp'), edgeAt(tops, upFace, upE, 'soft'), smooth(0, 0.07, inward));
      c = mix3(c, zenith, smooth(0.05, 0.9, inward));
      const n = valueNoise(u * 2.2 + 5, v * 2.2 + 9, 1) * 0.65 + valueNoise(u * 5 + 1, v * 5 + 3, 2) * 0.35;
      c = mix3(c, cloud, smooth(0.58, 0.8, n) * smooth(0.12, 0.4, inward) * 0.8);
      const o = (j * N + i) * 3;
      up[o] = c[0];
      up[o + 1] = c[1];
      up[o + 2] = c[2];

      // ground: the picture's bottom edge, blurred, into painted grass with the path along the front–back line
      let g = mix3(edgeAt(bottoms, dnFace, dnE, 'sharp'), edgeAt(bottoms, dnFace, dnE, 'soft'), smooth(0, 0.05, inward));
      const onPath = 1 - smooth(0.2, 0.34, abs(u));
      const tex = valueNoise(u * 18, v * 18, 3) * 0.6 + valueNoise(u * 60, v * 60, 4) * 0.4;
      let ground = mix3(grass, path, onPath);
      ground = ground.map((x) => x * (0.9 + tex * 0.2));
      g = mix3(g, ground, smooth(0.03, 0.5, inward));
      down[o] = g[0];
      down[o + 1] = g[1];
      down[o + 2] = g[2];
    }
  }

  const toBuf = (img) => Buffer.from(Uint8ClampedArray.from(img));
  return { f: toBuf(views.f), r: toBuf(views.r), b: toBuf(views.b), l: toBuf(views.l), u: up, d: down };
}
