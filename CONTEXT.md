# Rescue Town Builders context

## Product identity

**Rescue Town Builders** is an original, IP-safe, browser-first 2D mini-game anthology for children ages 4-7 with a parent nearby. The game should feel like a playable toy: generous, obvious, cheerful, and impossible to truly fail.

## Domain glossary

- **Rescue Town** — the cheerful town hub that visually improves as missions are completed.
- **Town Map Hub** — the mission-selection screen where each building or area opens a mini-game.
- **Helper Character** — an original kid or animal helper associated with a mission. Avoid "pup" only when it creates third-party character confusion; the PRD's original helper names are allowed.
- **Mission** — a short playable activity lasting roughly 60-180 seconds.
- **Mission Framework** — the shared runtime expectations for starting, pausing, completing, scoring, saving, and returning from missions.
- **Mission Definition** — data describing a mission's id, title, character, map node, intro panels, age target, and estimated duration.
- **Mission Result** — the completion payload containing stars, score, unlocked stickers, and stats.
- **No-Fail Rule** — a child can make mistakes and receive hints, but should always be able to finish a mission.
- **Helper Mode** — adaptive assistance after repeated misses; it should reduce friction without shaming the child.
- **Star Rating** — 1-3 stars awarded after a mission. One star means completion; higher stars reward accuracy, fewer hints, or mission-specific performance.
- **Sticker** — a collectible reward unlocked by mission completion.
- **Sticker Book** — a reward screen where unlocked stickers are viewed.
- **Town Decoration** — a visual improvement that appears in Rescue Town after mission progress.
- **Parent Settings** — adult-facing settings hidden behind a hold-for-3-seconds gate.
- **Asset Backlog** — the tracked list of art, UI, FX, audio, font, and licensing needs in `docs/assets/ASSET_BACKLOG.md`.
- **Placeholder Asset** — temporary original or approved CC0/royalty-free art/audio used to keep engineering moving.
- **Production Asset** — final or shippable art/audio with recorded source, license, and replacement notes.

## Original MVP missions

- **Rivet's Recycling Run** — sorting trash, paper, plastic, metal, and compost. Teaches categorization and visual discrimination.
- **Brick's House Builder** — selecting house parts in order. Teaches sequencing and spatial matching.
- **Ember's Fire Fix** — moving, aiming, and spraying water at cartoon fires. Teaches directional control, timing, and prioritization.

## Safety and design constraints

- No accounts, chat, ads, purchases, external links in child-facing UI, online multiplayer, analytics, leaderboards, or backend for MVP.
- No Paw Patrol names, logos, images, music, character likenesses, or fan art.
- Instructions are icon-first and optionally voiced later.
- Timing is generous. MVP has no hard fail timers.
- Controls must support keyboard, touch, and gamepad; every mission needs a one-handed path.
- UI must use large targets, clear contrast, and no flashing effects.

## Agent operating model

Agents own architecture and design defaults. Work proceeds through PRD sections, ADRs, Ultragoal phases, GitHub Issues, tracer-bullet slices, and TDD. Human review is expected for taste, child play-test observations, and unresolved asset/license choices.
