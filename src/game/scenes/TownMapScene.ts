import Phaser from 'phaser';
import { fadeInScene } from '../systems/SceneTransitions';
import type { MissionId } from '../types';
import { getSaveSystem, missionRegistry } from '../systems/GameServices';
import { inputIntentFromGamepadButton, inputIntentFromKeyboard } from '../systems/InputIntent';
import { SCENE_KEYS, sceneKeyForMission, startParentSettingsGate, startScene } from '../systems/SceneNavigation';
import { projectTownMapNodes } from '../systems/TownMapProgress';
import { addButton } from '../ui/Button';
import { addBody, addTitle } from '../ui/SceneText';

export class TownMapScene extends Phaser.Scene {
  private selectedIndex = 0;

  constructor() {
    super('TownMapScene');
  }

  create(): void {
    fadeInScene(this);
    this.cameras.main.setBackgroundColor('#dff8d8');
    const profile = getSaveSystem().getSelectedProfile();
    if (!profile) {
      startScene(this, SCENE_KEYS.profile);
      return;
    }

    const nodes = projectTownMapNodes(missionRegistry.list(), profile);
    addTitle(this, 'Rescue Town Map');
    addBody(this, 110, `${profile.name}, choose a mission. Map nodes are driven by the MissionRegistry.`);

    nodes.forEach((node, index) => {
      const selected = index === this.selectedIndex ? '▶ ' : '';
      addButton(this, {
        x: 480,
        y: 188 + index * 90,
        width: 650,
        height: 74,
        label: `${selected}${node.title}\n${node.mapNodeId} • ${node.starsLabel}`,
        fill: index === this.selectedIndex ? 0xfff4bf : ([0xb7e6ff, 0xffd6a5, 0xffb3c6][index] ?? 0xffffff),
        onPress: () => this.startMission(node.missionId),
      });
    });

    addButton(this, {
      x: 760,
      y: 500,
      width: 280,
      height: 58,
      label: 'Parent Settings',
      fill: 0xffffff,
      onPress: () => startParentSettingsGate(this, SCENE_KEYS.townMap),
    });
    addButton(this, {
      x: 145,
      y: 500,
      width: 200,
      height: 58,
      label: 'Profiles',
      fill: 0xffffff,
      onPress: () => startScene(this, SCENE_KEYS.profile),
    });
    addBody(this, 458, 'Gamepad: D-pad chooses • A starts mission • B returns to profiles');

    this.input.keyboard?.on('keydown', (event: KeyboardEvent) => {
      const intent = inputIntentFromKeyboard(event.key);
      if (intent?.type === 'move') this.moveSelection(intent.y, nodes.length);
      if (intent?.type === 'confirm' || intent?.type === 'action') {
        this.startMission(nodes[this.selectedIndex]?.missionId ?? 'recycling-run');
      }
      if (intent?.type === 'back') startScene(this, SCENE_KEYS.profile);
    });

    this.input.gamepad?.on('down', (_pad: unknown, button: { index: number }) => {
      const intent = inputIntentFromGamepadButton(button.index);
      if (intent?.type === 'move') this.moveSelection(intent.y, nodes.length);
      if (intent?.type === 'confirm' || intent?.type === 'action') {
        this.startMission(nodes[this.selectedIndex]?.missionId ?? 'recycling-run');
      }
      if (intent?.type === 'back') startScene(this, SCENE_KEYS.profile);
    });
  }

  private moveSelection(delta: number, count: number): void {
    if (delta === 0) return;
    this.selectedIndex = Math.max(0, Math.min(count - 1, this.selectedIndex + delta));
    this.scene.restart();
  }

  private startMission(missionId: MissionId): void {
    startScene(this, sceneKeyForMission(missionId));
  }
}
