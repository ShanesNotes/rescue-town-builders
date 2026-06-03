# design.md — Rescue Town Builders, locked design direction

> The single source of truth for *how the game should look, feel, and sound*. Mechanics
> and architecture live in the PRD (`docs/prd/prd-v0.1.0.md`) and ADRs; the warm creative
> vision lives in `docs/design/creative-direction.md` (Grok). This file **locks** the
> direction the three models build toward so the gift stays coherent.

## 1. The feeling (north star)

A playable toy, not a hard video game. A sunny, hand-drawn sticker-book town that already
seems to know the child is coming and is glad they're here. First-second feeling at the
title: *"This place needs a helper, and I get to be one."* Wonder over praise; nobody can
fail. The hidden heart is Cluckle, the dreaming hen who holds the whole town as a microcosm
inside her sleep — the Language-of-Creation soul, never stated, only felt.

## 2. Art direction (locked)

- **Style:** rounded, flat, colorful, sticker-book cartoon (PRD §11). Thick soft outlines,
  generous corner radii, no harsh edges, no realism, no scary imagery.
- **Camera:** 2D, side-view / gentle top-down per mission.
- **Characters:** original animal helpers with simple silhouettes — Rivet (raccoon, recycle),
  Brick (badger, builder), Ember (fox, fire), Cluckle (hen, the secret heart). Bios in
  `docs/design/creative-direction.md`.
- **Motion:** 4–8 frame loops or gentle tweens for idle/success/"oops." Idle bob already on
  the title. No flashing; respect reduced-motion.

### Palette (locked — from creative-direction.md)

| Token | Hex | Use |
| --- | --- | --- |
| Dream Sky | `#D4EFFF` | backgrounds, calm |
| Cream Nest | `#FFF8E7` | panels, paper |
| Rivet Teal | `#5EC8B5` | Rivet / recycle accents |
| Brick Warmth | `#F4A261` | Brick / build accents |
| Ember Glow | `#F48A9E` | Ember / fire accents (warm, never alarming) |
| Star Honey | `#F7C948` | stars, rewards |
| Magic Dust | `#C9B8E8` | secrets, sparkle |
| Button Mint | `#8FDBB8` | primary buttons |
| Ink Story | `#203247` | text, outlines |

High contrast, large type, no tiny UI (PRD §7).

## 3. Asset sources (locked — CC0 only)

Original characters always; **all imported art/audio is CC0** with source + license recorded
in `docs/assets/ASSET_BACKLOG.md` (PRD §11/§19; IP-safety per ADR-0003). Primary source is
**Kenney.nl** (CC0), per the foundational PRD. Recommended packs (cohesive rounded/flat set):

| Need | Kenney CC0 pack |
| --- | --- |
| UI (buttons, panels, sliders, icons) | **Kenney UI Pack** / UI Pack – RPG Expansion |
| Helper characters / townsfolk | **Kenney Animal Pack Redux** (raccoon/badger/fox/hen fit the helpers) |
| Town tiles, buildings, props | **Kenney Map Pack** / City Kit / Generic Items |
| FX (sparkle, smoke, splash) | **Kenney Particle Pack** |
| SFX (clicks, pops, chimes) | **Kenney Interface / Digital Audio**; jingles from **Kenney Music Jingles** |

Secondary (only if a gap remains): OpenGameArt CC0, Pixabay royalty-free SFX (PRD §11) —
never fan art, logos, or any third-party likeness. The current original SVGs stay as the
guaranteed No-Fail fallback; imported art renders *over* them.

## 4. Audio direction (locked)

- **Music now:** procedural WebAudio loop (`MusicSystem`) playing Grok's motif — G major,
  76 BPM, I–IV–V–vi, "sunlight on closed eyelids." Gentle, sits under SFX, gated on the
  music slider (No-Fail: silent when muted).
- **Music later:** Shane's recorded theme (`audio.theme-loop`, four Audacity segments) →
  splice → export OGG to `public/assets/audio/theme.ogg` → swap in behind the **same
  `MusicSink` interface**, no caller changes. This is the only handoff that needs Shane
  (a 30-second Audacity File → Export). Tracked as a backlog item.
- **SFX:** synthesized cues (`SfxSystem`) per PRD §12 — soft pop (button), sparkle (correct),
  gentle boop (never a harsh buzzer), rising chime (star), short fanfare (complete),
  shimmer (secret). CC0 samples can swap in behind `SfxSink` later.

## 5. UI/UX principles (locked)

- **Large, satisfying, crisp.** Touch targets ≥ `MIN_TOUCH_TARGET`; big readable type;
  obvious primary action with a gentle pulse so a pre-reader knows where to go.
- **Icon-first, optionally voiced** (PRD §7). Minimal words on child-facing screens.
- **No-Fail everywhere.** Wrong choices hint and retry; language is "try again," never
  "you lost." Parent-only settings behind a 3-second hold.
- **HUD** (PRD §10): goal icon, big visual progress bar, touch action button, hold-to-confirm
  pause, optional hint after a delay, low-pressure star preview.
- **Juice, gently:** bounce-into-bin, chimney smoke-ring → star, rainbow spray droplets,
  sticker bounce on open, the Cluckle miniature-town reveal (creative-direction.md §delight).

## 6. Screen inventory & status

| Screen | Status |
| --- | --- |
| Boot / Preload | ✅ loads manifest |
| **Title (Start)** | ✅ real title: sky, helpers w/ idle bob, pulsing Play, music on first tap |
| Profile | ⏳ render helper avatars as character art (Codex) |
| Town Map | ⏳ map background + node/character art (Codex) |
| Recycling Run / House Builder / Fire Fix | ⏳ render item/part/fire art over hit-targets (Codex) |
| Mission Complete | ✅ star-scaled celebration; ⏳ confetti/sticker art polish |
| Sticker Book | ✅ grid + read-again; lore enriched (Grok) |
| Parent Settings | ✅ volume / difficulty / reset |

## 7. Production model

Three models, one coherent gift — see `docs/planning/long-running-plan.md`:
- **Claude** — orchestration, mechanics, the Secrets soul, audio synthesis, verification,
  integration/merge.
- **Codex** — CC0/Kenney asset production + the render/animation layer (autonomous worktree).
- **Grok** — creative direction: lore, voice, palette, motifs, concepts (autonomous worktree).

Worktree isolation is mandatory; only Claude merges to `main`; every cycle ends green and is
logged in `docs/planning/continuous-refinement.md`.
