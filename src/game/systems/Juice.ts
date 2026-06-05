import Phaser from 'phaser';
import { motionAllowed } from '../ui/Sprite';

// Shared "game feel" kit. Every effect early-returns under reduced motion (No-Fail / accessibility),
// so callers can sprinkle juice freely without guarding each site. Tuned gentle for a 6-year-old.

type Transformable = Phaser.GameObjects.GameObject & Phaser.GameObjects.Components.Transform;

const CONFETTI = [0xffc857, 0xe86f3a, 0x43a29c, 0xffd98a, 0xffb3c6, 0xf2f0e6];

export const Juice = {
  /** A quick satisfying scale-pop (Back.easeOut, yoyo). Use on a successful tap/place. */
  punch(scene: Phaser.Scene, target: Transformable, scale = 1.12, duration = 90): void {
    if (!motionAllowed()) return;
    const base = (target as { scale?: number }).scale ?? 1;
    scene.tweens.add({ targets: target, scale: base * scale, duration, yoyo: true, ease: 'Back.easeOut' });
  },

  /** Squash on impact, stretch back — for things that "land". */
  squashStretch(scene: Phaser.Scene, target: Transformable, amount = 0.14, duration = 130): void {
    if (!motionAllowed()) return;
    const sx = target.scaleX;
    const sy = target.scaleY;
    scene.tweens.add({ targets: target, scaleX: sx * (1 + amount), scaleY: sy * (1 - amount), duration, yoyo: true, ease: 'Quad.easeOut' });
  },

  /** A gentle camera shake for a meaningful impact. Kept tiny so it never jars a child. */
  shake(scene: Phaser.Scene, duration = 120, intensity = 0.004): void {
    if (!motionAllowed()) return;
    scene.cameras.main.shake(duration, intensity);
  },

  /** A radial sparkle/particle burst at a point (no texture needed — tweened dots). */
  burst(scene: Phaser.Scene, x: number, y: number, opts: { count?: number; color?: number; radius?: number; depth?: number } = {}): void {
    if (!motionAllowed()) return;
    const count = opts.count ?? 8;
    const color = opts.color ?? 0xffe2a6;
    const radius = opts.radius ?? 48;
    const depth = opts.depth ?? 40;
    for (let i = 0; i < count; i += 1) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4;
      const dist = radius * (0.6 + Math.random() * 0.5);
      const p = scene.add.circle(x, y, 3 + Math.random() * 2, color).setBlendMode(Phaser.BlendModes.ADD).setDepth(depth);
      scene.tweens.add({
        targets: p,
        x: x + Math.cos(angle) * dist,
        y: y + Math.sin(angle) * dist,
        alpha: 0,
        scale: 0.3,
        duration: 460 + Math.random() * 260,
        ease: 'Quad.easeOut',
        onComplete: () => p.destroy(),
      });
    }
  },

  /** A confetti shower from the top — the celebration topper. */
  confetti(scene: Phaser.Scene, count = 40, depth = 25): void {
    if (!motionAllowed()) return;
    for (let i = 0; i < count; i += 1) {
      const x = 120 + Math.random() * 720;
      const piece = scene.add
        .rectangle(x, -20 - Math.random() * 120, 8 + Math.random() * 6, 12 + Math.random() * 6, CONFETTI[i % CONFETTI.length])
        .setDepth(depth)
        .setAngle(Math.random() * 360);
      scene.tweens.add({
        targets: piece,
        y: 580,
        x: x + (Math.random() * 120 - 60),
        angle: piece.angle + (Math.random() * 540 - 270),
        duration: 2200 + Math.random() * 1600,
        delay: Math.random() * 900,
        ease: 'Sine.easeIn',
        onComplete: () => piece.destroy(),
      });
    }
  },

  /**
   * Hit-stop: the single highest-impact "crunch" trick. Briefly freezes visual tweens on a
   * meaningful impact (a brick lands, a fire goes out), then restores — the game-feel equivalent
   * of a sharp intake of breath. Only `tweens.timeScale` is touched (NOT `time.timeScale`), so the
   * restore timer itself still fires on schedule and input/audio never stall. Reduced-motion: no-op.
   */
  hitStop(scene: Phaser.Scene, ms = 70): void {
    if (!motionAllowed()) return;
    scene.tweens.timeScale = 0.0001;
    scene.time.delayedCall(ms, () => {
      scene.tweens.timeScale = 1;
    });
  },

  /**
   * A one-frame white flash over a sprite on impact — reads instantly as "that got hit". Uses
   * setTintFill so it works on any Image/Sprite; restores the prior tint (so an accent-tinted piece
   * keeps its colour). Reduced-motion: no-op.
   */
  flashWhite(scene: Phaser.Scene, target: Phaser.GameObjects.Image, duration = 80): void {
    if (!motionAllowed() || typeof target.setTintMode !== 'function') return;
    const wasTinted = target.isTinted;
    const tint = target.tintTopLeft;
    // Phaser 4: a fill-tint is setTint(colour) + tint mode FILL (setTintFill is the deprecated 0-arg form).
    target.setTint(0xffffff).setTintMode(Phaser.TintModes.FILL);
    scene.time.delayedCall(duration, () => {
      if (!target.active) return;
      target.setTintMode(Phaser.TintModes.MULTIPLY);
      if (wasTinted) target.setTint(tint);
      else target.clearTint();
    });
  },
};
