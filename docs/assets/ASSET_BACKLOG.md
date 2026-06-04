# Asset backlog

Purpose: keep game development moving with safe placeholders while tracking production asset needs, source/license status, and replacement priority.

## Asset policy

- Use original assets or approved license sources only.
- Do not use Paw Patrol names, logos, images, music, character likenesses, fan art, or recognizable third-party IP.
- Prefer CC0/public-domain placeholder game assets for MVP engineering.
- Record source URL, license, author/source, date checked, and whether attribution is required.
- Keep placeholder assets visually simple and replaceable. Do not let temporary assets define final character identity.
- Store final decisions in this file and, when needed, in ADRs.

## Recommended route for a non-game-dev human

1. **Start with placeholders**: agents use simple shapes or approved CC0 packs so mechanics can be tested immediately.
2. **Curate by category**: choose complete packs for characters, tiles, UI, FX, and audio instead of mixing many styles.
3. **License-check before import**: every imported production asset needs source/license notes.
4. **Avoid brand resemblance**: if an asset looks like a third-party character, reject it even if the license seems permissive.
5. **Replace in passes**: first mechanics, then consistent placeholder pack, then production art, then audio polish.

## MVP backlog

| Priority | Category | Need | Placeholder route | Production route | Status |
| -------- | -------- | ---- | ----------------- | ---------------- | ------ |
| P0 | Character | Rivet | Simple original colored shape or approved CC0 animal placeholder | Original recycle helper design with distinct silhouette | Needed |
| P0 | Character | Brick | Simple original colored shape or approved CC0 animal placeholder | Original builder helper design with distinct silhouette | Needed |
| P0 | Character | Ember | Simple original colored shape or approved CC0 animal placeholder | Original fire helper design with distinct silhouette | Needed |
| P1 | Character | Generic townspeople | Simple geometric people | Small set of original town residents | Needed |
| P0 | Tiles | Grass, road, sidewalk | Approved CC0 top-down/flat tile pack | Cohesive rounded sticker-book town tiles | Needed |
| P0 | Tiles | House lot, park, picnic area | Approved CC0 tile pack or simple shapes | Cohesive mission-specific environments | Needed |
| P0 | Props | Recycling bins and trash items | Runtime emoji/text buttons in `RecyclingRunScene` | Clear icon-first bin and object set | Placeholder in code; production needed |
| P0 | Props | House parts | Runtime shape/text placeholders in `HouseBuilderScene` | Foundation, wall, roof, door, decoration set | Placeholder in code; production needed |
| P0 | Props | Hydrant and cartoon fires | Runtime circles/labels in `FireFixScene`; hydrant deferred | Friendly low-intensity fire visuals plus hydrant art | Placeholder in code; production needed |
| P0 | UI | Buttons, panels, progress bar | Shape-based UI | Large touch-friendly UI kit | Needed |
| P1 | UI | Profile icons | Simple symbols | Original child-safe avatar icons | Needed |
| P1 | UI | Gamepad button glyphs | Text labels and Input Intent mapping | Simple controller glyph set for A/B/X/D-pad prompts | Needed after gamepad smoke |
| P1 | Rewards | Stars and stickers | Basic star/sticker shapes | Sticker-book reward art | Needed |
| P1 | FX | Sparkle, water spray, smoke puff | Runtime blue aim line in `FireFixScene`; other FX deferred | Soft non-flashing FX sprites | Placeholder in code; production needed |
| P1 | Audio | Button pop, chime, boop, star, fanfare | Muted placeholder or approved royalty-free SFX | Cohesive short non-annoying SFX pack | Needed |
| P2 | Audio | Theme music loop | Audio settings show backlog status; no imported music | Human-generated loop exists in 4 segments; splice later, then record source/license notes before import | Backlog; keep outside repo |
| P2 | Fonts | Child-friendly readable font | System font | Licensed/open font with strong readability | Needed |

## Post-MVP gate asset status

- Current prototype uses runtime placeholder shapes, text, and emoji as the no-fail primary fallback.
- Simple original CC0 SVG placeholder assets are now bundled under `public/assets/` and documented in the ledger below. No font, SFX, or music files are imported yet.
- The generated theme music remains outside the repo in four segments and needs splicing before any implementation work.
- Physical gamepad smoke may create UI glyph needs; track those as production UI assets, not code-only assumptions.

## Asset intake checklist

Use this checklist before importing any asset file:

1. Confirm the asset is original, CC0/public-domain, or otherwise approved for this project.
2. Confirm it does not resemble Paw Patrol or any other third-party brand/character.
3. Record source URL, author/source, license, attribution requirement, and date checked in the license ledger.
4. Add the imported path and replacement notes.
5. Prefer coherent packs: one character style, one tile style, one UI style, one SFX style.
6. Keep audio short, gentle, loopable, and non-annoying for repeated child play.

