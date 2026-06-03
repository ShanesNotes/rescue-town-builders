import Phaser from 'phaser';
import { inputIntentFromGamepadButton, inputIntentFromKeyboard } from '../systems/InputIntent';
import { getSaveSystem } from '../systems/GameServices';
import { addButton } from '../ui/Button';
import { addBody, addTitle } from '../ui/SceneText';

export class ProfileScene extends Phaser.Scene {
  constructor() {
    super('ProfileScene');
  }

  create(): void {
    this.cameras.main.setBackgroundColor('#fff7dc');
    const saves = getSaveSystem();
    const profiles = saves.getProfiles();

    addTitle(this, 'Choose a Helper Profile');
    addBody(this, 128, 'Slice 0 uses a simple local profile. More profile options arrive in Slice 1.');

    if (profiles.length === 0) {
      addButton(this, {
        x: 480,
        y: 270,
        width: 420,
        height: 88,
        label: 'Create Player 1',
        fill: 0x9be7c4,
        onPress: () => {
          saves.createProfile({ name: 'Player 1', avatarId: 'rivet' });
          this.scene.start('TownMapScene');
        },
      });
    } else {
      profiles.forEach((profile, index) => {
        addButton(this, {
          x: 480,
          y: 220 + index * 82,
          width: 420,
          height: 68,
          label: `${profile.name} • ${profile.progress.totalStars} ⭐`,
          fill: 0x9be7c4,
          onPress: () => {
            saves.selectProfile(profile.id);
            this.scene.start('TownMapScene');
          },
        });
      });
    }

    addButton(this, {
      x: 120,
      y: 490,
      width: 180,
      height: 58,
      label: 'Back',
      fill: 0xffffff,
      onPress: () => this.scene.start('StartScene'),
    });

    this.input.keyboard?.on('keydown', (event: KeyboardEvent) => {
      const intent = inputIntentFromKeyboard(event.key);
      if (intent?.type === 'confirm' || intent?.type === 'action') {
        if (profiles.length === 0) saves.createProfile({ name: 'Player 1', avatarId: 'rivet' });
        this.scene.start('TownMapScene');
      }
      if (intent?.type === 'back') this.scene.start('StartScene');
    });

    this.input.gamepad?.on('down', (_pad: unknown, button: { index: number }) => {
      const intent = inputIntentFromGamepadButton(button.index);
      if (intent?.type === 'confirm' || intent?.type === 'action') {
        if (profiles.length === 0) saves.createProfile({ name: 'Player 1', avatarId: 'rivet' });
        this.scene.start('TownMapScene');
      }
      if (intent?.type === 'back') this.scene.start('StartScene');
    });
  }
}
