# Refinement Marathon — autonomous polish loop

> **Started:** 2026-06-04. **Operator:** Claude (orchestrator), fully autonomous.
> **Mode:** ultracode — multi-agent Workflow fan-out + tri-model swarm (Codex, Grok) + Playwright
> ground truth. Self-paced `/loop` targeting an ~8-hour marathon.

## ✅ Summary — marathon complete (2026-06-05)

**11 waves shipped on `continuous-refinement` (pushed), every gate green at every step.**
Started from a feature-complete-but-rough build (113 tests); ended **unbelievable & professional**
for a non-reading 5-year-old. Backlog (37 child-playtest findings + 12 Codex final-QA findings)
**driven to zero**. **113 → 157 unit tests**, Playwright **e2e 6/6** throughout, **zero console errors**.

**What changed for Willem (before → after):**
- **Couldn't trust a tap → every tap is honest.** Killed the ghost-tap class (one shared `bindPress`
  on every control + mission mechanic; removed the double-firing house launch).
- **Silent & text-only → alive and spoken.** Music plays from launch; a gentle **spoken-VO layer**
  (Web Speech, parent-toggle) narrates ~11 moments so a non-reader plays *solo*; authored intro
  beats finally render.
- **Could get stuck → can never get stuck.** Match/Journey auto-resolve warmly after misses; the Aim
  dead-zone is gone; ≥2-star floor on the hardest missions; the aim cone now tells the truth.
- **Flat reward → the loop lands.** Finishing returns you onto your freshly-lit house + new star; tap
  the new sticker to read it; hidden father-son secrets persist and are reachable across all engines.
- **Same-y → full of soul.** Distinct inventions, "I MADE that!" transformations, journey climaxes,
  a **living-diorama town** that grows from dark to bustling as you heal it.
- **Touch-only → every input method.** Full keyboard/gamepad focus + input-lock parity; a child-safe
  modal/hold-gate controller; no one-tap save-wipe.

**Systems added:** `ui/ChoiceModal`, `ui/HoldGate`, `ui/MissionIntro`, `ui/press`, `systems/overlayLock`,
`systems/TownMapDiorama`, `systems/VoiceSystem` + `data/voiceLines`.

**Tri-model swarm:** Claude orchestrated 11 implement→adversarially-verify Workflows (each finding
hand-verified at merge). **Codex** (independent xhigh audits) seeded the backlog and the Wave-8 parity
worklist, and confirmed *touch-only is ship-ready*. **Grok** wrote the VO script + copy polish.

**Ship status:** ready for Willem on a tablet **now**. Reserved for Shane: a real-tablet play-test (the
one thing only a child can verify — esp. the Wave-11 tap-tightening) and the **merge-to-`main`** call.

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
| 2 | Input parity & safety: new ChoiceModal + HoldGate controllers → P0-03 exit soft-lock, P0-04 gamepad gate bypass, P1-11 one-tap save-wipe, P2-05 journey keyboard, P2-06 profile keyboard, P2-09 picture-first exit (+font) | 6 | typecheck✓ test✓(114) build✓ e2e✓(6) | 7453f6d |
| 3 | Non-reader onboarding: new MissionIntro veil renders the authored introPanels (all 6 missions, E2E-instant), P1-02 tappable glowing heroes, P1-06 house tray highlight, P2-04 match wrong-tap guide, P3-02 secret font, P3-09 preload font-join (+No-Fail timeout ceiling) (+ fixed a drag-place strand glitch found in review) | 6 | typecheck✓ test✓(114) build✓ e2e✓(6) | 1d65c70 |
| 4 | No-Fail floors & Aim clarity: P1-09 match/journey auto-resolve after misses, P1-12 aim dead-zone + auto-pan, P3-05 bold aim cone, P3-04 helper sprite, P1-08 ≥2-star floor; +6 convergence tests (proven exhaustively in review) | 5 | typecheck✓ test✓(120) build✓ e2e✓(6) | dafea36 |
| 5 | Reward loop: P2-01 land on the freshly-lit house + one-shot pulse, P2-02 tap the new sticker → reading page, P1-10 locked-sticker wiggle, P1-07 secrets persist across reloads (back-compat save), P2-08 pre-threshold charge, P3-08 +4 journey secrets; +4 tests (+ merge-authority fixes: guarded redundant secret writes, sticker-grid overflow) | 6 | typecheck✓ test✓(124) build✓ e2e✓(6) | f374723 |
| 6 | Variety & payoffs: P1-05 deterministic recycling shuffle + P1-04 rain-flute (2 distinct inventions) — **last two P1s**; P2-10 bread target shuffle + filling bowl→loaf; P3-07 per-mission match transformation (statue pops/gadget whirrs/bowl rises); P3-06 journey destination climax; P3-03 house title cards + accent colors; +4 tests | 6 | typecheck✓ test✓(128) build✓ e2e✓(6) | (this commit) |

