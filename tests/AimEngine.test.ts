import { describe, expect, it } from 'vitest';
import { act, aimHits, coneAngles, createAimState, getAimResult, moveAimer, type AimTarget } from '../src/game/systems/AimEngine';

// Two targets near the start, reachable by aiming right.
const TARGETS: AimTarget[] = [
  { id: 'a', x: 360, y: 260, health: 1, maxHealth: 1 },
  { id: 'b', x: 420, y: 260, health: 1, maxHealth: 1 },
];

describe('AimEngine', () => {
  it('clears a target in the aim cone and completes when all are out', () => {
    let state = createAimState(TARGETS); // starts at (260,260) aiming right
    const a = act(state); // 'a' at (360,260) is right + in range
    expect(a.hit).toBe(true);
    expect(a.state.targets.find((t) => t.id === 'a')?.health).toBe(0);
    expect(a.completed).toBe(false);
    const b = act(a.state); // 'b' next
    expect(b.hit).toBe(true);
    expect(b.completed).toBe(true);
  });

  it('a miss never fails; the No-Fail helper floor finishes a spray-only run', () => {
    // Aim away from both targets so every act misses; the floor must still complete it.
    let state = createAimState(TARGETS);
    state = moveAimer(state, { x: -1, y: 0 }); // aim left, targets are to the right → misses
    let completed = false;
    for (let i = 0; i < 40 && !completed; i += 1) {
      const out = act(state);
      state = out.state;
      completed = out.completed;
    }
    expect(completed).toBe(true); // drone floor guarantees it
    expect(state.targets.every((t) => t.health === 0)).toBe(true);
  });

  it('a miss is never silent: it auto-pans the hero toward the nearest live target (P1-12)', () => {
    // Far targets that no single act can reach in-cone from the start.
    let state = createAimState([
      { id: 'far', x: 820, y: 380, health: 1, maxHealth: 1 },
      { id: 'far2', x: 800, y: 360, health: 1, maxHealth: 1 },
    ]);
    state = moveAimer(state, { x: -1, y: 0 }); // aim the wrong way → a guaranteed miss
    const startX = state.player.x;
    const out = act(state);
    expect(out.hit).toBe(false);
    expect(out.autoPanned).toBe(true); // the miss moved the hero
    expect(out.state.player.x).toBeGreaterThan(startX); // toward the right-hand targets
  });

  it('acts always converge to zero remaining from any start, and the assist fires (P1-12)', () => {
    // A spread of targets the child can never line up well; the lowered floor + auto-pan must
    // still drive every target to zero within a child-plausible number of taps.
    let state = createAimState([
      { id: 'a', x: 760, y: 360, health: 2, maxHealth: 2 },
      { id: 'b', x: 180, y: 180, health: 2, maxHealth: 2 },
      { id: 'c', x: 480, y: 380, health: 1, maxHealth: 1 },
    ]);
    state = moveAimer(state, { x: 0, y: -1 }); // start aimed away from most targets
    let completed = false;
    let sawAssist = false;
    for (let i = 0; i < 60 && !completed; i += 1) {
      const out = act(state);
      state = out.state;
      completed = out.completed;
      sawAssist = sawAssist || out.assisted;
    }
    expect(completed).toBe(true);
    expect(state.targets.reduce((s, t) => s + t.health, 0)).toBe(0);
    expect(sawAssist).toBe(true); // the No-Fail helper visibly stepped in at least once
  });

  it('CF-3: the drawn cone is the real hit area — what coneAngles SHOWS is exactly what aimHits HITS', () => {
    // The scene fills coneAngles(aim) ± half clipped to range, and lights a ring / hits a target via
    // aimHits. They must agree for EVERY direction so the child never aims by a cone that lies: a
    // point the sector visually contains must be hittable, and one it excludes must not.
    const range = 190;
    for (const aim of [
      { x: 1, y: 0 },
      { x: -1, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: -1 },
      { x: 1, y: 1 },
      { x: -1, y: 1 },
    ] as const) {
      const { center, half } = coneAngles(aim);
      for (let a = 0; a < Math.PI * 2; a += Math.PI / 24) {
        const dx = Math.cos(a) * 120; // safely within range
        const dy = Math.sin(a) * 120;
        let d = a - center;
        while (d > Math.PI) d -= Math.PI * 2;
        while (d < -Math.PI) d += Math.PI * 2;
        const shownInCone = Math.abs(d) < half - 1e-6; // strictly inside avoids boundary float noise
        const shownOutOfCone = Math.abs(d) > half + 1e-6;
        if (shownInCone) expect(aimHits(aim, dx, dy, range), `aim ${aim.x},${aim.y} shown in-cone must hit`).toBe(true);
        if (shownOutOfCone) expect(aimHits(aim, dx, dy, range), `aim ${aim.x},${aim.y} shown out-of-cone must miss`).toBe(false);
      }
    }
  });

  it('CF-3: a target the cone shows in front is cleared by a single act', () => {
    // From the start (aiming right), a target placed inside the shown sector + range is hit at once.
    let state = createAimState([{ id: 't', x: 360, y: 260, health: 1, maxHealth: 1 }]); // dead-ahead, in range
    expect(aimHits(state.aim, 100, 0, state.config.range)).toBe(true);
    const out = act(state);
    expect(out.hit).toBe(true);
    expect(out.state.targets[0]?.health).toBe(0);
  });

  it('scores stars and unlocks the sticker only on completion', () => {
    let state = createAimState(TARGETS);
    state = act(state).state;
    const partial = getAimResult(state, 'fire-fix', 'demo');
    expect(partial.completed).toBe(false);
    expect(partial.stickersUnlocked).toEqual([]);
    state = act(state).state;
    const done = getAimResult(state, 'fire-fix', 'demo');
    expect(done.completed).toBe(true);
    expect(done.stars).toBeGreaterThanOrEqual(1);
    expect(done.stickersUnlocked).toEqual(['demo']);
  });
});
