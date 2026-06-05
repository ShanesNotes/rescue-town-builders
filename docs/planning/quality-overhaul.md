# Rescue Town Builders — Quality Overhaul (the "go bigger" initiative)

> Durable charter + append-only ledger for the autonomous build loop Shane started
> 2026-06-05. Branch: `continuous-refinement`. Run slow-is-smooth; every cycle ends
> verified + committed. Shane is AFK and asked for 12h+ of self-paced work toward this /goal.

## The mandate (Shane's decisions, 2026-06-05)

The game is engineered well but the *games themselves* are weak: shallow "sorting"
activities, too much on-screen text for a pre-reader, and some (the fire game) are cheesy
with poor graphics. The bar to hit: **VTech/Paw-Patrol + top preschool apps, with
Tetris/Snake/physics-stacking legibility and satisfaction.** Do way better at every facet.

Forks Shane chose:
- **Energy:** dial up the arcade. Faster, punchier, scorier, bolder VFX/sound — a real
  departure from the old bedtime-calm. (Keep warmth, lose the sleepiness.)
- **Scope:** collapse the 14 missions into **~5 deep hero games**. Retire the shallow
  activities. Keep the frame: town map, profiles, stickers, secrets, parent settings.
- **Art:** **full send.** Spend the PixelLab gens (hard cap ~121 left, $0 cash) + Codex
  backdrops/props. New cohesive art, not just rendering. (Spend validated, not blind —
  PixelLab outputs 4-dir RPG sheets, a poor fit for RTB's side-view storybook look, so
  Codex image_gen carries the static art and PixelLab is used only where a walk-cycle helps.)

## North star

A wordless, no-fail **toy** where a 6-year-old picks up a real-feeling object, the world
physically responds (things land, settle, splash, stack with weight), and the town visibly
grows as the reward — never needing to read or be told what to do. Arcade-juicy, still safe.

## The 5 hero games (each reuses an RTB concept + character; each has a few levels)

1. **Brick's Tower** — physics block-stacker (Matter.js). Drop bricks; they fall & settle
   with weight; build tall & steady. No-fail: auto-glue snap, soft catchable collapse.
   *Replaces HouseBuilder. PROOF-OF-BAR — build first.* Star: Brick.
2. **Ember's Fire Brigade** — arcade water-arc firefighting (Arcade physics). Flick the
   hose; water arcs & splashes; fires spread & shrink visibly; recoil. Visible trajectory,
   never a hidden cone. *Replaces FireFix.* Star: Ember.
3. **Rivet's Recycle Snake** — Snake-like. Rivet's cart grows a tail of collected items;
   steer with momentum; deliver each to its matching bin. *Replaces RecyclingRun + the
   Match sorting games.* Star: Rivet.
4. **Cluckle's Dream Catch** — physics catcher. Dreams fall from the dreaming hen; move a
   basket to catch & sort them into bins. Folds the Match "dream/inverse" missions into one
   arcade catcher. Star: Cluckle.
5. **Town Ride / Journey** — momentum-piloted ride along a path: collect, dodge, deliver.
   Reimagines bike/scooter/journey as one arcade ride. (Lowest priority — weakest archetype,
   costliest honest redesign; do last once the bar is proven.)

Levels: the old per-mission variety (inverse, statues, bread, goo, frog, asteroid, bike,
scooter…) becomes **difficulty/levels & skins inside** the relevant hero game — content
deepened, not lost.

## Shared upgrades (kit-level, benefit every hero game)

- **Juice.ts:** `hitStop` + `flashWhite` added (Cycle 1). All effects `motionAllowed()`-gated.
- **Wordless teach layer:** demonstrative cold-open (helper performs the verb once) + looping
  ghost-hand on the live target + a 5s stuck-detector escalating pulse → ghost-hand → spoken
  nudge (verb last). One reusable system. Strip in-play text only *after* its visual
  replacement ships.
- **Physics spine (no-fail):** Matter ONLY in Brick's Tower; Arcade for spray/catch; enable
  sleeping + `setStatic(true)` on settled bodies; cap awake bodies; auto-snap/auto-glue
  forgiveness + soft-reset everywhere; never a real lose state.
- **Audio identity:** recorded theme audible from the title (bug fixed Cycle 1); crunchy
  impact SFX per hero game.

## Verify gates (run ALL before every commit)

`npm run typecheck` · `npm test` (vitest) · `npm run build` · `npm run test:e2e`
Baseline at overhaul start: 157 unit tests, e2e 6/6, zero console errors.

## Art budget & pipeline

PixelLab CLI: `/home/ark/tincture-of-mercy/tools/sprite pixellab <cmd>` (source
`.secrets/pixellab.env` first). **121 generations left, $0 cash = hard cap.** It emits
4-direction 64×96 RPG locomotion sheets — keep for optional walk-cycle life only, fed the
existing `public/assets/hearthlight/characters/*.png` as style refs. Codex `image_gen`
carries RTB's static storybook art (heroes side-view, backdrops, props, FX). Grok for copy.
Check `pixellab balance` before every paid batch; log spend here. Dry-run first, always.

## Risks (from the audit synthesis)

- Matter perf on tablets → sleeping + setStatic + Matter-in-one-game-only.
- Physics non-determinism vs no-fail → explicit forgiveness spine per game.
- Phaser 4.1 renderer rewrite → verify Matter/Arcade signatures vs 4.x; watch the E2EBridge
  (relies on instant tween locks; physics timing can desync it).
- Over-stimulation → every effect through Juice behind `motionAllowed()`; subtle flashes.
- **Willem's real-tablet play-test remains the true gate** (merge-to-main awaits it).

## Cycle ledger (append-only — newest at bottom)

### Cycle 1 — foundation: music bug + juice kit
- Music: `StartScene.begin()` defers the scene transition ~80ms so the gesture-initiated
  `play()` isn't orphaned mid-transition (root cause confirmed by audit, high confidence).
  Added a `begun` guard against a double-tap double-navigation.
- Juice.ts: added `hitStop` (freezes only `tweens.timeScale`, so the restore timer still
  fires) + `flashWhite` (Phaser-4 `setTint`+`setTintMode(FILL)`, restores prior tint/mode).
  Both reduced-motion-gated.
- Gates: GREEN — typecheck clean, 157/157 unit, build ok, e2e 6/6.
