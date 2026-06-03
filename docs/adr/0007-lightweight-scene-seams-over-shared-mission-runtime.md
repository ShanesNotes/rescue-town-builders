# ADR-0007: Lightweight scene seams over a shared mission runtime

Status: Accepted

Decided 2026-06-03 by an automated Claude↔Codex grill (non-HITL). Both models
independently audited the codebase; this records the consensus they reached.

## Context

The continuous-refinement Cycle 1 audits found the scene layer out of balance: the
ten Phaser scenes copy-paste the same keyboard+gamepad `on()` binding blocks and
lean on `this.scene.restart()` as a render loop, with no shared abstraction. Two
independent reviews disagreed on the fix:

- **Codex** recommended building a **shared mission runtime boundary now** — a base
  class/adapter owning input binding, teardown, pause/resume, completion, checkpoint
  policy, and result validation — citing (among other things) event-listener cleanup
  leaks on scene restart.
- **The Claude review** refuted the leak: all ten scenes bind through the *per-scene*
  `this.input.keyboard` / `this.input.gamepad` plugins, and Phaser shuts those plugins
  down on scene shutdown (which `restart()` triggers), so listeners do not accumulate.
  It recommended a **lightweight `bindIntents` input seam** and deferring the runtime.

The grill resolved the factual dispute: Codex **conceded the leak point** with source
evidence — Phaser 4.1.0 `restart()` queues `stop`→shutdown, and
`InputPlugin`/`KeyboardPlugin`/`GamepadPlugin` remove their listeners on shutdown
(`node_modules/phaser/src/.../InputPlugin.js`, `KeyboardPlugin.js`, `GamepadPlugin.js`).
With no leak, the runtime's strongest justification fell away. The one genuine
child-safety gap that remained — **Back/Exit silently discarding mid-mission progress**
(persistence happens only in `MissionCompleteScene`) — does not require a full runtime;
it needs a shared exit-confirm guard.

## Decision

Keep **independent Phaser mission scenes** over pure mission-state modules. Add two
**narrow seams** now, and **defer** the heavyweight runtime:

1. **`bindIntents(scene, (intent) => void)`** beside `InputIntent` — registers the
   keyboard+gamepad listeners once and routes decoded intents to one callback per
   scene. This kills the ten-fold duplication and is the single home for future
   analog-stick axis decoding and for resolving the dead `hint` intent.
2. **`confirmMissionExit(scene, onExit)`** — a shared guard the three mission scenes
   route their touch Back buttons and `back` intents through; it defaults to "keep
   playing" and only returns to the Town Map on explicit confirmation. This makes
   "a child's in-progress mission is never silently discarded" hard to forget.

**Deferred** until ADR-0006's expansion gate opens or concrete duplicated lifecycle
pain appears: a mission base class / runtime ownership of pause/resume, a checkpoint /
resumable-draft framework, and a result-validation framework. A scene-restart "render"
helper is also deferred as too shallow to earn its keep today.

## Consequences

- The scene layer gets two small, well-tested seams instead of a speculative framework
  for three simple, headless missions — honoring "minimum code that solves the problem."
- The No-Fail Back-button gap is closed by `confirmMissionExit`, not by checkpoint
  machinery that current play has not shown a need for.
- This makes the phantom `MissionScene` interface (`types.ts`, zero implementers) a
  **delete**: it implies a start/pause/resume lifecycle we are explicitly deferring.
- Revisit this ADR when the expansion gate (ADR-0006) opens, or when a fourth mission
  or refresh/interruption play-test evidence creates real resumable-state pain.
- Implemented via issues: `bindIntents` seam (#12) and a follow-up exit-guard slice.
