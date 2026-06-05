import Phaser from 'phaser';
import { fadeInScene } from '../systems/SceneTransitions';
import { matchMissions } from '../data/matchMissions';
import { getSfx, getVoice } from '../systems/GameServices';
import { missionStartVoiceKey } from '../data/voiceLines';
import { bindIntents } from '../systems/bindIntents';
import { registerE2EButton } from '../systems/E2EBridge';
import { Juice } from '../systems/Juice';
import { completeMission, returnToTownMap } from '../systems/SceneNavigation';
import { confirmMissionExit, isMissionExitOpen } from '../systems/confirmMissionExit';
import { isOverlayOpen } from '../systems/overlayLock';
import { chooseMatch, createMatchState, getMatchResult, type MatchState } from '../systems/MatchEngine';
import type { MatchPayoff } from '../data/matchMissions';
import { addIconButton } from '../ui/Button';
import { bindPress } from '../ui/press';
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
  private focusRing!: Phaser.GameObjects.Rectangle; // CF-5: visible keyboard/gamepad selection
  private pips: Phaser.GameObjects.Arc[] = [];
  private hint!: Phaser.GameObjects.Text;
  private selected = 0;
  private done = false;
  private helper: Phaser.GameObjects.Image | null = null;
  private helperHome = { x: 866, y: 360 };
  private busy = false; // input lock while the No-Fail helper places the answer (no mid-anim double-tap)
  private payoff: MatchPayoff | null = null;
  private bowl: Phaser.GameObjects.Arc | null = null; // recipe-progress fill (Bread Rush)
  private bowlBase = 0;
  private bowlSteps = 0;
  private recipeTotal = 0;

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
    this.busy = false;
    this.bowl = null;
    this.bowlSteps = 0;
    this.recipeTotal = 0;

    this.add.image(480, 270, hasTexture(this, cfg.backdrop) ? cfg.backdrop : 'hl.bg.town').setDisplaySize(960, 540).setDepth(0);
    this.add.rectangle(480, 270, 960, 540, 0x101b2e, 0.22).setDepth(1);
    this.add.rectangle(480, 30, 960, 70, 0x101b2e, 0.4).setDepth(1);

    this.buildPips(cfg.prompts.length);

    this.add.ellipse(866, 360, 70, 18, 0x0a1322, 0.5).setDepth(9);
    this.helper = hasTexture(this, `hl.char.${cfg.characterId}`)
      ? this.add.image(866, 360, `hl.char.${cfg.characterId}`).setOrigin(0.5, 1).setDisplaySize(96, 96).setDepth(10)
      : null;

    this.buildTargets(cfg.targets, cfg.shuffleTargets ?? false);
    // CF-5: a visible focus ring so a keyboard/gamepad child sees which target is selected. Hidden
    // until they actually move with arrows/d-pad (pointer/touch never needs it).
    this.focusRing = this.add.rectangle(0, 446, 182, 172, 0x000000, 0).setStrokeStyle(6, 0xffe27a, 1).setDepth(12).setVisible(false);
    this.payoff = cfg.payoff ?? null;
    if (cfg.recipeBowl) this.buildRecipeBowl(cfg.prompts.length);

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
      onMove: (x, y) => !this.overlayBusy() && this.moveSelection(x || y),
      onConfirm: () => !this.overlayBusy() && this.attempt(this.targets[this.selected]?.id),
      onBack: () => !isOverlayOpen(this) && this.requestExit(),
    });

    this.loadPrompt();

    const mission = missionRegistry.get(this.missionId);
    const panel = mission?.introPanels[0];
    // The warm archetype mission-start line is spoken when the intro veil lifts (P4-02).
    const speakStart = (): void => getVoice().speak(missionStartVoiceKey(mission?.archetype));
    if (panel) playMissionIntro(this, panel, speakStart);
    else speakStart();
  }

  private buildPips(total: number): void {
    const gap = 26;
    const startX = 480 - ((total - 1) * gap) / 2;
    for (let i = 0; i < total; i += 1) {
      this.pips.push(this.add.circle(startX + i * gap, 40, 7, 0x3a4a66).setStrokeStyle(2, 0x1b2a41).setDepth(20));
    }
  }

  private buildTargets(targets: { id: string; label: string; icon: string }[], shuffleRow: boolean): void {
    // Recipe missions keep their prompt ORDER but shuffle WHERE each ingredient sits in the row, so a
    // child can't win on tap-position memory — they must read the icon (P2-10).
    const placed = shuffleRow ? shuffled(targets) : targets;
    const spacing = Math.min(190, 780 / placed.length);
    const startX = 480 - ((placed.length - 1) * spacing) / 2;
    placed.forEach((t, index) => {
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
      panel.setInteractive({ useHandCursor: true });
      bindPress(panel, { onConfirm: () => !isMissionExitOpen(this) && this.attempt(t.id) });
      registerE2EButton({ testId: `${this.missionId}.target.${t.id}`, label: t.label, sceneKey: this.scene.key, press: () => this.attempt(t.id) });
      this.targets.push({ id: t.id, x, bounds, glow, panel, icon });
    });
  }

  // A mixing bowl by the baker that visibly FILLS with each correct ingredient, so the ordered recipe
  // earns a payoff (P2-10). Pure shapes — no new art. The final add bakes it into a golden loaf.
  private buildRecipeBowl(total: number): void {
    const bx = 838;
    const by = 188;
    this.add.ellipse(bx, by + 26, 96, 22, 0x0a1322, 0.4).setDepth(13);
    this.add.arc(bx, by, 50, 0, 180, false, 0xe8d4a8, 1).setDepth(14); // bowl shell
    this.add.arc(bx, by, 50, 0, 180, false).setStrokeStyle(4, 0x8a6a3c).setDepth(16);
    this.bowl = this.add.circle(bx, by, 4, 0xf4c97a, 0).setDepth(15); // the rising dough fill
    this.bowlBase = 4;
    this.add
      .text(bx, by + 40, 'Recipe bowl', { fontFamily: FONTS.display, fontSize: '14px', color: '#FFE2A6', stroke: '#2A1606', strokeThickness: 3 })
      .setOrigin(0.5)
      .setDepth(16);
    this.recipeTotal = total;
  }

  private fillRecipeBowl(): void {
    if (!this.bowl) return;
    this.bowlSteps += 1;
    const isLoaf = this.bowlSteps >= this.recipeTotal;
    const radius = this.bowlBase + (44 * this.bowlSteps) / Math.max(1, this.recipeTotal);
    this.bowl.setRadius(radius).setFillStyle(isLoaf ? 0xe0a04a : 0xf4c97a, 1);
    if (motionAllowed()) {
      Juice.squashStretch(this, this.bowl, 0.2, 150);
      Juice.burst(this, this.bowl.x, this.bowl.y, { color: 0xffe2a6, count: isLoaf ? 14 : 6, radius: isLoaf ? 50 : 30 });
    }
    if (isLoaf) {
      // Bake: the fill becomes a rounded golden loaf with a little hop.
      const loaf = this.add.ellipse(this.bowl.x, this.bowl.y - 6, 78, 48, 0xd98a3a, 1).setStrokeStyle(4, 0x8a4a1c).setDepth(17);
      if (motionAllowed()) this.tweens.add({ targets: loaf, y: loaf.y - 14, duration: 260, yoyo: true, ease: 'Back.easeOut' });
    }
  }

  // Per-mission 'lands and transforms' payoff on the matched target (P3-07). Reuses the target's own
  // art + a themed tint/tween/particle beat so each Match mission feels distinct (no new assets).
  private playPayoff(target: TargetView): void {
    const theme = this.payoff;
    if (!theme) {
      // Default flourish (unchanged feel) when a mission has no payoff theme.
      Juice.punch(this, target.panel, 1.1, 110);
      Juice.burst(this, target.x, target.bounds.y, { color: 0xffe2a6, count: 8 });
      this.flyAway(target);
      return;
    }
    const ty = target.bounds.y + 70;
    getSfx().play('place');
    Juice.burst(this, target.x, ty, { color: theme.color, count: 14, radius: 56 });
    if (!motionAllowed()) {
      target.glow.setAlpha(0.5);
      if (target.icon) target.icon.clearTint();
      return;
    }
    Juice.punch(this, target.panel, 1.16, 160);
    // The target lights up in its accent color, then settles.
    this.tweens.add({ targets: target.glow, alpha: 0.7, duration: 200, yoyo: true, ease: 'Sine.easeInOut' });

    switch (theme.kind) {
      case 'plinth': {
        // Engraved plinth lights and a tiny statue pops up off it with a cluck.
        if (target.icon) {
          target.icon.setScale(0);
          this.tweens.add({ targets: target.icon, scale: 80 / target.icon.width, y: target.bounds.y + 62 - 8, duration: 360, ease: 'Back.easeOut', onComplete: () => this.tweens.add({ targets: target.icon, y: target.bounds.y + 62, duration: 160, ease: 'Quad.easeOut' }) });
        }
        break;
      }
      case 'gadget': {
        // The gadget slot fills with the spinning part + a whirr.
        if (target.icon) {
          this.tweens.add({ targets: target.icon, angle: target.icon.angle + 360, duration: 520, ease: 'Cubic.easeOut' });
          Juice.squashStretch(this, target.icon, 0.18, 180);
        }
        break;
      }
      case 'pour': {
        // Flour/ingredient pours into the growing bowl off to the side.
        this.fillRecipeBowl();
        if (target.icon) Juice.punch(this, target.icon, 1.2, 200);
        break;
      }
      case 'mirror': {
        // Inverse: the answer flips bright (a dream becomes its opposite).
        if (target.icon) {
          this.tweens.add({ targets: target.icon, scaleX: -(80 / target.icon.width), duration: 220, yoyo: true, ease: 'Sine.easeInOut' });
        }
        break;
      }
    }
    // The prompt still flies onto the target as before so the gesture reads "it landed here".
    this.flyAway(target);
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
    if (!targetId || this.done || this.busy) return;
    const targetView = this.targets.find((t) => t.id === targetId);
    const outcome = chooseMatch(this.state, targetId);
    this.state = outcome.state;

    if (!outcome.correct) {
      getSfx().play('try-again');
      this.hint.setText(outcome.state.lastHint ?? 'Almost — try the glowing one.');
      this.guideWrong(targetView, outcome.state.currentPrompt?.correctTargetId);
      // After a couple of misses on the SAME prompt, escalate the telegraph so the answer can't be
      // missed: brighten the correct target, dim the rest (P1-09).
      if (outcome.assistLevel >= 1) this.escalateTelegraph(outcome.state.currentPrompt?.correctTargetId);
      this.springHome();
      return;
    }

    getSfx().play(outcome.autoResolved ? 'place' : 'correct');
    this.hint.setText('');
    this.resetPanels(); // CF-4: a successful resolve restores any escalation-dimmed valid choices
    this.updatePips();
    // The just-resolved prompt's correct target is the one BEFORE the new currentIndex.
    const resolvedTargetId = this.state.prompts[this.state.currentIndex - 1]?.correctTargetId;
    const placed = this.targets.find((t) => t.id === resolvedTargetId) ?? targetView;
    if (outcome.autoResolved) {
      // No-Fail floor: a child who can't read the answer is never stuck — the helper hops over and
      // places it for them, with the warm 'place' chime + sparkle (mirrors the Aim drone-assist).
      this.helperAssist(placed, outcome.completed);
      return;
    }
    if (placed) {
      // 'Lands and transforms' on the target (P3-07): each Match mission gets its own themed beat
      // (plinth lights + statue pop, gadget slot spins, bowl fills, inverse flips) — not the same tiny pop.
      this.playPayoff(placed);
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

  // Escalated telegraph (P1-09): once the child has missed this prompt a few times, make the answer
  // unmissable — the correct target glows bright and the wrong panels dim back.
  private escalateTelegraph(correctTargetId: string | undefined): void {
    this.targets.forEach((t) => {
      const right = t.id === correctTargetId;
      this.tweens.killTweensOf(t.glow);
      if (right) {
        t.glow.setAlpha(motionAllowed() ? 0.4 : 0.5);
        if (motionAllowed()) this.tweens.add({ targets: t.glow, alpha: 0.75, duration: 520, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
        if (motionAllowed()) Juice.punch(this, t.panel, 1.14, 220);
      } else {
        t.glow.setAlpha(0);
        if (motionAllowed()) this.tweens.add({ targets: t.panel, alpha: 0.5, duration: 220, ease: 'Quad.easeOut' });
        else t.panel.setAlpha(0.5);
      }
    });
  }

  // No-Fail floor (P1-09): the helper character hops to the answer, the prompt flies onto it with a
  // sparkle, then the helper waves home — the child sees a friend solve it for them, never a fail.
  private helperAssist(target: TargetView | undefined, completed: boolean): void {
    this.busy = true; // lock input until the answer is fully placed
    this.resetPanels(); // CF-4: undo any escalation dimming on panels AND icons
    if (this.payoff?.kind === 'pour') this.fillRecipeBowl(); // keep the recipe bowl rising even on a No-Fail assist
    const finish = (): void => {
      this.busy = false;
      if (completed) {
        this.done = true;
        completeMission(this, getMatchResult(this.state, this.missionId, this.stickerId));
      } else {
        this.loadPrompt();
      }
    };
    if (!target || !motionAllowed()) {
      if (target) {
        Juice.burst(this, target.x, target.bounds.y, { color: 0xffe2a6, count: 10 });
        target.glow.setAlpha(0.5);
      }
      this.prompt.setVisible(false);
      finish();
      return;
    }
    const helper = this.helper;
    if (!helper) {
      // No portrait — just fly the prompt over with a sparkle.
      this.flyAway(target);
      this.prompt.setVisible(false);
      Juice.burst(this, target.x, target.bounds.y, { color: 0xffe2a6, count: 10 });
      this.time.delayedCall(320, finish);
      return;
    }
    this.prompt.setVisible(false);
    helper.setDepth(33);
    // Hop the helper over to the target...
    this.tweens.add({ targets: helper, x: target.x, y: target.bounds.y + 64, duration: 320, ease: 'Sine.easeInOut' });
    this.tweens.add({ targets: helper, scaleY: helper.scaleY * 0.86, duration: 160, yoyo: true, ease: 'Quad.easeOut' });
    // ...fly the prompt icon onto it + sparkle + 'place' the answer.
    const ghost = this.add.image(this.prompt.x, this.prompt.y, this.prompt.texture.key).setDisplaySize(104, 104).setDepth(34);
    this.tweens.add({
      targets: ghost,
      x: target.x,
      y: target.bounds.y + 70,
      scale: 0.6,
      duration: 360,
      delay: 200,
      ease: 'Quad.easeIn',
      onComplete: () => {
        ghost.destroy();
        Juice.punch(this, target.panel, 1.18, 160);
        Juice.burst(this, target.x, target.bounds.y, { color: 0xffe2a6, count: 12, radius: 56 });
        target.glow.setAlpha(0.6);
        getSfx().play('correct');
        // Helper waves and hops home.
        this.tweens.add({ targets: helper, x: this.helperHome.x, y: this.helperHome.y, duration: 360, delay: 120, ease: 'Sine.easeInOut', onComplete: () => helper.setDepth(10) });
        this.time.delayedCall(260, finish);
      },
    });
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
    this.resetPanels(); // CF-4: every new prompt starts with all valid choices at full brightness
    this.prompt.setTexture(current.icon).setDisplaySize(104, 104).setPosition(HOME.x, HOME.y).setAngle(0).setDepth(30).setVisible(true);
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

  // CF-4: the assist-escalation dims wrong panels/icons; a resolve or the next prompt must restore
  // EVERY panel + icon to full so a valid choice is never left stranded dim. Kills any lingering dim
  // tween first so it can't fade a panel back down after we've reset it.
  private resetPanels(): void {
    this.targets.forEach((t) => {
      this.tweens.killTweensOf(t.panel);
      t.panel.setAlpha(1);
      if (t.icon) {
        this.tweens.killTweensOf(t.icon);
        t.icon.setAlpha(1);
      }
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
    this.paintFocus();
  }

  // CF-5: ring the currently-selected target (mirrors the shared ChoiceModal focus-ring pattern) so
  // keyboard/gamepad selection is never invisible. Pulses gently when motion is allowed.
  private paintFocus(): void {
    const target = this.targets[this.selected];
    if (!target) {
      this.focusRing.setVisible(false);
      return;
    }
    this.tweens.killTweensOf(this.focusRing);
    this.focusRing.setPosition(target.x, 446).setScale(1).setVisible(true);
    if (motionAllowed()) this.tweens.add({ targets: this.focusRing, scale: 1.05, duration: 600, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
  }

  // CF-1: ignore confirm/move while the intro veil covers the board or the exit modal is up — a
  // keyboard/gamepad press must never resolve a match the child can't see.
  private overlayBusy(): boolean {
    return isMissionExitOpen(this) || isOverlayOpen(this);
  }

  private requestExit(): void {
    confirmMissionExit(this, () => returnToTownMap(this));
  }
}
