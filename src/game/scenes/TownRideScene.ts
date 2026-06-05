import Phaser from 'phaser';
import { fadeInScene } from '../systems/SceneTransitions';
import { townRideLevel } from '../data/townRideLevels';
import { bindIntents } from '../systems/bindIntents';
import { registerE2EButton, isE2EEnabled } from '../systems/E2EBridge';
import { Juice } from '../systems/Juice';
import { completeMission, returnToTownMap } from '../systems/SceneNavigation';
import { confirmMissionExit, isMissionExitOpen } from '../systems/confirmMissionExit';
import { isOverlayOpen } from '../systems/overlayLock';
import { getSfx, getVoice } from '../systems/GameServices';
import { createSecretsForProfile, addSecretHotspot } from '../systems/secretHotspot';
import {
  bumpObstacle,
  catchFriend,
  createTownRideState,
  getTownRideResult,
  type TownRideState,
} from '../systems/TownRide';
import { addIconButton } from '../ui/Button';
import { hasTexture, motionAllowed } from '../ui/Sprite';

// Town Ride — a no-fail momentum ride (replaces tap-the-waypoint Scooter Roundup). Scoot rides the
// lane; steer up/down to scoop runaway friends and bump past cones. A bump only slows for a beat —
// never a fail. Round up enough friends to bring them home. Keeps missionId 'scooter-roundup'.

type Mover = Phaser.GameObjects.Image & { kind?: 'friend' | 'cone'; consumed?: boolean };

const RIDER_X = 230;
const ROAD_TOP = 300;
const ROAD_BOTTOM = 462;
const BASE_SPEED = 3.4; // px per ~16ms frame
const SPAWN_MS = 900;

export class TownRideScene extends Phaser.Scene {
  private state!: TownRideState;
  private rider!: Phaser.GameObjects.Image;
  private movers = new Set<Mover>();
  private trail: Phaser.GameObjects.Image[] = [];
  private dashes: Phaser.GameObjects.Rectangle[] = [];
  private pips: Phaser.GameObjects.Arc[] = [];
  private targetY = (ROAD_TOP + ROAD_BOTTOM) / 2;
  private slowUntil = 0;
  private bumpCdUntil = 0;
  private spawnToggle = 0;
  private done = false;

  constructor() {
    super('TownRideScene');
  }

  create(): void {
    this.state = createTownRideState(townRideLevel);
    this.movers = new Set();
    this.trail = [];
    this.dashes = [];
    this.pips = [];
    this.targetY = (ROAD_TOP + ROAD_BOTTOM) / 2;
    this.slowUntil = 0;
    this.bumpCdUntil = 0;
    this.spawnToggle = 0;
    this.done = false;

    fadeInScene(this);
    this.makeConeTexture();
    this.paintWorld();
    this.buildPips();

    this.rider = this.add.image(RIDER_X, this.targetY, 'hl.char.scoot').setDisplaySize(78, 78).setDepth(20);

    addIconButton(this, { x: 52, y: 46, size: 56, key: 'hl.ui.back', onPress: () => this.requestExit(), testId: 'scooter-roundup.back-to-map' }).setDepth(40);

    // The off-route glimmer for the wanderer (the meadow-nest secret carried from the old scene).
    addSecretHotspot(this, createSecretsForProfile(), 'meadow-nest', 110, 180);

    registerE2EButton({ testId: 'ride.catch', label: 'scoop friend', sceneKey: this.scene.key, press: () => this.e2eCatch() });

    bindIntents(this, {
      onMove: (_x, y) => this.nudge(y),
      onBack: () => !isOverlayOpen(this) && this.requestExit(),
    });
    this.input.on('pointermove', (p: Phaser.Input.Pointer) => (this.targetY = Phaser.Math.Clamp(p.y, ROAD_TOP, ROAD_BOTTOM)));
    this.input.on('pointerdown', (p: Phaser.Input.Pointer) => (this.targetY = Phaser.Math.Clamp(p.y, ROAD_TOP, ROAD_BOTTOM)));

    if (!isE2EEnabled()) {
      this.time.addEvent({ delay: SPAWN_MS, loop: true, callback: () => this.spawn() });
      this.time.delayedCall(500, () => this.spawn());
    }

    getVoice().speak('mission-start-build');
  }

  private makeConeTexture(): void {
    if (this.textures.exists('__cone')) return;
    const g = this.add.graphics();
    g.fillStyle(0x1b2a41, 0.25).fillEllipse(24, 52, 40, 12);
    g.fillStyle(0xe9763b, 1).fillTriangle(24, 6, 8, 50, 40, 50);
    g.fillStyle(0xfff3e0, 1).fillRect(13, 30, 22, 7);
    g.lineStyle(2, 0x2a1606, 0.6).strokeTriangle(24, 6, 8, 50, 40, 50);
    g.generateTexture('__cone', 48, 56);
    g.destroy();
  }

  private paintWorld(): void {
    this.add.image(480, 270, hasTexture(this, 'hl.bg.scooterRoundup') ? 'hl.bg.scooterRoundup' : 'hl.bg.town').setDisplaySize(960, 540).setDepth(0);
    this.add.rectangle(480, 270, 960, 540, 0x101b2e, 0.1).setDepth(1);
    // The lane + dashed centre line that scrolls to sell speed.
    this.add.rectangle(480, (ROAD_TOP + ROAD_BOTTOM) / 2, 960, ROAD_BOTTOM - ROAD_TOP + 40, 0x2a3550, 0.32).setDepth(2);
    for (let i = 0; i < 10; i += 1) {
      this.dashes.push(this.add.rectangle(60 + i * 110, (ROAD_TOP + ROAD_BOTTOM) / 2, 48, 8, 0xffe2a6, 0.5).setDepth(3));
    }
  }