## License ledger

## Hearthlight generated asset ledger — 2026-06-03

| Asset | Source URL | Source/author | License | Attribution required | Date checked | Imported path | Notes |
| ----- | ---------- | ------------- | ------- | -------------------- | ------------ | ------------- | ----- |
| Hearthlight Rivet character PNG | `public/assets/` | Rescue Town Builders original generated asset set | Project-owned original generated asset | No | 2026-06-03 | `public/assets/hearthlight/characters/rivet.png` | Original, generated, IP-safe. Built with Codex image generation, chroma-key alpha removal, and locked Hearthlight palette cleanup. |
| Hearthlight Brick character PNG | `public/assets/` | Rescue Town Builders original generated asset set | Project-owned original generated asset | No | 2026-06-03 | `public/assets/hearthlight/characters/brick.png` | Original, generated, IP-safe. Built with Codex image generation, chroma-key alpha removal, and locked Hearthlight palette cleanup. |
| Hearthlight Ember character PNG | `public/assets/` | Rescue Town Builders original generated asset set | Project-owned original generated asset | No | 2026-06-03 | `public/assets/hearthlight/characters/ember.png` | Original, generated, IP-safe. Built with Codex image generation, chroma-key alpha removal, and locked Hearthlight palette cleanup. |
| Hearthlight Cluckle character PNG | `public/assets/` | Rescue Town Builders original generated asset set | Project-owned original generated asset | No | 2026-06-03 | `public/assets/hearthlight/characters/cluckle.png` | Original, generated, IP-safe. Built with Codex image generation, chroma-key alpha removal, and locked Hearthlight palette cleanup. |
| Hearthlight town backdrop PNG | `public/assets/` | Rescue Town Builders original generated asset set | Project-owned original generated asset | No | 2026-06-03 | `public/assets/hearthlight/bg/town-backdrop.png` | Original, generated, IP-safe. Built with Codex image generation and locked Hearthlight palette cleanup. |
| Hearthlight far hills parallax PNG | `public/assets/` | Rescue Town Builders original generated asset set | Project-owned original generated asset | No | 2026-06-03 | `public/assets/hearthlight/bg/far-hills.png` | Original, generated, IP-safe. Built with Codex image generation, chroma-key alpha removal, and locked Hearthlight palette cleanup. |
| Hearthlight mid trees parallax PNG | `public/assets/` | Rescue Town Builders original generated asset set | Project-owned original generated asset | No | 2026-06-03 | `public/assets/hearthlight/bg/mid-trees.png` | Original, generated, IP-safe. Built with Codex image generation, chroma-key alpha removal, and locked Hearthlight palette cleanup. |
| Hearthlight play icon-coin PNG | `public/assets/` | Rescue Town Builders original generated asset set | Project-owned original generated asset | No | 2026-06-03 | `public/assets/hearthlight/ui/play.png` | Original, generated, IP-safe. Built with Codex image generation, chroma-key alpha removal, and locked Hearthlight palette cleanup. |
| Hearthlight recycle icon-coin PNG | `public/assets/` | Rescue Town Builders original generated asset set | Project-owned original generated asset | No | 2026-06-03 | `public/assets/hearthlight/ui/recycle.png` | Original, generated, IP-safe. Built with Codex image generation, chroma-key alpha removal, and locked Hearthlight palette cleanup. |
| Hearthlight build icon-coin PNG | `public/assets/` | Rescue Town Builders original generated asset set | Project-owned original generated asset | No | 2026-06-03 | `public/assets/hearthlight/ui/build.png` | Original, generated, IP-safe. Built with Codex image generation, chroma-key alpha removal, and locked Hearthlight palette cleanup. |
| Hearthlight fire icon-coin PNG | `public/assets/` | Rescue Town Builders original generated asset set | Project-owned original generated asset | No | 2026-06-03 | `public/assets/hearthlight/ui/fire.png` | Original, generated, IP-safe. Built with Codex image generation, chroma-key alpha removal, and locked Hearthlight palette cleanup. |
| Hearthlight sticker icon-coin PNG | `public/assets/` | Rescue Town Builders original generated asset set | Project-owned original generated asset | No | 2026-06-03 | `public/assets/hearthlight/ui/stickers.png` | Original, generated, IP-safe. Built with Codex image generation, chroma-key alpha removal, and locked Hearthlight palette cleanup. |
| Hearthlight settings icon-coin PNG | `public/assets/` | Rescue Town Builders original generated asset set | Project-owned original generated asset | No | 2026-06-03 | `public/assets/hearthlight/ui/settings.png` | Original, generated, IP-safe. Built with Codex image generation, chroma-key alpha removal, and locked Hearthlight palette cleanup. |
| Hearthlight back icon-coin PNG | `public/assets/` | Rescue Town Builders original generated asset set | Project-owned original generated asset | No | 2026-06-03 | `public/assets/hearthlight/ui/back.png` | Original, generated, IP-safe. Built with Codex image generation, chroma-key alpha removal, and locked Hearthlight palette cleanup. |
| Hearthlight dark-window house PNG | `public/assets/` | Rescue Town Builders original generated asset set | Project-owned original generated asset | No | 2026-06-03 | `public/assets/hearthlight/props/house-dark.png` | Original, generated, IP-safe. Built with Codex image generation, chroma-key alpha removal, and locked Hearthlight palette cleanup. |
| Hearthlight warm-lit-window house PNG | `public/assets/` | Rescue Town Builders original generated asset set | Project-owned original generated asset | No | 2026-06-03 | `public/assets/hearthlight/props/house-lit.png` | Original, generated, IP-safe. Built with Codex image generation, chroma-key alpha removal, and locked Hearthlight palette cleanup. |
| Hearthlight lantern prop PNG | `public/assets/` | Rescue Town Builders original generated asset set | Project-owned original generated asset | No | 2026-06-03 | `public/assets/hearthlight/props/lantern.png` | Original, generated, IP-safe. Built with Codex image generation, chroma-key alpha removal, and locked Hearthlight palette cleanup. |
| Hearthlight firefly prop PNG | `public/assets/` | Rescue Town Builders original generated asset set | Project-owned original generated asset | No | 2026-06-03 | `public/assets/hearthlight/props/firefly.png` | Original, generated, IP-safe. Built with Codex image generation, chroma-key alpha removal, and locked Hearthlight palette cleanup. |
| Hearthlight star prop PNG | `public/assets/` | Rescue Town Builders original generated asset set | Project-owned original generated asset | No | 2026-06-03 | `public/assets/hearthlight/props/star.png` | Original, generated, IP-safe. Built with Codex image generation, chroma-key alpha removal, and locked Hearthlight palette cleanup. |
| Hearthlight 9-slice panel frame PNG | `public/assets/` | Rescue Town Builders original generated asset set | Project-owned original generated asset | No | 2026-06-03 | `public/assets/hearthlight/props/panel-9slice.png` | Original, generated, IP-safe. Built with Codex image generation, chroma-key alpha removal, and locked Hearthlight palette cleanup. |

