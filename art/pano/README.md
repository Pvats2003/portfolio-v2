# 360° panoramas for /world

There are three ways to make a viewpoint. The **extend route** (free) grows one continuous painting in Gemini by extending a picture to the right until it comes back round. The **four-view route** (free) uses four square Gemini pictures that the script stitches together. The **360° generator route** uses one equirectangular image from Blockade Labs Skybox AI or similar. Each viewpoint can use any of them.

## Extend route: one painting, extended to the right until it wraps

Start from the land picture, turn it square, then keep extending it to the right in Google AI Studio. Each new picture repeats the right third of the one before and paints new scenery beyond it. The last picture joins back onto the first. `npm run world:pano` lines up every overlap (it allows for Gemini redrawing it slightly bigger, smaller, higher or lower), matches the colours, cuts each join where the two pictures differ least, spreads any leftover mismatch evenly round the loop, and wraps the painting round you.

**How many steps:** 6 pictures in all.

- Picture 0 is the land picture made square.
- Pictures 1 to 4 are extensions.
- Picture 5 is the closing picture that joins back onto picture 0.

Each picture shows 90° of the view and overlaps the one before by a third, so each step turns 60°. Four pictures' worth of width goes all the way round. If the script says the pictures come out much wider or narrower than 90°, it tells you whether to add or drop one extension.

| ✓ | File name (exact) | What it is | Faces |
|---|---|---|---|
| ☐ | `square-strip-0.png` | The land picture, made square | the inn (0°) |
| ☐ | `square-strip-1.png` | Extension 1 | 60° right |
| ☐ | `square-strip-2.png` | Extension 2 | 120° right |
| ☐ | `square-strip-3.png` | Extension 3 | behind you (180°) |
| ☐ | `square-strip-4.png` | Extension 4 | 120° left |
| ☐ | `square-strip-5.png` | Closing picture: joins 4 back onto 0 | 60° left |

**Rules:**
- **Every picture is square (1:1)**, set in AI Studio's aspect ratio option. Square pictures reach about 34° above the horizon and 53° below it, so at the lowest viewing angle only a thin strip of the ground is painted by the script. 16:9 pictures would reach only about 19° above and 38° below, so about a third of the screen would be painted ground (see the end of this section if you want 16:9 anyway).
- **Attach the previous picture exactly as AI Studio gave it** (no need to upscale in between). When all six are done, **upscale every one 2× in Upscayl** with the same model, then upload.
- **Keep the horizon, camera height and downward angle the same in every picture.** That's what makes the joins line up; the script can absorb small drift, not big jumps.
- **Nothing new in the overlap:** the left third of each new picture should show what the right third of the one before showed. If Gemini paints something different there, make that picture again. The script names the picture that doesn't fit and stops for that viewpoint, keeping the current panorama.
- **Made in AI Studio** (no visible watermark). The script checks every picture's bottom-right corner anyway.

**Step 0: `square-strip-0.png` (attach your land picture)**
> Make this picture square (1:1). Keep everything in it exactly as it is, the same size and in the same place, and add more below it: the dirt path with its stepping stones continuing toward the viewer, grass, wildflowers and a few mossy stones at your feet. Add a little more soft sky above. The horizon ends up about a third of the way down the picture. Same style, light and colours. No text, logos or watermark.

If you'd rather not have the two people and the cow in the 360° (they'll be frozen in place), add: "Leave out the people and the cow; keep the fields empty."

**Extension lines (start steps 1–5 with these):**
> Square 1:1 image of the same place, as if the camera turned 60 degrees to the right. The left third of the new image shows exactly what is in the right third of the attached image: the same things, the same size, at the same height. The rest continues the scene to the right. Keep the horizon, the camera height and the slightly downward view exactly as in the attached image. Same style, light and colours: cinematic anime countryside painting, original style, soft cel shading, painterly textures, dark painted outlines, late-afternoon golden hour, lavender haze on the far mountains. No new people or animals, no text, readable signs, logos or watermark.

**Step 1: `square-strip-1.png` (attach picture 0)**
> Continuing to the right: the stream winding past the water-wheel mill, more flooded rice paddies and terraced fields climbing the hillside, small farm sheds, the rocky wooded slope. The low sun is now just off the left edge, so warm light comes from the left with a golden glow in the upper-left sky. In the foreground beside the path, a round red post box on a short post.

**Step 2: `square-strip-2.png` (attach picture 1)**
> Continuing to the right, turning away from the sun: the paddies give way to a wooded hillside and a small farmhouse with a vegetable patch, and a narrow lane runs between them. Warm light from behind on the left, long soft shadows reaching to the right.

**Step 3: `square-strip-3.png` (attach picture 2)**
> Continuing to the right, now facing away from the village: the dirt path leading out between green fields and low wooden fences, toward gentle hills and distant mountains. The sun is behind the viewer, so everything is warmly lit and the shadows point away down the path.

**Step 4: `square-strip-4.png` (attach picture 3)**
> Continuing to the right, turning back toward the village: the fields meet the first small wooden houses, with a vegetable garden, a low fence and a forested slope behind. Warm light from behind on the right.

**Step 5, the closing picture: `square-strip-5.png` (attach picture 4 first, then picture 0)**
> Square 1:1 image that joins the two attached images into one continuous scene. Its left third shows exactly what is in the right third of the first attached image, and its right third shows exactly what is in the left third of the second attached image: the same things, the same size, at the same height. The middle paints what lies between them: small wooden houses with flower boxes and laundry, and in the foreground a blank wooden notice board on two posts, with no writing on it. Keep the horizon, the camera height and the slightly downward view exactly as in the attached images. Same style, light and colours. No new people or animals, no text, readable signs, logos or watermark.

**Then:** upload the six upscaled pictures to this folder. I'll set where the horizon is on picture 0 (`horizon` in `content/world-pano-spots.json`), run `npm run world:pano`, put the markers on the inn, the post box and the notice board, and send screenshots. The flat painting is also saved to `.cache/pano/square-strip.jpg` so the joins can be checked by eye.

**16:9 instead:** skip step 0, use your land picture as picture 0 as it is, and write "16:9" instead of "square 1:1" in the prompts. It's the same number of steps, but about a third of the screen is painted ground when looking down.

---


## Four-view route: four Gemini views per viewpoint

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

**Watermark check:** before stitching, the script checks each view's bottom-right corner for Gemini's visible sparkle. If it finds one, it names the file and stops without writing anything. Export that view again without the mark (Google AI Studio doesn't add it) and run again. If it's ever a false alarm, `node scripts/world-pano.mjs --allow-watermark` skips the check.

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
