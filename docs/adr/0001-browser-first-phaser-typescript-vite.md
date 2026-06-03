# ADR-0001: Use Phaser, TypeScript, and Vite for the browser-first MVP

Status: Accepted

## Context

The PRD targets browser-first play across desktop, tablet, Chromebook, and mobile landscape (`docs/prd/prd-v0.1.0.md:15-24`). It recommends Phaser + TypeScript + Vite and explicitly contrasts this with Godot web-export caveats (`docs/prd/prd-v0.1.0.md:3-12`, `docs/prd/prd-v0.1.0.md:270-286`).

## Decision

Build the MVP as a Phaser + TypeScript + Vite static web app.

## Consequences

- Phaser scenes become the primary game-runtime module shape.
- TypeScript types define mission definitions, mission results, save data, and testable pure logic.
- Vite is the app/build entry point.
- Godot, Unity, native mobile, and backend-first approaches are out of scope for MVP unless a later ADR reopens this decision.
