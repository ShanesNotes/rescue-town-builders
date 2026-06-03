# Hearthlight Town — Art Prompt Bible (LOCKED)

> **For Codex (image generation) and the team.**  
> Every prompt here is ready to paste into the image tool.  
> This document + `docs/design/design-system.md` is the contract. Shane chose Hearthlight; obey exactly.  
> Goal: a child leans in at first sight and wants to fall into this world. Warmth spreads as you help.

**Core rule:** All art is original, IP-safe, zero third-party likenesses, names, or references (no Paw Patrol, no existing game characters, no branded marks). The technique and the soul are one: **a dark window lights warm** when a friend is rescued. The microcosm lives in Cluckle's dream.

---

## STYLE CONSISTENCY GUIDE (the #1 risk — read before every prompt)

**Technique**  
- Hand-crafted **pixel-art**, chunky and bold. Visible pixels, flat fills, minimal dither, crisp 1–2 px outlines at source resolution.  
- No anti-aliasing, no smooth gradients, no vector softness. Nearest-neighbor perfect.  
- Author at **2× half-density**: logical game 960×540, art created for 480×270 grid so one art texel = 2 game pixels. Source sprites 64×64 / 128×128 common; tiles 32×32 or 48×48. Backdrops 480×270 or 960×540.

**Lighting (non-negotiable)**  
- **Consistent warm directional light from UPPER LEFT** (~45°). Every asset obeys the same sun/lamp angle.  
- Lit side: candle-gold `#FFC857` + warm-highlight `#FFE6A3`.  
- Shadow side + under: ember-shadow `#572D42`, deep-slate-night `#1B2A41`.  
- Distant / unlit: cool-shadow `#3A4D6B`.  
- Light **spills** softly onto ground and nearby surfaces in all lit-window / lantern / character-face assets. Additive bloom layer (warm-glow fx) sits behind key lights later.

**Palette (LOCKED — nothing else)**  
Use *only* these hexes. No pure black, no neon, no cold blues, no high-saturation primaries outside the listed warms.  
- `deep-slate-night` `#1B2A41` — base floor, letterbox, deepest shadow, night sky  
- `cool-shadow` `#3A4D6B` — unlit shadow, far parallax layers  
- `ember-shadow` `#572D42` — warm shadow under lights, under forms  
- `deep-ember` `#A73428` — dark warm accents  
- `ember-fox-orange` `#E86F3A` — Ember, primary fire/warm, main character warmth  
- `lantern` `#F4A24C` — lamplight mid-tone  
- `candle-gold` `#FFC857` — lit window glow, reward gold, coin rims  
- `warm-highlight` `#FFE6A3` — brightest sparkles, inner glows, cream edges  
- `teal-relief` `#43A29C` — Rivet accents, water, cool relief (use *sparingly*)  
- `warm-cream` `#EBDDDA` — soft neutrals, Cluckle body, UI text ground, highlight on warm surfaces  

Rule: cool navy/slate **floor and distance**, warm gold/ember **light and life**. Contrast is warmth vs. dark, never saturation vs. blur. Scenes stay mostly dim with pools of light.

**Silhouette & Scale**  
- **Bold, simple, chunky silhouettes** — instantly readable at 48–80 px on screen.  
- Large heads, big friendly eyes, minimal internal detail. Form first, then a few telling accents (satchel, hardhat, pack).  
- Test mentally at 48 px: does the shape still read as "raccoon with satchel"? If not, simplify.

**Mood & Soul**  
- Sleepy **golden-hour dusk** town at the moment lamps begin to glow. Cozy, lush, hand-warm, quietly hopeful. Never cold, never generic cute, never scary.  
- References in spirit (never copy): A Short Hike warmth, Hyper Light Drifter silhouette clarity, Eastward tenderness, Stardew Valley cozy scale — but pixel, dusk, our palette.  
- **Hidden Light / Language of Creation**: every dark building asset carries the *potential* of a warm window. Cluckle always contains the microcosm (tiny roofs + lit dots inside her form or in the well reflection). The gesture "rescue → light" is visible even in static props.

**Backgrounds & Export**  
- **Transparent PNG** for characters, props, tiles (except full backdrops/parallax layers and UI panels that may need subtle ground plane).  
- No canvas color, no drop shadows unless the art itself casts one (rare).  
- Centered subject, generous padding for silhouette breathing room.  
- File names match the prompts below. Generate, then record exact path + date in `docs/assets/ASSET_BACKLOG.md`.

**Animation Poses (for idle/cheer/oops)**  
- **idle**: relaxed neutral stance, gentle breathing suggestion (slight chest/shoulder lift in form, soft smile or closed eyes for Cluckle). 2–4 frames later via tiny y-offset variants.  
- **cheer/happy**: open joyful expression, eyes bright or crescent, arms slightly raised or tool lifted, tail or ears perky.  
- **oops**: mild friendly surprise (eyes a touch wider, small "o" or soft gasp mouth, one ear or hand lifted), never distress or fear — still safe and inviting.  
All three share exact same body model, lighting angle, palette, line weight so they feel like one character.

**Line weight & Polish**  
- Outlines: 1–2 px, use deep-slate-night or ember-shadow for weight; never pure black.  
- Inner detail lines thinner or same warm shadow.  
- Lit windows, lanterns, sparkles, and Cluckle's inner glow get a 1 px warm-highlight rim or candle-gold fill.  
- Everything feels "from the same hand" — same chunkiness, same light angle, same limited palette discipline.

**IP & Originality Guard**  
Every prompt repeats: original design, no existing IP, no third-party character likeness. If the output looks like a known brand, regenerate.

