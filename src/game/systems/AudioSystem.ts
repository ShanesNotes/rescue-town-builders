import type { ProfileSettings } from './SaveSystem';

export type EffectiveAudioLevels = {
  music: number;
  sfx: number;
};

export type ThemeLoopStatus = {
  imported: boolean;
  segmentCount: number;
  status: 'backlog' | 'ready' | 'imported' | 'production';
  note: string;
};

export function getEffectiveAudioLevels(settings: Pick<ProfileSettings, 'musicVolume' | 'sfxVolume' | 'audioMuted'>): EffectiveAudioLevels {
  if (settings.audioMuted) {
    return { music: 0, sfx: 0 };
  }
  return {
    music: clampLevel(settings.musicVolume),
    sfx: clampLevel(settings.sfxVolume),
  };
}

export function getThemeLoopStatus(): ThemeLoopStatus {
  return {
    imported: true,
    segmentCount: 4,
    status: 'production',
    note: "Shane's recorded theme is spliced and live as a single OGG (assets/audio/Rescue-town-builders.ogg), played on loop via MusicSystem; the WebAudio synth loop is the No-Fail fallback if the OGG cannot play.",
  };
}

function clampLevel(value: number): number {
  return Math.max(0, Math.min(1, Math.round(value * 100) / 100));
}
