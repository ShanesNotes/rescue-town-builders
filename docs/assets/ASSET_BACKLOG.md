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
| P1 | UI | Profile icons | Simple symbols | Original child-safe avatar icons | Generated: Hearthlight face-coins |
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

## Hearthlight Phase 3 generated asset ledger — 2026-06-04

These UI assets are original, IP-safe Codex image-gen outputs. The raw UI sheet remains in `/home/ark/.codex/generated_images/019e90d1-aeda-7990-b099-9be6a1b0f281/`; imported files were cropped from the sheet, flood-cleared from baked checkerboard background, centered on transparent canvases, and quantized to the locked Hearthlight palette.

| Key | Prompt | Imported path | Image-gen provenance | Notes |
| --- | ------ | ------------- | -------------------- | ----- |
| `hl.ui.panel` | Phase 3 UI sheet | `public/assets/hearthlight/ui/panel-9slice.png` | `ig_0afb98bbf3be3b8a016a21024928b481908215fa784429af3a.png` | Chunky 9-slice-style framed panel, 256×192. |
| `hl.ui.help` | Phase 3 UI sheet | `public/assets/hearthlight/ui/help.png` | `ig_0afb98bbf3be3b8a016a21024928b481908215fa784429af3a.png` | Help icon-coin. |
| `hl.ui.pause` | Phase 3 UI sheet | `public/assets/hearthlight/ui/pause.png` | `ig_0afb98bbf3be3b8a016a21024928b481908215fa784429af3a.png` | Pause icon-coin. |
| `hl.ui.next` | Phase 3 UI sheet | `public/assets/hearthlight/ui/next.png` | `ig_0afb98bbf3be3b8a016a21024928b481908215fa784429af3a.png` | Next/play-forward icon-coin. |
| `hl.ui.retry` | Phase 3 UI sheet | `public/assets/hearthlight/ui/retry.png` | `ig_0afb98bbf3be3b8a016a21024928b481908215fa784429af3a.png` | Retry icon-coin. |
| `hl.ui.mute` | Phase 3 UI sheet | `public/assets/hearthlight/ui/mute.png` | `ig_0afb98bbf3be3b8a016a21024928b481908215fa784429af3a.png` | Mute icon-coin. |
| `hl.ui.starEmpty` | Phase 3 UI sheet | `public/assets/hearthlight/ui/star-empty.png` | `ig_0afb98bbf3be3b8a016a21024928b481908215fa784429af3a.png` | Empty star icon-coin. |
| `hl.ui.starFull` | Phase 3 UI sheet | `public/assets/hearthlight/ui/star-full.png` | `ig_0afb98bbf3be3b8a016a21024928b481908215fa784429af3a.png` | Full star icon-coin. |
| `hl.ui.heart` | Phase 3 UI sheet | `public/assets/hearthlight/ui/heart.png` | `ig_0afb98bbf3be3b8a016a21024928b481908215fa784429af3a.png` | Heart icon-coin. |
| `hl.ui.progressPip` | Phase 3 UI sheet | `public/assets/hearthlight/ui/progress-pip.png` | `ig_0afb98bbf3be3b8a016a21024928b481908215fa784429af3a.png` | Small glowing progress pip, 64×64. |
| `hl.ui.stickerFrame` | Phase 3 UI sheet | `public/assets/hearthlight/ui/sticker-frame.png` | `ig_0afb98bbf3be3b8a016a21024928b481908215fa784429af3a.png` | Sticker frame, 160×128. |
| `hl.ui.checkmark` | Phase 3 UI sheet | `public/assets/hearthlight/ui/checkmark.png` | `ig_0afb98bbf3be3b8a016a21024928b481908215fa784429af3a.png` | Checklist checkmark icon-coin. |

### Phase 3 prompt

`Phase 3 UI sheet`

```text
Hearthlight Town pixel art transparent sprite sheet, UI kit, original IP-safe design, no third-party likenesses. 4 columns by 3 rows on transparent background, generous empty padding in every cell, no text, no labels, no logos. Match existing Hearthlight UI coins exactly: round glowing icon-coins with thick candle-gold #FFC857 rim, warm-highlight #FFE6A3 upper-left sparkle, deep-slate-night #1B2A41 center, deep-ember #A73428 lower-right shadow, crisp chunky pixels, flat fills, minimal dither, upper-left warm light. Locked Hearthlight palette only: #1B2A41 #3A4D6B #572D42 #A73428 #E86F3A #F4A24C #FFC857 #FFE6A3 #43A29C #EBDDDA. Cell order left-to-right top-to-bottom: chunky 9-slice panel frame, square-ish with lantern/candle-gold frame and dark navy center; help icon-coin with warm cream question mark; pause icon-coin with two vertical bars; next icon-coin with right arrow/triangle; retry icon-coin with circular arrow; mute icon-coin with speaker and slash; star-empty icon-coin with hollow star; star-full icon-coin with filled warm-highlight star; heart icon-coin with warm ember heart; progress pip small glowing bead/capsule; sticker frame rounded paper frame with candle-gold rim and warm-cream center; checklist checkmark icon, bold candle-gold check with ember-shadow outline. All assets centered, isolated for cropping, transparent background, no ground plane, no drop shadow outside object, child-safe, cozy, readable at 48-80px, same line weight as existing play/settings/recycle coins.
```

