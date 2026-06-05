import { describe, expect, it } from 'vitest';
import { getEffectiveAudioLevels, getThemeLoopStatus } from '../src/game/systems/AudioSystem';

describe('AudioSystem', () => {
  it('mutes effective music and SFX levels when audioMuted is on', () => {
    expect(getEffectiveAudioLevels({ musicVolume: 0.8, sfxVolume: 0.4, audioMuted: true })).toEqual({
      music: 0,
      sfx: 0,
    });
  });

  it('clamps effective music and SFX levels when audio is not muted', () => {
    expect(getEffectiveAudioLevels({ musicVolume: 2, sfxVolume: -1, audioMuted: false })).toEqual({
      music: 1,
      sfx: 0,
    });
  });

  it('reports the recorded theme as imported and in production now that the OGG is live', () => {
    expect(getThemeLoopStatus()).toMatchObject({ imported: true, segmentCount: 4, status: 'production' });
  });
});
