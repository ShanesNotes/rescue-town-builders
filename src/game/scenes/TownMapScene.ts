import Phaser from 'phaser';
import { fadeInScene } from '../systems/SceneTransitions';
import type { MissionId } from '../types';
import { getSaveSystem, missionRegistry } from '../systems/GameServices';
import { inputIntentFromGamepadButton, inputIntentFromKeyboard } from '../systems/InputIntent';
import { SCENE_KEYS, sceneKeyForMission, startParentSettingsGate, startScene, startStickerBook } from '../systems/SceneNavigation';
import { projectTownMapNodes } from '../systems/TownMapProgress';
import { addButton } from '../ui/Button';
import { addBody, addTitle } from '../ui/SceneText';
import { createSecretsForProfile, touchSecret, showSecretReveal } from '../systems/secretHotspot';
import { addHelperAvatar, addSprite, hasTexture, type HelperCharacterId } from '../ui/Sprite';

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
    this.drawTownBackground();
    addTitle(this, 'Rescue Town Map');
    addBody(this, 110, `${profile.name}, choose a mission. Map nodes are driven by the MissionRegistry.`);

    nodes.forEach((node, index) => {
      const selected = index === this.selectedIndex ? '▶ ' : '';
      const y = 188 + index * 90;
      addSprite(this, {
        key: 'town.map-node',
        x: 120,
        y,
        width: selected ? 62 : 54,
        height: selected ? 62 : 54,
        pop: Boolean(selected),
      });
      addSprite(this, {
        key: 'kenney.tiny-town.target',
        x: 120,
        y,
        width: selected ? 34 : 28,
        height: selected ? 34 : 28,
        pop: Boolean(selected),
      });
      addHelperAvatar(this, helperForCharacterId(node.characterId), 835, y, 56, {
        idle: index === this.selectedIndex,
        pop: index === this.selectedIndex,
      });
      addButton(this, {
        x: 480,
        y,
        width: 650,
        height: 74,
        label: `${selected}${node.title}\n${node.mapNodeId} • ${node.starsLabel}`,
        fill: index === this.selectedIndex ? 0xfff4bf : ([0xb7e6ff, 0xffd6a5, 0xffb3c6][index] ?? 0xffffff),
        onPress: () => this.startMission(node.missionId),
        testId: `townmap.mission.${node.missionId}`,
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
      testId: 'townmap.parent-settings',
    });
    addButton(this, {
      x: 145,
      y: 500,
      width: 200,
      height: 58,
      label: 'Profiles',
      fill: 0xffffff,
      onPress: () => startScene(this, SCENE_KEYS.profile),
      testId: 'townmap.profiles',
    });
    addButton(this, {
      x: 452,
      y: 500,
      width: 230,
      height: 58,
      label: 'My Stickers',
      fill: 0xffffff,
      onPress: () => startStickerBook(this),
      testId: 'townmap.sticker-book',
    });
    addBody(this, 458, 'Gamepad: D-pad chooses • A starts mission • B returns to profiles');

    // Cluckle's Dream: a sleepy hen who dreams the whole town in miniature (3 touches).
    const secrets = createSecretsForProfile();
    this.add.circle(70, 150, 16, 0xfff4bf, 0.18).setInteractive().on('pointerdown', () => {
      const message = touchSecret(secrets, 'cluckle-dream');
      if (message) showSecretReveal(this, message);
    });

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

  private drawTownBackground(): void {
    this.add.rectangle(480, 292, 850, 330, 0x9be7c4, 0.24).setStrokeStyle(3, 0x203247, 0.16);
    if (hasTexture(this, 'kenney.tiny-town.grass')) {
      this.add.tileSprite(480, 292, 830, 318, 'kenney.tiny-town.grass').setTileScale(2, 2).setAlpha(0.3);
    }
    this.add.rectangle(480, 268, 650, 30, 0xffe0a3, 0.45);
    this.add.rectangle(340, 292, 30, 230, 0xffe0a3, 0.45);
    this.add.rectangle(650, 292, 30, 230, 0xffe0a3, 0.45);
    [
      ['kenney.tiny-town.tree-green', 238, 152],
      ['kenney.tiny-town.tree-yellow', 718, 150],
      ['kenney.tiny-town.tree-green', 245, 438],
      ['kenney.tiny-town.tree-yellow', 720, 436],
      ['kenney.tiny-town.well', 480, 440],
    ].forEach(([key, x, y]) => {
      addSprite(this, { key: String(key), x: Number(x), y: Number(y), width: 44, height: 44, alpha: 0.85 });
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

function helperForCharacterId(characterId: string): HelperCharacterId {
  if (characterId === 'brick' || characterId === 'ember' || characterId === 'rivet') return characterId;
  return 'rivet';
}
