import Phaser from 'phaser';
import { fadeInScene } from '../systems/SceneTransitions';
import { aimMissions } from '../data/aimMissions';
import { getSfx } from '../systems/GameServices';
import { bindIntents } from '../systems/bindIntents';
import { Juice } from '../systems/Juice';
import { completeMission, returnToTownMap } from '../systems/SceneNavigation';
import { confirmMissionExit, isMissionExitOpen } from '../systems/confirmMissionExit';
import { isOverlayOpen } from '../systems/overlayLock';
import { act, aimHits, coneAngles, createAimState, getAimResult, moveAimer, type AimState, type AimVec } from '../systems/AimEngine';
import { addIconButton } from '../ui/Button';
import { FONTS } from '../ui/typography';
import { hasTexture, motionAllowed } from '../ui/Sprite';
import { playMissionIntro } from '../ui/MissionIntro';
import { missionRegistry } from '../systems/GameServices';
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
  private cone!: Phaser.GameObjects.Graphics;
  private groundArrow!: Phaser.GameObjects.Triangle;
  private coneColor = 0x6fd3e0;
  private targetSprites = new Map<string, Phaser.GameObjects.Image>();
  private targetRings = new Map<string, Phaser.GameObjects.Arc>();
  private pips: Phaser.GameObjects.Arc[] = [];
  private message!: Phaser.GameObjects.Text;
  private done = false;

  // The visual cone range is derived from the engine's config (P3-11) so the cone + target rings
  // exactly match what an Act will hit even if a mission overrides AimConfig.range.
  private get coneRange(): number {
    return this.state.config.range;
  }

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
    this.coneColor = cfg.coneColor ?? 0x6fd3e0;
    this.state = createAimState(cfg.targets);
    this.targetSprites = new Map();
    this.targetRings = new Map();
    this.pips = [];
    this.done = false;

    this.add.image(480, 270, hasTexture(this, cfg.backdrop) ? cfg.backdrop : 'hl.bg.town').setDisplaySize(960, 540).setDepth(0);
    this.add.rectangle(480, 270, 960, 540, 0x101b2e, 0.22).setDepth(1);
    this.add.rectangle(480, 28, 960, 64, 0x101b2e, 0.4).setDepth(1);

    this.buildPips(cfg.targets.length);

    for (const t of this.state.targets) {
      // A pulsing ring marks any LIVE target currently inside the aim cone (P3-05) — under the sprite.
      this.targetRings.set(t.id, this.add.circle(t.x, t.y, 46, 0x000000, 0).setStrokeStyle(6, this.coneColor, 0.95).setDepth(11).setVisible(false));
      this.targetSprites.set(t.id, this.add.image(t.x, t.y, hasTexture(this, cfg.targetKey) ? cfg.targetKey : 'hl.prop.star').setDepth(12));
    }

    // Bold opaque aim cone (P3-05) — a mission-themed fan from the hero so the child can SEE where
    // an Act will land, instead of mashing blind at a near-invisible beam.
    this.cone = this.add.graphics().setDepth(13);
    // A faint beam flash is kept for the Act pulse (actVisual), but the cone is the primary signal.
    this.beam = this.add.rectangle(0, 0, 190, 46, this.coneColor, 0.16).setOrigin(0, 0.5).setBlendMode(Phaser.BlendModes.ADD).setDepth(13);
    // Subtle ground arrow under the hero showing the aim direction.
    this.groundArrow = this.add.triangle(0, 0, 0, -14, 13, 12, -13, 12, this.coneColor, 0.85).setDepth(14);
    this.heroShadow = this.add.ellipse(0, 0, 64, 18, 0x0a1322, 0.5).setDepth(14);
    this.hero = this.add.image(0, 0, hasTexture(this, `hl.char.${cfg.characterId}`) ? `hl.char.${cfg.characterId}` : 'hl.char.ember').setOrigin(0.5, 1).setDisplaySize(92, 92).setDepth(15);

    this.message = this.add
      .text(480, 96, this.state.lastMessage, { fontFamily: FONTS.display, fontSize: '18px', color: '#FFE2A6', stroke: '#2A1606', strokeThickness: 4, align: 'center', wordWrap: { width: 600 } })
      .setOrigin(0.5)
      .setDepth(30);

    this.buildControls();

    bindIntents(this, {
      onMove: (x, y) => !this.overlayBusy() && this.move({ x, y }),
      onConfirm: () => !this.overlayBusy() && this.doAct(),
      onBack: () => !isOverlayOpen(this) && this.requestExit(),
    });

    this.renderTargets();
    this.placeHero(false);

    const panel = missionRegistry.get(this.missionId)?.introPanels[0];
    if (panel) playMissionIntro(this, panel, () => undefined);
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
    const angle = Math.atan2(this.state.aim.y, this.state.aim.x);
    this.beam.setPosition(x, y - 30).setRotation(angle);
    this.groundArrow.setPosition(x + this.state.aim.x * 30, y + 30 + this.state.aim.y * 14).setRotation(angle + Math.PI / 2);
    // Apex at the engine's measure-from point (state.player) so the drawn sector === the hit area.
    this.drawCone(x, y);
    this.updateTargetRings();
    if (animate && motionAllowed()) {
      this.tweens.add({ targets: this.hero, x, y: y + 34, duration: 200, ease: 'Quad.easeOut' });
      this.tweens.add({ targets: this.heroShadow, x, y: y + 36, duration: 200, ease: 'Quad.easeOut' });
    } else {
      this.hero.setPosition(x, y + 34);
      this.heroShadow.setPosition(x, y + 36);
    }
  }

  // The bold filled cone (P3-05, CF-3): the EXACT hittable sector from AimEngine.coneAngles, clipped
  // to range. A horizontal aim fills a 180° half-disc, a diagonal a 90° quadrant — so the child sees
  // precisely the area an Act will clear, never a narrow wedge that lies.
  private drawCone(ox: number, oy: number): void {
    const { center, half } = coneAngles(this.state.aim);
    const r = this.coneRange;
    this.cone.clear();
    this.cone.fillStyle(this.coneColor, 0.6).lineStyle(3, this.coneColor, 0.85);
    this.cone.slice(ox, oy, r, center - half, center + half, false);
    this.cone.fillPath();
    this.cone.strokePath();
  }

  // Drives the pulsing rings off the engine's ONE source of truth (CF-3): a ring lights exactly when
  // an Act would hit that live target.
  private inConeView(t: { x: number; y: number; health: number }): boolean {
    if (t.health <= 0) return false;
    return aimHits(this.state.aim, t.x - this.state.player.x, t.y - this.state.player.y, this.coneRange);
  }

  private updateTargetRings(): void {
    for (const t of this.state.targets) {
      const ring = this.targetRings.get(t.id);
      if (!ring) continue;
      const lit = this.inConeView(t);
      if (lit && !ring.visible) {
        ring.setVisible(true).setScale(1).setAlpha(0.95);
        if (motionAllowed()) {
          this.tweens.killTweensOf(ring);
          this.tweens.add({ targets: ring, scale: 1.18, alpha: 0.5, duration: 520, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
        }
      } else if (!lit && ring.visible) {
        this.tweens.killTweensOf(ring);
        ring.setVisible(false);
      }
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
    this.updateTargetRings();
  }

  private move(dir: AimVec): void {
    if (this.done || (dir.x === 0 && dir.y === 0)) return;
    this.state = moveAimer(this.state, dir);
    this.placeHero(true);
  }

  private doAct(): void {
    if (this.done) return;
    const prevPlayer = { ...this.state.player };
    const prevHealth = new Map(this.state.targets.map((t) => [t.id, t.health]));
    const outcome = act(this.state);
    this.state = outcome.state;

    this.actVisual();
    if (outcome.hit) {
      getSfx().play('spray-hit');
    } else if (!outcome.assisted) {
      // P1-12: a miss is NEVER silent — soft whiff + a puff at the cone tip + a nudge arrow toward
      // the nearest live target, so every press gives the child visible + audible feedback.
      getSfx().play('try-again');
      this.whiffFeedback();
    }
    for (const t of this.state.targets) {
      if ((prevHealth.get(t.id) ?? 0) > t.health && !outcome.assisted) Juice.burst(this, t.x, t.y - 16, { color: 0x9fe3ee, count: 7, radius: 30 });
    }
    // The hero auto-pans on a miss — animate the move so the next Act is visible progress.
    if (outcome.autoPanned) {
      this.placeHero(true);
    } else {
      this.placeHero(false);
    }
    if (outcome.assisted) this.helperAssist(prevPlayer);

    this.message.setText(this.state.lastMessage);
    this.renderTargets();

    if (outcome.completed) {
      this.done = true;
      if (motionAllowed()) Juice.shake(this, 100, 0.003);
      this.time.delayedCall(motionAllowed() ? 360 : 0, () => completeMission(this, getAimResult(this.state, this.missionId, this.cfg.stickerId)));
    }
  }

  // P1-12: never a silent dead tap. A small puff at the cone tip + a one-shot arrow pointing the
  // child toward the nearest live target, so a miss always *teaches* where to go next.
  private whiffFeedback(): void {
    const { x, y } = this.state.player;
    const a = this.state.aim;
    const tipX = x + a.x * 120;
    const tipY = y - 30 + a.y * 120;
    Juice.burst(this, tipX, tipY, { color: this.coneColor, count: 6, radius: 26 });
    const target = this.nearestLive();
    if (!target || !motionAllowed()) return;
    const ang = Math.atan2(target.y - y, target.x - x);
    const arrow = this.add.triangle(x + Math.cos(ang) * 70, y - 20 + Math.sin(ang) * 70, 0, -16, 16, 14, -16, 14, 0xffe2a6, 0.95).setDepth(38).setRotation(ang + Math.PI / 2);
    this.tweens.add({
      targets: arrow,
      x: x + Math.cos(ang) * 120,
      y: y - 20 + Math.sin(ang) * 120,
      alpha: 0,
      duration: 760,
      ease: 'Quad.easeOut',
      onComplete: () => arrow.destroy(),
    });
  }

  private nearestLive(): { x: number; y: number } | null {
    let best: { x: number; y: number } | null = null;
    let bestDist = Infinity;
    for (const t of this.state.targets) {
      if (t.health <= 0) continue;
      const d = Math.hypot(t.x - this.state.player.x, t.y - this.state.player.y);
      if (d < bestDist) {
        bestDist = d;
        best = { x: t.x, y: t.y };
      }
    }
    return best;
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

  // P3-04: a real friendly helper flies TO the assisted target, dips, sprays a visible splash on
  // THAT target, waves, and leaves with a warm 'a friend helped!' chime — a No-Fail mercy that
  // reads as a gift instead of the old invisible teal dot.
  private helperAssist(prevPlayer: { x: number; y: number }): void {
    const target = this.assistTargetNear(prevPlayer);
    getSfx().play('place'); // warm 'a friend helped' chime
    if (!target) return;
    if (!motionAllowed()) {
      Juice.burst(this, target.x, target.y - 16, { color: 0x9fe3ee, count: 9, radius: 34 });
      return;
    }
    const fromX = -40;
    const fromY = 150;
    const key = hasTexture(this, 'hl.prop.firefly') ? 'hl.prop.firefly' : null;
    const helper = key
      ? this.add.image(fromX, fromY, key).setDisplaySize(46, 46).setDepth(36)
      : this.add.circle(fromX, fromY, 16, 0xffe2a6, 0.95).setStrokeStyle(3, this.coneColor).setDepth(36);
    // Fly in to just above the target...
    this.tweens.add({
      targets: helper,
      x: target.x,
      y: target.y - 56,
      duration: 520,
      ease: 'Sine.easeInOut',
      onComplete: () => {
        // ...dip + spray a visible splash on THAT target...
        this.tweens.add({ targets: helper, y: target.y - 34, duration: 150, yoyo: true, ease: 'Quad.easeOut' });
        Juice.burst(this, target.x, target.y - 12, { color: 0x9fe3ee, count: 10, radius: 38 });
        const sprite = this.targetSprites.get(target.id);
        if (sprite) Juice.punch(this, sprite, 1.16, 160);
        // ...wave (a little wobble)...
        this.tweens.add({ targets: helper, angle: 16, duration: 120, yoyo: true, repeat: 1, delay: 160, ease: 'Sine.easeInOut' });
        // ...then leave.
        this.tweens.add({ targets: helper, x: 1010, y: 180, duration: 620, delay: 520, ease: 'Sine.easeIn', onComplete: () => helper.destroy() });
      },
    });
  }

  private assistTargetNear(p: { x: number; y: number }): { id: string; x: number; y: number } | null {
    // Prefer a still-live target near where the child was aiming; fall back to any target so the
    // helper always has somewhere to fly even on the assist that clears the last one.
    let best: { id: string; x: number; y: number } | null = null;
    let bestDist = Infinity;
    let fallback: { id: string; x: number; y: number } | null = null;
    for (const t of this.state.targets) {
      fallback = { id: t.id, x: t.x, y: t.y };
      if (t.health <= 0) continue;
      const d = Math.hypot(t.x - p.x, t.y - p.y);
      if (d < bestDist) {
        bestDist = d;
        best = { id: t.id, x: t.x, y: t.y };
      }
    }
    return best ?? fallback;
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

  // CF-1: ignore confirm/move intents while the intro veil covers the field or the exit modal is up.
  private overlayBusy(): boolean {
    return isMissionExitOpen(this) || isOverlayOpen(this);
  }

  private requestExit(): void {
    confirmMissionExit(this, () => returnToTownMap(this));
  }
}
