import Phaser from 'phaser';
import { fadeInScene } from '../systems/SceneTransitions';
import { inputIntentFromGamepadButton, inputIntentFromKeyboard } from '../systems/InputIntent';
import { addButton } from '../ui/Button';
import { addBody, addTitle } from '../ui/SceneText';

export class StartScene extends Phaser.Scene {
  constructor() {
    super('StartScene');
  }

  create(): void {
    fadeInScene(this);
    this.cameras.main.setBackgroundColor('#d9f5ff');
    addTitle(this, 'Rescue Town Builders');
    addBody(
      this,
      160,
      'A tiny original rescue-town prototype. Minimal placeholder art only. Keyboard, touch, and gamepad are welcome.',
    );
    addButton(this, {
      x: 480,
      y: 300,
      width: 360,
      height: 86,
      label: 'Play',
      fill: 0x9be7c4,
      onPress: () => this.scene.start('ProfileScene'),
    });
    addBody(this, 430, 'Controls: Enter/A = choose • Esc/B = back • D-pad/arrows = move later');

    this.input.keyboard?.on('keydown', (event: KeyboardEvent) => {
      const intent = inputIntentFromKeyboard(event.key);
      if (intent?.type === 'confirm' || intent?.type === 'action') this.scene.start('ProfileScene');
    });

    this.input.gamepad?.on('down', (_pad: unknown, button: { index: number }) => {
      const intent = inputIntentFromGamepadButton(button.index);
      if (intent?.type === 'confirm' || intent?.type === 'action') this.scene.start('ProfileScene');
    });
  }
}
