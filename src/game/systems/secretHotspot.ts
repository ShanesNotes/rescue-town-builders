import type Phaser from 'phaser';
import { Secrets, isSecretId, type SecretId } from './Secrets';
import { getSaveSystem, getSfx } from './GameServices';
import { motionAllowed } from '../ui/Sprite';
import { FONTS } from '../ui/typography';

// Glue between the pure Secrets tracker and the scenes. Hidden hotspots call
// touchSecret() on pointerdown; when a secret reveals, it chimes, persists the
// sticker (so it shows up in the Sticker Book), and returns the message to display.

/** Build a Secrets tracker for the active profile, rehydrating already-found secrets + touch counts. */
export function createSecretsForProfile(): Secrets {
  const profile = getSaveSystem().getSelectedProfile();
  return new Secrets({
    playerName: profile?.name,
    discovered: (profile?.progress.stickers ?? []).filter(isSecretId),
    // Per-secret touch counts persisted in a prior session, so a multi-tap secret keeps charging
    // across scene reloads/refreshes instead of resetting to zero each create() (P1-07).
    touches: profile?.progress.secretTouches,
  });
}

/**
 * Touch a hidden secret. On the reveal that crosses its threshold, plays the secret
 * cue, persists its sticker, and returns the reveal message; returns null otherwise
 * (not yet, or already found). Touching is never wrong (No-Fail).
 */
export function touchSecret(secrets: Secrets, id: SecretId): string | null {
  const before = secrets.getTouches(id);
  const reveal = secrets.touch(id);
  // Persist the running touch count ONLY when this tap actually advanced it, so a half-charged
  // secret survives a reload (P1-07) without writing to localStorage on every tap of an
  // already-found glimmer.
  const profile = getSaveSystem().getSelectedProfile();
  const after = secrets.getTouches(id);
  if (profile && after > before) getSaveSystem().recordSecretTouch(profile.id, id, after);
  if (!reveal) return null;
  getSfx().play('secret');
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
  const core = scene.add.circle(x, y, 12, 0xffd86b, 0.6).setStrokeStyle(2, 0xfff8e7, 0.8);
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
      const before = secrets.getTouches(id);
      const message = touchSecret(secrets, id);
      if (!message) {
        // Pre-threshold tap: charge feedback so the glimmer never feels dead (P2-08). Only when
        // this tap actually advanced the count (not an already-found secret).
        if (secrets.getTouches(id) > before) chargeGlimmer(scene, core);
        return;
      }
      // Each secret gets its own little visual soul (Language-of-Creation patterns) before
      // the words: the microcosm, light-from-darkness, naming-the-animals.
      const intro = SECRET_INTROS[id];
      if (intro) intro(scene, x, y, () => showSecretReveal(scene, message));
      else showSecretReveal(scene, message);
    });
}

// Each pre-threshold touch visibly charges the glimmer toward its reveal: a soft ascending tick
// and an inner-glow pulse (scale yoyo), so a patient child feels the secret answering them (P2-08).
function chargeGlimmer(scene: Phaser.Scene, core: Phaser.GameObjects.Arc): void {
  getSfx().play('place');
  if (!motionAllowed()) return;
  const base = core.scale;
  scene.tweens.killTweensOf(core);
  core.setScale(base);
  scene.tweens.add({ targets: core, scale: base * 1.5, duration: 160, yoyo: true, ease: 'Sine.easeOut', onComplete: () => core.setScale(base) });
}

type SecretIntro = (scene: Phaser.Scene, x: number, y: number, onDone: () => void) => void;

const SECRET_INTROS: Partial<Record<SecretId, SecretIntro>> = {
  'cluckle-dream': playMiniatureTown,
  'hidden-light': playPointOfLight,
  'secret-friend': playShyFriend,
};

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

/** Hidden Light: a single point of light grows out of the quiet (light from darkness). */
function playPointOfLight(scene: Phaser.Scene, x: number, y: number, onDone: () => void): void {
  const depth = 999;
  const halo = scene.add.circle(x, y, 30, 0xfff1a8, 0.35).setScale(0.15).setDepth(depth);
  const core = scene.add.circle(x, y, 10, 0xfffdf2, 0.95).setScale(0.15).setDepth(depth + 1);
  const finish = () => {
    halo.destroy();
    core.destroy();
    onDone();
  };
  if (!motionAllowed()) {
    halo.setScale(1.4);
    core.setScale(1);
    scene.time.delayedCall(800, finish);
    return;
  }
  scene.tweens.add({ targets: halo, scale: 1.7, alpha: 0.12, duration: 750, ease: 'Sine.easeOut' });
  scene.tweens.add({
    targets: core,
    scale: 1.1,
    duration: 600,
    yoyo: true,
    hold: 350,
    ease: 'Sine.easeOut',
    onComplete: finish,
  });
}

/** Secret Friend: a small shy creature peeks up, holds your gaze, then ducks back. */
function playShyFriend(scene: Phaser.Scene, x: number, y: number, onDone: () => void): void {
  const depth = 999;
  const friend = scene.add.container(x, y + 20).setDepth(depth).setAlpha(0);
  const earL = scene.add.circle(-9, -12, 5, 0xc9b8e8).setStrokeStyle(2, 0x203247, 0.8);
  const earR = scene.add.circle(9, -12, 5, 0xc9b8e8).setStrokeStyle(2, 0x203247, 0.8);
  const body = scene.add.circle(0, 0, 15, 0xc9b8e8).setStrokeStyle(2, 0x203247, 0.8);
  const eyeL = scene.add.circle(-5, -2, 2.6, 0x203247);
  const eyeR = scene.add.circle(5, -2, 2.6, 0x203247);
  friend.add([earL, earR, body, eyeL, eyeR]);
  const finish = () => {
    friend.destroy();
    onDone();
  };
  if (!motionAllowed()) {
    friend.setY(y).setAlpha(1);
    scene.time.delayedCall(800, finish);
    return;
  }
  scene.tweens.add({
    targets: friend,
    y,
    alpha: 1,
    duration: 450,
    ease: 'Back.Out',
    onComplete: () =>
      scene.tweens.add({ targets: friend, y: y + 20, alpha: 0, duration: 450, delay: 650, ease: 'Sine.easeIn', onComplete: finish }),
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
        fontFamily: FONTS.display,
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
        fontFamily: FONTS.label,
        fontSize: '18px',
        color: '#5a6b7a',
      })
      .setOrigin(0.5)
      .setDepth(depth + 1),
  );
  backdrop.on('pointerdown', () => objects.forEach((object) => object.destroy()));
}
