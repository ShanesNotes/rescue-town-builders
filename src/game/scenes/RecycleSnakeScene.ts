import Phaser from 'phaser';
import { fadeInScene } from '../systems/SceneTransitions';
import { recycleSnakeLevels } from '../data/recycleSnakeLevels';
import { bindIntents } from '../systems/bindIntents';
import { registerE2EButton, isE2EEnabled } from '../systems/E2EBridge';
import { Juice } from '../systems/Juice';
import { completeMission, returnToTownMap } from '../systems/SceneNavigation';
import { confirmMissionExit, isMissionExitOpen } from '../systems/confirmMissionExit';
import { isOverlayOpen } from '../systems/overlayLock';
import { getSfx, getVoice } from '../systems/GameServices';
import {
  collectItemById,
  createRecycleSnakeState,
  getRecycleSnakeResult,
  setDirection,
  step,
  type RecycleSnakeState,
  type SnakeDir,
} from '../systems/RecycleSnake';
import { addIconButton } from '../ui/Button';
import { hasTexture, motionAllowed } from '../ui/Sprite';
import type { MissionId } from '../types';

// Rivet's Recycle Snake — a no-fail Snake-like (replaces the drag-to-sort Recycling Run). Point where
// Rivet should drive; his cart heads there on a grid, scooping up recyclables and growing a trailing
// load. Collect them all to win. No death: walls wrap and the tail is harmless. Keeps the Phaser key
// 'RecyclingRunScene' + the recycling.* testIds so the town map, sticker, and e2e all carry over.

const COLS = recycleSnakeLevels[0]!.cols;
const ROWS = recycleSnakeLevels[0]!.rows;
const CELL = 58;
const GX0 = 130;
const GY0 = 118;
const TICK_MS = 300;

const ITEM_KEY: Record<string, string> = {
  'banana-peel': 'hl.prop.itemBananaPeel',
  'apple-core': 'hl.prop.itemAppleCore',
  newspaper: 'hl.prop.itemNewspaper',
  'paper-bag': 'hl.prop.itemPaperBag',
  'yogurt-cup': 'hl.prop.itemYogurtCup',
  'plastic-lid': 'hl.prop.itemPlasticLid',
  'soup-can': 'hl.prop.itemSoupCan',
  'foil-ball': 'hl.prop.itemFoilBall',
};
const CATEGORY_COLOR: Record<string, number> = {
  compost: 0x7dcb8f,
  paper: 0x8fb6e8,
  plastic: 0x5ec8b5,
  metal: 0xc8cdd6,
};
const CATEGORY_BIN: Record<string, string> = {
  compost: 'hl.prop.binCompost',
  paper: 'hl.prop.binPaper',
  plastic: 'hl.prop.binPlastic',
  metal: 'hl.prop.binMetal',
};
// Per-mission backdrop (the captured recycling missions each keep their own town location).
const SNAKE_BACKDROP: Partial<Record<MissionId, string>> = {
  'recycling-run': 'hl.bg.recycle',
  'recycled-inventions': 'hl.bg.recycledInventions',
};

export class RecycleSnakeScene extends Phaser.Scene {
  private state!: RecycleSnakeState;
  private head!: Phaser.GameObjects.Image;
  private tail: Phaser.GameObjects.Arc[] = [];
  private itemSprites = new Map<string, Phaser.GameObjects.Image>();
  private pips: Phaser.GameObjects.Arc[] = [];
  private roundDots: Phaser.GameObjects.Arc[] = [];
  private roundIndex = 0;
  private missionId: MissionId = 'recycling-run';
  private pointer: { x: number; y: number } | null = null;
  private done = false;

  constructor() {
    super('RecyclingRunScene');
  }

  init(data: { missionId?: MissionId }): void {
    this.missionId = data.missionId ?? 'recycling-run';
  }

  private cx(gx: number): number {
    return GX0 + gx * CELL + CELL / 2;
  }
  private cy(gy: number): number {
    return GY0 + gy * CELL + CELL / 2;
  }

