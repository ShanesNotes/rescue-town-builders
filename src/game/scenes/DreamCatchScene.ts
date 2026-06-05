import Phaser from 'phaser';
import { fadeInScene } from '../systems/SceneTransitions';
import { dreamCatchLevels, dreamFallSpeeds } from '../data/dreamCatchLevels';
import { bindIntents } from '../systems/bindIntents';
import { registerE2EButton, isE2EEnabled } from '../systems/E2EBridge';
import { Juice } from '../systems/Juice';
import { completeMission, returnToTownMap } from '../systems/SceneNavigation';
import { confirmMissionExit, isMissionExitOpen } from '../systems/confirmMissionExit';
import { isOverlayOpen } from '../systems/overlayLock';
import { getSfx, getVoice } from '../systems/GameServices';
import {
  catchDream,
  createDreamCatchState,
  getDreamCatchResult,
  missDream,
  type DreamCatchState,
  type DreamType,
} from '../systems/DreamCatch';
import { addIconButton } from '../ui/Button';
import { hasTexture, motionAllowed } from '../ui/Sprite';
import type { MissionId } from '../types';

// Cluckle's Dream Catch — a no-fail Arcade catcher (replaces drag-to-match Inverse Dream). The
// dreaming hen drops sun (day) and moon (night) dream-orbs; slide the basket to catch them and each
// sorts into its day/night bin. A missed dream just drifts off and another falls — only catching
// counts. Serves the dream missions (inverse-dream + the captured dream-statues) — it reads its
// launching missionId to pick the backdrop + sticker.

type Drop = Phaser.Physics.Arcade.Image;

// Per-mission backdrop (the captured dream missions each keep their own town location).
const DREAM_BACKDROP: Partial<Record<MissionId, string>> = {
  'inverse-dream': 'hl.bg.inverseDream',
  'dream-statues': 'hl.bg.dreamStatues',
};

const BASKET_Y = 470;
const BASKET_HALF = 58;
const SUN_BIN = { x: 150, y: 498 };
const MOON_BIN = { x: 810, y: 498 };
const SPAWN_MS = 1000;

export class DreamCatchScene extends Phaser.Scene {
  private state!: DreamCatchState;
  private basket!: Phaser.GameObjects.Image;
  private cluckle!: Phaser.GameObjects.Image;
  private drops = new Set<Drop>();
  private pips: Phaser.GameObjects.Arc[] = [];
  private roundDots: Phaser.GameObjects.Arc[] = [];
  private bag: DreamType[] = [];
  private bagIndex = 0;
  private roundIndex = 0;
  private fallSpeed = dreamFallSpeeds[0]!;
  private pointerX: number | null = null;
  private missionId: MissionId = 'inverse-dream';
  private done = false;

  constructor() {
    super({ key: 'DreamCatchScene', physics: { default: 'arcade', arcade: { gravity: { x: 0, y: 240 } } } });
  }

  init(data: { missionId?: MissionId }): void {
    this.missionId = data.missionId ?? 'inverse-dream';
  }

