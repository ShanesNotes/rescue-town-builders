# Intel wave 1 — findings & re-sequenced plan

> Produced 2026-06-04 by the production-team intelligence Workflow (7 specialists → synthesis:
> game-design critic, OSS research, Kenney scout, SFX sourcing, architecture, child-playtest, QA).
> 558k tokens, 230 tool calls. This re-sequences the [production-team backlog](production-team.md).

## The single most important finding — the P0 root cause (button bug + juice blocker)

One pattern, repeated, causes *both* the intermittent "buttons sometimes don't work" bug **and**
blocks every animation:

1. **Buttons confirm on `pointerdown`** (Button.ts) — fires at touch-*start*, so a drag, a scroll,
   or a tap landing during a teardown registers; the release is never required.
2. **`scene.restart()` is used for state updates** (13 sites) — it destroys all GameObjects, re-runs
   `create()`, and re-fades (160 ms). A child's second tap lands on a half-built input plane and is
   silently dropped. It also **kills any tween/particle/count-up mid-frame** → no juice is possible.
3. **Zero listener cleanup** — every `create()` re-adds keyboard+gamepad listeners with no
   `removeAllListeners`, so each restart **stacks** handlers; one keypress fires N times →
   nondeterministic = "intermittent".

**Fix order is a hard dependency, not a suggestion** (build juice before this and the work is wasted):

## P0 sequence (do in this order)
1. **[D] Input model** — confirm on `pointerup` guarded by a `pointerdown`-began flag (keep the
   press-squash on down); add `bindIntents()` that clears prior listeners first (leak safety net);
   wire a **tap SFX** on press (the most-pressed control is currently silent). ✅ this commit
2. **[C] `Juice.ts`** — punch / squashStretch / shake / burst, each early-returns on reduced-motion. ✅ this commit
3. **[F] Kill `scene.restart()`-as-state** — give each mission a `render(state)` path that mutates
   GameObjects in place; reserve fadeIn for true scene *changes*. (Lands per-mission during deepening.)
4. **[C1] Light-from-darkness reward** — town opens dim; each completed mission lights its
   house/lantern with an additive candle-gold bloom; ambient warms as more are saved.
5. **[C] Mission Complete** staggered celebration (mostly done in A6; enhance with count-up + panel).
6. **[C/A] Deepen the 3 missions in place** — drag-to-bin Recycling, drag-snap House Builder,
   real-time Fire Fix (Ember tweens, water particle stream, flame shrinks — drop the numeric labels).

## Quick wins (high signal, low effort)
- Tap SFX on every press (done here). • Gentle **non-buzzer** try-again bloop on wrong (No-Fail).
- Remove raw engine strings from the child layer (mapNodeIds, sticker IDs, "driven by the
  MissionRegistry"). • Inset the clipped Back-to-Map coin (done in A6). • Drop a CC0 win-jingle.

## Redelegation briefs
- **Codex** → mission PROPS (recycle bins + item silhouettes, house parts, calm picnic flame +
  water/hose), profile face-coins + gear coin, **recolor** CC0 Kenney particles (confetti/smoke/
  sparkle) to the locked palette for the Juice kit, and a soft window-bloom sprite.
- **Grok** → de-wordify the child layer (kill raw IDs), wordless streak/celebration vocabulary,
  the three secret-reveal lore, and parent-layer copy moved out of the child path.

## Guardrails the wave re-affirmed
- **No-Fail**: a streak never resets-to-zero or shows negative; a wrong answer springs back, never
  blocks; the try-again cue is gentle, never a descending buzzer. Bake into mission tests.
- **ADR-0006**: deepen the 3 real missions; the tempting "Naming-the-Animals" hybrid stays
  concept-only G-backlog until Willem's recorded play-test.
- **IP/CC0 audio only** — Kenney / OpenGameArt-CC0 / freesound-CC0. NOT Pixabay/Mixkit/Zapsplat.
  Re-encode to OGG, gentle ~-16 LUFS / peak 0.18.
- Several earlier critic/playtest items are **already resolved** at HEAD (Town Map, stars, depth) —
  re-verify current state before acting (the synthesis flagged this).
