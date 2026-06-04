import { describe, expect, it } from 'vitest';
import { houseBlueprints } from '../src/game/data/houseBlueprints';
import { createHouseBuilderState, getHouseBuilderResult, placeHousePart } from '../src/game/systems/HouseBuilder';

describe('HouseBuilder', () => {
  it('defines three house blueprints with the required construction order', () => {
    expect(houseBlueprints).toHaveLength(3);
    for (const blueprint of houseBlueprints) {
      expect(blueprint.resident).toBeTruthy();
      expect(blueprint.wish).toMatch(/home|roof|nook/i);
      expect(blueprint.completionLine).toBeTruthy();
      expect(blueprint.parts.map((part) => part.id)).toEqual([
        'foundation',
        'walls',
        'roof',
        'door',
        'decoration',
      ]);
    }
  });

  it('turns a wrong piece into decoration without losing the snap target', () => {
    const state = createHouseBuilderState(houseBlueprints);
    const outcome = placeHousePart(state, 'roof');

    expect(outcome.correct).toBe(false);
    expect(outcome.decorated).toBe(true);
    expect(outcome.assisted).toBe(false);
    expect(outcome.hint).toMatch(/foundation/i);
    expect(outcome.state.decorativeTries).toBe(1);
    expect(outcome.state.currentHouse?.id).toBe(houseBlueprints[0]?.id);
    expect(outcome.state.currentPart?.id).toBe('foundation');
    expect(outcome.state.completed).toBe(false);
  });

  it('helper-snaps the expected part after repeated misses so a child is never blocked', () => {
    let state = createHouseBuilderState(houseBlueprints);
    state = placeHousePart(state, 'roof').state;
    const assist = placeHousePart(state, 'roof');

    expect(assist.correct).toBe(false);
    expect(assist.decorated).toBe(true);
    expect(assist.assisted).toBe(true);
    expect(assist.placedPartId).toBe('foundation');
    expect(assist.state.scaffoldAssists).toBe(1);
    expect(assist.state.currentPart?.id).toBe('walls');
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
    expect(result.stats.scaffoldAssists).toBe(0);
    expect(result.stats.decorativeTries).toBe(0);
  });
});
