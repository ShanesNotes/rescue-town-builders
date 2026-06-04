import { describe, expect, it } from 'vitest';
import { act, createAimState, getAimResult, moveAimer, type AimTarget } from '../src/game/systems/AimEngine';

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