  create(): void {
    fadeInScene(this);
    this.roundIndex = 0;
    this.state = createRecycleSnakeState(recycleSnakeLevels[0]!);
    this.tail = [];
    this.itemSprites = new Map();
    this.pips = [];
    this.roundDots = [];
    this.pointer = null;
    this.done = false;

    this.paintWorld();
    this.buildPips();
    this.buildRoundDots();
    this.buildItems();
    this.buildBins();

    // Rivet's cart (the head).
    this.head = this.add.image(this.cx(this.state.body[0]!.x), this.cy(this.state.body[0]!.y), 'hl.char.rivet').setDisplaySize(54, 54).setDepth(20);

    addIconButton(this, { x: 52, y: 46, size: 56, key: 'hl.ui.back', onPress: () => this.requestExit(), testId: 'recycling.back-to-map' }).setDepth(40);

    // E2E: three deterministic collect buttons (keep the recycling.choice.N ids the harness presses).
    for (let i = 0; i < 3; i += 1) {
      registerE2EButton({ testId: `recycling.choice.${i}`, label: `collect ${i}`, sceneKey: this.scene.key, press: () => this.e2eCollect() });
    }

    bindIntents(this, {
      onMove: (x, y) => this.steer({ x: Math.sign(x) as -1 | 0 | 1, y: Math.sign(y) as -1 | 0 | 1 }),
      onBack: () => !isOverlayOpen(this) && this.requestExit(),
    });
    this.input.on('pointermove', (p: Phaser.Input.Pointer) => (this.pointer = { x: p.x, y: p.y }));
    this.input.on('pointerdown', (p: Phaser.Input.Pointer) => (this.pointer = { x: p.x, y: p.y }));

    // Real driving runs on a steady tick; E2E completes via the deterministic collect buttons instead.
    if (!isE2EEnabled()) {
      this.time.addEvent({ delay: TICK_MS, loop: true, callback: () => this.tickMove() });
    }

    this.renderSnake(false);
    getVoice().speak('mission-start-build');
  }

  private paintWorld(): void {
    const bg = SNAKE_BACKDROP[this.missionId] ?? 'hl.bg.recycle';
    this.add.image(480, 270, hasTexture(this, bg) ? bg : 'hl.bg.town').setDisplaySize(960, 540).setDepth(0);
    this.add.rectangle(480, 270, 960, 540, 0x101b2e, 0.12).setDepth(1);
    // A soft play-field panel so the grid reads as "drive here".
    this.add.rectangle(GX0 + (COLS * CELL) / 2, GY0 + (ROWS * CELL) / 2, COLS * CELL + 18, ROWS * CELL + 18, 0x0e1a2e, 0.28).setDepth(2);
    for (let r = 0; r <= ROWS; r += 1) this.add.rectangle(GX0 + (COLS * CELL) / 2, GY0 + r * CELL, COLS * CELL, 2, 0xffffff, 0.05).setDepth(2);
    for (let c = 0; c <= COLS; c += 1) this.add.rectangle(GX0 + c * CELL, GY0 + (ROWS * CELL) / 2, 2, ROWS * CELL, 0xffffff, 0.05).setDepth(2);
  }

  private buildPips(): void {
    const total = this.state.total;
    const gap = 22;
    const startX = 480 - ((total - 1) * gap) / 2;
    for (let i = 0; i < total; i += 1) {
      this.pips.push(this.add.circle(startX + i * gap, 44, 6, 0x3a4a66).setStrokeStyle(2, 0x1b2a41).setDepth(30));
    }
  }

  // The item count grows each yard, so the pip row is rebuilt when a new yard starts.
  private rebuildPips(): void {
    for (const pip of this.pips) pip.destroy();
    this.pips = [];
    this.buildPips();
  }

