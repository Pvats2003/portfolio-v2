# Painted plates: checklist

Put the finished images **in this folder** (`art/plates/`) on the `anime-world` branch. You can upload them on GitHub (open the folder, then **Add file → Upload files**), or attach them in our chat. I then run `npm run world:plates`, check that the inn's clickable area and the glows still line up, and send you screenshots.

There are **three plates**, each a separate image. The day set is required; the night set is optional but recommended.

| ✓ | File name (exact) | Size | Aspect | Background | Format |
|---|---|---|---|---|---|
| ☐ | `sky-day.jpg` | 3840 × 2160 (≥ 1920 wide) | 16:9 (else auto-cropped) | normal (the sky itself) | JPG or PNG |
| ◐ *temporary: chat copy, 1376 × 768, watermarked; replace* | `land-day.png` | 3840 × 2160 (≥ 1920 wide) | 16:9 (else auto-cropped) | **flat pure magenta `#FF00FF`** where the sky would be | **PNG** |
| ☐ | `foreground-day.png` | 3840 × 2160 (≥ 1920 wide) | 16:9 (else auto-cropped) | **flat pure magenta `#FF00FF`** everywhere except the foreground objects | **PNG** |
| ☐ | `sky-night.jpg` *(optional)* | 3840 × 2160 (≥ 1920 wide) | 16:9 (else auto-cropped) | normal | JPG or PNG |
| ☐ | `land-night.png` *(optional)* | 3840 × 2160 (≥ 1920 wide) | 16:9 (else auto-cropped) | flat pure magenta `#FF00FF` | PNG |
| ☐ | `foreground-night.png` *(optional)* | 3840 × 2160 (≥ 1920 wide) | 16:9 (else auto-cropped) | flat pure magenta `#FF00FF` | PNG |

**Size:** best is 3840 × 2160 (16:9), but any image **at least 1920 px wide** works, at any aspect ratio:
- **Not 16:9?** It's cropped to 16:9 around the centre, which keeps the inn in frame if you followed the framing rules below. Give all three plates of a set the same size so they crop the same way and line up. The script warns if a crop is extreme enough to cut the inn, or if a set's shapes don't match.
- **Smaller than 3840 wide?** It's upscaled to 3840 × 2160. Under 2560 px wide (after cropping), the script warns that it will look soft on large and high-resolution screens. For the sharpest result, upscale in your image tool to 3840 wide first.
- **Under 1920 px wide:** skipped, with a message saying so.

**Your tool's maximum is 1376 × 768**, so upscale every plate **2× in Upscayl** (to 2752 × 1536) before uploading, and save as PNG. Use the same model for all three plates. Afterwards, check that the magenta is still one flat colour: AI upscalers sometimes add texture or grain to it.

**No watermarks,** on any plate. The foreground plate matters most: it's the top layer, so a mark on it would float over the whole scene, even where it sits on the magenta.

**Magenta rules:**
- **Why magenta, not green:** the art is full of greens (fields, forest, grass) and blues (water, sky), but has no saturated magenta. The pale pink of cherry blossom is far enough away to stay.
- **Make it one flat colour:** no gradient, texture, vignette, shadow or glow on the background.
- **If your tool won't do exact `#FF00FF`:** a close magenta works (the cut-out allows some tolerance). Or repaint the background with a bucket-fill in any image editor.
- **Keep magenta out of the art itself:** no magenta or hot-pink objects, clothes or flowers.
- **Save as PNG, not JPG.** JPG compression smears the magenta edges.

