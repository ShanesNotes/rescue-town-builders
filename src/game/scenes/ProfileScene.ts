import Phaser from 'phaser';
import { fadeInScene } from '../systems/SceneTransitions';
import { inputIntentFromGamepadButton, inputIntentFromKeyboard } from '../systems/InputIntent';
import { getSaveSystem } from '../systems/GameServices';
import { addButton } from '../ui/Button';
import { addBody, addTitle } from '../ui/SceneText';

type ProfileAction = { type: 'select'; profileId: string } | { type: 'create' } | { type: 'settings' } | { type: 'back' };

const AVATARS = ['rivet', 'brick', 'ember', 'wings', 'scoot'];

export class ProfileScene extends Phaser.Scene {
  private selectedIndex = 0;
  private actions: ProfileAction[] = [];

  constructor() {
    super('ProfileScene');
  }

  create(): void {
    fadeInScene(this);
    this.cameras.main.setBackgroundColor('#fff7dc');
    const saves = getSaveSystem();
    const profiles = saves.getProfiles();
    this.actions = [];
    this.selectedIndex = Math.min(this.selectedIndex, Math.max(0, profiles.length));

    addTitle(this, 'Choose a Helper Profile');
    addBody(this, 118, 'Create up to five local profiles. No accounts, no network, no child-facing links.');

    profiles.forEach((profile, index) => {
      this.actions.push({ type: 'select', profileId: profile.id });
      const selected = index === this.selectedIndex ? '▶ ' : '';
      const avatar = profile.avatarId.charAt(0).toUpperCase() + profile.avatarId.slice(1);
      addButton(this, {
        x: 480,
        y: 175 + index * 62,
        width: 520,
        height: 54,
        label: `${selected}${profile.name} • ${avatar} • ${profile.progress.totalStars} ⭐`,
        fill: index === this.selectedIndex ? 0xfff4bf : 0x9be7c4,
        onPress: () => this.choose({ type: 'select', profileId: profile.id }),
      });
    });

    if (profiles.length < 5) {
      const actionIndex = this.actions.length;
      this.actions.push({ type: 'create' });
      addButton(this, {
        x: 480,
        y: 175 + actionIndex * 62,
        width: 520,
        height: 54,
        label: `${actionIndex === this.selectedIndex ? '▶ ' : ''}Add Profile (${profiles.length}/5)`,
        fill: actionIndex === this.selectedIndex ? 0xfff4bf : 0xb7e6ff,
        onPress: () => this.choose({ type: 'create' }),
      });
    }

    this.actions.push({ type: 'settings' }, { type: 'back' });
    addButton(this, {
      x: 750,
      y: 490,
      width: 280,
      height: 58,
      label: 'Parent Settings',
      fill: 0xffffff,
      onPress: () => this.choose({ type: 'settings' }),
    });
    addButton(this, {
      x: 140,
      y: 490,
      width: 190,
      height: 58,
      label: 'Back',
      fill: 0xffffff,
      onPress: () => this.choose({ type: 'back' }),
    });

    addBody(this, 435, 'Gamepad: D-pad chooses • A selects • B goes back');
    this.bindInput();
  }

  private bindInput(): void {
    this.input.keyboard?.on('keydown', (event: KeyboardEvent) => {
      const intent = inputIntentFromKeyboard(event.key);
      if (intent?.type === 'move') this.moveSelection(intent.y);
      if (intent?.type === 'confirm' || intent?.type === 'action') this.choose(this.actions[this.selectedIndex]);
      if (intent?.type === 'back') this.choose({ type: 'back' });
    });

    this.input.gamepad?.on('down', (_pad: unknown, button: { index: number }) => {
      const intent = inputIntentFromGamepadButton(button.index);
      if (intent?.type === 'move') this.moveSelection(intent.y);
      if (intent?.type === 'confirm' || intent?.type === 'action') this.choose(this.actions[this.selectedIndex]);
      if (intent?.type === 'back') this.choose({ type: 'back' });
    });
  }

  private moveSelection(delta: number): void {
    if (delta === 0 || this.actions.length === 0) return;
    this.selectedIndex = Math.max(0, Math.min(this.actions.length - 1, this.selectedIndex + delta));
    this.scene.restart();
  }

  private choose(action: ProfileAction | undefined): void {
    if (!action) return;
    const saves = getSaveSystem();
    if (action.type === 'select') {
      saves.selectProfile(action.profileId);
      this.scene.start('TownMapScene');
      return;
    }
    if (action.type === 'create') {
      const nextNumber = saves.getProfiles().length + 1;
      saves.createProfile({
        name: `Player ${nextNumber}`,
        avatarId: AVATARS[(nextNumber - 1) % AVATARS.length] ?? 'rivet',
      });
      this.scene.start('TownMapScene');
      return;
    }
    if (action.type === 'settings') {
      this.scene.start('ParentSettingsGateScene', { returnScene: 'ProfileScene' });
      return;
    }
    this.scene.start('StartScene');
  }
}
