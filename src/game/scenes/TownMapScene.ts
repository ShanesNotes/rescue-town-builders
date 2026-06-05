import Phaser from 'phaser';
import { fadeInScene } from '../systems/SceneTransitions';
import { getSaveSystem, missionRegistry } from '../systems/GameServices';
import { bindIntents } from '../systems/bindIntents';
import { SCENE_KEYS, sceneKeyForMission, softStartScene, startParentSettingsGate, startScene, startStickerBook } from '../systems/SceneNavigation';
import { projectTownMapNodes, type TownMapNode } from '../systems/TownMapProgress';
import { addIconButton } from '../ui/Button';
import { FONTS } from '../ui/typography';
import { hasTexture, motionAllowed } from '../ui/Sprite';
import { createSecretsForProfile, addSecretHotspot } from '../systems/secretHotspot';

const MISSION_ICON: Record<string, string> = {
  'recycling-run': 'hl.ui.recycle',
  'house-builder': 'hl.ui.build',
  'fire-fix': 'hl.ui.fire',
};
// Three lamp-lit platforms built into the near-path parallax layer; the town is paged 3-per-screen.
const NODE_X = [252, 480, 708];
const PER_PAGE = 3;

export class TownMapScene extends Phaser.Scene {
  private selectedIndex = 0;
  private page = 0;
  private celebrate = false;
  private pageNodes: TownMapNode[] = [];
  // Per-node coin centres + a single movable selection highlight, so an in-page arrow press moves
  // the highlight IN-PLACE instead of restarting the scene every keypress (P2-07).
  private nodeX: number[] = [];
  private selectEllipse!: Phaser.GameObjects.Ellipse;
  private coinPulse!: Phaser.GameObjects.Arc;
  private coinPulseTween?: Phaser.Tweens.Tween;

  constructor() {
    super('TownMapScene');
  }

  init(data: { page?: number; selectedIndex?: number; celebrate?: boolean }): void {
    this.page = data.page ?? 0;
    this.selectedIndex = data.selectedIndex ?? 0;
    // One-shot: a returning-from-a-finished-mission landing pulses the freshly-lit house once.
    this.celebrate = data.celebrate ?? false;
  }

  create(): void {
    fadeInScene(this);
    const profile = getSaveSystem().getSelectedProfile();
    if (!profile) {
      startScene(this, SCENE_KEYS.profile);
      return;
    }

    const nodes = projectTownMapNodes(missionRegistry.list(), profile);
    const pageCount = Math.max(1, Math.ceil(nodes.length / PER_PAGE));
    this.page = Math.max(0, Math.min(pageCount - 1, this.page));
    this.pageNodes = nodes.slice(this.page * PER_PAGE, this.page * PER_PAGE + PER_PAGE);
    this.selectedIndex = Math.max(0, Math.min(this.pageNodes.length - 1, this.selectedIndex));

    this.paintWorld(nodes.filter((n) => n.completed).length, nodes.length);
    this.paintHeader();

    // The movable selection highlight (a warm gold ellipse under the selected house + a pulse glow
    // behind its coin), repositioned in-place by applySelection() — no per-keypress restart (P2-07).
    this.nodeX = [];
    this.selectEllipse = this.add.ellipse(0, 0, 188, 50, 0xffd98a, 0.18).setBlendMode(Phaser.BlendModes.ADD).setDepth(4).setVisible(false);
    this.coinPulse = this.add.circle(0, 206, 56, 0xffc857, 0.18).setDepth(19).setVisible(false);

    this.pageNodes.forEach((node, index) => this.buildNode(node, index));
    this.buildPager(pageCount);
    this.applySelection();

    this.cornerCoin(52, 46, 'hl.ui.back', () => softStartScene(this, SCENE_KEYS.profile), 'townmap.profiles');
    this.cornerCoin(908, 46, 'hl.ui.stickers', () => startStickerBook(this), 'townmap.sticker-book');
    this.cornerCoin(908, 498, 'hl.ui.settings', () => startParentSettingsGate(this, SCENE_KEYS.townMap), 'townmap.parent-settings');

    // Cluckle's Dream: a sleepy hen who dreams the whole town in miniature (3 touches).
    const secrets = createSecretsForProfile();
    addSecretHotspot(this, secrets, 'cluckle-dream', 70, 498);

    this.bindKeys(pageCount);
  }

