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

## Visual-first redesign (in review on branch `visual-first`)
- [ ] **(you)** Review the new homepage and City Ops OS page, then I'll do the other five case studies.
- [ ] **(you)** Re-attach three screenshots that didn't reach me: Karavali Explore, Karavali Plans, and Audit AI with the sample loaded.
- [ ] **(you)** The field officer screenshot showed "Iliyas", "Shakthi Welding Shop" and "Balaji Dhaba". I replaced them with demo text (no real field-worker names, rule 2). If they're fictional, say so and I'll restore them.
- [ ] **(you)** Audit AI's header says "Rule Engine + GPT-4o-mini"; your resume and the site say Groq. Which is right?
- [ ] **(you)** Career OS, ANPR and ITC have no screenshots, so their cards show small flow diagrams. Send screenshots (e.g. Career OS CLI output, ANPR detection frames without readable private plates) if you have them.

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
