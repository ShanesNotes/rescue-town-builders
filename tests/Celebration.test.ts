import { describe, expect, it } from 'vitest';
import { createCelebrationPlan } from '../src/game/systems/Celebration';
import { containsHarshFailureLanguage } from '../src/game/systems/AccessibilityRules';
import type { MissionResult } from '../src/game/types';

function makeResult(stars: 1 | 2 | 3, stickers: string[] = []): MissionResult {
  return { missionId: 'recycling-run', completed: true, stars, score: 0, stickersUnlocked: stickers, stats: {} };
}

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

  it('always gives a warm, non-shaming message — even at one star (No-Fail)', () => {
    for (const stars of [1, 2, 3] as const) {
      const plan = createCelebrationPlan(makeResult(stars));
      expect(plan.message.length).toBeGreaterThan(0);
      expect(containsHarshFailureLanguage(plan.message)).toBe(false);
    }
    expect(createCelebrationPlan(makeResult(1)).message).toBe('You did it!');
  });

  it('celebrates bigger as stars increase, but one star still gets a real burst', () => {
    const one = createCelebrationPlan(makeResult(1, ['recycling-run-starter']));
    const three = createCelebrationPlan(makeResult(3, ['recycling-run-starter']));
    expect(one.confettiBursts).toBeGreaterThan(0);
    expect(three.confettiBursts).toBeGreaterThan(one.confettiBursts);
    expect(three.confettiBursts).toBeGreaterThanOrEqual(8);
  });
});