  private paintWorld(rescued: number, total: number): void {
    this.add.image(480, 270, 'hl.map.sky').setDisplaySize(960, 540).setDepth(0);
    this.add.image(480, 314, 'hl.map.farHills').setOrigin(0.5, 1).setDepth(1);
    this.add.image(480, 396, 'hl.map.midTown').setOrigin(0.5, 1).setDepth(2);
    this.add.image(480, 540, 'hl.map.nearPath').setOrigin(0.5, 1).setDepth(3);
    const warmth = total > 0 ? rescued / total : 0;
    this.add.rectangle(480, 270, 960, 540, 0xffb24a, 0.04 + warmth * 0.06).setBlendMode(Phaser.BlendModes.ADD).setDepth(4);
    this.add.rectangle(480, 32, 960, 88, 0x101b2e, 0.42).setDepth(5);
  }

  private paintHeader(): void {
    this.add
      .text(480, 34, 'RESCUE TOWN', { fontFamily: FONTS.display, fontSize: '34px', color: '#FFE2A6', fontStyle: 'bold', stroke: '#2A1606', strokeThickness: 7 })
      .setOrigin(0.5)
      .setDepth(30);
  }

  private buildNode(node: TownMapNode, index: number): void {
    const x = NODE_X[index] ?? 160 + index * 200;
    const selected = index === this.selectedIndex;
    const houseY = 392;
    this.nodeX[index] = x;

    if (node.completed) {
      const glow = this.add.circle(x, houseY - 52, 84, 0xffc14a, 0.2).setBlendMode(Phaser.BlendModes.ADD).setDepth(5);
      if (motionAllowed()) this.tweens.add({ targets: glow, scale: 1.14, alpha: 0.1, duration: 1900, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    }
    // The house is decorative only. The pulsing mission coin (below) is the single, obvious launch
    // target — one tap per node. (Previously the house had a raw unguarded pointerup that
    // double-fired with the coin and launched on stray drags — a No-Fail input-safety hole.)
    const house = this.add
      .image(x, houseY, node.completed ? 'hl.map.houseLit' : 'hl.map.houseDark')
      .setOrigin(0.5, 1)
      .setDisplaySize(150, 150)
      .setDepth(6);
    this.add.rectangle(x, 256, 7, 96, 0xffd98a, 0.1).setBlendMode(Phaser.BlendModes.ADD).setDepth(5);

    // Landing here straight from finishing this mission: a one-shot celebratory pulse on the
    // freshly-lit house so the child SEES the star/house they just earned (P2-01).
    if (selected && this.celebrate && node.completed) this.celebrateNode(house, x, houseY);

    this.starRow(x, 412, node.bestStars);

    const coinKey = node.coinKey && hasTexture(this, node.coinKey) ? node.coinKey : MISSION_ICON[node.missionId] ?? 'hl.ui.play';
    addIconButton(this, {
      x,
      y: 206,
      size: 90,
      key: coinKey,
      onPress: () => this.startMission(node),
      testId: `townmap.mission.${node.missionId}`,
    }).setDepth(20);
  }

  // Move the gold selection ellipse under the selected house + the pulse glow behind its coin, in
  // place (P2-07). Reserved for the SAME page; an actual page change still restarts (goPage).
  private applySelection(): void {
    const x = this.nodeX[this.selectedIndex];
    if (x === undefined) {
      this.selectEllipse.setVisible(false);
      this.coinPulse.setVisible(false);
      return;
    }
    this.selectEllipse.setPosition(x, 396).setVisible(true);
    this.coinPulse.setPosition(x, 206).setVisible(true);
    this.coinPulseTween?.remove();
    if (motionAllowed()) {
      this.coinPulse.setScale(1).setAlpha(0.18);
      this.coinPulseTween = this.tweens.add({ targets: this.coinPulse, scale: 1.25, alpha: 0.05, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    }
  }

  // A one-shot warm pulse + sparkle on the house just lit by finishing its mission. Gated on
  // motionAllowed (a still child still lands on the right node, just without the flourish).
  private celebrateNode(house: Phaser.GameObjects.Image, x: number, houseY: number): void {
    if (!motionAllowed()) return;
    const base = house.scale;
    this.tweens.add({ targets: house, scale: base * 1.12, duration: 320, yoyo: true, repeat: 1, ease: 'Sine.easeInOut' });
    const ring = this.add.circle(x, houseY - 52, 70, 0xffe2a6, 0.5).setBlendMode(Phaser.BlendModes.ADD).setDepth(7);
    this.tweens.add({ targets: ring, scale: 2, alpha: 0, duration: 900, ease: 'Quad.easeOut', onComplete: () => ring.destroy() });
  }

  // Prev/next page coins + page dots (only when the town spans more than one screen).
  private buildPager(pageCount: number): void {
    if (pageCount <= 1) return;
    if (this.page > 0) addIconButton(this, { x: 44, y: 300, size: 60, key: 'hl.ui.back', onPress: () => this.goPage(this.page - 1), testId: 'townmap.prev' }).setDepth(30);
    if (this.page < pageCount - 1) {
      const next = addIconButton(this, { x: 916, y: 300, size: 60, key: 'hl.ui.back', onPress: () => this.goPage(this.page + 1), testId: 'townmap.next' });
      next.setScale(-1, 1).setDepth(30); // mirror the arrow to point right
    }
    const gap = 22;
    const startX = 480 - ((pageCount - 1) * gap) / 2;
    for (let i = 0; i < pageCount; i += 1) {
      this.add.circle(startX + i * gap, 506, 6, i === this.page ? 0xffc857 : 0x3a4a66).setStrokeStyle(2, 0x1b2a41).setDepth(30);
    }
  }

  private goPage(page: number): void {
    this.scene.restart({ page, selectedIndex: 0 });
  }

  private starRow(cx: number, y: number, best: 0 | 1 | 2 | 3): void {
    const slots = 3;
    const gap = 30;
    const start = cx - ((slots - 1) * gap) / 2;
    for (let i = 0; i < slots; i += 1) {
      const earned = i < best;
      this.add.image(start + i * gap, y, 'hl.prop.star').setDisplaySize(26, 26).setDepth(12).setAlpha(earned ? 1 : 0.28).setTint(earned ? 0xffffff : 0x4a5a72);
    }
  }

  private cornerCoin(x: number, y: number, key: string, onPress: () => void, testId: string): void {
    addIconButton(this, { x, y, size: 58, key, onPress, testId }).setDepth(30);
  }

  private bindKeys(pageCount: number): void {
    bindIntents(this, {
      onMove: (x, y) => this.moveSelection(x || y, pageCount),
      onConfirm: () => {
        const node = this.pageNodes[this.selectedIndex];
        if (node) this.startMission(node);
      },
      onBack: () => softStartScene(this, SCENE_KEYS.profile),
    });
  }

  private moveSelection(delta: number, pageCount: number): void {
    if (!delta) return;
    const next = this.selectedIndex + delta;
    if (next < 0 && this.page > 0) {
      this.scene.restart({ page: this.page - 1, selectedIndex: PER_PAGE - 1 });
      return;
    }
    if (next >= this.pageNodes.length && this.page < pageCount - 1) {
      this.scene.restart({ page: this.page + 1, selectedIndex: 0 });
      return;
    }
    // Same page: move the highlight IN-PLACE (P2-07). Only a real PAGE change (above) restarts.
    this.selectedIndex = Math.max(0, Math.min(this.pageNodes.length - 1, next));
    this.applySelection();
  }

  private startMission(node: TownMapNode): void {
    softStartScene(this, sceneKeyForMission(node.missionId, node.archetype), { missionId: node.missionId });
  }
}
