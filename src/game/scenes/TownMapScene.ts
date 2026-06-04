import Phaser from 'phaser';
import { fadeInScene } from '../systems/SceneTransitions';
import type { MissionId } from '../types';
import { getSaveSystem, missionRegistry } from '../systems/GameServices';
import { bindIntents } from '../systems/bindIntents';
import { SCENE_KEYS, sceneKeyForMission, startParentSettingsGate, startScene, startStickerBook } from '../systems/SceneNavigation';
import { projectTownMapNodes, type TownMapNode } from '../systems/TownMapProgress';
import { addIconButton } from '../ui/Button';
import { FONTS } from '../ui/typography';
import { motionAllowed } from '../ui/Sprite';
import { createSecretsForProfile, addSecretHotspot } from '../systems/secretHotspot';

// Each rescue mission is a home in the town. Its window is dark until the child completes the
// mission — then it lights up. The town glows brighter as you help (the core loop made visible).
const MISSION_ICON: Record<string, string> = {
  'recycling-run': 'hl.ui.recycle',
  'house-builder': 'hl.ui.build',
  'fire-fix': 'hl.ui.fire',
};
const NODE_X = [240, 480, 720];

export class TownMapScene extends Phaser.Scene {
  private selectedIndex = 0;

  constructor() {
    super('TownMapScene');
  }

  create(): void {
    fadeInScene(this);
    const profile = getSaveSystem().getSelectedProfile();
    if (!profile) {
      startScene(this, SCENE_KEYS.profile);
      return;
    }

    const nodes = projectTownMapNodes(missionRegistry.list(), profile);
    this.paintWorld();
    this.paintHeader();

    nodes.forEach((node, index) => this.buildNode(node, index));

    // Corner coins (icon-first; same destinations + testIds as before).
    this.cornerCoin(52, 46, 'hl.ui.back', () => startScene(this, SCENE_KEYS.profile), 'townmap.profiles');
    this.cornerCoin(908, 46, 'hl.ui.stickers', () => startStickerBook(this), 'townmap.sticker-book');
    this.cornerCoin(908, 498, 'hl.ui.settings', () => startParentSettingsGate(this, SCENE_KEYS.townMap), 'townmap.parent-settings');

    // Cluckle's Dream: a sleepy hen who dreams the whole town in miniature (3 touches).
    const secrets = createSecretsForProfile();
    addSecretHotspot(this, secrets, 'cluckle-dream', 70, 498);

    this.bindKeys(nodes);
  }

  private paintWorld(): void {
    this.add.image(480, 270, 'hl.bg.town').setDisplaySize(960, 540).setDepth(0);
    this.add.rectangle(480, 270, 960, 540, 0xf2b45a, 0.05).setBlendMode(Phaser.BlendModes.ADD).setDepth(1);
    // Soft navy bands top + bottom so the header and node row stay readable over the art.
    this.add.rectangle(480, 32, 960, 92, 0x101b2e, 0.42).setDepth(1);
    this.add.rectangle(480, 512, 960, 70, 0x101b2e, 0.34).setDepth(1);
  }

  private paintHeader(): void {
    this.add
      .text(480, 34, 'RESCUE TOWN', {
        fontFamily: FONTS.display,
        fontSize: '34px',
        color: '#FFE2A6',
        fontStyle: 'bold',
        stroke: '#2A1606',
        strokeThickness: 7,
      })
      .setOrigin(0.5)
      .setDepth(30);
  }

  // A mission node: a tappable icon-coin (the what + the button), the hero standing beside their
  // lantern (the who), a star row (the reward), and the lantern that LIGHTS when the mission is
  // rescued — the light-from-darkness core loop, made visible right on the hub.
  private buildNode(node: TownMapNode, index: number): void {
    const x = NODE_X[index] ?? 160 + index * 200;
    const selected = index === this.selectedIndex;
    const feetY = 432;

    // Selected platform glow.
    if (selected) {
      this.add.ellipse(x, feetY + 6, 200, 56, 0xffd98a, 0.16).setBlendMode(Phaser.BlendModes.ADD).setDepth(3);
    }

    // The hero, planted on the cobbles.
    this.plantCharacter(`hl.char.${node.characterId}`, x - 44, feetY, 90, index);

    // The hero's lantern — dim until they've rescued this home, then warm and glowing.
    this.add.ellipse(x + 52, feetY + 2, 44, 12, 0x0a1322, 0.4).setDepth(9);
    const lantern = this.add.image(x + 52, feetY, 'hl.prop.lantern').setOrigin(0.5, 1).setDisplaySize(58, 78).setDepth(11);
    if (node.completed) {
      const glow = this.add.circle(x + 52, feetY - 40, 40, 0xffc14a, 0.22).setBlendMode(Phaser.BlendModes.ADD).setDepth(10);
      if (motionAllowed()) {
        this.tweens.add({ targets: glow, scale: 1.16, alpha: 0.1, duration: 1600, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
      }
    } else {
      lantern.setTint(0x3a4a66).setAlpha(0.85); // unlit
    }

    // Stars earned.
    this.starRow(x, 476, node.bestStars);

    // The icon-coin — the obvious thing to tap to start this rescue.
    addIconButton(this, {
      x,
      y: 224,
      size: 92,
      key: MISSION_ICON[node.missionId] ?? 'hl.ui.play',
      onPress: () => this.startMission(node.missionId),
      testId: `townmap.mission.${node.missionId}`,
      pulse: selected,
    }).setDepth(20);
  }

  private starRow(cx: number, y: number, best: 0 | 1 | 2 | 3): void {
    const slots = 3;
    const gap = 30;
    const start = cx - ((slots - 1) * gap) / 2;
    for (let i = 0; i < slots; i += 1) {
      const earned = i < best;
      this.add
        .image(start + i * gap, y, 'hl.prop.star')
        .setDisplaySize(26, 26)
        .setDepth(12)
        .setAlpha(earned ? 1 : 0.28)
        .setTint(earned ? 0xffffff : 0x4a5a72);
    }
  }

  private plantCharacter(key: string, x: number, feetY: number, size: number, index: number): void {
    this.add.ellipse(x, feetY + 2, size * 0.7, size * 0.18, 0x0a1322, 0.5).setDepth(9);
    const sprite = this.add.image(x, feetY, key).setOrigin(0.5, 1).setDisplaySize(size, size).setDepth(11);
    if (!motionAllowed()) return;
    const baseScaleY = sprite.scaleY;
    this.tweens.add({ targets: sprite, scaleY: baseScaleY * 1.03, duration: 1200 + index * 130, yoyo: true, repeat: -1, ease: 'Sine.easeInOut', delay: index * 160 });
  }

  private cornerCoin(x: number, y: number, key: string, onPress: () => void, testId: string): void {
    addIconButton(this, { x, y, size: 58, key, onPress, testId }).setDepth(30);
  }

  private bindKeys(nodes: TownMapNode[]): void {
    bindIntents(this, {
      onMove: (x, y) => this.moveSelection(x || y, nodes.length),
      onConfirm: () => this.startMission(nodes[this.selectedIndex]?.missionId ?? 'recycling-run'),
      onBack: () => startScene(this, SCENE_KEYS.profile),
    });
  }

  private moveSelection(delta: number, count: number): void {
    if (!delta) return;
    this.selectedIndex = Math.max(0, Math.min(count - 1, this.selectedIndex + delta));
    this.scene.restart();
  }

  private startMission(missionId: MissionId): void {
    startScene(this, sceneKeyForMission(missionId));
  }
}
