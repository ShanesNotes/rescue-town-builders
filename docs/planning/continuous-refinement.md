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

### Cycle 2 — 2026-06-03 — Non-destructive save (#17)
- `SaveSystem.load()` now backs up the raw save before discarding (version mismatch
  or corrupt JSON), warns on both branches, and normalizes the full profile/progress
  shape so a partial/old save can't crash downstream readers. `migrate()` deferred
  until `SAVE_VERSION` first bumps. 68 tests green. Issue #17 closed.

### Cycle 3 — 2026-06-03 — Trim roadmap avatars (#16)
- `ProfileScene` AVATARS trimmed to the three live IP-reviewed helpers; `wings`/`scoot`
  no longer ship in the bundle (verified by a clean `dist` grep). The modulo wrap keeps
  profiles 4–5 crash-free. Issue #16 closed.

### Cycle 4 — 2026-06-03 — Synthesized SFX (#10) + parallel swarms
- New `SfxSystem` (deep, 5 tests): gentle WebAudio cues at the correct-sort / place /
  spray-hit / fanfare seams, gated on the profile's effective sfx level. No asset files;
  CC0 samples can swap in behind the same interface. 73 tests green. Issue #10 closed.
- **Parallel multi-model swarms** (each in an isolated git worktree — no file collision):
  a **Codex `$ultragoal`** asset + Playwright swarm in `/home/ark/rtb-codex`
  (`codex/assets-juice`), and a **Grok** Sticker-Book + reward-lore workstream staged in
  `/home/ark/rtb-grok` (`grok/sticker-lore`) — Grok's autonomous run is pending Shane's
  approval (the `--always-approve` gate was blocked by the permission classifier).

### Cycle 5 — 2026-06-03 — No-Fail copy guard
- Hardened `containsHarshFailureLanguage`: context-aware shaming detection (flags
  "you failed/lost", "loser", "try harder") that no longer false-flags the reassuring
  "There is no fail state." copy. Added a corpus test over the mission intro panels.
  76 tests green.

### Cycle 6 — 2026-06-03 — Warmer, star-scaled celebration
- `createCelebrationPlan` now always celebrates (1★ → "You did it!", never a lesser
  message — No-Fail), scales confetti with stars, and its message is asserted
  non-harsh via the Cycle-5 guard. 78 tests green.

### Cycle 7 — 2026-06-03 — Integrate the Codex asset pipeline + e2e harness
- Merged `codex/assets-juice` into `continuous-refinement` (auto-merged, **no conflicts**):
  original CC0 SVG art (characters / props / fx / ui), an `AssetCatalog` manifest +
  `PreloadScene` loading with placeholder fallback, and a Playwright e2e smoke harness
  (`E2EBridge`, `tests/e2e`, `run-e2e`). The Codex swarm's run hit a transient
  model-capacity error before its final gate; its work was preserved on its branch
  (`471c4de`), verified green, then merged. **81 tests green**, typecheck + build clean.
  (Playwright browser binaries not yet installed; `npm run test:e2e` is wired but pending
  `@playwright/test`.)

### Cycle 8 — 2026-06-03 — Sticker Book + reward lore (#14, Grok-assisted)
- New read-only **Sticker Book**: `data/stickers.ts` (childPoem/parentNote lore generated
  by the **Grok** model, best-of-n, curated, in the warm project voice), `StickerCatalog.ts`
  (pure, 5 tests incl. a completeness invariant against mission + secret ids),
  `StickerBookScene.ts` (grid + a "read it again" reading page), reachable via a "My Stickers"
  button on the Town Map. The three secret stickers show as gentle silhouettes until found
  (PRD acceptance criterion #7). **86 tests green.** Issue #14 closed.
- Grok ran in the allowed single-turn content-generation mode (its autonomous build is still
  pending Shane's approval of the `--always-approve` gate).
