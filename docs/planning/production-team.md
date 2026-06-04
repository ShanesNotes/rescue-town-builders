# Production team — Rescue Town Builders as a complete, masterpiece-grade game

> **Mandate (Shane, 2026-06-04, expanded):** apply the locked Hearthlight direction + satisfying
> mechanics to the **ENTIRE game** — every scene AND the **full PRD v0.1.0 roadmap characters**
> (Epic H). **No more checkpoints** — keep working until the game is done and polished. **Push to
> the GitHub remote continuously** as work lands. Run like a full studio: Claude orchestrates;
> Codex (`$ultragoal`) + Grok run long lanes, redelegated in waves; PixelLab animates; a roster of
> subagents covers art, UI, research, QA, child-playtest, critique, simplification, architecture.
>
> **ADR-0006 update (Shane, 2026-06-04):** Shane (the human gate-holder) has explicitly opened the
> roadmap — the backlogged characters/missions may now be BUILT, not just concepted. The No-Fail,
> IP-safe, and pre-reader guardrails still hold. Polish the 3-mission core to "done" first, then
> expand mission-by-mission on the reusable framework.

This file is the durable spine. It extends — does not replace —
[long-running-plan.md](long-running-plan.md) (ratified tri-model loop + file-ownership manifest
+ ADR-0006 gate) and [art-masterpiece-goal.md](art-masterpiece-goal.md) (the art telos).

## The studio (who does what)

| Role | Agent | Lane |
| --- | --- | --- |
| **Showrunner / lead engineer** | **Claude (me)** | Orchestration, scene rebuilds, game-feel mechanics, the light-from-darkness progression, the hidden soul, integration, **sole merge authority**, verification. |
| **Asset & content engine (`$ultragoal`)** | **Codex** | All remaining original Hearthlight art via image-gen — mission backdrops, props, UI kit, FX — plus render-wiring, a sprite/animation helper, deeper visual e2e. Worktree `rtb-codex`, branch `codex/hearthlight-art`. Commits per phase, never merges. |
| **Creative director** | **Grok** | Icon-first copy, per-mission lore + character voice, image-gen prompts for new assets, mood. Worktree `rtb-grok`, branch `grok/hearthlight-prompts`. Merge-safe files only. |
| **Living-character animator** | **PixelLab** (tincture-of-mercy `tools/sprites`) | AI pixel-art **animation** — idle/walk runtime sheets for the four heroes, fed the existing Codex art as a style reference so identity holds. Budget: **~121 generations left** — surgical use only. |

### Subagent roster (delegated per wave; redelegated as lanes free up)
Sprite/animation · UI/UX element surgeon · OSS/GitHub feature research · Kenney inspiration
scout · SFX sourcing · Playwright QA · **child-playtest simulator** (clicks every button on
every scene) · game-design critic · codebase simplifier · architecture (`/improve-codebase-architecture`)
· code reviewer · Codex liaison (`/grill-with-docs --auto` design meetings).

## Cadence — the production wave (repeat until complete)
1. **Intelligence** — a parallel Workflow fans out critic + research + QA + child-playtest +
   architecture over the *current* build → structured findings.
2. **Plan** — Claude turns findings into prioritized slices below (owners + acceptance).
3. **Produce** — Claude rebuilds scenes/mechanics; Codex renders art; Grok writes copy/prompts;
   PixelLab animates. Background lanes run while Claude builds hands-on.
4. **Integrate + verify** — Claude merges each branch (`--no-ff`), re-runs build + e2e +
   screenshots; art changes must pass *real-render* checks, not callback-only.
5. **Critique + playtest-sim** — adversarial review + the child-sim; log in
   [continuous-refinement.md](continuous-refinement.md); redelegate the lanes.

Guardrails (never crossed): IP-safe **original** art; **No-Fail**; localStorage-only;
browser-first Phaser 4; ADR-0006 (new missions stay concept-only until Willem's real
play-test evidence); only Claude merges to `main`.

---

## The backlog — epics & slices (issues)

Status: ☐ todo · ◐ in flight · ☑ done. Owner in **bold**.

### EPIC A — Hearthlight across every surface  *(Claude code · Codex art)*
- ☑ **A0** Title reborn — pixel font, grounded heroes, heroic glow. *(f243cd2)*
- ☑ **A1** Town Map reborn — dusk-town hub; icon-coins; heroes + lanterns that light on rescue. *(e657779)*
- ☑ **A2** Profile select — hero portrait coins; "+ New"; icon corners. *(committed)*
- ◐ **A3** Recycling Run — composed yard (backdrop landed); needs drag-to-bin + juice. *(next)*
- ☐ **A4** House Builder — construction lot (backdrop landed); drag-snap parts + dust/confetti.
- ☐ **A5** Fire Fix — dusk picnic (backdrop landed); real-time spray + water particles.
- ☑ **A6** Mission Complete — "A Window Glows": stars cascade, sticker pop, confetti, sound. *(committed)*
- ☐ **A7** Sticker Book — a Hearthlight album you want to fill.
- ☐ **A8** Parent Settings (+ gate) — calm, icon-first.

