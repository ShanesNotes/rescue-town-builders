import { describe, expect, it } from 'vitest';
import { SaveSystem, type StorageLike } from '../src/game/systems/SaveSystem';

function memoryStorage(): StorageLike {
  const values = new Map<string, string>();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  };
}

describe('SaveSystem', () => {
  it('creates and persists a selected local profile', () => {
    const storage = memoryStorage();
    const saves = new SaveSystem(storage);

    const profile = saves.createProfile({ name: 'Player 1', avatarId: 'rivet' });
    expect(profile.name).toBe('Player 1');
    expect(saves.getSelectedProfile()?.id).toBe(profile.id);

    const reloaded = new SaveSystem(storage);
    expect(reloaded.getSelectedProfile()?.name).toBe('Player 1');
  });

  it('limits local profiles to five', () => {
    const saves = new SaveSystem(memoryStorage());

    for (let index = 1; index <= 5; index += 1) {
      saves.createProfile({ name: `Player ${index}`, avatarId: 'rivet' });
    }

    expect(() => saves.createProfile({ name: 'Player 6', avatarId: 'brick' })).toThrow(/five profiles/i);
  });

  it('records mission completion without lowering a best star result', () => {
    const saves = new SaveSystem(memoryStorage());
    const profile = saves.createProfile({ name: 'Player 1', avatarId: 'ember' });

    saves.recordMissionResult(profile.id, {
      missionId: 'recycling-run',
      completed: true,
      stars: 3,
      score: 100,
      stickersUnlocked: ['recycling-hero'],
      stats: { sorted: 10 },
    });
    saves.recordMissionResult(profile.id, {
      missionId: 'recycling-run',
      completed: true,
      stars: 1,
      score: 10,
      stickersUnlocked: ['recycling-hero'],
      stats: { sorted: 10 },
    });

    const progress = saves.getSelectedProfile()?.progress;
    expect(progress?.missions['recycling-run']?.bestStars).toBe(3);
    expect(progress?.missions['recycling-run']?.attempts).toBe(2);
    expect(progress?.stickers).toContain('recycling-hero');
    expect(progress?.totalStars).toBe(3);
  });
});
