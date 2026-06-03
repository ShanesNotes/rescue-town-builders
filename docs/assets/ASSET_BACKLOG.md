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

| Asset | Source URL | Source/author | License | Attribution required | Date checked | Imported path | Notes |
| ----- | ---------- | ------------- | ------- | -------------------- | ------------ | ------------- | ----- |
| _None yet_ | | | | | | | |

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
