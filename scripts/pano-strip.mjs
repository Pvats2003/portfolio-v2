// Joins one continuous painting, grown by extending a picture to the right again and again, into a 360° panorama for
// /world. Used by world-pano.mjs when art/pano/<spot>-strip-0, -1, -2 … exist (the extend route, see art/pano/README.md).
//
// Picture 0 faces the inn. Each next picture repeats roughly the right third of the one before on its left and paints
// new scenery to its right. The LAST picture is the closing one: its right side leads back into picture 0's left side.
// Gemini redraws the overlap rather than copying it, so nothing lines up exactly. For every join the script:
//   1. finds where the new picture sits on the previous one (sideways and up/down shift, and size), by comparing the
//      shapes in the overlap at three sizes, coarse to fine;
//   2. matches colour, row by row, shifting the new picture toward the previous one near the join and fading back to
//      its own colours further right (picture 0 is never changed);
//   3. cuts along the line where the two pictures differ least (so a tree or roof comes from one picture, not both)
//      and softens that cut over a few pixels.
// Going all the way round, small errors add up: the closing join says how far picture 0 ended up from where it started
// (up/down and in size), and that leftover is spread evenly around the loop. The loop's length sets the scale: the
// whole painting is exactly 360° wide, and it's wrapped round a cylinder (like a panoramic photo), with the sky above
// and the ground below painted from its top and bottom edges.
import sharp from 'sharp';

const { min, max, abs, exp, floor, round, sin, cos, tan, atan, sqrt, PI } = Math;
const smooth = (a, b, x) => {
  const t = min(1, max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
const mix3 = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
const name = (file) => file.split('/').pop();

/** Loads a picture as 8-bit RGB scaled to height H (aspect kept). */
async function load(file, H, warn) {
  const img = sharp(file).rotate();
  const { width: w0, height: h0 } = await img.metadata();
  if (min(w0, h0) < 1024) warn(`${name(file)}: only ${w0} × ${h0}; upscale it 2× in Upscayl for a sharp result.`);
  const w = round((w0 / h0) * H);
  const data = await img.resize(w, H, { kernel: 'lanczos3' }).flatten({ background: '#bcd3e6' }).raw().toBuffer();
  return { file, data, w, h: H };
}

// ---- alignment ----

/** Separable gaussian blur of a float image. */
function blur(f, w, h, sigma) {
  const r = Math.ceil(sigma * 2.5);
  const k = Array.from({ length: 2 * r + 1 }, (_, i) => exp(-(((i - r) / sigma) ** 2) / 2));
  const ks = k.reduce((a, b) => a + b, 0);
  const tmp = new Float32Array(w * h);
  const out = new Float32Array(w * h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let acc = 0;
      for (let j = -r; j <= r; j++) acc += f[y * w + min(w - 1, max(0, x + j))] * k[j + r];
      tmp[y * w + x] = acc / ks;
    }
  }
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let acc = 0;
      for (let j = -r; j <= r; j++) acc += tmp[min(h - 1, max(0, y + j)) * w + x] * k[j + r];
      out[y * w + x] = acc / ks;
    }
  }
  return out;
}

/** The picture's shapes at height hl: brightness with the broad light removed (so colour and haze drift don't count). */
async function features(img, hl) {
  const wl = max(8, round((img.w / img.h) * hl));
  const g = await sharp(img.data, { raw: { width: img.w, height: img.h, channels: 3 } }).resize(wl, hl).greyscale().raw().toBuffer();
  const f = Float32Array.from(g);
  const fine = blur(f, wl, hl, max(0.6, hl / 256));
  const broad = blur(f, wl, hl, max(4, hl / 14));
  for (let i = 0; i < f.length; i++) fine[i] -= broad[i];
  return { f: fine, w: wl, h: hl };
}

function bilinear(F, x, y) {
  const x0 = floor(x);
  const y0 = floor(y);
  const fx = x - x0;
  const fy = y - y0;
  const i = y0 * F.w + x0;
  return (F.f[i] * (1 - fx) + F.f[i + 1] * fx) * (1 - fy) + (F.f[i + F.w] * (1 - fx) + F.f[i + F.w + 1] * fx) * fy;
}

