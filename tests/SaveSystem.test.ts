import { describe, expect, it, vi } from 'vitest';
import { SaveSystem, type StorageLike } from '../src/game/systems/SaveSystem';
import { Secrets } from '../src/game/systems/Secrets';

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

  it('starts a new profile with audible music (No-Fail: the world is never silent on first run)', () => {
    const profile = new SaveSystem(memoryStorage()).createProfile({ name: 'Willem', avatarId: 'rivet' });
    expect(profile.settings.musicVolume).toBeGreaterThan(0);
    expect(profile.settings.musicVolume).toBe(0.35);
    expect(profile.settings.audioMuted).toBe(false);
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

  it('backs up unreadable save data instead of silently discarding it', () => {
    const storage = memoryStorage();
    storage.setItem(SAVE_KEY, '{not-json');
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    const saves = new SaveSystem(storage);

    expect(saves.getProfiles()).toEqual([]);
    expect(storage.getItem(`${SAVE_KEY}.backup`)).toBe('{not-json');
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it('backs up an unrecognized-version save before starting fresh', () => {
    const storage = memoryStorage();
    const raw = JSON.stringify({ version: 999, profiles: [], selectedProfileId: null });
    storage.setItem(SAVE_KEY, raw);
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    new SaveSystem(storage);

    expect(storage.getItem(`${SAVE_KEY}.backup`)).toBe(raw);
    warn.mockRestore();
  });

  it('normalizes a profile that is missing its progress shape without crashing', () => {
    const storage = memoryStorage();
    storage.setItem(
      SAVE_KEY,
      JSON.stringify({
        version: 1,
        profiles: [
          {
            id: 'p1',
            name: 'Willem',
            avatarId: 'rivet',
            createdAt: 'x',
            settings: { difficulty: 'easy', musicVolume: 0.2, sfxVolume: 0.5, audioMuted: false },
          },
        ],
        selectedProfileId: 'p1',
      }),
    );

    const saves = new SaveSystem(storage);
    const profile = saves.getSelectedProfile();

    expect(profile?.name).toBe('Willem');
    expect(profile?.progress.missions).toEqual({});
    expect(profile?.progress.stickers).toEqual([]);
    expect(profile?.progress.totalStars).toBe(0);
  });

  it('preserves existing stars and stickers through load normalization', () => {
    const storage = memoryStorage();
    storage.setItem(
      SAVE_KEY,
      JSON.stringify({
        version: 1,
        profiles: [
          {
            id: 'p1',
            name: 'Willem',
            avatarId: 'rivet',
            createdAt: 'x',
            settings: { difficulty: 'easy', musicVolume: 0.2, sfxVolume: 0.5, audioMuted: false },
            progress: {
              missions: { 'recycling-run': { completed: true, bestStars: 3, attempts: 2, lastPlayedAt: 'x' } },
              stickers: ['recycling-hero'],
              totalStars: 3,
            },
          },
        ],
        selectedProfileId: 'p1',
      }),
    );

    const saves = new SaveSystem(storage);
    const progress = saves.getSelectedProfile()?.progress;

    expect(progress?.missions['recycling-run']?.bestStars).toBe(3);
    expect(progress?.stickers).toContain('recycling-hero');
    expect(progress?.totalStars).toBe(3);
  });

  it('unlocks a sticker directly (for found secrets) and persists it', () => {
    const storage = memoryStorage();
    const saves = new SaveSystem(storage);
    const profile = saves.createProfile({ name: 'Willem', avatarId: 'rivet' });

    saves.unlockSticker(profile.id, 'secret-friend');

    expect(saves.getSelectedProfile()?.progress.stickers).toContain('secret-friend');
    const reloaded = new SaveSystem(storage);
    expect(reloaded.getSelectedProfile()?.progress.stickers).toContain('secret-friend');
  });

  it('does not duplicate an already-unlocked sticker', () => {
    const saves = new SaveSystem(memoryStorage());
    const profile = saves.createProfile({ name: 'Willem', avatarId: 'rivet' });

    saves.unlockSticker(profile.id, 'hidden-light');
    saves.unlockSticker(profile.id, 'hidden-light');

    const stickers = saves.getSelectedProfile()?.progress.stickers ?? [];
    expect(stickers.filter((id) => id === 'hidden-light')).toHaveLength(1);
  });

  it('throws when unlocking a sticker for an unknown profile', () => {
    const saves = new SaveSystem(memoryStorage());
    expect(() => saves.unlockSticker('nope', 'cluckle-dream')).toThrow(/Unknown profile/);
  });

  it('persists a secret touch count and rehydrates it into a fresh Secrets after reload (P1-07)', () => {
    const storage = memoryStorage();
    const saves = new SaveSystem(storage);
    const profile = saves.createProfile({ name: 'Willem', avatarId: 'rivet' });

    // A multi-tap secret needs 3 touches; the child taps it twice this session.
    const session1 = new Secrets({ touches: saves.getSelectedProfile()?.progress.secretTouches });
    expect(session1.touch('cluckle-dream')).toBeNull();
    saves.recordSecretTouch(profile.id, 'cluckle-dream', session1.getTouches('cluckle-dream'));
    expect(session1.touch('cluckle-dream')).toBeNull();
    saves.recordSecretTouch(profile.id, 'cluckle-dream', session1.getTouches('cluckle-dream'));

    // A fresh SaveSystem (refresh) + a fresh Secrets (new scene) resumes at 2 touches, so the
    // NEXT tap reveals the secret instead of resetting to zero.
    const reloaded = new SaveSystem(storage);
    expect(reloaded.getSelectedProfile()?.progress.secretTouches['cluckle-dream']).toBe(2);
    const session2 = new Secrets({ touches: reloaded.getSelectedProfile()?.progress.secretTouches });
    expect(session2.getTouches('cluckle-dream')).toBe(2);
    expect(session2.touch('cluckle-dream')).not.toBeNull();
  });

  it('loads an old save with no secretTouches field without crashing (back-compat)', () => {
    const storage = memoryStorage();
    storage.setItem(
      SAVE_KEY,
      JSON.stringify({
        version: 1,
        profiles: [
          {
            id: 'p1',
            name: 'Willem',
            avatarId: 'rivet',
            createdAt: 'x',
            settings: { difficulty: 'easy', musicVolume: 0.2, sfxVolume: 0.5, audioMuted: false },
            progress: { missions: {}, stickers: ['secret-friend'], totalStars: 0 },
          },
        ],
        selectedProfileId: 'p1',
      }),
    );

    const saves = new SaveSystem(storage);
    const progress = saves.getSelectedProfile()?.progress;

    expect(progress?.secretTouches).toEqual({});
    expect(progress?.stickers).toContain('secret-friend');
    // Recording a touch on a migrated save still works.
    saves.recordSecretTouch('p1', 'cluckle-dream', 1);
    expect(saves.getSelectedProfile()?.progress.secretTouches['cluckle-dream']).toBe(1);
  });
});