**How to use this doc**  
1. Copy one full prompt block below.  
2. Paste into Codex image tool.  
3. Add any tool-specific: "pixel art, low resolution, crisp pixels, transparent background".  
4. Generate at source size noted.  
5. If drift appears (wrong palette, soft edges, cold light), paste the STYLE GUIDE paragraph + offending prompt again with "exactly matching previous Hearthlight assets, fix lighting to upper left, restrict to locked palette only".  
6. Curate, name exactly, atlas later.

---

## HERO PROMPTS (extra care — title + character anchors)

### Title Backdrop (hero)
`public/assets/hearthlight/backdrops/title-backdrop.png` — 480×270 or 960×540 source. Full scene used under title + Cluckle silhouette. Transparent or full-bleed dusk sky.

Prompt:
```
Hearthlight Town pixel art title backdrop, cozy golden-hour dusk at sleepy town hour, warm upper-left light from candle-gold #FFC857 and warm-highlight #FFE6A3 pooling on forms, deep navy #1B2A41 shadows and floor, cool-shadow #3A4D6B far distance, bold simple silhouettes readable even small. Center-lower: large round Cluckle the dreaming hen, soft warm-cream #EBDDDA body with faint ember-shadow #572D42 feather lines, eyes gently closed in a dreaming smile, the secret heart who holds the whole world inside her. Inside her soft rounded outline, visible only on close look, tiny glowing miniature town — two small houses with lit candle-gold windows, a winding path, one tree with nest, a single well — all rendered as microcosm dots and roofs in warm light, the Language of Creation made small enough for a child to hold. Low rolling far-hills in desaturated cool-shadow and ember-shadow. Mid-ground: rounded rooftops and one chimney with a soft smoke curl catching warm light. Three small helper silhouettes peek from behind low hills or soft cloud shapes at left and right edges, facing inward: left Rivet (raccoon with tiny satchel), center-right Brick (badger with hardhat), right Ember (fox with water pack). One or two slow elements: a single paper leaf or seed drifting down left side, one very faint sparkle rising from Cluckle's back right. Sky gradient from deep-slate-night #1B2A41 at very top melting to warmer lantern #F4A24C and candle-gold near the low horizon, no hard line, soft pre-glow feeling. Overall mood: the town is already dreaming the child, safe, glowing, waiting. Chunky pixel art, crisp edges, flat fills, transparent where sky meets subject but full coverage for backdrop use, consistent upper-left warm light across every element, exactly the locked Hearthlight palette only, original IP-safe design, no third-party likenesses, high warmth and invitation.
```

### Rivet Hero (model / title anchor)
`public/assets/hearthlight/characters/rivet-hero.png` — larger 128×128 or 160×160, full pose for title badge and reference. Use same model for all game states.

Prompt:
```
Hearthlight Town pixel art character hero, Rivet the raccoon — the bright patient helper who sees a friend in every lost scrap and guides it home with a quiet smile. Chunky bold silhouette, 128x128 canvas, upper-left warm light, locked Hearthlight palette only. Small bright raccoon, rounded body in warm-cream #EBDDDA with cool-shadow #3A4D6B and ember-shadow #572D42 shading, teal-relief #43A29C accents on tail stripes and little satchel strap, satchel itself in deep-ember #A73428 with warm highlight. Big friendly eyes with warm cream inner, soft smile, one paw raised in gentle offering. Tiny hard-to-see recycle symbol on satchel. Consistent upper-left candle-gold rim light on left side of ears, snout, satchel, tail. Bold simple forms readable at 48px, crisp pixel edges, flat fills, transparent background, original IP-safe, matches every other Hearthlight asset exactly in lighting, line weight, chunkiness and palette.
```

### Brick Hero
`public/assets/hearthlight/characters/brick-hero.png`

Prompt:
```
Hearthlight Town pixel art character hero, Brick the badger — the sturdy thoughtful builder who listens to the ground and raises walls that feel like promises kept. Chunky bold silhouette, 128x128, upper-left warm light, locked Hearthlight palette only. Stocky badger body in ember-fox-orange #E86F3A and warm-cream mixes with deep-ember #A73428 stripes on face and back, tiny wooden hardhat in lantern #F4A24C with ember-shadow trim. Small trowel or brick in one paw. Big calm eyes, steady warm smile, ears and snout in warm shadow. Upper-left light catches hardhat brim, shoulder, tool edge in candle-gold #FFC857 and warm-highlight. Bold simple readable silhouette at small size, crisp chunky pixels, transparent background, original IP-safe design, exactly consistent with Rivet hero and all Hearthlight set in light angle, palette discipline, line weight.
```

### Ember Hero
`public/assets/hearthlight/characters/ember-hero.png`

Prompt:
```
Hearthlight Town pixel art character hero, Ember the fox — the quick gentle firefighter who treats every flame like a visitor who's stayed too long and kindly shows it the way to rest. Chunky bold silhouette, 128x128, upper-left warm light, locked Hearthlight palette only. Sleek fox body in ember-fox-orange #E86F3A with warm-cream chest and tail tip, lantern #F4A24C inner ear and accents, small teal-relief water pack on back with soft highlight. Kind bright eyes, gentle closed-mouth smile, tail with a happy slight curve. Upper-left light pools candle-gold on snout, chest, pack rim and tail. Bold simple forms, high readability at 48px, crisp pixels, transparent background, original IP-safe, matches the exact lighting, chunk, palette and warmth of Rivet and Brick heroes.
```

### Cluckle Hero
`public/assets/hearthlight/characters/cluckle-hero.png`

