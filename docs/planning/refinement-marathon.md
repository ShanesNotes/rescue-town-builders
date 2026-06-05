# Refinement Marathon — autonomous polish loop

> **Started:** 2026-06-04. **Operator:** Claude (orchestrator), fully autonomous.
> **Mode:** ultracode — multi-agent Workflow fan-out + tri-model swarm (Codex, Grok) + Playwright
> ground truth. Self-paced `/loop` targeting an ~8-hour marathon.

## Telos / the `/goal`

Take Rescue Town Builders from *feature-complete & shippable* to **unbelievable and professional** —
a bug-free, joyful, surprising gift for Willem (~4–7). Every creative/design/engineering decision is
made by the orchestrator. Nothing waits for HITL **except** the final merge-to-`main` "ship to Willem"
call, which stays Shane's reserved nudge.

### Success criteria (verifiable)

1. **Zero** console errors / 404s / blank canvases across all 14 missions + every menu (Playwright-verified).
2. **No dead taps, no soft-locks.** Every interaction gives feedback; the No-Fail contract is intact end-to-end.
3. **Non-reader playable.** A 5-year-old who can't read knows "what do I do" in every scene (icon-first + audio).
4. **Professional polish bar** (Toca Boca / Sago Mini tier): cohesive art, juice on every interaction,
   satisfying audio, smooth transitions, delightful surprises/secrets, good pacing across a session.
5. **Gates always green:** `npm run typecheck` + `npm test` (≥113) + `npm run build` + Playwright e2e smoke.
6. Backlog driven to **zero P0/P1**; P2/P3/wow as far as the marathon budget allows.

## Roles / leverage (the team I orchestrate)

- **Claude (me)** — orchestrator + game-feel mechanics + the hidden Secrets soul + audio + verification +
  **sole merge authority**. Runs the loop and the ultracode **Workflow** for fan-out (multi-finder audits,
  adversarial verification panels, design synthesis, parallel implementation in worktrees).
- **Codex** (`codex exec`, `/home/ark/rtb-codex`) — independent different-model audits (read-only) and
  asset/content production (workspace-write, sandboxed + network). Commits to its branch; never merges.
- **Grok** (`grok --cwd /home/ark/rtb-grok`) — creative direction: lore/voice/copy polish on merge-safe
  `docs/design/**` + string-only data. Never mechanics or ADRs.
- **Playwright** — ground-truth child-playthrough: screenshots of every scene + console/404 scan.
- **`.omx/ultragoal`** — historical MVP foundation (G001–G010). Do not re-litigate; refine on top.

## The loop (each wave)

1. **Pull/integrate** — `git fetch --all`; fold merge-safe Codex/Grok branches; rebase backlog.
2. **Pick** — next batch from `child-playthrough-backlog.md` (P0 → P1 → P2 → wow), respecting effort budget.
3. **Implement** — Workflow fan-out, one agent per item; TDD where unit-testable; worktree isolation for
   parallel file mutation. Different-model Codex consult on anything subtle.
4. **Adversarially verify** — skeptic agents try to refute each fix; Playwright captures real evidence.
5. **Gates** — typecheck + test + build + e2e. Never commit red.
6. **Commit + push** — one focused commit per wave; append the wave ledger below.
7. **Schedule next wake** — self-paced; continue until backlog P0/P1 are zero or the marathon budget is spent.

## Guardrails (unchanged, hard)

- **No-Fail** always. **localStorage-only.** **IP-safe** (no real-brand resemblance).
- **Render-in-place** — never `scene.restart()` for state; `pointerup` buttons; `bindIntents` cleanup.
- **Merge to `main` = Shane's call** (the real ship-to-Willem moment). Everything upstream of that is autonomous.
- **Don't rebuild what exists.** This is refinement, not a redesign. Preserve mission ids + save compatibility.

## Open inputs folded into this marathon

- **PR #20 (merged)** lightly pivoted Recycling Run → Reuse Workshop. **PR #22 (open, CONFLICTING)** is a
  richer pivot (blueprints, parts, narrative House Builder, e2e). Treat #22 as a *design input*: harvest its
  best mechanics on top of current `main` rather than fighting the merge; note disposition in the ledger.

## Wave ledger (append-only)

| Wave | Focus | Items | Gates | Commit |
| --- | --- | --- | --- | --- |
| 0 | Pull latest (ff to 824f67d, folded Reuse Workshop #20), baseline, plan, 14-agent analysis + Codex audit → 37-item backlog | — | typecheck✓ test✓(113) e2e✓(6) | docs only |
| 1 | Touch-critical safety: P0-01 house ghost-tap, P0-02 bindPress disarm, P1-01 music-not-silent | 3 | typecheck✓ test✓(114) build✓ e2e✓(6) | 2e0e584 |
| 2 | Input parity & safety: new ChoiceModal + HoldGate controllers → P0-03 exit soft-lock, P0-04 gamepad gate bypass, P1-11 one-tap save-wipe, P2-05 journey keyboard, P2-06 profile keyboard, P2-09 picture-first exit (+font) | 6 | typecheck✓ test✓(114) build✓ e2e✓(6) | (this commit) |

**Next:** Wave 3 — Non-reader onboarding: P1-03 intro beat (all missions), P1-02 profile heroes tappable, P1-06 house tray highlight, P2-04 match wrong-tap guide, P3-02 secret-reveal font, P3-09 preload font. Then Waves 4–8 per [child-playthrough-backlog.md](./child-playthrough-backlog.md).

**Multi-model engagement (per wave):** Codex (workspace-write, `/home/ark/rtb-codex`) → asset payoffs Waves 6+ (invention sprites, helper drone, house accents, diorama props) + independent re-audit. Grok (`/home/ark/rtb-grok`) → onboarding microcopy (Wave 3) + VO script (Wave 8). Claude owns all scene/system mechanics.
