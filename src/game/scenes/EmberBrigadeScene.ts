import Phaser from 'phaser';
import { fadeInScene } from '../systems/SceneTransitions';
import { fireBrigadeWaves } from '../data/fireBrigadeLevels';
import { bindIntents } from '../systems/bindIntents';
import { registerE2EButton, isE2EEnabled } from '../systems/E2EBridge';
import { Juice } from '../systems/Juice';
import { completeMission, returnToTownMap } from '../systems/SceneNavigation';
import { confirmMissionExit, isMissionExitOpen } from '../systems/confirmMissionExit';
import { isOverlayOpen } from '../systems/overlayLock';
import { getSfx, getVoice } from '../systems/GameServices';
import { createSecretsForProfile, addSecretHotspot } from '../systems/secretHotspot';
import {
  applyHelper,
  countSpray,
  createFireBrigadeState,
  douseFire,
  getFireBrigadeResult,
  liveFires,
  nearestLiveFire,
  type FireBrigadeState,
} from '../systems/FireBrigade';
import { addIconButton } from '../ui/Button';
import { hasTexture, motionAllowed } from '../ui/Sprite';

// Ember's Fire Brigade — Arcade water-arc firefighting (replaces the move-and-cone Fire Fix).
// The child points; water LAUNCHES on a visible ballistic arc and lands where they touch (forgiving
// aim — teaches trajectory by sight, never a hidden cone). Fires shrink to a curl of steam as they
// cool. No-fail: unlimited water, no player damage, and a friendly helper cools the weakest fire if
// the child stalls — the round always converges. Reuses missionId 'fire-fix' (FireBrigade.ts).

type Drop = Phaser.Physics.Arcade.Image;

const NOZZLE = { x: 196, y: 408 };
const GROUND_Y = 506;
const GRAVITY_Y = 760;
const SPRAY_INTERVAL = 85; // ms between droplets while held — a stream, not a machine gun
const HIT_RADIUS = 46;

export class EmberBrigadeScene extends Phaser.Scene {
  private state!: FireBrigadeState;
  private fireSprites = new Map<string, Phaser.GameObjects.Image>();
  private fireSmoke = new Map<string, Phaser.GameObjects.Image>();
  private drops = new Set<Drop>();
  private pips: Phaser.GameObjects.Arc[] = [];
  private roundDots: Phaser.GameObjects.Arc[] = [];
  private nozzle!: Phaser.GameObjects.Image;
  private lastSprayAt = 0;
  private hitsAtLastTick = 0;
  private waveIndex = 0;
  private done = false;

  constructor() {
    super({
      key: 'EmberBrigadeScene',
      physics: { default: 'arcade', arcade: { gravity: { x: 0, y: GRAVITY_Y } } },
    });
  }

  create(): void {
    fadeInScene(this);
    this.waveIndex = 0;
    this.state = createFireBrigadeState(fireBrigadeWaves[0]!);
    this.fireSprites = new Map();
    this.fireSmoke = new Map();
    this.drops = new Set();
    this.pips = [];
    this.roundDots = [];
    this.lastSprayAt = 0;
    this.hitsAtLastTick = 0;
    this.done = false;

    this.makeDropTexture();
    this.paintWorld();
    this.buildPips();
    this.buildRoundDots();
    this.buildFires();
    this.buildEmber();

    addIconButton(this, { x: 52, y: 46, size: 56, key: 'hl.ui.back', onPress: () => this.requestExit(), testId: 'fire.back-to-map' }).setDepth(40);

    // Secret Friend: a shy creature for the patient child (3 touches), bottom-right, off the playfield.
    const secrets = createSecretsForProfile();
    addSecretHotspot(this, secrets, 'secret-friend', 822, 438);

    // Spray button (keyboard/gamepad + E2E). In E2E it deterministically cools the weakest fire so the
    // harness never depends on physics timing; in real play it auto-aims a burst at the nearest fire.
    registerE2EButton({ testId: 'fire.spray', label: 'spray', sceneKey: this.scene.key, press: () => this.onSprayButton() });
    addIconButton(this, {
      x: 832,
      y: 500,
      size: 92,
      key: hasTexture(this, 'hl.prop.waterSplash') ? 'hl.prop.waterSplash' : '__drop',
      onPress: () => this.onSprayButton(),
      testId: 'fire.spray.btn',
      pulse: true,
    }).setDepth(40);

    bindIntents(this, {
      onConfirm: () => this.onSprayButton(),
      onBack: () => !isOverlayOpen(this) && this.requestExit(),
    });

    // No-fail floor: every ~3.4s, if the child hasn't cooled anything and fires remain, a friend helps.
    this.time.addEvent({
      delay: 3400,
      loop: true,
      callback: () => this.helperTick(),
    });

    getVoice().speak('mission-start-build');
  }