Prompt:
```
Hearthlight Town pixel art character hero, Cluckle the dreaming hen — the round soft secret heart of the town, eyes half-closed in a dreaming smile, holding the entire glowing world safe inside her sleep. Chunky bold silhouette, 128x128 or rounder 140x140, upper-left warm light, locked Hearthlight palette only. Very round feathery hen body in warm-cream #EBDDDA with ember-shadow #572D42 and cool-shadow feather lines, tiny soft comb and wattle in deep-ember #A73428 with warm highlight. Eyes gently closed, dreaming peaceful smile. Inside the body outline, extremely faint suggestion of tiny lit roofs and warm dots (the microcosm) visible only on close inspection — never busy, just a soft inner glow in candle-gold. Upper-left light gives a soft halo rim on the top and left curve of her form in warm-highlight #FFE6A3. Bold simple, incredibly soft and safe feeling, readable as hen even at 48px, crisp pixel edges, transparent background, original IP-safe, the living proof that something enormous can be carried gently inside something small.
```

---

## CHARACTERS — Game Sprites (idle / cheer / oops)

All characters use the same body model, lighting, and palette as their hero. Generate the three key poses. Idle will be the base for 2–4 frame breathing bob (tiny vertical variants later).

### Rivet (raccoon — the bright patient helper who sees a friend in every lost scrap and guides it home with a quiet smile)

**rivet-idle** (`characters/rivet-idle.png`)
```
Hearthlight Town pixel art sprite, Rivet the raccoon idle breathing pose — the bright patient helper who sees a friend in every lost scrap and guides it home with a quiet smile. 64x64 or 80x80 canvas, chunky pixel art, upper-left warm light, locked Hearthlight palette only. Small raccoon, rounded body warm-cream with teal-relief satchel strap and tail stripes, satchel deep-ember, big friendly eyes soft smile, relaxed stance one paw near satchel. Upper left candle-gold highlight on ear tips, snout, satchel edge. Bold simple silhouette highly readable at 48px, crisp 1-2px outlines, flat fills, transparent background, exactly matches Rivet hero lighting angle and all Hearthlight assets.
```

**rivet-cheer** (`characters/rivet-cheer.png`)
```
Hearthlight Town pixel art sprite, Rivet the raccoon cheer/happy pose — the bright patient helper who sees a friend in every lost scrap and guides it home with a quiet smile. 64x64 or 80x80, chunky pixel art, upper-left warm light, locked Hearthlight palette only. Same raccoon model as idle, now joyful: eyes bright crescents or open happy, both paws lifted in gentle celebration or offering a found object, tail perky, big warm smile. Stronger warm-highlight catch on face and satchel. Bold readable silhouette, transparent background, consistent with rivet-idle and hero, original IP-safe.
```

**rivet-oops** (`characters/rivet-oops.png`)
```
Hearthlight Town pixel art sprite, Rivet the raccoon oops/mild surprise pose — the bright patient helper who sees a friend in every lost scrap and guides it home with a quiet smile. 64x64 or 80x80, chunky pixel art, upper-left warm light, locked Hearthlight palette only. Same body, gentle surprise: eyes a little wider but still kind, small soft "o" mouth, one paw or ear lifted, satchel shifted slightly. Still safe and friendly, never scared. Light and palette identical to idle. Transparent background, matches the set exactly.
```

### Brick (badger — the sturdy thoughtful builder who listens to the ground and raises walls that feel like promises kept)

**brick-idle** (`characters/brick-idle.png`)
```
Hearthlight Town pixel art sprite, Brick the badger idle breathing pose — the sturdy thoughtful builder who listens to the ground and raises walls that feel like promises kept. 64x64 or 80x80, chunky pixel art, upper-left warm light, locked Hearthlight palette only. Stocky badger, ember-fox-orange body with warm-cream and deep-ember face stripes, tiny hardhat lantern color, relaxed stance holding small trowel or brick low, calm steady eyes and warm closed smile. Upper-left light on hardhat and shoulder. Bold silhouette readable at 48px, transparent background, consistent with Brick hero and Hearthlight set.
```

**brick-cheer** (`characters/brick-cheer.png`)
```
Hearthlight Town pixel art sprite, Brick the badger cheer/happy pose — the sturdy thoughtful builder who listens to the ground and raises walls that feel like promises kept. 64x64 or 80x80, chunky pixel art, upper-left warm light, locked Hearthlight palette only. Same model, now quietly triumphant: eyes soft happy, both paws raised or one holding finished small brick piece high, hardhat tipped back a touch, big satisfied smile. Warm light catches tool and hat brim. Matches brick-idle exactly in form, light, palette. Transparent, original.
```

**brick-oops** (`characters/brick-oops.png`)
```
Hearthlight Town pixel art sprite, Brick the badger oops/mild surprise pose — the sturdy thoughtful builder who listens to the ground and raises walls that feel like promises kept. 64x64 or 80x80, chunky pixel art, upper-left warm light, locked Hearthlight palette only. Same body, gentle "oops": eyes wider but steady, small thoughtful frown-mouth, one paw to hardhat or brick slightly off. Still solid and kind. Identical lighting and silhouette language to other Brick states. Transparent background.
```

### Ember (fox — the quick gentle firefighter who treats every flame like a visitor who's stayed too long and kindly shows it the way to rest)

