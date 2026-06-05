import Phaser from 'phaser';
import { fadeInScene } from '../systems/SceneTransitions';
import { matchMissions } from '../data/matchMissions';
import { getSfx } from '../systems/GameServices';
import { bindIntents } from '../systems/bindIntents';
import { registerE2EButton } from '../systems/E2EBridge';
import { Juice } from '../systems/Juice';
import { completeMission, returnToTownMap } from '../systems/SceneNavigation';
import { confirmMissionExit, isMissionExitOpen } from '../systems/confirmMissionExit';
import { chooseMatch, createMatchState, getMatchResult, type MatchState } from '../systems/MatchEngine';
import { addIconButton } from '../ui/Button';
import { FONTS } from '../ui/typography';
import { hasTexture, motionAllowed } from '../ui/Sprite';
import { playMissionIntro } from '../ui/MissionIntro';
import { missionRegistry } from '../systems/GameServices';
import type { MissionId } from '../types';

const HOME = { x: 480, y: 210 };

// Fisher-Yates copy — replay variety for order-independent Match missions.
function shuffled<T>(items: T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

type TargetView = { id: string; x: number; bounds: Phaser.Geom.Rectangle; glow: Phaser.GameObjects.Rectangle; panel: Phaser.GameObjects.Rectangle; icon: Phaser.GameObjects.Image | null };

// One reusable scene for every Match mission (Inverse Dream, Dream Statues, Recycled Inventions,
// Bread Rush). Drag the prompt onto the matching target — also tap / keyboard / E2E. State advances
// synchronously; the matched prompt flies away as a ghost so the next appears at once (never blocks
// a fast tapper). The correct target glows (No-Fail: a wrong pick only springs back + hints).
export class MatchMissionScene extends Phaser.Scene {
  private missionId: MissionId = 'inverse-dream';
  private state!: MatchState;
  private stickerId = '';
  private prompt!: Phaser.GameObjects.Image;
  private promptBase = 1;
  private targets: TargetView[] = [];
  private pips: Phaser.GameObjects.Arc[] = [];
  private hint!: Phaser.GameObjects.Text;
  private selected = 0;
  private done = false;

  constructor() {
    super('MatchMissionScene');
  }

  init(data: { missionId?: MissionId }): void {
    this.missionId = data.missionId ?? 'inverse-dream';
  }

  create(): void {
    fadeInScene(this);
    const cfg = matchMissions[this.missionId];
    if (!cfg) {
      returnToTownMap(this);
      return;
    }
    this.stickerId = cfg.stickerId;
    const prompts = cfg.shuffle ? shuffled(cfg.prompts) : cfg.prompts;
    this.state = createMatchState(cfg.targets, prompts);
    this.targets = [];
    this.pips = [];
    this.selected = 0;
    this.done = false;

    this.add.image(480, 270, hasTexture(this, cfg.backdrop) ? cfg.backdrop : 'hl.bg.town').setDisplaySize(960, 540).setDepth(0);
    this.add.rectangle(480, 270, 960, 540, 0x101b2e, 0.22).setDepth(1);
    this.add.rectangle(480, 30, 960, 70, 0x101b2e, 0.4).setDepth(1);

    this.buildPips(cfg.prompts.length);

    this.add.ellipse(866, 360, 70, 18, 0x0a1322, 0.5).setDepth(9);
    if (hasTexture(this, `hl.char.${cfg.characterId}`)) {
      this.add.image(866, 360, `hl.char.${cfg.characterId}`).setOrigin(0.5, 1).setDisplaySize(96, 96).setDepth(10);
    }

    this.buildTargets(cfg.targets);

    this.hint = this.add
      .text(480, 322, '', { fontFamily: FONTS.display, fontSize: '20px', color: '#FFE2A6', stroke: '#2A1606', strokeThickness: 5, align: 'center', wordWrap: { width: 560 } })
      .setOrigin(0.5)
      .setDepth(22);

    this.add.circle(HOME.x, HOME.y, 70, 0xffe2a6, 0.1).setBlendMode(Phaser.BlendModes.ADD).setDepth(14);
    this.prompt = this.add.image(HOME.x, HOME.y, cfg.prompts[0]?.icon ?? 'hl.prop.star').setDisplaySize(104, 104).setDepth(30);
    this.prompt.setInteractive({ useHandCursor: true, draggable: true });
    this.input.setDraggable(this.prompt);
    this.wireDrag();

    addIconButton(this, { x: 52, y: 46, size: 56, key: 'hl.ui.back', onPress: () => this.requestExit(), testId: `${this.missionId}.back-to-map` }).setDepth(40);

    bindIntents(this, {
      onMove: (x, y) => this.moveSelection(x || y),
      onConfirm: () => !isMissionExitOpen(this) && this.attempt(this.targets[this.selected]?.id),
      onBack: () => this.requestExit(),
    });

    this.loadPrompt();

    const panel = missionRegistry.get(this.missionId)?.introPanels[0];
    if (panel) playMissionIntro(this, panel, () => undefined);
  }

  private buildPips(total: number): void {
    const gap = 26;
    const startX = 480 - ((total - 1) * gap) / 2;
    for (let i = 0; i < total; i += 1) {
      this.pips.push(this.add.circle(startX + i * gap, 40, 7, 0x3a4a66).setStrokeStyle(2, 0x1b2a41).setDepth(20));
    }
  }

  private buildTargets(targets: { id: string; label: string; icon: string }[]): void {
    const spacing = Math.min(190, 780 / targets.length);
    const startX = 480 - ((targets.length - 1) * spacing) / 2;
    targets.forEach((t, index) => {
      const x = startX + index * spacing;
      const y = 446;
      const bounds = new Phaser.Geom.Rectangle(x - 80, y - 74, 160, 150);
      const glow = this.add.rectangle(x, y, 168, 158, 0xffc857, 0).setDepth(8).setBlendMode(Phaser.BlendModes.ADD);
      const panel = this.add.rectangle(x, y, 160, 150, 0x16243a, 0.84).setStrokeStyle(4, 0xffc857, 0.85).setDepth(9);
      let icon: Phaser.GameObjects.Image | null = null;
      if (hasTexture(this, t.icon)) {
        this.add.circle(x, y - 8, 42, 0xf2f0e6, 0.12).setBlendMode(Phaser.BlendModes.ADD).setDepth(9); // soft backing so low-contrast icons pop
        icon = this.add.image(x, y - 8, t.icon).setDisplaySize(80, 80).setDepth(10);
      }
      this.add.text(x, y + 52, t.label, { fontFamily: FONTS.display, fontSize: '17px', color: '#FFE2A6', fontStyle: 'bold', stroke: '#2A1606', strokeThickness: 4 }).setOrigin(0.5).setDepth(11);
      panel.setInteractive({ useHandCursor: true }).on('pointerup', () => !isMissionExitOpen(this) && this.attempt(t.id));
      registerE2EButton({ testId: `${this.missionId}.target.${t.id}`, label: t.label, sceneKey: this.scene.key, press: () => this.attempt(t.id) });
      this.targets.push({ id: t.id, x, bounds, glow, panel, icon });
    });
  }

  private wireDrag(): void {
    this.input.on('dragstart', () => {
      if (this.done) return;
      this.prompt.setDepth(40);
      if (motionAllowed()) this.tweens.add({ targets: this.prompt, scale: this.promptBase * 1.12, duration: 110, ease: 'Quad.easeOut' });
    });
    this.input.on('drag', (_p: Phaser.Input.Pointer, obj: Phaser.GameObjects.GameObject, dragX: number, dragY: number) => {
      if (this.done || obj !== this.prompt) return;
      this.prompt.setPosition(dragX, dragY);
      this.targets.forEach((t) => t.panel.setScale(Phaser.Geom.Rectangle.Contains(t.bounds, dragX, dragY) ? 1.06 : 1));
    });
    this.input.on('dragend', () => {
      if (this.done) return;
      this.targets.forEach((t) => t.panel.setScale(1));
      const hit = this.targets.find((t) => Phaser.Geom.Rectangle.Contains(t.bounds, this.prompt.x, this.prompt.y));
      if (hit) this.attempt(hit.id);
      else this.springHome();
    });
  }

  private attempt(targetId: string | undefined): void {
    if (!targetId || this.done) return;
    const targetView = this.targets.find((t) => t.id === targetId);
    const outcome = chooseMatch(this.state, targetId);
    this.state = outcome.state;

    if (!outcome.correct) {
      getSfx().play('try-again');
      this.hint.setText(outcome.state.lastHint ?? 'Almost — try the glowing one.');
      this.guideWrong(targetView, outcome.state.currentPrompt?.correctTargetId);
      this.springHome();
      return;
    }

    getSfx().play('correct');
    this.hint.setText('');
    this.updatePips();
    if (targetView) {
      Juice.punch(this, targetView.panel, 1.1, 110);
      Juice.burst(this, targetView.x, targetView.bounds.y, { color: 0xffe2a6, count: 8 });
      this.flyAway(targetView);
    }

    if (outcome.completed) {
      this.done = true;
      this.time.delayedCall(motionAllowed() ? 300 : 0, () => completeMission(this, getMatchResult(this.state, this.missionId, this.stickerId)));
      return;
    }
    this.loadPrompt();
  }

  // Guide the eye wrong→right (P2-04): the mistapped panel shakes + dims; at the same instant the
  // CORRECT glowing target pulses bigger and bounces its icon, so the answer physically announces
  // itself. Never blocks (No-Fail) — the prompt still springs home and stays tappable.
  private guideWrong(wrong: TargetView | undefined, correctTargetId: string | undefined): void {
    if (wrong && motionAllowed()) {
      Juice.shake(this, 90, 0.003);
      Juice.squashStretch(this, wrong.panel, 0.16, 120);
      this.tweens.add({ targets: wrong.panel, alpha: 0.55, duration: 120, yoyo: true, ease: 'Quad.easeOut' });
    }
    const right = correctTargetId ? this.targets.find((t) => t.id === correctTargetId) : undefined;
    if (!right) return;
    if (motionAllowed()) {
      Juice.punch(this, right.panel, 1.18, 200);
      this.tweens.add({ targets: right.glow, alpha: 0.5, duration: 200, yoyo: true, ease: 'Sine.easeInOut' });
      if (right.icon) Juice.punch(this, right.icon, 1.22, 220);
    }
  }

  private flyAway(target: TargetView): void {
    if (!motionAllowed()) return;
    const ghost = this.add.image(this.prompt.x, this.prompt.y, this.prompt.texture.key).setDisplaySize(104, 104).setDepth(31);
    this.tweens.add({ targets: ghost, x: target.x, y: target.bounds.y + 70, scale: 0, angle: 200, duration: 320, ease: 'Quad.easeIn', onComplete: () => ghost.destroy() });
  }

  private loadPrompt(): void {
    const current = this.state.currentPrompt;
    if (!current) {
      completeMission(this, getMatchResult(this.state, this.missionId, this.stickerId));
      return;
    }
    this.prompt.setTexture(current.icon).setDisplaySize(104, 104).setPosition(HOME.x, HOME.y).setAngle(0).setDepth(30);
    this.promptBase = this.prompt.scale;
    this.telegraph(current.correctTargetId);
    if (motionAllowed()) {
      this.prompt.setScale(0);
      this.tweens.add({ targets: this.prompt, scale: this.promptBase, duration: 320, ease: 'Back.easeOut' });
    }
  }

  private telegraph(targetId: string): void {
    this.targets.forEach((t) => {
      this.tweens.killTweensOf(t.glow);
      t.glow.setAlpha(0);
      if (t.id === targetId && motionAllowed()) this.tweens.add({ targets: t.glow, alpha: 0.22, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
      else if (t.id === targetId) t.glow.setAlpha(0.18);
    });
  }

  private springHome(): void {
    if (!motionAllowed()) {
      this.prompt.setPosition(HOME.x, HOME.y);
      return;
    }
    this.tweens.add({ targets: this.prompt, x: HOME.x, y: HOME.y, scale: this.promptBase, duration: 360, ease: 'Back.easeOut' });
  }

  private updatePips(): void {
    this.pips.forEach((pip, i) => {
      const done = i < this.state.solved;
      pip.setFillStyle(done ? 0xffc857 : 0x3a4a66);
      if (done && motionAllowed()) Juice.punch(this, pip, 1.4, 120);
    });
  }

  private moveSelection(delta: number): void {
    if (!delta || this.done) return;
    this.selected = Math.max(0, Math.min(this.targets.length - 1, this.selected + delta));
  }

  private requestExit(): void {
    confirmMissionExit(this, () => returnToTownMap(this));
  }
}