/** Normalised correlation of B placed on A: B's (x, y) lands on A's (dx + s·x, dy + s·y). */
function score(A, B, dx, dy, s, step) {
  let n = 0, sa = 0, sb = 0, saa = 0, sbb = 0, sab = 0;
  for (let y = 1; y < B.h - 1; y += step) {
    const ya = dy + s * y;
    if (ya < 1 || ya >= A.h - 2) continue;
    for (let x = 1; x < B.w - 1; x += step) {
      const xa = dx + s * x;
      if (xa < 1) continue;
      if (xa >= A.w - 2) break;
      const a = bilinear(A, xa, ya);
      const b = B.f[y * B.w + x];
      n++; sa += a; sb += b; saa += a * a; sbb += b * b; sab += a * b;
    }
  }
  const minN = (0.1 * B.w * B.h) / (step * step);
  if (n < minN) return -1;
  const cov = sab - (sa * sb) / n;
  const va = saa - (sa * sa) / n;
  const vb = sbb - (sb * sb) / n;
  return va > 0 && vb > 0 ? cov / sqrt(va * vb) : -1;
}

const LEVELS = [96, 320, 768];
// Gemini keeps things about the same size from picture to picture, and with only a third overlapping, size is the
// least certain measurement, so a match at a different size has to be clearly better to win.
const SIZE_PRIOR = Number(process.env.PANO_SIZE_PRIOR ?? 0.5);

/**
 * Where picture B sits on picture A (both at full working size): B's (x, y) → A's (dx + s·x, dy + s·y).
 * Searches the whole plausible range coarsely (overlap 10–75% of A's width, up/down ±14%, size ±25%), then refines
 * the best few candidates at two finer sizes.
 */
async function align(a, b) {
  const FA = [];
  const FB = [];
  for (const hl of LEVELS) {
    FA.push(await features(a, hl));
    FB.push(await features(b, hl));
  }
  // coarse
  const A0 = FA[0];
  const B0 = FB[0];
  let cands = [];
  for (let s = 0.8; s <= 1.25; s *= 1.025) {
    for (let dy = round(-0.14 * A0.h); dy <= round(0.14 * A0.h); dy++) {
      for (let dx = round(0.25 * A0.w); dx <= round(0.9 * A0.w); dx++) {
        const v = score(A0, B0, dx, dy, s, 2) - SIZE_PRIOR * abs(Math.log(s));
        if (v > 0) cands.push({ dx, dy, s, v });
      }
    }
  }
  cands.sort((p, q) => q.v - p.v);
  const picked = [];
  for (const c of cands) {
    if (picked.every((p) => abs(p.dx - c.dx) > 3 || abs(p.dy - c.dy) > 3 || abs(p.s / c.s - 1) > 0.06)) picked.push(c);
    if (picked.length === 4) break;
  }
  cands = picked;
  // refine
  for (let l = 1; l < LEVELS.length; l++) {
    const k = LEVELS[l] / LEVELS[l - 1];
    const A = FA[l];
    const B = FB[l];
    const r = Math.ceil(k) + 1;
    const ds = l === 1 ? 0.012 : 0.004;
    cands = cands.map((c) => {
      let best = { ...c, dx: c.dx * k, dy: c.dy * k, v: -2 };
      const cx = c.dx * k;
      const cy = c.dy * k;
      for (let s = c.s - 3 * ds; s <= c.s + 3 * ds + 1e-9; s += ds) {
        for (let dy = cy - r; dy <= cy + r; dy++) {
          for (let dx = cx - r; dx <= cx + r; dx++) {
            const v = score(A, B, dx, dy, s, l === 1 ? 1 : 2) - SIZE_PRIOR * abs(Math.log(s));
            if (v > best.v) best = { dx, dy, s, v };
          }
        }
      }
      return best;
    });
    cands.sort((p, q) => q.v - p.v);
    cands = cands.slice(0, l === 1 ? 2 : 1);
  }
  const best = cands[0];
  const toFull = a.h / LEVELS[LEVELS.length - 1];
  return { dx: best.dx * toFull, dy: best.dy * toFull, s: best.s, score: best.v, overlap: 1 - (best.dx * toFull) / a.w };
}

// ---- compositing ----

