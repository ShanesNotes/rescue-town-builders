# Epic H — roadmap build blueprint (the reusable-engine plan)

> Goal: build all 11 PRD roadmap missions (authorized 2026-06-04) without 11 bespoke codebases.
> The PRD itself says "build a reusable mission framework." We already have three proven, immutable
> mission *systems* (RecyclingRun, HouseBuilder, FireFix) with render-in-place scenes. Generalize
> them into **3 reusable engines**; then each new mission is **data + art**, not new mechanics.

## The 3 engines (generalize what we have)

1. **MatchEngine** ← generalize `RecyclingRun`. Core loop: a prompt object + a set of target
   options; drag/tap the *correct* target; correct → fly-in + juice + advance; wrong → spring back
   + gentle telegraph (No-Fail). Data: `rounds: { prompt, options[], correctId }[]`.
2. **AimEngine** ← generalize `FireFix`. Core loop: move a hero (tween, render-in-place) + aim +
   act on real-time targets that diminish; No-Fail helper-drone floor. Data: `targets`, `tool`,
   movement bounds.
3. **JourneyEngine** ← new, simplest. Tap the next glowing waypoint; the hero travels there
   (tween); reaching the last completes. No-Fail (always reachable). Data: `waypoints[]`.

Each engine: pure state module (`systems/<Engine>.ts`, unit-tested) + one render-in-place scene
(`scenes/<Engine>Scene.ts`) driven by a mission's data + art keys. Reuse `Juice`, `bindIntents`,
the pointerup `Button`, icon-coin controls, the `confirmMissionExit` guard, and the
`completeMission → MissionComplete` flow. Every engine guarantees completion (No-Fail).

## Mission → engine map (all 11)

| # | Mission | Helper | Engine | Content (data) |
|---|---------|--------|--------|----------------|
| H1 | Frog Flight | Wings | Aim | fly through rings, rescue the frog target |
| H2 | Scooter Roundup | Scoot | Journey | herd wanderers to the pen (waypoints) |
| H3 | Safety Lights | Dash | Journey+timing | reach posts when the light is green |
| H4 | Recycled Inventions | Reed | Match | match scrap parts → the gadget slots |
| H5 | Bike Explorer | Milo | Journey | visit the neighbourhood landmarks |
| H6 | Goo Cleanup | Mayor Grumble | Aim | spray/clean goo puddles (FireFix-like) |
| H7 | Dream Statues | Mayor Merry | Match | place each statue on its matching plinth |
| H8 | Inverse Dream | Cluckle | Match | match each thing to its **opposite** |
| H9 | Treasure Boat | Captain Coral | Journey | sail to buoys, open the treasure (Match at each) |
| H10 | Bread Rush | Baker Benny | Match | add ingredients in the recipe order |
| H11 | Asteroid Blaster | Nova Noodle | Aim | aim foam stars at drifting asteroids |

So: **Match ×5, Aim ×3, Journey ×3**. Build 3 engines, get 11 missions.

## Town map at scale (14 missions)
Convert `TownMapScene` to a **paged hub**: 3 home-nodes per page (reuse the lamp-lit near-path
3-platform layout), prev/next icon-coins + page-dots. Page 1 = the core three; pages 2–5 = roadmap.
Light-from-darkness + the per-mission lit/dark house carry over unchanged. (Build this WITH the
missions so multi-page is verified against real data.)

## Build order (each slice ends green + pushed)
1. **MatchEngine** (extract from RecyclingRun) + first data mission **H8 Inverse Dream** (Cluckle
   art already exists) → proves the engine end-to-end.
2. Paged TownMap (now 4 missions to page).
3. Remaining Match missions (H4, H7, H10) as data + art.
4. **AimEngine** (extract from FireFix) + H6 Goo Cleanup → then H1, H11.
5. **JourneyEngine** + H2 → then H3, H5, H9.
6. Per-mission stickers, lore intros (Grok), juice, No-Fail tests.
7. PixelLab living characters (Epic B) across heroes once missions are in.

## Gating
Each mission needs its hero portrait + backdrop + props (Codex render wave in flight) + Grok lore
(done: roadmap-characters.md, art-prompts.md). Wire art keys as Codex delivers; engines + town map
are buildable in parallel. No-Fail + IP-safe + pre-reader hold for every new mission.
