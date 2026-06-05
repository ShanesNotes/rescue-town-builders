import Phaser from 'phaser';
import { MIN_TOUCH_TARGET } from '../systems/AccessibilityRules';
import { registerE2EButton, registerE2EScene } from '../systems/E2EBridge';
import { getSfx } from '../systems/GameServices';
import { hasTexture, motionAllowed } from './Sprite';
import { FONTS } from './typography';

// A child needs the audio "I pressed it" signal on the most-pressed control in the game.
function playTap(): void {
  try {
    getSfx().play('tap');
  } catch {
    /* audio is a bonus, never required (No-Fail) */
  }
}

/**
 * Robust press model: confirm on pointerUP, but only when a pointerDOWN began on THIS target.
 * pointerdown-to-confirm (the old model) fired at touch-start, so drags, scrolls, and taps that
 * landed mid-teardown registered spuriously — the "buttons sometimes don't work" bug. Releasing
 * elsewhere never confirms; pressing-and-releasing on the control always does.
 */
function bindPress(target: Phaser.GameObjects.GameObject, handlers: { onDown?: () => void; onConfirm: () => void }): void {
  let armed = false;
  target.on('pointerdown', () => {
    armed = true;
    handlers.onDown?.();
  });
  target.on('pointerup', () => {
    if (!armed) return;
    armed = false;
    handlers.onConfirm();
  });
  // Disarm if the finger slides off or the gesture is cancelled, so a later stray pointerup can
  // never fire a "ghost tap" — the exact swipe-everything behavior a young child exhibits.
  const disarm = (): void => {
    armed = false;
  };
  target.on('pointerout', disarm);
  target.on('pointercancel', disarm);
}

export type IconButtonOptions = {
  x: number;
  y: number;
  size: number;
  key: string;
  onPress: () => void;
  testId?: string;
  caption?: string;
  pulse?: boolean;
};

/**
 * A glowing icon-coin button (Hearthlight UI). Icon-first, near-zero words. The interactive
 * target is a generous rectangle (>= the coin and >= MIN_TOUCH_TARGET) so little fingers always
 * land it; visual press/hover/pulse feedback lives on a child sprite, decoupled from the hit
 * area, so feedback never compromises reliability.
 */
export function addIconButton(scene: Phaser.Scene, options: IconButtonOptions): Phaser.GameObjects.Container {
  registerE2EScene(scene.scene.key);
  const { x, y, size, key } = options;
  const container = scene.add.container(x, y);
  const coin = hasTexture(scene, key)
    ? scene.add.image(0, 0, key).setDisplaySize(size, size)
    : scene.add.circle(0, 0, size / 2, 0xf4a24c).setStrokeStyle(4, 0xffc857);
  const children: Phaser.GameObjects.GameObject[] = [coin];
  if (options.caption) {
    children.push(
      scene.add
        .text(0, size / 2 + 16, options.caption, {
          fontFamily: FONTS.display,
          fontSize: '20px',
          color: '#FFE6A3',
          align: 'center',
        })
        .setOrigin(0.5),
    );
  }
  container.add(children);

  const baseScale = coin.scale; // scale after setDisplaySize; hover/press are relative to this
  const hit = Math.max(size + 16, MIN_TOUCH_TARGET);
  container.setSize(hit, hit);
  container.setInteractive({ useHandCursor: true });
  bindPress(container, {
    onDown: () => {
      playTap();
      if (motionAllowed()) {
        scene.tweens.add({ targets: coin, scale: baseScale * 0.9, duration: 70, yoyo: true, ease: 'Quad.easeOut' });
      }
    },
    onConfirm: options.onPress,
  });
  container.on('pointerover', () => coin.setScale(baseScale * 1.06));
  container.on('pointerout', () => coin.setScale(baseScale));

  if (options.pulse && motionAllowed()) {
    const glow = scene.add.circle(0, 0, size * 0.62, 0xffc857, 0.18);
    container.addAt(glow, 0);
    scene.tweens.add({ targets: glow, scale: 1.25, alpha: 0.05, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
  }

  if (options.testId) {
    registerE2EButton({ testId: options.testId, label: options.caption ?? key, sceneKey: scene.scene.key, press: options.onPress });
  }
  return container;
}

export type ButtonOptions = {
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  fill?: number;
  stroke?: number;
  onPress: () => void;
  testId?: string;
};

export function addButton(scene: Phaser.Scene, options: ButtonOptions): Phaser.GameObjects.Container {
  registerE2EScene(scene.scene.key);
  const fill = options.fill ?? 0xffffff;
  const stroke = options.stroke ?? 0x203247;
  const width = Math.max(options.width, MIN_TOUCH_TARGET);
  const height = Math.max(options.height, MIN_TOUCH_TARGET);
  const container = scene.add.container(options.x, options.y);
  const panel = scene.add.rectangle(0, 0, width, height, fill, 1);
  panel.setStrokeStyle(4, stroke, 1);
  const panelArtKey = panelArtForFill(fill);
  const panelArt = panelArtKey && hasTexture(scene, panelArtKey)
    ? scene.add.image(0, 0, panelArtKey).setDisplaySize(width, height)
    : null;
  if (panelArt) panel.setAlpha(0.18);
  const label = scene.add.text(0, 0, options.label, {
    fontFamily: FONTS.display,
    fontSize: '26px',
    color: '#203247',
    align: 'center',
    wordWrap: { width: width - 32 },
  });
  label.setOrigin(0.5);
  container.add(panelArt ? [panel, panelArt, label] : [panel, label]);
  container.setSize(width, height);
  container.setInteractive({ useHandCursor: true });
  bindPress(container, { onDown: () => playTap(), onConfirm: options.onPress });
  if (options.testId) {
    registerE2EButton({
      testId: options.testId,
      label: options.label,
      sceneKey: scene.scene.key,
      press: options.onPress,
    });
  }
  container.on('pointerover', () => {
    panel.setFillStyle(0xfff4bf);
    panelArt?.setAlpha(0.92);
  });
  container.on('pointerout', () => {
    panel.setFillStyle(fill);
    panelArt?.setAlpha(1);
  });
  return container;
}

function panelArtForFill(fill: number): string {
  if (fill === 0xfff4bf) return 'kenney.ui.button-yellow';
  if (fill === 0x9be7c4) return 'kenney.ui.button-green';
  if (fill === 0xb7e6ff) return 'kenney.ui.button-blue';
  if (fill === 0xffb3c6) return 'kenney.ui.button-red';
  return 'kenney.ui.button-blue';
}