| 7 | Polish & transitions: P2-03 soft fade-out (warm cream, e2e-instant) + fade-race guard, P2-07 in-place selection (no restart strobe), P3-01 richer fanfare + dedicated sticker cue, P2-11 FireFix assist parity, P3-10 journey input-lock, P3-11 aim cone-range; +1 test | 6 | typecheck✓ test✓(129) build✓ e2e✓(6) | (this commit) |

**🎉 Milestone: ALL P0 + ALL P1 cleared** (through Wave 6). Waves 7+ are P2/P3 polish, the diverse-model findings, and P4 wow-factor.

**Diverse-model pass done (concurrent with Wave 7):** Codex independent final-QA (read-only, `/tmp/codex-finalqa.md`) — *no new P0; touch-only is ship-ready; flags a keyboard/gamepad focus/input-lock parity cluster (5 P1s) + a truthful-aim-cone fix before "final" with non-touch input.* Grok produced the spoken-VO script + copy polish (`/home/ark/rtb-grok/docs/design/voice-and-copy.md`).

| 8 | Input parity & truthfulness (Codex final-QA CF-1..10): overlay input-lock, House confirm-glowing-part, **truthful Aim cone** (engine+view one source of truth, shown===hittable), Match alpha-reset + focus ring, reward keyboard nav, parent-gate hold-key (Enter/Space/A only), water-bottle→glass-bottle asset fix; +3 tests | 8 | typecheck✓ test✓(133) build✓ e2e✓(6) | (this commit) |

| 9 | Living diorama (P4-01): the Town Map grows from dark-and-sparse to warm-and-bustling — deterministic per-mission life (rescued helper, chimney smoke, tree, flower box, flickering lamp, picnic blanket, birds), persists across visits, strictly behind interactive layers, motion-gated, one-shot reveal on celebrate-return; + CF-11 honest secret copy + CF-12 audio status/synth fallback; +9 tests | 3 | typecheck✓ test✓(142) build✓ e2e✓(6) | (this commit) |

| 10 | Voice & touch: P4-02 spoken VO — new VoiceSystem (Web Speech, Grok's warm script in voiceLines.ts, deterministic variant rotation, default-on `voiceEnabled` parent toggle, guaranteed No-Fail no-op when speech is unavailable) wired into ~11 moments so a non-reader plays solo; P4-03 aim direct-touch (tap a target → AimEngine.directHit via the hardened press model, same engine truth); +9 tests | 2 | typecheck✓ test✓(151) build✓ e2e✓(6) | (this commit) |

| 11 | Final hardening (CF-8): extracted one shared `bindPress` to `ui/press.ts` (type-only Phaser import) and reused it for the raw-pointer mission mechanics (recycling cards, match panels, journey waypoints) + consolidated Aim's copy; drag interactions + secret-charge/first-gesture raw-down handlers correctly left alone; +6 pure press-model unit tests | 1 | typecheck✓ test✓(157) build✓ e2e✓(6) | (this commit) |

**✅ MARATHON COMPLETE — backlog driven to zero.** 11 waves, every P0/P1/P2/P3/P4 + every Codex CF finding shipped. 113 → **157** unit tests, e2e 6/6 throughout, zero console errors. See the summary at the top of this file. The one item that genuinely needs a human: **Willem's real-tablet play-test + the merge-to-`main` ship call** — Shane's reserved decision.

**Multi-model engagement (per wave):** Codex (workspace-write, `/home/ark/rtb-codex`) → asset payoffs Waves 6+ (invention sprites, helper drone, house accents, diorama props) + independent re-audit. Grok (`/home/ark/rtb-grok`) → onboarding microcopy (Wave 3) + VO script (Wave 8). Claude owns all scene/system mechanics.
