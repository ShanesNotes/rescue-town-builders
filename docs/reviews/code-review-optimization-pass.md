# Code review and optimization pass — MVP refinement

Date: 2026-06-04

## Scope reviewed

- Current MVP scene/runtime shape after the recent continuous-refinement merge and the Reuse Workshop pivot.
- Core pure mission systems: `RecyclingRun`, `HouseBuilder`, `FireFix`, `MatchEngine`, `AimEngine`.
- Scene integration seams for input, E2E hooks, exit confirmation, and mission completion.
- Tests and build gates that can run in this container.

## Optimizations applied in this pass

1. **Reuse Workshop choice ordering** — the matching rescued part no longer always appears in the first card position. Choice cards now rotate deterministically by blueprint/slot, preserving stable tests and E2E while making the workshop less pattern-memorizable.
2. **Decoration placement indexing** — wrong-piece decorations in Reuse Workshop and House Builder now use the just-added decoration index instead of the post-incremented count, so the first decorative scrap appears in the first intended visual slot.
3. **Regression coverage** — added a unit test proving Reuse Workshop rotates the matching card across blueprint slots.
4. **Fire Fix/AimEngine consolidation** — Fire Fix now adapts through `AimEngine` for movement, cone targeting, and No-Fail helper-floor behavior instead of carrying duplicate aim math.

## Review findings to keep watching

- **Browser E2E remains environment-gated**: unit/build checks pass, but Playwright browser binaries are not available in this container. Full screenshot and smoke capture need a browser-enabled runner.
- **Scene code is intentionally lightweight**: ADR-0007 still argues against a heavyweight shared mission runtime; the current best return is small shared seams and pure-system tests.
- **Next optimization target**: Fire Fix's core is now aligned with `AimEngine`; the next high-value pass is flavor/visual payoff: turn extinguished flames into harmless picnic payoffs while preserving the spray-only No-Fail floor.

## Mad bug hunt loop — 2026-06-04 follow-up

- **MatchEngine validation**: `createMatchState` now rejects prompts that point at missing target ids, catching data-entry bugs before a child gets an impossible prompt.
- **MatchEngine snapshots**: target/prompt arrays are copied on create so caller-side data mutation cannot rewrite an in-progress match mission.
