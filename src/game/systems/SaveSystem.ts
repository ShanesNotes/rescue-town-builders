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
    musicVolume: 0,
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

  reset(): void {
    this.data = emptySave();
    this.storage.removeItem(SAVE_KEY);
  }

  private load(): SaveData {
    const raw = this.storage.getItem(SAVE_KEY);
    if (!raw) return emptySave();

    try {
      const parsed = JSON.parse(raw) as SaveData;
      if (parsed.version !== SAVE_VERSION || !Array.isArray(parsed.profiles)) {
        return emptySave();
      }
      return {
        ...parsed,
        profiles: parsed.profiles.map((profile) => ({
          ...profile,
          settings: {
            ...defaultSettings(),
            ...profile.settings,
            musicVolume: clampVolume(profile.settings?.musicVolume ?? defaultSettings().musicVolume),
            sfxVolume: clampVolume(profile.settings?.sfxVolume ?? defaultSettings().sfxVolume),
          },
        })),
      };
    } catch {
      return emptySave();
    }
  }

  private persist(): void {
    this.storage.setItem(SAVE_KEY, JSON.stringify(this.data));
  }
}
