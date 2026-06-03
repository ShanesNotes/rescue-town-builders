# ADR-0003: Preserve IP safety through original characters, assets, and audio

Status: Accepted

## Context

The PRD translates child-inspired mechanics into original characters and explicitly warns against Paw Patrol names, characters, logos, related titles, official art, and audio (`docs/prd/prd-v0.1.0.md:1-12`, `docs/prd/prd-v0.1.0.md:33-52`, `docs/prd/prd-v0.1.0.md:411-423`). Asset risks include art bottleneck and IP risk (`docs/prd/prd-v0.1.0.md:550-560`).

## Decision

All content must be original or sourced from approved licenses. Do not use third-party fan art or recognizable branded character likenesses. Record asset source/license data in `docs/assets/ASSET_BACKLOG.md`.

## Consequences

- Placeholder assets are allowed only when their source/license is acceptable and recorded.
- Names in code, data, filenames, and issue text should use the original PRD translations.
- Any asset that creates third-party IP confusion must be replaced or rejected.