## Hearthlight Phase 1 generated asset ledger — 2026-06-04

These mission backdrops are original, IP-safe Codex image-gen outputs. Raw image-gen PNGs remain in `/home/ark/.codex/generated_images/019e90d1-aeda-7990-b099-9be6a1b0f281/`; imported files were resized/cropped to 960×540 and quantized without dithering to the locked 10-color Hearthlight palette from `docs/design/design-system.md`.

| Key | Asset | Source/author | License | Attribution required | Imported path | Image-gen provenance | Notes |
| --- | ----- | ------------- | ------- | -------------------- | ------------- | -------------------- | ----- |
| `hl.bg.recycle` | Hearthlight recycling yard mission backdrop PNG | Rescue Town Builders original generated asset set | Project-owned original generated asset | No | `public/assets/hearthlight/bg/recycle-yard.png` | `ig_0afb98bbf3be3b8a016a20fb23b93481909e3e14765d975293.png` | Layered recycling yard with far town/hills, mid recycle shed, foreground sorting lanes; locked palette, 960×540. |
| `hl.bg.build` | Hearthlight construction lot mission backdrop PNG | Rescue Town Builders original generated asset set | Project-owned original generated asset | No | `public/assets/hearthlight/bg/construction-lot.png` | `ig_0afb98bbf3be3b8a016a20fb8cc2e08190ab0b7959046a220e.png` | Layered construction lot with far town/hills, mid house shell, foreground build pads; locked palette, 960×540. |
| `hl.bg.fire` | Hearthlight picnic/fire mission backdrop PNG | Rescue Town Builders original generated asset set | Project-owned original generated asset | No | `public/assets/hearthlight/bg/picnic-fire.png` | `ig_0afb98bbf3be3b8a016a20fbfb869c8190b47ae717c2fb5b4b.png` | Layered dusk picnic/fire spot with far town/hills, mid pavilion, foreground campfire/hose/picnic play space; locked palette, 960×540. |

### Phase 1 prompts

`hl.bg.recycle`

