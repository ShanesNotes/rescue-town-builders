# ADR-0008 — Pixel-art rendering for the Hearthlight art direction

Status: Accepted (2026-06-03, ratified by Claude under the non-HITL goal; art direction chosen by Shane)

## Context
The foundation shipped with `Phaser.Scale.FIT` over a 960×540 canvas and **no render block**, so
every texture is bilinear-upscaled (confirmed in diagnostics: a 960×540 buffer stretched to
1280×720+ = soft/blurry), over same-value pastel backgrounds = flat. Shane chose the
**Hearthlight Town** pixel-art direction (`docs/design/design-system.md`).

## Decision
- Enable **`pixelArt: true`** in `GameConfig` (nearest-neighbor + roundPixels). This removes the
  blur and is the correct filter for pixel-art assets.
- **Keep the logical canvas at 960×540** so all existing scene coordinates remain valid; author
  pixel art at a **480×270 half-density grid displayed at 2×** (one art-texel = 2 game px).
- Keep `Scale.FIT` + `CENTER_BOTH`; set the game `backgroundColor` to the palette navy
  (`#1B2A41`) so letterbox bars read as intentional night, not dead space.
- Defer a full base-resolution rewrite to 480×270 (would break every coordinate) unless a later
  cycle proves it necessary for pixel-perfect integer scaling.

## Alternatives considered
- **Rewrite base resolution to 480×270 native:** purest pixels, but breaks all scene coords now —
  too costly for the gain; the 2× authoring convention gets ~all the crispness.
- **Vector / no pixelArt (the Inkline direction):** would dodge pixel-scaling entirely, but Shane
  picked pixel-art Hearthlight; vector remains the documented fallback if AI sprite cohesion fails.

## Consequences
- Pre-existing smooth (SVG/Kenney) art now renders nearest-neighbor until replaced by the
  Hearthlight asset set — acceptable interim; everything gets replaced.
- Move the child-facing text to a bitmap font (design-system §6) so type stays crisp.
- Revisit integer-zoom / pixel-perfect scaling and HiDPI (`resolution`) in the viewport slice (D2).
