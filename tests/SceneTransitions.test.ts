import { describe, expect, it } from 'vitest';
import { SOFT_TRANSITION } from '../src/game/systems/SceneTransitions';

describe('SceneTransitions', () => {
  it('uses short white fades instead of flashing effects', () => {
    expect(SOFT_TRANSITION.fadeInMs).toBeGreaterThan(0);
    expect(SOFT_TRANSITION.fadeOutMs).toBeGreaterThan(0);
    expect(SOFT_TRANSITION.fadeInMs).toBeLessThanOrEqual(250);
    expect([SOFT_TRANSITION.red, SOFT_TRANSITION.green, SOFT_TRANSITION.blue]).toEqual([255, 255, 255]);
  });
});