```text
Hearthlight Town pixel art mission backdrop, recycling yard for Rivet's Recycling Run, 960x540 full-bleed scene, original IP-safe design, no third-party likenesses. Cozy golden-hour dusk, upper-left warm light from candle-gold #FFC857 and warm-highlight #FFE6A3, deep-slate-night #1B2A41 shadows and floor, cool-shadow #3A4D6B far distance, ember-shadow #572D42 under warm light, deep-ember #A73428 accents, ember-fox-orange #E86F3A small warm details, teal-relief #43A29C sparingly on recycle bins and signs, warm-cream #EBDDDA highlights. Chunky handcrafted pixel art, crisp visible pixels, no anti-aliasing, no smooth gradients, flat fills with minimal dither, bold silhouettes readable at gameplay scale. Composition: far parallax rolling hills and sleepy town roof silhouettes under dusk sky; mid-ground cozy recycle center shed with 2 dark windows and one warm lamplit doorway, sloped roof, stacked rounded crates, safe paper bundles, bottle shapes, and a tiny lantern; foreground open play space with three clear sorting lanes, paper/glass/compost bin silhouettes, cobble and grass edges, warm lamplight spill from upper-left across the ground. Mostly dim blue/navy with inviting pools of gold; no text, no logos, no real recycling brand marks. Designed as a layered place, not a flat color tray. Must match existing Hearthlight Town assets: town-backdrop, Rivet, play coin. Locked palette only, warm light angle consistent, child-safe, rich and cozy for a 6-year-old.
```

`hl.bg.build`

```text
Hearthlight Town pixel art mission backdrop, Brick's construction lot, 960x540 full-bleed scene, original IP-safe design, no third-party likenesses. Cozy golden-hour dusk at sleepy town hour, consistent warm directional light from upper-left, locked Hearthlight palette only: deep-slate-night #1B2A41, cool-shadow #3A4D6B, ember-shadow #572D42, deep-ember #A73428, ember-fox-orange #E86F3A, lantern #F4A24C, candle-gold #FFC857, warm-highlight #FFE6A3, teal-relief #43A29C sparingly, warm-cream #EBDDDA. Chunky handcrafted pixel art, crisp visible pixels, flat fills, minimal dither, no anti-aliasing, no smooth gradients, bold silhouettes readable at gameplay scale. Composition: far parallax dim rolling hills and tiny town roofs with a few dark and lit windows; mid-ground partial cozy house shell and construction scaffolding, stacked planks, brick piles, a small crane silhouette or pulley, lantern on a post, one half-built wall with a dark window waiting to be lit; foreground open play space with broad foundation pads and snapping zones for wall, roof, door, and window, cobble/path edges, safe tidy tools. Mostly deep navy/cool-shadow with warm pools of lantern and candle-gold, upper-left light catching plank tops, roof edges, and brick stacks. No text, no real logos, no hazard signs, no scary machinery. Layered place, not flat tray; matches existing Hearthlight town-backdrop, Brick character, build coin in palette, lighting, chunky pixel texture, warmth, and kid-safe wonder.
```

`hl.bg.fire`

```text
Hearthlight Town pixel art mission backdrop, Ember's dusk picnic and fire-fix spot, 960x540 full-bleed scene, original IP-safe design, no third-party likenesses. Cozy golden-hour dusk turning to lamp-lit evening, consistent warm upper-left light, locked Hearthlight palette only: deep-slate-night #1B2A41, cool-shadow #3A4D6B, ember-shadow #572D42, deep-ember #A73428, ember-fox-orange #E86F3A, lantern #F4A24C, candle-gold #FFC857, warm-highlight #FFE6A3, teal-relief #43A29C sparingly for water relief, warm-cream #EBDDDA. Chunky handcrafted pixel art, crisp visible pixels, no anti-aliasing, no smooth gradients, flat fills, minimal dither, bold silhouettes readable at gameplay scale. Composition: far parallax low hills and sleepy rooftops with a few windows waiting to glow; mid-ground safe picnic park pavilion or little shelter with posts, hanging lanterns, dark trees, a calm well or tiny creek catching teal highlights; foreground open play space with picnic blanket area, gentle campfire/ember ring, hydrant/hose zone, water-splash lane, round stones and grass. Warm lamplight and firelight pool on the blanket, stones, and path; fires are friendly low ember shapes, never scary. Mostly dim navy/cool-shadow with candle-gold pools; upper-left light catches pavilion roof, blanket edge, hose nozzle, and stones. No text, no signs, no real logos. Layered place, not flat tray; matches existing Hearthlight town-backdrop, Ember character, fire coin in palette, lighting, chunky pixel texture, warmth, and kid-safe magic.
```

Phase 1 handoff — changed files: `public/assets/hearthlight/bg/recycle-yard.png`, `public/assets/hearthlight/bg/construction-lot.png`, `public/assets/hearthlight/bg/picnic-fire.png`, `src/game/data/hearthlightAssets.ts`, `docs/assets/ASSET_BACKLOG.md` · verified: `npm run build` passed; manifest keys `hl.bg.recycle`/`hl.bg.build`/`hl.bg.fire` are wired; PNGs are 960×540 and locked-palette (10/8/10 colors) · risks: generated compositions are palette-cleaned from richer raw image-gen outputs, so some fine detail is intentionally posterized; recycle scene includes a generic recycle-like symbol on the shed.

