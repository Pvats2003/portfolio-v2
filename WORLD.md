# WORLD.md — the anime world layer (concept, Phase 1)

Branch `anime-world`. Nothing here is built yet; this is the plan to approve before any code.

**The idea in one line:** a small, cosy, cel-shaded town on the Karnataka coast, where each project is a place you can tap. It's an optional layer: the current site stays the fast, readable path, and every place's content is already on the normal pages.

---

## Status

- **Phase 1 (concept):** approved as recommended, all five decisions (Sep 25).
- **Phase 2 (prototype):** built on `anime-world`. It has `/world` with the Field Ops Depot, camera, one dialogue box, day/night, posters, fallback, list view and skip button, plus the homepage dusk strip preview. Two changes from the plan:
  - **Place pins are plain DOM buttons.** They're projected from 3D each frame, not drei `Html`, which fails to render with React 19. They sit outside the hidden canvas, so keyboard and screen readers get them directly.
  - **The homepage town is a horizon strip.** It runs along the bottom of the hero, in its own space below the proof tiles and the product plate, rather than a background behind them. No text or product sits on top of it. On phones it sits below the buttons, so the first screen is unchanged apart from the "Enter my world" link.

- **Direction change (Sep 26):** the world is now a Japanese countryside village. The inn is the projects hub. It lives at `/world` behind the homepage's "Enter my world →" link, and the homepage first screen is unchanged (the coastal-town dusk strip was removed). The Phase 2 Depot scene is kept only as the current `/world` placeholder.
- **Device check fixed:**
  - The CPU-thread rule is gone. Many laptops report 4 threads, and privacy modes fake low numbers.
  - drei's `PerformanceMonitor` is gone. It read on-demand rendering's idle time as "slow".
  - The frame rate is now measured once, over 1.5 s.
  - The still picture now says why it was shown, with a "What the browser reported" line.
  - Phones always start on the still picture, and one tap loads the 3D.
- **Look-dev round (village with the inn, golden hour and night):** `/world/lookdev` has the three frames:
  - **A:** pushed 3D.
  - **B:** 2.5D painted SVG.
  - **C:** 3D in front of painted layers.

  Each has a frame-rate meter and a device-check readout.
- **Decision (Sep 26): painted 2.5D wins**, built on frame B's code. There is no walking, no character controller and no WebGL: the three.js packages and the 3D scenes were removed (in git history up to `a606acb`).
  - `/world` shows the painted village.
  - It uses Priyanshu's painted plates (`art/plates/CHECKLIST.md`, then `npm run world:plates`) once they exist, and the code-drawn village until then.
  - The inn is a button that opens the projects, and the list view has the same content.
  - Phones start still, with an "Animate" button.
- **Next:** wire in the plates when they arrive (mark the inn, lanterns and chimney in `content/world-scene.ts`), then send screenshots. No more locations until then.

## 0. Decisions (Phase 1, approved)

| # | Question | My recommendation |
|---|---|---|
| D1 | Asset approach (§1) | **Built in code**, React Three Fiber with toon materials. No downloaded models. |
| D2 | Hero: the brief puts the scene *behind* the headline and proof tiles. Today the first screen also shows the real product (City Ops manager + phone), which is what the "10-second recruiter test" was about. | **Keep the product pair on the first screen.** The scene becomes the hero's *background*: a dusk sky with the town on the horizon, low under the plate. "Enter my world →" is a third button. Details in §8. |
| D3 | Mobile hero | **Static poster on phones, no live scene** (the numbers are in §6). "Enter my world" goes to `/world`, which loads the scene. |
| D4 | Guide character | **A small camera-rig robot** (§2.4), not a person. That avoids drawing you, and it ties to the robotics data-collection work. |
| D5 | Town identity | **A coastal South Indian town**, not a generic "anime Japan" town: Mangalore-tile roofs, laterite and lime-washed walls, coconut palms, gulmohar trees. It's more personal, and it can't be mistaken for anyone else's style. |

---

## 1. Asset approach

**Recommendation: option 1. Everything is built in code** from low-poly primitives (boxes, cylinders, capsules, extruded shapes) composed in React Three Fiber, with toon materials.

Why this beats CC0 packs or a mix:

- **Originality is guaranteed.** Every shape is ours, so there's no chance of looking like a known game or show, and nothing to audit.
- **One look.** Kenney, Quaternius and Poly Pizza models each have their own proportions and palettes. Mixed together in one town they look like a kit-bash, and the "cohesive original anime" goal is the first thing to go.
- **Smallest payload.** Geometry made in code costs a few KB of JavaScript, not MB of glTF. No glTF also means no Draco/Meshopt decoder (about 300 KB of WASM saved). The only image texture is the City Ops demo screenshot on the Depot's screen.
- **No licence tracking.** `ASSETS.md` will still exist, but it will list only our own demo screenshot and the IBM Plex fonts (SIL OFL), which are already in use.

