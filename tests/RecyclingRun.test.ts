import { describe, expect, it } from 'vitest';
import { recyclingItems, reuseBlueprints } from '../src/game/data/recyclingItems';
import {
  chooseRecyclingItems,
  chooseReuseBlueprints,
  createRecyclingRunState,
  getActiveRecyclingCategories,
  getActiveReusePartKinds,
  getRecyclingAccuracy,
  getRecyclingRunResult,
  sortCurrentRecyclingItem,
  tryReusePart,
  type RecyclingCategory,
} from '../src/game/systems/RecyclingRun';

describe('RecyclingRun reuse workshop', () => {
  it('defines rescued item data for every material and reuse part kind', () => {
    expect(new Set(recyclingItems.map((item) => item.category))).toEqual(
      new Set(['trash', 'paper', 'plastic', 'metal', 'compost']),
    );
    expect(new Set(recyclingItems.map((item) => item.partKind))).toEqual(
      new Set(['soft', 'sheet', 'tube', 'shiny', 'grow']),
    );
    expect(recyclingItems.length).toBeGreaterThanOrEqual(10);
  });

  it('selects invention part kinds by child-friendly difficulty', () => {
    expect(getActiveReusePartKinds('helper')).toEqual(['sheet', 'tube']);
    expect(getActiveReusePartKinds('easy')).toEqual(['sheet', 'tube', 'shiny']);
    expect(getActiveReusePartKinds('normal')).toEqual(['soft', 'sheet', 'tube', 'shiny', 'grow']);
    expect(getActiveRecyclingCategories('helper')).toEqual(['paper', 'plastic']);
  });

  it('chooses blueprints that only require active part kinds', () => {
    const helperBlueprints = chooseReuseBlueprints(reuseBlueprints, getActiveReusePartKinds('helper'), 2);
    expect(helperBlueprints).toHaveLength(2);
    expect(helperBlueprints.every((blueprint) => blueprint.slots.every((slot) => ['sheet', 'tube'].includes(slot.kind)))).toBe(true);
  });

  it('helper mode yields two DISTINCT blueprint ids (no identical invention twice) (P1-04)', () => {
    const helperBlueprints = chooseReuseBlueprints(reuseBlueprints, getActiveReusePartKinds('helper'), 2);
    const ids = helperBlueprints.map((blueprint) => blueprint.id);
    expect(new Set(ids).size).toBe(2);
  });

  it('does not always put the correct choice card at index 0 across slots (P1-05)', () => {
    const blueprints = chooseReuseBlueprints(reuseBlueprints, getActiveReusePartKinds('helper'), 2);
    let state = createRecyclingRunState('helper', chooseRecyclingItems(recyclingItems, ['paper', 'plastic'], 6), blueprints);

    const matchIndices: number[] = [];
    while (!state.completed) {
      matchIndices.push(state.choices.findIndex((choice) => choice.isMatch));
      const matchingChoice = state.choices.find((choice) => choice.isMatch)!;
      state = tryReusePart(state, matchingChoice.id).state;
    }

    // The correct card must appear somewhere other than index 0 on at least one slot.
    expect(matchIndices.length).toBeGreaterThan(1);
    expect(matchIndices.every((index) => index === 0)).toBe(false);
    expect(matchIndices.every((index) => index >= 0)).toBe(true);
  });

  it('shuffles choices deterministically — same slot yields the same order on a rebuilt run (P1-05)', () => {
    const blueprints = chooseReuseBlueprints(reuseBlueprints, getActiveReusePartKinds('helper'), 2);
    const items = chooseRecyclingItems(recyclingItems, ['paper', 'plastic'], 6);
    const first = createRecyclingRunState('helper', items, blueprints);
    const second = createRecyclingRunState('helper', items, blueprints);
    expect(first.choices.map((choice) => choice.id)).toEqual(second.choices.map((choice) => choice.id));
  });

  it('turns a matching rescued item into a placed invention part', () => {
    const blueprints = [reuseBlueprints.find((blueprint) => blueprint.id === 'bubble-sprinkler')!];
    let state = createRecyclingRunState('helper', chooseRecyclingItems(recyclingItems, ['paper', 'plastic'], 6), blueprints);
    const matchingChoice = state.choices.find((choice) => choice.isMatch)!;

    const outcome = tryReusePart(state, matchingChoice.id);
    state = outcome.state;

    expect(outcome.correct).toBe(true);
    expect(outcome.placedPart?.item.id).toBe(matchingChoice.id);
    expect(state.placedParts).toHaveLength(1);
    expect(state.currentSlotIndex).toBe(1);
  });

  it('makes wrong pieces become decorations, then helper-snaps the needed part (No-Fail Rule)', () => {
    const blueprints = [reuseBlueprints.find((blueprint) => blueprint.id === 'bubble-sprinkler')!];
    let state = createRecyclingRunState('helper', chooseRecyclingItems(recyclingItems, ['paper', 'plastic'], 6), blueprints);
    const wrongChoice = state.choices.find((choice) => !choice.isMatch)!;

    const firstMiss = tryReusePart(state, wrongChoice.id);
    expect(firstMiss.decorated).toBe(true);
    expect(firstMiss.assisted).toBe(false);
    expect(firstMiss.state.currentSlotIndex).toBe(0);
    state = firstMiss.state;

    const secondMiss = tryReusePart(state, wrongChoice.id);
    expect(secondMiss.decorated).toBe(true);
    expect(secondMiss.assisted).toBe(true);
    expect(secondMiss.placedPart?.assisted).toBe(true);
    expect(secondMiss.state.currentSlotIndex).toBe(1);
  });

  it('completes inventions with accuracy-based stars and workshop stats', () => {
    const blueprints = chooseReuseBlueprints(reuseBlueprints, getActiveReusePartKinds('helper'), 2);
    let state = createRecyclingRunState('helper', chooseRecyclingItems(recyclingItems, ['paper', 'plastic'], 6), blueprints);

    while (!state.completed) {
      const matchingChoice = state.choices.find((choice) => choice.isMatch)!;
      state = tryReusePart(state, matchingChoice.id).state;
    }

    const result = getRecyclingRunResult(state);
    expect(result.completed).toBe(true);
    expect(result.missionId).toBe('recycling-run');
    expect(result.stars).toBe(3);
    expect(result.stats.inventionsBuilt).toBe(2);
    expect(result.stats.partsPlaced).toBeGreaterThanOrEqual(4);
  });

  it('keeps the legacy bin-category adapter working for e2e and old callers', () => {
    const blueprints = [reuseBlueprints.find((blueprint) => blueprint.id === 'bubble-sprinkler')!];
    const state = createRecyclingRunState('helper', chooseRecyclingItems(recyclingItems, ['paper', 'plastic'], 6), blueprints);
    const matchingChoice = state.choices.find((choice) => choice.isMatch)!;

    const outcome = sortCurrentRecyclingItem(state, matchingChoice.category);
    expect(outcome.correct).toBe(true);
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
    const state = createRecyclingRunState('helper', chooseRecyclingItems(recyclingItems, ['paper', 'plastic'], 6), [reuseBlueprints[0]]);
    expect(getRecyclingAccuracy(state)).toBe(1);
  });

  it('can complete even if a child repeatedly picks the wrong material category', () => {
    const blueprints = chooseReuseBlueprints(reuseBlueprints, getActiveReusePartKinds('normal'), 2);
    let state = createRecyclingRunState('normal', recyclingItems, blueprints);
    const wrongCategoryFor = (category: RecyclingCategory): RecyclingCategory => (category === 'paper' ? 'plastic' : 'paper');

    while (!state.completed) {
      const needed = state.choices.find((choice) => choice.isMatch)!;
      const miss = sortCurrentRecyclingItem(state, wrongCategoryFor(needed.category));
      state = miss.state;
      if (!state.completed && state.currentSlot?.kind === needed.partKind) {
        state = sortCurrentRecyclingItem(state, needed.category).state;
      }
    }

    const result = getRecyclingRunResult(state);
    expect(result.completed).toBe(true);
    expect(result.stars).toBeGreaterThanOrEqual(1);
  });
});