/** 1-D gaussian blur of a list of RGB triples; `wrap` for profiles that go all the way round. */
function blurProfile(p, sigma, wrap = false) {
  const r = Math.ceil(sigma * 2.5);
  const k = Array.from({ length: 2 * r + 1 }, (_, i) => exp(-(((i - r) / sigma) ** 2) / 2));
  const ks = k.reduce((x, y) => x + y, 0);
  const n = p.length;
  return p.map((_, i) => {
    const acc = [0, 0, 0];
    for (let j = -r; j <= r; j++) {
      const q = p[wrap ? (((i + j) % n) + n) % n : min(n - 1, max(0, i + j))];
      acc[0] += q[0] * k[j + r];
      acc[1] += q[1] * k[j + r];
      acc[2] += q[2] * k[j + r];
    }
    return acc.map((v) => v / ks);
  });
}

function valueNoise(x, y, seed) {
  const hsh = (i, j) => {
    const s = sin(i * 127.1 + j * 311.7 + seed * 74.7) * 43758.5453;
    return s - floor(s);
  };
  const xi = floor(x);
  const yi = floor(y);
  const fx = x - xi;
  const fy = y - yi;
  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);
  const p = hsh(xi, yi) + (hsh(xi + 1, yi) - hsh(xi, yi)) * ux;
  const q = hsh(xi, yi + 1) + (hsh(xi + 1, yi + 1) - hsh(xi, yi + 1)) * ux;
  return p + (q - p) * uy;
}

/**
 * @param {string[]} files  pictures in order: 0 faces the inn, the last one closes the loop back into 0
 * @param {{ horizon?: number, rotate?: number, H?: number, guessSky: (c: number[], latDeg: number) => number }} opts
 *   horizon: where the horizon is on picture 0 (0 top … 1 bottom; 0.5 when the prompt keeps it across the middle);
 *   rotate: degrees to turn so the inn is straight ahead (+ turns the view right)
 * @returns colourAt(lon, lat) → [r, g, b, skyness], plus a report and the flat painting for checking
 */
