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

### Cycle 5 — Hero Game #4: Cluckle's Dream Catch + art review
- New `systems/DreamCatch.ts` (pure no-fail catch/miss/scoring; 6 unit tests) +
  `data/dreamCatchLevels.ts` (catch 8 dreams) + `scenes/DreamCatchScene.ts` (**Arcade** physics).
  The dreaming hen drops sun (day) + moon (night) dream-orbs; a pointer-follow basket catches them and
  each sorts into its day/night bin (a soft echo of Inverse Dream's opposites). A missed dream just
  drifts off and another falls — only catching counts (no-fail).
- Integration: reuses `missionId: 'inverse-dream'` + sticker 'inverse-dream-starter'. **Restructured
  `sceneKeyForMission`** so a bespoke `MISSION_SCENE_KEYS` override wins over the generic archetype
  engine — `inverse-dream` → DreamCatchScene while its match siblings stay on MatchMissionScene.
  Updated the SceneNavigation unit test + the screenshots e2e (inverse-dream now plays Dream Catch via
  a deterministic `dream.catch`). No secret to carry (Match scenes host none).
- **Art review:** viewed all 9 Codex candidates. Wired only build-lot (Cycle 4). **Skipped the rest**
  (fire-picnic-lot = flat downgrade w/ floating boxes; smiley fire-frames risk the *cheesy* critique
  Shane flagged; brick-sheet/water FX only marginal vs generated). Quality-first: better future art
  wants a more careful pass or PixelLab characters, not flat drop-ins. Manifest kept for reference.
- Screenshot verified (Cluckle dreaming, basket, sun/moon bins — on-theme + magical).
- Gates: GREEN — typecheck clean, **187/187** unit, build ok, **e2e 6/6**.

### Cycle 6 — Hero Game #5: Town Ride 🎉 (all 5 hero games complete)
- New `systems/TownRide.ts` (pure no-fail round-up/bump/scoring; 6 unit tests) +
  `data/townRideLevels.ts` (round up 5 friends) + `scenes/TownRideScene.ts` (kinematics — objects
  scroll left, Scoot follows the steered lane). Steer up/down to scoop runaway friends (they ride a
  trailing train) and bump past cones — a **bump only slows Scoot for a beat, never a fail**. Scrolling
  dashed lane sells the speed; pen slides in on the win.
- Integration: reuses `missionId: 'scooter-roundup'` + sticker. Reroute via the `MISSION_SCENE_KEYS`
  override (bespoke-over-archetype). **Carried the `meadow-nest` secret** (the off-route wanderer's
  glimmer) to its (110,180) coords. Updated SceneNavigation unit test + the screenshots e2e
  (deterministic `ride.catch`).
- Gates: GREEN — typecheck clean, **193/193** unit, build ok, **e2e 6/6**. Screenshot verified.
- **MILESTONE: all 5 hero games shipped** — Brick's Tower, Ember's Fire Brigade, Rivet's Recycle Snake,
  Cluckle's Dream Catch, Town Ride. The "collapse 14 → ~5 deep arcade games" mandate is met.
- Next: a POLISH/CLEANUP cycle — retire the now-unreachable old scenes (RecyclingRunScene,
  HouseBuilderScene, FireFixScene, + MatchMissionScene only for inverse-dream), optimize the 988KB
  build-lot.png, a real-physics dev-server smoke of Brick's Tower, cohesion fixes.

### Cycle 7 — Polish & cleanup
- **Retired 3 dead verticals** (replaced by hero games): deleted RecyclingRunScene/HouseBuilderScene/
  FireFixScene + their systems (RecyclingRun/HouseBuilder/FireFix) + data (recyclingItems/
  houseBlueprints/picnicFires) + unit tests = **12 files**. Each was referenced only within its own
  vertical (grep-verified). Cleaned GameConfig imports + scene list. KEPT Match/Aim/Journey engines
  (still serve dream-statues, recycled-inventions, bread-rush, goo-cleanup, the other journeys, etc.).
  193 → 169 unit tests (removed tests covered removed code); bundle a touch smaller.
- **Real Matter physics smoke**: added a non-gating `brick.drop.real` E2E hook + `tests/e2e/
  physics-smoke.spec.ts` that spawns 5 REAL falling Matter bricks and asserts the spawn/settle/freeze
  path raises ZERO runtime errors (no flaky settle assertions). Closes the one path e2e never covered.
  Screenshot `brick-real-physics.png` shows a real settled brick stack — physics confirmed working.
- **Image opt: SKIPPED** — no pngquant/optipng/sharp/convert available; declined to add a heavy build
  dep for one asset. TODO: compress build-lot.png (988KB → <300KB) when a tool is on hand.
- Cohesion: per-hero pip accent colours are intentional (each hero's theme) — left as-is.
- Gates: GREEN — typecheck clean, **169/169** unit, build ok, **e2e 7/7**.

### Cycle 8 — Depth: Brick's Tower multi-round (3 progressive towers)
- `data/brickTowerLevels.ts` is now **3 levels** (ribbon climbs 252 → 220 → 190; constant 6-brick
  floor + brick size so pips/textures don't rebuild). The scene plays through all three towers, then
  caps with the roof + completes — depth without ever a fail.
- Scene: tracks `allBricks` (to clear a finished tower), `roundIndex`, and 3 **round dots** (top-right)
  showing towers-to-go. `roundComplete()` freezes + clears the tower and raises the ribbon **in place**
  (no `scene.restart` — per the render-in-place rule); `finalWin()` caps + completes.
- **Lesson (important for the other hero games' multi-round work):** `motionAllowed()` is TRUE in
  headless Playwright (no reduced-motion), so a celebration *delay* gated on it ate the deterministic
  e2e's press budget (dozens of no-op presses during the 620ms pause → timeout). Fix: gate
  between-rounds timing on **`isE2EEnabled()`** and advance rounds **synchronously** in E2E. Apply the
  same pattern when adding rounds to Ember/Snake/Catch/Ride.
- Gates: GREEN — typecheck clean, **169/169** unit, build ok, **e2e 7/7**. Round dots screenshot-verified.

### Cycle 9 — Depth: Ember's Fire Brigade multi-wave (3 waves)
- `data/fireBrigadeLevels.ts` → `fireBrigadeWaves`: 3 waves at the same 5 spots, hotter each time
  (heat 2 → 3 → 4, total 45). The scene re-lights the next wave **in place** (no scene.restart);
  added wave round-dots + a reusable `flicker()` helper. Fixed `renderFire` to reset the flame
  texture on re-light (a re-lit fire was showing the doused-embers texture).
- Applied the **Cycle-8 pattern**: `waveComplete()` advances synchronously under `isE2EEnabled()`
  (else a celebration delay eats the deterministic spray budget); bumped the e2e fire loops 40 → 70
  (browser-smoke + screenshots) since 3 waves total 45 deterministic presses.
- Gates: GREEN — typecheck clean, **169/169** unit, build ok, **e2e 7/7**.

### Cycle 10 — Depth: Dream Catch (3 rounds) + Town Ride (3 legs)
- **Dream Catch:** `dreamCatchLevels` (3 rounds, goal 5→6→7) + `dreamFallSpeeds` (42→62→84). Dreams
  fall faster + there are more to catch each round; pips rebuilt per round (goal grows), round dots,
  reset-in-place. E2E total 18 `dream.catch` presses (< the 30 loop).
- **Town Ride:** `townRideLevels` (3 legs, 4→5→6 friends) + `townRideSpeeds` (1→1.22→1.46 scroll
  multiplier). Each leg rolls faster and wants more friends; movers + trail cleared and pips rebuilt
  per leg, round dots, reset-in-place. E2E total 15 `ride.catch` presses (< 30).
- Both reuse the **Cycle-8 pattern** (`roundComplete()`/`legComplete()` advances synchronously under
  `isE2EEnabled()`; `finalWin()` completes). **4 of 5 hero games now have multi-round depth**
  (Recycle Snake remains).
- Gates: GREEN — typecheck clean, **169/169** unit, build ok, **e2e 7/7**.

### Cycle 11 — Depth: Recycle Snake (3 yards) — ALL 5 HERO GAMES NOW HAVE DEPTH 🎉
- `recycleSnakeLevels` (3 yards on the same 12×6 grid so the grid consts stay valid; 6 → 7 → 8 items).
  The scene lays out each yard in place (clears item sprites + tail, resets the cart to start, rebuilds
  pips), round dots, `yardComplete()` advances synchronously under `isE2EEnabled()`, `finalWin()`
  completes. E2E total 21 `recycling.choice.N` collects (< the 40 loop).
- **Milestone: every hero game now plays 3 ramping rounds** — Brick's Tower (3 towers), Ember (3 waves),
  Dream Catch (3 rounds), Town Ride (3 legs), Recycle Snake (3 yards). Real session length + difficulty
  curve, still no-fail.
- Gates: GREEN — typecheck clean, **169/169** unit, build ok, **e2e 7/7**.
- Next: capture the leftover old-engine roadmap missions (dream-statues, recycled-inventions, bread-rush,
  goo-cleanup, bike-explorer, safety-lights, treasure-boat) into the hero games — needs the bespoke
  scenes to read their launching `missionId` (check how TownMapScene starts a mission; MatchMissionScene
  uses `init({missionId})`) so one scene can serve several missions as themed rounds/skins.

### Cycle 12 — Consolidation: capture dream-statues + recycled-inventions into hero games
- **Launch mechanics confirmed:** `TownMapScene` always passes `{ missionId }` to the scene it starts
  (line 352), so a bespoke hero scene only needs `init(data)` to know which mission launched it.
- **Captured `dream-statues` → DreamCatchScene** and **`recycled-inventions` → RecycleSnakeScene** via
  `MISSION_SCENE_KEYS` overrides. Each scene now reads `init({missionId})` and picks its backdrop
  (per-mission map) + sticker accordingly; `getDreamCatchResult`/`getRecycleSnakeResult` are
  parameterized by missionId (default keeps the original), so each captured mission unlocks its own
  `<missionId>-starter` sticker. Match scenes host no secrets (nothing to carry).
- Updated the SceneNavigation unit test. No e2e spec changes needed (those two weren't e2e-played; the
  hearthlight-assets e2e already proves both new backdrops load). Hero games now serve **8 of 13
  missions**. Still on the shared engines: bread-rush (Match); frog-flight/goo-cleanup/asteroid-blaster
  (Aim); bike-explorer/safety-lights/treasure-boat (Journey) — capture next.
- Gates: GREEN — typecheck clean, **169/169** unit, build ok, **e2e 7/7**.

### Cycle 13 — Consolidation: capture the 3 Journey missions into Town Ride
- **Captured `bike-explorer`, `safety-lights`, `treasure-boat` → TownRideScene** (all path journeys —
  perfect fit) via `MISSION_SCENE_KEYS` overrides. The scene now reads `init({missionId})` and picks
  per-mission backdrop + **the right off-route secret** (carried from JOURNEY_SECRETS:
  garden-cat / lamplighter / message-bottle) + sticker; `getTownRideResult` parameterized by missionId.
- Updated the SceneNavigation unit test. No e2e changes (none e2e-played; hearthlight-assets proves the
  backdrops load). **Hero games now serve 10 of 14 missions.** Shared engines now serve only 4:
  frog-flight / goo-cleanup / asteroid-blaster (Aim) + bread-rush (Match).
- Gates: GREEN — typecheck clean, **169/169** unit, build ok, **e2e 7/7**.

### Cycle 14 — Verify the consolidation in-browser
- New `tests/e2e/captured-missions.spec.ts`: pages the town-map roadmap (robust page-find: rewind to
  page 0, advance until the node is visible) to the not-yet-played captured missions and proves each
  **launches the right hero scene, completes via its deterministic button, and unlocks its OWN sticker**
  — dream-statues → DreamCatchScene (`dream-statues-starter`), recycled-inventions → RecyclingRunScene
  (`recycled-inventions-starter`), bike-explorer → TownRideScene (`bike-explorer-starter`, the journey
  that carries the garden-cat secret). Asserts zero console errors. This de-risks the whole
  consolidation (inverse-dream + scooter-roundup were already covered by screenshots.spec).
- Gotcha: the project typecheck uses a Playwright type shim without `.toContain` — used
  `(arr.includes(x)).toBe(true)` instead.
- **e2e now 8/8.** goo-cleanup → Ember deferred to next cycle (it's e2e-played + needs a target-skin
  param, so it warrants its own focused cycle).
- Gates: GREEN — typecheck clean, **169/169** unit, build ok, **e2e 8/8**.

### Cycle 15 — Consolidation: capture goo-cleanup into Ember (water cleans goo)
- Parameterized EmberBrigadeScene by missionId (`init({missionId})`) with a per-mission **target skin**
  (fire-fix → campfire/embers + smoke; goo-cleanup → `hl.prop.gooBlobLarge` → `hl.prop.cleanPatch`,
  no tint, no smoke), per-mission backdrop, and a per-mission secret map (fire-fix → secret-friend;
  goo-cleanup → none). Same douse mechanic + 3 waves. `getFireBrigadeResult` parameterized by missionId.
- Rerouted `MISSION_SCENE_KEYS['goo-cleanup']` → emberBrigade; updated the SceneNavigation unit test +
  the screenshots e2e (goo-cleanup now plays EmberBrigadeScene via `fire.spray`, loop 70 for 3 waves).
- **Screenshot-verified: it renders great** — Ember rinsing five smiley goo-blobs across the goo town
  square. Natural fit, not forced.
- **Hero games now serve 11 of 14 missions.** Left on shared engines (no clean hero fit): frog-flight,
  asteroid-blaster (Aim) + bread-rush (Match) — they still work; not worth forcing.
- Gates: GREEN — typecheck clean, **169/169** unit, build ok, **e2e 8/8**.