The cost: characters and signature buildings take more hand work, and quality comes from iteration (I build, screenshot and adjust). **Escape hatch:** if one prop really doesn't work in code (palm fronds are the likely one), I'd propose a single CC0 model for it. I'd record its source and licence in `ASSETS.md` and restyle it to our palette, and only after asking you.

Nothing is ripped from games or anime, and there are no AI-generated images at all. The only raster art is (a) our own demo screenshot and (b) posters rendered from our own scene.

---

## 2. Art direction

### 2.1 The look (all original)

- **Shading:** `MeshToonMaterial` with a 3-step gradient map: lit, mid, shadow, with hard steps like cel animation.
- **Outlines:** the "inverted hull" trick. Each mesh gets a slightly larger, back-facing copy in a warm dark brown. That gives soft ink lines with no post-processing pass. They aren't black; black reads harsh and "3D game".
- **Sky:** a large gradient dome drawn by a small shader. It's painterly, with banded colour, a soft sun or moon disc and a few flat cloud cards whose edges are drawn in code.
- **Shadows:** soft blob shadows under things (a radial-gradient decal, nearly free). On desktop only, one directional shadow map at 1024 px.
- **Water:** a flat sea with toon-banded colour and slow animated foam lines at the shore.
- **Motion:** gentle and slow. Palms sway a few degrees; the train runs a loop every ~40 s; a delivery drone crosses now and then.
- **Particles:** drifting **gulmohar petals** (red-orange, like the site accent) instead of the cherry blossom cliché. There are at most 150 instanced quads, and none under reduced motion.
- **Guardrails:** no reference to or imitation of any studio, film, series, director, artist or character. No "look like X" prompts, no borrowed silhouettes (no round white robots, no big anime eyes with highlights, no famous vehicles).

### 2.2 Palette

Built from the site's tokens, so the world and the UI feel like one product.

| Role | Day (golden hour, light theme "Paper") | Night (dark theme "Night shift") |
|---|---|---|
| Sky, top | `#8fb4cf` | `#0f0c08` (night panel `--bg`) |
| Sky, middle | `#e9c7a3` | `#1f2a3d` |
| Sky, horizon | `#f6b27a` | `#3d3550` with a thin `#7a4a3a` glow |
| Sun / moon | `#fff1d6` | `#eee7da` (dark `--ink`) |
| Roof tiles (Mangalore) | `#a63a1b` (light `--accent`) | `#5a2414` |
| Lime-wash walls | `#f3eee4` (light `--bg`) | `#4a4438` |
| Laterite walls | `#c9744f` | `#5e3626` |
| Grass, lit / shadow | `#9dbb6f` / `#6f8f55` | `#2c3a33` / `#1b241f` |
| Sea / shadow / foam | `#5fa8a8` / `#3f7f86` / `#fbf8f2` | `#1d3140` / `#132230` / `#3b4a58` |
| Lit windows, lamps | `#ffcf8a` | `#f08a5d` (dark `--accent`) and `#ffcf8a` |
| Outline | `#3a2a1f` | `#0b0906` |
| Key light | warm `#ffd9a8`, low from the west | cool moon `#8ea6c8`; windows are emissive (no real lights, so it stays cheap) |

**Hero sky (dusk):** the hero panel is always dark and the headline is cream. The hero scene therefore uses a *dusk* variant: a dark upper sky where the text sits, with the warm glow only near the horizon. That keeps the headline at WCAG AA contrast in both themes.

### 2.3 People

- **Chibi proportions** (big head, small body) built from spheres and capsules. Faces are two dot eyes, nothing more.
- **Field officers at the Depot** are generic figures: a hi-vis sash and a chest-mounted camera rig (a small box with a lens), in palette colours.
- **No names, no faces modelled on anyone, no real plate numbers.**
- Tapping a character makes it wave (a short arm rotation) and pop a tiny "!" bubble.

### 2.4 Guide character (first visit only)

A small **camera-rig robot**:

- a boxy body with a single round lens for an eye
- a short antenna with a tiny orange flag (the site accent)
- stubby legs
- a hop-and-tilt idle animation

It appears once, near the Depot, with one speech bubble from your brief: **"Tap a building to see what I've built."** It can be dismissed (✕, Esc or any tap), and a `localStorage` flag stops it coming back. If storage is blocked, it just shows again next time.

