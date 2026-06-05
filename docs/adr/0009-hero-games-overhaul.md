# ADR-0009 — Hero-Games Overhaul (collapse the missions into 5 deep arcade games)

Status: Accepted (2026-06-05, ratified by Claude under the non-HITL continuous-refinement charter;
creative direction set by Shane). Awaits the two human steps: merge to `main` + Willem's tablet playtest.

## Context
After the 11-wave polish marathon the game was accessible and shippable, but Shane judged the *games
themselves* weak: 14 missions on 3 reusable engines (Match/Aim/Journey) plus 3 bespoke scenes, several
of them shallow "drag the right icon onto the right box" sorting activities, too much on-screen text
for a pre-reader, and some (the fire game) cheesy with poor graphics. His brief: hit the bar of top
kids apps + arcade games (VTech/Paw-Patrol, Tetris/Snake/physics-stacking), make the games
self-explanatory (near-zero text), and **collapse the 14 missions into ~5 deep hero games**, dialing
up arcade energy while keeping the no-fail, gentle soul and the hidden Language-of-Creation secrets.

## Decision
Build **5 hero games** — real, physical, near-text-free, no-fail arcade games — and route the existing
missions into them, retiring the weak scenes:

| Hero game | Mechanic | Missions it serves |
|---|---|---|
| **Brick's Tower** | Matter.js physics block-stacker | house-builder |
| **Ember's water-arc spray** | Arcade ballistic-to-touch spray | fire-fix, goo-cleanup (water cleans goo) |
| **Rivet's Recycle Snake** | chase-the-pointer grid snake, no death | recycling-run, recycled-inventions |
| **Cluckle's Dream Catch** | Arcade basket catcher | inverse-dream, dream-statues |
| **Town Ride** | momentum lane-ride | scooter-roundup, bike-explorer, safety-lights, treasure-boat |

Each hero game plays **3 ramping rounds** (towers/waves/yards/rounds/legs) and resets **in place**
(never `scene.restart()`, per ADR-0007 / render-in-place). Key patterns:
- **Routing:** `MISSION_SCENE_KEYS[missionId]` overrides the generic archetype engine in
  `sceneKeyForMission` (bespoke wins over archetype). The town map already passes `{ missionId }` to
  every scene, so a hero scene reads `init({ missionId })` to serve several missions, picking its
  backdrop, target skin, off-route secret, and sticker from per-mission maps.
- **Scoring/stickers:** `getXResult(state, missionId)` is parameterized so each captured mission
  unlocks its own `${missionId}-starter` sticker; each mission keeps its town-map node + secret.
- **No-fail spine:** every game has a forgiveness floor (auto-glue/helper/wrap/collect-only) and can
  never reach a lose state; pure no-fail logic lives in unit-tested `systems/*` modules.
- **Physics:** **Matter only in Brick's Tower** (sleeping + `setStatic` on settle to cap awake bodies);
  **Arcade** for spray/catch; kinematics for the ride. (Per the audit, Matter is justified only where
  gravity *is* the tutorial.)
- **E2E timing rule:** `motionAllowed()` is TRUE in headless Playwright, so between-rounds/celebration
  timing is gated on `isEnabled` (E2EBridge `isE2EEnabled()`) and advances **synchronously** in E2E,
  with a deterministic completion button per scene — otherwise the celebration delay eats the
  deterministic press budget and times out.

## Alternatives considered
- **Polish all 14 in place** (keep mechanics, improve feel/art): lower risk but doesn't meet "go
  bigger" — the sorting mechanic itself was the problem.
- **Capture the last 3 too:** frog-flight, asteroid-blaster, bread-rush have **no clean hero fit**;
  forcing them would reproduce the awkwardness we removed. Left functional on the shared Match/Aim
  engines (still legible, still no-fail). May be retired or given their own treatment later.
- **New art set up front:** deferred — the existing Hearthlight pixel art is strong; the gap was
  mechanics/feel, not art (one bright Codex backdrop was wired into Brick's Tower; the rest skipped as
  not-clear-upgrades). Animated character art (PixelLab) remains optional.

## Consequences
- The 3 old bespoke verticals (RecyclingRun/HouseBuilder/FireFix scenes + systems + data + tests) were
  deleted; the Match/Aim/Journey engines remain only for the 3 leftover missions (Journey serves none
  now and is retireable).
- Gates held green every cycle: **169 unit tests, e2e 8/8, zero console errors.** New coverage: a
  real-Matter-physics smoke + a captured-missions in-browser proof.
- The hidden secrets (hidden-light, secret-friend, the dream/journey glimmers) were carried into the
  hero scenes intact — the Language-of-Creation soul survives the rebuild.
- Full per-cycle record: `docs/planning/quality-overhaul.md`. The two remaining steps are human:
  **merge `continuous-refinement` → `main`**, and **Willem's real-tablet playtest** (the true feel gate,
  especially the physics).
