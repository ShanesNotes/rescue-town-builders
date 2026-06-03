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
- **Fully agent-driven — non-HITL.** Claude makes every design / architecture /
  ADR decision itself (informed by the Claude↔Codex grill and the Codex
  consultant). Nothing waits for human ratification. Commit each verified cycle on
  the `continuous-refinement` branch. (Pushing to origin / merging to `main`
  remains the one outward step left for a Shane nudge.)

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
4. **Decompose before building** (`to-issues`) — break verified findings into thin
   vertical-slice tracer-bullet issues on GitHub (`ShanesNotes/rescue-town-builders`),
   in dependency order. Never start a large task without slicing it first. Tag each
   slice AFK/HITL only to flag *how the decision gets made* — HITL slices are resolved
   by the Claude↔Codex grill (step 5), not by waiting on a human.
5. **Grill hard ADR forks** (`grill-with-docs --auto`) — when a finding implies a
   hard-to-reverse architectural decision, run an automated **Claude↔Codex** grilling
   dialogue (Codex stands in for the human-in-the-loop). The grill converges to a
   verdict and Claude **ratifies it as an accepted ADR**, recording the Claude↔Codex
   reasoning. Non-HITL: no decision waits for a human.
6. **Implement (TDD)** — pick the top AFK slice; vertical red→green→refactor, one
   behavior at a time.
7. **Verify** — `npm run typecheck`, `npm test`, `npm run build`.
8. **Commit** on the branch; annotate/close the slice issue; append a ledger entry.

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

### Cycle 0.1 — 2026-06-03 — Define the full process
- Folded in decompose-first (`to-issues`) + `grill-with-docs --auto`; marked the
  effort non-HITL (Claude makes and ratifies every decision).

### Cycle 1 — 2026-06-03 — First refinement pass
- **Two parallel audits**: Claude subsidiary network (54 agents → 32 verified
  findings) + independent Codex `xhigh` audit (different model). Both converged on
  the same architectural fork. Artifacts in `docs/reviews/`.
- **Critical No-Fail fix shipped** (`764109a`): Fire Fix could hard-block a
  spray-only child forever; the drone is now a true No-Fail floor. 64 tests green.
- **Decomposed** the backlog into 9 GitHub issues (#10–#18), dependency-tagged.
- **ADR-0007 ratified** via an automated Claude↔Codex grill: lightweight `bindIntents`
  seam + `confirmMissionExit` guard now; defer the heavyweight mission runtime. Codex
  conceded the listener-leak claim with Phaser source evidence.
- Next: non-destructive save (#17, TDD logic slice), then the ADR-0007 seams.
