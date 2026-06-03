## What this tracks

Parent PRD issue for Rescue Town Builders MVP v0.1.0.

The PRD is preserved in the repo at `docs/prd/prd-v0.1.0.md`. The execution plan is deliberately phased: PRD → agent setup → issues → vertical slices → TDD implementation.

## Scope

- Browser-first Phaser + TypeScript + Vite.
- No backend for MVP; localStorage only.
- Original, IP-safe content only.
- MVP missions: Rivet's Recycling Run, Brick's House Builder, Ember's Fire Fix.
- Three-input support: keyboard, touch, gamepad.
- No accounts, chat, ads, purchases, child-facing external links, online multiplayer, or hard fail states.

## Acceptance criteria

- [ ] Slice 0 project foundation is complete.
- [ ] Slice 1 profile/town map loop is complete.
- [ ] Slice 2 Recycling Run is complete.
- [ ] Slice 3 House Builder is complete.
- [ ] Slice 4 Fire Fix is complete.
- [ ] Slice 5 polish/accessibility/audio/deploy is complete.
- [ ] Asset license ledger is populated for imported assets.
- [ ] MVP acceptance criteria from `docs/prd/prd-v0.1.0.md` are satisfied.

## Planning artifacts

- `docs/analysis/prd-v0.1.0-analysis.md`
- `docs/planning/issue-slices.md`
- `docs/assets/ASSET_BACKLOG.md`
- `.omx/ultragoal/goals.json`
