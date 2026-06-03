# Rescue Town Builders agent instructions

Follow the root/system AGENTS.md contract. This repo adds project-specific constraints for a browser-first kids mini-game.

## Project rules

- Treat `docs/prd/prd-v0.1.0.md` as the product source of truth until superseded by a newer PRD or ADR.
- Preserve IP safety: do not use Paw Patrol names, logos, images, audio, character likenesses, or fan art.
- Build original characters and content only.
- Do not one-shot the full game. Work through PRD sections, durable Ultragoal phases, GitHub issues, tracer-bullet slices, and TDD.
- Prefer Phaser + TypeScript + Vite unless an ADR supersedes that decision.
- Keep MVP backend-free. Use browser localStorage only.
- Design for keyboard, touch, and gamepad from foundation work onward.
- No child-facing external links, accounts, ads, purchases, chat, analytics, leaderboards, or multiplayer in MVP.
- Record asset needs in `docs/assets/ASSET_BACKLOG.md` instead of blocking code on final art.
- Architectural and design defaults are agent-owned unless a task is destructive, credential-gated, or contradicts an ADR.

## Agent skills

### Issue tracker

Issues and PRDs are tracked in GitHub Issues for `ShanesNotes/rescue-town-builders`. See `docs/agents/issue-tracker.md`.

### Triage labels

The repo uses the default five-label triage vocabulary. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context domain docs: read root `CONTEXT.md` plus `docs/adr/`. See `docs/agents/domain.md`.
