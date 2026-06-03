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
      if (message) showSecretReveal(scene, message);
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
