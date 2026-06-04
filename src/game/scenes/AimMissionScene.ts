import Phaser from 'phaser';
import { fadeInScene } from '../systems/SceneTransitions';
import { aimMissions } from '../data/aimMissions';
import { getSfx } from '../systems/GameServices';
import { bindIntents } from '../systems/bindIntents';
import { Juice } from '../systems/Juice';
import { completeMission, returnToTownMap } from '../systems/SceneNavigation';
import { confirmMissionExit, isMissionExitOpen } from '../systems/confirmMissionExit';
import { act, createAimState, getAimResult, moveAimer, type AimState, type AimVec } from '../systems/AimEngine';
import { addIconButton } from '../ui/Button';
import { FONTS } from '../ui/typography';
import { hasTexture, motionAllowed } from '../ui/Sprite';
import type { MissionId } from '../types';

// One reusable scene for every Aim mission (Goo Cleanup, Frog Flight, Asteroid Blaster). The hero
// moves (tween, render-in-place), aims, and acts on targets in a cone; they shrink + clear. No-Fail
// helper floor finishes an act-only run (act / move / keyboard all work).
export class AimMissionScene extends Phaser.Scene {
  private missionId: MissionId = 'goo-cleanup';
  private state!: AimState;
  private cfg = aimMissions['goo-cleanup']!;
  private hero!: Phaser.GameObjects.Image;
  private heroShadow!: Phaser.GameObjects.Ellipse;
  private beam!: Phaser.GameObjects.Rectangle;
  private targetSprites = new Map<string, Phaser.GameObjects.Image>();
  private pips: Phaser.GameObjects.Arc[] = [];
  private message!: Phaser.GameObjects.Text;
  private done = false;

  constructor() {
    super('AimMissionScene');
  }

  init(data: { missionId?: MissionId }): void {
    this.missionId = data.missionId ?? 'goo-cleanup';
  }

  create(): void {
    fadeInScene(this);
    const cfg = aimMissions[this.missionId];
    if (!cfg) {
      returnToTownMap(this);
      return;
    }
    this.cfg = cfg;
    this.state = createAimState(cfg.targets);
    this.targetSprites = new Map();
    this.pips = [];
    this.done = false;

    this.add.image(480, 270, hasTexture(this, cfg.backdrop) ? cfg.backdrop : 'hl.bg.town').setDisplaySize(960, 540).setDepth(0);
    this.add.rectangle(480, 270, 960, 540, 0x101b2e, 0.22).setDepth(1);
    this.add.rectangle(480, 28, 960, 64, 0x101b2e, 0.4).setDepth(1);

    this.buildPips(cfg.targets.length);

    for (const t of this.state.targets) {
      this.targetSprites.set(t.id, this.add.image(t.x, t.y, hasTexture(this, cfg.targetKey) ? cfg.targetKey : 'hl.prop.star').setDepth(12));
    }

    this.beam = this.add.rectangle(0, 0, 190, 46, 0x6fd3e0, 0.16).setOrigin(0, 0.5).setBlendMode(Phaser.BlendModes.ADD).setDepth(13);
    this.heroShadow = this.add.ellipse(0, 0, 64, 18, 0x0a1322, 0.5).setDepth(14);
    this.hero = this.add.image(0, 0, hasTexture(this, `hl.char.${cfg.characterId}`) ? `hl.char.${cfg.characterId}` : 'hl.char.ember').setOrigin(0.5, 1).setDisplaySize(92, 92).setDepth(15);

    this.message = this.add
      .text(480, 96, '', { fontFamily: FONTS.display, fontSize: '18px', color: '#FFE2A6', stroke: '#2A1606', strokeThickness: 4, align: 'center', wordWrap: { width: 600 } })
      .setOrigin(0.5)
      .setDepth(30);

    this.buildControls();

    bindIntents(this, {
      onMove: (x, y) => this.move({ x, y }),
      onConfirm: () => !isMissionExitOpen(this) && this.doAct(),
      onBack: () => this.requestExit(),
    });

    this.renderTargets();
    this.placeHero(false);
  }

  private buildPips(total: number): void {
    const gap = 28;
    const startX = 480 - ((total - 1) * gap) / 2;
    for (let i = 0; i < total; i += 1) {
      this.pips.push(this.add.circle(startX + i * gap, 40, 7, 0x6b3a2a).setStrokeStyle(2, 0x1b2a41).setDepth(20));
    }
  }

  private placeHero(animate: boolean): void {
    const { x, y } = this.state.player;
    this.beam.setPosition(x, y - 30).setRotation(Math.atan2(this.state.aim.y, this.state.aim.x));
    if (animate && motionAllowed()) {
      this.tweens.add({ targets: this.hero, x, y: y + 34, duration: 200, ease: 'Quad.easeOut' });
      this.tweens.add({ targets: this.heroShadow, x, y: y + 36, duration: 200, ease: 'Quad.easeOut' });
    } else {
      this.hero.setPosition(x, y + 34);
      this.heroShadow.setPosition(x, y + 36);
    }
  }

