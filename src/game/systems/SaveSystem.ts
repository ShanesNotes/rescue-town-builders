import type { MissionId, MissionResult } from '../types';
import { bestStars, type StarRating } from './StarScoring';

export type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

export type Difficulty = 'easy' | 'normal' | 'helper';

export type MissionProgress = {
  completed: boolean;
  bestStars: StarRating;
  attempts: number;
  lastPlayedAt: string;
};

export type ProfileSettings = {
  difficulty: Difficulty;
  musicVolume: number;
  sfxVolume: number;
  audioMuted: boolean;
};

export type PlayerProfile = {
  id: string;
  name: string;
  avatarId: string;
  createdAt: string;
  settings: ProfileSettings;
  progress: {
    missions: Partial<Record<MissionId, MissionProgress>>;
    stickers: string[];
    totalStars: number;
  };
};

export type SaveData = {
  version: number;
  profiles: PlayerProfile[];
  selectedProfileId: string | null;
};

export type CreateProfileInput = {
  name: string;
  avatarId: string;
};

const SAVE_KEY = 'rescue-town-builders.save.v1';
const SAVE_VERSION = 1;
const MAX_PROFILES = 5;

function defaultSettings(): ProfileSettings {
  return {
    difficulty: 'helper',
    // The world is never silent on first run — a non-reader reads silence as "broken/asleep".
    // The synth lullaby is a gentle 0.05-peak loop; parents can still mute/adjust at the Grown-up gate.
    musicVolume: 0.35,
    sfxVolume: 0.7,
    audioMuted: false,
  };
}

function clampVolume(value: number): number {
  return Math.max(0, Math.min(1, Math.round(value * 100) / 100));
}

function emptySave(): SaveData {
  return {
    version: SAVE_VERSION,
    profiles: [],
    selectedProfileId: null,
  };
}

