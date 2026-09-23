# Portfolio Rebuild — Phase 0 Plan

_Written 2026-09-23. No code yet. The source of truth is `public/resume/Priyanshu_Vats_Resume_PV.pdf`._

**How I got the old site's content:** this session's network policy blocks the live site (`portfolio-seven-gold-54.vercel.app`), so I couldn't fetch it. Instead I took its content from the old repo's data files (`Pvats2003/portfolio`, `data/*.ts` at commit `9b950a6`), which are what the old site is built from. If the live site runs an older commit, a few lines may differ. Nothing from the old design, layout or components is reused.

## Decisions so far (Priyanshu, 2026-09-23)

| Q | Decision |
|---|---|
| 1 | New repo `Pvats2003/portfolio-v2`. PLAN.md moves here; the old repo's `claude/` branch stays untouched. |
| 2 | Default branch `main`. |
| 3 | Priyanshu installs the Vercel GitHub App for `portfolio-v2`, and imports the repo in Vercel himself if the connection still fails. |
| 4 | Priyanshu switches on Vercel Analytics once the project exists (reminder at Phase 5). |
| 5 | **`karavali.base44.app` is the live URL.** `karaval.base44.app` is a typo on the resume (it 404s); Priyanshu will fix the PDF. |
| 6 | **The live Karavali MVP is on Base44.** That's the only stack stated; nothing about Supabase or React. |
| 7 | **KYC is cut everywhere.** |
| 8 | **He doesn't own `priyanshuvats.com`.** Canonical URL and `og:url` use the Vercel URL until a domain is bought. |
| Direction | **A · Field Log** is the site identity (shift markers, status chips, timestamp column, IBM Plex Sans + Mono). `/work` case studies use C's long-form reading treatment (serif body, pull-quotes, generous measure) inside A's frame. A hybrid case-study page must be approved before DESIGN.md is written. |
| Serif | IBM Plex Serif for case-study reading (confirmed). |
| Headline | **Option C**: “Field operations lived in WhatsApp threads. I scoped, designed, and shipped the fix.” The proof strip directly below carries 10,000+ hours and 50+ field staff. |
| 9 | Answered by the Career OS README (github.com/Pvats2003/career_ops_intel): only **Greenhouse and Lever** adapters exist, so the old site's five named sources are cut. The README confirms 350 passing tests, clean ruff/mypy and no ORM–migration drift. |
| 10 | Answered by the Audit AI Copilot PRD v1.0: real personas (stretched finance controller, compliance-driven startup founder, internal audit professional) and user stories ranked P0–P2. |
| 12 | OCR form lessons answered by Priyanshu (see the City Ops OS case study). |
| 19 | Career OS repo is public; linked from its case study. |
| ANPR | Case study sourced from Priyanshu's B.Tech report (May 2026). Guide contact details and registration number are deliberately not published. |
| 16 | Agreed: no "built" in the headline, and never imply City Ops OS ran all 10,000+ hours. Headlines keep scale (what he ran) separate from the tool (what he designed and shipped). |

---

## 1. Stack proposal

