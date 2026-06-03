import { describe, expect, it } from 'vitest';
import { recyclingItems } from '../src/game/data/recyclingItems';
import {
  createRecyclingRunState,
  getActiveRecyclingCategories,
  getRecyclingRunResult,
  sortCurrentRecyclingItem,
} from '../src/game/systems/RecyclingRun';

describe('RecyclingRun', () => {
  it('defines item data for trash, paper, plastic, metal, and compost', () => {
    expect(new Set(recyclingItems.map((item) => item.category))).toEqual(
      new Set(['trash', 'paper', 'plastic', 'metal', 'compost']),
    );
    expect(recyclingItems.length).toBeGreaterThanOrEqual(10);
  });

  it('selects bins by child-friendly difficulty', () => {
    expect(getActiveRecyclingCategories('helper')).toEqual(['trash', 'paper']);
    expect(getActiveRecyclingCategories('easy')).toEqual(['trash', 'paper', 'plastic']);
    expect(getActiveRecyclingCategories('normal')).toEqual(['trash', 'paper', 'plastic', 'metal', 'compost']);
  });

  it('retries the same item with a hint after an incorrect bin', () => {
    const state = createRecyclingRunState('normal', [
      { id: 'banana-peel', label: 'Banana peel', icon: '🍌', category: 'compost' },
    ]);

    const outcome = sortCurrentRecyclingItem(state, 'trash');

    expect(outcome.correct).toBe(false);
    expect(outcome.hint).toMatch(/compost/i);
    expect(outcome.state.currentItem?.id).toBe('banana-peel');
    expect(outcome.state.completed).toBe(false);
  });

  it('completes ten sorted items with accuracy-based stars', () => {
    let state = createRecyclingRunState('normal', recyclingItems.slice(0, 10));

    for (const item of state.items) {
      state = sortCurrentRecyclingItem(state, item.category).state;
    }

    const result = getRecyclingRunResult(state);
    expect(result.completed).toBe(true);
    expect(result.missionId).toBe('recycling-run');
    expect(result.stars).toBe(3);
    expect(result.stats.sorted).toBe(10);
  });
});
