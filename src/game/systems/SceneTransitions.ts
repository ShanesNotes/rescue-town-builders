import type Phaser from 'phaser';
import { isE2EEnabled } from './E2EBridge';
import { motionAllowed } from '../ui/Sprite';

export const SOFT_TRANSITION = {
  fadeInMs: 160,
  red: 255,
  green: 255,
  blue: 255,
} as const;

// The fade-OUT softens the old pure-white hard cut toward the warm cream already in the palette,
// so leaving a scene feels like a gentle dim, not a camera flash (P2-03).
export const SOFT_FADE_OUT = {
  fadeOutMs: 150,
  red: 0xff,
  green: 0xf4,
  blue: 0xd6, // warm cream (0xfff4d6), not pure white
} as const;

export function fadeInScene(scene: Phaser.Scene): void {
  scene.cameras.main.fadeIn(SOFT_TRANSITION.fadeInMs, SOFT_TRANSITION.red, SOFT_TRANSITION.green, SOFT_TRANSITION.blue);
}

// Fade the camera to warm cream, then start the next scene on completion — a soft cross-dim instead
// of an instant hard cut (P2-03). Gated on motionAllowed(); INSTANT under e2e so specs never slow or
// flake (the destination scene's own fadeInScene still plays). The start callback is what actually
// navigates, so callers route their scene.start through here.
const fadingScenes = new WeakSet<Phaser.Scene>();

export function fadeOutAndStart(scene: Phaser.Scene, start: () => void): void {
  if (isE2EEnabled() || !motionAllowed()) {
    start();
    return;
  }
  // A young child taps fast: once a fade is underway, ignore further hub taps so two different
  // destinations can't both fire on the single fadeout-complete (first tap wins — never the wrong scene).
  if (fadingScenes.has(scene)) return;
  fadingScenes.add(scene);
  const cam = scene.cameras.main;
  cam.once('camerafadeoutcomplete', () => {
    fadingScenes.delete(scene);
    start();
  });
  cam.fadeOut(SOFT_FADE_OUT.fadeOutMs, SOFT_FADE_OUT.red, SOFT_FADE_OUT.green, SOFT_FADE_OUT.blue);
}
