import Phaser from 'phaser';
import { fadeInScene } from '../systems/SceneTransitions';
import { SCENE_KEYS, startScene } from '../systems/SceneNavigation';
import { inputIntentFromGamepadButton, inputIntentFromKeyboard } from '../systems/InputIntent';
import { getMusic } from '../systems/GameServices';
import { addIconButton } from '../ui/Button';
import { motionAllowed } from '../ui/Sprite';

const HELPERS = [
  { key: 'hl.char.rivet', x: 250 },
  { key: 'hl.char.brick', x: 470 },
  { key: 'hl.char.ember', x: 690 },
] as const;

export class StartScene extends Phaser.Scene {
  constructor() {
    super('StartScene');
  }

  create(): void {
    fadeInScene(this);
    this.paintWorld();

    // Title on a soft dusk band so it stays readable over the art.
    this.add.rectangle(480, 46, 960, 104, 0x1b2a41, 0.5);
    this.add
      .text(480, 40, 'RESCUE TOWN BUILDERS', {
        fontFamily: 'Trebuchet MS, Arial, sans-serif',
        fontSize: '46px',
        color: '#FFE6A3',
        fontStyle: 'bold',
        stroke: '#1B2A41',
        strokeThickness: 8,
      })
      .setOrigin(0.5)
      .setShadow(0, 4, '#000000', 6, true, true);

    // The glowing Play coin — the one obvious thing to touch.
    const play = addIconButton(this, {
      x: 480,
      y: 250,
      size: 132,
      key: 'hl.ui.play',
      onPress: () => this.begin(),
      testId: 'start.play',
      pulse: true,
    });
    play.setDepth(20);

    this.add
      .text(480, 524, 'Tap the glowing button to help the town', {
        fontFamily: 'Trebuchet MS, Arial, sans-serif',
        fontSize: '17px',
        color: '#EBDDDA',
        stroke: '#1B2A41',
        strokeThickness: 4,
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

  private paintWorld(): void {
    this.add.image(480, 270, 'hl.bg.town').setDisplaySize(960, 540).setDepth(0);

    // The three helpers stand on the warm cobbles, breathing.
    HELPERS.forEach((helper, index) => {
      const y = 410;
      const sprite = this.add.image(helper.x, y, helper.key).setDisplaySize(112, 112).setDepth(10);
      if (motionAllowed()) {
        this.tweens.add({
          targets: sprite,
          y: y - 8,
          duration: 1100 + index * 130,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut',
          delay: index * 180,
        });
      }
    });

    // Cluckle, the dreaming heart, dozes nearby.
    const cluckle = this.add.image(840, 452, 'hl.char.cluckle').setDisplaySize(78, 78).setDepth(10);
    if (motionAllowed()) {
      this.tweens.add({ targets: cluckle, scale: cluckle.scale * 1.05, duration: 1800, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    }

    // Drifting fireflies for a little living magic.
    if (motionAllowed()) {
      [[150, 300], [760, 250], [400, 200], [600, 330]].forEach(([fx, fy], i) => {
        const fly = this.add.image(fx, fy, 'hl.prop.firefly').setDisplaySize(14, 14).setDepth(15).setAlpha(0.8);
        this.tweens.add({ targets: fly, y: fy - 22, x: fx + (i % 2 ? 18 : -18), alpha: 0.25, duration: 1600 + i * 240, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
      });
    }
  }

  private begin(): void {
    getMusic().start();
    startScene(this, SCENE_KEYS.profile);
  }
}
