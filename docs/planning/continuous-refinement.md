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

### Cycle 9 — 2026-06-03 — Wire the Secrets into the scenes (#13, the soul)
- `SaveSystem.unlockSticker` + `Secrets.isSecretId` (TDD). New `secretHotspot` helper
  (`createSecretsForProfile` / `touchSecret` / `showSecretReveal`). Three quiet hotspots:
  **Hidden Light** (House, 1 touch), **Secret Friend** (Fire Fix, 3), **Cluckle's Dream**
  (Town Map, 3). A found secret chimes (`secret` sfx), persists its sticker, and shows a
  soft dismissable reveal — then lives forever in the Sticker Book with Grok's poem.
  **90 tests green.** Issue #13 closed.
- The easter egg that sparked the project (for Willem) is now playable. Dad's personal
  knob is still open: set `hiddenLightMessage` to put your own words in the Hidden Light.

### Cycle 10 — 2026-06-03 — Verify by running: e2e green + mobile fit
- Installed Playwright + Chromium and ran Codex's browser smoke harness for the first time.
  It caught two real issues. **Fixed the harness**: mission helpers now loop-until-complete
  (robust to data-driven item order); the star assertion is corrected to the No-Fail floor
  (3 missions × ≥1 star). **Fixed a real mobile layout bug**: the canvas overflowed small
  viewports because `place-items: center` sized the grid track to the 960px canvas;
  `minmax(0, 1fr)` track + `canvas { display: block }` + `max-width/height` make FIT scale
  correctly now.
- **The whole game is verified END-TO-END in a real browser**: create profile → complete all
  three missions (Fire Fix via spray-only, exercising the Cycle 1 No-Fail floor) → stickers
  unlock → save persists across refresh; and the mobile-landscape canvas fits. `npm run
  test:e2e` green (2/2); unit suite still 90 green.

### Cycle 11 — 2026-06-03 — The gift sprint: title, music, and a ratified tri-model plan
- **Pushed to origin + merged to `main`** (the outward step, now authorized): branch and main
  both on GitHub at `1afa86a`, then this sprint's work on top.
- **Real title screen** (`StartScene`): replaced the "placeholder art only" text with a sunny
  title — sky/sun/clouds, the three helpers rendered from their art with staggered idle bob,
  a pulsing Play button, warm copy. Music starts on the first gesture.
- **`MusicSystem`** (new, +5 tests): a gentle procedural WebAudio loop mirroring `SfxSystem`'s
  pluggable-sink pattern, gated live on the music slider (No-Fail). Then **synthesized Grok's
  motif** into it (G major, 76 BPM, I–IV–V–vi). Real `.aup3` theme swaps in behind `MusicSink`.
- **Three models live in parallel** (isolated worktrees): Codex (`codex/pro-assets`) rendering
  the loaded art + Kenney CC0 packs; **Grok (`grok/creative`) merged** — `creative-direction.md`
  + enriched lore (95 tests still green).
- **`design.md` (root)** locks the art/audio/UX direction (Kenney sources, Grok palette, the
  PRD specs). **`docs/planning/long-running-plan.md` ratified** via an automated `grill-with-docs
  --auto` Claude↔Codex dialogue — Codex's 5×REVISE incorporated (handoff packet, file-ownership
  manifest, identity-brief schema, real-render verification, long-running infra). **Hard rule:
  ADR-0006 stays closed until real child/parent play-test evidence — models cannot self-certify
  fun.** 95 tests green; typecheck + build clean.

### Cycle 12 — 2026-06-03 — Integrate Codex's art + verify by seeing it
- **Merged `codex/pro-assets`** (clean, no conflicts): real sprites rendered across every
  gameplay scene + Kenney CC0 packs (UI buttons, tiny-town tiles, character faces, star),
  a reusable `Sprite.ts` helper, and new recycling-item art.
- **Fixed the root SVG bug**: `PreloadScene` now loads `.svg` via `load.svg` (scale 2);
  `load.image` had rasterized SVGs as black squares in WebGL. Mission icons now render.
- **Layout polish** on the merged scenes: lowered the House ghost so the roof clears the
  title and connects to the walls (house name folded into the hint line); lowered the Fire
  Fix play panel so "There is no fail state." is no longer clipped.
- **Verified by SEEING it**: the screenshot harness captured all 8 screens; I reviewed each
  PNG — title, profile, town map, all three missions, celebration, sticker book — all show
  real art, no black squares, no clipped text. **95 unit + 3 e2e green; zero page errors or
  4xx across a full playthrough.** Codex is producing a bonus PNG batch in its worktree
  (optional; the `load.svg` fix already makes everything render).

### Cycle 13 — 2026-06-03 — Adversarial review + fixes (the gift, hardened)
- Ran a 6-dimension **ultracode review Workflow** (No-Fail, kid-UX, IP-safety, accessibility,
  visual-polish, soul) with adversarial verification (31 agents). **IP-safety: zero findings.**
  16 confirmed; fixed the ones that matter for a 6-year-old:
  - **P0 — `confirmMissionExit` (#18):** the Back button silently discarded mission progress.
    New `src/game/systems/confirmMissionExit.ts` — a gentle, stack-safe guard that defaults to
    keep-playing; wired into all three missions' back button + keyboard/gamepad back intents,
    with an `isMissionExitOpen` guard so stray input is ignored while it's open. New
    `tests/e2e/no-fail-exit.spec.ts` proves the behavior end-to-end. **ADR-0007 satisfied; #18 closed.**
  - **P1 — secrets were invisible** (18% cream-on-cream): new shared `addSecretHotspot` draws a
    soft golden glimmer that gently breathes (reduced-motion aware), so a patient child can
    actually find them. Repositioned Hidden Light clear of Brick and Secret Friend out of the
    dead corner.
  - **P1 — Fire control row clipped the canvas:** moved the hydrant up and refit the D-pad so the
    down-arrow + Back button sit fully on-screen.
  - **P1 — reduced-motion:** StartScene's pulse + idle bob now honor `motionAllowed()`.
- Bumped the Playwright timeout to 60s (the brute-force playthroughs flaked under parallel CPU
  contention; pass cleanly serially). **95 unit + 4 e2e green; every screen re-reviewed by image.**
- **Then shipped the soul centerpiece (P1):** Cluckle's Dream now blooms a **miniature glowing
  town** (two roofs, a path, a tree) inside the hotspot for one breath before the words —
  the microcosm pattern, the whole town small enough to hold in a hen's dream. New
  `tests/e2e/secret-discovery.spec.ts` finds the secret via mapped canvas taps and proves the
  sticker persists across refresh. **95 unit + 5 e2e green.**
- Deferred (logged, next cycle): ParentSettings keyboard/gamepad nav (#11, behind the parent
  gate), custom reveals for the other two secrets, arrow-symbol pre-reader playtest.
