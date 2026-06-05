# Rescue Town Builders context

## Product identity

**Rescue Town Builders** is an original, IP-safe, browser-first 2D mini-game anthology for children ages 4-7 with a parent nearby. The game should feel like a playable toy: generous, obvious, cheerful, and impossible to truly fail.

## Domain glossary

- **Rescue Town** — the cheerful town hub that visually improves as missions are completed.
- **Town Map Hub** — the mission-selection screen where each building or area opens a mini-game.
- **Helper Character** — an original kid or animal helper associated with a mission. Avoid "pup" only when it creates third-party character confusion; the PRD's original helper names are allowed.
- **Mission** — a short playable activity lasting roughly 60-180 seconds.
- **Hero Game** — one of the 5 deep, arcade-energy, no-fail games the missions now run on (Brick's Tower, Ember's water-arc spray, Rivet's Recycle Snake, Cluckle's Dream Catch, Town Ride). Each plays ~3 ramping rounds and can serve several missions, reading its launching `missionId` for backdrop/skin/secret/sticker. See ADR-0009.
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

## Missions → hero games (ADR-0009)

The original sorting/aiming missions were rebuilt into 5 deep arcade physics **hero games** (the
"go bigger" overhaul; full record in `docs/planning/quality-overhaul.md`). The 3 original MVP missions
are now:

- **Rivet's Recycling Run** → **Recycle Snake** — a no-fail Snake: drive Rivet's cart to scoop up
  recyclables (it grows a tail), 3 yards. (Also serves recycled-inventions.)
- **Brick's House Builder** → **Brick's Tower** — a Matter.js physics block-stacker: drop bricks that
  fall and settle with real weight, 3 towers.
- **Ember's Fire Fix** → **Ember's water-arc spray** — point and water LAUNCHES on a visible ballistic
  arc to douse fires (3 waves). (Also serves goo-cleanup: water rinses goo.)

The roadmap missions fold in too: inverse-dream/dream-statues → Dream Catch; the journeys
(scooter-roundup/bike-explorer/safety-lights/treasure-boat) → Town Ride. **11 of 14 missions** run on
hero games; frog-flight, asteroid-blaster, and bread-rush remain on the classic shared engines (no
clean hero fit). Every game is no-fail, near-text-free, and physical.

## Safety and design constraints

- No accounts, chat, ads, purchases, external links in child-facing UI, online multiplayer, analytics, leaderboards, or backend for MVP.
- No Paw Patrol names, logos, images, music, character likenesses, or fan art.
- Instructions are icon-first and optionally voiced later.
- Timing is generous. MVP has no hard fail timers.
- Controls must support keyboard, touch, and gamepad; every mission needs a one-handed path.
- UI must use large targets, clear contrast, and no flashing effects.

## Agent operating model

Agents own architecture and design defaults. Work proceeds through PRD sections, ADRs, Ultragoal phases, GitHub Issues, tracer-bullet slices, and TDD. Human review is expected for taste, child play-test observations, and unresolved asset/license choices.
