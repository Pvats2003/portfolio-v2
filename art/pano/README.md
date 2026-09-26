# 360° panoramas for /world

There are two ways to make a viewpoint. The **free route** uses four square Gemini pictures that the script stitches into a panorama. The **360° generator route** uses one equirectangular image from Blockade Labs Skybox AI or similar. Each viewpoint can use either.

## Free route: four Gemini views per viewpoint

Four **square (1:1)** pictures from where you stand: facing the inn, then turning **90° right** each time. Each one is a 90° slice of the view, so together they wrap all the way round. `npm run world:pano` stitches them: it matches colours across the seams, softens the joins, paints the sky overhead and grows the grass underfoot.

| ✓ | File name (exact) | You're facing |
|---|---|---|
| ☐ | `square-front.png` | The inn |
| ☐ | `square-right.png` | 90° right: stream, footbridge, paddies, post box |
| ☐ | `square-back.png` | Behind you: the path out of the village |
| ☐ | `square-left.png` | 90° left: houses, garden, notice board |

For the other viewpoints use the same names with `doorstep-` or `footbridge-` in front, and the viewpoint lines from the 360° prompts below.

**Rules:**
- **1:1, then upscale 2× in Upscayl** (1024 × 1024 → 2048 × 2048), PNG, **no watermark**. Use the same Upscayl model for all four.
- **Attach `art/plates/land-day.png` as the reference image every time,** so the style, light and buildings match.
- **For each picture after the first, also attach the previous one** and keep the line about its edge: turning right, a picture's **left edge continues the previous picture's right edge**. For the last one (left), attach the back and front pictures.
- **Keep the horizon exactly across the middle** of every picture, with the camera level: that's what makes the seams line up.
- **Order:** front, right, back, left.

**Shared lines (start every prompt with these):**
> Square 1:1 image: one side of a 360° view, a 90-degree field of view, camera level at eye height (about 1.6 m), horizon exactly across the middle of the image, no tilt, no fisheye. The same place, light and style as the attached reference image: premium cinematic 3D anime game environment, original style, soft cel shading, painterly textures, dark painted outlines, late-afternoon golden hour, low warm sun over the rice paddies, long soft shadows, lavender haze on distant mountains, natural greens and warm wood. The top third is soft painted sky with a few gentle clouds; the bottom edge is the ground at your feet. No people, animals, cars, text, readable signs, logos or watermark.

**`square-front.png`: facing the inn**
> Straight ahead, centred: the two-storey wooden inn from the reference, seen across the dirt village square, with flat stepping stones leading to its door, firewood and potted plants by the entrance, forested mountains behind it. The dirt path runs from the bottom of the picture toward the inn. A wooden utility pole stands to the right of the inn.

**`square-right.png`: turned 90° to the right (attach the front picture)**
> Turned 90 degrees to the right of the attached picture; this picture's left edge continues its right edge. The low warm sun is ahead in the sky, with a soft glow. A clear shallow stream with a small wooden footbridge in the middle distance, rice paddies reflecting the sky, a small farm shed, and in the foreground beside the path a round red post box. Grass and the edge of the path at the bottom.

**`square-back.png`: facing away from the inn (attach the right picture)**
> Turned 90 degrees to the right of the attached picture; this picture's left edge continues its right edge. Facing away from the inn: the dirt path leading out of the village between green fields and low wooden fences, gentle hills and distant mountains. Sunlight comes from the left, with long shadows across the path.

**`square-left.png`: turned 90° to the left of the inn (attach the back and front pictures)**
> Turned 90 degrees to the right of the first attached picture (so its left edge continues that picture's right edge, and its right edge leads into the second attached picture's left edge). Small wooden houses with flower boxes and laundry, a vegetable garden with a low fence, and in the foreground a blank wooden notice board on two posts, with no writing on it. Warm sunlight falls on the houses from behind the viewer.

**What the stitching can and can't fix:** colour differences at the joins are matched and the joins are softened. Shapes that don't line up (a ridgeline at a different height, a fence that stops) stay slightly visible where two pictures meet, so the horizon rule matters most. If one join looks bad, regenerate just that picture.

---

## 360° generator route: one image per viewpoint

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
