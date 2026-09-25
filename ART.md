# ART.md — what the anime world needs, and where it could come from

Written after the look-dev round (`/world/lookdev`, frames A/B/C). Nothing here has been bought or generated yet.

## Can art drawn in code reach an anime-film look?

**No.** The three frames show the ceiling:

- **B (painted SVG):** a clean flat illustration, like a vector poster or a picture book.
- **A and C (3D):** a cheerful toon game.

An anime-film background gets its look from things code can't produce by hand: painted texture, soft light falling across surfaces, dense foliage and hundreds of small details. Getting there needs **painted art**, either:

- painted background layers (from an artist or an image generator), used in a 2.5D parallax scene, or
- a proper stylised 3D kit (hand-painted textures, a real toon character with animations), used in a 3D scene.

## Decision (Sep 26): Path 1, painted 2.5D; Priyanshu generates the plates

**The working checklist is [`art/plates/CHECKLIST.md`](art/plates/CHECKLIST.md):** one prompt per plate, with exact file names, sizes and backgrounds.

It uses **three plates** (sky, land, foreground) rather than the five layers first listed here. Layers generated separately rarely line up: horizons, perspective and light drift between generations. Keeping the mountains, village, inn and stream in one painting (`land`) guarantees they match. The sky behind it and the foreground framing in front still give the parallax depth.

**Cut-out step:** `npm run world:plates` (`scripts/world-plates.mjs`). It keys out flat magenta with soft edges and removes the pink fringe, then writes responsive AVIF and WebP files and `content/world-plates.json`.

## Path 2 — walkable 3D slice (not chosen; kept for reference)

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