  private buildPips(): void {
    const total = this.state.goal;
    const gap = 26;
    const startX = 480 - ((total - 1) * gap) / 2;
    for (let i = 0; i < total; i += 1) {
      this.pips.push(this.add.circle(startX + i * gap, 42, 7, 0x3a4a66).setStrokeStyle(2, 0x1b2a41).setDepth(30));
    }
  }

  private spawn(): void {
    if (this.done || this.overlayBusy()) return;
    this.spawnToggle += 1;
    const isFriend = this.spawnToggle % 3 !== 0; // ~2 friends per cone
    const y = ROAD_TOP + 12 + Math.random() * (ROAD_BOTTOM - ROAD_TOP - 24);
    const key = isFriend ? (hasTexture(this, 'hl.prop.runawayFriend') ? 'hl.prop.runawayFriend' : '__cone') : '__cone';
    const m = this.add.image(1010, y, key).setDisplaySize(isFriend ? 58 : 46, isFriend ? 58 : 56).setDepth(15) as Mover;
    m.kind = isFriend ? 'friend' : 'cone';
    this.movers.add(m);
  }

  update(time: number, delta: number): void {
    if (this.done) return;
    const f = delta / 16.667;
    const slow = time < this.slowUntil ? 0.4 : 1;
    const speed = BASE_SPEED * f * slow;

    // Rider eases toward the steered lane.
    if (!this.overlayBusy()) this.rider.y += (this.targetY - this.rider.y) * 0.25;
    this.updateTrail();

    for (const dash of this.dashes) {
      dash.x -= speed * 1.1;
      if (dash.x < -30) dash.x += 1100;
    }

    for (const m of [...this.movers]) {
      if (!m.active) {
        this.movers.delete(m);
        continue;
      }
      m.x -= speed;
      if (!m.consumed && Math.abs(m.x - RIDER_X) < 44 && Math.abs(m.y - this.rider.y) < 44) {
        m.consumed = true;
        if (m.kind === 'friend') this.onFriend(m);
        else this.onCone(m, time);
        continue;
      }
      if (m.x < -60) {
        this.movers.delete(m);
        m.destroy();
      }
    }
  }

  private onFriend(m: Mover): void {
    this.state = catchFriend(this.state);
    this.movers.delete(m);
    getSfx().play('correct');
    Juice.burst(this, m.x, m.y, { color: 0xffe2a6, count: 8, radius: 30 });
    Juice.punch(this, this.rider, 1.14, 120);
    // The rescued friend hops onto the trailing train.
    this.trail.push(m.setDepth(19).setDisplaySize(44, 44));
    this.updatePips();
    if (this.state.completed && !this.done) this.win();
  }

  private onCone(m: Mover, time: number): void {
    m.destroy();
    this.movers.delete(m);
    if (time < this.bumpCdUntil) return; // one bump per cone, with a short grace
    this.bumpCdUntil = time + 600;
    this.slowUntil = time + 480;
    this.state = bumpObstacle(this.state);
    getSfx().play('try-again');
    if (motionAllowed()) {
      Juice.shake(this, 90, 0.0025);
      this.tweens.add({ targets: this.rider, angle: -10, duration: 90, yoyo: true, repeat: 1, ease: 'Sine.easeInOut' });
    }
  }

  private updateTrail(): void {
    // The caught friends ride single-file behind Scoot.
    this.trail.forEach((friend, i) => {
      const tx = RIDER_X - 46 * (i + 1);
      friend.x += (tx - friend.x) * 0.2;
      friend.y += (this.rider.y - friend.y) * 0.2;
    });
  }

  private e2eCatch(): void {
    if (this.done) return;
    this.state = catchFriend(this.state);
    this.updatePips();
    if (this.state.completed && !this.done) this.win();
  }

  private nudge(dir: number): void {
    if (!dir || this.done || this.overlayBusy()) return;
    this.targetY = Phaser.Math.Clamp(this.targetY + dir * 40, ROAD_TOP, ROAD_BOTTOM);
  }

  private updatePips(): void {
    this.pips.forEach((pip, i) => {
      const done = i < this.state.caught;
      pip.setFillStyle(done ? 0xffc857 : 0x3a4a66);
      if (done && motionAllowed()) Juice.punch(this, pip, 1.4, 120);
    });
  }

  private win(): void {
    this.done = true;
    getSfx().play('correct');
    Juice.hitStop(this, 90);
    Juice.shake(this, 130, 0.0035);
    Juice.confetti(this, 30);
    // The pen slides in — the friends are home.
    const penKey = hasTexture(this, 'hl.prop.softFence') ? 'hl.prop.softFence' : null;
    if (penKey) {
      const pen = this.add.image(1040, (ROAD_TOP + ROAD_BOTTOM) / 2, penKey).setDisplaySize(120, 120).setDepth(18);
      if (motionAllowed()) this.tweens.add({ targets: pen, x: 760, duration: 460, ease: 'Quad.easeOut' });
    }
    getVoice().speak('mission-complete');
    this.time.delayedCall(motionAllowed() ? 560 : 0, () => completeMission(this, getTownRideResult(this.state)));
  }

  private overlayBusy(): boolean {
    return isMissionExitOpen(this) || isOverlayOpen(this);
  }

  private requestExit(): void {
    confirmMissionExit(this, () => returnToTownMap(this));
  }
}
