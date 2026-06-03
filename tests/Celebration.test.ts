import { describe, expect, it } from 'vitest';
import { createCelebrationPlan } from '../src/game/systems/Celebration';

describe('Celebration', () => {
  it('creates non-flashing celebration feedback from mission stars and stickers', () => {
    const plan = createCelebrationPlan({
      missionId: 'recycling-run',
      completed: true,
      stars: 3,
      score: 1000,
      stickersUnlocked: ['recycling-run-starter'],
      stats: {},
    });

    expect(plan.starCount).toBe(3);
    expect(plan.stickers).toEqual(['recycling-run-starter']);
    expect(plan.confettiBursts).toBeGreaterThan(0);
    expect(plan.allowsFlashing).toBe(false);
  });
});
