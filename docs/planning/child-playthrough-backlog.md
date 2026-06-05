# Child-playthrough backlog — "experience it as a 5-year-old, first time"

> **Generated:** 2026-06-04 by the refinement-marathon orchestration (see
> [refinement-marathon.md](./refinement-marathon.md)). Two independent passes that strongly agree:
> a 14-agent Workflow (6 engineer subsystem maps → 6-persona playtest [five "Willem, age 5" lenses +
> a senior-designer lens] → Playwright ground truth → synthesis) **and** a separate Codex xhigh
> read-only audit. This is the durable worklist the marathon `/loop` drives to zero.

## Ground truth at start (all green)

`tsc --noEmit` clean · **114** unit tests pass (25 files) · `vite build` OK (1484 kB) · Playwright
e2e **6/6** pass · **zero console errors / zero 404s** across a full 14-mission playthrough · 20
screenshots captured. The game is *functionally complete and bug-tested* — this backlog is about the
gap from "complete" to **unbelievable & professional** for the actual non-reading 5-year-old.

## The six dominant themes

1. **Input-safety holes in the No-Fail spine** — unguarded house `pointerup` double-fire; `bindPress`
   never disarming on `pointerout`; modal/gate keyboard+gamepad parity. *(the only true P0s)*
2. **Silent + text-only first impression** — ships at `musicVolume:0`; active play uses sentences a
   non-reader can't read; authored `introPanels` are never rendered.
3. **Reward loop severed at three seams** — finishing dumps the child on map page 0 (can't see their
   star); no path from celebration to the new sticker; multi-tap secrets reset every scene reload
   (2 of 3 effectively unreachable).
4. **Scoring inverted vs No-Fail** — the hardest-to-read missions (inverse-dream Match, Journeys)
   punish a struggling non-reader with 1 star; Match/Journey have no auto-assist floor.
5. **Shared engines feel same-y** — no shuffle (leftmost always correct), identical houses ×3,
   thin Match payoff, no per-mission flourish — a 20-min session loses novelty.
6. **Polish debt** — hard white-cut transitions + per-keypress `scene.restart` strobe; off-brand
   Arial in the two most emotional modals; sticker==secret chime; thin fanfare.

## Legend

`[ ]` open · `[x]` done · severity **P0** broken/unsafe · **P1** confusing-for-non-reader ·
**P2** polish/juice · **P3** missing-delight · **P4** wow-stretch · effort **S/M/L**.

---

## Wave plan (the `/loop` walks these in order)

- **Wave 1 — Touch-critical safety** ✅ DONE: P0-01, P0-02, P1-01.
- **Wave 2 — Input parity & safety** (shared child-safe modal/focus controller) ✅ DONE: P0-03, P0-04, P1-11, P2-05, P2-06, P2-09.
- **Wave 3 — Non-reader onboarding** ✅ DONE: P1-03, P1-02, P1-06, P2-04, P3-02, P3-09.
- **Wave 4 — No-Fail floors & Aim clarity** ✅ DONE: P1-09, P1-12, P3-05, P3-04, P1-08.
- **Wave 5 — Reward loop**: P2-01, P2-02, P1-10, P1-07, P2-08, P3-08.
- **Wave 6 — Variety & payoffs** (Codex art lane): P1-05, P1-04, P2-10, P3-07, P3-06, P3-03.
- **Wave 7 — Polish & transitions**: P2-03, P2-07, P3-01, + review follow-ups P2-11, P3-10, P3-11.
- **Wave 8+ — Wow factor** (Codex art + Grok copy): P4-01 living diorama, P4-02 spoken VO, P4-03 aim direct-touch.

---

## P0 — broken / unsafe

