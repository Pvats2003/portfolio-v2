# ART.md — what the anime world needs, and where it could come from

Written after the look-dev round (`/world/lookdev`, frames A/B/C). Nothing here has been bought or generated yet.

## Can art drawn in code reach an anime-film look?

**No.** The three frames show the ceiling:

- **B (painted SVG):** a clean flat illustration, like a vector poster or a picture book.
- **A and C (3D):** a cheerful toon game.

An anime-film background gets its look from things code can't produce by hand: painted texture, soft light falling across surfaces, dense foliage and hundreds of small details. Getting there needs **painted art**, either:

- painted background layers (from an artist or an image generator), used in a 2.5D parallax scene, or
- a proper stylised 3D kit (hand-painted textures, a real toon character with animations), used in a 3D scene.

## Path 1 — 2.5D painted layers (fits the "look-dev first, no walking" override)

**Layers**, one scene, 3840 × 2160, each with a transparent background (or a flat green one I can key out):

1. **Sky:** gradient and big clouds, no ground.
2. **Far mountains:** the big mountain and the far ridge, with haze at the base.
3. **Mid village:** the forest band, the inn (centre), the neighbour's house with laundry and a bicycle, the vending machine, the utility pole and wires, the rice paddies.
4. **Stream and bridge:** the water band, the stone banks and the arched stone bridge.
5. **Foreground:** a cherry tree framing the left, a wooden fence, grass tufts, stepping stones.
6. **Separate cut-outs** for things that move or light up: the two paper lanterns, the shoji windows (as a mask), chimney smoke, the vending-machine panel, and the inn on its own (so hovering or tapping it can highlight it).

**Night:** either generate the same scene again as a night version (image-to-image from the day plate, so the layout matches), or colour-grade the day plates in code and add the light layers. The night-lit windows and lanterns look much better painted.

**Code on top** (already built in frame B): parallax, drifting clouds, flickering lanterns, rising smoke, water shimmer, falling petals, fireflies, the day/night switch, hotspots, keyboard access and a quick view.

**Size:** about 6 AVIF layers of 150–400 KB each, plus about 10 KB of code. That's no problem on phones.

### Image prompts

Use the same settings for every layer: **16:9, 3840 × 2160, eye-level camera at about head height, 35 mm lens, the inn in the centre, a low golden sun from the right, shadows falling to the left.** No text, no logos, no people's faces, and no named studios, films or artists.

- **Sky:** "Hand-painted anime background art, original style. Late-afternoon golden-hour sky over the Japanese countryside: deep blue at the top fading to warm peach and amber at the horizon, towering cumulus clouds with soft pink-lavender shadows and bright cream tops lit from the right, thin wispy streaks high up. Painterly brushwork, soft gradients, gentle film grain. Sky only, no ground, no buildings, no text."
- **Far mountains:** "Hand-painted anime background art, original style. A single large green-blue mountain centre-left and a lower ridge to the right, in a Japanese rural valley at golden hour. The sun-side slopes on the right are warm and lit; the left sides are cool blue-grey shadow, with soft gullies and forest texture. Atmospheric haze at the base fades into warm light. Transparent (or flat green) background above and below, no sky, no text."
- **Mid village:** "Hand-painted anime background art, original style. A quiet Japanese countryside village at golden hour, eye-level view. In the centre, a two-storey traditional wooden inn: dark blue-grey clay tile roof with a small gable, white plaster and dark timber on the upper floor, glowing paper shoji screens, an indigo curtain over the entrance, two red paper lanterns, a thin line of chimney smoke. To the left, a smaller wooden house with laundry drying on a bamboo pole and a bicycle leaning on the wall. To the right, a glowing drink vending machine, a wooden utility pole with sagging power lines, and terraced rice paddies reflecting the sky. A band of rounded green forest behind. Warm light from the right, long soft shadows to the left, lived-in details, painterly texture. Transparent (or flat green) background, no sky, no mountains, no people, no text or signage lettering."
- **Stream and bridge:** "Hand-painted anime background art, original style. A clear shallow stream crossing the frame from left to right, reflecting a golden sky, with smooth river stones along both banks and a small arched stone footbridge in the centre. Sparkles of warm light on the water, painterly texture. Eye level, 35 mm. Transparent (or flat green) background, no sky, no text."
- **Foreground:** "Hand-painted anime background art, original style. Foreground framing elements for a countryside scene: a cherry blossom tree on the left edge with a dark trunk and branches of pale pink blossom reaching over the top-left corner, an old wooden fence at the lower left, tall grass tufts in the bottom corners, and flat stepping stones leading into the scene at the bottom centre. Golden-hour rim light from the right. Transparent (or flat green) background, no text."
- **Night variant (image-to-image from each day layer, low strength):** "Same scene at night: rich deep-blue moonlit sky with stars and a bright full moon upper right; the buildings in cool blue moonlight; warm orange light glowing from the shoji screens, the paper lanterns and the vending machine; no purple cast."

