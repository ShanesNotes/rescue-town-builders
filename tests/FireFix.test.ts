import { describe, expect, it } from 'vitest';
import { picnicFires } from '../src/game/data/picnicFires';
import {
  applyHelperDrone,
  createFireFixState,
  getFireFixResult,
  moveFirefighter,
  sprayWater,
} from '../src/game/systems/FireFix';

describe('FireFix', () => {
  it('moves the firefighter and stores the aim direction for one-handed controls', () => {
    const state = createFireFixState(picnicFires);
    const moved = moveFirefighter(state, { x: 1, y: 0 });

    expect(moved.player.x).toBeGreaterThan(state.player.x);
    expect(moved.aim).toEqual({ x: 1, y: 0 });
  });

  it('shrinks a cartoon fire when water is sprayed in range and direction', () => {
    const state = createFireFixState([{ id: 'grill-fire', label: 'Grill fire', x: 360, y: 260, health: 2, maxHealth: 2 }]);
    const aimed = moveFirefighter(state, { x: 1, y: 0 });
    const outcome = sprayWater(aimed);

    expect(outcome.hit).toBe(true);
    expect(outcome.state.fires[0]?.health).toBe(1);
    expect(outcome.state.completed).toBe(false);
  });

  it('can extinguish all fires and produce a saved mission result', () => {
    let state = createFireFixState([{ id: 'barrel-fire', label: 'Barrel fire', x: 360, y: 260, health: 1, maxHealth: 1 }]);
    state = moveFirefighter(state, { x: 1, y: 0 });
    state = sprayWater(state).state;

    const result = getFireFixResult(state);
    expect(result.completed).toBe(true);
    expect(result.missionId).toBe('fire-fix');
    expect(result.stars).toBe(3);
    expect(result.stats.firesOut).toBe(1);
  });

  it('keeps a completed state stable if Spray is pressed again', () => {
    let state = createFireFixState([{ id: 'barrel-fire', label: 'Barrel fire', x: 360, y: 260, health: 1, maxHealth: 1 }]);
    state = moveFirefighter(state, { x: 1, y: 0 });
    state = sprayWater(state).state;
    const afterDone = sprayWater(state);

    expect(afterDone.hit).toBe(false);
    expect(afterDone.completed).toBe(true);
    expect(afterDone.state).toBe(state);
  });

  it('uses a helper drone when fire pressure stays child-unfriendly', () => {
    const state = createFireFixState([{ id: 'bush-fire', label: 'Bush fire', x: 360, y: 260, health: 5, maxHealth: 5 }]);
    const assisted = applyHelperDrone(state);

    expect(assisted.helperAssists).toBe(1);
    expect(assisted.fires[0]?.health).toBeLessThan(5);
  });

  it('never strands a spray-only child who never moves (No-Fail Rule)', () => {
    // The hardest real case: a young child taps Spray from the start position and
    // never moves Ember. Only grill-fire is ever in range; the rest are out of the
    // spray cone forever. The helper drone must guarantee completion regardless.
    let state = createFireFixState(picnicFires);
    let completed = false;

    for (let i = 0; i < 40 && !completed; i += 1) {
      const outcome = sprayWater(state);
      state = outcome.state;
      completed = outcome.completed;
    }

    expect(state.completed).toBe(true);
    expect(completed).toBe(true); // the spray outcome itself must report completion

    const result = getFireFixResult(state);
    expect(result.completed).toBe(true);
    expect(result.stars).toBeGreaterThanOrEqual(1);
  });
});
