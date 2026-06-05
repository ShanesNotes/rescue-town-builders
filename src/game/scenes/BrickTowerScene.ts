import Phaser from 'phaser';
import { fadeInScene } from '../systems/SceneTransitions';
import { brickTowerLevels } from '../data/brickTowerLevels';
import { bindIntents } from '../systems/bindIntents';
import { registerE2EButton, isE2EEnabled } from '../systems/E2EBridge';
import { Juice } from '../systems/Juice';
import { completeMission, returnToTownMap } from '../systems/SceneNavigation';
import { confirmMissionExit, isMissionExitOpen } from '../systems/confirmMissionExit';
import { isOverlayOpen } from '../systems/overlayLock';
import { getSfx, getVoice } from '../systems/GameServices';
import { createSecretsForProfile, addSecretHotspot } from '../systems/secretHotspot';
import {
  createBrickTowerState,
  dropBrick,
  getBrickTowerResult,
  settleBrick,
  type BrickTowerLevel,
  type BrickTowerState,
} from '../systems/BrickTower';
import { addIconButton } from '../ui/Button';
import { hasTexture, motionAllowed } from '../ui/Sprite';

// Brick's Tower — the physics block-stacker that replaces the ordered House Builder. Drop bricks;
// real Matter weight makes them fall and settle into a tower. No-fail: side rails keep every brick
// in the column (nothing falls out of play), bricks freeze the instant they rest (so the tower
// only ever grows and a tablet never strains under awake bodies), and the round wins either by
// reaching the ribbon or by simple persistence. Reuses missionId 'house-builder' (BrickTower.ts).

type MatterImg = Phaser.Physics.Matter.Image;

const GROUND_TOP_Y = 500; // surface bricks land on
const WALL_L = 300;
const WALL_R = 660;
const PREVIEW_Y = 92;
const BRICK_TINTS = [0xf4a261, 0xe9763b, 0x5ec8b5, 0xf7c948, 0xef8aa0, 0x8fb6e8];

export class BrickTowerScene extends Phaser.Scene {
  private level!: BrickTowerLevel;
  private state!: BrickTowerState;
  private preview!: Phaser.GameObjects.Image;
  private active = new Set<MatterImg>();
  private pips: Phaser.GameObjects.Arc[] = [];
  private ribbon!: Phaser.GameObjects.Rectangle;
  private brickIndex = 0;
  private done = false;
  private dropArmed = true; // brief lock so one tap drops exactly one brick

  constructor() {
    super({
      key: 'BrickTowerScene',
      physics: {
        default: 'matter',
        matter: { gravity: { x: 0, y: 1.1 }, enableSleeping: true },
      },
    });
  }

  create(): void {
    fadeInScene(this);
    this.level = brickTowerLevels[0]!;
    this.state = createBrickTowerState(this.level);
    this.active = new Set();
    this.pips = [];
    this.brickIndex = 0;
    this.done = false;
    this.dropArmed = true;

    this.makeBrickTextures();
    this.paintWorld();
    this.buildStaticBodies();
    this.buildPips();
    this.buildPreview();

    // Brick watches, planted on the right (kept out of the column).
    this.add.ellipse(862, 470, 70, 18, 0x0a1322, 0.5).setDepth(9);
    this.add.image(862, 470, 'hl.char.brick').setOrigin(0.5, 1).setDisplaySize(104, 104).setDepth(10);

    addIconButton(this, { x: 52, y: 46, size: 56, key: 'hl.ui.back', onPress: () => this.requestExit(), testId: 'house.back-to-map' }).setDepth(40);

    // Hidden Light: the quiet glimmer holding a loved one's words (1 touch) — carried over from the
    // old House Builder so the soul (and the secret-discovery e2e) survives the rebuild.
    const secrets = createSecretsForProfile();
    addSecretHotspot(this, secrets, 'hidden-light', 888, 268);

    // E2E: a deterministic drop so the physics never makes the harness flaky.
    registerE2EButton({ testId: 'brick.drop', label: 'drop brick', sceneKey: this.scene.key, press: () => this.onDrop() });

    bindIntents(this, {
      onMove: (x) => this.nudgePreview(x),
      onConfirm: () => this.onDrop(),
      onBack: () => !isOverlayOpen(this) && this.requestExit(),
    });

    // A tap anywhere over the play area drops the held brick at its current x.
    this.input.on('pointerdown', () => this.onDrop());

    getVoice().speak('mission-start-build');
  }

