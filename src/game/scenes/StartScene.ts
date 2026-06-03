import Phaser from 'phaser';
import { fadeInScene } from '../systems/SceneTransitions';
import { SCENE_KEYS, startScene } from '../systems/SceneNavigation';
import { inputIntentFromGamepadButton, inputIntentFromKeyboard } from '../systems/InputIntent';
import { getMusic } from '../systems/GameServices';
import { addButton } from '../ui/Button';

// Drawn in-engine as crisp sticker-book badges (palette from design.md) so the very first
// screen is reliable and never depends on async art loading.
const HELPERS = [
  { name: 'Rivet', x: 300, color: 0x5ec8b5 },
  { name: 'Brick', x: 480, color: 0xf4a261 },
  { name: 'Ember', x: 660, color: 0xf48a9e },
] as const;

export class StartScene extends Phaser.Scene {
  constructor() {
    super('StartScene');
  }

  create(): void {
    fadeInScene(this);
    this.cameras.main.setBackgroundColor('#d9f5ff');
    this.paintSky();

    // Title banner.
    this.add.rectangle(480, 96, 720, 110, 0xffffff, 0.75).setStrokeStyle(5, 0x9be7c4, 1);
    this.add
      .text(480, 78, 'Rescue Town\nBuilders', {
        fontFamily: 'Trebuchet MS, Arial, sans-serif',
        fontSize: '46px',
        color: '#1f6f4a',
        align: 'center',
        fontStyle: 'bold',
        lineSpacing: 2,
      })
      .setOrigin(0.5);
    this.add
      .text(480, 168, "Let's help our town! 🐾", {
        fontFamily: 'Trebuchet MS, Arial, sans-serif',
        fontSize: '24px',
        color: '#2a5d7a',
        align: 'center',
      })
      .setOrigin(0.5);

    this.paintHelpers();

    // Big, friendly Play button with a gentle pulse so a pre-reader knows where to go.
    const play = addButton(this, {
      x: 480,
      y: 448,
      width: 360,
      height: 88,
      label: '▶  Play',
      fill: 0x9be7c4,
      onPress: () => this.begin(),
      testId: 'start.play',
    });
    this.tweens.add({
      targets: play,
      scale: 1.05,
      duration: 760,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    this.add
      .text(480, 514, 'Grown-ups: tap Play. Arrow keys, touch, or a gamepad all work.', {
        fontFamily: 'Trebuchet MS, Arial, sans-serif',
        fontSize: '18px',
        color: '#42637a',
        align: 'center',
      })
      .setOrigin(0.5);

    // Music begins on the first real gesture (browser autoplay policy), then plays on.
    this.input.once('pointerdown', () => getMusic().start());

    this.input.keyboard?.on('keydown', (event: KeyboardEvent) => {
      const intent = inputIntentFromKeyboard(event.key);
      if (intent?.type === 'confirm' || intent?.type === 'action') this.begin();
    });

    this.input.gamepad?.on('down', (_pad: unknown, button: { index: number }) => {
      const intent = inputIntentFromGamepadButton(button.index);
      if (intent?.type === 'confirm' || intent?.type === 'action') this.begin();
    });
  }

  /** Soft sun + clouds so the title feels like a sunny morning over Rescue Town. */
  private paintSky(): void {
    this.add.circle(852, 96, 58, 0xfff1a8, 0.9);
    this.add.circle(852, 96, 78, 0xfff1a8, 0.35);
    const cloud = (x: number, y: number, s: number) => {
      this.add.ellipse(x, y, 120 * s, 54 * s, 0xffffff, 0.85);
      this.add.ellipse(x - 42 * s, y + 6 * s, 70 * s, 40 * s, 0xffffff, 0.85);
      this.add.ellipse(x + 44 * s, y + 8 * s, 76 * s, 42 * s, 0xffffff, 0.85);
    };
    cloud(150, 130, 1);
    cloud(720, 220, 0.8);
    // A soft green hill the helpers stand on.
    this.add.rectangle(480, 540, 960, 200, 0xbdebc4, 1).setOrigin(0.5, 1);
  }

  private paintHelpers(): void {
    const cy = 292;
    HELPERS.forEach((helper, index) => {
      const c = this.add.container(helper.x, cy);
      const body = this.add.graphics();
      body.fillStyle(helper.color, 1);
      body.fillRoundedRect(-44, -42, 88, 88, 22);
      body.lineStyle(4, 0x203247, 1);
      body.strokeRoundedRect(-44, -42, 88, 88, 22);
      const face = this.add.circle(0, -8, 24, 0xfff8e7).setStrokeStyle(4, 0x203247, 1);
      const eyeL = this.add.circle(-9, -12, 4, 0x203247);
      const eyeR = this.add.circle(9, -12, 4, 0x203247);
      const smile = this.add.graphics();
      smile.lineStyle(4, 0x203247, 1);
      smile.beginPath();
      smile.arc(0, -6, 12, Phaser.Math.DegToRad(20), Phaser.Math.DegToRad(160));
      smile.strokePath();
      const name = this.add
        .text(0, 60, helper.name, {
          fontFamily: 'Trebuchet MS, Arial, sans-serif',
          fontSize: '22px',
          color: '#203247',
          fontStyle: 'bold',
        })
        .setOrigin(0.5);
      c.add([body, face, eyeL, eyeR, smile, name]);
      // Staggered idle bob — a little sign of life.
      this.tweens.add({
        targets: c,
        y: cy - 10,
        duration: 1000 + index * 120,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
        delay: index * 160,
      });
    });
  }

  private begin(): void {
    getMusic().start();
    startScene(this, SCENE_KEYS.profile);
  }
}
