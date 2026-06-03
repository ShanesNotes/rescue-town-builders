# ADR-0004: Build the mission framework before real mission content

Status: Accepted

## Context

The PRD says the initial MVP should not build all 14 missions. It should build a reusable mission framework and ship three polished missions first (`docs/prd/prd-v0.1.0.md:54-66`). It names reusable systems created by the first three missions (`docs/prd/prd-v0.1.0.md:104-182`) and provides a shared mission framework contract (`docs/prd/prd-v0.1.0.md:326-409`). It also warns that AI agents can get lost unless each issue stays under one scene/system (`docs/prd/prd-v0.1.0.md:550-560`).

## Decision

Engineering starts with the mission framework, scene flow, save/profile persistence, mission registry, scoring, input intent mapping, and placeholder result flow before implementing complete mission content.

## Consequences

- Each real mission must be a vertical slice through the framework, not a standalone one-off.
- Mission-specific code may introduce internal modules, but cross-mission concerns should stay in shared modules.
- Tests should target shared module interfaces before scene-specific implementation details.
