# TODO

Items waiting on Priyanshu are marked **(you)**. Every `TODO(priyanshu)` shown on the site is listed here.

## Resume ↔ source mismatches (please fix the resume, or tell me the site is wrong)
- [ ] **(you)** **Career OS — "resume/cover-letter generation" and "a web dashboard".** The project README says resume tailoring and PDF generation are *not built yet*, and `job-agent dashboard` exits "not implemented yet"; the FastAPI dashboard is listed as not started. The site now describes only what the README says exists. Suggest resume wording: "…deterministic + AI-assisted matching, a resume-consistency validator, and an application engine that drafts only verifiable answers."
- [ ] **(you)** **Audit AI Copilot — "MoSCoW".** The PRD ranks user stories P0 / P1 / P2, not MoSCoW. The site shows P0 · Must / P1 · Should / P2 · Later and flags it.
- [ ] **(you)** **Audit AI Copilot — "a Y Combinator application".** The PRD (May 2026) lists "Position for YC application" as a goal. Was it actually submitted? The site doesn't claim it until you confirm.
- [ ] **(you)** **Karavali URL typo** — `karaval.base44.app` → `karavali.base44.app` in the PDF, then replace `public/resume/Priyanshu_Vats_Resume_PV.pdf`. (The HTML resume already uses the correct URL.)
- [ ] Note, no action needed: the resume calls ANPR "real-time". Detection is (~32 ms per frame on a CPU); OCR takes ~1.2 s per plate. The case study states both numbers.

## Waiting on you — shown on the site as visible TODOs
**City Ops OS**
- [ ] What the command center actually changed. If there's no number, say "qualitative only" and describe it.
- [ ] Other real constraints (budget, connectivity, devices, engineering support).
- [ ] Is `city-ops-cf81f.web.app` safe to link publicly? What's your role in the integration?
- [ ] What you learned · what's next (1–2 sentences each).

**Career OS**
- [ ] Two or three lessons, in your own words.

**Karavali**
- [ ] What showed you the gap.
- [ ] Why you pivoted, and what you let go of from the campus travel idea.
- [ ] Why Base44, and what you traded for that speed.
- [ ] What you learned · what's next.

**Audit AI Copilot**
- [ ] Confirm the P0/P1/P2 → Must/Should/Later reading.
- [ ] Current status: is the MVP live for users, and was the YC application submitted?
- [ ] Any lessons so far, in your own words.

**ANPR**
- [ ] Anything else you took from the project, in your own words.

**ITC powerhouse**
- [ ] What it taught you that you still use.

**About**
- [ ] A personal paragraph in your own words.

## Still-open questions (PLAN.md §4)
- [ ] **(you)** Q11 — Show your phone number on the site? Default: no (PDF only).
- [ ] **(you)** Q13 — City Ops OS start and ship months (the case says "2026 – Present").
- [ ] **(you)** Q14 — Approve the resume sync approach (PDF canonical + build-time drift check).
- [ ] **(you)** Q15 — Number of cities you're happy to state (default: name Rajampet and Kadapa, no count).
- [ ] **(you)** Q17 — Photo on About? Default: none.
- [ ] **(you)** Q18 — Start month for Career OS (Audit AI now shows the PRD date, May 2026).

## Next build steps
- [ ] Phase 4 — ⌘K palette (`cmdk`), per-page OG images, JSON-LD `Person`, `sitemap.xml` / `robots.txt`, Vercel Analytics events, README "how to update" guide.
- [ ] Phase 5 — remind Priyanshu to switch on Vercel Analytics; Lighthouse on the live preview; turn indexing on at "go live".