  private makeBrickTextures(): void {
    const { brickWidth: w, brickHeight: h } = this.level;
    BRICK_TINTS.forEach((fill, i) => {
      const key = `__brick${i}`;
      if (this.textures.exists(key)) return;
      const g = this.add.graphics();
      g.fillStyle(fill, 1).fillRoundedRect(0, 0, w, h, 10);
      g.lineStyle(3, 0x2a1606, 0.85).strokeRoundedRect(1.5, 1.5, w - 3, h - 3, 10);
      g.fillStyle(0xffffff, 0.2).fillRoundedRect(6, 5, w - 12, h * 0.34, 7); // soft top sheen
      g.fillStyle(0x000000, 0.12).fillRoundedRect(6, h * 0.62, w - 12, h * 0.26, 7); // base shade
      g.generateTexture(key, w, h);
      g.destroy();
    });
  }

  private paintWorld(): void {
    this.add.image(480, 270, hasTexture(this, 'hl.bg.build') ? 'hl.bg.build' : 'hl.bg.town').setDisplaySize(960, 540).setDepth(0);
    this.add.rectangle(480, 270, 960, 540, 0x101b2e, 0.18).setDepth(1);

    // Visible guide rails so the column reads as "drop here".
    [WALL_L, WALL_R].forEach((x) => {
      this.add.rectangle(x, 320, 8, 380, 0xffe2a6, 0.16).setDepth(2);
      this.add.image(x, GROUND_TOP_Y, hasTexture(this, 'hl.prop.lampPost') ? 'hl.prop.lampPost' : '__brick0').setOrigin(0.5, 1).setDisplaySize(28, 150).setAlpha(hasTexture(this, 'hl.prop.lampPost') ? 1 : 0).setDepth(3);
    });
    // Ground line.
    this.add.rectangle(480, GROUND_TOP_Y + 20, 960, 40, 0x3a2a1c, 0.0).setDepth(2);
    this.add.rectangle((WALL_L + WALL_R) / 2, GROUND_TOP_Y + 6, WALL_R - WALL_L + 40, 12, 0x6b4a2a, 0.9).setDepth(4);

    // The target ribbon — the obvious "reach me" line.
    this.ribbon = this.add.rectangle((WALL_L + WALL_R) / 2, this.level.targetY, WALL_R - WALL_L + 30, 8, 0xffd98a, 0.9).setDepth(4);
    this.add.image(WALL_R + 4, this.level.targetY, hasTexture(this, 'hl.prop.firefly') ? 'hl.prop.firefly' : '__brick3').setDisplaySize(20, 20).setDepth(5).setAlpha(0.9);
    if (motionAllowed()) {
      this.tweens.add({ targets: this.ribbon, alpha: 0.5, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    }
  }

  private buildStaticBodies(): void {
    // Ground + two rails as static Matter bodies; bricks rest on the ground and can't leave the column.
    this.matter.add.rectangle((WALL_L + WALL_R) / 2, GROUND_TOP_Y + 30, WALL_R - WALL_L + 60, 60, { isStatic: true, friction: 1 });
    this.matter.add.rectangle(WALL_L - 6, 300, 16, 460, { isStatic: true });
    this.matter.add.rectangle(WALL_R + 6, 300, 16, 460, { isStatic: true });
  }

  private buildPips(): void {
    const total = this.level.goalBricks;
    const gap = 26;
    const startX = 480 - ((total - 1) * gap) / 2;
    for (let i = 0; i < total; i += 1) {
      this.pips.push(this.add.circle(startX + i * gap, 40, 7, 0x3a4a66).setStrokeStyle(2, 0x1b2a41).setDepth(20));
    }
  }

  private buildPreview(): void {
    this.preview = this.add.image(480, PREVIEW_Y, `__brick${this.brickIndex % BRICK_TINTS.length}`).setDepth(18);
    if (motionAllowed()) {
      this.tweens.add({ targets: this.preview, y: PREVIEW_Y + 8, duration: 620, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    }
  }

  private clampX(x: number): number {
    const half = this.level.brickWidth / 2 + 6;
    return Phaser.Math.Clamp(x, WALL_L + half, WALL_R - half);
  }

  private nudgePreview(dir: number): void {
    if (!dir || this.done || this.overlayBusy()) return;
    this.preview.x = this.clampX(this.preview.x + dir * 44);
  }

  update(): void {
    if (this.done) return;
    if (this.preview && !this.overlayBusy()) {
      const p = this.input.activePointer;
      if (p.isDown || p.x > 0) this.preview.x = this.clampX(p.x);
    }
    // Settle detector: a resting brick freezes (setStatic) so the tower stays put and awake bodies
    // stay in the low single digits — the no-fail + perf spine.
    for (const brick of [...this.active]) {
      const body = brick.body as MatterJS.BodyType | null;
      if (!body) continue;
      const age = (brick.getData('age') as number) + 1;
      brick.setData('age', age);
      const speed = Math.hypot(body.velocity.x, body.velocity.y);
      const calm = age > 14 && speed < 0.45 && Math.abs(body.angularVelocity) < 0.03;
      const rest = calm ? (brick.getData('rest') as number) + 1 : 0;
      brick.setData('rest', rest);
      if (rest > 10) this.settleReal(brick, body);
    }
  }

  private onDrop(): void {
    if (this.done || this.overlayBusy() || !this.dropArmed) return;
    this.dropArmed = false;
    this.time.delayedCall(140, () => (this.dropArmed = true)); // one brick per tap

    if (isE2EEnabled()) {
      this.settleDeterministic();
      return;
    }
    this.spawnFallingBrick(this.preview.x);
  }

  private spawnFallingBrick(x: number): void {
    const key = `__brick${this.brickIndex % BRICK_TINTS.length}`;
    this.brickIndex += 1;
    this.state = dropBrick(this.state);
    const brick = this.matter.add.image(this.clampX(x), PREVIEW_Y + 24, key, undefined, {
      friction: 0.95,
      frictionStatic: 1,
      restitution: 0.02,
      density: 0.02,
      chamfer: { radius: 10 },
    }) as MatterImg;
    brick.setData('age', 0).setData('rest', 0);
    brick.setVelocity(0, 4);
    brick.setDepth(15);
    this.active.add(brick);
    getSfx().play('tap');
    // Refresh the held preview to the next colour.
    this.preview.setTexture(`__brick${this.brickIndex % BRICK_TINTS.length}`);
  }

  private settleReal(brick: MatterImg, body: MatterJS.BodyType): void {
    if (!this.active.has(brick)) return;
    this.active.delete(brick);
    brick.setStatic(true);
    const top = body.bounds?.min?.y ?? brick.y - this.level.brickHeight / 2;
    this.landFx(brick);
    this.applySettle(top);
  }

  // E2E: advance the tower one resting brick deterministically (no physics wait), so the harness
  // completes the round in goalBricks presses without flakiness.
  private settleDeterministic(): void {
    this.state = dropBrick(this.state);
    const top = GROUND_TOP_Y - (this.state.settled + 1) * this.level.brickHeight;
    this.applySettle(top);
  }

  private applySettle(topY: number): void {
    this.state = settleBrick(this.state, topY);
    this.updatePips();
    if (this.state.completed && !this.done) this.win();
  }

  private landFx(brick: MatterImg): void {
    Juice.squashStretch(this, brick, 0.16, 130);
    Juice.flashWhite(this, brick, 70);
    Juice.burst(this, brick.x, brick.y + this.level.brickHeight / 2, { color: 0xffe2a6, count: 6, radius: 28 });
    Juice.shake(this, 70, 0.0022);
    getSfx().play('place');
  }

  private updatePips(): void {
    this.pips.forEach((pip, i) => {
      const done = i < this.state.settled;
      pip.setFillStyle(done ? 0xffc857 : 0x3a4a66);
      if (done && motionAllowed()) Juice.punch(this, pip, 1.4, 120);
    });
  }

  private win(): void {
    this.done = true;
    for (const brick of [...this.active]) {
      brick.setStatic(true);
      this.active.delete(brick);
    }
    getSfx().play('correct');
    Juice.hitStop(this, 90);
    Juice.shake(this, 140, 0.004);
    Juice.confetti(this, 30);
    // A roof caps the tower — it became a home.
    const roofKey = hasTexture(this, 'hl.prop.houseRoof') ? 'hl.prop.houseRoof' : null;
    if (roofKey) {
      const topY = Number.isFinite(this.state.maxTopY) ? this.state.maxTopY : this.level.targetY;
      const roof = this.add.image((WALL_L + WALL_R) / 2, topY, roofKey).setOrigin(0.5, 1).setDisplaySize(180, 90).setDepth(16);
      if (motionAllowed()) {
        roof.setScale(roof.scale * 0.7).setAlpha(0);
        this.tweens.add({ targets: roof, scale: roof.scale / 0.7, alpha: 1, y: topY + 4, duration: 420, ease: 'Back.easeOut' });
      }
    }
    getVoice().speak('mission-complete');
    this.time.delayedCall(motionAllowed() ? 560 : 0, () => completeMission(this, getBrickTowerResult(this.state)));
  }

  private overlayBusy(): boolean {
    return isMissionExitOpen(this) || isOverlayOpen(this);
  }

  private requestExit(): void {
    confirmMissionExit(this, () => returnToTownMap(this));
  }
}
