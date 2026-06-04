# Post-MVP gate evidence — roadmap expansion

This file records the ADR-0006 gate decision for registering roadmap missions beyond the three
MVP missions. ADR-0006's purpose is that an **agent may not self-expand** the roadmap — only the
human gate-holder (Shane) or Willem can open it. This documents that explicit human authorization
**honestly**. It does **not** claim a child play-test that has not happened.

Gate verdict: pass-roadmap-expansion
Authorized-by: Shane (human gate-holder)
Authorization-date: 2026-06-04
Asset intake: pass
Build + e2e: pass

## What this authorizes
Shane explicitly directed (2026-06-04): *"apply this to the entire game — even the backlogged
characters in the prdv0.1.0 … keep working until the game is done and polished."* That opens the
roadmap (Epic H) for **building on the `continuous-refinement` branch**.

## What it verifies (true at time of writing)
- **Asset intake: pass** — every roadmap character/backdrop/prop is original, IP-safe (zero
  third-party likeness), palette-locked to the 10 Hearthlight hexes, and provenance-logged in
  `docs/assets/ASSET_BACKLOG.md`. The asset-load e2e confirms all textures load non-blank.
- **Build + e2e: pass** — `npm run build`, the unit suite, and the Playwright e2e are green.

## What it does NOT claim — the gate that remains CLOSED
- **Child play-test (Willem): PENDING.** No real child/parent play-test of the roadmap missions
  has happened yet. Per ADR-0006, models cannot self-certify *fun/understandable/no-fail* — only
  Willem + Shane can. **This evidence does not assert a play-test pass.**
- Therefore the **merge to `main` remains gated** on Willem's recorded play-test (Shane's reserved
  decision). Roadmap work lives on `continuous-refinement` until then. The No-Fail, IP-safe, and
  pre-reader guardrails are enforced in every roadmap mission regardless.
