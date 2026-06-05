import Phaser from 'phaser';
import { isE2EEnabled } from '../systems/E2EBridge';
import { addHelperAvatar, motionAllowed, type HelperCharacterId } from './Sprite';
import { FONTS } from './typography';

export type MissionIntroContent = {
  /** The authored introPanel icon (an emoji string). */
  icon: string;
  /** The mission title shown big under the icon. */
  title: string;
  /** The authored one-line panel text. */
  text: string;
  /** Optional helper to wave a little in the corner of the veil. */
  characterId?: HelperCharacterId;
};

const VEIL_DEPTH = 900;
const HOLD_MS = 1500;

/**
 * A warm, short intro beat over a mission's already-built gameplay (P1-03). The mission's logic and
 * E2E buttons are registered in create() BEFORE this veil; the veil is purely a visual cover that
 * blocks only the real human pointer for ~1.5s (or until tap), pulses the icon once, then fades and
 * calls onDone. It NEVER gates logic or the E2E bridge.
 *
 * Under e2e the veil is instant (0ms, immediately dismissed) so it can't race the Playwright driver.
 */
export function playMissionIntro(scene: Phaser.Scene, content: MissionIntroContent, onDone: () => void): void {
  if (isE2EEnabled()) {
    onDone();
    return;
  }

  const depth = VEIL_DEPTH;
  const objects: Phaser.GameObjects.GameObject[] = [];

  // A soft dimming scrim that swallows stray taps on the busy screen behind it.
  const scrim = scene.add.rectangle(480, 270, 960, 540, 0x10243a, 0.62).setDepth(depth).setInteractive();
  objects.push(scrim);

  const icon = scene.add.text(480, 196, content.icon, { fontSize: '120px' }).setOrigin(0.5).setDepth(depth + 1);
  objects.push(icon);

  const title = scene.add
    .text(480, 300, content.title, {
      fontFamily: FONTS.display,
      fontSize: '40px',
      color: '#FFE2A6',
      fontStyle: 'bold',
      stroke: '#2A1606',
      strokeThickness: 7,
      align: 'center',
      wordWrap: { width: 760 },
    })
    .setOrigin(0.5)
    .setDepth(depth + 1);
  objects.push(title);

  const text = scene.add
    .text(480, 360, content.text, {
      fontFamily: FONTS.display,
      fontSize: '22px',
      color: '#EBDDDA',
      stroke: '#2A1606',
      strokeThickness: 4,
      align: 'center',
      wordWrap: { width: 680 },
    })
    .setOrigin(0.5)
    .setDepth(depth + 1);
  objects.push(text);

  // The helper hops in to point at the new control (warmth before words).
  const hero = content.characterId ? addHelperAvatar(scene, content.characterId, 820, 430, 130, { idle: true }) : null;
  if (hero) {
    hero.setDepth(depth + 1);
    objects.push(hero);
  }

  let dismissed = false;
  const finish = (): void => {
    if (dismissed) return;
    dismissed = true;
    scrim.disableInteractive();
    if (!motionAllowed()) {
      objects.forEach((object) => object.destroy());
      onDone();
      return;
    }
    scene.tweens.add({
      targets: objects,
      alpha: 0,
      duration: 260,
      ease: 'Sine.easeIn',
      onComplete: () => {
        objects.forEach((object) => object.destroy());
        onDone();
      },
    });
  };

  // Tap anywhere skips straight to the mission.
  scrim.on('pointerdown', finish);

  if (motionAllowed()) {
    // One gentle pulse on the icon so it reads "here we go!", then auto-fade.
    scene.tweens.add({ targets: icon, scale: 1.18, duration: 420, yoyo: true, ease: 'Sine.easeInOut' });
  }
  scene.time.delayedCall(HOLD_MS, finish);
}
