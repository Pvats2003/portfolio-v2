# TODO

Items waiting on Priyanshu are marked **(you)**. Every `TODO(priyanshu)` shown on the site is listed here.

## Resume ↔ source mismatches
- [x] Career OS bullet now matches the README (updated resume, Sep 2026).
- [x] Audit AI Copilot now says P0–P2, matching the PRD; the board shows P0 / P1 / P2.
- [x] Karavali URL fixed in the PDF; `public/resume/Priyanshu_Vats_Resume_PV.pdf` replaced.
- [x] Y Combinator: not shown anywhere on the site (your decision).
- [ ] Note, no action needed: the resume calls ANPR "real-time". Detection is (~32 ms per frame on a CPU); OCR takes ~1.2 s per plate. The case study states both numbers.

## Waiting on you — hidden on the live site until you answer
These questions need your own words, so they were hidden rather than filled with invented text. A chapter with nothing else in it (e.g. "What I learned" on City Ops OS, Career OS, Karavali and ITC; "Outside the resume" on About) is hidden too. Each one reappears as soon as you replace its TODO with your answer.
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
- [ ] Current status: is the MVP live for users?
- [ ] Any lessons so far, in your own words.

**ANPR**
- [ ] Anything else you took from the project, in your own words.

**ITC powerhouse**
- [ ] What it taught you that you still use.

**About**
- [ ] A personal paragraph in your own words.

## Visual-first redesign (branch `visual-first`, waiting for approval before merging to main)
- [x] Homepage and City Ops OS approved; the other five case studies done the same way.
- [x] Names in the field officer screenshot are real, so they stay replaced with demo text.
- [x] Karavali: Discover only for now; Plans and Events skipped (Events screenshot deleted).
- [ ] **(you)** These screenshots didn't reach me — images pasted into chat don't land as files. Please upload them as files (like the resume PDFs) or add them to `public/work/<slug>/` on GitHub:
  - new City Ops manager screenshot with demo data (the old one, with 0.0h and a test item, stays until then — on this branch only);
  - Karavali Explore;
  - Audit AI results screen after running the sample (it slots into "What I built", where a hidden TODO marks the spot).
- [ ] **(you)** Audit AI model: your message still had the "[Groq / GPT-4o-mini]" placeholder. Sources disagree: resume PDF, Word resume and PRD say Groq (LLaMA 3.1 8B, "OpenAI fallback if needed"); the app header says GPT-4o-mini; the PM resume says "OpenAI API". The case study now just says "an LLM layer" until you confirm. If it's GPT-4o-mini, the resume line "FastAPI · Next.js · Groq" needs changing.
- [x] Career OS, ANPR, ITC keep diagrams for now.

## Still-open questions (PLAN.md §4)
- [x] Q11: phone number shown (contact section, footer, resume page, ⌘K, structured data).
- [ ] **(you)** Q13 — City Ops OS start and ship months (the case says "2026 – Present").
- [ ] **(you)** Q15 — Number of cities you're happy to state (default: name Rajampet and Kadapa, no count).
- [ ] **(you)** Q17 — Photo on About? Default: none.
- [ ] **(you)** Q18 — Start month for Career OS (Audit AI now shows the PRD date, May 2026).

## Next build steps
- [x] Phase 4: ⌘K palette (`cmdk`), per-page OG images, JSON-LD `Person`, `sitemap.xml` / `robots.txt`, canonical URLs, Vercel Analytics events, README "how to update" guide.
- [x] Resume drift check (Q14): runs before every build; see CLAUDE.md.
- [x] Vercel Web Analytics enabled (Hobby). Custom events stay in the code but nothing relies on them; page views are the signal.
- [ ] **(you)** Phase 5: paste the PageSpeed Insights mobile score and LCP for the live preview (this session can't reach vercel.app; the last reply had the placeholder, not the numbers). Local simulated mobile LCP varies 1.9–2.6 s and is the same with every client component removed, so it's the React/Next runtime rather than site code. With real throttling (Lighthouse devtools mode) LCP is 1.7 s.
- [x] Go live: `INDEXABLE` is `true`; unanswered TODOs hidden on the live site. Still on the Vercel URL (no domain).
- [ ] **(you)** The old portfolio (repo `Pvats2003/portfolio` and its Vercel project/URL) is untouched. Say if you want it redirected to the new site or taken down.