- [x] **P0-01 (S)** Town node fired `startMission` twice + launched on stray drag (unguarded house `pointerup`). → *Removed the house's interactivity; the pulsing coin is the sole launch target.* `TownMapScene.ts`
- [x] **P0-02 (S)** `bindPress` never disarmed on `pointerout`/`pointercancel` — stale ghost tap on touch. → *Added `disarm` on both.* `ui/Button.ts`
- [x] **P0-03 (M)** `confirmMissionExit` modal is pointer-only → keyboard/gamepad child who presses Back mid-mission can **soft-lock**. *Fix:* shared modal owns focus — Left/Right select, Enter/A activate, Escape/B default to keep-playing, visible pulsing focus ring. `confirmMissionExit.ts` + the 6 mission scenes.
- [x] **P0-04 (M)** Parent gate bypassable by gamepad (confirm starts the hold with no button-up cancel). *Fix:* real hold controller for pointer+keyboard+gamepad down/up; second hold-to-reset inside settings. `ParentSettingsGateScene.ts`, `ParentSettingsScene.ts`, `bindIntents.ts`.

## P1 — confusing for a non-reader

- [x] **P1-01 (S)** Game shipped SILENT (`musicVolume:0`). → *Default `0.35`; world alive from first launch.* `SaveSystem.ts`
- [x] **P1-02 (M)** Profile first-run: 3 hero sprites look tappable but are dead; only abstract `+` works. *Fix:* make Rivet/Brick/Ember the create buttons (tap → profile with that avatar + chime + hop), soft idle glow; `+` only for slots 2–5. `ProfileScene.ts`
- [x] **P1-03 (M)** Authored `introPanels` never rendered — missions drop a non-reader into a busy screen cold. *Fix:* 1.5–2s intro beat per mission (icon + hero pointing, pulse the first control), consuming `introPanels`. All 6 mission scenes + `missions.ts`.
- [ ] **P1-04 (M)** Recycling 'helper' mode builds the IDENTICAL invention twice (only bubble-sprinkler is helper-eligible). *Fix:* ≥2 distinct helper-eligible blueprints. `RecyclingRun.ts`, `recyclingItems.ts`
- [ ] **P1-05 (S)** Recycling correct card is ALWAYS leftmost — 'tap left' bypasses the mechanic. *Fix:* Fisher-Yates shuffle the 3 choices, seeded by blueprint+slot. `RecyclingRun.ts`, `RecyclingRunScene.ts`
- [x] **P1-06 (S)** House Builder: tray pieces never highlight — only a faint sky-slot ghost shows what's next. *Fix:* highlight the required TRAY item (gold stroke + pulse + bobbing arrow), dim others. `HouseBuilderScene.ts`
- [ ] **P1-07 (M)** Multi-tap secrets reset their counter every scene reload — 2 of 3 secrets unreachable. *Fix:* persist per-secret touch counts to SaveSystem keyed by profile+secretId. `secretHotspot.ts`, `Secrets.ts`, `SaveSystem.ts`
- [x] **P1-08 (S)** Star scoring inverted: hardest-to-read missions punish a struggling child with 1 star. *Fix:* floor completed Match/Journey at 2 stars; reserve 3 for a gentle bonus. `MatchEngine.ts`, `StarScoring.ts`
- [x] **P1-09 (M)** Match (4) + Journey (4) have NO assist floor — a stuck child can tap wrong forever. *Fix:* per-prompt miss counter; escalate telegraph, then helper hops over and places the answer. `MatchEngine.ts`, `MatchMissionScene.ts`, `JourneyMissionScene.ts`
- [ ] **P1-10 (S)** Locked sticker cells show a hand cursor + fire on tap but do nothing — dead taps across the album. *Fix:* gentle 'not yet' wiggle + muted tick; drop `useHandCursor` when locked. `StickerBookScene.ts`
- [x] **P1-11 (S)** 'Start fresh' wipes ALL saves instantly, no confirm — catastrophic footgun. *Fix:* gate behind the existing 3-second hold-ring / two-step confirm. `ParentSettingsScene.ts`
- [x] **P1-12 (M)** Aim dead-zone: after the 1–2 reachable targets, the big pulsing Act button gives SILENT misses for ~3 taps before help. *Fix:* never-silent miss (whiff SFX + puff + nudge arrow); lower `assistFloorAt`≈3, drop `remaining>=5` gate; auto-pan hero toward nearest live target. `AimEngine.ts`, `AimMissionScene.ts`