**ember-idle** (`characters/ember-idle.png`)
```
Hearthlight Town pixel art sprite, Ember the fox idle breathing pose — the quick gentle firefighter who treats every flame like a visitor who's stayed too long and kindly shows it the way to rest. 64x64 or 80x80, chunky pixel art, upper-left warm light, locked Hearthlight palette only. Sleek fox, ember-fox-orange with warm-cream chest, small teal water pack on back, kind bright eyes, soft gentle smile, relaxed ready stance with hose nozzle low. Upper left light on snout, chest, pack. Bold readable at small size, transparent, matches Ember hero and set.
```

**ember-cheer** (`characters/ember-cheer.png`)
```
Hearthlight Town pixel art sprite, Ember the fox cheer/happy pose — the quick gentle firefighter who treats every flame like a visitor who's stayed too long and kindly shows it the way to rest. 64x64 or 80x80, chunky pixel art, upper-left warm light, locked Hearthlight palette only. Same model, happy relief: eyes happy crescents, tail wagging curve, both paws or one raised with hose in small victory, big kind smile. Stronger warm light on face and pack rim. Matches ember-idle form and lighting exactly. Transparent, IP-safe.
```

**ember-oops** (`characters/ember-oops.png`)
```
Hearthlight Town pixel art sprite, Ember the fox oops/mild surprise pose — the quick gentle firefighter who treats every flame like a visitor who's stayed too long and kindly shows it the way to rest. 64x64 or 80x80, chunky pixel art, upper-left warm light, locked Hearthlight palette only. Same body, mild surprise: eyes wider kindly, small "oh" expression, hose or paw lifted, tail slightly lower. Still gentle and safe. Exact same light angle, palette, chunk as other Ember states. Transparent background.
```

### Cluckle (dreaming hen — the round soft secret heart of the town, eyes half-closed in a dreaming smile, holding the entire glowing world safe inside her sleep)

**cluckle-idle** (`characters/cluckle-idle.png`)
```
Hearthlight Town pixel art sprite, Cluckle the dreaming hen idle — the round soft secret heart of the town, eyes half-closed in a dreaming smile, holding the entire glowing world safe inside her sleep. 64x64 or 72x72 round canvas, chunky pixel art, upper-left warm light, locked Hearthlight palette only. Very round feathery hen, warm-cream body with soft ember-shadow feather texture, deep-ember comb/wattle, eyes gently closed peaceful, dreaming smile. Extremely faint inner microcosm glow (tiny roofs + candle-gold dots) inside body outline. Soft warm-highlight halo on upper curve. Bold yet soft silhouette, incredibly safe feeling, transparent background, matches Cluckle hero.
```

**cluckle-cheer** (`characters/cluckle-cheer.png`)
```
Hearthlight Town pixel art sprite, Cluckle the dreaming hen cheer — the round soft secret heart of the town, eyes half-closed in a dreaming smile, holding the entire glowing world safe inside her sleep. 64x64 or 72x72, chunky pixel art, upper-left warm light, locked Hearthlight palette only. Same round hen model, now gently delighted: eyes softly open with warm light in them, smile wider, wings/feathers lifted in tiny happy shrug, inner microcosm dots a touch brighter. Still dreamy and kind. Matches cluckle-idle lighting and form. Transparent, original.
```

**cluckle-oops** (`characters/cluckle-oops.png`)
```
Hearthlight Town pixel art sprite, Cluckle the dreaming hen oops — the round soft secret heart of the town, eyes half-closed in a dreaming smile, holding the entire glowing world safe inside her sleep. 64x64 or 72x72, chunky pixel art, upper-left warm light, locked Hearthlight palette only. Same body, very mild surprise: eyes a little more open but still soft, small gentle "cluck" beak shape, one wing slightly raised. Never alarmed. Inner glow steady. Identical palette, light, chunk to other Cluckle states. Transparent.
```

### Townsfolk (background critters for windows — 2–3 simple, populate lit buildings)

**townsfolk-a-hedgehog** (`characters/townsfolk-a-hedgehog.png`) — idle + cheer variants if needed; start with one friendly pose per.
```
Hearthlight Town pixel art sprite, townsfolk-a a small round hedgehog, simple background critter for window pop. 32x32 or 40x40, chunky pixel art, upper-left warm light, locked Hearthlight palette only. Tiny hedgehog body in cool-shadow and warm-cream, soft spines in ember-shadow, big dark eyes, tiny smile, peeking from window frame. Bold simple silhouette, very small detail, transparent background, matches main characters in lighting and palette discipline.
```

**townsfolk-b-mouse** (`characters/townsfolk-b-mouse.png`)
```
Hearthlight Town pixel art sprite, townsfolk-b a small plump field mouse, simple background critter for window pop. 32x32 or 40x40, chunky pixel art, upper-left warm light, locked Hearthlight palette only. Round mouse body warm-cream with cool-shadow, tiny ears and pinkish nose in deep-ember, holding a seed or just waving, friendly eyes. Minimal, readable at tiny size, transparent, consistent Hearthlight light and colors.
```

---

## TILES & PARALLAX

All tiles seamless-friendly where repeating. Parallax layers have depth cues (far more desaturated, less detail).

**cobble** (`tiles/cobble.png`) — 32x32 or 48x48 tile
```
Hearthlight Town pixel art tile, cobblestone ground, seamless. 32x32 canvas, chunky pixel art, upper-left warm light, locked Hearthlight palette only. Irregular rounded stones in cool-shadow #3A4D6B and deep-slate-night #1B2A41 with warm-cream and lantern mortar lines catching upper-left light. Slight ember-shadow in crevices. Flat, bold, readable as street, tileable, transparent or dark ground ready, matches town mood.
```

