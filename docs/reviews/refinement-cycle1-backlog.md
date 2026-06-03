# Refinement Cycle 1 — verified backlog

Two independent audits ran in parallel on 2026-06-03:
- **Claude subsidiary network** (54 agents): zoom-out → 7 specialist finders → adversarial
  refutation of every finding → synthesis. 32 findings survived verification.
- **Codex `xhigh` independent audit** (different model): see
  [codex-independent-audit-cycle1.md](./codex-independent-audit-cycle1.md). 9 findings.

Where the two models **agree**, confidence is high. The one **disagreement** (mission-runtime
vs lighter input seam) seeded the Cycle 1 ADR grill → see `docs/adr/0007-*`.

## Balance assessment (the painter's step-back)

The logic layer is **deep and solid** — `SaveSystem` and `InputIntent` hide real behavior
behind small, well-tested interfaces, and No-Fail lives in the logic layer (ADR-0004 ✓). The
**scene layer is out of balance**: 10 scenes copy-paste the same keyboard+gamepad binding and
the `scene.restart` render idiom, with no shared seam. Three modules are **built-but-not-load-bearing**
— the `MissionScene` interface (zero implementers), `AssetCatalog`, and — most importantly —
**`Secrets`, the project's soul, fully tested but wired into no scene.** They pass the deletion
test today, which is the signal they need a *live caller*, not more code.

## Ranked backlog

| # | Slice | Sev | Type | Issue |
|---|-------|-----|------|-------|
| 1 | **Fire Fix No-Fail hard-block** — drone safety floor so a spray-only child always finishes | critical | AFK | ✅ done `764109a` |
| 2 | **SfxSystem** — the whole game plays in silence; add cues at existing event seams | high | AFK | — |
| 3 | **Parent Settings keyboard/gamepad parity** — controls are touch-only today | high | AFK | — |
| 4 | **`bindIntents` input seam** + analog-stick decoding (kills 10× duplication) | med | AFK | gated on ADR-0007 |
| 5 | **Animate placement & celebration** — replace dead-frame restarts with one-shot juice | med | AFK | blocked by #2 |
| 6 | Icon-first child copy — strip engineer prose / raw ids; control-glyph legend | med | mixed | taste call |
| 7 | Persistent focus indicator for keyboard/gamepad across scenes | med | AFK | — |
| 8 | Raise touch targets (52→~72) and de-cramp the Fire Fix d-pad | med | mixed | taste call |
| 9 | **Wire the three Secrets into their scenes** (the soul gets a caller) | med | AFK | — |
| 10 | **Sticker Book** — read-only reward; satisfies PRD acceptance criterion #7 | med | AFK | — |
| 11 | Portrait rotate-device guard (FIT letterboxes a portrait phone) | med | AFK | — |
| 12 | Lock the canvas: disable pinch/double-tap zoom | low | AFK | (with #11) |
| 13 | Trim roadmap avatars `wings`/`scoot` out of the live list + bundle | med | AFK | — |
| 14 | Non-destructive save: backup raw on version-mismatch/corrupt; warn symmetry | low | AFK | + ADR fork |
| 15 | Kind scoring floor + pin Fire Fix penalty/denominator with tests | low | mixed | taste call |
| 16 | Delete the phantom `MissionScene` interface (or fulfill a trimmed one) | low | AFK | gated on ADR-0007 |
| 17 | Centralize the accuracy→MissionResult builder; cover dead InputIntent variants | low | AFK | blocked by #4 |
| 18 | Run the harsh-language guard against the real child-facing string corpus | med | AFK | blocked by #6 |

## The ADR fork (being grilled, Claude↔Codex)

Two forks surfaced. The **architecture fork** (Codex: build a shared mission runtime now;
Claude: no listener leak exists — adopt a lighter `bindIntents` seam and defer the runtime) is
the higher-leverage one and is being settled in `docs/adr/0007-*` via an automated grill. The
**save-migration fork** (preserve / reset / directional, and build-now-vs-later) rides with #14.
