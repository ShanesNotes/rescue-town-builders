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
// Aligned to the three lamp-lit platforms built into the near-path parallax layer.
const NODE_X = [252, 480, 708];

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
    const rescued = nodes.filter((n) => n.completed).length;
    this.paintWorld(rescued, nodes.length);
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

  private paintWorld(rescued: number, total: number): void {
    // Parallax dusk town built for the hub: sky → far hills → town silhouette → lamp-lit path.
    this.add.image(480, 270, 'hl.map.sky').setDisplaySize(960, 540).setDepth(0);
    this.add.image(480, 314, 'hl.map.farHills').setOrigin(0.5, 1).setDepth(1);
    this.add.image(480, 396, 'hl.map.midTown').setOrigin(0.5, 1).setDepth(2);
    this.add.image(480, 540, 'hl.map.nearPath').setOrigin(0.5, 1).setDepth(3);
    // The town grows warmer the more homes the child has rescued (light from darkness).
    const warmth = total > 0 ? rescued / total : 0;
    this.add.rectangle(480, 270, 960, 540, 0xffb24a, 0.04 + warmth * 0.06).setBlendMode(Phaser.BlendModes.ADD).setDepth(4);
    this.add.rectangle(480, 32, 960, 88, 0x101b2e, 0.42).setDepth(5);
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

  // A mission node sitting on a lamp-lit platform: the home is DARK until the child rescues it,
  // then it's lit and glowing — the light-from-darkness core loop made visible on the hub.
  // Above it floats the tappable icon-coin (what + button); below, the stars earned.
  private buildNode(node: TownMapNode, index: number): void {
    const x = NODE_X[index] ?? 160 + index * 200;
    const selected = index === this.selectedIndex;
    const houseY = 392;

    if (selected) {
      this.add.ellipse(x, houseY + 4, 188, 50, 0xffd98a, 0.18).setBlendMode(Phaser.BlendModes.ADD).setDepth(4);
    }

    // A rescued home glows; a waiting one is dim.
    if (node.completed) {
      const glow = this.add.circle(x, houseY - 52, 84, 0xffc14a, 0.2).setBlendMode(Phaser.BlendModes.ADD).setDepth(5);
      if (motionAllowed()) this.tweens.add({ targets: glow, scale: 1.14, alpha: 0.1, duration: 1900, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    }
    const house = this.add
      .image(x, houseY, node.completed ? 'hl.map.houseLit' : 'hl.map.houseDark')
      .setOrigin(0.5, 1)
      .setDisplaySize(150, 150)
      .setDepth(6);
    // A home still waiting to be rescued sleeps under a cool moonlit tint, so lighting it
    // (full warm colour + bloom) is a visible "you brought it to life" moment.
    if (!node.completed) house.setTint(0x8a98ba);
    house.setInteractive({ useHandCursor: true }).on('pointerup', () => this.startMission(node.missionId));

    this.starRow(x, 412, node.bestStars);

    addIconButton(this, {
      x,
      y: 206,
      size: 90,
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