  private makeDropTexture(): void {
    if (this.textures.exists('__drop')) return;
    const g = this.add.graphics();
    g.fillStyle(0x9fe3ee, 1).fillCircle(11, 13, 9);
    g.fillStyle(0xffffff, 0.5).fillCircle(8, 9, 3);
    g.fillStyle(0x6fc3d6, 1).fillTriangle(11, 0, 5, 9, 17, 9); // teardrop point
    g.generateTexture('__drop', 22, 24);
    g.destroy();
  }

  private paintWorld(): void {
    this.add.image(480, 270, hasTexture(this, 'hl.bg.fire') ? 'hl.bg.fire' : 'hl.bg.town').setDisplaySize(960, 540).setDepth(0);
    // Lighter than the old scene — arcade-bright, not an ominous dusk.
    this.add.rectangle(480, 270, 960, 540, 0x2a3a52, 0.12).setDepth(1);
    if (hasTexture(this, 'hl.prop.hydrant')) this.add.image(120, 446, 'hl.prop.hydrant').setOrigin(0.5, 1).setDisplaySize(64, 78).setDepth(9);
  }

  private buildPips(): void {
    const total = this.state.fires.length;
    const gap = 28;
    const startX = 480 - ((total - 1) * gap) / 2;
    for (let i = 0; i < total; i += 1) {
      this.pips.push(this.add.circle(startX + i * gap, 40, 7, 0x6b3a2a).setStrokeStyle(2, 0x1b2a41).setDepth(20));
    }
  }

  // One dot per wave (top-right) — the child sees how many waves of fires are left.
  private buildRoundDots(): void {
    for (let i = 0; i < fireBrigadeWaves.length; i += 1) {
      this.roundDots.push(this.add.circle(812 + i * 24, 40, 8, 0x6b3a2a).setStrokeStyle(2, 0x1b2a41).setDepth(20));
    }
    this.updateRoundDots();
  }

  private updateRoundDots(): void {
    this.roundDots.forEach((dot, i) => {
      dot.setFillStyle(i < this.waveIndex ? 0x6fd3e0 : i === this.waveIndex ? 0x8a5a3c : 0x6b3a2a);
    });
  }

