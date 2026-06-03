# Continuous Refinement — the durable goal & cycle ledger

> *Slow is smooth, smooth is fast. A painter who steps back before every stroke.*

This is the durable goal Claude works toward across sessions, alongside Codex's
completed `.omx/ultragoal/`. Codex built the MVP foundation (G001–G010). This
goal **refines** it — tightening quality at every facet without re-litigating the
MVP scope or the ADRs.

## The goal (telos)

Keep Rescue Town Builders a **rock-solid, joyful, professionally-engineered
foundation** for Shane & Willem to explore — improving correctness, the No-Fail
promise, accessibility, architectural depth, fun, and the hidden
Language-of-Creation secrets, one careful cycle at a time.

Guardrails (inherited, never crossed):
- No Paw Patrol / third-party IP. Original characters only (ADR-0003).
- No backend, no analytics, localStorage only (ADR-0002).
- No-Fail Rule: a child can never truly fail; wrong answers retry, never block.
- Don't expand past the first three missions until the post-MVP gate opens
  (ADR-0006). Refinement of existing work is always in-bounds.
- Work on the `continuous-refinement` branch. Commit each verified cycle.
  Never push or touch `main` without Shane's say-so.

## The cycle protocol

Each cycle is a subsidiary network of specialised agents, matched to task:

1. **Zoom out** *(every ~3rd cycle, or when lost)* — step back like a painter.
   Map modules & callers in the project's domain language; assess balance; name
   the next highest-leverage stroke.
2. **Find** — task-specialists (correctness/no-fail, accessibility, architecture
   depth, test rigor, mobile/touch) and a creative-director (fun, delight,
   Willem's experience, the secrets) surface findings in parallel.
3. **Adversarially verify** — skeptic agents try to *refute* each finding; a
   **Codex consultant** (`codex exec -s read-only -c model_reasoning_effort="xhigh"`)
   adds an orthogonal, different-model critique. Only survivors proceed.
4. **Implement (TDD)** — vertical red→green→refactor. One behavior at a time.
5. **Verify** — `npm run typecheck`, `npm test`, `npm run build`.
6. **Commit** on the branch; append a ledger entry below.

## Living backlog

Seeded from the pre-refactor foundation audit; re-validated against the current
tree each cycle (the audit was written before Codex's G010 refactor).

- [ ] Wire the three secrets into the (current) scenes; verify by running the game.
- [ ] Scene lifecycle: shared `shutdown` listener-cleanup across scenes.
- [ ] Accessibility: keyboard/gamepad reach for all Parent Settings controls;
      FireFix arrow-button focus + size.
- [ ] `tsconfig` hardening (`noUncheckedIndexedAccess`) + fix fallout.
- [ ] Resolve/trim the unused `MissionScene` interface (src/game/types.ts).
- [ ] Remaining test hardening (maybeAssist boundary, clampVolume, InputIntent variants).

## Cycle ledger (append-only)

### Cycle 0 — 2026-06-03 — Establish the engine
- Branched `continuous-refinement` off `main` (657e27a) so progress is durable
  (prior uncommitted work was wiped by Codex's G010 cleanup).
- Restored the wiped easter-egg core: `Secrets.ts` + 8 tests + design doc.
- Wrote this charter. Baseline at branch point: typecheck clean, 55 tests green.
