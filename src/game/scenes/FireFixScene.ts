import Phaser from 'phaser';
import { fadeInScene } from '../systems/SceneTransitions';
import { picnicFires } from '../data/picnicFires';
import { bindIntents } from '../systems/bindIntents';
import { Juice } from '../systems/Juice';
import { completeMission, returnToTownMap } from '../systems/SceneNavigation';
import { getSfx } from '../systems/GameServices';
import { createSecretsForProfile, addSecretHotspot } from '../systems/secretHotspot';
import {
  createFireFixState,
  getFireFixResult,
  moveFirefighter,
  sprayWater,
  type Direction,
  type FireFixState,
} from '../systems/FireFix';
import { addIconButton } from '../ui/Button';
import { FONTS } from '../ui/typography';
import { hasTexture, motionAllowed } from '../ui/Sprite';
import { confirmMissionExit, isMissionExitOpen } from '../systems/confirmMissionExit';

export class FireFixScene extends Phaser.Scene {
  private state!: FireFixState;
  private ember!: Phaser.GameObjects.Image;
  private emberShadow!: Phaser.GameObjects.Ellipse;
  private beam!: Phaser.GameObjects.Rectangle;
  private fireSprites = new Map<string, Phaser.GameObjects.Image>();
  private fireSmoke = new Map<string, Phaser.GameObjects.Image>();
  private pips: Phaser.GameObjects.Arc[] = [];
  private message!: Phaser.GameObjects.Text;
  private done = false;

  constructor() {
    super('FireFixScene');
  }

  create(): void {
    fadeInScene(this);
    this.state = createFireFixState(picnicFires);
    this.fireSprites = new Map();
    this.fireSmoke = new Map();
    this.pips = [];
    this.done = false;

    this.paintWorld();
    this.buildPips();

    // Fires (no numeric labels — size + colour show their state).
    for (const fire of this.state.fires) {
      this.fireSmoke.set(fire.id, this.add.image(fire.x, fire.y - 34, 'hl.prop.smokeWisp').setDisplaySize(40, 46).setDepth(11).setAlpha(0.5));
      const flame = this.add.image(fire.x, fire.y, 'hl.prop.campfire').setOrigin(0.5, 1).setDepth(12);
      this.fireSprites.set(fire.id, flame);
    }

    // The aim beam (where the water will reach), then Ember on top.
    this.beam = this.add.rectangle(0, 0, 190, 46, 0x6fd3e0, 0.16).setOrigin(0, 0.5).setBlendMode(Phaser.BlendModes.ADD).setDepth(13);
    this.emberShadow = this.add.ellipse(0, 0, 64, 18, 0x0a1322, 0.5).setDepth(14);
    this.ember = this.add.image(0, 0, 'hl.char.ember').setOrigin(0.5, 1).setDisplaySize(92, 92).setDepth(15);

    this.message = this.add
      .text(480, 96, '', { fontFamily: FONTS.display, fontSize: '18px', color: '#FFE2A6', stroke: '#2A1606', strokeThickness: 4, align: 'center', wordWrap: { width: 600 } })
      .setOrigin(0.5)
      .setDepth(30);

    this.buildControls();

    // Secret Friend: a shy creature for the patient child (3 touches), away from the playfield.
    const secrets = createSecretsForProfile();
    addSecretHotspot(this, secrets, 'secret-friend', 822, 438);

    bindIntents(this, {
      onMove: (x, y) => this.move({ x, y }),
      onConfirm: () => !isMissionExitOpen(this) && this.spray(),
      onBack: () => this.requestExit(),
    });

    this.renderFires();
    this.placeEmber(false);
  }

  private paintWorld(): void {
    this.add.image(480, 270, 'hl.bg.fire').setDisplaySize(960, 540).setDepth(0);
    this.add.rectangle(480, 270, 960, 540, 0x101b2e, 0.22).setDepth(1);
    this.add.rectangle(480, 28, 960, 64, 0x101b2e, 0.4).setDepth(1);
    if (hasTexture(this, 'hl.prop.hydrant')) this.add.image(150, 360, 'hl.prop.hydrant').setOrigin(0.5, 1).setDisplaySize(70, 84).setDepth(10);
  }

  private buildPips(): void {
    const total = this.state.fires.length;
    const gap = 28;
    const startX = 480 - ((total - 1) * gap) / 2;
    for (let i = 0; i < total; i += 1) {
      this.pips.push(this.add.circle(startX + i * gap, 40, 7, 0x6b3a2a).setStrokeStyle(2, 0x1b2a41).setDepth(20));
    }
  }

  private placeEmber(animate: boolean): void {
    const { x, y } = this.state.player;
    const angle = Math.atan2(this.state.aim.y, this.state.aim.x);
    this.beam.setPosition(x, y - 30).setRotation(angle);
    if (animate && motionAllowed()) {
      this.tweens.add({ targets: [this.ember], x, y: y + 34, duration: 200, ease: 'Quad.easeOut' });
      this.tweens.add({ targets: [this.emberShadow], x, y: y + 36, duration: 200, ease: 'Quad.easeOut' });
    } else {
      this.ember.setPosition(x, y + 34);
      this.emberShadow.setPosition(x, y + 36);
    }
  }

