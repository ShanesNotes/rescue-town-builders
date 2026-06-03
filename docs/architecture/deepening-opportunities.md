# Architecture deepening opportunities

This is an initial PRD-derived architecture review. There is no game code yet, so these are starting **Module** candidates, not refactor findings from existing implementation friction.

## Selected starting order

1. Mission Runtime
2. Save/Profile Store
3. Input Intent
4. Reward/Progress
5. Asset Catalog
6. Helper/Accessibility Rules
7. Scene Navigation

## Candidates

### 1. Mission Runtime

- **Files**: future `src/game/missions/*`, `src/game/systems/MissionRegistry.ts`, mission result flow.
- **Problem**: If every mission manually handles start, pause, completion, stars, stickers, save updates, and return navigation, mission code will become shallow glue with duplicated rules.
- **Solution**: Create one deep Mission Runtime module that owns mission lifecycle behavior and lets individual missions focus on their core play loop.
- **Benefits**: More **locality** for lifecycle bugs and more **leverage** for every mission. Tests can verify the mission runtime interface instead of repeating completion/save assertions per scene.

### 2. Save/Profile Store

- **Files**: future `src/game/systems/SaveSystem.ts`, profile scene, parent settings, mission complete scene.
- **Problem**: Profile limits, versioning, reset behavior, selected profile, and mission progress can leak across callers.
- **Solution**: Keep persistence behind one Save/Profile Store module with a small interface for loading, saving, selecting profiles, updating progress, and reset.
- **Benefits**: Better **locality** for storage migrations and safer tests around the browser-storage seam.

### 3. Input Intent

- **Files**: future input system, scenes, touch controls, gamepad controls.
- **Problem**: The PRD requires keyboard, touch, gamepad, and one-handed mode from day one. If scenes read devices directly, every mission inherits device complexity.
- **Solution**: Use an Input Intent module that maps devices to child-friendly actions such as move, confirm, back, aim, spray, select bin, or request hint.
- **Benefits**: More **leverage** from one input seam and better **locality** for mobile/gamepad bugs.

### 4. Reward/Progress

- **Files**: future star scoring, sticker book, town map decorations, mission complete scene.
- **Problem**: Stars, stickers, town decorations, and best-star persistence can become scattered between scenes.
- **Solution**: Concentrate reward calculation and progress updates behind a Reward/Progress module.
- **Benefits**: Tests can target reward invariants directly, and missions stay focused on stats rather than persistence details.

### 5. Asset Catalog

- **Files**: future asset manifest, preload scene, `assets/`, `docs/assets/ASSET_BACKLOG.md`.
- **Problem**: Art/audio bottleneck and IP safety are explicit PRD risks. Asset keys, placeholder status, license source, and preload behavior can drift if unmanaged.
- **Solution**: Track asset keys and licensing expectations in an Asset Catalog module plus the asset backlog.
- **Benefits**: Better **locality** for preload failures and IP/license review. The same seam can support placeholder and production adapters later.

### 6. Helper/Accessibility Rules

- **Files**: future hint system, mission scenes, parent settings, accessibility pass.
- **Problem**: No-fail behavior, adaptive help, large UI targets, no harsh failure language, and no hard fail timers are cross-mission rules.
- **Solution**: Keep helper timing, hint copy, repeated-miss handling, and failure-language policy in one Helper/Accessibility Rules module.
- **Benefits**: More **leverage** for kid-safety guarantees and fewer mission-specific regressions.

### 7. Scene Navigation

- **Files**: future start/profile/map/intro/mission/complete scenes.
- **Problem**: The PRD requires repeated navigation paths and result returns. Hard-coded scene jumps can make flow bugs spread.
- **Solution**: Use a small Scene Navigation module for allowed transitions and payload conventions.
- **Benefits**: Higher **locality** for route changes and easier smoke tests for the full loop.

## ADR conflicts

None. These candidates align with ADR-0001 through ADR-0004.

## Next exploration

When code exists, rerun architecture review against real modules and apply the deletion test to any suspected shallow module.