## P2 — polish / juice

- [ ] **P2-01 (S)** Returning from a finished mission resets to page 0 — child can't see the star they earned. *Fix:* thread completed mission's page+index through `returnToTownMap`. `SceneNavigation.ts`, `MissionCompleteScene.ts`, `TownMapScene.ts`
- [ ] **P2-02 (S)** No path from celebration to the just-earned sticker. *Fix:* make the popped sticker interactive → open its reading page (pass `readingId`). `MissionCompleteScene.ts`, `StickerBookScene.ts`
- [ ] **P2-03 (M)** Instant hard-cut to white between every scene (no fade-out). *Fix:* `fadeOutAndStart` (~140–160ms), warm cream not pure white, gated on `motionAllowed`. `SceneTransitions.ts`, `SceneNavigation.ts`
- [x] **P2-04 (S)** Match wrong-tap gives a non-reader nothing actionable (springHome HOME→HOME, no panel reaction). *Fix:* shake/dim wrong panel + pulse correct target bigger; read the engine's dead `lastHint`. `MatchMissionScene.ts`
- [x] **P2-05 (S)** Journey: tapping a passed stop plays the wrong-answer bonk; keyboard confirm auto-skips the whole mission. *Fix:* `disableInteractive` visited waypoints; bind `onMove` to a highlighted waypoint cursor, confirm visits the highlighted one. `JourneyMissionScene.ts`
- [x] **P2-06 (S)** Profile keyboard nav can land on Settings/Back with zero highlight → opens parent gate by accident. *Fix:* exclude corner utilities from the navigable array (or bind their pulse). `ProfileScene.ts`
- [ ] **P2-07 (M)** TownMap/Profile keyboard+page nav uses `scene.restart()` per arrow press → white-fade strobe + teardown cost. *Fix:* re-render selection highlight in-place; restart only on real page change. `TownMapScene.ts`, `ProfileScene.ts`
- [ ] **P2-08 (S)** Pre-threshold secret taps give ZERO feedback — child thinks the spot is dead. *Fix:* ascending tick + inner-glow pulse per tap so each visibly 'charges'. `secretHotspot.ts`
- [x] **P2-09 (S)** Mission-exit modal is text-only + warns about losing a 'sticker' — unreadable anxiety. *Fix:* picture-first choices (green ▶ keep coin + hero face; map icon to leave); soften subtitle; `FONTS.display`. `confirmMissionExit.ts`
- [ ] **P2-10 (S)** Bread Rush trains tap-position memory, not the recipe (fixed positions + identical icons). *Fix:* keep recipe ORDER but shuffle TARGET positions; add a filling-bowl→loaf payoff. `matchMissions.ts`, `MatchMissionScene.ts`

## P3 — missing delight