### 2.5 UI panels (Field Log carried into anime UI)

- Dialogue boxes, labels and buttons use the existing tokens and IBM Plex fonts.
- **Dialogue box:** a `surface` panel with a 2 px `ink` border and a slightly offset hard shadow (a cel look). It carries a mono "speaker" tab (e.g. `FIELD OPS DEPOT`) in the accent colour and a small ▼ "next" marker. It slides up 16 px and fades in, with no typewriter effect (that slows readers down).
- Proof chips reuse the site's `Chip` component. Buttons reuse the site's button styles.

---

## 3. The town (top-down map)

The town sits on a rounded **diorama tile** (about 60 × 40 units, with visible soil edges), with the sea along the south. A tile keeps the scene small, gives the camera natural limits and reads as "a little world".

```
                                   N
  +-----------------------------------------------------------------------+
  |   hills                                    [P] POWERHOUSE (ITC)       |
  |                                              \  glowing power lines   |
  |                                               \    run into town      |
  |  ===== railway ========== [S] STATION (Career OS) =============== ==  |
  |        (train loops E-W)     job board + "Human check" gate           |
  |                                                                       |
  |  [L] RECORDS LIBRARY          [D] FIELD OPS DEPOT         [X] CROSSING|
  |      (Audit AI Copilot)           (City Ops OS)               (ANPR)  |
  |      tall shelves,                plaza, rigs rack,          camera   |
  |      magnifier lamp               big screen                 pole     |
  |  ------------------- main road ----------------------------+-------   |
  |                                                            |  cars    |
  |    [H] MY HOUSE                 gulmohar trees             |          |
  |    (About / contact)                     beach, palms   [K] PIER      |
  |    lit window, mailbox                                  (Karavali)    |
  |  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ sea ~~~~~~~~~~~~~~~~~~~~ boat ~~~~~~ |
  +-----------------------------------------------------------------------+
     default camera: from the south-east, about 40° above the horizon
```

**Tab order** (also the story order): Depot → Pier → Library → Station → Crossing → Powerhouse → House.

### 3.1 Places and where their words come from

The dialogue text comes **only from existing content files**. The only new words are UI labels ("Open the case study", "Skip to the quick view") and the guide's line from your brief.

| Place | Case study | Speaker tab | Dialogue lines (source) | Proof chip (source) | Visual |
|---|---|---|---|---|---|
| Field Ops Depot | `city-ops-os` | FIELD OPS DEPOT | `tldr[0..2]` in `content/projects/city-ops-os.ts` | "Being integrated into Instawork's ops tool" (`flagship.proof`, `content/work.ts`) | A depot with an open front and a rigs rack. Two or three field officers load rigs. The big screen shows `command-center-desktop.png` (our demo data; the panel says "Screen: demo data"). The sign says "Field Ops Depot", with no company logo. |
| Coastal pier | `karavali` | COASTAL PIER | `tldr` in `karavali.ts` | "Live MVP" plus a second button to the live app | A wooden pier, palms and a small moored boat, at sunset in the day palette. |
| Records library | `audit-ai-copilot` | RECORDS LIBRARY | `tldr` in `audit-ai-copilot.ts` | "Full PRD · P0–P2 stories" | Tall shelves, a few documents glowing softly, a desk with a magnifying lamp. |
| Train station | `career-os` | STATION | `tldr` in `career-os.ts` | "350+ passing tests" | A departure board where rows flip (generic job titles like "Product Analyst" with no company names), and a small gate labelled **HUMAN CHECK** that rows stop at. |
| Traffic crossing | `anpr` | CROSSING | `tldr` in `anpr.ts` | "89.1% mAP@50" | Small cars pass a camera pole. A box outline snaps onto a plate that reads `XX 00 XX 0000`, a placeholder that's never real. |
| Powerhouse | `itc-powerhouse` | POWERHOUSE | `tldr` in `itc-powerhouse.ts` | "15+ sub-distribution boards" | A small power station on the hill. Power lines glow in pulses toward the town. |
| My house | About / contact | HOME | `about.story[0..1]` in `content/site.ts` | `contact.line` ("Open to APM, Product Ops…") | A warm lit window and a mailbox. Tapping the mailbox opens it to the `contact.links` buttons: email, LinkedIn, GitHub, resume. **The phone stays hidden while `LIVE` is off**, because it already follows `SHOW_PHONE`. |

Each dialogue box has **"Open the case study"** (a real link to `/work/<slug>`) and **"Back to the town"**. The house has the contact buttons plus "About me" (`/about`).

---

## 4. Camera and interactions

