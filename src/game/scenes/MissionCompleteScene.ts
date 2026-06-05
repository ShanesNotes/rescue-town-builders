import Phaser from 'phaser';
import { fadeInScene } from '../systems/SceneTransitions';
import type { MissionResult } from '../types';
import { createCelebrationPlan } from '../systems/Celebration';
import { getSaveSystem, missionRegistry, getSfx } from '../systems/GameServices';
import { bindIntents } from '../systems/bindIntents';
import { returnToTownMap, startStickerBook } from '../systems/SceneNavigation';
import { registerE2EButton } from '../systems/E2EBridge';
import { STICKER_DEFINITIONS } from '../data/stickers';
import { addIconButton } from '../ui/Button';
import { FONTS } from '../ui/typography';
import { hasTexture, motionAllowed } from '../ui/Sprite';

const PLACE: Record<string, string> = {
  'recycling-run': 'recycling yard',
  'house-builder': 'new home',
  'fire-fix': 'picnic',
  'inverse-dream': 'dream',
  'dream-statues': 'statue garden',
  'recycled-inventions': 'workshop',
  'bread-rush': 'bakery',
  'goo-cleanup': 'town square',
  'frog-flight': 'sky',
  'asteroid-blaster': 'night sky',
  'scooter-roundup': 'meadow',
  'safety-lights': 'crossing',
  'bike-explorer': 'neighborhood',
  'treasure-boat': 'harbor',
};
// The place that just got better — painted behind the celebration so the lit window is in THAT world.
const MISSION_BG: Record<string, string> = {
  'recycling-run': 'hl.bg.recycle',
  'house-builder': 'hl.bg.build',
  'fire-fix': 'hl.bg.fire',
  'inverse-dream': 'hl.bg.inverseDream',
  'dream-statues': 'hl.bg.dreamStatues',
  'recycled-inventions': 'hl.bg.recycledInventions',
  'bread-rush': 'hl.bg.breadRush',
  'goo-cleanup': 'hl.bg.gooCleanup',
  'frog-flight': 'hl.bg.frogFlight',
  'asteroid-blaster': 'hl.bg.asteroidBlaster',
  'scooter-roundup': 'hl.bg.scooterRoundup',
  'safety-lights': 'hl.bg.safetyLights',
  'bike-explorer': 'hl.bg.bikeExplorer',
  'treasure-boat': 'hl.bg.treasureBoat',
};
const CONFETTI = [0xffc857, 0xe86f3a, 0x43a29c, 0xffd98a, 0xffb3c6, 0xf2f0e6];

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
    const saves = getSaveSystem();
    const profile = saves.getSelectedProfile();
    if (!this.result || !profile) {
      returnToTownMap(this);
      return;
    }

    const updated = saves.recordMissionResult(profile.id, this.result);
    const mission = missionRegistry.get(this.result.missionId);
    const celebration = createCelebrationPlan(this.result);
    const place = PLACE[this.result.missionId] ?? 'town';

    // Land the child back on the node they just lit (selected, glowing, pulsing) instead of map
    // page 0 — so they SEE the new star they earned (P2-01). Nodes follow registry list order,
    // paged 3-per-screen, matching TownMapScene.
    const order = missionRegistry.list().findIndex((m) => m.id === this.result!.missionId);
    const focus = order >= 0 ? { page: Math.floor(order / 3), selectedIndex: order % 3 } : undefined;
    const goHome = (): void => returnToTownMap(this, focus);

    this.paintWorld(MISSION_BG[this.result.missionId] ?? 'hl.bg.town');

    // Title — the light IS the completion.
    this.add
      .text(480, 64, 'A WINDOW GLOWS', { fontFamily: FONTS.display, fontSize: '46px', color: '#FFE2A6', fontStyle: 'bold', stroke: '#2A1606', strokeThickness: 8 })
      .setOrigin(0.5)
      .setDepth(20)
      .setShadow(0, 4, '#1a0d02', 7, true, true);
    this.add
      .text(480, 112, `Because you helped, the ${place} lights up.`, { fontFamily: FONTS.display, fontSize: '20px', color: '#EBDDDA', stroke: '#1B2A41', strokeThickness: 4 })
      .setOrigin(0.5)
      .setDepth(20);

    // Stars cascade in with sound (across the top).
    this.starCascade(celebration.starCount);

    // The rescued hero, bounding in happy (left of centre).
    if (mission) this.heroEntrance(`hl.char.${mission.characterId}`, 352, 408);

    // The new sticker pops after the stars (right of centre).
    this.stickerReveal(this.result.stickersUnlocked, celebration.starCount, 666, 318);

    // Warm celebration line (No-Fail: every finish is full joy).
    this.add
      .text(480, 470, celebration.message, { fontFamily: FONTS.display, fontSize: '30px', color: '#FFE2A6', fontStyle: 'bold', stroke: '#2A1606', strokeThickness: 6 })
      .setOrigin(0.5)
      .setDepth(20);
    this.starTag(480, 506, updated.progress.totalStars);

    // The one obvious way home (always present + working immediately — No-Fail).
    addIconButton(this, {
      x: 850,
      y: 500,
      size: 76,
      key: 'hl.ui.back',
      caption: 'Town',
      onPress: goHome,
      testId: 'mission.complete.back-to-map',
      pulse: true,
    }).setDepth(30);

    this.confettiShower(celebration.confettiBursts * 4 + 12);
    getSfx().play('fanfare');
    if (motionAllowed()) {
      this.cameras.main.setZoom(1.05);
      this.cameras.main.zoomTo(1, 360, 'Sine.easeOut');
    }

    bindIntents(this, { onConfirm: goHome, onBack: goHome });
  }

  private paintWorld(bgKey: string): void {
    this.add.image(480, 270, hasTexture(this, bgKey) ? bgKey : 'hl.bg.town').setDisplaySize(960, 540).setDepth(0);
    // A gentle edge vignette that stays CLEAR in the centre, so the light reads as the brightest point.
    this.add.rectangle(480, 30, 960, 80, 0x101b2e, 0.34).setDepth(1);
    this.add.rectangle(480, 510, 960, 80, 0x101b2e, 0.34).setDepth(1);
    // A warm bloom — a window just lit because of the child — the brightest, warmest point.
    const bloom = this.add.circle(480, 300, 280, 0xffd98a, 0.18).setBlendMode(Phaser.BlendModes.ADD).setDepth(1);
    this.add.circle(480, 300, 150, 0xffe6a3, 0.16).setBlendMode(Phaser.BlendModes.ADD).setDepth(1);
    if (motionAllowed()) this.tweens.add({ targets: bloom, scale: 1.1, alpha: 0.1, duration: 2200, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
  }

  private heroEntrance(key: string, x: number, feetY: number): void {
    this.add.ellipse(x, feetY + 4, 118, 26, 0x0a1322, 0.45).setDepth(9);
    const hero = this.add.image(x, feetY, key).setOrigin(0.5, 1).setDisplaySize(150, 150).setDepth(11);
    if (!motionAllowed()) return;
    const base = hero.scale;
    hero.setScale(0);
    this.tweens.add({ targets: hero, scale: base, duration: 460, ease: 'Back.easeOut' });
  }

  private starCascade(count: 1 | 2 | 3): void {
    const y = 178;
    const startX = 480 - (count - 1) * 52;
    for (let i = 0; i < count; i += 1) {
      const x = startX + i * 104;
      const star = this.add.image(x, y, 'hl.prop.star').setDisplaySize(78, 78).setDepth(15);
      if (!motionAllowed()) continue;
      const base = star.scale;
      star.setScale(0);
      this.tweens.add({
        targets: star,
        scale: base,
        ease: 'Back.easeOut',
        duration: 360,
        delay: 260 + i * 240,
        onStart: () => {
          getSfx().play('correct');
          this.sparkle(x, y);
        },
      });
    }
  }

  private stickerReveal(stickerIds: string[], starCount: number, x: number, y: number): void {
    const id = stickerIds[0];
    if (!id) return;
    const def = STICKER_DEFINITIONS.find((s) => s.id === id);
    const delay = 260 + starCount * 240 + 220;
    // Show the ACTUAL sticker just earned (frame + its real icon), so the payoff has its subject.
    const frame = this.add.image(x, y, 'hl.ui.stickerFrame').setDisplaySize(110, 110).setDepth(16);
    const icon = def && hasTexture(this, def.icon) ? this.add.image(x, y - 4, def.icon).setDisplaySize(58, 58).setDepth(17) : null;
    const title = this.add
      .text(x, y + 70, def?.title ?? 'New sticker!', { fontFamily: FONTS.display, fontSize: '20px', color: '#FFE2A6', fontStyle: 'bold', stroke: '#2A1606', strokeThickness: 5, align: 'center', wordWrap: { width: 280 } })
      .setOrigin(0.5)
      .setDepth(17);
    // Tap the just-popped sticker to read its little story right now (P2-02): opens the Sticker
    // Book straight to THIS sticker's reading page (childPoem/parentNote), not two scenes away.
    const openReading = (): void => startStickerBook(this, id);
    frame.setInteractive({ useHandCursor: true }).on('pointerup', openReading);
    registerE2EButton({ testId: 'mission.complete.read-sticker', label: def?.title ?? 'New sticker', sceneKey: this.scene.key, press: openReading });
    if (!motionAllowed()) return;
    // Pop each in to its OWN base display-scale (images keep their setDisplaySize size).
    const items: Array<{ o: Phaser.GameObjects.Image | Phaser.GameObjects.Text; base: number }> = [
      { o: frame, base: frame.scale },
      { o: title, base: 1 },
      ...(icon ? [{ o: icon, base: icon.scale }] : []),
    ];
    items.forEach(({ o, base }, i) => {
      o.setScale(0);
      this.tweens.add({ targets: o, scale: base, ease: 'Back.easeOut', duration: 420, delay, onStart: i === 0 ? () => getSfx().play('sticker') : undefined });
    });
    this.tweens.add({ targets: [frame, ...(icon ? [icon] : [])], angle: { from: -5, to: 5 }, duration: 1600, yoyo: true, repeat: -1, ease: 'Sine.easeInOut', delay: delay + 420 });
  }

  private sparkle(x: number, y: number): void {
    for (let i = 0; i < 6; i += 1) {
      const a = (Math.PI * 2 * i) / 6;
      const p = this.add.circle(x, y, 4, 0xffe2a6).setBlendMode(Phaser.BlendModes.ADD).setDepth(18);
      this.tweens.add({ targets: p, x: x + Math.cos(a) * 46, y: y + Math.sin(a) * 46, alpha: 0, scale: 0.4, duration: 520, ease: 'Quad.easeOut', onComplete: () => p.destroy() });
    }
  }

  private confettiShower(count: number): void {
    if (!motionAllowed()) return;
    for (let i = 0; i < count; i += 1) {
      const x = 120 + Math.random() * 720;
      const piece = this.add
        .rectangle(x, -20 - Math.random() * 120, 8 + Math.random() * 6, 12 + Math.random() * 6, CONFETTI[i % CONFETTI.length])
        .setDepth(25)
        .setAngle(Math.random() * 360);
      this.tweens.add({
        targets: piece,
        y: 580,
        x: x + (Math.random() * 120 - 60),
        angle: piece.angle + (Math.random() * 540 - 270),
        duration: 2200 + Math.random() * 1600,
        delay: Math.random() * 900,
        ease: 'Sine.easeIn',
        onComplete: () => piece.destroy(),
      });
    }
  }

  private starTag(x: number, y: number, total: number): void {
    this.add.image(x - 26, y, 'hl.prop.star').setDisplaySize(22, 22).setDepth(20);
    this.add
      .text(x - 8, y, `${total}`, { fontFamily: FONTS.display, fontSize: '20px', color: '#FFE2A6', fontStyle: 'bold', stroke: '#2A1606', strokeThickness: 4 })
      .setOrigin(0, 0.5)
      .setDepth(20);
  }
}
