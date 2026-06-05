# Hero Game Art Manifest

New arcade-energy Hearthlight art lives under `public/assets/hearthlight/v2/`.
These files are staged for later wiring and do not overwrite the current shipped assets.

| New file | Replaces / target key | Dimensions | Notes |
| --- | --- | --- | --- |
| `v2/build-lot.png` | `hl.bg.build` | 960x540 | Brighter daytime Brick's Tower construction lot; generated with built-in image tooling, center-cropped and resized to runtime dimensions. |
| `v2/fire-picnic-lot.png` | `hl.bg.fire` | 960x540 | Brighter daytime Ember's Fire Brigade picnic lot; locally authored at 480x270 and scaled 2x after image generation hit rate limiting. |
| `v2/brick-sheet.png` | New candidate for Brick's Tower brick textures | 472x52 | Four 118x52 brick frames matching `brickTowerLevels[0].brickWidth` and `brickHeight`; current scene still generates `__brick*` textures in code. |
| `v2/water-droplet-sheet.png` | `hl.fx.waterDroplet` | 256x64 | Four 64x64 chunky droplet frames with transparent corners; candidate replacement for the existing spritesheet. |
| `v2/water-splash.png` | `hl.prop.waterSplash` | 128x128 | Chunky alpha splash for the spray button and hit feedback. |
| `v2/fire-frame-1.png` | `hl.prop.campfire` | 128x128 | Friendly cartoon fire frame; best single-frame replacement candidate. |
| `v2/fire-frame-2.png` | Future animated fire variant for `hl.prop.campfire` | 128x128 | Alternate flame pose for later animation wiring. |
| `v2/fire-frame-3.png` | Future animated fire variant for `hl.prop.campfire` | 128x128 | Alternate flame pose for later animation wiring. |
| `v2/embers-rest.png` | `hl.prop.embers` | 128x128 | Doused/resting campfire state with steam curls. |
