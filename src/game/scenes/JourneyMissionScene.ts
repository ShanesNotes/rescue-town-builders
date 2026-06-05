import Phaser from 'phaser';
import { fadeInScene } from '../systems/SceneTransitions';
import { journeyMissions, type JourneyWaypoint } from '../data/journeyMissions';
import { getSfx } from '../systems/GameServices';
import { bindIntents } from '../systems/bindIntents';
import { registerE2EButton, isE2EEnabled } from '../systems/E2EBridge';
import { Juice } from '../systems/Juice';
import { completeMission, returnToTownMap } from '../systems/SceneNavigation';
import { confirmMissionExit, isMissionExitOpen } from '../systems/confirmMissionExit';
import { chooseMatch, createMatchState, getMatchResult, type MatchPrompt, type MatchState, type MatchTarget } from '../systems/MatchEngine';
import { addIconButton } from '../ui/Button';
import { FONTS } from '../ui/typography';
import { hasTexture, motionAllowed } from '../ui/Sprite';
import { playMissionIntro } from '../ui/MissionIntro';
import { missionRegistry } from '../systems/GameServices';
import { createSecretsForProfile, addSecretHotspot } from '../systems/secretHotspot';
import type { SecretId } from '../systems/Secrets';
import type { MissionId } from '../types';

// One gentle off-route glimmer per Journey backdrop (P3-08), tucked in a quiet corner away from
// the waypoint route so it rewards a child who wanders a little. Reachable now that touch counts
// persist (P1-07) and each tap charges (P2-08).
const JOURNEY_SECRETS: Partial<Record<MissionId, { id: SecretId; x: number; y: number }>> = {
  'scooter-roundup': { id: 'meadow-nest', x: 110, y: 180 },
  'safety-lights': { id: 'lamplighter', x: 110, y: 470 },
  'bike-explorer': { id: 'garden-cat', x: 110, y: 200 },
  'treasure-boat': { id: 'message-bottle', x: 130, y: 200 },
};

// One reusable scene for every Journey mission (Scooter Roundup, Safety Lights, Bike Explorer,
// Treasure Boat). Tap the next glowing waypoint; the hero travels there; reaching the last
// completes. Sequential on MatchEngine logic; No-Fail (a not-yet waypoint only hints).
export class JourneyMissionScene extends Phaser.Scene {
  private missionId: MissionId = 'scooter-roundup';
  private state!: MatchState;
  private stickerId = '';
  private waypoints: JourneyWaypoint[] = [];
  private markers = new Map<string, Phaser.GameObjects.Image>();
  private glows = new Map<string, Phaser.GameObjects.Arc>();
  private hero!: Phaser.GameObjects.Image;
  private heroShadow!: Phaser.GameObjects.Ellipse;
  private pips: Phaser.GameObjects.Arc[] = [];
  private hint!: Phaser.GameObjects.Text;
  private done = false;
  private busy = false; // input lock while the hero auto-walks/travels (no mid-anim skip — P3-10)
  private cursor!: Phaser.GameObjects.Arc;
  private highlightIndex = 0;
  private finalGlow: Phaser.GameObjects.Arc | null = null;

  constructor() {
    super('JourneyMissionScene');
  }

  init(data: { missionId?: MissionId }): void {
    this.missionId = data.missionId ?? 'scooter-roundup';
  }

