import Phaser from 'phaser';
import type { MissionId } from '../types';
import { getSaveSystem, missionRegistry } from '../systems/GameServices';
import { inputIntentFromGamepadButton, inputIntentFromKeyboard } from '../systems/InputIntent';
import { addButton } from '../ui/Button';
import { addBody, addTitle } from '../ui/SceneText';

export class TownMapScene extends Phaser.Scene {
  private selectedIndex = 0;

  constructor() {
    super('TownMapScene');
  }

  create(): void {
    this.cameras.main.setBackgroundColor('#dff8d8');
    const profile = getSaveSystem().getSelectedProfile();
    if (!profile) {
      this.scene.start('ProfileScene');
      return;
    }

    const missions = missionRegistry.list();
    addTitle(this, 'Rescue Town Map');
    addBody(this, 120, `${profile.name}, choose a mission. These are placeholder loops for Slice 0.`);

    missions.forEach((mission, index) => {
      const progress = profile.progress.missions[mission.id];
      const stars = progress ? '⭐'.repeat(progress.bestStars) : 'No stars yet';
      addButton(this, {
        x: 480,
        y: 210 + index * 95,
        width: 620,
        height: 76,
        label: `${mission.title} • ${stars}`,
        fill: [0xb7e6ff, 0xffd6a5, 0xffb3c6][index] ?? 0xffffff,
        onPress: () => this.startMission(mission.id),
      });
    });

    addBody(this, 510, 'Gamepad: D-pad chooses the next mission later; A starts the highlighted/default mission.');

    this.input.keyboard?.on('keydown', (event: KeyboardEvent) => {
      const intent = inputIntentFromKeyboard(event.key);
      if (intent?.type === 'move') {
        this.selectedIndex = Math.max(0, Math.min(missions.length - 1, this.selectedIndex + intent.y));
      }
      if (intent?.type === 'confirm' || intent?.type === 'action') {
        this.startMission(missions[this.selectedIndex]?.id ?? 'recycling-run');
      }
      if (intent?.type === 'back') this.scene.start('ProfileScene');
    });

    this.input.gamepad?.on('down', (_pad: unknown, button: { index: number }) => {
      const intent = inputIntentFromGamepadButton(button.index);
      if (intent?.type === 'move') {
        this.selectedIndex = Math.max(0, Math.min(missions.length - 1, this.selectedIndex + intent.y));
      }
      if (intent?.type === 'confirm' || intent?.type === 'action') {
        this.startMission(missions[this.selectedIndex]?.id ?? 'recycling-run');
      }
      if (intent?.type === 'back') this.scene.start('ProfileScene');
    });
  }

  private startMission(missionId: MissionId): void {
    this.scene.start('PlaceholderMissionScene', { missionId });
  }
}
