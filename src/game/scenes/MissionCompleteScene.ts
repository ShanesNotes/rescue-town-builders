import Phaser from 'phaser';
import { fadeInScene } from '../systems/SceneTransitions';
import type { MissionResult } from '../types';
import { createCelebrationPlan } from '../systems/Celebration';
import { getSaveSystem, missionRegistry, getSfx } from '../systems/GameServices';
import { inputIntentFromGamepadButton, inputIntentFromKeyboard } from '../systems/InputIntent';
import { returnToTownMap } from '../systems/SceneNavigation';
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
    fadeInScene(this);
    this.cameras.main.setBackgroundColor('#fff0f6');
    const saves = getSaveSystem();
    const profile = saves.getSelectedProfile();
    if (!this.result || !profile) {
      returnToTownMap(this);
      return;
    }

    const updated = saves.recordMissionResult(profile.id, this.result);
    const mission = missionRegistry.get(this.result.missionId);
    const celebration = createCelebrationPlan(this.result);
    addTitle(this, 'Mission Complete!');
    addBody(
      this,
      160,
      `${mission?.title ?? 'Mission'} finished with ${'⭐'.repeat(this.result.stars)}. Sticker unlocked: ${this.result.stickersUnlocked.join(', ')}.`,
    );
    addBody(this, 250, `${celebration.message} ${updated.name}'s saved total: ${updated.progress.totalStars} ⭐`);
    this.drawCelebration(celebration.confettiBursts, celebration.starCount);
    getSfx().play('fanfare');
    addButton(this, {
      x: 480,
      y: 380,
      width: 360,
      height: 84,
      label: 'Back to Map',
      fill: 0x9be7c4,
      onPress: () => returnToTownMap(this),
      testId: 'mission.complete.back-to-map',
    });

    this.input.keyboard?.on('keydown', (event: KeyboardEvent) => {
      const intent = inputIntentFromKeyboard(event.key);
      if (intent?.type === 'confirm' || intent?.type === 'action' || intent?.type === 'back') {
        returnToTownMap(this);
      }
    });

    this.input.gamepad?.on('down', (_pad: unknown, button: { index: number }) => {
      const intent = inputIntentFromGamepadButton(button.index);
      if (intent?.type === 'confirm' || intent?.type === 'action' || intent?.type === 'back') {
        returnToTownMap(this);
      }
    });
  }

  private drawCelebration(confettiBursts: number, starCount: number): void {
    for (let index = 0; index < confettiBursts; index += 1) {
      const x = 190 + index * 72;
      const y = 310 + (index % 2) * 34;
      this.add.circle(x, y, 12, [0xffc857, 0x9be7c4, 0xb7e6ff, 0xffb3c6][index % 4] ?? 0xffffff);
    }
    this.add.text(480, 315, '⭐'.repeat(starCount), {
      fontFamily: 'Trebuchet MS, Arial, sans-serif',
      fontSize: '52px',
      color: '#203247',
      align: 'center',
    }).setOrigin(0.5);
  }
}
