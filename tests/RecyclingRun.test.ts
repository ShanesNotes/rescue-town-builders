import { describe, expect, it } from 'vitest';
import { recyclingItems } from '../src/game/data/recyclingItems';
import {
  chooseRecyclingItems,
  createRecyclingRunState,
  getActiveRecyclingCategories,
  getRecyclingAccuracy,
  getRecyclingRunResult,
  sortCurrentRecyclingItem,
  type RecyclingCategory,
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

  it('never blocks the mission no matter how many wrong bins a child tries (No-Fail Rule)', () => {
    let state = createRecyclingRunState('normal', recyclingItems.slice(0, 10));
    const wrongBinFor = (category: RecyclingCategory): RecyclingCategory =>
      category === 'trash' ? 'paper' : 'trash';

    for (const item of state.items) {
      for (let tries = 0; tries < 3; tries += 1) {
        const miss = sortCurrentRecyclingItem(state, wrongBinFor(item.category));
        expect(miss.completed).toBe(false);
        expect(miss.hint).not.toBeNull();
        state = miss.state;
      }
      state = sortCurrentRecyclingItem(state, item.category).state;
    }

    const result = getRecyclingRunResult(state);
    expect(result.completed).toBe(true);
    expect(result.stars).toBeGreaterThanOrEqual(1);
  });

  it('chooses items only from the active categories and cycles to fill the count', () => {
    const chosen = chooseRecyclingItems(recyclingItems, ['trash', 'paper'], 10);
    expect(chosen).toHaveLength(10);
    expect(chosen.every((item) => item.category === 'trash' || item.category === 'paper')).toBe(true);
  });

  it('throws when no source item matches the active categories', () => {
    expect(() => chooseRecyclingItems([], ['trash'], 10)).toThrow();
  });

  it('treats a clean run with zero attempts as full accuracy', () => {
    const state = createRecyclingRunState('helper', recyclingItems.slice(0, 2));
    expect(getRecyclingAccuracy(state)).toBe(1);
  });
});
