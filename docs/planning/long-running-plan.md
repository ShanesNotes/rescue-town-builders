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

## 2026-06-04 systems review: optimization roadmap

This section supersedes the stale near-term checklist above where implementation has already moved on. The MVP now has the Reuse Workshop pivot, neighbor-wish House Builder, the Fire Fix scene, shared input/exit seams, reusable `AimEngine`/`MatchEngine`, Hearthlight assets, secrets, music, and browser E2E specs that require an installed Playwright browser.

### Current systems health

| Area | Current state | Optimization direction | Gate/exit evidence |
| --- | --- | --- | --- |
| Mission pure logic | Strongest layer: `RecyclingRun`, `HouseBuilder`, `FireFix`, `AimEngine`, `MatchEngine` are unit-tested and mostly immutable. | Keep gameplay rules in pure systems. Prefer adapters over scene-only rules. | Mission-specific unit tests prove No-Fail completion and result payloads. |
| Mission scenes | Fun is improving but scenes still own a lot of Phaser object lifecycle and visual state. | Extract only tiny repeated seams after duplicated pain is proven; avoid a speculative mission runtime per ADR-0007. | Scene changes stay under one mission unless a seam is used by at least two scenes. |
| Fire/Aim family | Fire Fix and roadmap aim missions share the same movement/aim/act pattern. | Use `AimEngine` as the source of truth for cone targeting, movement bounds, and helper floor. | Fire Fix tests remain green and any future aim mission uses the same engine. |
| Reuse/Builder family | Rivet and Brick now share the "wrong becomes decoration, repeated miss helps" philosophy but not code. | Keep separate until one more mission proves the pattern; then consider a tiny `NoFailChoice` helper for repeated-miss assist thresholds. | At least two missions use identical threshold/state transitions and tests would get simpler. |
| Input and exit | `bindIntents` and `confirmMissionExit` are the right scope. | Continue routing every mission through these seams; add analog/gamepad smoke only after physical testing. | Keyboard/touch/gamepad paths are checked in playtest notes. |
| Save/rewards | LocalStorage/profile/sticker systems are stable and tested. | Do not add backend/cloud features in MVP. Add save migration only when schema changes. | SaveSystem tests pass and version bump is documented. |
| Assets/audio | Hearthlight assets are integrated; some payoff art and real browser screenshots remain open. | Prioritize payoff sprites/FX for existing MVP missions before new missions. Keep provenance in `ASSET_BACKLOG.md`. | Texture-key E2E and screenshot pass in browser-enabled runner. |
| Verification | Unit/build/post-MVP gate are reliable here; Playwright browser binary is missing in this container. | Add browser-enabled CI/runner or preinstalled Playwright browsers; keep callback E2E as a fallback, not proof of rendering. | `npm run test:e2e` passes with screenshots and no console/404 failures. |

### Durable optimization phases

#### Phase O1 — Stabilize refined MVP mechanics

- Lock the Reuse Workshop and Neighbor Wish Builder loops behind playtest notes.
- Preserve existing mission ids and save payload compatibility.
- Fix only observed friction: unclear prompts, boring payoff, missed input, or repeated scene code with test impact.
- Exit when a parent/child playtest confirms the three MVP missions are understandable, generous, and at least one earns replay.

#### Phase O2 — Browser verification and screenshot confidence

- Provide a browser-enabled runner for Playwright Chromium.
- Run `npm run test:e2e` on every visual/mechanics PR.
- Store screenshot artifacts for title, map, each MVP mission, completion, and sticker book.
- Add a small failure guide: missing browser binary, bad texture key, blank canvas, console error, 404 asset.

#### Phase O3 — Payoff art and juice for existing missions

- Reuse Workshop: bubble sprinkler, moon chime, garden rocket, crinkle kite payoff sprites/FX.
- House Builder: resident peeks/window glow per completed home.
- Fire Fix: harmless picnic payoff per extinguished fire.
- Keep effects non-flashing, short, and readable at 960×540 logical resolution.

#### Phase O4 — Shared engine consolidation only where proven

- Keep `AimEngine` as the source of truth for Fire Fix and future aim missions.
- Keep `MatchEngine` for future prompt/target matching missions.
- Consider a `NoFailChoice` helper only if Reuse Workshop, House Builder, and one more mission share the same repeated-miss assist shape.
- Reject any base mission scene/runtime until ADR-0007's revisit condition is met by real lifecycle pain.

#### Phase O5 — ADR-0006 expansion gate

- Do not add Frog Flight, Bike Explorer, Goo Cleanup, or other roadmap missions until the gate evidence exists.
- Required evidence: playtest notes, asset state, accessibility/control observations, fun/replay signal, and architecture review after the refined MVP.
- Once opened, add one roadmap mission as a tracer-bullet through the existing engines, not a content dump.

### Next concrete issue candidates

1. **Browser E2E runner fix** — make `npm run test:e2e` runnable in CI/dev container with preinstalled Playwright Chromium.
2. **Fire Fix gentle payoff pass** — reuse `AimEngine` for core rules, then add flame personality/payoff copy and scene juice.
3. **Reuse Workshop payoff sprites** — replace text-only invention tests with small Hearthlight FX.
4. **Playtest ledger** — record actual parent/child observations against the updated Reuse Workshop and Neighbor Wish Builder prompts.
5. **Device/gamepad smoke** — verify landscape touch and physical controller paths outside callback-only E2E.
