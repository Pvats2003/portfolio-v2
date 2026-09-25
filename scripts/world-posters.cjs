// Renders the /world posters and the homepage dusk background from the real scene (WORLD.md §5).
// The posters are what phones, low-end devices and no-WebGL browsers see, and what shows while the 3D loads.
//
// Needs a running build (npm run build && npm start) and Playwright:
//   NODE_PATH=$(npm root -g) node scripts/world-posters.cjs [http://localhost:3100]
// Uses the test-only ?shot= override, so run it against a local or preview build, never production.
const path = require('node:path');
const { chromium } = require('playwright');
const sharp = require('sharp');

const BASE = process.argv[2] || 'http://localhost:3100';
const OUT = path.join(__dirname, '..', 'public', 'world');

// Section size = viewport minus the site header (49 px desktop, 90 px phone).
const jobs = [
  { name: 'poster-day', q: 'shot=day', w: 1600, h: 1049, dsf: 1 },
  { name: 'poster-night', q: 'shot=night', w: 1600, h: 1049, dsf: 1 },
  { name: 'poster-day-tall', q: 'shot=day', w: 400, h: 910, dsf: 2 },
  { name: 'poster-night-tall', q: 'shot=night', w: 400, h: 910, dsf: 2 },
  { name: 'hero-dusk', q: 'shot=dusk&mode=hero', w: 1200, h: 599, dsf: 2 },
];

(async () => {
  const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  for (const j of jobs) {
    const ctx = await browser.newContext({ viewport: { width: j.w, height: j.h }, deviceScaleFactor: j.dsf, reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/world?${j.q}`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.world-poster.opacity-0', { timeout: 90000 });
    await page.waitForTimeout(1500);
    const png = await page.locator('section.world').screenshot();
    const img = sharp(png);
    const meta = await img.metadata();
    await img.clone().avif({ quality: 50, effort: 6 }).toFile(path.join(OUT, `${j.name}.avif`));
    await img.clone().webp({ quality: 72 }).toFile(path.join(OUT, `${j.name}.webp`));
    console.log(`${j.name}: ${meta.width}×${meta.height}`);
    await ctx.close();
  }
  await browser.close();
})();
