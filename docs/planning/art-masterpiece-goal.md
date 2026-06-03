# GOAL — Rescue Town Builders as an artistic masterpiece

> *A child should want to fall into this world in the first three seconds.*
> Set 2026-06-03 by Shane after the foundation build. This goal supersedes pure refinement
> for the art phase: the engine is solid; now we give it a **soul you can see**.

## Telos

Transform Rescue Town Builders from "functional but flat" into a **cohesive, imaginative,
retro-indie artistic masterpiece** with a distinct feel — the way Mario, Zelda, Stardew, and
Owlboy each have an unmistakable world. Made *for* a child, but **not softened to mush**:
atmosphere, craft, and wonder over generic roundness. Honest bar to beat: *"my son didn't
last 3 seconds wanting to explore."* We beat that.

## Non-negotiables this goal must deliver
1. **A look that invites exploration** in the first seconds (the title + town must pull you in).
2. **Buttons that always work** — fix the intermittent main-menu input bug (P0).
3. **A non-clunky viewport** — crisp, intentional, responsive rendering.
4. **Icon-first, minimal-text UI** — it must speak to a pre-reader, not lecture them.
5. **Each level visually composed and organized** — not a tray of buttons on a flat color.
6. **One cohesive art direction** matched to the warm, lush soundtrack and the hidden secrets.

Inherited guardrails (never crossed): IP-safe ORIGINAL characters; No-Fail; localStorage-only;
browser-first Phaser 4; the hidden Language-of-Creation secrets are the soul.

## Operating model (multi-model, collaborate-on-design-first)
1. **Research** (Claude swarm + web/GitHub) → 3 distinct art directions. *(in flight)*
2. **Decision gate:** Shane picks ONE direction. Art is subjective — we lock the look together
   before generating a world of assets, so we never miss the mark again.
3. **Design System** — Claude writes `docs/design/design-system.md` (palette, type, UI kit,
   atmosphere, motion) from the pick. This is the contract all assets obey.
4. **Asset production** — **Grok and Codex generate cohesive original art via their built-in
   image-generation tools**, against the design system, in isolated worktrees. Claude curates.
5. **Implement** — Claude rebuilds rendering/UI/levels (TDD + screenshot verification).
6. **Adversarial review** each cycle (the gift-readiness pattern), then iterate.
Worktree isolation is mandatory; only Claude merges to `main`; every cycle ends green and is
logged in [continuous-refinement.md](continuous-refinement.md).

---

## Directives & slices

### D1 — Lock the art direction & design system  *(blocks asset production)*
- **S1.1** Research swarm → 3 directions w/ palettes, references, mockups. *(in flight)*
- **S1.2** **Shane picks a direction.** ← current decision gate
- **S1.3** `design/design-system.md`: palette (hex), typography (bitmap/web font), UI-kit spec
  (framed panels, buttons, icons), atmosphere/lighting rules, motion language.
- **S1.4** Base resolution + rendering mode (pixel-perfect vs hi-res vector) decided & recorded (ADR).

### D2 — Viewport & rendering foundation  *(fix "clunky")*
- **S2.1** Root-cause & fix Scale.FIT pointer-mapping / centering so input is pixel-accurate.
- **S2.2** Set the base resolution + `pixelArt`/`roundPixels`/zoom (or hi-res) + a full-bleed,
  responsive canvas that feels intentional on desktop, tablet, phone.
- **S2.3** Bitmap/web-font pipeline replacing the system Trebuchet text.

### D3 — Input robustness  *(P0: "main menu buttons sometimes don't work")*
- **S3.1** Reproduce + root-cause the intermittent failure (lead hypotheses: FIT pointer offset
  from the centered canvas; the Play-button pulse tween vs. its hit area; pointerdown-on-drag).
- **S3.2** Rebuild `Button` on a robust model (pointerup + generous fixed hit area, no tween on
  the hit target, hover/press feedback decoupled); add a regression test.

### D4 — Asset production  *(after S1.3; Grok + Codex image-gen)*
- **S4.1** Character model sheet: Rivet, Brick, Ember, Cluckle, townsfolk — consistent + full of life.
- **S4.2** Town-map world: an inviting hub with parallax, landmarks, depth — not a button list.
- **S4.3** Mission scenes: recycling center, construction lot, fire/picnic — each a *composed place*.
- **S4.4** UI kit: framed panels, buttons, icons, stars, stickers, progress.
- **S4.5** FX + transitions: sparkles, water, smoke, confetti, scene wipes.
- **S4.6** Provenance/IP gate: all generated art original & IP-safe; recorded in ASSET_BACKLOG.

### D5 — De-wordify & game feel  *(the invite-to-explore hook)*
- **S5.1** Icon-first, minimal-text pass across every scene (a pre-reader should never need words).
- **S5.2** Title screen as a *wow*: a living world (parallax, character life, ambient motion), one
  obvious Play, music swelling — the 3-second hook.
- **S5.3** Juice: screen transitions, particles, camera moves, sound-coupled feedback.
- **S5.4** Town map reborn as an inviting, organized world you want to roam.

### D6 — Level aesthetics & organization
- **S6.1** Each mission visually composed: layered bg/mid/fg, framing, a readable play space.
- **S6.2** One consistent, crisp HUD per the design system.

### D7 — Audio integration
- **S7.1** Convert the exported `public/assets/audio/Rescue-town-builders.wav` → OGG and swap the
  real theme in behind `MusicSystem` (seam already exists). Loop cleanly.
- **S7.2** SFX palette retuned to match the chosen art direction.

### D8 — The soul, elevated
- **S8.1** Art-direct the three secret reveals (Cluckle's microcosm, Hidden Light, Secret Friend)
  in the new style so finding them feels like magic.
- **S8.2** First-3-seconds test — does it invite exploration? (Real playtest gate; needs Willem —
  models cannot self-certify wonder, per ADR-0006.)

## Sequencing
D1 → (D2, D3 in parallel — they unblock a usable shell) → D4 (gated on S1.3) → D5/D6 → D7/D8.
The decision gate (S1.2) is the only thing blocking the whole pipeline right now.
