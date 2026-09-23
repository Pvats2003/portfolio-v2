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
- `app/globals.css` — design tokens as CSS variables (light + dark), mapped to Tailwind via `@theme inline`.
- `app/lab/*` — **Phase 1 only.** Deleted once a direction is chosen.

## Build rules
- Next.js 16 App Router, TypeScript strict, Tailwind v4, `next/font` (self-hosted, free-licence faces).
- Motion: CSS only, always gated by `prefers-reduced-motion: no-preference`. Never animate the headline or delay reading.
- Every text/background pair must pass WCAG AA (4.5:1 body, 3:1 large text) in **both** themes.
- Load a font only on the pages that use it (a shared font module makes every page preload every font).
- Before committing: `npm run lint && npm run typecheck && npm run build`.

## Git
- Default branch `main`. Small, logical commits.
