# Issue slice plan

Source: `docs/prd/prd-v0.1.0.md`

These are tracer-bullet slices. Each implementation slice should be independently demoable or verifiable and should not attempt to build the full game at once.

## Parent issue

### PRD v0.1.0: Rescue Town Builders MVP

- **Type**: HITL for product review, AFK for engineering decomposition.
- **Blocked by**: None.
- **Purpose**: Track the PRD as the parent planning issue for the MVP.

## Strategic slices

### 1. Asset curation pipeline and MVP placeholder ledger

- **Type**: AFK with optional human taste review.
- **Blocked by**: None.
- **What to build**: Establish asset-source rules, placeholder import conventions, and a license ledger before production art decisions.
- **Acceptance criteria**:
  - Asset paths and naming conventions exist once code/assets are initialized.
  - Every imported asset has source/license status.
  - No third-party character likenesses or fan art are accepted.
  - Placeholders are enough for Slice 0 and Slice 2 start.

### 2. Slice 0 — Project foundation and fake mission loop

- **Type**: AFK.
- **Blocked by**: None.
- **What to build**: Phaser + TypeScript + Vite app with scene flow, save/profile basics, mission registry, placeholder mission completion, and tests.
- **Acceptance criteria**:
  - `npm install`, `npm run dev`, and `npm test` work.
  - Boot → Preload → Start → Profile → Town Map path exists.
  - A test profile persists after refresh.
  - Three placeholder missions are visible and can complete through a fake result path.
  - SaveSystem and StarScoring have Vitest coverage.

### 3. Slice 1 — Profile, parent settings, and town map progress

- **Type**: AFK.
- **Blocked by**: Slice 0.
- **What to build**: Child can create/select a profile, choose missions from a static town map, change safe settings, complete a fake mission, and see saved stars on map return.
- **Acceptance criteria**:
  - Up to 5 local profiles can be created and selected.
  - Parent settings expose mute/volume/difficulty/reset behind child-safe interaction.
  - Mission registry drives map nodes.
  - Fake mission completion updates map star state after refresh.

### 4. Slice 2 — Rivet's Recycling Run TDD slice

- **Type**: AFK.
- **Blocked by**: Slice 1 plus enough placeholder bin/item assets.
- **What to build**: First real mini-game: sort 10 items into bins with hints, accuracy scoring, and save result.
- **Acceptance criteria**:
  - Sorting item data and categories are tested.
  - Keyboard and touch selection work.
  - Incorrect choices wobble or hint without failing the mission.
  - Completing 10 items awards 1-3 stars and saves best result.

### 5. Slice 3 — Brick's House Builder TDD slice

- **Type**: AFK.
- **Blocked by**: Slice 1 plus house-part placeholders.
- **What to build**: Construction sequence mini-game with selectable or draggable parts, snap feedback, hints, and sticker unlock.
- **Acceptance criteria**:
  - Blueprint/order data is tested.
  - Wrong pieces bounce back without failure.
  - Three houses can be built from start to completion.
  - Sticker unlock persists.

### 6. Slice 4 — Ember's Fire Fix TDD slice

- **Type**: AFK.
- **Blocked by**: Slice 1 plus hydrant/fire/water placeholders.
- **What to build**: Movement and action mission with aiming, hose spray collision, cartoon fire health, helper assistance, and mission completion.
- **Acceptance criteria**:
  - Keyboard, touch, and gamepad intent mapping are covered.
  - Player can move, aim, spray, extinguish fires, and finish.
  - No-fail helper behavior appears if needed.
  - Stars persist after completion.

### 7. Slice 5 — Toy-feel polish, accessibility, audio, and static deploy

- **Type**: AFK with optional human play-test feedback.
- **Blocked by**: Slices 2-4.
- **What to build**: Audio system, celebrations, scene transitions, accessibility pass, landscape touch layout, and static hosted build.
- **Acceptance criteria**:
  - Music/SFX mute and volume settings work.
  - UI target sizes and no-fail language are reviewed.
  - Mobile landscape smoke path works.
  - Static build is playable.

## TDD rule

Before implementation in each code slice, define tests around the deepest available module interface. Prefer Save/Profile Store, Mission Runtime, StarScoring, MissionRegistry, Input Intent, and mission data rules before scene-specific internals.

## Published GitHub issues

See `docs/planning/github-issues.md` for the created issue index. The parent PRD issue is #1; strategic slices are #2-#8.