- **Camera:** a perspective camera with a narrow field of view (30°), so it looks flatter and more illustrated. It uses drei `CameraControls` for smooth, interruptible flights.
- **Limits:** orbit ±60° around the default view; tilt between 25° and 60°; zoom distance clamped to 18–60 units; panning off.
- **Drag** to orbit; **scroll or pinch** to zoom. On a phone, one finger orbits and two fingers zoom. Page scroll is never hijacked outside the canvas.
- **Tap or click a place:** the camera glides there in about 0.9 s with ease-in-out, then the dialogue box slides up. Tapping empty ground or pressing Esc glides back to the overview.
- **Keyboard:**
  - Tab and Shift+Tab move through the place pins, in the map order above.
  - Enter or Space opens the focused place.
  - Esc closes the dialogue and returns focus to that place's pin.
  - Arrow keys orbit gently while the canvas has focus.
- **Delights:**
  - Characters wave when tapped.
  - Birds lift off when you tap a tree (a V-shaped flap, instanced).
  - Petals drift.
  - The train and the drone pass.
  - Day and night follow the site theme: the in-world toggle is the same System / Light / Dark control, so there's one source of truth.
- **Hover (desktop only):** a place brightens slightly and its label lifts. The cursor becomes a pointer.

---

## 5. How it's built

```
app/world/page.tsx            server page: poster, place list (real links), skip button, "Loading…"
components/world/WorldGate    client: checks the device, then lazy-loads the scene (or stays on the poster)
components/world/Scene        client, lazy (next/dynamic, ssr: false): Canvas, camera, lights, sky
components/world/places/*     one file per place, built from shared parts (walls, roofs, palms, figures)
components/world/parts/*      toon material + outline, blob shadow, sky dome, water, petals, birds
components/world/Dialogue     DOM dialogue box (not in the canvas), so it's accessible and uses site CSS
content/world.ts              place list: id, slug, position, camera target. Text is read from content/*.
scripts/world-poster.mjs      renders the posters from the real scene with Playwright
```

- **Loading order:**
  1. HTML arrives with the headline and a static poster image. The poster is a real render of our scene, AVIF/WebP, at most 60 KB.
  2. The page becomes interactive.
  3. In an idle callback, `WorldGate` runs the device checks below.
  4. If the device passes, it downloads the 3D chunk and compiles shaders off-screen (`gl.compile`).
  5. The live canvas fades in over the poster. Until then, the poster is what you see, never a blank canvas.
- **Device checks** (any failure means poster plus the normal site, with a "Try the 3D anyway" button where it makes sense):
  - WebGL2 unavailable, or unavailable with `failIfMajorPerformanceCaveat` (that catches software renderers)
  - `navigator.connection.saveData`
  - `deviceMemory < 4` or `hardwareConcurrency ≤ 4`
  - at runtime, drei `PerformanceMonitor`: if the frame rate stays under 30 after resolution is dropped to 1×, switch back to the poster
  - `webglcontextlost` also returns to the poster
- **Test-only override:** this machine's headless Chromium renders WebGL in software (SwiftShader), so the checks above would (correctly) refuse it. Screenshots and recordings will use a `?world=force` query that only works in development and preview builds. Recorded frame rates will be lower than on a real phone or laptop; I'll say so whenever I report numbers.
- **Frame loop:**
  - `frameloop="demand"`: frames are drawn only when something changes.
  - During a flight or a drag: full frame rate.
  - Idle ambient motion is capped at 30 fps; after 20 s with no input it drops to 20 fps.
  - When the tab is hidden or the canvas scrolls off-screen, rendering stops.
- **Resolution:** device pixel ratio clamped to 1–1.75 on desktop and 1–1.5 on phones, lowered automatically by `AdaptiveDpr`.

---

## 6. Performance budget

**Measured today** (a minimal scene bundled with esbuild, gzipped, not counting React, which the site already loads):

| Bundle | Min | Gzip |
|---|---|---|
| three + @react-three/fiber | ~930 KB | **~248 KB** |
| + drei pieces (CameraControls, Html, PerformanceMonitor, AdaptiveDpr) | ~990 KB | **~263 KB** |

That's about 1 MB of JavaScript to parse and run. It's fine on a laptop. On a mid-range phone it's roughly 0.5–1 s of main-thread work, which is exactly what drags a mobile Lighthouse score down. That's why D3 is "poster on phones".

**Budgets** (transferred, gzip):

