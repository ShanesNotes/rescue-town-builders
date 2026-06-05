import Phaser from 'phaser';
import { fadeInScene } from '../systems/SceneTransitions';
import { SCENE_KEYS, returnToParentScene, startScene, type ParentSettingsReturnScene } from '../systems/SceneNavigation';
import { bindIntents } from '../systems/bindIntents';
import { addIconButton } from '../ui/Button';
import { FONTS } from '../ui/typography';
import { motionAllowed } from '../ui/Sprite';
import { createHoldGate } from '../ui/HoldGate';

// A child-safe wall, parent-only passage: hold for 3 seconds (a young child won't sustain it).
export class ParentSettingsGateScene extends Phaser.Scene {
  private returnScene: ParentSettingsReturnScene = SCENE_KEYS.profile;
  private status!: Phaser.GameObjects.Text;
  private fill!: Phaser.GameObjects.Arc;

  constructor() {
    super('ParentSettingsGateScene');
  }

  init(data: { returnScene?: ParentSettingsReturnScene }): void {
    this.returnScene = data.returnScene ?? SCENE_KEYS.profile;
  }

  create(): void {
    fadeInScene(this);
    this.add.image(480, 270, 'hl.bg.town').setDisplaySize(960, 540).setDepth(0);
    this.add.rectangle(480, 270, 960, 540, 0x101b2e, 0.6).setDepth(1);

    this.add
      .text(480, 96, 'GROWN-UP GATE', { fontFamily: FONTS.display, fontSize: '36px', color: '#FFE2A6', fontStyle: 'bold', stroke: '#2A1606', strokeThickness: 7 })
      .setOrigin(0.5)
      .setDepth(10);
    this.add
      .text(480, 150, 'Grown-ups: hold the coin for 3 seconds.', { fontFamily: FONTS.display, fontSize: '20px', color: '#EBDDDA', align: 'center' })
      .setOrigin(0.5)
      .setDepth(10);

    // The hold coin + a ring that fills as it's held.
    this.add.circle(480, 290, 84, 0x16243a, 0.92).setStrokeStyle(5, 0xffc857).setDepth(5);
    this.fill = this.add.circle(480, 290, 78, 0xffc857, 0.32).setScale(0).setDepth(6);
    const key = this.add.text(480, 290, '⚿', { fontFamily: FONTS.display, fontSize: '54px', color: '#FFE2A6' }).setOrigin(0.5).setDepth(7);
    const hit = this.add.circle(480, 290, 92, 0xffffff, 0.001).setDepth(8).setInteractive({ useHandCursor: true });
    if (motionAllowed()) this.tweens.add({ targets: key, scale: 1.06, duration: 1200, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

    this.status = this.add
      .text(480, 410, 'Hold to begin. Let go to cancel.', { fontFamily: FONTS.label, fontSize: '15px', color: '#9DB4C0', align: 'center' })
      .setOrigin(0.5)
      .setDepth(10);

    addIconButton(this, { x: 52, y: 46, size: 56, key: 'hl.ui.back', onPress: () => returnToParentScene(this, this.returnScene), testId: 'parent.gate.back' }).setDepth(40);

    // Back-intent only — confirm must NOT start the hold (a single key/gamepad press would walk
    // through). The sustained-hold controller owns all down/up parity across pointer/keyboard/pad.
    bindIntents(this, { onBack: () => returnToParentScene(this, this.returnScene) });
    createHoldGate({
      scene: this,
      hit,
      fill: this.fill,
      durationMs: 3000,
      onStart: () => this.status.setText('Holding... keep going.'),
      onCancel: () => this.status.setText('Cancelled. Ready when you are.'),
      onComplete: () => startScene(this, SCENE_KEYS.parentSettings, { returnScene: this.returnScene }),
    });
  }
}