Phase 3 handoff — changed files: `public/assets/hearthlight/ui/panel-9slice.png`, `public/assets/hearthlight/ui/help.png`, `public/assets/hearthlight/ui/pause.png`, `public/assets/hearthlight/ui/next.png`, `public/assets/hearthlight/ui/retry.png`, `public/assets/hearthlight/ui/mute.png`, `public/assets/hearthlight/ui/star-empty.png`, `public/assets/hearthlight/ui/star-full.png`, `public/assets/hearthlight/ui/heart.png`, `public/assets/hearthlight/ui/progress-pip.png`, `public/assets/hearthlight/ui/sticker-frame.png`, `public/assets/hearthlight/ui/checkmark.png`, `src/game/data/hearthlightAssets.ts`, `docs/assets/ASSET_BACKLOG.md` · verified: `npm run build` passed; 12 manifest keys are wired; all UI PNGs have transparent canvases and locked-palette visible pixels; contact sheet visually matches existing coin family · risks: `hl.ui.next` is a forward/play triangle rather than an arrow; `hl.ui.checkmark` is an extra UI-kit asset beyond the requested list.

## Hearthlight Phase 4 generated asset ledger — 2026-06-04

These FX assets are original, IP-safe Codex image-gen outputs. The raw FX sheet remains in `/home/ark/.codex/generated_images/019e90d1-aeda-7990-b099-9be6a1b0f281/`; imported files were cropped from the sheet, flood-cleared from baked checkerboard background, rebuilt as 64×64 frames, and quantized to the locked Hearthlight palette.

| Key | Prompt | Imported path | Image-gen provenance | Notes |
| --- | ------ | ------------- | -------------------- | ----- |
| `hl.fx.particleSheet` | Phase 4 FX sheet | `public/assets/hearthlight/fx/particle-fx-sheet.png` | `ig_0afb98bbf3be3b8a016a210584711c81909891de11f4ba1045.png` | Combined 4×6 particle sheet, 64×64 frames. |
| `hl.fx.sparkle` | Phase 4 FX sheet | `public/assets/hearthlight/fx/sparkle.png` | `ig_0afb98bbf3be3b8a016a210584711c81909891de11f4ba1045.png` | Four-frame sparkle row sheet. |
| `hl.fx.dustPuff` | Phase 4 FX sheet | `public/assets/hearthlight/fx/dust-puff.png` | `ig_0afb98bbf3be3b8a016a210584711c81909891de11f4ba1045.png` | Four-frame dust puff row sheet. |
| `hl.fx.waterDroplet` | Phase 4 FX sheet | `public/assets/hearthlight/fx/water-droplet.png` | `ig_0afb98bbf3be3b8a016a210584711c81909891de11f4ba1045.png` | Four-frame water droplet/splash row sheet. |
| `hl.fx.smokeWisp` | Phase 4 FX sheet | `public/assets/hearthlight/fx/smoke-wisp.png` | `ig_0afb98bbf3be3b8a016a210584711c81909891de11f4ba1045.png` | Four-frame smoke wisp row sheet. |
| `hl.fx.confetti` | Phase 4 FX sheet | `public/assets/hearthlight/fx/confetti.png` | `ig_0afb98bbf3be3b8a016a210584711c81909891de11f4ba1045.png` | Four-frame confetti row sheet. |
| `hl.fx.lightBurst` | Phase 4 FX sheet | `public/assets/hearthlight/fx/light-burst.png` | `ig_0afb98bbf3be3b8a016a210584711c81909891de11f4ba1045.png` | Four-frame light-burst row sheet. |

### Phase 4 prompt

`Phase 4 FX sheet`

