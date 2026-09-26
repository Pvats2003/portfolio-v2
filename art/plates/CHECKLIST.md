# Painted plates: checklist

Put the finished images **in this folder** (`art/plates/`) on the `anime-world` branch. You can upload them on GitHub (open the folder, then **Add file → Upload files**), or attach them in our chat. I then run `npm run world:plates`, mark where the inn, lanterns and chimney are, and send you screenshots.

There are **three plates**, each a separate image. The day set is required; the night set is optional but recommended.

| ✓ | File name (exact) | Size | Aspect | Background | Format |
|---|---|---|---|---|---|
| ☐ | `sky-day.jpg` | 3840 × 2160 (≥ 1920 wide) | 16:9 (else auto-cropped) | normal (the sky itself) | JPG or PNG |
| ☐ | `land-day.png` | 3840 × 2160 (≥ 1920 wide) | 16:9 (else auto-cropped) | **flat pure magenta `#FF00FF`** where the sky would be | **PNG** |
| ☐ | `foreground-day.png` | 3840 × 2160 (≥ 1920 wide) | 16:9 (else auto-cropped) | **flat pure magenta `#FF00FF`** everywhere except the foreground objects | **PNG** |
| ☐ | `sky-night.jpg` *(optional)* | 3840 × 2160 (≥ 1920 wide) | 16:9 (else auto-cropped) | normal | JPG or PNG |
| ☐ | `land-night.png` *(optional)* | 3840 × 2160 (≥ 1920 wide) | 16:9 (else auto-cropped) | flat pure magenta `#FF00FF` | PNG |
| ☐ | `foreground-night.png` *(optional)* | 3840 × 2160 (≥ 1920 wide) | 16:9 (else auto-cropped) | flat pure magenta `#FF00FF` | PNG |

**Size:** best is 3840 × 2160 (16:9), but any image **at least 1920 px wide** works, at any aspect ratio:
- **Not 16:9?** It's cropped to 16:9 around the centre, which keeps the inn in frame if you followed the framing rules below. Give all three plates of a set the same size so they crop the same way and line up. The script warns if a crop is extreme enough to cut the inn, or if a set's shapes don't match.
- **Smaller than 3840 wide?** It's upscaled to 3840 × 2160. Under 2560 px wide (after cropping), the script warns that it will look soft on large and high-resolution screens. For the sharpest result, upscale in your image tool to 3840 wide first.
- **Under 1920 px wide:** skipped, with a message saying so.

**Magenta rules:**
- **Why magenta, not green:** the art is full of greens (fields, forest, grass) and blues (water, sky), but has no saturated magenta. The pale pink of cherry blossom is far enough away to stay.
- **Make it one flat colour:** no gradient, texture, vignette, shadow or glow on the background.
- **If your tool won't do exact `#FF00FF`:** a close magenta works (the cut-out allows some tolerance). Or repaint the background with a bucket-fill in any image editor.
- **Keep magenta out of the art itself:** no magenta or hot-pink objects, clothes or flowers.
- **Save as PNG, not JPG.** JPG compression smears the magenta edges.

**Framing, so the three plates line up and phones keep the inn in view:**
- **Camera:** the same in all three; eye level, 35 mm lens, looking straight at the inn.
- **The inn:** centred horizontally, no wider than **a quarter of the image**. Phones only see the centre of the picture. Its roof peak sits about 38% down from the top, and its base about 78% down.
- **The forest line (horizon):** about 60% down from the top.
- **Light:** a low golden sun on the right, shadows falling to the left, in every plate.
- **Everywhere:** no text, lettering or signs with words, no logos, no recognisable faces, and no studio, film or artist names in the prompt.

**Order that keeps the plates consistent:**
1. Generate `land-day` first.
2. Use it as the reference image when you generate `sky-day` and `foreground-day`.
3. Make each night plate with image-to-image from its day plate, at low strength so the layout doesn't move.

---

## 1. `sky-day.jpg`

> Hand-painted anime background art, original style, 16:9. A late-afternoon golden-hour sky over Japanese countryside: deep blue at the top fading to warm peach and amber at the horizon, towering cumulus clouds with soft pink-lavender shadows and bright cream tops lit from the right, a few thin wispy streaks high up, a low warm sun glow near the right horizon. Painterly brushwork, soft gradients, gentle grain. Sky only, no ground, no mountains, no buildings, no birds, no text.

## 2. `land-day.png`

> Hand-painted anime background art, original style, 16:9, eye-level view with a 35 mm lens. A quiet Japanese countryside village at golden hour. In the exact centre, a two-storey traditional wooden inn: dark blue-grey clay tile roof with a small gable on top, white plaster and dark timber on the upper floor with a wooden balcony rail, glowing paper shoji screens, an indigo cloth curtain over the entrance, two red paper lanterns, a thin line of chimney smoke. To the left, a smaller wooden house with laundry drying on a bamboo pole and a bicycle leaning on its wall. To the right, a glowing drink vending machine, a wooden utility pole with sagging power lines, and terraced rice paddies reflecting the sky. Behind, a band of rounded green forest and a large green-blue mountain with soft haze at its base. In front, a clear shallow stream crossing left to right with smooth river stones and a small arched stone footbridge leading to the inn, and green grass in the foreground. Warm light from the right, long soft shadows to the left, lived-in details, painterly texture. **The entire sky area is flat, solid, pure magenta (#FF00FF): no sky, no clouds, no gradient.** No people, no text, no lettering on signs.

## 3. `foreground-day.png`

> Hand-painted anime background art, original style, 16:9. Only foreground framing elements for a countryside scene, seen at eye level: on the left edge, a cherry blossom tree with a dark trunk and branches of pale pink blossom reaching over the top-left corner; an old wooden fence in the lower-left corner; tall grass tufts in both bottom corners; three flat stepping stones at the bottom centre. The centre of the image is empty. Golden-hour rim light from the right. **Everything else is flat, solid, pure magenta (#FF00FF): no sky, no ground, no gradient, no shadow on the background.** No text.

## Night versions (optional): image-to-image from each day plate, low strength

- **`sky-night.jpg`:** "The same sky at night: rich deep-blue moonlit sky with scattered stars and a bright full moon at the upper right, clouds lit cool blue from the moon. No purple cast."
- **`land-night.png`:** "The same village at night in rich blue moonlight: warm orange light glowing from the shoji screens, the two red paper lanterns lit, the vending machine glowing, a few fireflies over the rice paddies. Keep the sky area flat pure magenta (#FF00FF). No purple cast."
- **`foreground-night.png`:** "The same foreground at night in cool blue moonlight, with the blossoms a soft moonlit pink. Keep the background flat pure magenta (#FF00FF)."

Without night plates, night mode tints the day plates blue in code and adds the lantern glows. That works, but painted night plates look much better.

---

## What happens when you add them

1. `npm run world:plates` checks each file (size, magenta background) and crops it to 16:9 around the centre. It cuts the magenta out with soft edges and removes any pink fringe, then scales the plate to 3840 × 2160 (upscaling only if smaller). Finally it writes AVIF and WebP files at 3840, 2560, 1600 and 960 wide to `public/world/plates/`. It warns about anything off, such as a plate that will look soft or a crop that may cut the inn.
2. `/world` switches from the code-drawn village to your plates automatically. Until the plates exist, it keeps the code-drawn village.
3. I mark the inn's clickable area, the lantern glows, the chimney and the firefly area on your plates (`content/world-scene.ts`) and send you screenshots at 390 px and 1440 px.
