import Phaser from 'phaser';
import type { MissionId, MissionResult } from '../types';
import { missionRegistry } from '../systems/GameServices';
import { inputIntentFromGamepadButton, inputIntentFromKeyboard } from '../systems/InputIntent';
import { clampStars } from '../systems/StarScoring';
import { addButton } from '../ui/Button';
import { addBody, addTitle } from '../ui/SceneText';

export class PlaceholderMissionScene extends Phaser.Scene {
  private missionId: MissionId = 'recycling-run';

  constructor() {
    super('PlaceholderMissionScene');
  }

  init(data: { missionId?: MissionId }): void {
    this.missionId = data.missionId ?? 'recycling-run';
  }

  create(): void {
    this.cameras.main.setBackgroundColor('#e7e5ff');
    const mission = missionRegistry.get(this.missionId);
    addTitle(this, mission?.title ?? 'Placeholder Mission');
    addBody(
      this,
      145,
      'This is the Slice 0 fake mission path. It proves navigation, scoring, saving, touch, keyboard, and gamepad before real mechanics.',
    );

    [1, 2, 3].forEach((stars, index) => {
      addButton(this, {
        x: 250 + index * 240,
        y: 310,
        width: 190,
        height: 88,
        label: `Finish ${'⭐'.repeat(stars)}`,
        fill: 0xfff4bf,
        onPress: () => this.completeWithStars(stars),
      });
    });

    addButton(this, {
      x: 120,
      y: 490,
      width: 180,
      height: 58,
      label: 'Back',
      fill: 0xffffff,
      onPress: () => this.scene.start('TownMapScene'),
    });

    this.input.keyboard?.on('keydown', (event: KeyboardEvent) => {
      const intent = inputIntentFromKeyboard(event.key);
      if (intent?.type === 'confirm' || intent?.type === 'action') this.completeWithStars(3);
      if (intent?.type === 'back') this.scene.start('TownMapScene');
    });

    this.input.gamepad?.on('down', (_pad: unknown, button: { index: number }) => {
      const intent = inputIntentFromGamepadButton(button.index);
      if (intent?.type === 'confirm' || intent?.type === 'action') this.completeWithStars(3);
      if (intent?.type === 'back') this.scene.start('TownMapScene');
    });
  }

  private completeWithStars(stars: number): void {
    const result: MissionResult = {
      missionId: this.missionId,
      completed: true,
      stars: clampStars(stars),
      score: stars * 100,
      stickersUnlocked: [`${this.missionId}-starter`],
      stats: {
        placeholder: true,
        selectedStars: stars,
      },
    };
    this.scene.start('MissionCompleteScene', { result });
  }
}