| Layer | Choice | Why (one line) |
|---|---|---|
| Framework | **Next.js, latest stable (App Router)** | Your default. Static pages, built-in image and font handling, and it deploys to Vercel with zero config. |
| Language | **TypeScript, `strict`** | Your default. Typos in content files get caught before they ship. |
| Styling | **Tailwind CSS v4 with CSS-variable design tokens** | Your default. v4 reads tokens straight from CSS variables, so light and dark themes are the same code with different values. |
| Content | **Typed content files (`content/*.ts`), not MDX** — *deviation* | Every case study follows the same fixed template (TL;DR, constraints, decisions table, and so on), so structured, type-checked data fits better than free-form MDX, and a missing section fails the build instead of silently disappearing. |
| Fonts | **`next/font` with self-hosted, free-licence faces** | Your default. No layout shift and no request to Google at runtime. The pairing gets chosen in Phase 1. |
| Motion | **CSS only (no framer-motion)** — *deviation* | On the old site, framer-motion caused 270 ms of blocking time on mobile. CSS transitions plus `prefers-reduced-motion` do everything this site needs for about 0 KB of JS. |
| Command palette | **`cmdk`** (about 5 KB) — *deviation* | It's a battle-tested, accessible, keyboard-first palette. The old hand-built one had no arrow keys and no focus trap. |
| Diagrams | **Hand-built SVG React components** | Your requirement. They use theme colors and have a mobile layout that switches to vertical at 375 px. |
| OG images | **`next/og`** (per-page generated images) | Your requirement. Built into Next, so no extra dependency. |
| Analytics | **`@vercel/analytics`** (cookieless) | Your requirement. It needs Analytics switched on in the Vercel project, which **you** have to do (Q4). |
| Resume sync | **Your PDF stays canonical, and the build checks for drift** — *approved (Q14)* | The HTML resume is generated from `content/resume.ts`. Before every build, `scripts/check-resume.mjs` reads the text out of your PDF and fails the build if `resume.ts` has a line the PDF doesn't, or the PDF has text `resume.ts` doesn't, so the two can't silently drift. (The old site already drifted: it had the wrong city and a missing product.) |
| Hosting | **A new Vercel project**, previews on every push | Your requirement. It's blocked right now; see Q3. |
| Quality gates | ESLint, `tsc --noEmit`, a build-time content check (no leftover `TODO` in production strings unless intentionally shown), Lighthouse CI on preview | These enforce the Phase 4 bar automatically instead of by memory. |

---

## 2. Content inventory

