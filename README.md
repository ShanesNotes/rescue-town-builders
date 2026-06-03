# Rescue Town Builders

Browser-first 2D kids mini-game anthology based on the PRD in `docs/prd/prd-v0.1.0.md`.

## Direction

- Stack: Phaser + TypeScript + Vite.
- Platform: static web app; no backend for MVP.
- Save model: browser `localStorage` only.
- MVP missions: Rivet's Recycling Run, Brick's House Builder, Ember's Fire Fix.
- Safety rule: no accounts, chat, ads, purchases, child-facing external links, or third-party character likenesses.
- Development rule: do not build all missions at once. Work PRD section by section through durable goals, GitHub issues, tracer-bullet slices, and TDD.
- Expansion gate: after the first three MVP missions, pause new missions until `docs/reviews/post-mvp-expansion-gate.md` and play-test notes are satisfied.

## Agent workflow

1. Read `CONTEXT.md`, relevant ADRs in `docs/adr/`, and the PRD section for the active issue.
2. Pick the smallest vertical slice from `docs/planning/issue-slices.md` or GitHub Issues.
3. Convert the slice to failing tests first where practical.
4. Implement only that slice.
5. Verify with tests, lint/typecheck/build once the project foundation exists.
6. Update issue evidence and asset backlog entries as work reveals new needs.

## Human guidance

The human does not need game-development knowledge to drive architecture. Agents choose technical and design defaults from the PRD and ADRs. Human input is only needed for taste checks, child play-test observations, and any asset/license decision that cannot be resolved from approved sources.

## Local development

```sh
npm install
npm run dev
npm test
npm run build
```

The current MVP uses runtime-drawn placeholder shapes/text/emoji only. Theme music exists as four generated segments outside the repo; keep it out until it is spliced and the license/source notes are ready.

Gamepad baseline is included through the Input Intent module: A/0 confirms, B/1 goes back, X/2 performs actions, and D-pad maps to movement. Use `docs/playtesting/mvp-playtest-guide.md` for the first physical gamepad smoke session.

The local/CI post-MVP gate check is:

```sh
npm run check:post-mvp-gate
```

It allows the current three MVP missions, but blocks newly registered roadmap missions unless play-test, mobile, gamepad, asset-intake, and expansion verdict evidence is recorded.
