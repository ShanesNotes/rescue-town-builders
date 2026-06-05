import Phaser from 'phaser';
import { fadeInScene } from '../systems/SceneTransitions';
import { SCENE_KEYS, softStartScene } from '../systems/SceneNavigation';
import { bindIntents } from '../systems/bindIntents';
import { getMusic } from '../systems/GameServices';
import { addIconButton } from '../ui/Button';
import { motionAllowed } from '../ui/Sprite';
import { FONTS } from '../ui/typography';

type Hero = { key: string; x: number; size: number };

// The three heroes stand across the near cobbles, biggest in the foreground plane so the
// perspective reads true (the old mid-distance placement made them look pasted-on / floating).
const HEROES: Hero[] = [
  { key: 'hl.char.rivet', x: 286, size: 150 },
  { key: 'hl.char.brick', x: 480, size: 158 },
  { key: 'hl.char.ember', x: 674, size: 150 },
];
const GROUND_Y = 522; // where little feet meet the front cobblestones

export class StartScene extends Phaser.Scene {
  constructor() {
    super('StartScene');
  }

  create(): void {
    fadeInScene(this);
    this.paintWorld();
    this.paintTitle();

    // The glowing Play coin — the one obvious thing to touch.
    const play = addIconButton(this, {
      x: 480,
      y: 246,
      size: 136,
      key: 'hl.ui.play',
      onPress: () => this.begin(),
      testId: 'start.play',
      pulse: true,
    });
    play.setDepth(20);

    // Music begins on the first real gesture (browser autoplay policy), then plays on.
    this.input.once('pointerdown', () => getMusic().start());
    bindIntents(this, { onConfirm: () => this.begin() });
  }

  private paintWorld(): void {
    this.add.image(480, 270, 'hl.bg.town').setDisplaySize(960, 540).setDepth(0);

    // Warm grade — lift the navy toward a heroic golden hour without washing out the art.
    this.add
      .rectangle(480, 270, 960, 540, 0xf2b45a, 0.08)
      .setBlendMode(Phaser.BlendModes.ADD)
      .setDepth(1);

    // A sun-bloom rising from the mountain gap — the promise of the quest, not an ominous dusk.
    // Softly stacked so it feathers out instead of drawing hard concentric rings.
    const bloomY = 300;
    ([[240, 0.04], [170, 0.06], [110, 0.09], [64, 0.12]] as const).forEach(([r, a]) => {
      this.add.circle(480, bloomY, r, 0xffd98a, a).setBlendMode(Phaser.BlendModes.ADD).setDepth(2);
    });
    if (motionAllowed()) {
      const halo = this.add.circle(480, bloomY, 150, 0xffd98a, 0.06).setBlendMode(Phaser.BlendModes.ADD).setDepth(2);
      this.tweens.add({ targets: halo, scale: 1.18, alpha: 0.03, duration: 2600, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    }

    // The heroes, planted with contact shadows.
    HEROES.forEach((hero, i) => this.plantCharacter(hero.key, hero.x, GROUND_Y, hero.size, i));
    // Cluckle, the dreaming heart, dozes by the lamplight.
    this.plantCharacter('hl.char.cluckle', 820, GROUND_Y + 6, 96, 3, true);

    // Drifting fireflies for a little living magic.
    if (motionAllowed()) {
      ([[150, 330], [770, 300], [410, 250], [600, 360]] as const).forEach(([fx, fy], i) => {
        const fly = this.add.image(fx, fy, 'hl.prop.firefly').setDisplaySize(12, 12).setDepth(12).setAlpha(0.85);
        this.tweens.add({ targets: fly, y: fy - 22, x: fx + (i % 2 ? 18 : -18), alpha: 0.3, duration: 1700 + i * 240, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
      });
    }
  }

  /**
   * Place a character with feet on the ground (bottom origin) and a soft contact shadow.
   * Breathing scales from the feet up, so the body has life but the feet stay planted —
   * the fix for the old "floating" hover-bob.
   */
  private plantCharacter(key: string, x: number, feetY: number, size: number, index: number, dreamer = false): void {
    const shadow = this.add.ellipse(x, feetY + 2, size * 0.72, size * 0.2, 0x0a1322, 0.5).setDepth(8);
    const sprite = this.add.image(x, feetY, key).setOrigin(0.5, 1).setDisplaySize(size, size).setDepth(10);
    if (!motionAllowed()) return;
    const baseScaleY = sprite.scaleY;
    const duration = (dreamer ? 1900 : 1200) + index * 130;
    this.tweens.add({ targets: sprite, scaleY: baseScaleY * (dreamer ? 1.05 : 1.03), duration, yoyo: true, repeat: -1, ease: 'Sine.easeInOut', delay: index * 160 });
    this.tweens.add({ targets: shadow, scaleX: 0.94, alpha: 0.4, duration, yoyo: true, repeat: -1, ease: 'Sine.easeInOut', delay: index * 160 });
  }

  private paintTitle(): void {
    // A soft warm halo backs the title — heroic glow that feathers out, never a hard slab.
    ([[820, 168, 0.05], [600, 124, 0.07], [380, 92, 0.09]] as const).forEach(([w, h, a]) => {
      this.add.ellipse(480, 70, w, h, 0xffd98a, a).setBlendMode(Phaser.BlendModes.ADD).setDepth(18);
    });
    this.add
      .text(480, 66, 'RESCUE TOWN BUILDERS', {
        fontFamily: FONTS.display,
        fontSize: '48px',
        color: '#FFE2A6',
        fontStyle: 'bold',
        stroke: '#2A1606',
        strokeThickness: 9,
      })
      .setOrigin(0.5)
      .setDepth(19)
      .setShadow(0, 5, '#1a0d02', 8, true, true);
  }

  private begin(): void {
    getMusic().start();
    softStartScene(this, SCENE_KEYS.profile);
  }
}
