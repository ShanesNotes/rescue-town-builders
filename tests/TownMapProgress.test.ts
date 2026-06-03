import { describe, expect, it } from 'vitest';
import { missionDefinitions } from '../src/game/data/missions';
import { SaveSystem, type StorageLike } from '../src/game/systems/SaveSystem';
import { projectTownMapNodes } from '../src/game/systems/TownMapProgress';

function memoryStorage(): StorageLike {
  const values = new Map<string, string>();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  };
}

describe('TownMapProgress', () => {
  it('projects static map nodes from the mission registry', () => {
    const nodes = projectTownMapNodes(missionDefinitions, null);

    expect(nodes.map((node) => node.mapNodeId)).toEqual([
      'recycling-center',
      'construction-lot',
      'picnic-park',
    ]);
    expect(nodes.every((node) => node.bestStars === 0 && !node.completed)).toBe(true);
  });

  it('projects saved stars after fake mission completion and reload', () => {
    const storage = memoryStorage();
    const saves = new SaveSystem(storage);
    const profile = saves.createProfile({ name: 'Player 1', avatarId: 'rivet' });
    saves.recordMissionResult(profile.id, {
      missionId: 'house-builder',
      completed: true,
      stars: 2,
      score: 200,
      stickersUnlocked: ['house-builder-starter'],
      stats: { placeholder: true },
    });

    const reloaded = new SaveSystem(storage);
    const nodes = projectTownMapNodes(missionDefinitions, reloaded.getSelectedProfile());

    expect(nodes.find((node) => node.missionId === 'house-builder')).toMatchObject({
      completed: true,
      bestStars: 2,
      starsLabel: '⭐⭐',
    });
  });
});
