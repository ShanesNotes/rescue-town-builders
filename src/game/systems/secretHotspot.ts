import type Phaser from 'phaser';
import { Secrets, isSecretId, type SecretId } from './Secrets';
import { getSaveSystem, getSfx } from './GameServices';
import { motionAllowed } from '../ui/Sprite';

// Glue between the pure Secrets tracker and the scenes. Hidden hotspots call
// touchSecret() on pointerdown; when a secret reveals, it chimes, persists the
// sticker (so it shows up in the Sticker Book), and returns the message to display.

/** Build a Secrets tracker for the active profile, rehydrating already-found secrets. */
export function createSecretsForProfile(): Secrets {
  const profile = getSaveSystem().getSelectedProfile();
  return new Secrets({
    playerName: profile?.name,
    discovered: (profile?.progress.stickers ?? []).filter(isSecretId),
  });
}

/**
 * Touch a hidden secret. On the reveal that crosses its threshold, plays the secret
 * cue, persists its sticker, and returns the reveal message; returns null otherwise
 * (not yet, or already found). Touching is never wrong (No-Fail).
 */
export function touchSecret(secrets: Secrets, id: SecretId): string | null {
  const reveal = secrets.touch(id);
  if (!reveal) return null;
  getSfx().play('secret');
  const profile = getSaveSystem().getSelectedProfile();
  if (profile) {
    getSaveSystem().unlockSticker(profile.id, reveal.sticker);
  }
  return reveal.message;
}

/**
 * Place a hidden secret as a soft golden glimmer that gently breathes — visible enough that
 * a child who pauses and scans notices "something quiet is here," but never garish. Earlier
 * the hotspots were cream-on-cream at 18% alpha (effectively invisible), so the secrets
 * could only be found by accident; this makes them rewardably discoverable for a patient
 * child while keeping the magic understated. Touching is never wrong (No-Fail).
 */
export function addSecretHotspot(scene: Phaser.Scene, secrets: Secrets, id: SecretId, x: number, y: number): void {
  const glow = scene.add.circle(x, y, 22, 0xfff1a8, 0.32);
  scene.add.circle(x, y, 12, 0xffd86b, 0.6).setStrokeStyle(2, 0xfff8e7, 0.8);
  if (motionAllowed()) {
    scene.tweens.add({
      targets: glow,
      scale: 1.4,
      alpha: 0.14,
      duration: 1300,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }
  // A generous, invisible hit target so little fingers find it easily.
  scene.add
    .circle(x, y, 30, 0xffffff, 0.001)
    .setInteractive()
    .on('pointerdown', () => {
      const message = touchSecret(secrets, id);
      if (!message) return;
      // Cluckle's Dream embodies the microcosm: the whole town, small enough to hold,
      // glows inside the hotspot for one breath before the words arrive.
      if (id === 'cluckle-dream') {
        playMiniatureTown(scene, x, y, () => showSecretReveal(scene, message));
      } else {
        showSecretReveal(scene, message);
      }
    });
}

/** A tiny glowing town (two little houses, a path, a tree) that blooms then fades. */
function playMiniatureTown(scene: Phaser.Scene, x: number, y: number, onDone: () => void): void {
  const depth = 999;
  const town = scene.add.container(x, y).setDepth(depth).setAlpha(0);
  const glow = scene.add.circle(0, 0, 42, 0xfff1a8, 0.3);
  const path = scene.add.rectangle(0, 16, 66, 6, 0xe8d2a0);
  const wallA = scene.add.rectangle(-15, 5, 17, 15, 0xffd6a5).setStrokeStyle(1, 0x203247, 0.6);
  const roofA = scene.add.triangle(-15, -6, -11, 7, 11, 7, 0, -8, 0xff8fab).setStrokeStyle(1, 0x203247, 0.6);
  const wallB = scene.add.rectangle(9, 7, 15, 13, 0xb7e6ff).setStrokeStyle(1, 0x203247, 0.6);
  const roofB = scene.add.triangle(9, -2, -10, 7, 10, 7, 0, -7, 0xffd86b).setStrokeStyle(1, 0x203247, 0.6);
  const trunk = scene.add.rectangle(26, 8, 3, 11, 0x8d6e63);
  const leaves = scene.add.circle(26, 0, 7, 0x9be7c4).setStrokeStyle(1, 0x203247, 0.6);
  town.add([glow, path, wallA, roofA, wallB, roofB, trunk, leaves]);

  if (!motionAllowed()) {
    town.setAlpha(0.85);
    scene.time.delayedCall(800, () => {
      town.destroy();
      onDone();
    });
    return;
  }
  scene.tweens.add({
    targets: town,
    alpha: 0.9,
    scale: 1.2,
    duration: 650,
    ease: 'Sine.easeOut',
    onComplete: () =>
      scene.tweens.add({
        targets: town,
        alpha: 0,
        duration: 700,
        delay: 550,
        ease: 'Sine.easeIn',
        onComplete: () => {
          town.destroy();
          onDone();
        },
      }),
  });
}

/** A soft, dismissable overlay for the moment a secret steps into the light. */
export function showSecretReveal(scene: Phaser.Scene, message: string): void {
  const depth = 1000;
  const objects: Phaser.GameObjects.GameObject[] = [];
  const backdrop = scene.add.rectangle(480, 270, 960, 540, 0x10243a, 0.78).setDepth(depth).setInteractive();
  objects.push(backdrop);
  objects.push(scene.add.rectangle(480, 270, 720, 290, 0xfff7dc).setStrokeStyle(4, 0x203247).setDepth(depth));
  objects.push(
    scene.add
      .text(480, 250, `✨ ${message}`, {
        fontFamily: 'Trebuchet MS, Arial, sans-serif',
        fontSize: '24px',
        color: '#203247',
        align: 'center',
        wordWrap: { width: 660 },
      })
      .setOrigin(0.5)
      .setDepth(depth + 1),
  );
  objects.push(
    scene.add
      .text(480, 378, 'Tap to keep playing', {
        fontFamily: 'Trebuchet MS, Arial, sans-serif',
        fontSize: '18px',
        color: '#5a6b7a',
      })
      .setOrigin(0.5)
      .setDepth(depth + 1),
  );
  backdrop.on('pointerdown', () => objects.forEach((object) => object.destroy()));
}
