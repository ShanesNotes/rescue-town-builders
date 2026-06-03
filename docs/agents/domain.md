# Domain Docs

How the engineering skills should consume this repo's domain documentation when exploring the codebase.

## Layout

This is a single-context repo.

- Read `CONTEXT.md` at the repo root before architecture, diagnosis, issue, or TDD work.
- Read relevant decisions under `docs/adr/` before changing project structure, stack, mission framework, save data, input handling, asset handling, or kid-safety behavior.
- Read `docs/prd/prd-v0.1.0.md` for product requirements.
- Read `docs/assets/ASSET_BACKLOG.md` before adding or replacing assets.

## Vocabulary discipline

When output names a domain concept, use the term as defined in `CONTEXT.md`. If a needed term is missing, update `CONTEXT.md` as part of the design work instead of inventing parallel terminology.

## ADR conflicts

If output contradicts an ADR, surface it explicitly rather than silently overriding it.