export async function stripPanorama(files, opts, warn = console.warn) {
  const H = opts.H ?? 2048;
  const u = H / 2048; // measurements below are tuned at 2048 px
  const imgs = [];
  for (const f of files) imgs.push(await load(f, H, warn));
  const n = imgs.length;
  const report = [];

  // 1. place every picture on the previous one; the closing picture also places picture 0's second copy
  const pos = [{ X: 0, Y: 0, s: 1 }];
  const joins = [];
  const failed = new Set(); // joins that don't match: join k is picture k → the next one
  for (let k = 0; k < n; k++) {
    const next = (k + 1) % n;
    const m = await align(imgs[k], imgs[next]);
    const p = pos[k];
    const q = { X: p.X + p.s * m.dx, Y: p.Y + p.s * m.dy, s: p.s * m.s };
    joins.push(m);
    pos.push(q); // pos[n]: where picture 0 came back round to
    const label = `${name(imgs[k].file)} → ${name(imgs[next].file)}`;
    report.push(
      `${label}: overlap ${round(m.overlap * 100)}%, up/down ${(m.dy / H * 100).toFixed(1)}%, size ×${m.s.toFixed(3)}, match ${m.score.toFixed(2)}`,
    );
    if (m.score < 0.3) failed.add(k);
    if (m.overlap < 0.12 || m.overlap > 0.7) warn(`${label}: the overlap is ${round(m.overlap * 100)}% (aim for about a third).`);
  }
  // A picture that doesn't continue the one before would wreck the painting: stop, naming it, before drawing anything.
  const bad = [];
  const match = (k) => `match ${joins[k].score.toFixed(2)}; good joins score about 0.5 or more`;
  for (let k = 0; k < n; k++) {
    if (!failed.has(k)) continue;
    const next = (k + 1) % n;
    if (next !== 0 && failed.has(next)) {
      // both of picture `next`'s joins fail: it's that picture
      bad.push(`${name(imgs[next].file)} doesn't match the pictures either side (${match(k)}). Make it again, attaching ${name(imgs[k].file)}.`);
      failed.delete(next);
    } else if (next === 0) {
      bad.push(`${name(imgs[k].file)} doesn't lead back into ${name(imgs[0].file)} (${match(k)}). Make the closing picture again with both attached, as in art/pano/README.md.`);
    } else {
      bad.push(`${name(imgs[next].file)} doesn't seem to continue ${name(imgs[k].file)} (${match(k)}). Make it again, attaching ${name(imgs[k].file)}.`);
    }
  }
  if (bad.length) {
    for (const line of report) console.log(`    ${line}`);
    throw Object.assign(new Error(bad.join('\n')), { strip: true });
  }
  const back = pos[n];
  const W = back.X;
  // Spread the leftover (picture 0 came back higher or lower, bigger or smaller) evenly round the loop, as a smooth
  // correction that depends only on how far round you are, so both pictures at every join get the same correction
  // and still line up. A fraction t of the way round, the canvas row Y is read from the pictures' chained placement at
  // row yr(t, Y): the identity at the start, and exactly where picture 0's second copy landed at the end.
  const Yh0 = (opts.horizon ?? 0.5) * H;
  const yr = (U, Y) => {
    const t = U / W;
    return Yh0 + back.s ** t * (Y - Yh0) + t * (back.Y + (back.s - 1) * Yh0);
  };
  const fovEach = (360 * imgs[0].w) / W;
  report.push(
    `loop: ${round(W)} px round at ${H} px high, so picture 0 spans ${fovEach.toFixed(0)}°; leftover spread round the loop: up/down ${((back.Y / H) * 100).toFixed(1)}%, size ×${back.s.toFixed(3)}`,
  );
  if (abs(back.Y / H) > 0.06 || abs(back.s - 1) > 0.1)
    warn(`the pictures drift a lot going round (up/down ${((back.Y / H) * 100).toFixed(1)}%, size ×${back.s.toFixed(3)}); keeping the horizon and the camera angle the same in every picture fixes this.`);
  if (fovEach < 70 || fovEach > 115)
    warn(`each picture ends up spanning ${fovEach.toFixed(0)}° (about 90° looks natural). ${fovEach > 115 ? 'Add one more extension' : 'Drop one extension'} before the closing picture.`);

  // canvas rows: picture 0's height, plus whatever the others add above or below (up to 15%)
  let top = 0;
  let bottom = H;
  for (let k = 1; k < n; k++) {
    top = min(top, pos[k].Y);
    bottom = max(bottom, pos[k].Y + pos[k].s * H);
  }
  const y0 = floor(max(top, -0.15 * H));
  const CH = Math.ceil(min(bottom, 1.15 * H)) - y0;
  const CW = round(W);

  // each picture's span on the canvas (unwrapped: picture k covers X_k … X_k + s_k·w_k; picture 0 again from W)
  const P = imgs.map((im, k) => ({ ...pos[k], w: im.w * pos[k].s, h: H * pos[k].s }));

  // raw sample of picture k at canvas (U, Y); null outside it
  const raw = (k, U, Y) => {
    const im = imgs[k];
    const x = (U - P[k].X) / P[k].s;
    const y = (yr(U, Y) - P[k].Y) / P[k].s;
    if (x < 0 || y < 0 || x > im.w - 1 || y > im.h - 1) return null;
    const x0 = min(im.w - 2, floor(x));
    const y0i = min(im.h - 2, floor(y));
    const fx = x - x0;
    const fy = y - y0i;
    const o = (y0i * im.w + x0) * 3;
    const r3 = im.w * 3;
    const out = [0, 0, 0];
    for (let c = 0; c < 3; c++) {
      const a = im.data[o + c] * (1 - fx) + im.data[o + 3 + c] * fx;
      const b = im.data[o + r3 + c] * (1 - fx) + im.data[o + r3 + 3 + c] * fx;
      out[c] = a + (b - a) * fy;
    }
    return out;
  };

  // 2. colour matching, per join: the overlap's row-by-row colour difference, blurred up and down
  //    shiftL[k]: pulls picture k toward the previous one near its left join; shiftR[n-1]: the closing picture toward picture 0
  const shiftL = new Array(n).fill(null);
  let shiftR = null;
  const ovl = []; // overlap per join, canvas X (unwrapped), in the coordinates of picture k
  for (let k = 0; k < n; k++) {
    const nx = (k + 1) % n;
    const bX = nx === 0 ? W : P[nx].X; // where the next picture starts
    const lo = bX;
    const hi = P[k].X + P[k].w;
    ovl.push({ lo, hi, mid: (lo + hi) / 2 });
    const diff = [];
    for (let Y = y0; Y < y0 + CH; Y++) {
      const acc = [0, 0, 0];
      let cnt = 0;
      for (let U = lo; U < hi; U += 3) {
        const A = raw(k, U, Y);
        const B = raw(nx, nx === 0 ? U - W : U, Y);
        if (!A || !B) continue;
        acc[0] += A[0] - B[0]; acc[1] += A[1] - B[1]; acc[2] += A[2] - B[2]; cnt++;
      }
      diff.push(cnt ? acc.map((v) => v / cnt) : null);
    }
    // fill rows without overlap from their neighbours, then blur
    let last = [0, 0, 0];
    for (let i = 0; i < diff.length; i++) {
      diff[i] = diff[i] ?? last;
      last = diff[i];
    }
    const d = blurProfile(diff, 40 * u);
    if (nx === 0) shiftR = d.map((c) => c.map((v) => -v)); // closing picture → picture 0's colours
    else shiftL[nx] = d;
  }
  const reachOf = (k) => 0.6 * P[k].w;
  const col = (k, U, Y) => {
    const c = raw(k, U, Y);
    if (!c) return null;
    const row = Math.min(CH - 1, max(0, round(Y - y0)));
    if (shiftL[k]) {
      const wgt = 1 - smooth(ovl[k - 1].mid, ovl[k - 1].mid + reachOf(k), U);
      if (wgt > 0) for (let i = 0; i < 3; i++) c[i] += shiftL[k][row][i] * wgt;
    }
    if (k === n - 1 && shiftR) {
      const wgt = smooth(ovl[k].mid - reachOf(k), ovl[k].mid, U);
      if (wgt > 0) for (let i = 0; i < 3; i++) c[i] += shiftR[row][i] * wgt;
    }
    return c;
  };

  // 3. seams: per join, the path top to bottom through the overlap where the two pictures differ least
  const F = max(3, round(20 * u)); // softening either side of the cut
  const seams = [];
  for (let k = 0; k < n; k++) {
    const nx = (k + 1) % n;
    const { lo, hi } = ovl[k];
    const a = lo + 0.2 * (hi - lo) + F;
    const b = hi - 0.2 * (hi - lo) - F;
    const cols = max(1, floor(b - a));
    const cost = new Float32Array(CH * cols);
    for (let r = 0; r < CH; r++) {
      const Y = y0 + r;
      for (let i = 0; i < cols; i++) {
        const U = a + i;
        const A = col(k, U, Y);
        const B = col(nx, nx === 0 ? U - W : U, Y);
        // outside one picture: the cut may pass only if the other covers it (costly, to keep it inside both)
        cost[r * cols + i] = A && B ? abs(A[0] - B[0]) + abs(A[1] - B[1]) + abs(A[2] - B[2]) : 400;
      }
    }
    // dynamic programming, one pixel sideways per row at most
    const acc = new Float32Array(CH * cols);
    const from = new Int8Array(CH * cols);
    acc.set(cost.subarray(0, cols));
    for (let r = 1; r < CH; r++) {
      for (let i = 0; i < cols; i++) {
        let best = acc[(r - 1) * cols + i];
        let d = 0;
        if (i > 0 && acc[(r - 1) * cols + i - 1] < best) {
          best = acc[(r - 1) * cols + i - 1];
          d = -1;
        }
        if (i < cols - 1 && acc[(r - 1) * cols + i + 1] < best) {
          best = acc[(r - 1) * cols + i + 1];
          d = 1;
        }
        acc[r * cols + i] = best + cost[r * cols + i];
        from[r * cols + i] = d;
      }
    }
    let i = 0;
    for (let j = 1; j < cols; j++) if (acc[(CH - 1) * cols + j] < acc[(CH - 1) * cols + i]) i = j;
    const path = new Float32Array(CH);
    for (let r = CH - 1; r >= 0; r--) {
      path[r] = a + i;
      i += from[r * cols + i];
    }
    // a little smoothing so the softened band doesn't zig-zag
    const sm = new Float32Array(CH);
    const R = max(2, round(6 * u));
    for (let r = 0; r < CH; r++) {
      let s = 0;
      let c = 0;
      for (let j = max(0, r - R); j <= min(CH - 1, r + R); j++) {
        s += path[j];
        c++;
      }
      sm[r] = s / c;
    }
    seams.push(sm);
  }

  // 4. the flat painting: each picture owns the canvas between its two cuts, softened across each cut
  const flat = Buffer.alloc(CW * CH * 3);
  const valid = new Uint8Array(CW * CH);
  for (let r = 0; r < CH; r++) {
    const Y = y0 + r;
    // ownership (unwrapped): picture 0 from the closing cut − W to cut 0; picture k from cut k−1 to cut k
    const lo = (k) => (k === 0 ? seams[n - 1][r] - W : seams[k - 1][r]);
    const hi = (k) => seams[k][r];
    for (let X = 0; X < CW; X++) {
      const acc = [0, 0, 0];
      let wsum = 0;
      for (const U of [X, X + W]) {
        for (let k = 0; k < n; k++) {
          const l = lo(k);
          const h = hi(k);
          if (U < l - F || U >= h + F) continue;
          const wgt = smooth(l - F, l + F, U) * (1 - smooth(h - F, h + F, U));
          if (wgt <= 0) continue;
          const c = col(k, U, Y);
          if (!c) continue;
          acc[0] += c[0] * wgt; acc[1] += c[1] * wgt; acc[2] += c[2] * wgt;
          wsum += wgt;
        }
      }
      if (wsum > 0.02) {
        const o = (r * CW + X) * 3;
        flat[o] = acc[0] / wsum; flat[o + 1] = acc[1] / wsum; flat[o + 2] = acc[2] / wsum;
        valid[r * CW + X] = 1;
      }
    }
  }

  // 5. wrap round a cylinder: X = angle, Y = f·tan(elevation); sky and ground painted beyond the painting's edges
  const f = W / (2 * PI);
  const Yh = (opts.horizon ?? 0.5) * H - y0; // horizon row on the canvas
  const Xc = imgs[0].w / 2 + ((opts.rotate ?? 0) / 360) * W; // straight ahead: the middle of picture 0
  const topRow = new Int32Array(CW);
  const botRow = new Int32Array(CW);
  const hr = max(0, min(CH - 1, round(Yh)));
  for (let X = 0; X < CW; X++) {
    let t = hr;
    while (t > 0 && valid[(t - 1) * CW + X]) t--;
    let b = hr;
    while (b < CH - 1 && valid[(b + 1) * CW + X]) b++;
    // stay a few pixels inside, clear of the softened edge
    topRow[X] = min(hr, t + 2);
    botRow[X] = max(hr, b - 2);
  }
  // Even the edges out where pictures sit at slightly different heights: the most conservative edge nearby, smoothed,
  // so the painted sky and ground start along a gentle line instead of in steps.
  const evenOut = (rows, pick) => {
    const R = round(CW / 90);
    const picked = Int32Array.from(rows, (_, X) => {
      let v = rows[X];
      for (let j = -R; j <= R; j += 4) v = pick(v, rows[(((X + j) % CW) + CW) % CW]);
      return v;
    });
    return Int32Array.from(picked, (_, X) => {
      let acc = 0;
      for (let j = -R; j <= R; j++) acc += picked[(((X + j) % CW) + CW) % CW];
      return round(acc / (2 * R + 1));
    });
  };
  topRow.set(evenOut(topRow, max));
  botRow.set(evenOut(botRow, min));
  const edgeK = max(2, round(6 * u));
  const edgeRow = (X, r0, dir) => {
    const acc = [0, 0, 0];
    for (let d = 0; d < edgeK; d++) {
      const o = ((r0 + dir * d) * CW + X) * 3;
      acc[0] += flat[o]; acc[1] += flat[o + 1]; acc[2] += flat[o + 2];
    }
    return acc.map((v) => v / edgeK);
  };
  const tops = Array.from({ length: CW }, (_, X) => edgeRow(X, topRow[X], 1));
  const bots = Array.from({ length: CW }, (_, X) => edgeRow(X, botRow[X], -1));
  // Edge colour, blurred sideways enough that extending it doesn't draw streaks (sky: very smooth anyway).
  const topSharp = blurProfile(tops, 40 * u, true);
  const botSharp = blurProfile(bots, 18 * u, true);
  const coarse = (p) => {
    // the broad colour: average in 32 px blocks, then blur (fast enough at 8000+ columns)
    const B = 32;
    const blocks = [];
    for (let i = 0; i < p.length; i += B) {
      const acc = [0, 0, 0];
      const e = min(p.length, i + B);
      for (let j = i; j < e; j++) {
        acc[0] += p[j][0];
        acc[1] += p[j][1];
        acc[2] += p[j][2];
      }
      blocks.push(acc.map((v) => v / (e - i)));
    }
    const bb = blurProfile(blocks, (260 * u) / B, true);
    return p.map((_, i) => bb[min(bb.length - 1, floor(i / B))]);
  };
  const topSoft = coarse(tops);
  const botSoft = coarse(bots);
  const avg = (list) => list.reduce((a, c) => a.map((v, i) => v + c[i] / list.length), [0, 0, 0]);
  const zenith = mix3(avg(topSoft), [104, 152, 208], 0.45);
  const cloud = mix3(avg(topSoft), [255, 251, 244], 0.7);
  const grass = mix3(avg(botSoft), [86, 116, 60], 0.35);
  const deg = 180 / PI;

  const sampleFlat = (U, Y) => {
    const x0 = floor(U);
    const fx = U - x0;
    const yA = max(0, min(CH - 2, floor(Y)));
    const fy = min(1, max(0, Y - yA));
    const xa = ((x0 % CW) + CW) % CW;
    const xb = (xa + 1) % CW;
    const out = [0, 0, 0];
    for (let c = 0; c < 3; c++) {
      const p = flat[(yA * CW + xa) * 3 + c] * (1 - fx) + flat[(yA * CW + xb) * 3 + c] * fx;
      const q = flat[((yA + 1) * CW + xa) * 3 + c] * (1 - fx) + flat[((yA + 1) * CW + xb) * 3 + c] * fx;
      out[c] = p + (q - p) * fy;
    }
    return out;
  };

  const colourAt = (lon, lat) => {
    const U = Xc + lon * f;
    const X = ((round(U) % CW) + CW) % CW;
    const Y = lat < -PI / 2 + 1e-6 ? Infinity : lat > PI / 2 - 1e-6 ? -Infinity : Yh - f * tan(lat);
    const ld = lat * deg;
    if (Y >= topRow[X] && Y <= botRow[X]) {
      let c = sampleFlat(U, Y);
      // melt the last few rows into the painted colour beyond, so the painting has no hard edge
      const band = 28 * u;
      const wt = 1 - smooth(topRow[X], topRow[X] + band, Y);
      const wb = smooth(botRow[X] - band, botRow[X], Y);
      if (wt > 0) c = mix3(c, topSharp[X], wt * 0.85);
      if (wb > 0) c = mix3(c, botSharp[X], wb * 0.85);
      return [...c, opts.guessSky(c, ld)];
    }
    // cloud and grass texture: noise on the direction projected onto a flat plane, so nothing pinches at the poles
    const dx = cos(lat) * sin(lon);
    const dz = -cos(lat) * cos(lon);
    if (Y < topRow[X]) {
      const lt = atan((Yh - topRow[X]) / f) * deg;
      const d = ld - lt;
      let c = mix3(topSharp[X], topSoft[X], smooth(0, 4, d));
      c = mix3(c, zenith, smooth(0, max(20, 90 - lt), d));
      const k = 1 / (sin(lat) + 0.45);
      const cl = valueNoise(dx * k * 2.4, dz * k * 2.4, 3) * 0.65 + valueNoise(dx * k * 6, dz * k * 6, 7) * 0.35;
      c = mix3(c, cloud, smooth(0.56, 0.82, cl) * smooth(2, 14, d) * 0.6);
      return [...c, opts.guessSky(topSharp[X], lt) + (1 - opts.guessSky(topSharp[X], lt)) * smooth(0, 6, d)];
    }
    const lb = atan((Yh - botRow[X]) / f) * deg;
    const d = lb - ld;
    let c = mix3(botSharp[X], botSoft[X], smooth(0, 5, d));
    c = mix3(c, grass, smooth(2, max(20, (90 + lb) * 0.85), d));
    // grass texture: broad patches plus fine grain, both fading in from the painting's edge
    const k = 1 / (0.45 - sin(lat));
    const patch = (valueNoise(dx * k * 9, dz * k * 9, 5) - 0.5) * 22;
    const fine = (valueNoise(dx * k * 60, dz * k * 60, 11) - 0.5) * 16;
    const g = (patch + fine) * smooth(0, 3, d);
    return [c[0] + g * 0.8, c[1] + g, c[2] + g * 0.6, 0];
  };

  const coverUp = atan((Yh - Math.min(...topRow)) / f) * deg;
  const coverDown = atan((Math.max(...botRow) - Yh) / f) * deg;
  report.push(`the painting reaches about ${coverUp.toFixed(0)}° above the horizon and ${coverDown.toFixed(0)}° below it; beyond that the sky and ground are painted`);
  return { colourAt, report, flat: { data: flat, width: CW, height: CH } };
}