  create(): void {
    fadeInScene(this);
    const cfg = journeyMissions[this.missionId];
    if (!cfg) {
      returnToTownMap(this);
      return;
    }
    this.stickerId = cfg.stickerId;
    this.waypoints = cfg.waypoints;
    this.markers = new Map();
    this.glows = new Map();
    this.pips = [];
    this.done = false;
    this.busy = false;
    this.finalGlow = null;

    const targets: MatchTarget[] = cfg.waypoints.map((w) => ({ id: w.id, label: w.label, icon: cfg.waypointKey }));
    const prompts: MatchPrompt[] = cfg.waypoints.map((w, i) => ({ id: `go-${i}`, label: w.label, icon: cfg.waypointKey, correctTargetId: w.id }));
    this.state = createMatchState(targets, prompts);

    this.add.image(480, 270, hasTexture(this, cfg.backdrop) ? cfg.backdrop : 'hl.bg.town').setDisplaySize(960, 540).setDepth(0);
    this.add.rectangle(480, 270, 960, 540, 0x101b2e, 0.2).setDepth(1);
    this.add.rectangle(480, 28, 960, 64, 0x101b2e, 0.4).setDepth(1);

    this.buildPips(cfg.waypoints.length);

    cfg.waypoints.forEach((w, i) => {
      const isFinal = i === cfg.waypoints.length - 1;
      const key = isFinal && cfg.finalKey && hasTexture(this, cfg.finalKey) ? cfg.finalKey : cfg.waypointKey;
      // The destination reads as THE goal from the start: a larger marker with a permanent warm halo.
      const glowRadius = isFinal ? 80 : 62;
      const glow = this.add.circle(w.x, w.y, glowRadius, 0xffd98a, 0).setBlendMode(Phaser.BlendModes.ADD).setDepth(9);
      const img = this.add.image(w.x, w.y, hasTexture(this, key) ? key : 'hl.prop.star').setDisplaySize(isFinal ? 92 : 70, isFinal ? 92 : 70).setDepth(10);
      img.setInteractive({ useHandCursor: true }).on('pointerup', () => !isMissionExitOpen(this) && this.visit(w.id));
      registerE2EButton({ testId: `${this.missionId}.waypoint.${w.id}`, label: w.label, sceneKey: this.scene.key, press: () => this.visit(w.id) });
      this.markers.set(w.id, img);
      this.glows.set(w.id, glow);
      if (isFinal) {
        this.finalGlow = this.add.circle(w.x, w.y, 96, 0xffc857, 0.12).setBlendMode(Phaser.BlendModes.ADD).setDepth(8);
        if (motionAllowed()) this.tweens.add({ targets: this.finalGlow, alpha: 0.24, scale: 1.1, duration: 1100, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
      }
      this.add.text(w.x, w.y + (isFinal ? 58 : 48), w.label, { fontFamily: FONTS.display, fontSize: isFinal ? '17px' : '15px', color: '#FFE2A6', fontStyle: 'bold', stroke: '#2A1606', strokeThickness: 3 }).setOrigin(0.5).setDepth(11);
    });

    this.heroShadow = this.add.ellipse(cfg.start.x, cfg.start.y + 2, 64, 16, 0x0a1322, 0.5).setDepth(13);
    this.hero = this.add.image(cfg.start.x, cfg.start.y, hasTexture(this, `hl.char.${cfg.characterId}`) ? `hl.char.${cfg.characterId}` : 'hl.char.rivet').setOrigin(0.5, 1).setDisplaySize(92, 92).setDepth(14);

    // Keyboard/gamepad cursor ring — shows which stop d-pad/arrows have highlighted, so confirm
    // visits THAT stop (not always the correct id). Pointer children never need it.
    this.cursor = this.add.circle(0, 0, 50, 0x000000, 0).setStrokeStyle(5, 0x9be7ff, 1).setDepth(12).setVisible(false);

    this.hint = this.add
      .text(480, 92, 'Tap the glowing stop!', { fontFamily: FONTS.display, fontSize: '18px', color: '#FFE2A6', stroke: '#2A1606', strokeThickness: 4 })
      .setOrigin(0.5)
      .setDepth(30);

    addIconButton(this, { x: 52, y: 46, size: 56, key: 'hl.ui.back', onPress: () => this.requestExit(), testId: `${this.missionId}.back-to-map` }).setDepth(40);

    // A quiet off-route glimmer for the wanderer (P3-08). Touch counts persist across reloads.
    const secret = JOURNEY_SECRETS[this.missionId];
    if (secret) addSecretHotspot(this, createSecretsForProfile(), secret.id, secret.x, secret.y);

    bindIntents(this, {
      onMove: (x, y) => !isMissionExitOpen(this) && this.moveHighlight(x || y),
      onConfirm: () => !isMissionExitOpen(this) && this.visitHighlighted(),
      onBack: () => this.requestExit(),
    });

    this.render();

    const panel = missionRegistry.get(this.missionId)?.introPanels[0];
    if (panel) playMissionIntro(this, panel, () => undefined);
  }

  private buildPips(total: number): void {
    const gap = 28;
    const startX = 480 - ((total - 1) * gap) / 2;
    for (let i = 0; i < total; i += 1) {
      this.pips.push(this.add.circle(startX + i * gap, 40, 7, 0x3a4a66).setStrokeStyle(2, 0x1b2a41).setDepth(20));
    }
  }

  // Keyboard/gamepad: cycle the highlight cursor through the remaining (unvisited) stops only.
  private moveHighlight(delta: number): void {
    if (delta === 0 || this.done) return;
    const next = this.state.currentIndex;
    const last = this.waypoints.length - 1;
    this.highlightIndex = Math.max(next, Math.min(last, this.highlightIndex + delta));
    this.positionCursor();
  }

  // Confirm visits the HIGHLIGHTED stop — not always the correct id. Wrong picks still No-Fail-hint.
  private visitHighlighted(): void {
    const wp = this.waypoints[Math.max(this.state.currentIndex, this.highlightIndex)];
    if (wp) this.visit(wp.id);
  }

  private positionCursor(): void {
    const wp = this.waypoints[this.highlightIndex];
    if (!wp) {
      this.cursor.setVisible(false);
      return;
    }
    this.cursor.setPosition(wp.x, wp.y).setVisible(true);
  }

  private visit(waypointId: string): void {
    // P3-10: while the hero is auto-walking/travelling, ignore taps so a fast tapper can't skip the
    // animation (mirrors MatchMissionScene's busy lock). Not a No-Fail issue — just animation safety.
    if (!waypointId || this.done || this.busy) return;
    const outcome = chooseMatch(this.state, waypointId);
    this.state = outcome.state;

    if (!outcome.correct) {
      getSfx().play('try-again');
      this.hint.setText('Almost — tap the glowing stop.');
      // After a couple of wrong stops, escalate so the next stop is unmistakable (P1-09).
      if (outcome.assistLevel >= 1) this.escalateNextStop();
      return;
    }

    // No-Fail floor (P1-09): the hero auto-walks to the correct next stop, placing it for the child.
    getSfx().play(outcome.autoResolved ? 'place' : 'correct');
    this.hint.setText('');
    // Lock input for the duration of the travel animation (released when it lands / on completion).
    this.busy = true;
    // The just-resolved stop is the prompt before the new currentIndex (auto-resolve advances state).
    const resolvedId = this.state.prompts[this.state.currentIndex - 1]?.correctTargetId ?? waypointId;
    const wp = this.waypoints.find((w) => w.id === resolvedId);
    if (wp) this.travelTo(wp, outcome.autoResolved, outcome.completed);

    if (outcome.completed) {
      this.done = true;
      // The final arrival earns a longer beat to let the climax (chest open + hero hop + chime) land.
      this.time.delayedCall(motionAllowed() ? 900 : 0, () => completeMission(this, getMatchResult(this.state, this.missionId, this.stickerId)));
      return;
    }
    // Hold the lock through the walk tween (travelTo animates ~420ms), then re-open input + redraw.
    // INSTANT under e2e (and reduced motion): release immediately so specs/tappers never wait (P3-10).
    const lockMs = isE2EEnabled() || !motionAllowed() ? 0 : 420;
    if (lockMs === 0) {
      this.busy = false;
      this.render();
    } else {
      this.time.delayedCall(lockMs, () => {
        this.busy = false;
        this.render();
      });
    }
  }

  // Escalated telegraph (P1-09): brighten the next stop and dim the rest so a stuck child sees it.
  private escalateNextStop(): void {
    const next = this.state.currentIndex;
    this.waypoints.forEach((w, i) => {
      const glow = this.glows.get(w.id);
      const marker = this.markers.get(w.id);
      if (!glow || !marker) return;
      if (i === next) {
        this.tweens.killTweensOf(glow);
        glow.setAlpha(motionAllowed() ? 0.5 : 0.7);
        if (motionAllowed()) {
          this.tweens.add({ targets: glow, alpha: 0.85, duration: 480, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
          Juice.punch(this, marker, 1.2, 220);
        }
      } else if (i > next) {
        marker.setAlpha(0.5);
      }
    });
  }

  private travelTo(wp: JourneyWaypoint, assisted = false, isFinal = false): void {
    const marker = this.markers.get(wp.id);
    if (isFinal) {
      this.arriveAtDestination(wp, marker);
      return;
    }
    // Auto-resolve gets a warmer 'a friend helped' burst so the No-Fail mercy reads as a gift.
    Juice.burst(this, wp.x, wp.y, { color: 0xffe2a6, count: assisted ? 12 : 7, radius: assisted ? 52 : 34 });
    if (marker) Juice.punch(this, marker, assisted ? 1.24 : 1.16, assisted ? 200 : 130);
    if (!motionAllowed()) {
      this.hero.setPosition(wp.x, wp.y + 30);
      this.heroShadow.setPosition(wp.x, wp.y + 32);
      return;
    }
    this.tweens.add({ targets: this.hero, x: wp.x, y: wp.y + 30, duration: 420, ease: 'Sine.easeInOut' });
    this.tweens.add({ targets: this.heroShadow, x: wp.x, y: wp.y + 32, duration: 420, ease: 'Sine.easeInOut' });
  }

  // The climax (P3-06): arriving at THE destination is bigger than any stop — a gold burst, the
  // finalKey marker squash-stretches open (the chest 'opens'), the hero hops, and a rising chime rings.
  private arriveAtDestination(wp: JourneyWaypoint, marker: Phaser.GameObjects.Image | undefined): void {
    getSfx().play('fanfare'); // an ascending C-E-G-C — the rising 'you made it' chime
    Juice.burst(this, wp.x, wp.y, { color: 0xffc857, count: 22, radius: 72 });
    Juice.burst(this, wp.x, wp.y, { color: 0xffe2a6, count: 14, radius: 44 });
    if (this.finalGlow && motionAllowed()) {
      this.tweens.killTweensOf(this.finalGlow);
      this.finalGlow.setAlpha(0.4);
      this.tweens.add({ targets: this.finalGlow, scale: 1.7, alpha: 0, duration: 760, ease: 'Quad.easeOut' });
    }
    if (!motionAllowed()) {
      this.hero.setPosition(wp.x, wp.y + 30);
      this.heroShadow.setPosition(wp.x, wp.y + 32);
      if (marker) marker.setScale(marker.scale * 1.12);
      return;
    }
    // Hero walks the last leg, then hops with joy at the destination.
    this.tweens.add({ targets: this.hero, x: wp.x, y: wp.y + 30, duration: 420, ease: 'Sine.easeInOut', onComplete: () => {
      this.tweens.add({ targets: this.hero, y: wp.y + 8, duration: 220, yoyo: true, repeat: 1, ease: 'Quad.easeOut' });
    } });
    this.tweens.add({ targets: this.heroShadow, x: wp.x, y: wp.y + 32, duration: 420, ease: 'Sine.easeInOut' });
    // The chest/door 'opens': squash-stretch + a celebratory grow-settle.
    if (marker) {
      Juice.squashStretch(this, marker, 0.24, 200);
      this.tweens.add({ targets: marker, scale: marker.scale * 1.22, duration: 260, delay: 200, yoyo: true, ease: 'Back.easeOut' });
    }
  }

  // Visited stops stay lit; the next stop glows; future stops wait dim.
  private render(): void {
    const next = this.state.currentIndex;
    // Keep the keyboard/gamepad highlight on (or ahead of) the next stop after each visit.
    this.highlightIndex = Math.max(next, this.highlightIndex);
    this.positionCursor();
    this.waypoints.forEach((w, i) => {
      const marker = this.markers.get(w.id);
      const glow = this.glows.get(w.id);
      if (!marker || !glow) return;
      this.tweens.killTweensOf(glow);
      if (i < next) {
        // A passed stop must never fire the wrong-answer bonk (P2-05): drop its interactivity.
        marker.disableInteractive();
        marker.clearTint().setAlpha(1);
        glow.setAlpha(0);
      } else if (i === next) {
        marker.clearTint().setAlpha(1);
        if (motionAllowed()) {
          this.tweens.add({ targets: glow, alpha: 0.6, duration: 750, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
          this.tweens.add({ targets: marker, scale: marker.scale * 1.12, duration: 750, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
        } else {
          glow.setAlpha(0.45);
        }
      } else {
        marker.setTint(0x9aa6c8).setAlpha(0.78);
        glow.setAlpha(0);
      }
    });
    this.pips.forEach((pip, i) => pip.setFillStyle(i < this.state.solved ? 0xffc857 : 0x3a4a66));
  }

  private requestExit(): void {
    confirmMissionExit(this, () => returnToTownMap(this));
  }
}
