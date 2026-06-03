import type { ProfileSettings } from './SaveSystem';

export type EffectiveAudioLevels = {
  music: number;
  sfx: number;
};

export type ThemeLoopStatus = {
  imported: boolean;
  segmentCount: number;
  status: 'backlog' | 'ready' | 'imported';
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
    imported: false,
    segmentCount: 4,
    status: 'backlog',
    note: 'Generated theme loop exists outside the repo in four segments; splice and record source notes before import.',
  };
}

function clampLevel(value: number): number {
  return Math.max(0, Math.min(1, Math.round(value * 100) / 100));
}
