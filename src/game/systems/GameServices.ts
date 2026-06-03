import { missionDefinitions } from '../data/missions';
import { MissionRegistry } from './MissionRegistry';
import { SaveSystem } from './SaveSystem';
import { getEffectiveAudioLevels } from './AudioSystem';
import { SfxSystem, createWebAudioSfxSink } from './SfxSystem';

export const missionRegistry = new MissionRegistry(missionDefinitions);

let saveSystem: SaveSystem | null = null;

export function getSaveSystem(): SaveSystem {
  saveSystem ??= new SaveSystem();
  return saveSystem;
}

let sfxSystem: SfxSystem | null = null;

export function getSfx(): SfxSystem {
  // Effective level follows the selected profile's volume + mute, so the existing
  // Parent Settings controls govern sound effects with no extra wiring.
  sfxSystem ??= new SfxSystem(createWebAudioSfxSink(), () => {
    const profile = getSaveSystem().getSelectedProfile();
    return profile ? getEffectiveAudioLevels(profile.settings).sfx : 0;
  });
  return sfxSystem;
}
