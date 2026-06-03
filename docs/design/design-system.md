# Design System — "Hearthlight Town" (LOCKED 2026-06-03)

> Shane picked **Hearthlight Town**. This is the contract every asset and scene obeys.
> The art technique and the soul are the same gesture: **rescue a friend → a dark window
> lights warm.** A child should want to fall into this world in 3 seconds.

## 1. The feeling
A sleepy golden-hour town at dusk, lamps out, shadows long. Warmth spreads as you help —
each rescue lights another window until the street glows like a held breath. Cozy, lush,
hand-warm — never cold, never generic, never "merely soft." References: A Short Hike,
Hyper Light Drifter, Eastward, Stardew Valley.

## 2. Rendering & grid (see ADR-0008)
- **Pixel-art.** Logical canvas stays **960×540** (existing scene coords keep working), but art
  is authored at a **480×270 "half-density" pixel grid and displayed at 2× integer** — so one
  art-texel = 2 game px and everything reads as crisp chunky pixels.
- `pixelArt: true` (nearest-neighbor, roundPixels) — this alone kills the current bilinear blur.
- Scale: FIT + CENTER; aim for integer-ish zoom; letterbox with the navy floor color.
- No anti-aliased smooth art. No system-font text in the child layer (bitmap font, §6).

## 3. Palette (LOCKED — use these hex, nothing else)
| Token | Hex | Role |
| --- | --- | --- |
| deep-slate-night | `#1B2A41` | base floor / letterbox / darkness |
| cool-shadow | `#3A4D6B` | unlit shadow, distant layers |
| ember-shadow | `#572D42` | warm shadow under lights |
| deep-ember | `#A73428` | dark warm accents |
| ember-fox-orange | `#E86F3A` | Ember, fire, primary warm |
| lantern | `#F4A24C` | lamplight mid |
| candle-gold | `#FFC857` | the glow of a lit window / reward gold |
| warm-highlight | `#FFE6A3` | brightest warm highlight, sparkles |
| teal-relief | `#43A29C` | Rivet/water/cool relief accent (used sparingly) |
| warm-cream | `#EBDDDA` | UI text on dark, soft neutrals |
Rule: cool navy/slate **floor**, warm gold/ember **light**. Contrast = warmth vs. dark, not
saturation vs. blur. Every scene is mostly dim with pools of warm light.

## 4. Characters (original, IP-safe; consistent model sheet)
Chunky, bold silhouettes readable at 48–80px. Big eyes, simple warm shapes, lantern-lit.
- **Rivet** — raccoon, recycle helper. Teal-relief accents, a little satchel.
- **Brick** — badger, builder. Warm wood/orange, a tiny hardhat.
- **Ember** — fox, firefighter. Ember-orange, the warm heart of the palette.
- **Cluckle** — round dreaming hen, the secret soul. Soft, glowing, sleepy.
- **Townsfolk** — 2–3 simple background critters to populate windows.
Each needs: idle (2–4 frame breathing bob), happy/cheer, "oops". A consistent light source
(warm, upper-left). Deliver as transparent PNGs + an atlas.

## 5. UI kit — ICON-FIRST, near-zero words
- **Buttons are glowing icon-coins** — literal world objects (a recycle bin, a brick, an animal
  face, a ▶ play glyph), round/rounded, candle-gold rim that pulses faintly. NO sentences.
- **Panels**: chunky 9-slice frames, lantern-gold on dark wood; soft inner glow.
- **Mission goal** = a picture-checklist that stamps a ✓ with a bounce (no prose).
- **HUD**: big icon + a fat numeral (bitmap), a chunky progress bar that fills warm.
- Replace ALL current wordy copy with icons; reserve words for the parent-gated layer only.
- Touch targets ≥ 64px, generous; press = scale-punch + tick (see §7).

## 6. Typography
- **BitmapText** from a chunky rounded pixel font (BMFont, antialias off). Big numerals + short
  icon labels only. (Kenney Kenney-Pixel / "Round" as a CC0 base, or generate a BMFont.)
- No paragraph text for the child. Integer-positioned to stay crisp.

## 7. Motion & juice (one shared constants module)
`PUNCH_MS=90` (Back.Out scale-punch on press), `HITSTOP≈3 frames`, `SHAKE=0.004/120ms`,
`POP=1.12`. Every meaningful action: punch + brief hit-stop + warm tick SFX + tiny camera
shake. Star/score count-ups tick in (Balatro payoff). Idle: characters breathe, fireflies
drift, lights flicker faintly. Respect `prefers-reduced-motion`.

## 8. Atmosphere & the core mechanic
- Scenes open **dim and blue-shadowed**; a single warm directional light + one additive bloom
  layer behind interactables. 2–3 parallax layers (far hills desaturated → near grass).
- **Light budget:** N rescues = N lit windows. Completing a mission lights a building, its glow
  spilling warm onto the ground. Progress IS visible warmth spreading through the dark.
- Ambient life: drifting fireflies, chimney godrays, gentle sway.

## 9. The soul (Language of Creation) — native to the art
- **Hidden Light** = a window only the patient child makes glow.
- **Naming-the-animals** = a shy creature found by peeking around overlapping geometry.
- **Microcosm (Cluckle)** = a tiny lit town reflected in a dark well / held in her dream.

## 10. Asset manifest (Codex image-gen targets → `public/assets/hearthlight/`)
characters: rivet, brick, ember, cluckle, townsfolk-a/b (idle+cheer+oops frames)
tiles: cobble, grass, path, water, night-sky gradient, far-hills, mid-trees (parallax)
buildings: house (dark + lit-window variants), recycle-center, construction-lot, fire/picnic
props: recycle bins (5), house parts (5), fire, hydrant, water-spray, lantern, firefly, well
ui: icon-coins (play, recycle, build, fire, stickers, settings, back), 9-slice panel,
    progress-bar, star, sticker frame, checkmark
fx: warm-glow/bloom sprite, sparkle, smoke puff, water splash, confetti, godray, scene-wipe
All ORIGINAL + IP-safe; record in docs/assets/ASSET_BACKLOG.md.

## 11. Production pipeline
Grok writes vivid per-asset image-gen prompts (style bible) → **Codex generates PNGs via its
built-in image_gen tool** in its worktree against this doc → Claude curates, atlases, wires,
and implements rendering/lighting/UI (TDD + screenshot verification). Worktree isolation;
only Claude merges. (Grok's CLI has no image model — it is the prompt-smith, not the renderer.)
