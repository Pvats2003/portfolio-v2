# 360° panoramas for /world

Three viewpoints, one panorama each. Upload them to this folder (`art/pano/`) on the `anime-world` branch: open the folder on GitHub, then **Add file → Upload files**. Then I run `npm run world:pano`, place the hotspots, and send screenshots.

| ✓ | File name (exact) | Viewpoint | Straight ahead (centre of the image) |
|---|---|---|---|
| ☐ | `square.jpg` | Village square | The inn, whole, across the square |
| ☐ | `doorstep.jpg` | Inn doorstep | The inn's front door, filling much of the view |
| ☐ | `footbridge.jpg` | Footbridge | The inn, further away across the grass |

## Requirements (all three)

- **Format:** equirectangular 360° × 180°, **exactly 2:1**. Most 360° generators, Blockade Labs Skybox AI included, export this by default.
- **Size:** the largest export your plan gives. **8192 × 4096 is best; 4096 × 2048 is the minimum** (the script warns below that, and it will look soft when zoomed in). JPG at high quality or PNG. Don't resize or crop.
- **The inn goes at the horizontal centre** of every panorama. That's straight ahead when the viewer opens and when you hop between viewpoints, and it's how the hotspots line up across all three. If the generator puts it somewhere else, don't regenerate: tell me and I'll rotate the image in the script (turning a panorama sideways is lossless).
- **Camera:** eye height (about 1.6 m), level, horizon straight across the middle of the image. No tilt, no fisheye look.
- **Same time and light in all three:** late-afternoon golden hour, a low sun over the **rice paddies side** of the village, long soft shadows, lavender haze on the far mountains.
- **Same style in all three:** use the same style preset (an anime or painted-illustration one, not a preset named after a studio or artist), the same style lines and the same negative prompt below. If the tool offers a seed, reuse it.
- **For consistency, make the village square first,** then build the other two from it (in Skybox AI: **Remix** from the square's skybox, keeping the style), so the palette, the inn and the houses match.
- **No people, text, readable signs, logos or watermark.** A blank notice board and a red post box are asked for on purpose: they become the Resume and Contact hotspots.
- **Licence:** check what your plan allows for commercial and portfolio use, and tell me the tool and plan so I can record them in `ASSETS.md`.

## The village layout (so the three viewpoints agree)

```
                 forested mountains
                        │
   houses,          THE INN  ── utility pole
   vegetable            │
   garden,       village square ── stream & footbridge ── rice paddies, farm shed
   notice board         │                  (sun low over this side)
                  dirt path out
```

- **Village square:** you stand on the dirt path south of the inn, facing it. Left: houses and the notice board. Right: the stream, the footbridge and the paddies. Behind: the path leading out.
- **Inn doorstep:** you stand on the stepping stones just in front of the door. Behind you: the square.
- **Footbridge:** you stand on the bridge over the stream, east of the square, facing back toward the inn. Behind you: the paddies and the farm shed.

## Prompts

Put the **style lines** first in every prompt, then the viewpoint's own lines. If the tool limits prompt length, shorten the viewpoint lines rather than the style lines.

**Style lines (all three):**
> Hand-painted anime background art, original style, soft cel shading, painterly textures, dark painted outlines. Late-afternoon golden hour, low warm sun over the rice paddies, long soft shadows, lavender haze on distant mountains. Natural greens, warm wood, muted earth tones. A calm, peaceful Japanese countryside village.

**Negative prompt (all three):**
> people, characters, animals, cars, modern buildings, text, letters, writing on signs, logos, watermark, UI, neon, night, rain, fog, fisheye, distorted horizon, blurry, oversaturated, orange cast

### `square.jpg`: village square
> Standing on a dirt path in a small village square. Straight ahead: a traditional two-storey wooden inn with a dark blue-grey tile roof, a wooden balcony, glowing shoji screens, an indigo curtain over the door, firewood stacked by the entrance, potted plants, forested mountains behind it. To the left: small wooden houses with flower boxes and laundry, a vegetable garden with a low fence, and a blank wooden notice board on two posts. To the right: a clear stream with a small wooden footbridge, a wooden utility pole, rice paddies, a farm shed, and a round red post box beside the path. Behind: the dirt path winding away between fields and low hills.

### `doorstep.jpg`: inn doorstep (Remix from the square)
> Standing on flat stepping stones a few metres in front of the entrance of a traditional two-storey wooden inn, which fills the view straight ahead: dark blue-grey tile roof, wooden balcony, glowing shoji screens, an indigo curtain over the sliding door, firewood, potted plants, a bicycle against the wall. To the left: a vegetable garden, a low wooden fence and small wooden houses beyond. To the right: a wooden utility pole, the stream and rice paddies. Behind: the open village square and the dirt path leading out between fields.

### `footbridge.jpg`: footbridge (Remix from the square)
> Standing on a small wooden footbridge with low rails over a clear, shallow stream with smooth stones and reeds. Straight ahead, across the grass: the traditional two-storey wooden inn with its dark tile roof, the village's small wooden houses to its left, forested mountains behind. Behind: terraced rice paddies reflecting the sky and a small farm shed. To the right: the stream winding away between the paddies. A round red post box stands by the path at the end of the bridge.

## What happens next

1. `npm run world:pano` cuts each panorama into six cube faces (`public/world/pano/<spot>/`) and warns if it isn't 2:1 or is under 4096 wide. Viewpoints without a file keep the stand-in. If a panorama's inn isn't centred, a `rotate` value (degrees, + turns the view right) for that viewpoint in `content/world-pano-spots.json` fixes it.
2. I measure the inn, the notice board (Resume) and the post box (Contact) on each image, set the hotspots and the arrows between viewpoints (`content/world-pano.ts`), and send you recordings.
