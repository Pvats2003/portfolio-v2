@AGENTS.md

# Portfolio v2 — conventions

## Source of truth
- `public/resume/Priyanshu_Vats_Resume_PV.pdf` is canonical. Every fact on the site must trace to a resume line (IDs in `PLAN.md`, Appendix A) or to an explicit answer from Priyanshu recorded in `PLAN.md`.
- If the site and the resume disagree, the resume wins. List the conflict for Priyanshu instead of guessing.

## Non-negotiables
1. **Zero fabrication.** No invented metrics, testimonials, logos, users, quotes or outcomes. Missing data → a visible `TODO(priyanshu): …` in the UI **and** an entry in `TODO.md`.
2. **Confidentiality.** No real field-worker names, faces, phone numbers, WhatsApp screenshots, internal Instawork dashboards, client names or addresses. Recreate internal tools with synthetic data, labelled "Illustrative — synthetic data".
3. **Honest AI-assisted framing.** Use "designed", "directed the build", "scoped", "shipped". Never claim hand-written code. Present Claude Code as a deliberate choice.
4. Use "Instawork Robotics Labs" (never "Instawork AI Labs").
5. Don't imply City Ops OS ran all 10,000+ recording hours. Keep scale (what he ran) and tool (what he designed) as separate claims.

## Where things live
- `content/` — all copy, stats and project data (typed TS files). Components never hard-code copy.
- `app/globals.css` — design tokens as CSS variables (Paper light + Night shift dark), mapped to Tailwind via `@theme inline`.
- `content/resume.ts` — line-for-line transcription of the resume PDF; other content files import facts from it.
- `content/site.ts` (hero, proof, how I work, contact, about, record) · `content/work.ts` (homepage cards) · `content/projects/*.ts` (case studies).
- `DESIGN.md` — the Field Log identity: tokens, type, layout, motifs, motion. Follow it for any new UI.
- `components/site/LogSection.tsx` — the timestamp-column section every page is built from.
- `content/palette.ts` — what the ⌘K palette offers (`components/palette/`; cmdk inside a native `<dialog>`, lazy-loaded on first open).
- `lib/seo.ts` — `pageMetadata()` gives every page its title, description, canonical URL and OG/X tags. Every new page must call it.
- `lib/og.tsx` + `opengraph-image.tsx` files — sharing images rendered with `next/og` from content; fonts in `assets/fonts/` (OFL).
- `app/sitemap.ts`, `app/robots.ts`; JSON-LD `Person` lives on the homepage (`app/page.tsx`).
- `lib/analytics.ts` — the only custom events: `resume_download`, `contact_click`, `case_study_read`. `ClickTracker` recognises resume/contact links by href, so plain links are tracked automatically.

## Build rules
- Next.js 16 App Router, TypeScript strict, Tailwind v4, `next/font` (self-hosted, free-licence faces).
- Motion: CSS only, always gated by `prefers-reduced-motion: no-preference`. Never animate the headline or delay reading.
- Every text/background pair must pass WCAG AA (4.5:1 body, 3:1 large text) in **both** themes.
- Fonts load in the root layout. Plex Serif has `preload: false` there; `app/work/layout.tsx` loads it again with preload on, so case studies (serif above the fold) get no font shift. No italic faces. Keep new faces out unless DESIGN.md changes.
- Indexing: `INDEXABLE` in `content/site.ts` stays `false` until Priyanshu says "go live".
- Vercel Analytics renders only when `process.env.VERCEL` is set, so local builds have no 404ing script.
- Before committing: `npm run lint && npm run typecheck && npm run build`.

## Git
- Default branch `main`. Small, logical commits.
