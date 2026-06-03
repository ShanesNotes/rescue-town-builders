import { describe, expect, it, vi } from 'vitest';
import { SaveSystem, type StorageLike } from '../src/game/systems/SaveSystem';

const SAVE_KEY = 'rescue-town-builders.save.v1';

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

  it('persists parent settings updates for a selected profile', () => {
    const storage = memoryStorage();
    const saves = new SaveSystem(storage);
    const profile = saves.createProfile({ name: 'Player 1', avatarId: 'rivet' });

    saves.updateProfileSettings(profile.id, {
      difficulty: 'easy',
      musicVolume: 0.25,
      sfxVolume: 0,
      audioMuted: true,
    });

    const reloaded = new SaveSystem(storage);
    expect(reloaded.getSelectedProfile()?.settings).toEqual({
      difficulty: 'easy',
      musicVolume: 0.25,
      sfxVolume: 0,
      audioMuted: true,
    });
  });

  it('resets all local profile data from parent settings', () => {
    const saves = new SaveSystem(memoryStorage());
    saves.createProfile({ name: 'Player 1', avatarId: 'rivet' });

    saves.reset();

    expect(saves.getProfiles()).toEqual([]);
    expect(saves.getSelectedProfile()).toBeNull();
  });

  it('starts safely from an empty save when local storage contains invalid JSON', () => {
    const storage = memoryStorage();
    storage.setItem(SAVE_KEY, '{not-json');

    const saves = new SaveSystem(storage);

    expect(saves.getProfiles()).toEqual([]);
    expect(saves.getSelectedProfile()).toBeNull();
  });

  it('starts safely from an empty save when local storage has an unsupported version', () => {
    const storage = memoryStorage();
    storage.setItem(SAVE_KEY, JSON.stringify({ version: 999, profiles: [], selectedProfileId: null }));
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    const saves = new SaveSystem(storage);

    expect(saves.getProfiles()).toEqual([]);
    expect(saves.getSelectedProfile()).toBeNull();
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('save version 999 not recognized'));
    warn.mockRestore();
  });

  it('keeps the in-memory session playable when browser persistence is blocked', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const storage: StorageLike = {
      getItem: () => null,
      setItem: () => {
        throw new Error('quota blocked');
      },
      removeItem: () => undefined,
    };
    const saves = new SaveSystem(storage);

    const profile = saves.createProfile({ name: 'Player 1', avatarId: 'rivet' });

    expect(saves.getSelectedProfile()?.id).toBe(profile.id);
    expect(warn).toHaveBeenCalledWith('Rescue Town Builders could not save progress this time.', expect.any(Error));
    warn.mockRestore();
  });

  it('starts safely from an empty in-memory save when browser reads are blocked', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const storage: StorageLike = {
      getItem: () => {
        throw new Error('read blocked');
      },
      setItem: () => undefined,
      removeItem: () => undefined,
    };

    const saves = new SaveSystem(storage);

    expect(saves.getProfiles()).toEqual([]);
    expect(saves.getSelectedProfile()).toBeNull();
    expect(warn).toHaveBeenCalledWith('Rescue Town Builders could not read saved browser progress this time.', expect.any(Error));
    warn.mockRestore();
  });

  it('clears the in-memory reset path even when browser remove is blocked', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const storage = memoryStorage();
    const saves = new SaveSystem({
      getItem: storage.getItem,
      setItem: storage.setItem,
      removeItem: () => {
        throw new Error('remove blocked');
      },
    });
    saves.createProfile({ name: 'Player 1', avatarId: 'rivet' });

    saves.reset();

    expect(saves.getProfiles()).toEqual([]);
    expect(saves.getSelectedProfile()).toBeNull();
    expect(warn).toHaveBeenCalledWith('Rescue Town Builders could not clear saved browser progress this time.', expect.any(Error));
    warn.mockRestore();
  });
});