function createId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `profile-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function normalizeProgress(progress: PlayerProfile['progress'] | undefined): PlayerProfile['progress'] {
  const stickers = progress?.stickers;
  const totalStars = progress?.totalStars;
  return {
    missions: progress?.missions ?? {},
    stickers: Array.isArray(stickers) ? stickers : [],
    totalStars: typeof totalStars === 'number' ? totalStars : 0,
  };
}

function normalizeProfile(profile: PlayerProfile): PlayerProfile {
  // A loaded save may be partial (old shape, hand-edited, corrupted mid-write).
  // Fill in every field downstream readers assume so a returning child's town
  // can never crash on load (No-Fail), while keeping any real progress intact.
  return {
    ...profile,
    settings: {
      ...defaultSettings(),
      ...profile.settings,
      musicVolume: clampVolume(profile.settings?.musicVolume ?? defaultSettings().musicVolume),
      sfxVolume: clampVolume(profile.settings?.sfxVolume ?? defaultSettings().sfxVolume),
    },
    progress: normalizeProgress(profile.progress),
  };
}

export class SaveSystem {
  private data: SaveData;

  constructor(private readonly storage: StorageLike = window.localStorage) {
    this.data = this.load();
  }

  getData(): SaveData {
    return structuredClone(this.data);
  }

  getProfiles(): PlayerProfile[] {
    return this.getData().profiles;
  }

  getSelectedProfile(): PlayerProfile | null {
    const profile = this.data.profiles.find((candidate) => candidate.id === this.data.selectedProfileId);
    return profile ? structuredClone(profile) : null;
  }

  createProfile(input: CreateProfileInput): PlayerProfile {
    if (this.data.profiles.length >= MAX_PROFILES) {
      throw new Error('Rescue Town Builders supports up to five profiles.');
    }

    const now = new Date().toISOString();
    const profile: PlayerProfile = {
      id: createId(),
      name: input.name.trim() || `Player ${this.data.profiles.length + 1}`,
      avatarId: input.avatarId,
      createdAt: now,
      settings: defaultSettings(),
      progress: {
        missions: {},
        stickers: [],
        totalStars: 0,
      },
    };

    this.data.profiles.push(profile);
    this.data.selectedProfileId = profile.id;
    this.persist();
    return structuredClone(profile);
  }

  updateProfileSettings(profileId: string, settings: Partial<ProfileSettings>): PlayerProfile {
    const profile = this.data.profiles.find((candidate) => candidate.id === profileId);
    if (!profile) {
      throw new Error(`Unknown profile: ${profileId}`);
    }

    profile.settings = {
      ...profile.settings,
      ...settings,
      musicVolume: settings.musicVolume === undefined ? profile.settings.musicVolume : clampVolume(settings.musicVolume),
      sfxVolume: settings.sfxVolume === undefined ? profile.settings.sfxVolume : clampVolume(settings.sfxVolume),
    };
    this.persist();
    return structuredClone(profile);
  }

  selectProfile(profileId: string): PlayerProfile {
    const profile = this.data.profiles.find((candidate) => candidate.id === profileId);
    if (!profile) {
      throw new Error(`Unknown profile: ${profileId}`);
    }
    this.data.selectedProfileId = profileId;
    this.persist();
    return structuredClone(profile);
  }

  recordMissionResult(profileId: string, result: MissionResult): PlayerProfile {
    const profile = this.data.profiles.find((candidate) => candidate.id === profileId);
    if (!profile) {
      throw new Error(`Unknown profile: ${profileId}`);
    }

    const existing = profile.progress.missions[result.missionId];
    profile.progress.missions[result.missionId] = {
      completed: existing?.completed || result.completed,
      bestStars: existing ? bestStars(existing.bestStars, result.stars) : result.stars,
      attempts: (existing?.attempts ?? 0) + 1,
      lastPlayedAt: new Date().toISOString(),
    };

    for (const sticker of result.stickersUnlocked) {
      if (!profile.progress.stickers.includes(sticker)) {
        profile.progress.stickers.push(sticker);
      }
    }

    profile.progress.totalStars = Object.values(profile.progress.missions).reduce(
      (total, mission) => total + (mission?.bestStars ?? 0),
      0,
    );

    this.persist();
    return structuredClone(profile);
  }

  unlockSticker(profileId: string, sticker: string): PlayerProfile {
    const profile = this.data.profiles.find((candidate) => candidate.id === profileId);
    if (!profile) {
      throw new Error(`Unknown profile: ${profileId}`);
    }
    // Used for rewards earned outside a mission result (e.g. a found secret).
    if (!profile.progress.stickers.includes(sticker)) {
      profile.progress.stickers.push(sticker);
      this.persist();
    }
    return structuredClone(profile);
  }

  reset(): void {
    this.data = emptySave();
    try {
      this.storage.removeItem(SAVE_KEY);
    } catch (error) {
      // No-Fail Rule: reset should still clear the in-memory session even when
      // browser storage is unavailable or blocked.
      console.warn('Rescue Town Builders could not clear saved browser progress this time.', error);
    }
  }

  private load(): SaveData {
    let raw: string | null;
    try {
      raw = this.storage.getItem(SAVE_KEY);
    } catch (error) {
      // No-Fail Rule: blocked storage must not crash startup. Start fresh in
      // memory and let later persist attempts report their own failures.
      console.warn('Rescue Town Builders could not read saved browser progress this time.', error);
      return emptySave();
    }

    if (!raw) return emptySave();

    try {
      const parsed = JSON.parse(raw) as SaveData;
      if (!Array.isArray(parsed.profiles)) {
        return this.discardWithBackup(raw, 'Rescue Town Builders save shape not recognized; starting fresh.');
      }
      if (parsed.version !== SAVE_VERSION) {
        // Save-version upgrade point: when SAVE_VERSION changes, migrate older
        // shapes here instead of discarding. Today only v1 exists, so an
        // unrecognized version starts fresh — but the raw save is backed up
        // first (never silently lost), so a child's town stays recoverable.
        return this.discardWithBackup(
          raw,
          `Rescue Town Builders save version ${parsed.version} not recognized; starting fresh.`,
        );
      }
      return {
        version: SAVE_VERSION,
        selectedProfileId: parsed.selectedProfileId ?? null,
        profiles: parsed.profiles.map((profile) => normalizeProfile(profile)),
      };
    } catch (error) {
      return this.discardWithBackup(
        raw,
        'Rescue Town Builders could not read saved browser progress this time.',
        error,
      );
    }
  }

  private discardWithBackup(raw: string, message: string, error?: unknown): SaveData {
    try {
      this.storage.setItem(`${SAVE_KEY}.backup`, raw);
    } catch {
      // Backing up is best-effort; a blocked or full store must not crash startup.
    }
    if (error === undefined) {
      console.warn(message);
    } else {
      console.warn(message, error);
    }
    return emptySave();
  }

  private persist(): void {
    try {
      this.storage.setItem(SAVE_KEY, JSON.stringify(this.data));
    } catch (error) {
      // No-Fail Rule: a full or blocked quota (private browsing, storage off)
      // must never crash a mission. Keep progress in memory for this session.
      console.warn('Rescue Town Builders could not save progress this time.', error);
    }
  }
}
