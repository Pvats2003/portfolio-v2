# ASSETS.md — what the /world layer is made of

Everything in the 3D town is built in code (`components/world/`): boxes, cylinders, spheres and extruded shapes
with toon materials. There are **no third-party models, textures or sounds**, and no AI-generated images.

| Asset | Where | Source | Licence |
|---|---|---|---|
| Depot screen texture | `public/world/depot-screen.webp` | Our own City Ops OS screenshot (made-up demo data), resized, with a "DEMO DATA" tag | Ours |
| Posters and hero strip | `public/world/poster-*.{avif,webp}`, `public/world/hero-dusk.{avif,webp}` | Rendered from our own scene by `scripts/world-posters.cjs` | Ours |
| Sign lettering, UI panels | canvas texture + site CSS | IBM Plex Mono / Sans, already used by the site | SIL Open Font Licence 1.1 |
| three.js, @react-three/fiber, @react-three/drei | npm | Libraries, not art | MIT |

If a CC0 model is ever added (WORLD.md §1, escape hatch), record its name, author, link and licence here first.