  // One dot per yard (top-right) — the child sees how many yards are left to tidy.
  private buildRoundDots(): void {
    for (let i = 0; i < recycleSnakeLevels.length; i += 1) {
      this.roundDots.push(this.add.circle(812 + i * 24, 44, 8, 0x3a4a66).setStrokeStyle(2, 0x1b2a41).setDepth(30));
    }
    this.updateRoundDots();
  }

  private updateRoundDots(): void {
    this.roundDots.forEach((dot, i) => {
      dot.setFillStyle(i < this.roundIndex ? 0x5ec8b5 : i === this.roundIndex ? 0x2f6a5e : 0x3a4a66);
    });
  }

  private buildItems(): void {
    for (const item of this.state.items) {
      const key = ITEM_KEY[item.id] && hasTexture(this, ITEM_KEY[item.id]!) ? ITEM_KEY[item.id]! : 'hl.prop.star';
      const disc = this.add.circle(this.cx(item.x), this.cy(item.y), 24, CATEGORY_COLOR[item.category] ?? 0xffe2a6, 0.22).setBlendMode(Phaser.BlendModes.ADD).setDepth(9);
      const sprite = this.add.image(this.cx(item.x), this.cy(item.y), key).setDisplaySize(40, 40).setDepth(10);
      sprite.setData('disc', disc);
      this.itemSprites.set(item.id, sprite);
      if (motionAllowed()) this.tweens.add({ targets: sprite, y: sprite.y - 5, duration: 900 + Math.random() * 300, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    }
  }

  private buildBins(): void {
    const cats = ['compost', 'paper', 'plastic', 'metal'];
    const y = 506;
    cats.forEach((cat, i) => {
      const x = 360 + i * 86;
      const key = CATEGORY_BIN[cat]!;
      if (hasTexture(this, key)) this.add.image(x, y, key).setOrigin(0.5, 1).setDisplaySize(64, 72).setDepth(8);
      else this.add.circle(x, y - 30, 26, CATEGORY_COLOR[cat]!, 0.7).setDepth(8);
    });
  }

  private steer(dir: SnakeDir): void {
    if (this.done || this.overlayBusy()) return;
    this.state = setDirection(this.state, dir);
  }

  private tickMove(): void {
    if (this.done || this.overlayBusy()) return;
    // Steer toward the pointer (dominant axis), else keep the current heading.
    if (this.pointer) {
      const hx = this.state.body[0]!.x;
      const hy = this.state.body[0]!.y;
      const px = Phaser.Math.Clamp(Math.floor((this.pointer.x - GX0) / CELL), 0, COLS - 1);
      const py = Phaser.Math.Clamp(Math.floor((this.pointer.y - GY0) / CELL), 0, ROWS - 1);
      const dx = px - hx;
      const dy = py - hy;
      if (dx !== 0 || dy !== 0) {
        const dir: SnakeDir = Math.abs(dx) >= Math.abs(dy) && dx !== 0 ? { x: Math.sign(dx) as -1 | 1, y: 0 } : { x: 0, y: Math.sign(dy) as -1 | 1 };
        this.state = setDirection(this.state, dir);
      }
    }
    this.state = step(this.state);
    this.afterStep(true);
  }

  private e2eCollect(): void {
    if (this.done) return;
    const next = this.state.items[0];
    if (!next) return;
    this.state = collectItemById(this.state, next.id);
    this.afterStep(false);
  }

  private afterStep(animate: boolean): void {
    const eaten = this.state.collectedThisStep;
    if (eaten) {
      // Remove the eaten item sprite (the one no longer in state) with a pop.
      for (const [id, sprite] of this.itemSprites) {
        if (!this.state.items.find((it) => it.id === id)) {
          const disc = sprite.getData('disc') as Phaser.GameObjects.Arc | undefined;
          Juice.burst(this, sprite.x, sprite.y, { color: CATEGORY_COLOR[eaten] ?? 0xffe2a6, count: 8, radius: 30 });
          Juice.flashWhite(this, sprite, 60);
          getSfx().play('place');
          disc?.destroy();
          sprite.destroy();
          this.itemSprites.delete(id);
          break;
        }
      }
      this.updatePips();
    }
    this.renderSnake(animate);
    if (this.state.completed && !this.done) this.yardComplete();
  }

  private renderSnake(animate: boolean): void {
    const body = this.state.body;
    // Ensure a tail disc per body segment beyond the head.
    while (this.tail.length < body.length - 1) {
      this.tail.push(this.add.circle(this.head.x, this.head.y, 18, 0x9aa6c8).setStrokeStyle(2, 0x1b2a41).setDepth(19));
    }
    while (this.tail.length > body.length - 1) this.tail.pop()?.destroy();

    const place = (obj: Phaser.GameObjects.Components.Transform & { x: number; y: number }, gx: number, gy: number): void => {
      const tx = this.cx(gx);
      const ty = this.cy(gy);
      if (animate && motionAllowed()) this.tweens.add({ targets: obj, x: tx, y: ty, duration: TICK_MS * 0.85, ease: 'Sine.easeInOut' });
      else {
        obj.x = tx;
        obj.y = ty;
      }
    };
    place(this.head, body[0]!.x, body[0]!.y);
    for (let i = 0; i < this.tail.length; i += 1) {
      const seg = body[i + 1]!;
      const disc = this.tail[i]!;
      // Newest collected sits just behind the head.
      const cat = this.state.collected[this.state.collected.length - 1 - i];
      disc.setFillStyle(cat ? (CATEGORY_COLOR[cat] ?? 0x9aa6c8) : 0x9aa6c8, 1);
      place(disc, seg.x, seg.y);
    }
  }

  private updatePips(): void {
    this.pips.forEach((pip, i) => {
      const done = i < this.state.collected.length;
      pip.setFillStyle(done ? 0x5ec8b5 : 0x3a4a66);
      if (done && motionAllowed()) Juice.punch(this, pip, 1.4, 120);
    });
  }

  private clearItems(): void {
    for (const [, sprite] of this.itemSprites) {
      (sprite.getData('disc') as Phaser.GameObjects.Arc | undefined)?.destroy();
      sprite.destroy();
    }
    this.itemSprites.clear();
  }

  // A yard is all tidied. If more yards remain, lay out the next (fuller) yard in place; otherwise
  // complete the mission. `done` pauses driving/collecting during the swap.
  private yardComplete(): void {
    this.done = true;
    this.roundIndex += 1;
    this.updateRoundDots();
    if (this.roundIndex < recycleSnakeLevels.length) {
      if (isE2EEnabled()) {
        this.startYard();
        return;
      }
      getSfx().play('correct');
      Juice.hitStop(this, 80);
      Juice.confetti(this, 16);
      if (motionAllowed()) Juice.punch(this, this.head, 1.2, 200);
      this.time.delayedCall(motionAllowed() ? 700 : 0, () => this.startYard());
    } else {
      this.finalWin();
    }
  }

  private startYard(): void {
    this.state = createRecycleSnakeState(recycleSnakeLevels[this.roundIndex]!);
    this.clearItems();
    for (const t of this.tail) t.destroy();
    this.tail = [];
    this.rebuildPips();
    this.buildItems();
    this.head.setPosition(this.cx(this.state.body[0]!.x), this.cy(this.state.body[0]!.y));
    this.renderSnake(false);
    this.done = false;
  }

  private finalWin(): void {
    this.done = true;
    getSfx().play('correct');
    Juice.hitStop(this, 90);
    Juice.shake(this, 130, 0.0035);
    Juice.confetti(this, 30);
    if (motionAllowed()) Juice.punch(this, this.head, 1.3, 200);
    getVoice().speak('mission-complete');
    this.time.delayedCall(motionAllowed() ? 520 : 0, () => completeMission(this, getRecycleSnakeResult(this.state, this.missionId)));
  }

  private overlayBusy(): boolean {
    return isMissionExitOpen(this) || isOverlayOpen(this);
  }

  private requestExit(): void {
    confirmMissionExit(this, () => returnToTownMap(this));
  }
}