**grass** (`tiles/grass.png`)
```
Hearthlight Town pixel art tile, soft grass, seamless. 32x32, chunky pixel art, upper-left warm light, locked Hearthlight palette only. Clumpy grass blades in teal-relief #43A29C mixed with warm-cream and ember-shadow bases, lighter tips where light hits from upper left. Gentle rolling texture, not flat, tileable, cozy dusk field feel.
```

**path** (`tiles/path.png`)
```
Hearthlight Town pixel art tile, winding dirt path, seamless. 32x32, chunky pixel art, upper-left warm light, locked Hearthlight palette only. Warm sand/cream path with ember-shadow and cool-shadow edges, small pebbles in deep-ember, soft upper-left highlight down the center. Feels walked and friendly, tileable.
```

**water** (`tiles/water.png`)
```
Hearthlight Town pixel art tile, calm water, subtle ripple, seamless. 32x32 or 48x48, chunky pixel art, upper-left warm light, locked Hearthlight palette only. Deep cool-shadow and deep-slate-night base, teal-relief reflections and ripples, candle-gold and warm-highlight sparkles on wave crests from upper left. Gentle, not busy, tileable, safe for child scenes.
```

**night-sky** (`tiles/night-sky.png` or backdrops/night-sky.png) — large gradient
```
Hearthlight Town pixel art backdrop, night sky gradient for parallax and scenes. 480x270 or 960x540, chunky pixel art, locked Hearthlight palette only. Vertical gradient deep-slate-night #1B2A41 at top to slightly warmer cool-shadow and faint lantern near bottom horizon. Very subtle scattered warm-highlight dots as distant stars or early fireflies, one soft ember glow low where town lights would be. No hard horizon line, full bleed or with transparent lower for hills to composite. Upper-left light feeling even in sky via the warm low band.
```

**far-hills** (`parallax/far-hills.png`)
```
Hearthlight Town pixel art parallax layer, far hills. Wide 480x120 or similar, chunky pixel art, upper-left warm light, locked Hearthlight palette only, desaturated for depth. Soft rolling hills in cool-shadow #3A4D6B and deep-slate-night, very faint ember-shadow on the light-facing slopes, almost no detail, low contrast, distant feeling. Transparent lower edge for layering, matches overall dusk.
```

**mid-trees** (`parallax/mid-trees.png`)
```
Hearthlight Town pixel art parallax layer, mid distance trees and foliage. Wide, chunky pixel art, upper-left warm light, locked Hearthlight palette only. Rounded tree silhouettes in ember-shadow and cool-shadow with lantern and warm-cream leaf clusters catching light on left/upper sides, a few subtle branches. More detail and slight warmth than far-hills, still atmospheric, some trunk in deep-ember. Transparent bg ready for composite.
```

---

## BUILDINGS (dark + lit-window variants)

Every building has a dark (unlit, cool dominant) and lit (warm windows + ground spill) version. Lit windows use candle-gold fills + warm-highlight rim + soft spill rectangle or shape below in ember-shadow mixed with lantern on ground.

**house-dark** (`buildings/house-dark.png`)
```
Hearthlight Town pixel art building, small cozy house dark/unlit. 96x96 or 120x96 canvas, chunky pixel art, upper-left warm light, locked Hearthlight palette only. Rounded roof in ember-shadow and deep-ember, walls cool-shadow and deep-slate-night, one dark window rectangle in cool-shadow, simple door, tiny chimney. Bold silhouette, no interior light yet, ground shadow in deep-slate-night, transparent background, ready for town map and scenes.
```

**house-lit** (`buildings/house-lit.png`)
```
Hearthlight Town pixel art building, small cozy house with lit window (the core "rescue lights a window" gesture). 96x96 or 120x96, chunky pixel art, upper-left warm light, locked Hearthlight palette only. Same house form as dark version, now one or two windows filled with candle-gold #FFC857 and warm-highlight inner glow, soft 1px rim, warm light spills onto ground below in ember-shadow + lantern mix as a soft pool shape. Chimney may have tiny smoke curl catching light. Feels like someone inside is safe and happy. Transparent bg, exactly matches house-dark silhouette for swap.
```

**recycle-center-dark** (`buildings/recycle-center-dark.png`)
```
Hearthlight Town pixel art building, recycle center dark/unlit. Wider 140x90 canvas, chunky pixel art, upper-left warm light, locked Hearthlight palette only. Low sturdy building with sloped roof, cool-shadow and deep-slate-night walls, several dark window and door shapes, a few recycle bin silhouettes against wall in ember-shadow. Bold readable as industrial-but-cozy, transparent, no lights on.
```

**recycle-center-lit** (`buildings/recycle-center-lit.png`)
```
Hearthlight Town pixel art building, recycle center with warm lit windows. 140x90, chunky pixel art, upper-left warm light, locked Hearthlight palette only. Same silhouette as dark, now 2–3 windows and perhaps a door glow in bright candle-gold #FFC857 with warm spill on ground and on the recycle bins leaning against it. Light feels like the place is alive because Rivet helped. Matches dark version exactly for state swap.
```

**construction-lot-dark** (`buildings/construction-lot-dark.png`)
```
Hearthlight Town pixel art building/area, construction lot dark. 140x90, chunky pixel art, upper-left warm light, locked Hearthlight palette only. Open lot with partial walls or scaffolding in deep-ember and cool-shadow, stacked wood planks and bricks in lantern and ember-shadow, one small dark shed or house shell. Feels waiting for Brick. Transparent bg.
```

