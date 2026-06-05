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

### Cycle 2 — Hero Game #1: Brick's Tower (physics stacker, proof-of-bar)
- New `systems/BrickTower.ts` (pure no-fail logic + scoring; 8 unit tests) + `data/brickTowerLevels.ts`
  + `scenes/BrickTowerScene.ts` (per-scene **Matter** physics — confirmed `this.matter` works
  without global config). Drop bricks → real weight → they fall, settle, freeze (setStatic on rest
  = the awake-body cap + the no-fail "tower only grows" guarantee). Win by reaching the ribbon OR by
  persistence (brick-count floor). Generated rounded-brick textures (no art dependency yet).
- Integration: reuses `missionId: 'house-builder'` so the town-map node, sticker, and registry carry
  over. Repointed `MISSION_SCENE_KEYS['house-builder']` → BrickTowerScene. **Carried the
  `hidden-light` secret** (Dad's words — the soul) into the new scene at the same (888,268) coords.
- E2E: deterministic `brick.drop` (no physics-settle wait) keeps the harness fast/non-flaky; updated
  browser-smoke, secret-discovery, screenshots specs + the SceneNavigation unit test.
- Renders clean (screenshot verified), zero console errors across the full e2e playthrough.
- Gates: GREEN — typecheck clean, **165/165** unit, build ok, **e2e 6/6**.
- Known validation gap: the *real* Matter drop path (spawnFallingBrick + settle detector) isn't
  exercised by e2e (e2e uses the deterministic path). Feel/physics validated by Willem's playtest;
  do a manual dev-server real-drop smoke in a later cycle. Old HouseBuilderScene now unreachable
  (kept in the scene list; retire in a cleanup cycle).

### Cycle 3 — Hero Game #2: Ember's Fire Brigade (Arcade water-arc firefighting)
- New `systems/FireBrigade.ts` (pure no-fail heat/douse/helper logic + scoring; 8 unit tests) +
  `data/fireBrigadeLevels.ts` (5 fires, total heat 19) + `scenes/EmberBrigadeScene.ts` (**Arcade**
  physics). Point anywhere → water LAUNCHES on a visible ballistic arc that lands where you touch
  (forgiving aim — teaches trajectory by sight, kills the old hidden cone). Fires shrink to steam as
  they cool; recoil + flashWhite + steam puffs; hit-stop + confetti on the all-clear. Lighter grade
  for arcade energy. No-fail: unlimited water, no player damage, and a timed firefly-helper cools the
  weakest fire if the child stalls (so it always converges).
- Integration: reuses `missionId: 'fire-fix'` + sticker 'fire-fix-starter'; repointed
  `MISSION_SCENE_KEYS['fire-fix']` → EmberBrigadeScene. **Carried the `secret-friend` secret** to the
  same (822,438) coords. Kept testIds `fire.spray` / `fire.back-to-map`.
- E2E: `fire.spray` press cools the weakest fire deterministically (no physics-timing flake); updated
  browser-smoke, secret-discovery, screenshots specs + the SceneNavigation unit test.
- Screenshot verified: Ember in firefighter gear with a hose, 5 legible campfires, visible water arc.
  Zero console errors across the full e2e playthrough.
- Gates: GREEN — typecheck clean, **173/173** unit, build ok, **e2e 6/6**.
- Old FireFixScene now unreachable (kept in scene list; retire in cleanup cycle).

### Cycle 4 — Hero Game #3: Rivet's Recycle Snake + first art harvest
- New `systems/RecycleSnake.ts` (pure no-fail Snake logic — grid move, wall-wrap, pick-up-to-grow,
  reverse-guard; 8 unit tests) + `data/recycleSnakeLevels.ts` (12×6 yard, 8 recyclables) +
  `scenes/RecycleSnakeScene.ts`. **Chase-the-pointer steering** (point where Rivet should drive —
  more intuitive for a 6-yo than swipes); cart grows a colour-coded tail of collected items; 4 bins
  + real item sprites. **No death**: walls wrap, self-overlap harmless — collecting is the only goal.
- Integration via **minimal churn**: the new scene KEEPS the Phaser key `RecyclingRunScene` + the
  `recycling.*` testIds, so there are
  zero changes to navigation, the SceneNavigation unit test, or the 3 e2e specs (browser-smoke,
  no-fail-exit, screenshots all still pass unedited). Old RecyclingRunScene dropped from the scene
  list (file kept; retire later). Deterministic E2E collect on the `recycling.choice.N` buttons.
- **Art harvest (Codex `image_gen`, codex/pro-assets):** wired the brighter daytime **build-lot.png**
  as `hl.bg.buildBright` → Brick's Tower (dropped its dark overlay 0.18→0.05). Screenshot-verified:
  Brick's Tower now reads as a sunny arcade toy. Codex also staged 8 more candidates (fire lot, brick
  sheet, water/fire FX) documented in `docs/design/herogame-art-manifest.md` — review + wire next
  cycle. (build-lot.png is 988KB — optimize later.)
- Gates: GREEN — typecheck clean, **181/181** unit, build ok, **e2e 6/6**. Snake screenshot verified.
