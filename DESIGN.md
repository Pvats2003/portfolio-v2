# DESIGN — Field Log

The site reads like an operations log kept by someone who writes things down: dated entries, shift markers, status chips, ruled lines on warm paper. Case studies keep that frame and switch the body to a long-form serif, so reading a decision log feels like reading a well-set essay.

Tokens live in `app/globals.css`. This file says how to use them.

---

## 1. Colour

Two themes: **Paper** (light) and **Night shift** (dark). The OS preference decides by default; the header toggle overrides it, and the choice is saved.

| Token | Paper | Night shift | Use for |
|---|---|---|---|
| `bg` | `#f3eee4` | `#17140f` | Page background |
| `surface` | `#fbf8f2` | `#201c16` | Cards, stat cells, tables |
| `ink` | `#1e1a15` | `#eee7da` | Body text, headings, primary buttons (as background) |
| `muted` | `#5e564b` | `#aba190` | Secondary text, labels, metadata |
| `line` | `#d6ccbb` | `#3b352c` | Rules, borders, dividers |
| `accent` | `#a63a1b` | `#f08a5d` | Shift markers, the headline's second sentence, trade-offs, TODOs, focus ring |
| `on-accent` | `#fbf8f2` | `#17140f` | Text on an accent background |
| `ok` | `#2f6b3a` | `#7cc48a` | The LIVE chip and "gained" only |

**Rules**
- Accent is a red pencil, not paint. Use it on small things: markers, one phrase, a rule, a chip. Never fill large areas with it.
- `ok` green means "live / working / gained". Don't use it for decoration.
- Contrast is checked: every text pair above is ≥ 4.5:1 in both themes; the lowest is `ok` on `bg` in Paper at 5.5:1. Don't use opacity to fade text; use `muted` instead. Faded text failed AA in the lab.
- The one inverted surface is the case-study **turning point** (`bg-ink text-bg`). Use it at most once per page. Inside it, secondary text uses `text-line`, which clears 9.8:1 in both themes.

## 2. Type

One superfamily, IBM Plex (SIL Open Font Licence, self-hosted with `next/font`):

| Face | Role | Where |
|---|---|---|
| **Plex Sans** 400 / 500 / 600 | UI, headings, body on non-case pages | Everything by default |
| **Plex Mono** 400 / 500 | Log metadata: markers, labels, chips, dates, stack lines, captions | Always small (12–14 px), usually uppercase + `tracking-wider` |
| **Plex Serif** 400 + italic | Long-form reading and pull-quotes | Case studies (`.reading`), TL;DRs, pull-quotes, the Career OS line |

**Scale.** Tailwind's default steps only: `text-xs` 12 · `sm` 14 · `base` 16 · `lg` 18 · `xl` 20 · `2xl` 24 · `3xl` 30 · `4xl` 36 · `5xl` 48 · `6xl` 60.
- Hero headline: `2.25rem` (mobile) → `5xl` → `6xl`, semibold, `leading-[1.08]`, `tracking-tight`.
- Section heading (h2): `2xl` → `3xl`, semibold.
- Card title: `2xl` (selected work) or `xl` (archive).
- Reading body: `.reading` sets serif at 19 px (20 px from `sm`), line-height 1.7, measure 38 rem (about 70 characters).
- Labels: never smaller than `text-xs` (12 px).
- Numbers in stats: add `.tabular` (tabular, lining figures).

## 3. Space & layout

- **Container:** `max-w-6xl`, gutters `px-4` (mobile) / `px-6` (`sm`+).
- **Timestamp column:** every section is a `LogSection`: a `7rem` left column holding the marker and label, then the content. On mobile the column collapses into a single line above the content (`SOD · START OF DAY`).
- **Section rhythm:** `py-12` → `sm:py-16`, separated by a `border-t border-line` rule.
- **Grids of cells** (stats, facts, contact): outer `border-l border-t`, each cell `border-b border-r`. That gives shared hairlines with no doubled borders.
- **Tap targets:** interactive elements are at least 44 px tall (`min-h-11`).

## 4. Signature motifs

1. **Shift markers.** `SOD` (start of day) marks the homepage hero and `EOD` (end of day) marks the contact section, the last entry on the page. Every section in between is numbered (`01` proof, `02` flagship, `03`…), so "end of day" never lands mid-page. Other pages use numbers only. Case-study chapters are numbered too, with their template section (Problem, Constraints, Decision, Turning point, …) as the label. Don't invent clock times: markers are structure, not data.
2. **Status chips.** Mono, uppercase, 1 px border: `LIVE` (ok, with a dot), `BEING INTEGRATED` (accent), dates and states (muted). Only for real states from the resume.
3. **Dot grid.** A quiet 20 px dot grid (`.dot-grid`) behind page headers and the hero only. Reading areas stay clean paper.
4. **Before → after.** Replaced systems are shown struck through in mono, followed by the one thing that replaced them, marked with an accent rule.

## 5. Case-study reading treatment

Inside the Field Log frame:
- The header (dot grid) holds the case number, chips, title, mono kicker, and a three-line serif **TL;DR**.
- **Role & timeline** sits in a grid of cells.
- Chapters: sans heading, `.reading` serif body, at most 38 rem wide.
- **Pull-quote:** serif italic, `2xl` → `1.75rem`, with a 2 px accent left rule. One per chapter at most, and only for a sentence the facts support.
- **Trade-off table:** serif cells with a `GAINED` / `GIVEN UP` chip per row.
- **Diagrams:** hand-built. The labels are HTML text; SVG draws only the lines, using `currentColor` or `var(--line)` / `var(--accent)`, so they follow the theme and stay legible at 375 px.
- **TODO blocks:** a dashed accent border with a `TODO(priyanshu)` mono label. Visible on purpose; each one is also listed in `TODO.md`.

## 6. Motion

- One animation on the whole site: `.log-in`. Secondary blocks (proof cells, the flagship card) fade in once, 70 ms apart. **The headline is never animated**, so reading never waits.
- Hover and focus are colour changes only.
- All motion, including smooth scrolling, is off under `prefers-reduced-motion: reduce`.

## 7. Accessibility

- WCAG 2.2 AA in both themes: landmarks (`header`, `nav`, `main`, `footer`), a skip link, one `h1` per page, a visible 2 px accent focus ring.
- External links open in a new tab and announce it (`sr-only` text) where the link text doesn't already make it obvious.
- The theme toggle is a labelled radio group; the saved choice is applied before first paint, so there's no flash.

## 8. Don'ts

- No gradients, glows, glassmorphism or stock "tech" imagery.
- No faded (opacity) text; use `muted`.
- No numbers, logos or screenshots that aren't in the resume or confirmed by Priyanshu. Internal tools are recreated only as diagrams or clearly labelled synthetic data.
- Don't claim hand-written code. Use "designed", "directed the build", "scoped", "shipped".