  private renderTargets(): void {
    let cleared = 0;
    for (const t of this.state.targets) {
      const sprite = this.targetSprites.get(t.id);
      if (!sprite) continue;
      if (t.health <= 0) {
        cleared += 1;
        if (this.cfg.clearedKey && hasTexture(this, this.cfg.clearedKey)) sprite.setTexture(this.cfg.clearedKey);
        sprite.setDisplaySize(44, 44).setAlpha(0.4);
      } else {
        const size = 56 + t.health * 18;
        sprite.setTexture(hasTexture(this, this.cfg.targetKey) ? this.cfg.targetKey : 'hl.prop.star').setDisplaySize(size, size).setAlpha(1);
      }
    }
    this.pips.forEach((pip, i) => pip.setFillStyle(i < cleared ? 0x6fd3e0 : 0x6b3a2a));
  }

  private move(dir: AimVec): void {
    if (this.done || (dir.x === 0 && dir.y === 0)) return;
    this.state = moveAimer(this.state, dir);
    this.placeHero(true);
  }

  private doAct(): void {
    if (this.done) return;
    const prevAssists = this.state.assists;
    const prevHealth = new Map(this.state.targets.map((t) => [t.id, t.health]));
    const outcome = act(this.state);
    this.state = outcome.state;

    this.actVisual();
    if (outcome.hit) getSfx().play('spray-hit');
    for (const t of this.state.targets) {
      if ((prevHealth.get(t.id) ?? 0) > t.health) Juice.burst(this, t.x, t.y - 16, { color: 0x9fe3ee, count: 7, radius: 30 });
    }
    if (this.state.assists > prevAssists) this.assistFlyby();

    this.message.setText(this.state.lastMessage);
    this.renderTargets();

    if (outcome.completed) {
      this.done = true;
      if (motionAllowed()) Juice.shake(this, 100, 0.003);
      this.time.delayedCall(motionAllowed() ? 360 : 0, () => completeMission(this, getAimResult(this.state, this.missionId, this.cfg.stickerId)));
    }
  }

  private actVisual(): void {
    if (!motionAllowed()) return;
    this.tweens.add({ targets: this.beam, alpha: 0.5, duration: 90, yoyo: true, ease: 'Quad.easeOut' });
    const { x, y } = this.state.player;
    const a = this.state.aim;
    for (let i = 0; i < 6; i += 1) {
      const p = this.add.circle(x, y - 20, 5, 0x9fe3ee).setDepth(16);
      const dist = 60 + i * 22;
      this.tweens.add({ targets: p, x: x + a.x * dist + (a.x === 0 ? Math.random() * 30 - 15 : 0), y: y - 20 + a.y * dist + (a.y === 0 ? Math.random() * 20 - 10 : 0), alpha: 0, duration: 320, ease: 'Quad.easeOut', onComplete: () => p.destroy() });
    }
  }

  private assistFlyby(): void {
    const drone = this.add.circle(-40, 150, 14, 0x9fe3ee, 0.9).setStrokeStyle(3, 0xffc857).setDepth(35);
    if (!motionAllowed()) {
      drone.destroy();
      return;
    }
    this.tweens.add({ targets: drone, x: 1000, y: 180, duration: 1100, ease: 'Sine.easeInOut', onComplete: () => drone.destroy() });
  }

  private buildControls(): void {
    this.arrowCoin(160, 410, '↑', { x: 0, y: -1 }, `${this.missionId}.move.up`);
    this.arrowCoin(104, 478, '←', { x: -1, y: 0 }, `${this.missionId}.move.left`);
    this.arrowCoin(216, 478, '→', { x: 1, y: 0 }, `${this.missionId}.move.right`);
    this.arrowCoin(160, 514, '↓', { x: 0, y: 1 }, `${this.missionId}.move.down`);
    const actCoin = addIconButton(this, {
      x: 520,
      y: 486,
      size: 104,
      key: hasTexture(this, this.cfg.actIconKey) ? this.cfg.actIconKey : '__act__',
      caption: this.cfg.actLabel,
      onPress: () => !isMissionExitOpen(this) && this.doAct(),
      testId: `${this.missionId}.act`,
      pulse: true,
    });
    actCoin.setDepth(40);
    addIconButton(this, { x: 52, y: 46, size: 56, key: 'hl.ui.back', onPress: () => this.requestExit(), testId: `${this.missionId}.back-to-map` }).setDepth(40);
  }

  private arrowCoin(x: number, y: number, glyph: string, dir: AimVec, testId: string): void {
    const coin = addIconButton(this, { x, y, size: 56, key: '__arrow__', onPress: () => !isMissionExitOpen(this) && this.move(dir), testId });
    coin.add(this.add.text(0, 0, glyph, { fontFamily: FONTS.display, fontSize: '34px', color: '#2A1606', fontStyle: 'bold' }).setOrigin(0.5));
    coin.setDepth(40);
  }

  private requestExit(): void {
    confirmMissionExit(this, () => returnToTownMap(this));
  }
}
