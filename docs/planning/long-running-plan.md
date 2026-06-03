# Long-running plan — the durable tri-model development loop

> **Status:** ratified 2026-06-03 via an automated `grill-with-docs --auto` dialogue between
> Claude and Codex (xhigh). Non-HITL: Claude ratifies. Codex's round-1 critique (5×REVISE +
> the biggest-risk call) is incorporated below; the raw grill is preserved in the cycle
> ledger reference. This is the plan the three models build toward for weeks, not a day.

## Telos

Take Rescue Town Builders from a solid playable prototype to a **polished, professional,
joyful gift** for Willem — and keep it growing — through a durable loop of three models with
distinct strengths, never crossing the guardrails (IP-safe, localStorage-only, No-Fail,
ADR-0006 gate, ADR-0007 seams).

## Roles

- **Claude** — orchestrator + game-feel mechanics + the hidden Secrets soul + audio synthesis
  + verification + **sole merge authority**. Runs the continuous-refinement cycle and the
  ultracode **Workflow** for fan-out phases (multi-finder audits, adversarial verification
  panels, design synthesis).
- **Codex** — the **asset & content-production engine** (`$ultragoal`): CC0/Kenney art + audio,
  the render/animation layer, atlases, juice, deeper visual/e2e coverage. Autonomous in an
  isolated worktree; commits to its branch; never merges.
- **Grok** — **creative direction**: lore, character voice, mission concepts (gated by
  ADR-0006), palette + sound mood boards, design copy. Autonomous worktree, merge-safe files.

## File ownership manifest (REVISE #2 — worktrees are necessary, not sufficient)

| Owner | Owns |
| --- | --- |
| **Claude** | `src/game/scenes/**` mechanics, `src/game/systems/**` core logic, `src/game/ui/**`, ADRs, GitHub issues, integration/e2e tests, merges, `design.md`, `docs/planning/**` |
| **Codex** | `public/assets/**`, `src/game/systems/AssetCatalog.ts`, preload/render asset wiring, a sprite/animation helper, `docs/assets/ASSET_BACKLOG.md`, visual/e2e coverage |
| **Grok** | `docs/design/**`, lore/copy + sticker text (strings only in `src/game/data/stickers.ts`), mood boards. No accepted ADRs, no mechanics code |

Shared files require an issue-level lock with Claude as lead. No `git clean`/`reset` outside
an agent's own worktree, ever, and only when its status is clean and logged.

## Handoff packet (REVISE #1 — Claude is sole *merger*, not sole *integration worker*)

Every branch handed to Claude for merge carries: **owner · changed files · tests run · e2e/
screenshot artifacts · asset license notes · known risks · rollback commit**. Producing agents
prove green *before* handoff; Claude re-runs verification *after* merge.

## Codex → Grok creative brief (REVISE #3 — required only for identity work)

Required only for **character / sticker / music identity** work (not generic CC0 plumbing).
The brief carries: asset keys · silhouette goals · palette · motion verbs · emotional tone ·
IP "do-not-resemble" notes · audio motif words · acceptance examples. Codex cites the brief ID
in the asset backlog. If Grok's guidance is vague, Codex proceeds without it.

## Verification (REVISE #4 — callback-only tests are not enough once art lands)

Claude guarantees green at integration; producing agents guarantee green before handoff. The
e2e bridge proves flow but can bypass real rendering. Add integration checks: console-error /
404 scan, loaded Phaser texture-key assertions, non-blank canvas pixels, screenshot artifacts
for title/map/each mission, portrait + landscape fit, and ≥1 real pointer/touch/gamepad path
per input class. **Art changes must not pass on callback-only tests.**

## Long-running infrastructure (REVISE #5 — what makes it last weeks)

- Integration queue with a WIP limit + stale-branch policy.
- Handoff packet schema (above) and file ownership manifest (above).
- **Playtest ledger** tied to ADR-0006 (see the hard rule below).
- Asset provenance / IP-review gate before any imported asset merges.
- Release / rollback cadence; save-migration policy (when `SAVE_VERSION` bumps).
- A device / browser matrix for the e2e runs.

## HARD RULE — ADR-0006 anti-erosion (the single biggest risk)

Mission #4 (Frog Flight) and all roadmap missions stay **concept-only** until ADR-0006's
evidence exists: **real child/parent play-test evidence that the first three missions are fun,
understandable, and no-fail.** Models cannot self-certify that — only Willem and Shane can.
Grok may concept; Claude may write a play-test plan; nobody opens the gate without recorded
evidence in the playtest ledger. Refinement of the existing three is always in-bounds.

## Near-term backlog (in dependency order)

1. ✅ Title screen + procedural music (Claude, Cycle 11).
2. ⏳ Render the loaded art across scenes + Kenney upgrade (Codex, in flight).
3. `confirmMissionExit` No-Fail back-guard (#18, ADR-0007).
4. Input parity: bindIntents seam + Parent Settings keyboard/gamepad reach (#11/#12).
5. Portrait rotate-device guard + pinch-zoom lock (#15).
6. Integration verification harness (texture keys, canvas pixels, screenshots).
7. Splice + import the real theme loop (Shane exports `.aup3` → OGG; swap behind `MusicSink`).
8. MissionIntro warmth pass.
9. Author the ADR-0006 play-test plan; **gate stays closed** pending Willem's evidence.