  private flicker(flame: Phaser.GameObjects.Image): void {
    if (!motionAllowed()) return;
    this.tweens.killTweensOf(flame);
    this.tweens.add({ targets: flame, scaleX: flame.scaleX * 1.08, scaleY: flame.scaleY * 0.94, duration: 220 + Math.random() * 120, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
  }

  private buildFires(): void {
    for (const fire of this.state.fires) {
      const smoke = this.add.image(fire.x, fire.y - 36, hasTexture(this, 'hl.prop.smokeWisp') ? 'hl.prop.smokeWisp' : '__drop').setDisplaySize(40, 48).setDepth(11).setAlpha(0.45);
      this.fireSmoke.set(fire.id, smoke);
      const flame = this.add.image(fire.x, fire.y, hasTexture(this, 'hl.prop.campfire') ? 'hl.prop.campfire' : '__drop').setOrigin(0.5, 1).setDepth(12);
      this.fireSprites.set(fire.id, flame);
      this.renderFire(fire.id);
      if (motionAllowed()) {
        this.tweens.add({ targets: flame, scaleX: flame.scaleX * 1.08, scaleY: flame.scaleY * 0.94, duration: 220 + Math.random() * 120, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
        this.tweens.add({ targets: smoke, y: smoke.y - 12, alpha: 0.2, duration: 1600, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
      }
    }
  }

  private renderFire(id: string): void {
    const fire = this.state.fires.find((f) => f.id === id);
    const flame = this.fireSprites.get(id);
    const smoke = this.fireSmoke.get(id);
    if (!fire || !flame) return;
    if (fire.heat <= 0) {
      flame.setTexture(hasTexture(this, 'hl.prop.embers') ? 'hl.prop.embers' : flame.texture.key).setDisplaySize(40, 36).setTint(0x6fd3e0).setAlpha(0.4);
      smoke?.setAlpha(0.55);
      this.tweens.killTweensOf(flame);
      return;
    }
    const t = fire.heat / fire.maxHeat;
    const size = 50 + t * 58;
    // Reset to the flame texture (a re-lit fire in a new wave may be showing the doused embers).
    flame.setTexture(hasTexture(this, 'hl.prop.campfire') ? 'hl.prop.campfire' : flame.texture.key);
    flame.setDisplaySize(size, size).clearTint().setAlpha(1);
    flame.setTint(t > 0.6 ? 0xffb24a : 0xffd9a0);
  }

  private buildEmber(): void {
    this.add.ellipse(NOZZLE.x - 28, 470, 70, 18, 0x0a1322, 0.5).setDepth(9);
    this.add.image(NOZZLE.x - 28, 472, 'hl.char.ember').setOrigin(0.5, 1).setDisplaySize(96, 96).setDepth(10);
    this.nozzle = this.add.image(NOZZLE.x, NOZZLE.y, hasTexture(this, 'hl.prop.hose') ? 'hl.prop.hose' : '__drop').setDisplaySize(hasTexture(this, 'hl.prop.hose') ? 54 : 20, hasTexture(this, 'hl.prop.hose') ? 28 : 22).setDepth(11);
  }

  update(time: number): void {
    if (this.done) return;
    // Hold-to-spray a stream toward the pointer; a single tap fires one droplet.
    const p = this.input.activePointer;
    if (!isE2EEnabled() && p.isDown && !this.overlayBusy() && time - this.lastSprayAt > SPRAY_INTERVAL) {
      this.sprayToward(p.x, p.y);
      this.lastSprayAt = time;
    }
    // Aim the nozzle at the pointer for a touch of life.
    if (this.nozzle && !this.overlayBusy()) {
      const ang = Math.atan2(p.y - NOZZLE.y, p.x - NOZZLE.x);
      this.nozzle.setRotation(Phaser.Math.Clamp(ang, -1.3, 0.2));
    }
    this.stepDrops();
  }

  // Launch a droplet on a ballistic arc that lands near (tx,ty) — forgiving "touch where it should go".
  private sprayToward(tx: number, ty: number): void {
    this.state = countSpray(this.state);
    const dx = tx - NOZZLE.x;
    const dy = ty - NOZZLE.y;
    const dist = Math.hypot(dx, dy);
    const T = Phaser.Math.Clamp(dist / 560, 0.42, 1.05); // time-of-flight by distance → a nice arc
    const spread = (Math.random() - 0.5) * 40;
    const vx = (dx + spread) / T;
    const vy = (dy - 0.5 * GRAVITY_Y * T * T) / T;
    const drop = this.physics.add.image(NOZZLE.x, NOZZLE.y - 6, '__drop').setDepth(16) as Drop;
    drop.setVelocity(vx, vy);
    this.drops.add(drop);
    getSfx().play('tap');
    // Recoil: a little nozzle kick + camera nudge.
    if (motionAllowed()) {
      Juice.punch(this, this.nozzle, 1.18, 90);
      Juice.shake(this, 50, 0.0016);
    }
  }

  private stepDrops(): void {
    for (const drop of [...this.drops]) {
      if (!drop.active) {
        this.drops.delete(drop);
        continue;
      }
      // Hit-test live fires.
      let consumed = false;
      for (const fire of liveFires(this.state)) {
        if (Math.hypot(fire.x - drop.x, fire.y - (drop.y + 8)) < HIT_RADIUS) {
          this.onHitFire(fire.id, drop.x, drop.y);
          consumed = true;
          break;
        }
      }
      if (consumed) {
        this.popDrop(drop);
        continue;
      }
      if (drop.y > GROUND_Y || drop.x < -20 || drop.x > 980) {
        if (drop.y > GROUND_Y && motionAllowed()) Juice.burst(this, drop.x, GROUND_Y, { color: 0x9fe3ee, count: 4, radius: 18 });
        this.popDrop(drop);
      }
    }
  }

  private popDrop(drop: Drop): void {
    this.drops.delete(drop);
    drop.destroy();
  }

  private onHitFire(fireId: string, x: number, y: number): void {
    const before = this.state.fires.find((f) => f.id === fireId)?.heat ?? 0;
    const outcome = douseFire(this.state, fireId, 1);
    this.state = outcome.state;
    const flame = this.fireSprites.get(fireId);
    if (flame) {
      Juice.flashWhite(this, flame, 70);
      Juice.squashStretch(this, flame, 0.18, 120);
    }
    Juice.burst(this, x, y, { color: 0x9fe3ee, count: 7, radius: 30 });
    getSfx().play(outcome.out ? 'place' : 'spray-hit');
    this.renderFire(fireId);
    this.updatePips();
    if (before > 0 && outcome.out && motionAllowed()) {
      // A satisfied steam puff when a fire finally rests.
      Juice.burst(this, x, y - 20, { color: 0xe6f7fb, count: 10, radius: 40 });
    }
    if (this.state.completed && !this.done) this.waveComplete();
  }

  private onSprayButton(): void {
    if (this.done || this.overlayBusy()) return;
    if (isE2EEnabled()) {
      // Deterministic: cool the weakest fire so the harness converges without physics timing.
      this.state = applyHelper(this.state); // reuse the weakest-first cooler
      // applyHelper counts a helperAssist; for the button we'd rather count a spray — but for E2E the
      // distinction is cosmetic. Re-render the cooled fire + pips and check the win.
      this.state = countSpray(this.state);
      for (const f of this.state.fires) this.renderFire(f.id);
      this.updatePips();
      if (this.state.completed && !this.done) this.waveComplete();
      return;
    }
    const target = nearestLiveFire(this.state, 480, 280);
    if (target) this.sprayToward(target.x, target.y);
  }

  private helperTick(): void {
    if (this.done) return;
    const stalled = this.state.hits === this.hitsAtLastTick;
    this.hitsAtLastTick = this.state.hits;
    if (!stalled || liveFires(this.state).length === 0) return;
    const target = liveFires(this.state).reduce((a, b) => (b.heat < a.heat ? b : a));
    this.state = applyHelper(this.state);
    this.renderFire(target.id);
    this.updatePips();
    // A firefly friend swoops in and cools it.
    const key = hasTexture(this, 'hl.prop.firefly') ? 'hl.prop.firefly' : '__drop';
    const helper = this.add.image(-30, 120, key).setDisplaySize(40, 40).setDepth(34);
    this.tweens.add({
      targets: helper,
      x: target.x,
      y: target.y - 40,
      duration: 520,
      ease: 'Sine.easeInOut',
      onComplete: () => {
        Juice.burst(this, target.x, target.y, { color: 0x9fe3ee, count: 10, radius: 36 });
        getSfx().play('place');
        this.tweens.add({ targets: helper, x: 1000, y: 90, duration: 560, delay: 200, ease: 'Sine.easeIn', onComplete: () => helper.destroy() });
        if (this.state.completed && !this.done) this.waveComplete();
      },
    });
  }

  private updatePips(): void {
    const out = this.state.fires.filter((f) => f.heat === 0).length;
    this.pips.forEach((pip, i) => {
      const done = i < out;
      pip.setFillStyle(done ? 0x6fd3e0 : 0x6b3a2a);
      if (done && motionAllowed()) Juice.punch(this, pip, 1.4, 120);
    });
  }

  // A wave of fires is all out. If more waves remain, re-light the next (hotter) wave in place;
  // otherwise complete the mission. `done` blocks sprays during the swap.
  private waveComplete(): void {
    this.done = true;
    for (const drop of [...this.drops]) this.popDrop(drop);
    this.waveIndex += 1;
    this.updateRoundDots();
    if (this.waveIndex < fireBrigadeWaves.length) {
      // E2E advances synchronously so the deterministic spray budget isn't eaten by the pause.
      if (isE2EEnabled()) {
        this.startWave();
        return;
      }
      getSfx().play('correct');
      Juice.hitStop(this, 80);
      Juice.confetti(this, 16);
      this.time.delayedCall(motionAllowed() ? 700 : 0, () => this.startWave());
    } else {
      this.finalWin();
    }
  }

  private startWave(): void {
    this.state = createFireBrigadeState(fireBrigadeWaves[this.waveIndex]!);
    for (const fire of this.state.fires) {
      this.renderFire(fire.id);
      const flame = this.fireSprites.get(fire.id);
      if (flame) this.flicker(flame);
    }
    this.updatePips();
    this.hitsAtLastTick = this.state.hits;
    this.done = false;
  }

  private finalWin(): void {
    this.done = true;
    getSfx().play('correct');
    Juice.hitStop(this, 90);
    Juice.shake(this, 130, 0.0035);
    Juice.confetti(this, 28);
    getVoice().speak('mission-complete');
    this.time.delayedCall(motionAllowed() ? 520 : 0, () => completeMission(this, getFireBrigadeResult(this.state)));
  }

  private overlayBusy(): boolean {
    return isMissionExitOpen(this) || isOverlayOpen(this);
  }

  private requestExit(): void {
    confirmMissionExit(this, () => returnToTownMap(this));
  }
}