**construction-lot-lit** (`buildings/construction-lot-lit.png`)
```
Hearthlight Town pixel art building/area, construction lot with warm lit windows on the finished part. 140x90, chunky pixel art, upper-left warm light, locked Hearthlight palette only. Same forms, now a window or two in the built section glow candle-gold, soft ground spill, a lantern on a post or in window. Feels the house is becoming a home. Exact silhouette match to dark version.
```

**picnic-park** (fire/picnic area building or shelter) — use dark + lit
**picnic-park-dark** (`buildings/picnic-park-dark.png`)
```
Hearthlight Town pixel art building/area, picnic park shelter or pavilion dark. 120x80, chunky pixel art, upper-left warm light, locked Hearthlight palette only. Open wooden shelter with posts in deep-ember and lantern, roof in ember-shadow, picnic table shape in cool-shadow, no lights, a few dark "fire" spots as unlit circles. Transparent, Ember's domain waiting.
```

**picnic-park-lit** (`buildings/picnic-park-lit.png`)
```
Hearthlight Town pixel art building/area, picnic park shelter with warm lights after fires out. 120x80, chunky pixel art, upper-left warm light, locked Hearthlight palette only. Same shelter, now a hanging lantern or two glow in candle-gold #FFC857, warm light pools on the picnic table and ground, one or two windows in background building lit. Feels safe for play again. Matches dark silhouette.
```

---

## PROPS

**recycle bins (5)** — one per category for visual distinction in sorting. Different shapes or lid styles, all chunky, warm rim light.

**bin-compost** (`props/bin-compost.png`)
```
Hearthlight Town pixel art prop, compost recycle bin. 48x56 canvas, chunky pixel art, upper-left warm light, locked Hearthlight palette only. Tall rounded bin body in cool-shadow with teal-relief #43A29C lid and label stripe, compost leaf/banana shape on front in ember-fox-orange, candle-gold rim highlight on left and top. Bold silhouette, transparent background, consistent Hearthlight lighting.
```

**bin-metal** (`props/bin-metal.png`)
```
Hearthlight Town pixel art prop, metal recycle bin. 48x56, chunky pixel art, upper-left warm light, locked Hearthlight palette only. Squarish sturdy bin in deep-ember and cool-shadow, metal can symbol on front in lantern, warm candle-gold edge light on lid and left face. Transparent, matches other bins in family.
```

**bin-paper** (`props/bin-paper.png`)
```
Hearthlight Town pixel art prop, paper recycle bin. 48x56, chunky pixel art, upper-left warm light, locked Hearthlight palette only. Open-top or slotted bin in warm-cream and ember-shadow, newspaper or folded paper icon on side, candle-gold rim. Transparent.
```

**bin-plastic** (`props/bin-plastic.png`)
```
Hearthlight Town pixel art prop, plastic recycle bin. 48x56, chunky pixel art, upper-left warm light, locked Hearthlight palette only. Rounder or bottle-shaped bin body cool-shadow with lantern accents, plastic bottle symbol, warm upper-left highlight. Transparent, part of the 5-bin set.
```

**bin-trash** (`props/bin-trash.png`)
```
Hearthlight Town pixel art prop, general trash / non-recycle bin. 48x56, chunky pixel art, upper-left warm light, locked Hearthlight palette only. Classic domed lid bin in deep-slate-night and ember-shadow, simple X or crossed lines, subtle candle-gold on the dome curve. Transparent, consistent with the recycle family.
```

**house parts (5)** — tray icons and placeable, simple bold shapes that snap together visually.

**house-foundation** (`props/house-foundation.png`)
```
Hearthlight Town pixel art prop, house foundation stone base. 64x32 or 80x28, chunky pixel art, upper-left warm light, locked Hearthlight palette only. Wide low rectangle of stones in cool-shadow and deep-ember with warm-cream mortar catching light, slight bevel on top edge. Bold, simple, transparent.
```

**house-walls** (`props/house-walls.png`)
```
Hearthlight Town pixel art prop, house walls section. 56x48, chunky pixel art, upper-left warm light, locked Hearthlight palette only. Rectangular wall with window hole or plank lines in warm-cream and lantern, ember-shadow edges and wood grain suggestion, upper left highlight. Transparent.
```

**house-roof** (`props/house-roof.png`)
```
Hearthlight Town pixel art prop, house roof piece. 72x36 triangle-ish, chunky pixel art, upper-left warm light, locked Hearthlight palette only. Rounded or peaked roof in ember-shadow and deep-ember with lantern shingles, warm-highlight along the ridge where light hits. Simple, bold, transparent.
```

**house-door** (`props/house-door.png`)
```
Hearthlight Town pixel art prop, house door. 32x48, chunky pixel art, upper-left warm light, locked Hearthlight palette only. Tall door shape in deep-ember with warm-cream panel lines and tiny knob in candle-gold, light catches left frame. Friendly, simple, transparent.
```

**house-decoration** (`props/house-decoration.png`)
```
Hearthlight Town pixel art prop, house decoration / flower box or flag. 40x32, chunky pixel art, upper-left warm light, locked Hearthlight palette only. Small flower box with teal-relief leaves and ember-fox-orange flowers or a tiny flag in warm-cream and deep-ember, light on the blooms. Joyful final touch. Transparent.
```

**fire** (`props/fire.png`) — friendly cartoon, multiple sizes or health states via scale/alpha later
```
Hearthlight Town pixel art prop, cartoon fire (friendly, never scary). 40x40 or 48x48, chunky pixel art, upper-left warm light, locked Hearthlight palette only. Low playful flame shapes in ember-fox-orange #E86F3A with lantern #F4A24C inner and warm-highlight tips, ember-shadow base. Soft rounded forms, warm light on the flames themselves, transparent background, safe for picnic scene.
```

