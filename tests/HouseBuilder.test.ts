import { describe, expect, it } from 'vitest';
import { houseBlueprints } from '../src/game/data/houseBlueprints';
import { createHouseBuilderState, getHouseBuilderResult, placeHousePart } from '../src/game/systems/HouseBuilder';

describe('HouseBuilder', () => {
  it('defines three house blueprints with the required construction order', () => {
    expect(houseBlueprints).toHaveLength(3);
    for (const blueprint of houseBlueprints) {
      expect(blueprint.parts.map((part) => part.id)).toEqual([
        'foundation',
        'walls',
        'roof',
        'door',
        'decoration',
      ]);
    }
  });

  it('keeps the same snap target and gives a hint after a wrong piece', () => {
    const state = createHouseBuilderState(houseBlueprints);
    const outcome = placeHousePart(state, 'roof');

    expect(outcome.correct).toBe(false);
    expect(outcome.hint).toMatch(/foundation/i);
    expect(outcome.state.currentHouse?.id).toBe(houseBlueprints[0]?.id);
    expect(outcome.state.currentPart?.id).toBe('foundation');
    expect(outcome.state.completed).toBe(false);
  });

  it('CF-2: repeated confirm on the part at currentPartIndex advances cleanly through every part', () => {
    // Mirrors the scene confirm intent (HouseBuilderScene places ORDER[currentPartIndex]). Each
    // confirm must be correct and advance the index, never stick on a stale wrong part.
    const ORDER: ReadonlyArray<'foundation' | 'walls' | 'roof' | 'door' | 'decoration'> = [
      'foundation',
      'walls',
      'roof',
      'door',
      'decoration',
    ];
    let state = createHouseBuilderState(houseBlueprints);
    let confirms = 0;
    while (!state.completed && confirms < 100) {
      const required = ORDER[state.currentPartIndex];
      expect(required).toBeDefined();
      const outcome = placeHousePart(state, required!); // confirm on the glowing required part
      expect(outcome.correct).toBe(true); // never a stale/wrong pick
      state = outcome.state;
      confirms += 1;
    }
    expect(state.completed).toBe(true);
    expect(confirms).toBe(houseBlueprints.length * ORDER.length); // exactly parts-per-house * houses
  });

  it('builds three houses and unlocks a sticker', () => {
    let state = createHouseBuilderState(houseBlueprints);

    while (!state.completed) {
      const nextPart = state.currentPart;
      if (!nextPart) throw new Error('Expected next house part');
      state = placeHousePart(state, nextPart.id).state;
    }

    const result = getHouseBuilderResult(state);
    expect(result.completed).toBe(true);
    expect(result.missionId).toBe('house-builder');
    expect(result.stars).toBe(3);
    expect(result.stickersUnlocked).toContain('house-builder-starter');
    expect(result.stats.housesBuilt).toBe(3);
  });
});