  create(): void {
    fadeInScene(this);
    this.roundIndex = 0;
    this.state = createDreamCatchState(dreamCatchLevels[0]!);
    this.drops = new Set();
    this.pips = [];
    this.roundDots = [];
    this.bag = dreamCatchLevels[0]!.types;
    this.bagIndex = 0;
    this.fallSpeed = dreamFallSpeeds[0]!;
    this.pointerX = null;
    this.done = false;

    this.makeDreamTextures();
    this.paintWorld();
    this.buildPips();
    this.buildRoundDots();
    this.buildBins();

    this.cluckle = this.add.image(480, 96, 'hl.char.cluckle').setOrigin(0.5, 0).setDisplaySize(110, 110).setDepth(12);
    if (motionAllowed()) this.tweens.add({ targets: this.cluckle, x: 540, duration: 2600, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

    this.basket = this.add.image(480, BASKET_Y, hasTexture(this, 'hl.prop.rescueBasket') ? 'hl.prop.rescueBasket' : '__basket').setDisplaySize(116, 80).setDepth(20);

    addIconButton(this, { x: 52, y: 46, size: 56, key: 'hl.ui.back', onPress: () => this.requestExit(), testId: `${this.missionId}.back-to-map` }).setDepth(40);

    registerE2EButton({ testId: 'dream.catch', label: 'catch dream', sceneKey: this.scene.key, press: () => this.e2eCatch() });

    bindIntents(this, {
      onMove: (x) => this.nudgeBasket(x),
      onBack: () => !isOverlayOpen(this) && this.requestExit(),
    });
    this.input.on('pointermove', (p: Phaser.Input.Pointer) => (this.pointerX = p.x));
    this.input.on('pointerdown', (p: Phaser.Input.Pointer) => (this.pointerX = p.x));

    if (!isE2EEnabled()) {
      this.time.addEvent({ delay: SPAWN_MS, loop: true, callback: () => this.dropDream() });
      this.time.delayedCall(400, () => this.dropDream());
    }

    getVoice().speak('mission-start-build');
  }

  private makeDreamTextures(): void {
    const orb = (key: string, color: number, accent: number): void => {
      if (this.textures.exists(key)) return;
      const g = this.add.graphics();
      g.fillStyle(color, 1).fillCircle(24, 24, 18);
      g.fillStyle(0xffffff, 0.85).fillCircle(18, 18, 5); // highlight
      g.lineStyle(3, accent, 0.9).strokeCircle(24, 24, 18);
      g.generateTexture(key, 48, 48);
      g.destroy();
    };
    orb('__dreamSun', 0xffd24a, 0xe88a2a);
    orb('__dreamMoon', 0xb9a8e8, 0x6a5ba8);
    if (!this.textures.exists('__basket')) {
      const g = this.add.graphics();
      g.fillStyle(0xc8945a, 1).fillRoundedRect(0, 14, 116, 52, 12);
      g.fillStyle(0x8a5a2c, 1).fillRoundedRect(0, 8, 116, 14, 7);
      g.lineStyle(3, 0x5a3a1c, 1).strokeRoundedRect(2, 10, 112, 56, 12);
      g.generateTexture('__basket', 116, 72);
      g.destroy();
    }
  }

  private paintWorld(): void {
    const bg = DREAM_BACKDROP[this.missionId] ?? 'hl.bg.inverseDream';
    this.add.image(480, 270, hasTexture(this, bg) ? bg : 'hl.bg.town').setDisplaySize(960, 540).setDepth(0);
    this.add.rectangle(480, 270, 960, 540, 0x101b2e, 0.12).setDepth(1);
  }

  private buildPips(): void {
    const total = this.state.goal;
    const gap = 22;
    const startX = 480 - ((total - 1) * gap) / 2;
    for (let i = 0; i < total; i += 1) {
      this.pips.push(this.add.circle(startX + i * gap, 42, 6, 0x3a4a66).setStrokeStyle(2, 0x1b2a41).setDepth(30));
    }
  }

  // The goal grows each round, so the pip row is rebuilt when a new round starts.
  private rebuildPips(): void {
    for (const pip of this.pips) pip.destroy();
    this.pips = [];
    this.buildPips();
  }

  // One dot per round (top-right) — the child sees how many dream-rounds are left.
  private buildRoundDots(): void {
    for (let i = 0; i < dreamCatchLevels.length; i += 1) {
      this.roundDots.push(this.add.circle(812 + i * 24, 42, 8, 0x3a4a66).setStrokeStyle(2, 0x1b2a41).setDepth(30));
    }
    this.updateRoundDots();
  }

  private updateRoundDots(): void {
    this.roundDots.forEach((dot, i) => {
      dot.setFillStyle(i < this.roundIndex ? 0xc9b8e8 : i === this.roundIndex ? 0x6a5ba8 : 0x3a4a66);
    });
  }

  private buildBins(): void {
    ([[SUN_BIN, '__dreamSun', 0xffd24a], [MOON_BIN, '__dreamMoon', 0xb9a8e8]] as const).forEach(([bin, key, color]) => {
      this.add.circle(bin.x, bin.y, 40, color, 0.18).setBlendMode(Phaser.BlendModes.ADD).setDepth(6);
      this.add.image(bin.x, bin.y - 36, key).setDisplaySize(36, 36).setDepth(7);
      this.add.ellipse(bin.x, bin.y + 24, 86, 26, 0x16243a, 0.5).setDepth(6);
    });
  }

  private dropDream(): void {
    if (this.done || this.overlayBusy()) return;
    const type = this.bag[this.bagIndex % this.bag.length] ?? 'sun';
    this.bagIndex += 1;
    const x = 220 + Math.random() * 520;
    const drop = this.physics.add.image(x, 150, type === 'sun' ? '__dreamSun' : '__dreamMoon').setDepth(15) as Drop;
    drop.setData('type', type);
    drop.setVelocity((Math.random() - 0.5) * 30, this.fallSpeed);
    const glow = this.add.circle(x, 150, 22, type === 'sun' ? 0xffd24a : 0xb9a8e8, 0.25).setBlendMode(Phaser.BlendModes.ADD).setDepth(14);
    drop.setData('glow', glow);
    this.drops.add(drop);
  }

  update(): void {
    if (this.done) return;
    if (this.pointerX !== null && !this.overlayBusy()) {
      this.basket.x = Phaser.Math.Clamp(this.pointerX, 120, 840);
    }
    for (const drop of [...this.drops]) {
      if (!drop.active) {
        this.drops.delete(drop);
        continue;
      }
      const glow = drop.getData('glow') as Phaser.GameObjects.Arc | undefined;
      if (glow) glow.setPosition(drop.x, drop.y);
      // Caught: reaches the basket band and overlaps it horizontally.
      if (drop.y > BASKET_Y - 36 && drop.y < BASKET_Y + 24 && Math.abs(drop.x - this.basket.x) < BASKET_HALF) {
        this.onCatch(drop);
        continue;
      }
      if (drop.y > 560) this.onMiss(drop);
    }
  }

  private onCatch(drop: Drop): void {
    const type = (drop.getData('type') as DreamType) ?? 'sun';
    this.state = catchDream(this.state);
    getSfx().play('correct');
    Juice.punch(this, this.basket, 1.14, 120);
    Juice.flashWhite(this, this.basket, 60);
    // The dream flies into its day/night bin — the sort payoff.
    const bin = type === 'sun' ? SUN_BIN : MOON_BIN;
    const glow = drop.getData('glow') as Phaser.GameObjects.Arc | undefined;
    if (drop.body) drop.body.enable = false;
    if (motionAllowed()) {
      this.tweens.add({ targets: drop, x: bin.x, y: bin.y - 30, scale: 0.5, duration: 360, ease: 'Quad.easeIn', onComplete: () => { Juice.burst(this, bin.x, bin.y - 20, { color: type === 'sun' ? 0xffd24a : 0xb9a8e8, count: 8, radius: 26 }); drop.destroy(); glow?.destroy(); } });
    } else {
      drop.destroy();
      glow?.destroy();
    }
    this.drops.delete(drop);
    this.updatePips();
    if (this.state.completed && !this.done) this.roundComplete();
  }

  private onMiss(drop: Drop): void {
    this.state = missDream(this.state);
    const glow = drop.getData('glow') as Phaser.GameObjects.Arc | undefined;
    glow?.destroy();
    drop.destroy();
    this.drops.delete(drop);
  }

  private e2eCatch(): void {
    if (this.done) return;
    this.state = catchDream(this.state);
    this.updatePips();
    if (this.state.completed && !this.done) this.roundComplete();
  }

  private nudgeBasket(dir: number): void {
    if (!dir || this.done || this.overlayBusy()) return;
    this.basket.x = Phaser.Math.Clamp(this.basket.x + dir * 48, 120, 840);
  }

  private updatePips(): void {
    this.pips.forEach((pip, i) => {
      const done = i < this.state.caught;
      pip.setFillStyle(done ? 0xc9b8e8 : 0x3a4a66);
      if (done && motionAllowed()) Juice.punch(this, pip, 1.4, 120);
    });
  }

  private clearDrops(): void {
    for (const drop of [...this.drops]) {
      (drop.getData('glow') as Phaser.GameObjects.Arc | undefined)?.destroy();
      drop.destroy();
    }
    this.drops.clear();
  }

  // A round of catching is done. If more rounds remain, start the next (faster) round in place;
  // otherwise complete the mission. `done` pauses spawning/catching during the swap.
  private roundComplete(): void {
    this.done = true;
    this.clearDrops();
    this.roundIndex += 1;
    this.updateRoundDots();
    if (this.roundIndex < dreamCatchLevels.length) {
      if (isE2EEnabled()) {
        this.startRound();
        return;
      }
      getSfx().play('correct');
      Juice.hitStop(this, 80);
      Juice.confetti(this, 16);
      if (motionAllowed()) Juice.punch(this, this.cluckle, 1.16, 200);
      this.time.delayedCall(motionAllowed() ? 700 : 0, () => this.startRound());
    } else {
      this.finalWin();
    }
  }

  private startRound(): void {
    this.state = createDreamCatchState(dreamCatchLevels[this.roundIndex]!);
    this.bag = dreamCatchLevels[this.roundIndex]!.types;
    this.bagIndex = 0;
    this.fallSpeed = dreamFallSpeeds[this.roundIndex] ?? this.fallSpeed;
    this.rebuildPips();
    this.done = false;
    if (!isE2EEnabled()) this.time.delayedCall(300, () => this.dropDream());
  }

  private finalWin(): void {
    this.done = true;
    this.clearDrops();
    getSfx().play('correct');
    Juice.hitStop(this, 90);
    Juice.shake(this, 120, 0.003);
    Juice.confetti(this, 28);
    if (motionAllowed()) Juice.punch(this, this.cluckle, 1.18, 220);
    getVoice().speak('mission-complete');
    this.time.delayedCall(motionAllowed() ? 520 : 0, () => completeMission(this, getDreamCatchResult(this.state, this.missionId)));
  }

  private overlayBusy(): boolean {
    return isMissionExitOpen(this) || isOverlayOpen(this);
  }

  private requestExit(): void {
    confirmMissionExit(this, () => returnToTownMap(this));
  }
}
