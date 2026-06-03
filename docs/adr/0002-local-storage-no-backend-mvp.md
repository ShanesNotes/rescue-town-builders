# ADR-0002: Keep the MVP backend-free with local browser persistence

Status: Accepted

## Context

The PRD says the MVP has no backend and uses local save only (`docs/prd/prd-v0.1.0.md:15-24`). It explicitly rejects accounts, cloud saves, analytics, payments, leaderboards, and multiplayer for MVP (`docs/prd/prd-v0.1.0.md:288-324`, `docs/prd/prd-v0.1.0.md:550-560`). Kid-safety requirements also reject accounts, chat, ads, purchases, external links in child-facing UI, and online multiplayer (`docs/prd/prd-v0.1.0.md:88-102`).

## Decision

Use browser `localStorage` for MVP save data. Do not add backend services, accounts, analytics, leaderboards, payments, multiplayer, or cloud persistence.

## Consequences

- Save and profile work must be testable without network dependencies.
- Deployment can be static hosting.
- Persistence risk centers on versioning, migrations, reset behavior, and browser storage limits.
- Any backend proposal must first justify why local fun is no longer enough and must be recorded in a new ADR.
