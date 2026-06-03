# Final cleanup report

Date: 2026-06-03

## Scope

Final G010 cleanup over the MVP repo, focused on uncommitted post-MVP gate docs plus small code smells found after Slice 5.

## Behavior lock

- `npm test` before cleanup: 14 files, 37 tests passed. After final route/gate repairs and gate robustness fix: 16 files, 55 tests passed.
- Existing mission, save, input, scoring, accessibility, audio, celebration, and transition behavior stayed covered.

## Cleanup plan

1. Classify fallback-like code before editing.
2. Reinforce the grounded local-storage fail-safe with tests.
3. Remove stale naming from the scene-flow constant.
4. Delete unused speculative transition helper code.
5. Resolve final architecture WATCH items with a small route seam and post-MVP gate check.
6. Rerun full verification.

## Fallback findings

- `src/game/systems/SaveSystem.ts` returns an empty save when browser storage is absent, corrupt, or from an unsupported version, and keeps the current in-memory session playable when browser persistence is blocked.
  - Classification: **grounded compatibility/fail-safe fallback**.
  - Reason: corrupt, unavailable, full, or blocked local browser storage should not crash a child-facing no-backend MVP.
  - Action: added regression tests for invalid JSON, unsupported save versions, and blocked persistence.
- No masking fallback slop, swallowed validation bypass, or broad compatibility shim was found in changed runtime code.

## Passes completed

- Fallback-like code resolution gate: preserved/strengthened grounded local-storage fail-safes and added tests.
- Dead/speculative code: removed unused `transitionToScene` helper and `fadeOutMs` constant from `SceneTransitions`.
- Naming cleanup: moved stale scene-flow naming into `SceneNavigation` as `MVP_SCENE_FLOW` and updated test descriptions.
- Architecture WATCH repair: added `SceneNavigation` so route keys, mission routes, parent-settings returns, town-map returns, and mission completion payloads live behind one seam.
- Expansion gate repair: added pure `scripts/post-mvp-gate-core.mjs`, `scripts/check-post-mvp-gate.mjs`, `npm run check:post-mvp-gate`, and CI coverage to block roadmap mission registration until gate evidence exists.
- Test reinforcement: `SaveSystem` now covers invalid JSON, unsupported save versions, and blocked browser read/write/remove persistence; `RecyclingRun` now covers no-fail completion after repeated misses plus item-selection edges; `StarScoring` locks threshold boundaries; `SceneNavigation` and post-MVP gate checks have direct tests, including negative roadmap-mission/evidence-marker cases.

## Quality gates

- Regression tests: PASS — `npm test` (16 files, 55 tests).
- Post-MVP gate check: PASS — `npm run check:post-mvp-gate`.
- Typecheck: PASS — `npm run typecheck`.
- Build: PASS — `npm run build`.
- Static Pages build: PASS — `GITHUB_PAGES=true npm run build`.
- Dev smoke: PASS — `npm run dev` served HTTP 200 and the app shell contained `Rescue Town Builders`.
- Whitespace/static diff check: PASS — `git diff --check`.
- Security dependency scan: PASS — `npm audit --audit-level=high` found 0 vulnerabilities.
- Lint: N/A — no lint script is configured in `package.json`.

## Changed files

- `src/game/systems/SaveSystem.ts` — kept mission/profile flow in memory if browser persistence is blocked and warned on unsupported save versions.
- `tests/SaveSystem.test.ts` — added local-storage fail-safe coverage.
- `tests/RecyclingRun.test.ts` — added no-fail and item-selection edge coverage.
- `tests/StarScoring.test.ts` — added boundary-threshold coverage.
- `src/game/systems/SceneNavigation.ts` — added central route seam and MVP route mapping.
- `tests/GameConfig.test.ts` — updated scene-flow import and assertion language.
- `tests/SceneNavigation.test.ts` — covered route keys and mission-to-scene mapping.
- `scripts/post-mvp-gate-core.mjs` — added pure post-MVP gate validator.
- `tests/PostMvpGate.test.mjs` — covered local post-MVP gate pass, missing evidence, incomplete evidence, and complete evidence paths.
- `src/game/scenes/*` — routed scene starts through `SceneNavigation`.
- `src/game/systems/SceneTransitions.ts` — removed unused transition helper.
- `tests/SceneTransitions.test.ts` — aligned test with fade-in-only behavior.
- `docs/adr/0006-post-mvp-expansion-gate-before-roadmap-missions.md` — recorded expansion gate decision.
- `docs/reviews/post-mvp-expansion-gate.md` — recorded gate verdict and exit criteria.
- `docs/playtesting/mvp-playtest-guide.md` — added parent-friendly play-test and gamepad guide.
- `docs/assets/ASSET_BACKLOG.md` — added post-MVP asset status, intake checklist, and gamepad glyph need.
- `docs/architecture/deepening-opportunities.md` — updated architecture candidates against real code.
- `README.md` — linked expansion/play-test guidance.

## Remaining risks

- Physical gamepad smoke is still manual and tracked in issue #9.
- Child/parent fun evidence is still open and should be captured before new roadmap missions.
- Theme music remains outside the repo in four segments until splicing and source/license notes are complete.
