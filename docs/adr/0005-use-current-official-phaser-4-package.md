# ADR-0005: Use the current official Phaser 4 package for the initial scaffold

Status: Accepted

## Context

The PRD chooses Phaser + TypeScript + Vite for a browser-first MVP. During Slice 0 setup on June 3, 2026, `npm view phaser version` reported `4.1.0`, and Phaser's official template documentation lists the Vite TypeScript template as updated for Phaser 4, Vite 6.3.1, and TypeScript 5.7.2. Phaser's official docs also continue to present Vite TypeScript templates and npm installation as supported routes.

## Decision

Use the current official `phaser` npm package for the initial scaffold. The app is scaffolded manually instead of cloning the Phaser template so the repo keeps only project-owned files and avoids template telemetry scripts.

## Consequences

- `package.json` uses `phaser@^4.1.0`.
- Scene code should stay simple and avoid version-sensitive Phaser internals.
- If Phaser 4 API friction blocks mission development, revisit this ADR and consider pinning the latest Phaser 3 line.
