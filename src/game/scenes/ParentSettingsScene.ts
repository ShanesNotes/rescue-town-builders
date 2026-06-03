import Phaser from 'phaser';
import { fadeInScene } from '../systems/SceneTransitions';
import type { Difficulty, PlayerProfile } from '../systems/SaveSystem';
import { getEffectiveAudioLevels, getThemeLoopStatus } from '../systems/AudioSystem';
import { inputIntentFromGamepadButton, inputIntentFromKeyboard } from '../systems/InputIntent';
import { getSaveSystem } from '../systems/GameServices';
import { addButton } from '../ui/Button';
import { addBody, addTitle } from '../ui/SceneText';

const DIFFICULTY_ORDER: Difficulty[] = ['helper', 'easy', 'normal'];

export class ParentSettingsScene extends Phaser.Scene {
  private returnScene = 'ProfileScene';

  constructor() {
    super('ParentSettingsScene');
  }

  init(data: { returnScene?: string }): void {
    this.returnScene = data.returnScene ?? 'ProfileScene';
  }

  create(): void {
    fadeInScene(this);
    this.cameras.main.setBackgroundColor('#f4f0ff');
    const saves = getSaveSystem();
    const profile = saves.getSelectedProfile();
    addTitle(this, 'Parent Settings');

    if (!profile) {
      addBody(this, 170, 'Create a profile first, then settings can be saved locally.');
      addButton(this, {
        x: 480,
        y: 320,
        width: 320,
        height: 78,
        label: 'Back to Profiles',
        fill: 0xffffff,
        onPress: () => this.scene.start('ProfileScene'),
      });
      this.bindBackOnly();
      return;
    }

    const levels = getEffectiveAudioLevels(profile.settings);
    const themeLoop = getThemeLoopStatus();
    addBody(
      this,
      120,
      `${profile.name}: difficulty ${profile.settings.difficulty} • effective music ${Math.round(levels.music * 100)}% • effective SFX ${Math.round(levels.sfx * 100)}% • muted ${profile.settings.audioMuted ? 'yes' : 'no'}`,
    );
    addBody(this, 158, `Theme loop: ${themeLoop.segmentCount} generated segments waiting for splice/import.`);

    addButton(this, {
      x: 250,
      y: 230,
      width: 350,
      height: 62,
      label: `Mute All: ${profile.settings.audioMuted ? 'On' : 'Off'}`,
      fill: 0xfff4bf,
      onPress: () => this.updateSettings(profile, { audioMuted: !profile.settings.audioMuted }),
    });
    addButton(this, {
      x: 640,
      y: 230,
      width: 350,
      height: 62,
      label: `Difficulty: ${profile.settings.difficulty}`,
      fill: 0xfff4bf,
      onPress: () => this.updateSettings(profile, { difficulty: this.nextDifficulty(profile.settings.difficulty) }),
    });
    addButton(this, {
      x: 250,
      y: 312,
      width: 350,
      height: 62,
      label: 'Music +25%',
      fill: 0x9be7c4,
      onPress: () => this.updateSettings(profile, { musicVolume: profile.settings.musicVolume + 0.25 }),
    });
    addButton(this, {
      x: 640,
      y: 312,
      width: 350,
      height: 62,
      label: 'SFX +25%',
      fill: 0x9be7c4,
      onPress: () => this.updateSettings(profile, { sfxVolume: profile.settings.sfxVolume + 0.25 }),
    });
    addButton(this, {
      x: 250,
      y: 394,
      width: 350,
      height: 62,
      label: 'Quiet Defaults',
      fill: 0xb7e6ff,
      onPress: () => this.updateSettings(profile, { musicVolume: 0, sfxVolume: 0.4, audioMuted: false }),
    });
    addButton(this, {
      x: 640,
      y: 394,
      width: 350,
      height: 62,
      label: 'Reset Local Save',
      fill: 0xffb3c6,
      onPress: () => {
        saves.reset();
        this.scene.start('ProfileScene');
      },
    });
    addButton(this, {
      x: 480,
      y: 500,
      width: 320,
      height: 58,
      label: 'Done',
      fill: 0xffffff,
      onPress: () => this.scene.start(this.returnScene),
    });

    this.bindBackOnly();
  }

  private updateSettings(profile: PlayerProfile, settings: Parameters<ReturnType<typeof getSaveSystem>['updateProfileSettings']>[1]): void {
    getSaveSystem().updateProfileSettings(profile.id, settings);
    this.scene.restart({ returnScene: this.returnScene });
  }

  private nextDifficulty(current: Difficulty): Difficulty {
    const index = DIFFICULTY_ORDER.indexOf(current);
    return DIFFICULTY_ORDER[(index + 1) % DIFFICULTY_ORDER.length] ?? 'helper';
  }

  private bindBackOnly(): void {
    this.input.keyboard?.on('keydown', (event: KeyboardEvent) => {
      const intent = inputIntentFromKeyboard(event.key);
      if (intent?.type === 'back') this.scene.start(this.returnScene);
    });
    this.input.gamepad?.on('down', (_pad: unknown, button: { index: number }) => {
      const intent = inputIntentFromGamepadButton(button.index);
      if (intent?.type === 'back') this.scene.start(this.returnScene);
    });
  }
}