| | Your cap | My target | Made of |
|---|---|---|---|
| Hero 3D (desktop only) | ≤ 1.5 MB | **≤ 350 KB** | runtime ~265 KB + hero scene code ~30 KB + poster ≤ 60 KB |
| `/world` | ≤ 5 MB | **≤ 500 KB** | runtime ~265 KB (cached if the hero loaded it) + world code ~60–90 KB + Depot screen texture ~80 KB + posters |
| Draw calls | — | hero ≤ 60, world ≤ 150 | shared materials, instancing for trees, petals and birds |
| Triangles | — | hero ≤ 40 k, world ≤ 150 k | low-poly |
| GPU texture memory | — | ≤ 32 MB | one screenshot texture; the rest are tiny gradient maps |
| Shader programs | — | about 6 | toon, outline, sky, water, particles, screen |

**Lighthouse:**

| Page | Today | Target |
|---|---|---|
| Home, mobile | performance 95–96, LCP 2.8 s, CLS 0 (my last runs) | **≥ 90, CLS ≈ 0.** Lighthouse's mobile test gets the phone path (poster only, no three.js), so the only cost is the poster image. I'll keep it small and make sure it doesn't become the slowest element to paint. |
| Home, desktop | — | ≥ 90. The scene loads only after the page is idle, and I'll report the desktop score separately, because a late 1 MB script can still register as blocking time there. |
| `/world`, mobile | new | performance ≥ 70, accessibility 100. It's an opt-in page; poster first keeps the first paint fast. |

---

## 7. Accessibility

- The canvas is `aria-hidden`. **Everything interactive is real HTML:**
  - The place pins are `<button>`s, positioned over the buildings (their 3D positions projected to the screen). Tab order, focus rings and screen readers therefore work normally.
  - The dialogue box is a DOM `role="dialog"` region: focus moves into it, Esc closes it and focus returns to the pin.
- A **"List view"** toggle shows all seven places as plain text with their links. It's the same content, without the 3D.
- **"Skip to the quick view"** is always visible, top-left, and is the first thing you can tab to. It goes to `/`.
- **`prefers-reduced-motion`:** no camera flights (it cuts straight to the dialogue box), no petals, no train or drone movement, no bobbing. Tapping still works.
- Panels use the site tokens, which already meet AA contrast in both themes.
- Every place's content is already on the normal pages (`/`, `/work/*`, `/about`) with real links, so nothing is 3D-only.

---

## 8. Homepage integration (Phase 4, proposal)

- **Background, not foreground:** the live scene replaces the flat dark background of the hero panel with the dusk sky, and the town sits along the bottom edge, under the product plate.
- **What stays the same:** the headline, proof tiles, the City Ops product pair and the buttons don't move. A soft scrim behind the text column keeps it readable.
- **The button:** "Enter my world →" is added as a third, quieter button, after "See City Ops OS" and "Resume (PDF)".
- **Desktop:** poster first, then the live scene fades in after the page is idle.
- **Phones:** poster only. "Enter my world" goes to `/world`.
- **Reduced motion:** the poster only, everywhere on the homepage.

If you'd rather have the brief exactly as written (the scene *instead of* the product pair on the first screen), it's doable. But it swaps real product proof for decoration in the 10 seconds a recruiter gives the page, so I don't recommend it.

---

## 9. Rules carried over

- No fabricated metrics or claims. Dialogue comes only from `content/*`.
- No real field-staff names or faces, no real plate numbers, no internal Instawork screens. The Depot screen is our own demo screenshot, labelled as demo data.
- `LIVE` stays `false`: noindex, and the phone number stays hidden. `/world` inherits both.
- Don't merge `anime-world` into `main` without your approval.

---

## 10. Phases and what you'll get

| Phase | Deliverable | Then |
|---|---|---|
| 1 · Concept | This file | **stop for approval** |
| 2 · Prototype | `/world` with the Depot only, plus the diorama tile, sky, camera, one dialogue box, day/night, the fallback poster and the skip button. Screenshots and a short screen recording at 390 px and 1440 px (Playwright; the frame rate is software-rendered and I'll say so), plus Lighthouse. | stop for approval |
| 3 · Full world | All seven places, the guide, the interactions, list view | show you |
| 4 · Homepage | Dusk hero background (desktop), poster on phones, "Enter my world →" | show you |
| 5 · QA | Low-end simulation (CPU throttling, no-WebGL, `saveData`), reduced motion, keyboard-only, both themes, Lighthouse | report, then wait for merge approval |

**Risks I'd rather name now:**

- The art quality of a code-built world depends on iteration. The Phase 2 Depot is where we find out whether the style lands before I build six more places.
- A real 3D scene adds about 265 KB of JavaScript that the rest of the site doesn't need. It's kept off the homepage on phones and loaded only after idle on desktop.
