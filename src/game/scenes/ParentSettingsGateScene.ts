import Phaser from 'phaser';
import { fadeInScene } from '../systems/SceneTransitions';
import { inputIntentFromGamepadButton, inputIntentFromKeyboard } from '../systems/InputIntent';
import { addButton } from '../ui/Button';
import { addBody, addTitle } from '../ui/SceneText';

export class ParentSettingsGateScene extends Phaser.Scene {
  private returnScene = 'ProfileScene';
  private holdTimer: Phaser.Time.TimerEvent | null = null;
  private statusText: Phaser.GameObjects.Text | null = null;

  constructor() {
    super('ParentSettingsGateScene');
  }

  init(data: { returnScene?: string }): void {
    this.returnScene = data.returnScene ?? 'ProfileScene';
  }

  create(): void {
    fadeInScene(this);
    this.cameras.main.setBackgroundColor('#eaf7ff');
    addTitle(this, 'Parent Settings Gate');
    addBody(this, 145, 'Grown-ups: hold the big button for 3 seconds to change settings.');
    this.statusText = addBody(this, 420, 'Hold to begin. Release cancels.');

    const holdButton = addButton(this, {
      x: 480,
      y: 280,
      width: 460,
      height: 110,
      label: 'Hold for 3 seconds',
      fill: 0xfff4bf,
      onPress: () => undefined,
    });
    holdButton.on('pointerdown', () => this.startHold());
    holdButton.on('pointerup', () => this.cancelHold());
    holdButton.on('pointerout', () => this.cancelHold());

    addButton(this, {
      x: 140,
      y: 500,
      width: 190,
      height: 58,
      label: 'Back',
      fill: 0xffffff,
      onPress: () => this.scene.start(this.returnScene),
    });

    this.input.keyboard?.on('keydown', (event: KeyboardEvent) => {
      const intent = inputIntentFromKeyboard(event.key);
      if (intent?.type === 'confirm' || intent?.type === 'action') this.startHold();
      if (intent?.type === 'back') this.scene.start(this.returnScene);
    });
    this.input.keyboard?.on('keyup', () => this.cancelHold());

    this.input.gamepad?.on('down', (_pad: unknown, button: { index: number }) => {
      const intent = inputIntentFromGamepadButton(button.index);
      if (intent?.type === 'confirm' || intent?.type === 'action') this.startHold();
      if (intent?.type === 'back') this.scene.start(this.returnScene);
    });
    this.input.gamepad?.on('up', () => this.cancelHold());
  }

  private startHold(): void {
    if (this.holdTimer) return;
    this.statusText?.setText('Holding... keep going.');
    this.holdTimer = this.time.delayedCall(3000, () => {
      this.holdTimer = null;
      this.scene.start('ParentSettingsScene', { returnScene: this.returnScene });
    });
  }

  private cancelHold(): void {
    if (!this.holdTimer) return;
    this.holdTimer.remove(false);
    this.holdTimer = null;
    this.statusText?.setText('Hold cancelled. Try again when a grown-up is ready.');
  }
}