## Hearthlight Phase 2 generated asset ledger — 2026-06-04

These mission props are original, IP-safe Codex image-gen outputs. Raw sprite sheets remain in `/home/ark/.codex/generated_images/019e90d1-aeda-7990-b099-9be6a1b0f281/`; imported files were cropped from sheets, flood-cleared from baked checkerboard background, centered on transparent 128×128 canvases, and quantized to the locked Hearthlight palette.

| Key | Prompt | Imported path | Image-gen provenance | Notes |
| --- | ------ | ------------- | -------------------- | ----- |
| `hl.prop.binPaper` | Phase 2 recycle sheet | `public/assets/hearthlight/props/bin-paper.png` | `ig_0afb98bbf3be3b8a016a20fde2fd2c8190b7e8bfcf82742607.png` | Paper sorting bin. |
| `hl.prop.binGlass` | Phase 2 recycle sheet | `public/assets/hearthlight/props/bin-glass.png` | `ig_0afb98bbf3be3b8a016a20fde2fd2c8190b7e8bfcf82742607.png` | Glass sorting bin. |
| `hl.prop.binCompost` | Phase 2 recycle sheet | `public/assets/hearthlight/props/bin-compost.png` | `ig_0afb98bbf3be3b8a016a20fde2fd2c8190b7e8bfcf82742607.png` | Compost sorting bin. |
| `hl.prop.binTrash` | Phase 2 recycle sheet | `public/assets/hearthlight/props/bin-trash.png` | `ig_0afb98bbf3be3b8a016a20fde2fd2c8190b7e8bfcf82742607.png` | General trash bin. |
| `hl.prop.itemBananaPeel` | Phase 2 recycle sheet | `public/assets/hearthlight/props/item-banana-peel.png` | `ig_0afb98bbf3be3b8a016a20fde2fd2c8190b7e8bfcf82742607.png` | Compost item. |
| `hl.prop.itemAppleCore` | Phase 2 recycle sheet | `public/assets/hearthlight/props/item-apple-core.png` | `ig_0afb98bbf3be3b8a016a20fde2fd2c8190b7e8bfcf82742607.png` | Compost item. |
| `hl.prop.itemNewspaper` | Phase 2 recycle sheet | `public/assets/hearthlight/props/item-newspaper.png` | `ig_0afb98bbf3be3b8a016a20fde2fd2c8190b7e8bfcf82742607.png` | Paper item. |
| `hl.prop.itemCardboardBox` | Phase 2 recycle sheet | `public/assets/hearthlight/props/item-cardboard-box.png` | `ig_0afb98bbf3be3b8a016a20fde2fd2c8190b7e8bfcf82742607.png` | Paper item. |
| `hl.prop.itemGlassBottle` | Phase 2 recycle sheet | `public/assets/hearthlight/props/item-glass-bottle.png` | `ig_0afb98bbf3be3b8a016a20fde2fd2c8190b7e8bfcf82742607.png` | Glass item. |
| `hl.prop.itemYogurtCup` | Phase 2 recycle sheet | `public/assets/hearthlight/props/item-yogurt-cup.png` | `ig_0afb98bbf3be3b8a016a20fde2fd2c8190b7e8bfcf82742607.png` | Container item. |
| `hl.prop.itemSoupCan` | Phase 2 recycle sheet | `public/assets/hearthlight/props/item-soup-can.png` | `ig_0afb98bbf3be3b8a016a20fde2fd2c8190b7e8bfcf82742607.png` | Metal item. |
| `hl.prop.itemFoilBall` | Phase 2 recycle sheet | `public/assets/hearthlight/props/item-foil-ball.png` | `ig_0afb98bbf3be3b8a016a20fde2fd2c8190b7e8bfcf82742607.png` | Metal item. |
| `hl.prop.itemBrokenCrayon` | Phase 2 recycle sheet | `public/assets/hearthlight/props/item-broken-crayon.png` | `ig_0afb98bbf3be3b8a016a20fde2fd2c8190b7e8bfcf82742607.png` | Trash item. |
| `hl.prop.itemStickyWrapper` | Phase 2 recycle sheet | `public/assets/hearthlight/props/item-sticky-wrapper.png` | `ig_0afb98bbf3be3b8a016a20fde2fd2c8190b7e8bfcf82742607.png` | Trash item. |
| `hl.prop.itemPaperBag` | Phase 2 recycle sheet | `public/assets/hearthlight/props/item-paper-bag.png` | `ig_0afb98bbf3be3b8a016a20fde2fd2c8190b7e8bfcf82742607.png` | Paper item. |
| `hl.prop.itemPlasticLid` | Phase 2 recycle sheet | `public/assets/hearthlight/props/item-plastic-lid.png` | `ig_0afb98bbf3be3b8a016a20fde2fd2c8190b7e8bfcf82742607.png` | Plastic item. |
| `hl.prop.blueprintFrame` | Phase 2 house sheet | `public/assets/hearthlight/props/blueprint-frame.png` | `ig_0afb98bbf3be3b8a016a20fe63ad948190ada0b23a697dbd7d.png` | Build-plan frame. |
| `hl.prop.houseFoundation` | Phase 2 house sheet | `public/assets/hearthlight/props/house-foundation.png` | `ig_0afb98bbf3be3b8a016a20fe63ad948190ada0b23a697dbd7d.png` | Stackable foundation. |
| `hl.prop.houseWall` | Phase 2 house sheet | `public/assets/hearthlight/props/house-wall.png` | `ig_0afb98bbf3be3b8a016a20fe63ad948190ada0b23a697dbd7d.png` | Stackable wall with window cutout. |
| `hl.prop.houseRoof` | Phase 2 house sheet | `public/assets/hearthlight/props/house-roof.png` | `ig_0afb98bbf3be3b8a016a20fe63ad948190ada0b23a697dbd7d.png` | Stackable roof. |
| `hl.prop.houseDoor` | Phase 2 house sheet | `public/assets/hearthlight/props/house-door.png` | `ig_0afb98bbf3be3b8a016a20fe63ad948190ada0b23a697dbd7d.png` | Stackable door. |
| `hl.prop.houseWindow` | Phase 2 house sheet | `public/assets/hearthlight/props/house-window.png` | `ig_0afb98bbf3be3b8a016a20fe63ad948190ada0b23a697dbd7d.png` | Stackable lit window. |
| `hl.prop.houseDecoration` | Phase 2 house sheet | `public/assets/hearthlight/props/house-decoration.png` | `ig_0afb98bbf3be3b8a016a20fe63ad948190ada0b23a697dbd7d.png` | Flower-box decoration. |
| `hl.prop.housePreview` | Phase 2 house sheet | `public/assets/hearthlight/props/house-preview.png` | `ig_0afb98bbf3be3b8a016a20fe63ad948190ada0b23a697dbd7d.png` | Tiny assembled cottage preview. |
| `hl.prop.campfire` | Phase 2 fire sheet | `public/assets/hearthlight/props/campfire.png` | `ig_0afb98bbf3be3b8a016a20fe94c51c819088920e03be1f5918.png` | Friendly campfire. |
| `hl.prop.embers` | Phase 2 fire sheet | `public/assets/hearthlight/props/embers.png` | `ig_0afb98bbf3be3b8a016a20fe94c51c819088920e03be1f5918.png` | Low ember pile. |
| `hl.prop.hose` | Phase 2 fire sheet | `public/assets/hearthlight/props/hose.png` | `ig_0afb98bbf3be3b8a016a20fe94c51c819088920e03be1f5918.png` | Coiled hose with nozzle. |
| `hl.prop.waterSplash` | Phase 2 fire sheet | `public/assets/hearthlight/props/water-splash.png` | `ig_0afb98bbf3be3b8a016a20fe94c51c819088920e03be1f5918.png` | Water splash arc. |
| `hl.prop.picnicBlanket` | Phase 2 fire sheet | `public/assets/hearthlight/props/picnic-blanket.png` | `ig_0afb98bbf3be3b8a016a20fe94c51c819088920e03be1f5918.png` | Picnic blanket. |
| `hl.prop.picnicBasket` | Phase 2 fire sheet | `public/assets/hearthlight/props/picnic-basket.png` | `ig_0afb98bbf3be3b8a016a20fe94c51c819088920e03be1f5918.png` | Picnic basket bonus prop. |
| `hl.prop.hydrant` | Phase 2 fire sheet | `public/assets/hearthlight/props/hydrant.png` | `ig_0afb98bbf3be3b8a016a20fe94c51c819088920e03be1f5918.png` | Hydrant bonus prop. |
| `hl.prop.smokeWisp` | Phase 2 fire sheet | `public/assets/hearthlight/props/smoke-wisp.png` | `ig_0afb98bbf3be3b8a016a20fe94c51c819088920e03be1f5918.png` | Smoke wisp bonus prop. |