**hydrant** (`props/hydrant.png`)
```
Hearthlight Town pixel art prop, friendly fire hydrant. 32x48, chunky pixel art, upper-left warm light, locked Hearthlight palette only. Classic short hydrant in deep-ember and lantern with teal-relief cap band, candle-gold highlight on the bolts and top curve. Bold simple, transparent.
```

**water-spray** (`props/water-spray.png`)
```
Hearthlight Town pixel art fx/prop, water spray arc. 64x32, chunky pixel art, upper-left warm light, locked Hearthlight palette only. Gentle curved stream of droplets in teal-relief #43A29C with warm-highlight sparkles on leading edges, soft ember-shadow shadow under the arc. Friendly not harsh, transparent, for Ember's hose.
```

**lantern** (`props/lantern.png`)
```
Hearthlight Town pixel art prop, hanging or standing lantern (lit). 32x40, chunky pixel art, upper-left warm light, locked Hearthlight palette only. Metal frame in cool-shadow and deep-ember, glass body filled with bright candle-gold #FFC857 and warm-highlight glow, soft light spill below. Tiny chain or post. Warm and alive. Transparent.
```

**firefly** (`props/firefly.png`)
```
Hearthlight Town pixel art prop, single firefly for ambient life. 16x16 or 24x24, chunky pixel art, upper-left warm light, locked Hearthlight palette only. Tiny oval body in warm-highlight and candle-gold, faint wings in cool-shadow, soft glow halo. Very small, delicate, multiple can drift. Transparent.
```

**well** (`props/well.png`) — key for Cluckle's Dream secret (microcosm inside)
```
Hearthlight Town pixel art prop, stone well with dark water. 48x48, chunky pixel art, upper-left warm light, locked Hearthlight palette only. Round stone well in cool-shadow and warm-cream, wooden roof or bucket in deep-ember and lantern, dark water surface in deep-slate-night with extremely faint tiny reflection of roofs and a candle-gold dot (the microcosm hint, patient child only). Upper left light on stones. Mysterious and safe. Transparent.
```

---

## UI — ICON-FIRST, GLOWING COIN BUTTONS + KIT

Buttons are round/rounded glowing "icon-coins": candle-gold rim that pulses, world-object icon in center, bold silhouette, 64x64 or 80x80 typical. No words on child layer.

**coin-play** (`ui/coin-play.png`)
```
Hearthlight Town pixel art ui coin, play action. 64x64 round, chunky pixel art, upper-left warm light, locked Hearthlight palette only. Round coin with thick candle-gold #FFC857 rim and warm-highlight inner ring, center icon: a small glowing doorway or open lantern with a ▶ shape inside in deep-ember and warm-cream. Soft inner glow. Transparent background, generous touch size, matches all other coins in rim style and lighting.
```

**coin-recycle** (`ui/coin-recycle.png`)
```
Hearthlight Town pixel art ui coin, recycle action. 64x64 round, chunky pixel art, upper-left warm light, locked Hearthlight palette only. Candle-gold rim, center: a small recycle bin silhouette with arrows in teal-relief and ember-fox-orange, bold simple. Same rim and scale as play coin. Transparent.
```

**coin-build** (`ui/coin-build.png`)
```
Hearthlight Town pixel art ui coin, build / house action. 64x64 round, chunky pixel art, upper-left warm light, locked Hearthlight palette only. Candle-gold rim, center: stacked bricks or tiny house silhouette with roof in ember-fox-orange and lantern, warm-cream walls. Matches coin family exactly. Transparent.
```

**coin-fire** (`ui/coin-fire.png`)
```
Hearthlight Town pixel art ui coin, fire / water action. 64x64 round, chunky pixel art, upper-left warm light, locked Hearthlight palette only. Candle-gold rim, center: gentle flame or water drop + small hydrant in ember-fox-orange and teal-relief. Friendly, not alarming. Same rim, lighting, size as other coins. Transparent.
```

**coin-stickers** (`ui/coin-stickers.png`)
```
Hearthlight Town pixel art ui coin, stickers / reward action. 64x64 round, chunky pixel art, upper-left warm light, locked Hearthlight palette only. Candle-gold rim, center: a big warm star or sticker shape in warm-highlight and candle-gold with tiny Cluckle silhouette inside or a leaf. Joyful. Matches set.
```

**coin-settings** (`ui/coin-settings.png`)
```
Hearthlight Town pixel art ui coin, settings / parent gate. 64x64 round, chunky pixel art, upper-left warm light, locked Hearthlight palette only. Candle-gold rim, center: a small cozy key or lantern-with-gear or rolled scroll icon in deep-ember and lantern. Subtle, world-fitting. Exact same coin treatment.
```

**coin-back** (`ui/coin-back.png`)
```
Hearthlight Town pixel art ui coin, back / map action. 64x64 round, chunky pixel art, upper-left warm light, locked Hearthlight palette only. Candle-gold rim, center: a small winding path or house shape with arrow in cool-shadow and warm-cream, or a little leaf on path. Clear "return" feeling. Consistent coin family.
```

**9-slice panel** (`ui/panel-9slice.png` or corners/edges described)
```
Hearthlight Town pixel art ui, chunky 9-slice panel frame. Generate as assembled sample 160x120 or separate slices (4 corners, 4 edges, center). Chunky pixel art, upper-left warm light, locked Hearthlight palette only. Thick lantern #F4A24C and candle-gold outer frame with deep-ember inner line, soft warm inner glow on the dark wood-like fill in ember-shadow and cool-shadow, rounded chunky corners (rx friendly for 9-slice). Feels like a warm wooden sticker-book frame with light on it. Transparent where possible.
```

