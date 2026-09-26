# 360° panoramas for /world

One file per viewpoint, named after it in `content/world-pano-spots.json`: `square.jpg`, `doorstep.jpg`, `footbridge.jpg` (JPG, PNG or WebP).

- **Format:** equirectangular 360° × 180°, **2:1** (best 8192 × 4096; 4096 × 2048 is the minimum and will look soft when zoomed).
- **Horizon** exactly across the middle; the left and right edges must meet seamlessly.
- Then run `npm run world:pano`: it cuts each file into six cube faces in `public/world/pano/<spot>/`. Viewpoints without a file keep the stand-in painted from the land plate.
- After a real panorama arrives, the hotspot directions in `content/world-pano.ts` need measuring on it.