### Phase 2 prompts

`Phase 2 recycle sheet`

```text
Hearthlight Town pixel art transparent sprite sheet, recycling mission props, original IP-safe design, no third-party likenesses. 4 columns by 4 rows on transparent background, generous empty padding in every cell, no labels, no text, no logos. Chunky handcrafted pixel art, crisp visible pixels, flat fills, minimal dither, upper-left warm light, locked Hearthlight palette only: deep-slate-night #1B2A41 outlines/shadows, cool-shadow #3A4D6B unlit sides, ember-shadow #572D42 under forms, deep-ember #A73428 warm dark accents, ember-fox-orange #E86F3A warm scraps, lantern #F4A24C, candle-gold #FFC857, warm-highlight #FFE6A3, teal-relief #43A29C sparingly, warm-cream #EBDDDA. Match existing Hearthlight Rivet and recycle coin: bold friendly silhouettes readable at 48-80px. Cell order left-to-right top-to-bottom: paper bin with open slot and paper icon; glass bin with rounded teal lid and bottle icon; compost bin with leaf/apple-core icon; trash bin dark domed with simple X mark; banana peel; apple core; folded newspaper stack; cardboard box; glass bottle; yogurt cup; soup can; foil ball; broken crayon; sticky candy wrapper; paper bag; plastic lid. All props are centered, isolated, transparent, no ground plane, no cast shadow outside object, child-safe cozy warm rim light from upper-left.
```