```text
Hearthlight Town pixel art transparent FX sprite sheet for particle emitters, original IP-safe design, no third-party likenesses. 4 columns by 6 rows on transparent background, generous empty padding in every 64x64-ish frame, no text, no labels, no logos. Locked Hearthlight palette only: deep-slate-night #1B2A41, cool-shadow #3A4D6B, ember-shadow #572D42, deep-ember #A73428, ember-fox-orange #E86F3A, lantern #F4A24C, candle-gold #FFC857, warm-highlight #FFE6A3, teal-relief #43A29C, warm-cream #EBDDDA. Chunky handcrafted pixel art, crisp visible pixels, flat fills, minimal dither, no anti-aliasing, no smooth gradients, child-safe, non-flashing, readable small, upper-left warm light. Row order top-to-bottom, each row has 4 animation frames left-to-right: sparkle twinkle growing and shrinking, 4- or 6-point warm-highlight star with candle-gold center; dust puff expanding/fading, rounded ember-shadow/cool-shadow soft cloud with warm-highlight upper-left edge; water droplet/burst, teal-relief droplets with warm-highlight sparkle, frame progression from bead to splash; smoke wisp, gentle pale warm-cream/cool-shadow curl drifting upward, not scary; confetti burst, tiny squares/leaves/dots in candle-gold, ember-orange, teal, warm-cream spreading outward; light-burst, warm radial candle-gold/warm-highlight burst with ember-shadow outer pixels suitable for reward pop. Each frame isolated for cropping and sprite-sheet slicing, transparent background, no ground plane or cast shadow, same chunkiness and light language as Hearthlight UI and props.
```

Phase 4 handoff — changed files: `public/assets/hearthlight/fx/particle-fx-sheet.png`, `public/assets/hearthlight/fx/sparkle.png`, `public/assets/hearthlight/fx/dust-puff.png`, `public/assets/hearthlight/fx/water-droplet.png`, `public/assets/hearthlight/fx/smoke-wisp.png`, `public/assets/hearthlight/fx/confetti.png`, `public/assets/hearthlight/fx/light-burst.png`, `src/game/data/hearthlightAssets.ts`, `docs/assets/ASSET_BACKLOG.md` · verified: `npm run build` passed; 7 manifest keys are wired; row sheets are 256×64 and combined sheet is 256×384 with transparent 64×64 frame grid and locked-palette visible pixels; visual row order is sparkle/dust/water/smoke/confetti/light-burst · risks: assets are loaded as images for now; Phase 6 should add frame metadata/spritesheet loading for animation playback.

## Hearthlight Phase 5 generated asset ledger — 2026-06-04

These town-map assets are original, IP-safe Codex image-gen outputs. Raw map layer and house-pair sheets remain in `/home/ark/.codex/generated_images/019e90d1-aeda-7990-b099-9be6a1b0f281/`; imported files were cropped, flood-cleared from baked checkerboard background where needed, cleaned for edge seams, and quantized to the locked Hearthlight palette.

| Key | Prompt | Imported path | Image-gen provenance | Notes |
| --- | ------ | ------------- | -------------------- | ----- |
| `hl.map.sky` | Phase 5 map layer sheet | `public/assets/hearthlight/map/sky.png` | `ig_0afb98bbf3be3b8a016a210855d5508190a748764350bb0b5f.png` | Opaque 960×540 dusk sky layer. |
| `hl.map.farHills` | Phase 5 map layer sheet | `public/assets/hearthlight/map/far-hills.png` | `ig_0afb98bbf3be3b8a016a210855d5508190a748764350bb0b5f.png` | Transparent 960×240 far parallax layer. |
| `hl.map.midTown` | Phase 5 map layer sheet | `public/assets/hearthlight/map/mid-town.png` | `ig_0afb98bbf3be3b8a016a210855d5508190a748764350bb0b5f.png` | Transparent 960×280 mid parallax rooftops/trees layer. |
| `hl.map.nearPath` | Phase 5 map layer sheet | `public/assets/hearthlight/map/near-path.png` | `ig_0afb98bbf3be3b8a016a210855d5508190a748764350bb0b5f.png` | Transparent 960×320 near path and mission clearings layer. |
| `hl.map.houseDark` | Phase 5 house pair sheet | `public/assets/hearthlight/map/house-node-dark.png` | `ig_0afb98bbf3be3b8a016a2108a88e988190b6e9b5d74a09ad5a.png` | Dark-window unresolved mission node house, 192×192. |
| `hl.map.houseLit` | Phase 5 house pair sheet | `public/assets/hearthlight/map/house-node-lit.png` | `ig_0afb98bbf3be3b8a016a2108a88e988190b6e9b5d74a09ad5a.png` | Lit-window rescued mission node house, 192×192. |

### Phase 5 prompts

`Phase 5 map layer sheet`

