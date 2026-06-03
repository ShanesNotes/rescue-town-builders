# Ultragoal brief: Rescue Town Builders PRD v0.1.0

Create a durable, section-by-section development plan for `docs/prd/prd-v0.1.0.md` without one-shotting game development.

Constraints:
- Browser-first Phaser + TypeScript + Vite.
- No backend for MVP; localStorage only.
- No Paw Patrol names, logos, images, music, character likenesses, fan art, or third-party IP confusion.
- Start from agent engineering foundations, GitHub Issues, asset backlog, ADRs, and tracer-bullet slices.
- Human does not need game-development knowledge; agents make architecture/design defaults unless a decision is destructive, credential-gated, or contradicts an ADR.
- Work section by section from PRD to issues to TDD slices.
- Do not build all 14 missions before the MVP framework and first 3 missions are proven.

Requested phased goals:

1. PRD intake and repo foundation
   Objective: Preserve PRD v0.1.0 in the repo, analyze its sections, record setup decisions, initialize GitHub remote, and document the agent operating model.

2. Agent engineering and domain setup
   Objective: Configure issue tracker docs, triage labels, domain context, ADRs, architecture deepening candidates, and human guidance so skills can safely operate in the repo.

3. Issue and asset backlog conversion
   Objective: Convert the PRD into a parent GitHub issue, phased vertical-slice issues, and a separate asset backlog with licensing/source rules.

4. Slice 0 TDD project foundation
   Objective: Build only the Phaser/Vite/TypeScript foundation, scene flow, save/profile basics, mission registry, fake mission completion, and initial tests.

5. Slice 1 TDD profile and town map loop
   Objective: Build profile selection, parent settings, static town map, registry-driven mission nodes, and persisted fake completion progress.

6. Slice 2 TDD Rivet's Recycling Run
   Objective: Build the first real mini-game through tested item/category data, bin interaction, hints, scoring, and saved stars.

7. Slice 3 TDD Brick's House Builder
   Objective: Build the construction sequence mini-game through tested blueprint data, part placement, hints, scoring, and sticker unlock.

8. Slice 4 TDD Ember's Fire Fix
   Objective: Build the movement/action mini-game through tested input intent, cartoon fire health, hose spray collision, helper assistance, and saved stars.

9. Slice 5 polish, accessibility, audio, and deploy
   Objective: Add toy-feel polish, audio/mute, celebration FX, accessibility pass, mobile layout smoke checks, and static deployment.

10. Post-MVP expansion gate
    Objective: Reassess code architecture, play-test evidence, asset state, and fun before adding roadmap missions after the first three are solid.