**Framing: match `land-day`** (the Sep 26 draft), so the three plates line up:
- **Camera:** the same in all three. A fixed wide-angle view from slightly above eye level, looking gently down across the village.
- **The inn:** centred horizontally, about a quarter of the image wide. Its roof peak is about 30% down from the top and its base about 65% down. Phones only see the centre of the picture.
- **The mountain ridge** (where the land plate's magenta starts): between about 10% and 30% down, lower in the middle than at the sides. Only the sky above it shows.
- **Light:** late-afternoon golden hour, a low warm sun from the right, long soft shadows falling to the left, cooler shadows. Natural greens, warm wood, muted earth tones, lavender haze on the distant mountains. Not orange, not oversaturated.
- **Style:** premium cinematic 3D anime game environment, original style: soft cel shading, painterly textures, dark painted outlines.
- **Everywhere:** no text, lettering or signs with words, no logos, no recognisable faces, and no studio, film or artist names in the prompt.

**Order that keeps the plates consistent:**
1. ~~Generate `land-day` first.~~ Done (Sep 26 draft).
2. Use `land-day` as the reference image when you generate `sky-day` and `foreground-day`.
3. Make each night plate with image-to-image from its day plate, at low strength so the layout doesn't move.

---

## 1. `sky-day.jpg`

Attach `land-day` as the reference image.

> Wide 16:9 hand-painted anime sky, original style, matching the reference image's golden-hour light and colours: a late-afternoon sky seen from slightly above eye level. Soft clear blue at the top, easing to warm cream and pale peach toward the bottom. A few soft cumulus clouds in the upper half with pale lavender shadows and warm cream tops lit from the right, a couple of thin wispy streaks high up, a gentle warm sun glow in the upper right. Keep it calm and airy, most of the interest in the top 40% of the image, no busy detail near the bottom. Painterly brushwork, soft gradients, gentle grain. Sky only: no ground, no mountains, no trees, no buildings, no birds, no sun disc, no text, no watermark.

## 2. `land-day.png` (done: the prompt used for the Sep 26 draft)

> Wide 16:9 landscape, 3840 × 2160 (at least 2560 × 1440). Premium cinematic 3D anime game environment, original style: soft cel shading, painterly textures, stylised but believable materials, soft indirect light, subtle ambient occlusion, atmospheric perspective, detailed vegetation.
>
> Camera: fixed wide-angle view from slightly above eye level, looking gently down across a quiet Japanese countryside village at golden hour, like standing at the entrance to a peaceful adventure game world.
>
> Centre: a traditional two-storey Japanese countryside inn, exactly at the horizontal centre and the clear focal point. Its roof peak sits about one third down from the top and its base about three quarters down. The inn is no wider than one quarter of the image width, with open space on both sides. Nothing crosses in front of it: no trees, poles, wires or fences.
>
> Foreground: a winding dirt-and-stone path leading the eye to the inn, lush grass, small white and yellow wildflowers, moss-covered stones, low wooden fences at the sides.
> Middle ground: wooden houses with small gardens, laundry, flower pots, firewood and crates; rice paddies with narrow irrigation channels; a small wooden bridge; a bicycle; a wooden utility pole off to one side; a small farm shed; scattered trees; a thin wisp of chimney smoke.
> Background: layered green hills, dense forest, distant mountain silhouettes softened by haze. Clear depth from path to village, inn, fields, forest and mountains: one connected place.
>
> Light: low warm sun from the right, long soft shadows falling to the left, warm highlights on roof tiles, wood, grass and rice, cooler shadows. Natural greens, warm wood, muted earth tones. Not orange, not oversaturated, no neon.
>
> Sky: the entire sky area above the mountains and hills is one flat, solid, pure magenta (#FF00FF). No clouds, no gradient, no sun, no haze or glow over it. No magenta or hot pink anywhere else in the image.
>
> Exclude: people, characters, cars, modern buildings, text, readable signs, logos, UI, HUD, floating particles, fantasy castles, cyberpunk, oversized flowers, giant mountains dominating the frame, dramatic effects.

## 3. `foreground-day.png`

Attach `land-day` as the reference image. The land plate already has the path, stones and fences, so the foreground adds only what's closest to the viewer, at the edges.

> Wide 16:9, premium cinematic 3D anime game environment, original style, matching the reference image's camera (slightly above eye level, looking gently down), golden-hour light from the right and colours. Only foreground framing elements, very close to the viewer: a cherry blossom branch with a dark twisting stem and clusters of pale pink blossom reaching in from the top-left corner, across the top-left quarter of the image; tall grass blades and small white and yellow wildflowers along the bottom edge, rising higher in both bottom corners, with a dense leafy bush filling the bottom-right corner. Warm rim light from the right on the grass and blossom, soft cel shading, dark painted outlines. The whole middle of the image is empty. **Everything else is one flat, solid, pure magenta (#FF00FF): no sky, no ground, no path, no gradient, no shadow on the background.** No magenta or hot-pink blossom or flowers. No text, no watermark.

## Night versions (optional): image-to-image from each day plate, low strength

- **`sky-night.jpg`:** "The same sky at night: rich deep-blue moonlit sky with scattered stars and a bright full moon in the upper right, clouds lit cool blue from the moon. No purple cast."
- **`land-night.png`:** "The same village at night in rich blue moonlight: warm orange light glowing from the inn's windows and doorway and from a few house windows, the chimney smoke lit faintly, a few fireflies over the rice paddies. Keep the sky area flat pure magenta (#FF00FF). No purple cast."
- **`foreground-night.png`:** "The same foreground at night in cool blue moonlight, with the blossom a soft moonlit pink. Keep the background flat pure magenta (#FF00FF)."

Without night plates, night mode tints the day plates blue in code and adds warm glows in the inn's windows. That works, but painted night plates look much better.

---

## What happens when you add them

1. `npm run world:plates` checks each file (size, magenta background) and crops it to 16:9 around the centre. It cuts the magenta out with soft edges and removes the pink band image tools leave along the edges, then scales the plate to 3840 × 2160 (upscaling only if smaller). Finally it writes AVIF and WebP files at 3840, 2560, 1600 and 960 wide to `public/world/plates/`. It warns about anything off, such as a plate that will look soft or a crop that may cut the inn.
2. `/world` switches from the code-drawn village to your plates automatically. Until the plates exist, it keeps the code-drawn village.
3. The inn's clickable area, the window glows and the firefly area are already placed for the Sep 26 `land-day` draft (`content/world-scene.ts`). If the final land plate changes the layout, I re-measure them, then send you screenshots at 390 px and 1440 px.