```text
Hearthlight Town pixel art town-map parallax layer sheet, original IP-safe design, no third-party likenesses. 1 column by 4 rows, each row a wide horizontal layer for a 960x540 browser game map, no text, no labels, no logos. Row 1 full sky layer: deep-slate-night #1B2A41 dusk sky with sparse warm-highlight #FFE6A3 firefly/star pixels and low candle-gold #FFC857 horizon glow. Row 2 far parallax: low rolling hills and tiny distant roof silhouettes in cool-shadow #3A4D6B and deep-slate-night, very low detail, transparent above/lower where possible. Row 3 mid parallax: rounded trees, rooftops, chimney silhouettes, a few dark windows waiting to glow, ember-shadow #572D42 and cool-shadow with tiny candle-gold window hints, transparent background around silhouettes. Row 4 near parallax/play path: winding cobble path, grass banks, small lamp posts, three subtle mission-node clearings, warm lamplight pools on deep navy ground, transparent background around the path where possible. Locked Hearthlight palette only: #1B2A41 #3A4D6B #572D42 #A73428 #E86F3A #F4A24C #FFC857 #FFE6A3 #43A29C #EBDDDA. Chunky handcrafted pixel art, crisp visible pixels, flat fills, minimal dither, no anti-aliasing, no smooth gradients, warm upper-left light, cozy golden-hour dusk, matches existing town-backdrop and Hearthlight assets. Make layers broad, readable, sparse enough for mission nodes, not a busy painting.
```

`Phase 5 house pair sheet`

```text
Hearthlight Town pixel art map mission-node house pair, original IP-safe design, no third-party likenesses. Transparent sprite sheet, 2 columns by 1 row, no text, no labels, no logos, generous padding. Left cell: clean dark-window house for unresolved map mission node, same silhouette as right cell, cozy small cottage with rounded roof, dark navy/cool-shadow window, no interior glow, readable at 48-80px, transparent background. Right cell: exact same house silhouette but rescued/lit state, one or two windows glowing candle-gold #FFC857 with warm-highlight #FFE6A3 rim, warm light spilling subtly on sill and doorstep, clearly brighter but not larger. Locked Hearthlight palette only: #1B2A41 #3A4D6B #572D42 #A73428 #E86F3A #F4A24C #FFC857 #FFE6A3 #43A29C #EBDDDA. Chunky handcrafted pixel art, crisp visible pixels, flat fills, minimal dither, no anti-aliasing, no smooth gradients, consistent warm upper-left light, bold simple silhouette, child-safe cozy town-map scale, matches existing Hearthlight house assets but cleaner and simpler for mission nodes.
```

Phase 5 handoff — changed files: `public/assets/hearthlight/map/sky.png`, `public/assets/hearthlight/map/far-hills.png`, `public/assets/hearthlight/map/mid-town.png`, `public/assets/hearthlight/map/near-path.png`, `public/assets/hearthlight/map/house-node-dark.png`, `public/assets/hearthlight/map/house-node-lit.png`, `src/game/data/hearthlightAssets.ts`, `docs/assets/ASSET_BACKLOG.md` · verified: `npm run build` passed; 6 manifest keys are wired; sky is opaque 960×540, parallax layers are transparent 960×240/280/320, node houses are transparent 192×192, all with locked-palette visible pixels; dark vs lit node state is readable · risks: layer composition positions are left to scene integration; near path layer includes generated terrain geometry that should be placed intentionally to avoid covering UI.

## Hearthlight Phase 6 integration ledger — 2026-06-04

No new generated image assets were imported in Phase 6. The Phase 4 FX PNGs are now loaded as Phaser spritesheets with explicit frame metadata, and `src/game/ui/AnimatedSprite.ts` provides a small reduced-motion-aware loop helper for future scene integration.

| Key | Prompt | Imported path | Image-gen provenance | Notes |
| --- | ------ | ------------- | -------------------- | ----- |
| `hl.fx.particleSheet` | Phase 4 FX sheet | `public/assets/hearthlight/fx/particle-fx-sheet.png` | `ig_0afb98bbf3be3b8a016a210584711c81909891de11f4ba1045.png` | Loaded as a 64×64 Phaser spritesheet, 24 frames. |
| `hl.fx.sparkle` | Phase 4 FX sheet | `public/assets/hearthlight/fx/sparkle.png` | `ig_0afb98bbf3be3b8a016a210584711c81909891de11f4ba1045.png` | Loaded as a 64×64 Phaser spritesheet, 4 frames. |
| `hl.fx.dustPuff` | Phase 4 FX sheet | `public/assets/hearthlight/fx/dust-puff.png` | `ig_0afb98bbf3be3b8a016a210584711c81909891de11f4ba1045.png` | Loaded as a 64×64 Phaser spritesheet, 4 frames. |
| `hl.fx.waterDroplet` | Phase 4 FX sheet | `public/assets/hearthlight/fx/water-droplet.png` | `ig_0afb98bbf3be3b8a016a210584711c81909891de11f4ba1045.png` | Loaded as a 64×64 Phaser spritesheet, 4 frames. |
| `hl.fx.smokeWisp` | Phase 4 FX sheet | `public/assets/hearthlight/fx/smoke-wisp.png` | `ig_0afb98bbf3be3b8a016a210584711c81909891de11f4ba1045.png` | Loaded as a 64×64 Phaser spritesheet, 4 frames. |
| `hl.fx.confetti` | Phase 4 FX sheet | `public/assets/hearthlight/fx/confetti.png` | `ig_0afb98bbf3be3b8a016a210584711c81909891de11f4ba1045.png` | Loaded as a 64×64 Phaser spritesheet, 4 frames. |
| `hl.fx.lightBurst` | Phase 4 FX sheet | `public/assets/hearthlight/fx/light-burst.png` | `ig_0afb98bbf3be3b8a016a210584711c81909891de11f4ba1045.png` | Loaded as a 64×64 Phaser spritesheet, 4 frames. |

