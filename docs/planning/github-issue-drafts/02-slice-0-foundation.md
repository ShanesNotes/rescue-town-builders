## Parent

#1

## What to build

Create the Phaser + TypeScript + Vite foundation and a fake mission loop. This slice proves scene flow, local profile persistence, mission registry, placeholder mission completion, and initial tests without implementing real mini-game mechanics.

## Acceptance criteria

- [ ] `npm install`, `npm run dev`, and `npm test` work.
- [ ] Boot → Preload → Start → Profile → Town Map scene flow exists.
- [ ] A local profile can be created and selected.
- [ ] Three placeholder missions are visible: recycling-run, house-builder, fire-fix.
- [ ] Starting a placeholder mission can reach MissionComplete and save 1-3 stars.
- [ ] Refreshing the browser preserves a test profile and best-star result.
- [ ] SaveSystem and StarScoring have Vitest coverage.
- [ ] Baseline Input Intent supports keyboard, touch, and gamepad confirm/back/movement mapping.

## Blocked by

None - can start immediately.

## TDD notes

Start with tests around Save/Profile Store, MissionRegistry, and StarScoring before scene wiring.
