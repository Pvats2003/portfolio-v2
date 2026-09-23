// Resume drift check. Runs before every build (`prebuild`) and on its own with `npm run check:resume`.
//
// The PDF in public/resume/ is canonical; content/resume.ts is its line-for-line transcription.
// This fails the build if either side has text the other doesn't:
//   1. every string in content/resume.ts must appear in the PDF, and
//   2. once those strings are removed from the PDF text, nothing but headings and labels may be left.
// Links in resume.ts must also match the links embedded in the PDF.

import { readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import ts from 'typescript';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';

const ROOT = process.cwd();
const PDF = join(ROOT, 'public/resume/Priyanshu_Vats_Resume_PV.pdf');
const SOURCE = join(ROOT, 'content/resume.ts');

// Text that is in the PDF on purpose but not in resume.ts. Keep this list short and explain each entry.
const LABELS = [
  'experience', 'products', 'skills', 'education & leadership', // section headings
  'certifications:', 'product:', 'operations:', 'ai/product development:', 'tools:', // row labels
];
const DELIBERATELY_OMITTED = [
  'city-ops-cf81f.web.app', // not linked on the site until Priyanshu confirms it's public (TODO.md)
];

/** Lower-case, straight quotes, one kind of dash, single spaces. */
function normalize(s) {
  return s
    .toLowerCase()
    .replace(/[‘’ʼ]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—‑]/g, '–')
    .replace(/\s+/g, ' ')
    .trim();
}

async function pdfText() {
  const doc = await getDocument({ data: new Uint8Array(await readFile(PDF)), verbosity: 0 }).promise;
  const lines = [];
  const links = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    let lastY = null;
    let line = '';
    for (const item of (await page.getTextContent()).items) {
      if (!('str' in item)) continue;
      const y = Math.round(item.transform[5]);
      if (lastY !== null && Math.abs(y - lastY) > 2) {
        lines.push(line);
        line = '';
      }
      line += item.str;
      lastY = y;
    }
    lines.push(line);
    for (const a of await page.getAnnotations()) if (a.url) links.push(a.url);
  }
  // A word split across lines with a hyphen is joined back together.
  const text = lines.reduce((acc, l) => (/[a-z]-$/i.test(acc) ? acc + l : `${acc} ${l}`), '');
  return { text: normalize(text), links };
}

async function resumeStrings() {
  const src = await readFile(SOURCE, 'utf8');
  const js = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
  const tmp = join(tmpdir(), `resume-${process.pid}.mjs`);
  await writeFile(tmp, js);
  try {
    const mod = await import(pathToFileURL(tmp).href);
    const strings = [];
    const hrefs = [];
    const walk = (v, key) => {
      if (typeof v === 'string') (key === 'href' ? hrefs : strings).push(v);
      else if (Array.isArray(v)) v.forEach((x) => walk(x));
      else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) walk(x, k);
    };
    for (const [name, value] of Object.entries(mod)) if (name !== 'RESUME_PDF') walk(value);
    return { strings, hrefs };
  } finally {
    await rm(tmp, { force: true });
  }
}

const { text, links } = await pdfText();
const { strings, hrefs } = await resumeStrings();
const problems = [];

// 1. resume.ts → PDF. Meta lines like "Live · 2026 – Present · React" are split across PDF lines,
//    so strings with " · " are checked part by part.
const parts = strings.flatMap((s) => (s.includes(' · ') ? s.split(' · ') : [s])).map(normalize).filter(Boolean);
for (const p of parts) if (!text.includes(p)) problems.push(`In content/resume.ts but not in the PDF:\n    "${p}"`);

// 2. PDF → resume.ts: remove everything resume.ts accounts for; only labels and punctuation may remain.
let rest = text;
// Longest first, so "products" (a heading) goes before "product" (a skills group) can eat part of it.
for (const p of [...parts, ...LABELS, ...DELIBERATELY_OMITTED].sort((a, b) => b.length - a.length)) rest = rest.split(p).join(' ');
const leftover = rest.split(' ').filter((w) => /[a-z0-9]/.test(w));
if (leftover.length) problems.push(`In the PDF but not in content/resume.ts:\n    "${leftover.join(' ')}"`);

// 3. Links.
const pdfLinks = new Set(links.map((u) => u.replace(/\/$/, '')));
for (const h of hrefs) if (!pdfLinks.has(h.replace(/\/$/, ''))) problems.push(`Link in content/resume.ts but not in the PDF: ${h}`);

if (problems.length) {
  console.error(
    `\nResume drift check failed: public/resume/Priyanshu_Vats_Resume_PV.pdf and content/resume.ts disagree.\n` +
      `Update content/resume.ts to match the PDF (or the PDF to match), then build again.\n\n  - ${problems.join('\n  - ')}\n`,
  );
  process.exit(1);
}
console.log(`Resume drift check passed: ${parts.length} resume.ts strings and ${hrefs.length} links match the PDF.`);