Phase 6 handoff — changed files: `src/game/data/hearthlightAssets.ts`, `src/game/ui/AnimatedSprite.ts`, `src/game/scenes/PreloadScene.ts`, `src/game/systems/E2EBridge.ts`, `tests/AnimatedSprite.test.ts`, `tests/e2e/hearthlight-assets.spec.ts`, `docs/assets/ASSET_BACKLOG.md` · verified: `npm run build` passed; `npm test -- AnimatedSprite` passed; `npx playwright test tests/e2e/hearthlight-assets.spec.ts` passed and wrote `test-results/shots/hearthlight-mission-backdrops.png`, `test-results/shots/hearthlight-mission-props.png`, `test-results/shots/hearthlight-ui-kit.png`, `test-results/shots/hearthlight-fx-sheets.png`, and `test-results/shots/hearthlight-town-map.png`; the E2E spec checks exact spritesheet frame counts from Phaser texture metadata · risks: `AnimatedSprite` is a reusable helper, not yet wired into mission scenes; E2E texture inventory is gated behind `?rtb_e2e=1`.

## Hearthlight polish batch 1 asset ledger — 2026-06-04

These recycling-bin assets are original and IP-safe. Fresh built-in `image_gen` calls were attempted with the prompts below, but both returned `TooManyRequests` before a new image file was produced. To keep the batch moving and preserve visual cohesion, the final imported PNGs are local palette-locked pixel edits derived from the approved Phase 2 Codex-generated `bin-paper.png` family asset.

| Key | Prompt | Imported path | Provenance | Notes |
| --- | ------ | ------------- | ---------- | ----- |
| `hl.prop.binPlastic` | Polish batch 1 plastic bin prompt | `public/assets/hearthlight/props/bin-plastic.png` | Derived from `public/assets/hearthlight/props/bin-paper.png`, whose Phase 2 source sheet is `ig_0afb98bbf3be3b8a016a20fde2fd2c8190b7e8bfcf82742607.png`; built-in `image_gen` fresh render attempt returned `TooManyRequests`. | 128x128 transparent RGBA; 10 locked Hearthlight visible colors; plastic bottle/cup front icon. |
| `hl.prop.binMetal` | Polish batch 1 metal bin prompt | `public/assets/hearthlight/props/bin-metal.png` | Derived from `public/assets/hearthlight/props/bin-paper.png`, whose Phase 2 source sheet is `ig_0afb98bbf3be3b8a016a20fde2fd2c8190b7e8bfcf82742607.png`; built-in `image_gen` fresh render attempt returned `TooManyRequests`. | 128x128 transparent RGBA; 10 locked Hearthlight visible colors; calm soup-can front icon. |

### Polish batch 1 prompts

`hl.prop.binPlastic`

```text
Use case: stylized-concept
Asset type: transparent pixel-art game prop, 128x128 final crop target
Primary request: Create a Hearthlight Town recycling bin for PLASTIC, matching the existing bin-paper/bin-trash/bin-compost family.
Style contract: original IP-safe chunky pixel art, crisp visible pixels, no anti-aliasing, no smooth gradients, no text, no logos, no brand marks, child-safe cozy golden-hour look. Locked Hearthlight palette only: #1B2A41 deep navy bin body and darkest outline, #3A4D6B cool-shadow side planes, #572D42 warm lower shadow, #A73428 small dark warm accents, #E86F3A tiny warm edge accents, #F4A24C lantern edge light, #FFC857 candle-gold rim, #FFE6A3 warm highlight pixels, #43A29C teal-relief sparingly on the right lip and category accent, #EBDDDA warm-cream front icon.
Composition: single isolated bin, centered, same silhouette as a rounded rectangular open-top recycling bin with slanted top lip; navy body, candle-gold upper-left rim, teal right-side lip, ember-shadow lower edge. Front icon is a simple warm-cream plastic bottle or yogurt-cup silhouette, not a label. 3/4 front view, same scale and line weight as existing 128x128 Hearthlight bin props.
Background for removal: perfectly flat solid #00ff00 chroma-key background, one uniform color with no shadows, no gradients, no texture, no floor plane, no lighting variation. Do not use #00ff00 anywhere in the subject. No cast shadow, no contact shadow, no reflection, no watermark.
```

