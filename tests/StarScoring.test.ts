import { describe, expect, it } from 'vitest';
import { bestStars, clampStars, starsForMatch, starsFromAccuracy } from '../src/game/systems/StarScoring';

describe('StarScoring', () => {
  it('always returns mission-complete stars between one and three', () => {
    expect(clampStars(0)).toBe(1);
    expect(clampStars(2)).toBe(2);
    expect(clampStars(99)).toBe(3);
  });

  it('scores recycling-style accuracy with generous completion floor', () => {
    expect(starsFromAccuracy(0.5)).toBe(1);
    expect(starsFromAccuracy(0.7)).toBe(2);
    expect(starsFromAccuracy(0.9)).toBe(3);
  });

  it('locks the star thresholds just below each boundary', () => {
    expect(starsFromAccuracy(0.6999)).toBe(1);
    expect(starsFromAccuracy(0.8999)).toBe(2);
  });

  it('keeps the better star result', () => {
    expect(bestStars(3, 1)).toBe(3);
    expect(bestStars(0, 2)).toBe(2);
  });

  it('floors a completed Match/Journey at 2 stars; reserves 3 for a clean unassisted run (P1-08)', () => {
    expect(starsForMatch(1, false)).toBe(3); // perfect, no help → bonus
    expect(starsForMatch(0.5, false)).toBe(2); // struggled but finished → never below 2
    expect(starsForMatch(0, false)).toBe(2); // hardest-to-read mission, all wrong taps → still 2
    expect(starsForMatch(1, true)).toBe(2); // needed the auto-assist → not a clean run, capped at 2
  });
});
