import Phaser from 'phaser';
import { fadeInScene } from '../systems/SceneTransitions';
import { getSaveSystem, missionRegistry } from '../systems/GameServices';
import { bindIntents } from '../systems/bindIntents';
import { SCENE_KEYS, sceneKeyForMission, softStartScene, startParentSettingsGate, startScene, startStickerBook } from '../systems/SceneNavigation';
import { projectTownMapNodes, type TownMapNode } from '../systems/TownMapProgress';
import { ambientBirdCount, dioramaDetailsForNode, type DioramaDetail } from '../systems/TownMapDiorama';
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
    // Town-wide ambient life: a small flock that grows with everything the child has healed, so
    // the whole town feels more alive on every page — not only the page whose nodes are lit (P4-01).
    this.buildAmbientBirds(rescued);
    this.add.rectangle(480, 32, 960, 88, 0x101b2e, 0.42).setDepth(5);
  }

  // A deterministic drift of tiny birds across the upper sky, count scaling with rescues. Behind
  // the header band + all interactive layers; motion-gated, with a static flock when motion is off.
  private buildAmbientBirds(rescued: number): void {
    const count = ambientBirdCount(rescued);
    for (let i = 0; i < count; i += 1) {
      const baseX = 150 + i * 150;
      const y = 92 + (i % 3) * 26;
      const bird = this.add.text(baseX, y, 'ᵛ', { fontFamily: FONTS.label, fontSize: '18px', color: '#caa86a' }).setOrigin(0.5).setDepth(2).setAlpha(0.55);
      if (motionAllowed()) {
        this.tweens.add({ targets: bird, x: baseX + 40, y: y - 8, duration: 4200 + i * 360, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
      }
    }
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
    const justEarned = selected && this.celebrate && node.completed;
    if (justEarned) this.celebrateNode(house, x, houseY);

    // The living diorama (P4-01): each completed mission's permanent life details slot beside the
    // house, behind the house/stars/coin. On the return from the mission that earned it, the new
    // details gently reveal themselves once so the town visibly gained a bit of life.
    this.buildDioramaForNode(node, x, justEarned);

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

  // Render the permanent life details a completed mission left on its node (P4-01). Everything
  // sits behind the house (depth 6), star row (12) and coin (20), so the interactive targets are
  // never obscured. `reveal` is true only when the child just returned from earning these, giving
  // a single gentle fade/rise-in; otherwise the grown town is simply present (incl. reduced-motion).
  private buildDioramaForNode(node: TownMapNode, x: number, reveal: boolean): void {
    dioramaDetailsForNode(node).forEach((detail, i) => {
      const obj = this.buildDetail(detail, x);
      if (obj && reveal) this.revealDetail(obj, i);
    });
  }

  private buildDetail(detail: DioramaDetail, x: number): Phaser.GameObjects.GameObject | null {
    const dx = x + detail.dx;
    switch (detail.kind) {
      case 'helper':
      case 'prop':
        return detail.textureKey && hasTexture(this, detail.textureKey)
          ? this.detailSprite(detail.textureKey, dx, detail.y, detail.kind === 'helper' ? 56 : 40, detail.kind === 'helper')
          : null;
      case 'smoke':
        return this.detailSmoke(dx, detail.y);
      case 'tree':
        return this.detailTree(dx, detail.y, detail.tint ?? 0x6fc28a);
      case 'flowers':
        return this.detailFlowers(dx, detail.y, detail.tint ?? 0xff9ec4);
      case 'lamp':
        return this.detailLamp(dx, detail.y, detail.tint ?? 0xffd98a);
      case 'picnic':
        return this.detailPicnic(dx, detail.y);
    }
  }

  // A small rescued sprite (helper or mission prop), shadowed and gently bobbing when motion is on.
  private detailSprite(key: string, x: number, y: number, size: number, bob: boolean): Phaser.GameObjects.Image {
    this.add.ellipse(x, y + size * 0.42, size * 0.8, size * 0.26, 0x1b2a41, 0.28).setDepth(4);
    const sprite = this.add.image(x, y, key).setDisplaySize(size, size).setOrigin(0.5, 1).setDepth(5);
    if (bob && motionAllowed()) this.tweens.add({ targets: sprite, y: y - 4, duration: 1300, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    return sprite;
  }

  // Chimney smoke: three soft wisps rising from the lit house and fading.
  private detailSmoke(x: number, y: number): Phaser.GameObjects.Container {
    const smoke = this.add.container(x, y).setDepth(5);
    for (let i = 0; i < 3; i += 1) {
      const puff = this.add.circle(0, -i * 12, 6 - i, 0xeef2f6, 0.32 - i * 0.07);
      smoke.add(puff);
      if (motionAllowed()) this.tweens.add({ targets: puff, y: puff.y - 22, alpha: 0, duration: 2600, delay: i * 700, repeat: -1, ease: 'Sine.easeOut' });
    }
    return smoke;
  }

  // A planted tree: a trunk and a rounded canopy in a warm green.
  private detailTree(x: number, y: number, tint: number): Phaser.GameObjects.Container {
    const tree = this.add.container(x, y).setDepth(5);
    tree.add(this.add.rectangle(0, 0, 6, 22, 0x8d6e63).setOrigin(0.5, 1));
    tree.add(this.add.circle(0, -22, 15, tint).setStrokeStyle(2, 0x2c4a3a, 0.6));
    tree.add(this.add.circle(-8, -16, 10, tint).setStrokeStyle(2, 0x2c4a3a, 0.5));
    tree.add(this.add.circle(9, -16, 10, tint).setStrokeStyle(2, 0x2c4a3a, 0.5));
    return tree;
  }

  // A flower box: a little planter with three blooms.
  private detailFlowers(x: number, y: number, tint: number): Phaser.GameObjects.Container {
    const box = this.add.container(x, y).setDepth(5);
    box.add(this.add.rectangle(0, 0, 34, 12, 0x8d6e63).setOrigin(0.5, 1).setStrokeStyle(1, 0x5a4038));
    for (let i = -1; i <= 1; i += 1) {
      box.add(this.add.rectangle(i * 10, -10, 2, 10, 0x4f8a4f).setOrigin(0.5, 1));
      box.add(this.add.circle(i * 10, -12, 4, tint).setStrokeStyle(1, 0xffffff, 0.5));
    }
    return box;
  }

  // A street lamp that flickers warmly on with a soft glow at its head.
  private detailLamp(x: number, y: number, tint: number): Phaser.GameObjects.Container {
    const lamp = this.add.container(x, y).setDepth(5);
    lamp.add(this.add.rectangle(0, 0, 5, 34, 0x44546b).setOrigin(0.5, 1));
    const glow = this.add.circle(0, -34, 9, tint, 0.85).setBlendMode(Phaser.BlendModes.ADD);
    lamp.add(glow);
    if (motionAllowed()) this.tweens.add({ targets: glow, alpha: 0.45, duration: 1700, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    return lamp;
  }

  // A picnic blanket laid out on the grass — a checked patch.
  private detailPicnic(x: number, y: number): Phaser.GameObjects.Container {
    const picnic = this.add.container(x, y).setDepth(5);
    picnic.add(this.add.rectangle(0, 0, 38, 22, 0xe8857a, 0.9).setStrokeStyle(2, 0xffffff, 0.5));
    picnic.add(this.add.rectangle(-9, -5, 18, 10, 0xffffff, 0.35));
    picnic.add(this.add.rectangle(9, 4, 18, 10, 0xffffff, 0.35));
    return picnic;
  }

  // The one-time arrival of a freshly-earned detail: it fades in once, then rests as a permanent
  // part of the town. Alpha-only so it never fights a detail's own bob/smoke/flicker tween.
  // Motion-gated — reduced motion just shows it already settled.
  private revealDetail(obj: Phaser.GameObjects.GameObject, index: number): void {
    if (!motionAllowed()) return;
    const target = obj as unknown as Phaser.GameObjects.Components.Alpha;
    if (typeof target.alpha !== 'number') return;
    const restAlpha = target.alpha;
    target.setAlpha(0);
    this.tweens.add({ targets: target, alpha: restAlpha, duration: 560, delay: 240 + index * 170, ease: 'Sine.easeOut' });
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