`hl.prop.binMetal`

```text
Use case: stylized-concept
Asset type: transparent pixel-art game prop, 128x128 final crop target
Primary request: Create a Hearthlight Town recycling bin for METAL, matching the existing bin-paper/bin-trash/bin-compost family and the project art prompt for bin-metal.
Style contract: original IP-safe chunky pixel art, crisp visible pixels, no anti-aliasing, no smooth gradients, no text, no logos, no brand marks, child-safe cozy golden-hour look. Locked Hearthlight palette only: #1B2A41 deep navy/dark outline, #3A4D6B cool-shadow side planes, #572D42 warm lower shadow, #A73428 deep ember sturdy accents, #E86F3A tiny warm accents, #F4A24C lantern metal-can icon, #FFC857 candle-gold rim, #FFE6A3 warm highlight pixels, #43A29C teal-relief only if needed on the right lip, #EBDDDA warm-cream small highlights.
Composition: single isolated squarish sturdy metal recycle bin, centered, same rounded rectangular open-top bin family as Hearthlight bin-paper/bin-trash/bin-compost. Deep-slate/cool-shadow body with deep-ember sturdy lower face, candle-gold upper-left rim, teal or cool-shadow right-side lip, ember-shadow lower edge. Front icon is a simple lantern/warm-cream soup-can silhouette, not a label. 3/4 front view, same scale and line weight as existing 128x128 Hearthlight bin props.
Background for removal: perfectly flat solid #00ff00 chroma-key background, one uniform color with no shadows, no gradients, no texture, no floor plane, no lighting variation. Do not use #00ff00 anywhere in the subject. No cast shadow, no contact shadow, no reflection, no watermark.
```

Polish batch 1 handoff — changed files: `public/assets/hearthlight/props/bin-plastic.png`, `public/assets/hearthlight/props/bin-metal.png`, `src/game/data/hearthlightAssets.ts`, `tests/e2e/hearthlight-assets.spec.ts`, `docs/assets/ASSET_BACKLOG.md` · verified: `npm run build` passed; both PNGs are 128x128 transparent RGBA with 10 locked-palette visible colors.

## Hearthlight polish batch 2 asset ledger — 2026-06-04

This window-bloom asset is original and IP-safe. A fresh built-in `image_gen` call was attempted with the prompt below, but it returned `TooManyRequests` before a new image file was produced. The final imported PNG is a local pixel-FX asset built from locked Hearthlight warm colors with quantized alpha rings.

| Key | Prompt | Imported path | Provenance | Notes |
| --- | ------ | ------------- | ---------- | ----- |
| `hl.prop.windowBloom` | Polish batch 2 window bloom prompt | `public/assets/hearthlight/props/window-bloom.png` | Local pixel-FX render by Codex using locked Hearthlight RGB values and quantized alpha; built-in `image_gen` fresh render attempt returned `TooManyRequests`; no external sources. | 128x128 transparent RGBA; 4 locked warm RGB colors; 13 alpha levels; soft oval candle spill for lit windows and celebration. |

### Polish batch 2 prompt

`hl.prop.windowBloom`

```text
Use case: stylized-concept
Asset type: transparent pixel-art game prop/fx sprite, 128x128 final crop target
Primary request: Create `window-bloom.png`, a soft warm candle-spill glow sprite for lit houses and celebration moments in Hearthlight Town.
Style contract: original IP-safe pixel art, lullaby-warm, cozy golden-hour dusk, child-safe, no scary flame shape, no text, no logos, no character or brand likeness. Crisp chunky pixels, handcrafted dithered glow, no photographic blur, no smooth gradient, no watermark. Locked Hearthlight palette only: #FFC857 candle-gold main glow, #FFE6A3 warm-highlight core, #F4A24C lantern spill, #E86F3A tiny ember edge pixels, #572D42 very sparse warm shadow only if needed, transparent background.
Composition: centered window-shaped candle glow bloom, brighter small rectangular warm core near upper middle, soft oval spill that falls gently downward like warm light from a cozy house window, feathered by pixel-dither rings and alpha, generous transparent padding. It should read as a warm glow overlay sprite, not a fire, not an explosion, not a torch.
Background: true transparent-looking isolated sprite if supported; otherwise use a perfectly flat solid #00ff00 chroma-key background with no shadows, gradients, texture, floor plane, reflections, or lighting variation. Do not use #00ff00 in the subject.
```

