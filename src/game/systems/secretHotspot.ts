import type Phaser from 'phaser';
import { Secrets, isSecretId, type SecretId } from './Secrets';
import { getSaveSystem, getSfx } from './GameServices';

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