  private renderFires(): void {
    let out = 0;
    for (const fire of this.state.fires) {
      const flame = this.fireSprites.get(fire.id);
      const smoke = this.fireSmoke.get(fire.id);
      if (!flame) continue;
      if (fire.health <= 0) {
        out += 1;
        // Unmistakably COLD + safe: small, faint, cool-teal tint, with a calm rising steam curl.
        flame.setTexture(hasTexture(this, 'hl.prop.embers') ? 'hl.prop.embers' : 'hl.prop.campfire').setDisplaySize(42, 38).setAlpha(0.35).setTint(0x6fd3e0);
        smoke?.setAlpha(0.6).setPosition(fire.x, fire.y - 26);
      } else {
        const size = 52 + fire.health * 22;
        // Danger reads WARM-orange (no bright white rim); only slightly cooler as it shrinks.
        flame.setTexture('hl.prop.campfire').setDisplaySize(size, size).setAlpha(1);
        flame.setTint(fire.health >= fire.maxHealth ? 0xffb24a : 0xffd9a0);
        smoke?.setAlpha(0.5).setPosition(fire.x, fire.y - size * 0.7);
      }
    }
    this.pips.forEach((pip, i) => pip.setFillStyle(i < out ? 0x6fd3e0 : 0x6b3a2a));
  }

  private move(direction: Direction): void {
    if (this.done || (direction.x === 0 && direction.y === 0)) return;
    this.state = moveFirefighter(this.state, direction);
    this.placeEmber(true);
  }

  private spray(): void {
    if (this.done) return;
    const prevAssists = this.state.helperAssists;
    const prevHealth = new Map(this.state.fires.map((f) => [f.id, f.health]));
    const outcome = sprayWater(this.state);
    this.state = outcome.state;

    this.sprayVisual();
    if (outcome.hit) getSfx().play('spray-hit');

    // Splash + steam on any fire that just dropped (player spray or drone assist).
    for (const fire of this.state.fires) {
      if ((prevHealth.get(fire.id) ?? 0) > fire.health) {
        Juice.burst(this, fire.x, fire.y - 20, { color: 0x9fe3ee, count: 7, radius: 30 });
      }
    }
    if (this.state.helperAssists > prevAssists) this.droneFlyby();

    this.message.setText(this.state.lastMessage);
    this.renderFires();

    if (outcome.completed) {
      this.done = true;
      if (motionAllowed()) Juice.shake(this, 100, 0.003);
      this.time.delayedCall(motionAllowed() ? 360 : 0, () => completeMission(this, getFireFixResult(this.state)));
    }
  }

  private sprayVisual(): void {
    if (!motionAllowed()) return;
    this.tweens.add({ targets: this.beam, alpha: 0.5, duration: 90, yoyo: true, ease: 'Quad.easeOut' });
    const { x, y } = this.state.player;
    const a = this.state.aim;
    for (let i = 0; i < 6; i += 1) {
      const key = hasTexture(this, 'hl.fx.waterDroplet') ? 'hl.fx.waterDroplet' : null;
      const drop = key ? this.add.image(x, y - 20, key).setDisplaySize(14, 14).setDepth(16) : this.add.circle(x, y - 20, 5, 0x9fe3ee).setDepth(16);
      const dist = 60 + i * 22;
      this.tweens.add({ targets: drop, x: x + a.x * dist + (a.x === 0 ? (Math.random() * 30 - 15) : 0), y: y - 20 + a.y * dist + (a.y === 0 ? (Math.random() * 20 - 10) : 0), alpha: 0, duration: 320, ease: 'Quad.easeOut', onComplete: () => drop.destroy() });
    }
  }

  private droneFlyby(): void {
    const drone = this.add.circle(-40, 150, 14, 0x9fe3ee, 0.9).setStrokeStyle(3, 0xffc857).setDepth(35);
    if (!motionAllowed()) {
      drone.destroy();
      return;
    }
    this.tweens.add({ targets: drone, x: 1000, y: 180, duration: 1100, ease: 'Sine.easeInOut', onComplete: () => drone.destroy() });
  }

  private buildControls(): void {
    // D-pad cluster (bottom-left), spray (centre), back (top-left). All icon-coins.
    this.arrowCoin(160, 410, '↑', { x: 0, y: -1 }, 'fire.move.up');
    this.arrowCoin(104, 478, '←', { x: -1, y: 0 }, 'fire.move.left');
    this.arrowCoin(216, 478, '→', { x: 1, y: 0 }, 'fire.move.right');
    this.arrowCoin(160, 514, '↓', { x: 0, y: 1 }, 'fire.move.down');
    const spray = addIconButton(this, {
      x: 520,
      y: 486,
      size: 104,
      key: hasTexture(this, 'hl.prop.waterSplash') ? 'hl.prop.waterSplash' : '__spray__',
      onPress: () => !isMissionExitOpen(this) && this.spray(),
      testId: 'fire.spray',
      pulse: true,
    });
    spray.setDepth(40);
    addIconButton(this, { x: 52, y: 46, size: 56, key: 'hl.ui.back', onPress: () => this.requestExit(), testId: 'fire.back-to-map' }).setDepth(40);
  }

  private arrowCoin(x: number, y: number, glyph: string, dir: Direction, testId: string): void {
    const coin = addIconButton(this, { x, y, size: 56, key: '__arrow__', onPress: () => !isMissionExitOpen(this) && this.move(dir), testId });
    coin.add(this.add.text(0, 0, glyph, { fontFamily: FONTS.display, fontSize: '34px', color: '#2A1606', fontStyle: 'bold' }).setOrigin(0.5));
    coin.setDepth(40);
  }

  private requestExit(): void {
    confirmMissionExit(this, () => returnToTownMap(this));
  }
}