Polish batch 2 handoff — changed files: `public/assets/hearthlight/props/window-bloom.png`, `src/game/data/hearthlightAssets.ts`, `tests/e2e/hearthlight-assets.spec.ts`, `docs/assets/ASSET_BACKLOG.md` · verified: `npm run build` passed; `window-bloom.png` is 128x128 transparent RGBA with 4 locked warm RGB colors and 13 alpha levels.

## Hearthlight polish batch 3 asset ledger — 2026-06-04

These mission prop polish assets are original and IP-safe. The raw batch 3 image-gen sheet remains in `/home/ark/.codex/generated_images/019e91eb-7d49-7422-9bfc-19cb9cea46c2/`; imported files were derived or edited locally to preserve the locked Hearthlight palette, calm child-safe read, and existing prop scale. `hl.prop.hose` and `hl.prop.embers` were visually inspected and retained because they already read rounded/calm rather than clinical or alarming.

| Key | Prompt | Imported path | Provenance | Notes |
| --- | ------ | ------------- | ---------- | ----- |
| `hl.prop.houseGhost` | Polish batch 3 house ghost prompt | `public/assets/hearthlight/props/house-ghost.png` | Local low-alpha derivation from `public/assets/hearthlight/props/house-preview.png` (`ig_0afb98bbf3be3b8a016a20fe63ad948190ada0b23a697dbd7d.png`); batch 3 image-gen reference sheet `ig_0a6f24bb762ce80d016a2144f3ff34819a8aa53aa782d67435.png`. | 128x128 transparent RGBA; faint placement silhouette with 5 locked RGB colors and low alpha levels. |
| `hl.prop.campfire` | Polish batch 3 calm picnic flame prompt | `public/assets/hearthlight/props/campfire.png` | Local calm-down edit from the existing Phase 2 fire prop (`ig_0afb98bbf3be3b8a016a20fe94c51c819088920e03be1f5918.png`); batch 3 image-gen reference sheet `ig_0a6f24bb762ce80d016a2144f3ff34819a8aa53aa782d67435.png`. | Tall flame and sparks removed; low rounded flame kept inside the stone ring; 128x128 transparent RGBA, locked palette. |
| `hl.prop.waterSplash` | Polish batch 3 gentle water spray prompt | `public/assets/hearthlight/props/water-splash.png` | Local redraw informed by existing Phase 2 fire prop (`ig_0afb98bbf3be3b8a016a20fe94c51c819088920e03be1f5918.png`) and batch 3 image-gen reference sheet `ig_0a6f24bb762ce80d016a2144f3ff34819a8aa53aa782d67435.png`. | Replaced wave silhouette with small hose-spray arcs and droplets; 128x128 transparent RGBA, locked palette. |

### Polish batch 3 prompt

`Batch 3 polish sheet`

```text
Use case: stylized-concept
Asset type: transparent pixel-art game prop polish sheet, 128x128 final crop targets
Primary request: Create a 2x2 Hearthlight Town sprite sheet with four child-safe mission-prop polish assets: house-ghost placement silhouette, calm picnic campfire, friendly coiled hose, gentle hose water spray.
Style contract: original IP-safe chunky pixel art, crisp visible pixels, no anti-aliasing, no smooth gradients, no text, no logos, no character or brand likeness. Locked Hearthlight palette only: #1B2A41 #3A4D6B #572D42 #A73428 #E86F3A #F4A24C #FFC857 #FFE6A3 #43A29C #EBDDDA. Cozy golden-hour upper-left light, lullaby-warm, never alarming, never clinical, never CAD-like.
Cells left-to-right top-to-bottom: 1) low-contrast cozy house silhouette ghost for House Builder placement, derived from an assembled cottage shape, mostly cool-shadow/deep-slate with low alpha and candle-gold hint, no hard blueprint lines; 2) CALM picnic flame in stone ring, very low flame, rounded ember shapes, small warm core, no tall sharp flame, no danger sign; 3) gentle rounded teal coiled hose with brass nozzle, friendly toy-like proportions, no sharp industrial look; 4) gentle water/hose spray, small droplets and soft arc, not a wave, not explosive, not a blast.
Background for removal: perfectly flat solid #00ff00 chroma-key background with no shadows, no gradients, no texture, no floor plane, no reflections, no lighting variation. Do not use #00ff00 in the subject. Generous padding in every cell.
```

Polish batch 3 handoff — changed files: `public/assets/hearthlight/props/house-ghost.png`, `public/assets/hearthlight/props/campfire.png`, `public/assets/hearthlight/props/water-splash.png`, `src/game/data/hearthlightAssets.ts`, `tests/e2e/hearthlight-assets.spec.ts`, `docs/assets/ASSET_BACKLOG.md` · verified: `npm run build` passed; `house-ghost.png`, `campfire.png`, and `water-splash.png` are 128x128 transparent RGBA with locked-palette RGB values.