- [ ] **P3-01 (S→M)** Fanfare is thin and the sticker cue == secret chime. *Fix:* richer celebratory fanfare (chord pad + sparkle + a ringing note as long as the confetti) + a dedicated warm 'sticker' cue; reserve the shimmer for true secret discoveries. *(audio — Claude lane)*
- [x] **P3-02 (S)** Secret reveal + exit modal render in Arial, not the pixel storybook font. *Fix:* `FONTS.display`/`FONTS.label`. `secretHotspot.ts`, `confirmMissionExit.ts` — *(exit modal ✅ Wave 2; secret reveal ✅ Wave 3)*
- [ ] **P3-03 (M)** House Builder + Match variants feel identical (no title shown, same orderedParts). *Fix:* 1.5s title card + preview silhouette + distinct accent color per house; fold Match into the P1-03 intro. `HouseBuilderScene.ts`, `houseBlueprints.ts`
- [x] **P3-04 (M)** Aim/Fire assist is an invisible teal dot flying the wrong way — a No-Fail mercy reads as nothing. *Fix:* real helper sprite flies TO the assisted target, sprays it, waves, warm chime. `AimMissionScene.ts`, `FireFixScene.ts`
- [x] **P3-05 (M)** No visible aim indicator (beam alpha 0.16) — child mashes Act blind. *Fix:* bold opaque directional cone + pulsing ring on in-cone targets + ground arrow. `AimMissionScene.ts`
- [ ] **P3-06 (M)** Journey final-waypoint arrival has no climax; per-stop story beats absent. *Fix:* branch `travelTo` on final waypoint (bigger burst, chest-opens squash, hero hop, rising chime); render destination larger from the start. `JourneyMissionScene.ts`, `journeyMissions.ts`
- [ ] **P3-07 (L)** Match correct-match payoff is thin (same tiny pop ×5). *Fix:* 'lands and transforms' on the target — plinth lights + statue pops with a cluck, gadget slot fills + whirrs, bread bowl rises. `MatchMissionScene.ts`, `matchMissions.ts`
- [ ] **P3-08 (M)** Journey missions (4 of 14) have zero hidden secrets. *Fix:* seed one off-route glimmer per Journey backdrop (depends on P1-07/P2-08). `JourneyMissionScene.ts`, `Secrets.ts`
- [x] **P3-09 (S)** Preload advances on a blind 250ms timer that can race FontFace load → title flashes fallback font. *Fix:* `await document.fonts.ready` (min splash); optional firefly/lamp fade-up. `PreloadScene.ts`, `main.ts`

## P4 — wow-factor (the big swings toward "unbelievable")

- [ ] **P4-01 (L)** **Living diorama:** each completed mission permanently adds a lit window / strolling rescued character / chimney smoke / planted tree / lamp, so the child literally SEES the town they healed grow from dark to warm-and-bustling. *The single biggest swing.* `TownMapScene.ts`, `TownMapProgress.ts`, Codex art.
- [ ] **P4-02 (L)** **Light spoken VO** for ~10 highest-value moments (pick a helper, well done, keep playing, found a secret, here's your sticker) so a non-reader plays fully solo. TTS stubs behind a parent toggle are fine to start. New `VoiceSystem` + Grok script copy.
- [ ] **P4-03 (M)** **Aim direct-touch No-Fail layer:** tap the target to auto-walk the hero + spray it — collapses the most confusing loop into the one gesture every other mission uses. `AimMissionScene.ts`, `AimEngine.ts`

## Wave-execution follow-ups (captured during the marathon)

Small, non-blocking items surfaced by adversarial review of shipped waves — slotted into Wave 7.

- [ ] **P2-11 (S)** Fire Fix still has the silent-dead-zone assist shape (`sprays>=5 && remaining>=5`) that P1-12 removed from Aim. Bring `FireFix.maybeAssist` + the scene's miss feedback in line with the Aim fix. `FireFix.ts`, `FireFixScene.ts` *(Wave 4 review)*
- [ ] **P3-10 (S)** Journey auto-resolve lacks the `busy` input-lock Match got — a fast tapper can skip an auto-resolve animation (not a No-Fail issue). Mirror Match's lock. `JourneyMissionScene.ts` *(Wave 4 review)*
- [ ] **P3-11 (S)** Aim cone visual hardcodes `CONE_RANGE=190` instead of reading `state.config.range`; safe today, would diverge if a mission overrides range. Derive from config. `AimMissionScene.ts` *(Wave 4 review)*

## Codex independent audit — corroboration

Codex (xhigh, read-only) independently flagged the same top issues and added the two input-parity P0s
(keyboard/gamepad exit soft-lock; gamepad parent-gate bypass). Its single recommended first move:
*"Build one shared child-safe modal/focus controller and use it for `confirmMissionExit`,
`ParentSettingsGateScene`, and reset confirmation"* — adopted as the spine of **Wave 2**. Full audit
preserved at `/tmp/codex-audit-last.md` (session-local).
