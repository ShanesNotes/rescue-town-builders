import { missionDefinitions } from '../data/missions';
import { MissionRegistry } from './MissionRegistry';
import { SaveSystem } from './SaveSystem';
import { getEffectiveAudioLevels } from './AudioSystem';
import { SfxSystem, createWebAudioSfxSink } from './SfxSystem';
import { MusicSystem, createFallbackMusicSink } from './MusicSystem';
import { VoiceSystem, createWebSpeechVoiceSink } from './VoiceSystem';

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

let voiceSystem: VoiceSystem | null = null;

export function getVoice(): VoiceSystem {
  // Spoken VO so a non-reader can play solo (P4-02). Enabled follows the selected profile's
  // voiceEnabled AND audioMuted (a muted town speaks no words either), so the existing Parent
  // Settings govern it with no extra wiring. No-Fail when speechSynthesis is unavailable (headless).
  voiceSystem ??= new VoiceSystem(createWebSpeechVoiceSink(), () => {
    const profile = getSaveSystem().getSelectedProfile();
    if (!profile) return true; // before a profile exists (title), the voice may still greet
    return profile.settings.voiceEnabled !== false && !profile.settings.audioMuted;
  });
  return voiceSystem;
}

let musicSystem: MusicSystem | null = null;

export function getMusic(): MusicSystem {
  // One persistent loop for the whole session. The level getter follows the selected
  // profile's music volume + mute live, so Parent Settings governs it with no extra wiring.
  // Shane's real recorded theme (OGG) on loop, behind the same MusicSink seam as the synth.
  // Wrapped so a failed OGG falls back to the synth loop — music is never simply absent (No-Fail).
  const themeUrl = `${import.meta.env.BASE_URL}assets/audio/Rescue-town-builders.ogg`;
  musicSystem ??= new MusicSystem(createFallbackMusicSink(themeUrl), () => {
    const profile = getSaveSystem().getSelectedProfile();
    return profile ? getEffectiveAudioLevels(profile.settings).music : 0.5;
  });
  return musicSystem;
}