**Which image generator:** the licence depends on the tool and the plan. Check that the plan gives commercial rights, and that you're comfortable with how the tool was trained. I haven't generated anything; you would, and send me the files.

## Path 2 — walkable 3D slice (the "vertical slice" brief)

**Art needed:**

- **Character:** an anime-proportioned model with a toon shader, and the animations idle, walk, run, turn and interact.
- **Buildings and props:** an inn, houses, a bridge, lanterns, fences, a vending machine, poles, vegetation, all with hand-painted textures.
- **Sky:** a painted sky backdrop (the Path 1 sky layer works here too).

**Sources:**

1. **Character: VRoid Studio + three-vrm (free).** VRoid is pixiv's free tool for making original anime-style characters. Models you make can be used commercially, unless you use third-party items with their own terms ([VRoid FAQ](https://vroid.pixiv.help/hc/en-us/articles/4405813333657-Can-I-use-the-models-created-with-VRoid-Studio-Stable-Ver-for-commercial-purposes), [guidelines](https://vroid.com/en/studio/guidelines)). [three-vrm](https://pixiv.github.io/three-vrm/docs/modules/three-vrm-materials-mtoon.html) renders them in three.js with the MToon anime shader. This is the most reliable way to get a genuinely anime character.
2. **Animations: Mixamo (free) or Quaternius (CC0).**
   - [Mixamo](https://helpx.adobe.com/creative-cloud/faq/mixamo-faq.html) is royalty-free for commercial projects with an Adobe ID; you can't redistribute the files on their own. There's an existing [Mixamo-to-VRM retargeting library](https://github.com/saori-eth/vrm-mixamo-retargeter).
   - [Quaternius Universal Animation Library](https://quaternius.com/packs/universalanimationlibrary.html) has 120+ CC0 animations in glTF, free.
3. **Environment: a stylised Japanese pack from Fab or Synty (paid).**
   - Fab listings such as "Japan Countryside (Anime Environment)", "Stylized Japanese Town Pack" and "Japan Village". The Fab Standard License allows use outside Unreal and commercial release inside a project, but not standalone redistribution ([Fab forum summary](https://forums.unrealengine.com/t/is-use-of-other-assets-allowed-under-fab-standard-license/2564928)). You must pick a pack that ships FBX, GLB or OBJ, not Unreal-only files. I couldn't open the listings from here to check prices.
   - Synty POLYGON Samurai Empire: a one-time purchase, or a subscription from $30/month; the licence bars NFT and blockchain use ([Synty licences](https://syntystore.com/pages/licences-overview)). Its low-poly look is closer to "generic game" than "anime film", and web use should be confirmed with Synty.
4. **Or commission an artist** for the character, the inn and a small prop set. My rough estimate (not researched) is a few hundred to a few thousand USD, depending on scope and the artist.

**Size and speed** (estimates; this machine only renders in software):

- **Download:** about 265 KB for the 3D engine, plus a character (VRM, about 5–15 MB before optimising), plus the environment (typically 5–20 MB before compression).
- **Laptops** with integrated graphics: about 40–60 fps at 1080p with bloom and shadows.
- **Mid-range phones:** 20–40 fps, which is why phones get the still picture.