`Phase 2 house sheet`

```text
Hearthlight Town pixel art transparent sprite sheet, house-building mission props, original IP-safe design, no third-party likenesses. 4 columns by 2 rows on transparent background, generous empty padding in every cell, no labels, no text, no logos. Chunky handcrafted pixel art, crisp visible pixels, flat fills, minimal dither, upper-left warm light, locked Hearthlight palette only: deep-slate-night #1B2A41 outlines/shadows, cool-shadow #3A4D6B unlit sides, ember-shadow #572D42 under forms, deep-ember #A73428 warm dark accents, ember-fox-orange #E86F3A accents, lantern #F4A24C, candle-gold #FFC857, warm-highlight #FFE6A3, teal-relief #43A29C sparingly, warm-cream #EBDDDA. Match existing Hearthlight Brick and build coin: bold simple silhouettes readable at 48-80px, cozy golden-hour upper-left rim light. Cell order left-to-right top-to-bottom: blueprint frame with dark navy center and candle-gold 9-slice rim, blank plan lines only; stone foundation base; stackable wall section with window cutout; chunky peaked roof piece; warm door piece; square lit window piece; small flower-box decoration; assembled tiny cottage preview using the same parts. Each asset centered and isolated for cropping, transparent background, no ground plane, no cast shadow outside object, child-safe and friendly.
```

`Phase 2 fire sheet`

```text
Hearthlight Town pixel art transparent sprite sheet, fire-fix and picnic mission props, original IP-safe design, no third-party likenesses. 4 columns by 2 rows on transparent background, generous empty padding in every cell, no labels, no text, no logos. Chunky handcrafted pixel art, crisp visible pixels, flat fills, minimal dither, upper-left warm light, locked Hearthlight palette only: deep-slate-night #1B2A41 outlines/shadows, cool-shadow #3A4D6B unlit sides, ember-shadow #572D42 under forms, deep-ember #A73428 warm dark accents, ember-fox-orange #E86F3A fire accents, lantern #F4A24C, candle-gold #FFC857, warm-highlight #FFE6A3, teal-relief #43A29C sparingly for water and hose, warm-cream #EBDDDA. Match existing Hearthlight Ember and fire coin: bold friendly silhouettes readable at 48-80px, cozy safe upper-left warm rim light. Cell order left-to-right top-to-bottom: friendly low campfire in stone ring, never scary; small ember pile nearly out; coiled teal hose with brass nozzle; water splash arc with droplets; picnic blanket folded square with warm check pattern; picnic basket; small hydrant; gentle smoke wisp. Each asset centered and isolated for cropping, transparent background, no ground plane, no cast shadow outside object, child-safe and warm.
```

Phase 2 handoff — changed files: `public/assets/hearthlight/props/bin-*.png`, `public/assets/hearthlight/props/item-*.png`, `public/assets/hearthlight/props/blueprint-frame.png`, `public/assets/hearthlight/props/house-*.png`, `public/assets/hearthlight/props/campfire.png`, `public/assets/hearthlight/props/embers.png`, `public/assets/hearthlight/props/hose.png`, `public/assets/hearthlight/props/water-splash.png`, `public/assets/hearthlight/props/picnic-*.png`, `public/assets/hearthlight/props/hydrant.png`, `public/assets/hearthlight/props/smoke-wisp.png`, `src/game/data/hearthlightAssets.ts`, `docs/assets/ASSET_BACKLOG.md` · verified: `npm run build` passed; 32 manifest keys are wired; all 32 PNGs are transparent 128×128 canvases with locked-palette visible pixels · risks: sprite sheets had baked checkerboard backgrounds, removed via flood-clear; generated glass bin/item are future-facing because current Recycling Run data still uses plastic/metal categories.

