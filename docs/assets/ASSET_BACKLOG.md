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
| P0 | Props | Recycling bins and trash items | Simple icons/shapes | Clear icon-first bin and object set | Needed |
| P0 | Props | House parts | Rectangles/triangles with colors | Foundation, wall, roof, door, decoration set | Needed |
| P0 | Props | Hydrant and cartoon fires | Simple hydrant/fire shapes | Friendly low-intensity fire visuals | Needed |
| P0 | UI | Buttons, panels, progress bar | Shape-based UI | Large touch-friendly UI kit | Needed |
| P1 | UI | Profile icons | Simple symbols | Original child-safe avatar icons | Needed |
| P1 | Rewards | Stars and stickers | Basic star/sticker shapes | Sticker-book reward art | Needed |
| P1 | FX | Sparkle, water spray, smoke puff | Particle placeholders | Soft non-flashing FX sprites | Needed |
| P1 | Audio | Button pop, chime, boop, star, fanfare | Muted placeholder or approved royalty-free SFX | Cohesive short non-annoying SFX pack | Needed |
| P2 | Audio | Theme music loop | No music until volume/mute system exists | Human-generated loop exists in 4 segments; splice later, then record source/license notes before import | Backlog |
| P2 | Fonts | Child-friendly readable font | System font | Licensed/open font with strong readability | Needed |

## License ledger

| Asset | Source URL | Source/author | License | Attribution required | Date checked | Imported path | Notes |
| ----- | ---------- | ------------- | ------- | -------------------- | ------------ | ------------- | ----- |
| _None yet_ | | | | | | | |

## Audio intake note

The theme music currently exists outside the repo as four generated segments. Do not import these into the prototype yet. Slice 0 stays silent/minimal; audio work begins after volume/mute settings and source/license notes are ready.