**progress-bar** (`ui/progress-bar.png`)
```
Hearthlight Town pixel art ui, progress bar track and fill. 160x24 or similar, chunky pixel art, upper-left warm light, locked Hearthlight palette only. Wide rounded track in deep-slate-night and cool-shadow with candle-gold edge, fill segment in ember-fox-orange to candle-gold gradient from left (light source), small highlight pip. Chunky, warm, easy to read at distance. Transparent bg.
```

**star** (`ui/star.png`)
```
Hearthlight Town pixel art ui, reward star. 48x48 or 56x56, chunky pixel art, upper-left warm light, locked Hearthlight palette only. 5-point chunky star in warm-highlight #FFE6A3 and candle-gold #FFC857 with ember-shadow shading on lower right points, small inner sparkle. Bold, joyful, transparent, used for 1-3 star results and HUD.
```

**sticker-frame** (`ui/sticker-frame.png`)
```
Hearthlight Town pixel art ui, sticker / poem frame. 120x90 or similar rounded, chunky pixel art, upper-left warm light, locked Hearthlight palette only. Soft rounded rectangle frame in lantern and candle-gold with warm-cream inner paper area, ember-shadow outer, tiny corner flourishes in teal or ember. Feels like a page from a beloved picture book. Transparent outer.
```

**checkmark** (`ui/checkmark.png`)
```
Hearthlight Town pixel art ui, mission checklist checkmark. 32x32, chunky pixel art, upper-left warm light, locked Hearthlight palette only. Bold friendly check in candle-gold #FFC857 and warm-highlight with ember-shadow outline, slight bounce-ready form. Simple, clear, warm, transparent.
```

---

## FX

Small, soft, non-flashing. Many will be used with alpha, scale, additive where appropriate (warm-glow especially).

**warm-glow / bloom** (`fx/warm-glow.png`)
```
Hearthlight Town pixel art fx, soft warm glow / bloom sprite for behind windows, lanterns, character faces. 64x64 or 96x96 radial, chunky pixel art, locked Hearthlight palette only. Soft radial falloff from center candle-gold #FFC857 + warm-highlight to transparent edges, very faint ember-fox-orange outer. Low contrast, meant for additive or multiply-light blending later. No hard edges. Matches the light language of the set.
```

**sparkle** (`fx/sparkle.png`)
```
Hearthlight Town pixel art fx, sparkle / twinkle. 24x24 or 32x32, chunky pixel art, locked Hearthlight palette only. Simple 4- or 6-point star or plus with arms in warm-highlight and candle-gold, center bright, very faint cool-shadow tips. One or two pixels of glow. Used for rewards, secrets, drifting. Transparent.
```

**smoke-puff** (`fx/smoke-puff.png`)
```
Hearthlight Town pixel art fx, chimney or happy smoke puff. 32x32, chunky pixel art, upper-left warm light, locked Hearthlight palette only. Soft rounded cloud in cool-shadow and ember-shadow with warm-highlight catching the upper left edge, very gentle. Expands and fades in animation. Transparent.
```

**water-splash** (`fx/water-splash.png`)
```
Hearthlight Town pixel art fx, water splash / droplet burst. 40x32, chunky pixel art, upper-left warm light, locked Hearthlight palette only. Small arc of teal-relief droplets with warm-highlight sparkles on the leading ones, soft ember-shadow under, friendly plink feeling. Transparent.
```

**confetti** (`fx/confetti.png`)
```
Hearthlight Town pixel art fx, celebration confetti. 48x32 sheet or single pieces, chunky pixel art, locked Hearthlight palette only. Assorted small squares, leaves, and dots in candle-gold, ember-fox-orange, teal-relief, warm-cream. A few with tiny inner highlight. Scattered, joyful, transparent bg, used in burst.
```

**godray** (`fx/godray.png`)
```
Hearthlight Town pixel art fx, soft godray / light beam from window or high lantern. Wide tall 80x120, chunky pixel art, locked Hearthlight palette only. Diagonal soft beams in warm-highlight and candle-gold fading to transparent, very low opacity intent, subtle ember-shadow on one side. For window light spill or title atmosphere. Transparent.
```

**scene-wipe** (`fx/scene-wipe.png`)
```
Hearthlight Town pixel art fx, scene transition wipe element. 480x60 band or full, chunky pixel art, locked Hearthlight palette only. Soft sweep of warm light particles, sparkles, and tiny stars in candle-gold and warm-highlight moving across deep navy, or a curtain of soft vertical beams. Feels like light itself opening the next place. Can be animated as particles or sprite sheet.
```

---

## NOTES FOR IMPLEMENTATION & COHERENCE

- After generation: place under `public/assets/hearthlight/<category>/<name>.png` (or subdirs characters/, buildings/, etc.).
- Update `docs/assets/ASSET_BACKLOG.md` with production entries, source="Grok-generated from art-prompts.md against design-system.md", license="original project", date.
- Later: build texture atlases or load individual; keep nearest-neighbor, no mip smoothing.
- When a prompt produces drift (wrong hue, soft edges, cold light from right), re-prompt with the full STYLE CONSISTENCY GUIDE paragraph prepended + "fix to exact upper-left light and locked palette only, match previous Hearthlight outputs".
- Cluckle's microcosm and the "dark window lights" must be visible in spirit even in the smallest assets.
- This world is for Willem. Every pixel should feel like it already knows the child is coming and is glad.

**End of locked prompt bible.** All subsequent art must trace to this document and design-system.md.