**Tag key:** `R-…` = a line on your resume (IDs in Appendix A) · `B` = stated in your brief but **not on the resume** (I'll use it because you told me directly) · `O` = **old site only**, won't be used unless you confirm (Q9).

### Identity & contact
| Fact | Source |
|---|---|
| Priyanshu Vats | R-H1 |
| Title: "Product & Operations Builder · AI/Robotics Field Operations · 0→1 Internal Tools" | R-H2 |
| Based in Bengaluru, KA | R-H3 |
| Email priyanshu.vats03@gmail.com · LinkedIn `linkedin.com/in/priyanshuvats-5a68aa292` · GitHub `github.com/Pvats2003` | R-H3 |
| Phone +91-6206624775 (**shown on the site? Q11**) | R-H3 |
| Ships products end-to-end through AI-assisted development (Claude Code) | R-S4 |
| Target roles: APM / Product Associate / Product Ops / AI Product → Founder's Office / Strategy & Ops / BizOps → AI/robotics ops | B |
| Background story: Bihar → MIT Manipal ECE → field ops in Andhra Pradesh → building products | B (the resume only shows the ITC internship in Munger, Bihar, not where you're from) |

### Instawork Robotics Labs (flagship context)
| Fact | Source |
|---|---|
| Operations Management Intern, Field Operations · May 2026 – Present | R-E1 |
| Egocentric vision-language-action (VLA) training data for robotics · Andhra Pradesh & Karnataka | R-E1.0 |
| Runs day-to-day field execution across AP cities, primarily Rajampet and Kadapa | R-E1.1 |
| Coordinates 50+ Field Officers, Data Captains and Data Collectors | R-E1.1, R-S1 |
| 10,000+ recording hours logged | R-E1.1, R-S1 |
| Owns task/activity libraries and SOD/MOD/EOD reporting | R-E1.1 |
| Sourced and validated walk-in, fixed-premises recording sites | R-E1.2 |
| Authored the South India VLA Field Recording Guide: 116 businesses, 19 categories | R-E1.2 |
| Cluster-wise lead directories with two-shift daily field plans for the Rajampet–Kadapa corridor | R-E1.2 |
| High-dexterity business directories (tailors, cobblers, goldsmiths, repair shops) across 10 Bengaluru neighbourhoods | R-E1.2 |
| Diagnosed that field updates lived in unstructured WhatsApp threads and scattered Sheets | R-E1.3, R-S2 |
| **Prototype 1: command center**: 10-sheet workbook, Apps Script JSON API, automated Slack/email alerts, dashboard refreshing every 30 s | R-E1.3 |
| **Prototype 2: OCR form**: React + Claude Vision reading recording metadata from phone screenshots | R-E1.4 |
| OCR form lessons (small-screen OCR, parsing fenced JSON, image cropping) and that it **isn't in use** | B (from your earlier brief; I need your reason, Q12) |
| **Prototype 3: OpsIntel**: WhatsApp parser with a Node.js/WebSocket dashboard | R-E1.4 |
| Testing all three showed one city's ops would sprawl across four separate systems, which led directly to City Ops OS | R-E1.4 |
| Instawork's name: "Instawork Robotics Labs" everywhere | R-E1 |

### City Ops OS (the climax)
| Fact | Source |
|---|---|
| "Local-First Operating System for City Field Ops" · Live · 2026 – Present | R-P1 |
| React · Zustand · localStorage · Firebase Hosting | R-P1 |
| Live at `city-ops-cf81f.web.app` (**link only after Q13c**) | R-P1 |
| The four systems it replaced: Sheets, Apps Script, a standalone OCR form, a Node.js backend | R-P1.1 |
| Consolidated into a single per-city operating view | R-P1.1 |
| Design now being integrated into Instawork's internal ops tool | R-P1.1, R-S3 |
| Local-first, zero-cost: all state in the browser; no backend, servers or paid APIs | R-P1.2 |
| Needs no accounts, infra budget or setup; deliberately traded away cross-device sync | R-P1.2 |

### Career OS
| Fact | Source |
|---|---|
| "Autonomous Job Discovery & Application Agent" · Ongoing | R-P2 |
| Multi-source discovery with cross-source dedup; deterministic + AI-assisted matching; resume/cover-letter generation; application assistant; web dashboard | R-P2.1 |
| Every candidate fact carries source, confidence and verified metadata | R-P2.2 |
| Hard stops (salary, visa, CAPTCHA/MFA) escalate to a human; nothing auto-submits | R-P2.2 |
| 350+ passing automated tests | R-P2.2 |
| "Automate the work. Never automate trust." | B (you asked to keep it; it came from the old site) |
| 5 named sources (Remotive, Arbeitnow, Adzuna, Greenhouse, Lever); "0 ORM-migration drift"; Ruff/Mypy clean; SQLAlchemy/Pydantic/Anthropic API; pipeline Discover→Match→Generate→Review→Apply; structured-ATS vs browser-assisted submission | **O** |

### Karavali
| Fact | Source |
|---|---|
| "Community-Driven Local Discovery App" · Solo founder · Apr 2026 – Present | R-P4 |
| Live MVP at `karavali.base44.app` (resume says `karaval…`, a confirmed typo; Q5) | R-P4 + Priyanshu |
| A gap in community-sourced discovery for coastal Karnataka | R-P4.1 |
| Pivoted from a campus travel app to a discovery platform | R-P4.1 |
| AI recommendations + gamification for Udupi and Dakshina Kannada | R-P4.1 |
| Live MVP shipped in one week | R-P4.1 |
| Stack: React + Supabase | **O, contradicted by the Base44 host (Q6)** |

### Audit AI Copilot
| Fact | Source |
|---|---|
| "AI Document Review Tool" · FastAPI · Next.js · Groq · Ongoing | R-P3 |
| Directed the build; auditors upload documents and query anomalies in natural language | R-P3.1 |
| Deterministic rule engine + LLM review layer + PDF reports | R-P3.1 |
| Scoped across three personas with P0–P2 prioritised user stories and a full PRD (YC: never shown, Priyanshu's decision) | R-P3.1 |
| Persona names (Auditor / Reviewer / Compliance Lead) and MoSCoW contents (ingestion, AI Q&A, flagging engine, exportable report) | **O** (for the persona cards and MoSCoW board you asked for, I need the real contents, Q10) |

### ANPR · ITC · education · leadership · skills
| Fact | Source |
|---|---|
| ANPR: B.Tech final-year project, Jan – May 2026; real-time plate detection + reading; YOLOv8n (89.1% mAP@50), OpenCV, Tesseract OCR | R-P5, R-P5.1 |
| ITC Limited, Munger, Bihar: Electrical / Powerhouse Intern, Jun – Jul 2024 | R-E2 |
| Mapped power distribution across 15+ sub-distribution boards (RUPS, bypass, DG supply); switchover logic and single points of failure; documented for operator training and stakeholder presentations | R-E2.1 |
| B.Tech ECE, MIT Manipal, May 2026 | R-ED1 |
| Certifications: Google UX Design (Coursera), IBM Business Analyst, IBM Program Manager | R-ED1.1 |
| Revels (Painting & Publicity): led a 10-member core team (2025) and 30 volunteers (2024) | R-ED1.2 |
| Skills, as four groups: Product · Operations · AI/Product Development (Claude Code, LLM/OCR integrations, React web apps, Apps Script automations) · Tools | R-K1–K4 |

**Not used anywhere, because it isn't on the resume:** user or traction numbers for any product, a count of cities, Karavali users, Audit AI customers, and any real screenshot of an internal tool.

---

## 3. Sitemap

```
/                          Home (order per your Phase 2 brief)
/work/city-ops-os          Flagship: Instawork → City Ops OS (decision log)
/work/career-os            Selected work
/work/karavali             Selected work (with the pivot before/after)
/work/audit-ai-copilot     Selected work (persona cards + MoSCoW board)
/work/anpr                 Archive
/work/itc-powerhouse       Archive
/about                     Short, human story + certifications + TODO paragraph
/resume                    HTML resume + exact PDF download
/resume/Priyanshu_Vats_Resume_PV.pdf   Static file (the canonical PDF)
404                        On-brand not-found page
/lab/a  /lab/b  /lab/c     Phase 1 only: three visual directions, deleted after you pick
(generated) /sitemap.xml · /robots.txt · /opengraph-image per page
```

The URLs are new, so any old `/work/instawork` or `/work/opsintel` links shared on LinkedIn would 404. **Proposal:** add permanent redirects: `/work/instawork` and `/work/opsintel` → `/work/city-ops-os`, `/work/audit-ai` → `/work/audit-ai-copilot`, `/work/itc` → `/work/itc-powerhouse`.

**Content files the owner edits:** `content/site.ts` (headline, stats, contact), `content/projects/*.ts` (one file per case study), `content/experience.ts`, `content/resume.ts`.

---

## 4. Open questions

Questions 1–8 block Phase 1. The rest can be answered any time before Phase 3.

**Setup & access**
1. **Where does the new codebase live?** This session can only reach `Pvats2003/portfolio`. My options, recommended first:
   **(a)** a new GitHub repo `Pvats2003/portfolio-v2` (cleanest; I can create it if you confirm, and you'd add it to this session);
   **(b)** a fresh, history-free branch inside the current repo;
   **(c)** a `v2/` folder in the current repo.
   (b) and (c) keep the old site's repo untouched on its own branch either way.
2. **Branch name:** this session is set up to push to `claude/priyanshu-vats-portfolio-ir3h1m`. OK to create `portfolio-v2` (or `main` in the new repo) instead?
3. **Vercel:** the Vercel account connected to this session (`pvats2003's projects`) shows **zero projects** and returned *"403: You don't have permission to create the project"* for this repo three times. The live site must be on a different Vercel account or team. To get you a preview URL I need one of: (i) the Vercel GitHub App installed with access to the new repo, from [github.com/settings/installations](https://github.com/settings/installations); or (ii) this session's Vercel connection extended to the team that owns the live site.
4. Once the new Vercel project exists, can you switch on **Analytics** in its dashboard? (It's free, and I can't turn it on from here.)
5. **Karavali URL:** I can't test `karavali.base44.app` vs `karaval.base44.app` from here, because this session's network policy blocks both. Either tell me which one works, or allow `*.base44.app`, `*.web.app` and `*.vercel.app` in the environment's network settings and I'll test them myself.
6. **Karavali stack:** the old site says React + Supabase, but the `base44.app` host suggests it was built on Base44. What did you actually use? Until you answer, I'll state no stack at all.
7. ~~Lightweight KYC~~ Answered: cut.
8. **Domain:** do you own `priyanshuvats.com`? If yes, it becomes the canonical URL. If not, I'll use the new Vercel URL until you pick a domain.

**Content (before Phase 3)**

9. **Old-site-only details:** keep or cut? Career OS's 5 named sources, "0 ORM-migration drift", Ruff/Mypy, SQLAlchemy/Pydantic, and the Discover→Apply pipeline. My default is to **cut** anything you don't confirm.
10. **Audit AI:** for the persona cards and MoSCoW board, give me the three real personas and your real Must/Should/Could/Won't lists (from your PRD). Otherwise they'll ship as a visible `TODO` rather than invented contents.
11. **Phone number:** it's on your resume. Show it on the site? I recommend **not** (scrapers), keeping email + LinkedIn + GitHub, and leaving it only in the PDF.
12. **OCR form:** in your own words, why isn't it in use, and what did it teach you? (The fenced-JSON / small-screen / cropping lessons came from your earlier brief. Confirm they're accurate.)
13. **City Ops OS:**
    (a) roughly when did you start and ship it?
    (b) "design being integrated into Instawork's internal ops tool": are you involved in that integration, or has it been handed over? That changes the Outcome wording.
    (c) Is `city-ops-cf81f.web.app` safe to link publicly? It's already printed on your resume, but the brief says to confirm.
14. **Resume sync:** OK with my approach (your PDF stays canonical, the HTML resume is generated from `content/resume.ts`, and the build fails if they drift)? When you update your resume, you replace the PDF and edit the one matching file.
15. **Scale wording:** the resume names Rajampet, Kadapa and "Andhra Pradesh cities" but gives no number of cities. I'll write "across Andhra Pradesh (Rajampet, Kadapa) and Karnataka" rather than a count. Is there a number you're happy to state?
16. **Headline caution for Phase 2:** the example "…One operating system I built to run it" could read as if City Ops OS ran all 10,000+ hours, and "built" conflicts with rule 3. I'll offer versions that keep the punch without either problem. Just flagging it now.
17. **Photo:** do you want a photo of yourself on the About page? None exists in the repo, so you'd need to provide one. My default is none.
18. **Career OS / Audit AI dates:** the resume says "Ongoing" with no start date. Give me a start month, or I'll show "Ongoing" only.
19. **GitHub:** are any of these projects' repos public, so I can link to them? My default is the profile link only.

---

## 5. What happens next

Once questions 1–8 are answered: **Phase 1**. I scaffold the new repo and build `/lab/a` (Field Log), `/lab/b` (Control Room) and `/lab/c` (Editorial Case Files). Each is a real, responsive hero + stat strip + project card with light and dark themes, AA contrast and reduced-motion support. Then I send you a preview link to judge in a browser.

---

## Appendix A — Resume line IDs

| ID | Line (abridged) |
|---|---|
| R-H1 | PRIYANSHU VATS |
| R-H2 | Product & Operations Builder · AI/Robotics Field Operations · 0→1 Internal Tools |
| R-H3 | Bengaluru, KA · phone · email · LinkedIn · GitHub |
| R-S1 | ECE graduate running egocentric AI/robotics data-collection operations across AP and KA: 50+ field staff coordinated and 10,000+ recording hours logged |
| R-S2 | Diagnosed fragmented WhatsApp and Sheets workflows, prototyped tools to fix them |
| R-S3 | …consolidated the lessons into City Ops OS, whose design is now being integrated into Instawork's internal ops tool |
| R-S4 | Ships products end-to-end through AI-assisted development (Claude Code) |
| R-E1 | Operations Management Intern, Field Operations · Instawork Robotics Labs · May 2026 – Present |
| R-E1.0 | Egocentric VLA training data for robotics · Andhra Pradesh & Karnataka |
| R-E1.1 | Day-to-day field execution… Rajampet and Kadapa… 50+ Field Officers, Data Captains, Data Collectors… 10,000+ recording hours; task/activity libraries and SOD/MOD/EOD reporting |
| R-E1.2 | Site sourcing: South India VLA Field Recording Guide (116 businesses, 19 categories), cluster-wise lead directories with two-shift plans (Rajampet–Kadapa), high-dexterity directories across 10 Bengaluru neighbourhoods |
| R-E1.3 | Diagnosed WhatsApp/Sheets problem; command center: 10-sheet workbook, Apps Script JSON API, Slack/email alerts, 30 s dashboard |
| R-E1.4 | React + Claude Vision OCR form; OpsIntel (WhatsApp parser + Node.js/WebSocket dashboard); four-systems finding → City Ops OS |
| R-E2 | Electrical / Powerhouse Intern · ITC Limited, Munger, Bihar · Jun – Jul 2024 |
| R-E2.1 | 15+ sub-distribution boards (RUPS, bypass, DG); switchover logic, single points of failure; operator training + stakeholder presentations |
| R-P1 | City Ops OS: Local-First Operating System for City Field Ops · Live · 2026 – Present · React · Zustand · localStorage · Firebase Hosting · city-ops-cf81f.web.app |
| R-P1.1 | Four systems (Sheets, Apps Script, OCR form, Node.js backend) → single per-city view; design being integrated into Instawork's internal ops tool |
| R-P1.2 | Local-first, zero-cost; no accounts/infra/setup; traded away cross-device sync |
| R-P2 | Career OS: Autonomous Job Discovery & Application Agent · Ongoing |
| R-P2.1 | Modular job-search agent: discovery from Greenhouse and Lever with cross-source dedup, deterministic + AI-assisted matching; resume tailoring, application assistant and dashboard in progress (updated resume, Sep 2026) |
| R-P2.2 | Zero fabrication: source/confidence/verified metadata; hard stops (salary, visa, CAPTCHA/MFA); nothing auto-submits; 350+ passing tests |
| R-P3 | Audit AI Copilot: AI Document Review Tool · FastAPI · Next.js · Groq · Ongoing |
| R-P3.1 | Directed the build; upload + natural-language anomaly queries; rule engine + LLM review + PDF reports; three personas, P0–P2 prioritised user stories, full PRD (updated resume, Sep 2026) |
| R-P4 | Karavali: Community-Driven Local Discovery App · Solo founder · Apr 2026 – Present · Live MVP · karavali.base44.app (typo fixed in the Sep 2026 PDF) |
| R-P4.1 | Coastal Karnataka discovery gap; pivot from campus travel app; AI recommendations + gamification for Udupi and Dakshina Kannada; live MVP in one week |
| R-P5 | ANPR · B.Tech Final Year Project · Jan – May 2026 |
| R-P5.1 | Real-time plate detection/reading: YOLOv8n (89.1% mAP@50), OpenCV, Tesseract OCR |
| R-K1–K4 | Skills: Product / Operations / AI/Product Development / Tools |
| R-ED1 | B.Tech ECE · MIT Manipal · May 2026 |
| R-ED1.1 | Google UX Design (Coursera), IBM Business Analyst, IBM Program Manager |
| R-ED1.2 | Revels (Painting & Publicity): 10-member core team (2025), 30 volunteers (2024) |