| Asset | Source URL | Source/author | License | Attribution required | Date checked | Imported path | Notes |
| ----- | ---------- | ------------- | ------- | -------------------- | ------------ | ------------- | ----- |
| Kenney UI Pack selected button/star PNGs | `https://kenney.nl/assets/ui-pack` | Kenney | CC0-1.0 | No | 2026-06-03 | `public/assets/kenney/ui/*.png` | Official Kenney page lists Creative Commons CC0. Used as visual layer under existing hit targets. |
| Kenney Tiny Town selected tile/prop PNGs | `https://kenney.nl/assets/tiny-town` | Kenney | CC0-1.0 | No | 2026-06-03 | `public/assets/kenney/tiny-town/*.png` | Official Kenney page lists Creative Commons CC0. Used for a lightweight town map background and node polish. |
| Kenney Shape Characters selected body/face/hand/shadow PNGs | `https://kenney.nl/assets/shape-characters` | Kenney | CC0-1.0 | No | 2026-06-03 | `public/assets/kenney/shape/*.png` | Official Kenney page lists Creative Commons CC0. Layered into original Rivet, Brick, and Ember helper avatars. |
| `props.recycling-compost`, `props.recycling-plastic`, `props.recycling-metal` | `public/assets/` | Rescue Town Builders original placeholder asset set | CC0-1.0 | No | 2026-06-03 | `public/assets/props/recycling-compost.svg`, `public/assets/props/recycling-plastic.svg`, `public/assets/props/recycling-metal.svg` | Original category item art; no third-party character likenesses or marks. |

## Audio intake note

The theme music currently exists outside the repo as four generated segments. Do not import these into the prototype yet. Slice 0 stays silent/minimal; audio work begins after volume/mute settings and source/license notes are ready.

## Recycling Run placeholder note

Slice 2 uses runtime text/emoji placeholders for bins and items as the fallback. Simple original CC0 SVG bin/item badges are bundled for manifest coverage. Production bin/item art is still needed before polish.

## House Builder placeholder note

Slice 3 uses runtime shape/text placeholders for foundations, walls, roofs, doors, and decorations as the fallback. Simple original CC0 SVG house-part badges are bundled for manifest coverage. Production house-part art is still needed before polish.

## Fire Fix placeholder note

Slice 4 uses runtime circles, labels, and a blue aim line for fires/water feedback as the fallback. Simple original CC0 SVG fire, water, and hydrant badges are bundled for manifest coverage. Production hydrant, fire, water spray, and smoke puff art remains needed before polish.

## Bundled MVP CC0 placeholder assets — 2026-06-03

These simple geometric SVG assets are original to Rescue Town Builders and dedicated as CC0-1.0 for this project. They live in `public/assets/` and are loaded through `src/game/systems/AssetCatalog.ts`. Runtime Phaser shapes/text remain the no-fail fallback if any asset is missing.

| Asset | Source URL | Source/author | License | Attribution required | Date checked | Imported path | Notes |
| ----- | ---------- | ------------- | ------- | -------------------- | ------------ | ------------- | ----- |
| `character.rivet`, `character.brick`, `character.ember` | `public/assets/` | Rescue Town Builders original placeholder asset set | CC0-1.0 | No | 2026-06-03 | `public/assets/characters/*.svg` | Original helper badges only; no third-party character likenesses. |
| `town.map-node` | `public/assets/` | Rescue Town Builders original placeholder asset set | CC0-1.0 | No | 2026-06-03 | `public/assets/props/town-map-node.svg` | Generic town map node marker. |
| `props.recycling-bin`, `props.recycling-paper`, `props.recycling-trash` | `public/assets/` | Rescue Town Builders original placeholder asset set | CC0-1.0 | No | 2026-06-03 | `public/assets/props/recycling-*.svg` | Generic recycling/trash icons for manifest coverage. |
| `props.house-foundation`, `props.house-walls`, `props.house-roof`, `props.house-door`, `props.house-decoration` | `public/assets/` | Rescue Town Builders original placeholder asset set | CC0-1.0 | No | 2026-06-03 | `public/assets/props/house-*.svg` | Simple House Builder part badges. |
| `props.fire`, `props.water-spray`, `props.hydrant` | `public/assets/` | Rescue Town Builders original placeholder asset set | CC0-1.0 | No | 2026-06-03 | `public/assets/props/fire.svg`, `public/assets/props/water-spray.svg`, `public/assets/props/hydrant.svg` | Friendly fire/water/hydrant icons. |
| `ui.sticker-star`, `ui.button-panel`, `fx.confetti` | `public/assets/` | Rescue Town Builders original placeholder asset set | CC0-1.0 | No | 2026-06-03 | `public/assets/ui/*.svg`, `public/assets/fx/confetti.svg` | Stickers, panels, and celebration polish. |
