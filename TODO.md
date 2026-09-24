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
- [x] Karavali: Discover (hero) and the “Match your vibe” planner (annotated); Plans and Events skipped (Events screenshot deleted).
- [ ] **(you)** These screenshots still haven't reached me. They're not on GitHub (`origin/visual-first` had no new commits, Sep 23), and images pasted into chat don't save as files. Upload them as files (like the resume PDFs), or commit them to `public/work/<slug>/` on GitHub and check the commit shows up:
  - new City Ops manager screenshot with demo data (the old one, with 0.0h and a test item, stays until then — on this branch only);
  - Karavali Explore, and the “Your AI Itinerary” preview (both were pasted into chat, so they didn't save as files);
  - Audit AI results screen after running the sample (it slots into "What I built", where a hidden TODO marks the spot).
- [x] Audit AI model: GPT-4o-mini (OpenAI) — the case study says so. **(you)** Your resume PDF still says “FastAPI · Next.js · Groq”; the /resume page mirrors the PDF, so it keeps saying Groq until you replace the PDF. After that, update `content/resume.ts` to match (the build's drift check will list the exact line).
- [x] Career OS, ANPR, ITC keep diagrams for now.

## Visual upgrade v3 (branch `visual-v3`, waiting for approval)
- [ ] **(you)** Vercel: the live URL still serves Phase 2. Pushes reach Vercel, and `main` builds cleanly from a fresh clone, so check Deployments (see the chat for exactly what to look for).
- [x] City Ops screenshots replaced (Sep 24): the real app's production build, run locally in demo mode (no Firebase) with a made-up Rajampet dataset, clock frozen at 5:45 PM IST — 18.6h / 20h (93%), fleet 3/3, completed / active / pending visits. Tagged "Demo data". Generator: made-up names only, no phone numbers.
- [ ] **(you)** Audit AI: still an empty input screen; the results screen after running the sample would be much stronger.
- [ ] **(you)** Send screenshots as files (paperclip) in a message on their own — pasted images don't arrive.

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
