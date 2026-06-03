# ADR-0006: Gate roadmap expansion on MVP play-test, assets, and architecture review

Status: Accepted

## Context

The MVP now has the first three original missions from the PRD: Rivet's Recycling Run, Brick's House Builder, and Ember's Fire Fix. The original development rule was to avoid building all missions at once and to prove the Mission Framework with a few polished vertical slices first.

The project still uses minimal runtime placeholders. The generated theme music exists outside the repo as four segments and needs splicing plus source/license notes before import. Gamepad control support is important for the target child player and is present through the Input Intent module, but physical gamepad smoke testing still needs human observation.

## Decision

Do not add roadmap missions until the MVP expansion gate is satisfied. The gate must check:

1. **Architecture** — the Mission Framework remains navigable, testable, and deep enough for more missions.
2. **Play-test evidence** — a child/parent session confirms the first three missions are understandable, generous, and fun.
3. **Asset state** — placeholder, production, and audio intake needs are tracked before importing art/audio.
4. **Accessibility and controls** — touch, keyboard, and gamepad paths remain large-target, no-fail, and non-shaming.
5. **Fun** — missions earn repeat play before the project spends effort on more content.

Agents may keep improving the framework, docs, tests, and placeholder-safe polish while the gate is open. New mission content should wait unless a future ADR reopens this decision.

## Consequences

- The next strategic work is MVP stabilization, play-test capture, asset intake, and small framework cleanup, not mission count expansion.
- Human contribution is focused on observation notes, taste, and asset/music source decisions; agents continue to own architecture and implementation defaults.
- The four music segments stay outside the repo until they are spliced, approved, and recorded in the asset ledger.
- Any new mission issue should cite the completed gate evidence and the architecture seam it uses.
