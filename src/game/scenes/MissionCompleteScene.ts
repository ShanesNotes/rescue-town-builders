import Phaser from 'phaser';
import type { MissionResult } from '../types';
import { getSaveSystem, missionRegistry } from '../systems/GameServices';
import { inputIntentFromGamepadButton, inputIntentFromKeyboard } from '../systems/InputIntent';
import { addButton } from '../ui/Button';
import { addBody, addTitle } from '../ui/SceneText';

export class MissionCompleteScene extends Phaser.Scene {
  private result: MissionResult | null = null;

  constructor() {
    super('MissionCompleteScene');
  }

  init(data: { result?: MissionResult }): void {
    this.result = data.result ?? null;
  }

  create(): void {
    this.cameras.main.setBackgroundColor('#fff0f6');
    const saves = getSaveSystem();
    const profile = saves.getSelectedProfile();
    if (!this.result || !profile) {
      this.scene.start('TownMapScene');
      return;
    }

    const updated = saves.recordMissionResult(profile.id, this.result);
    const mission = missionRegistry.get(this.result.missionId);
    addTitle(this, 'Mission Complete!');
    addBody(
      this,
      160,
      `${mission?.title ?? 'Mission'} finished with ${'⭐'.repeat(this.result.stars)}. Sticker unlocked: ${this.result.stickersUnlocked.join(', ')}.`,
    );
    addBody(this, 250, `${updated.name}'s saved total: ${updated.progress.totalStars} ⭐`);
    addButton(this, {
      x: 480,
      y: 380,
      width: 360,
      height: 84,
      label: 'Back to Map',
      fill: 0x9be7c4,
      onPress: () => this.scene.start('TownMapScene'),
    });

    this.input.keyboard?.on('keydown', (event: KeyboardEvent) => {
      const intent = inputIntentFromKeyboard(event.key);
      if (intent?.type === 'confirm' || intent?.type === 'action' || intent?.type === 'back') {
        this.scene.start('TownMapScene');
      }
    });

    this.input.gamepad?.on('down', (_pad: unknown, button: { index: number }) => {
      const intent = inputIntentFromGamepadButton(button.index);
      if (intent?.type === 'confirm' || intent?.type === 'action' || intent?.type === 'back') {
        this.scene.start('TownMapScene');
      }
    });
  }
}
