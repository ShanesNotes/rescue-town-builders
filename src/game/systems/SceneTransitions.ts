import type Phaser from 'phaser';

export const SOFT_TRANSITION = {
  fadeInMs: 160,
  fadeOutMs: 140,
  red: 255,
  green: 255,
  blue: 255,
} as const;

export function fadeInScene(scene: Phaser.Scene): void {
  scene.cameras.main.fadeIn(SOFT_TRANSITION.fadeInMs, SOFT_TRANSITION.red, SOFT_TRANSITION.green, SOFT_TRANSITION.blue);
}

export function transitionToScene(scene: Phaser.Scene, key: string, data?: object): void {
  scene.cameras.main.fadeOut(SOFT_TRANSITION.fadeOutMs, SOFT_TRANSITION.red, SOFT_TRANSITION.green, SOFT_TRANSITION.blue);
  scene.time.delayedCall(SOFT_TRANSITION.fadeOutMs, () => scene.scene.start(key, data));
}