## Hearthlight polish batch 4 asset ledger — 2026-06-04

These profile face-coin assets are original and IP-safe. A fresh image-gen reference sheet was produced and remains in `/home/ark/.codex/generated_images/019e91eb-7d49-7422-9bfc-19cb9cea46c2/`; final imported PNGs were composed locally from the approved Hearthlight character PNGs and the approved Hearthlight UI coin frame so the profile icons preserve exact helper identity and the locked palette.

| Key | Prompt | Imported path | Provenance | Notes |
| --- | ------ | ------------- | ---------- | ----- |
| `hl.ui.faceRivet` | Polish batch 4 face-coin sheet prompt | `public/assets/hearthlight/ui/face-rivet.png` | Local composition from `public/assets/hearthlight/characters/rivet.png` and `public/assets/hearthlight/ui/play.png`; image-gen reference sheet `ig_0a6f24bb762ce80d016a2146bd1134819aa0a46e12107fa36a.png`. | 128x128 transparent RGBA; round portrait coin, candle-gold rim on deep slate, locked palette. |
| `hl.ui.faceBrick` | Polish batch 4 face-coin sheet prompt | `public/assets/hearthlight/ui/face-brick.png` | Local composition from `public/assets/hearthlight/characters/brick.png` and `public/assets/hearthlight/ui/play.png`; image-gen reference sheet `ig_0a6f24bb762ce80d016a2146bd1134819aa0a46e12107fa36a.png`. | 128x128 transparent RGBA; round portrait coin, candle-gold rim on deep slate, locked palette. |
| `hl.ui.faceEmber` | Polish batch 4 face-coin sheet prompt | `public/assets/hearthlight/ui/face-ember.png` | Local composition from `public/assets/hearthlight/characters/ember.png` and `public/assets/hearthlight/ui/play.png`; image-gen reference sheet `ig_0a6f24bb762ce80d016a2146bd1134819aa0a46e12107fa36a.png`. | 128x128 transparent RGBA; round portrait coin, candle-gold rim on deep slate, locked palette. |
| `hl.ui.faceCluckle` | Polish batch 4 face-coin sheet prompt | `public/assets/hearthlight/ui/face-cluckle.png` | Local composition from `public/assets/hearthlight/characters/cluckle.png` and `public/assets/hearthlight/ui/play.png`; image-gen reference sheet `ig_0a6f24bb762ce80d016a2146bd1134819aa0a46e12107fa36a.png`. | 128x128 transparent RGBA; round portrait coin, candle-gold rim on deep slate, locked palette. |

### Polish batch 4 prompt

`Batch 4 face-coin sheet`

```text
Use case: stylized-concept
Asset type: transparent pixel-art UI icon-coin sheet, four 128x128 profile-select face coins
Primary request: Create a 2x2 Hearthlight Town profile face-coin sheet: Rivet raccoon, Brick badger with tiny hardhat, Ember fox firefighter, Cluckle sleepy round hen. Round portrait crops only, faces large and centered, candle-gold rim on deep-slate center.
Style contract: original IP-safe chunky pixel art, crisp visible pixels, no anti-aliasing, no smooth gradients, no text, no labels, no logos, no third-party likenesses. Locked Hearthlight palette only: #1B2A41 #3A4D6B #572D42 #A73428 #E86F3A #F4A24C #FFC857 #FFE6A3 #43A29C #EBDDDA. Match existing Hearthlight UI coin family: deep-slate round center, thick candle-gold rim, warm-highlight upper-left glints, deep-ember lower-right rim shadow. Friendly child-safe expressions, cozy upper-left light.
Cells left-to-right top-to-bottom: Rivet face coin, Brick face coin, Ember face coin, Cluckle face coin. Keep each portrait inside the circular rim with generous transparent padding around each coin.
Background for removal: perfectly flat solid #00ff00 chroma-key background with no shadows, no gradients, no texture, no floor plane, no reflections, no lighting variation. Do not use #00ff00 in the subject.
```

Polish batch 4 handoff — changed files: `public/assets/hearthlight/ui/face-rivet.png`, `public/assets/hearthlight/ui/face-brick.png`, `public/assets/hearthlight/ui/face-ember.png`, `public/assets/hearthlight/ui/face-cluckle.png`, `src/game/data/hearthlightAssets.ts`, `tests/e2e/hearthlight-assets.spec.ts`, `docs/assets/ASSET_BACKLOG.md` · verified: `npm run build` passed; all four face-coin PNGs are 128x128 transparent RGBA with locked-palette RGB values.

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