### EPIC B — Living characters  *(Claude + sprite subagent · PixelLab)*
- ☐ **B1** Idle anims for Rivet/Brick/Ember/Cluckle (reference = existing Codex art) → sheets.
- ☐ **B2** Walk anims for town + mission movement.
- ☐ **B3** Integrate animated sprites (replace static images on title/town/missions).
- ☐ **B4** Sprite helper: load sheet + play named anim, honoring `motionAllowed`.

### EPIC C — Game feel & mechanics depth  *(Claude)*
- ◐ **C1** Light-from-darkness progression — lantern-lights-on-rescue seeded on the Town Map;
  still to do: town opens dim → warms as more are saved; lit-house bloom.
- ☑ **C2** Juice kit — `Juice.ts`: punch/squashStretch/shake/burst/confetti, reduced-motion safe. *(4002578)*
- ☐ **C3** Mechanic depth per mission — drag/snap feel, encouraging feedback, no-fail nudges,
  a satisfying "completion" beat. Make each loop *fun to repeat*.
- ☐ **C4** Audio — convert `Rescue-town-builders.wav` → OGG, swap behind `MusicSystem`; build a
  CC0 SFX palette (tap, success, sparkle, build, water, star) routed through the audio seam.

### EPIC D — UI/UX system  *(Claude code · Codex art · Grok copy)*
- ☐ **D1** Icon-coin everywhere — retire the rectangle word-buttons (back/settings/help as coins).
- ☐ **D2** Framed 9-slice panel kit for dialogs + HUD.
- ☐ **D3** HUD — stars/progress as icons, consistent placement per scene.
- ☐ **D4** De-wordify pass — every scene legible to a pre-reader (Grok copy).
- ☑ **D5** Robust input — pointerup-guarded press model + `bindIntents` listener-leak fix + tap
  SFX; unit test locks it. The P0 button bug is fixed. *(4002578)*

### EPIC E — The soul  *(Claude · Shane owns the words)*
- ☐ **E1** Art-direct the three secret reveals (Cluckle's microcosm, Hidden Light, Secret Friend).
- ☐ **E2** Hidden Light — **Dad's words to Willem.** *(Shane writes the text; Claude wires it.)*

### EPIC F — Quality & architecture  *(subagent panel, recurring)*
- ☐ **F1** Integration verification harness — texture-key + non-blank-canvas + 404/console scan
  + per-scene screenshots + portrait/landscape fit.
- ☐ **F2** Child-playtest simulator — click every button on every scene; flag dead/confusing UI.
- ☐ **F3** Game-design critique cycle (recurring).
- ☐ **F4** Codebase simplification + `/improve-codebase-architecture` pass.
- ☐ **F5** Code review per integration.

### EPIC G — Future content  *(Grok concept + research)*
- ☐ **G1** OSS/GitHub feature research → concept backlog (mechanics/juice patterns).
- ☑ **G2** ADR-0006 opened by Shane (2026-06-04) — roadmap may now be built (see Epic H).

### EPIC H — The full PRD roadmap  *(authorized 2026-06-04; build on the reusable framework)*
Reuse the 4 proven mechanic archetypes so new missions are mostly art + data + a thin scene:
**sort** (Recycling), **build-sequence** (House), **move-aim-spray** (Fire), **match/place** (new).
- ☐ **H1** Frog Flight — *Wings* — fly through rings, rescue a frog (move-aim archetype).
- ☐ **H2** Scooter Bear Roundup — *Scoot* — gentle herding (move archetype).
- ☐ **H3** Safety Lights Chase — *Dash* — traffic-light timing + soft grapple.
- ☐ **H4** Recycled Inventions — *Reed* — combine parts into gadgets (build archetype).
- ☐ **H5** Bike Explorer — *Milo* — neighborhood map exploration.
- ☐ **H6** Goo Cleanup — *Mayor Grumble* — spray/clean goo (move-aim archetype).
- ☐ **H7** Dream Statues — *Mayor Merry* — whimsical statue placement (place archetype).
- ☐ **H8** Chicken Inverse Dream — *Cluckle* — opposite/inverse matching (the soul hen plays!).
- ☐ **H9** Treasure Boat — *Captain Coral* — boat movement + open treasure.
- ☐ **H10** Bakery Bread Rush — *Baker Benny* — recipe sequencing (build archetype).
- ☐ **H11** Asteroid Blaster — *Nova Noodle* — aim foam stars (move-aim archetype).
Each: Grok identity+lore → Codex character + scene art → Claude scene on the framework → No-Fail + juice.

---

## Decisions reserved for Shane
- **E2** the Hidden Light message (Dad's words to Willem).
- Final approval to **merge the Hearthlight campaign to `main`** once it beats the current build.
- The ADR-0006 play-test gate — only Willem + Shane can open it.
