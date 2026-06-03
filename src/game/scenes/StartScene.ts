import Phaser from 'phaser';
import { fadeInScene } from '../systems/SceneTransitions';
import { SCENE_KEYS, startScene } from '../systems/SceneNavigation';
import { inputIntentFromGamepadButton, inputIntentFromKeyboard } from '../systems/InputIntent';
import { getMusic } from '../systems/GameServices';
import { addButton } from '../ui/Button';

const HELPERS = [
  { key: 'character.rivet', name: 'Rivet', x: 300 },
  { key: 'character.brick', name: 'Brick', x: 480 },
  { key: 'character.ember', name: 'Ember', x: 660 },
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
      y: 432,
      width: 360,
      height: 92,
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
      .text(480, 506, 'Grown-ups: tap Play. Arrow keys, touch, or a gamepad all work.', {
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
    HELPERS.forEach((helper, index) => {
      const y = 312;
      let display: Phaser.GameObjects.GameObject;
      if (this.textures.exists(helper.key)) {
        const img = this.add.image(helper.x, y, helper.key).setDisplaySize(128, 128);
        display = img;
      } else {
        // No-Fail fallback: a friendly badge if art is missing.
        const fallback = this.add.circle(helper.x, y, 56, [0x8ed0ff, 0xffd29b, 0xffb3b3][index] ?? 0xffffff, 1);
        fallback.setStrokeStyle(4, 0x203247, 1);
        display = fallback;
      }
      this.add
        .text(helper.x, y + 84, helper.name, {
          fontFamily: 'Trebuchet MS, Arial, sans-serif',
          fontSize: '22px',
          color: '#203247',
          fontStyle: 'bold',
        })
        .setOrigin(0.5);
      // Staggered idle bob — a little sign of life.
      this.tweens.add({
        targets: display,
        y: y - 10,
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
