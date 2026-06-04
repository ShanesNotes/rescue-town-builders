import Phaser from 'phaser';
import { hasTexture, motionAllowed } from './Sprite';

export const DEFAULT_ANIMATION_FRAME_RATE = 8;

export type AnimatedSpriteLoop = {
  readonly name: string;
  readonly start: number;
  readonly end: number;
  readonly frameRate?: number;
  readonly repeat?: number;
};

export type AnimatedSpriteOptions = {
  readonly key: string;
  readonly x: number;
  readonly y: number;
  readonly loop: AnimatedSpriteLoop;
  readonly width?: number;
  readonly height?: number;
  readonly alpha?: number;
  readonly depth?: number;
  readonly origin?: number;
  readonly frame?: number;
};

export function animationKey(textureKey: string, loopName: string): string {
  return `${textureKey}.${loopName}`;
}

export function resolveLoopTiming(loop: AnimatedSpriteLoop): { frameRate: number; repeat: number } {
  return {
    frameRate: loop.frameRate ?? DEFAULT_ANIMATION_FRAME_RATE,
    repeat: loop.repeat ?? -1,
  };
}

export function ensureAnimation(scene: Phaser.Scene, textureKey: string, loop: AnimatedSpriteLoop): string | null {
  if (!hasTexture(scene, textureKey)) return null;
  if (loop.end < loop.start) return null;

  const key = animationKey(textureKey, loop.name);
  if (scene.anims.exists(key)) return key;

  const timing = resolveLoopTiming(loop);
  scene.anims.create({
    key,
    frames: scene.anims.generateFrameNumbers(textureKey, { start: loop.start, end: loop.end }),
    frameRate: timing.frameRate,
    repeat: timing.repeat,
  });
  return key;
}

export function playNamedLoop(
  scene: Phaser.Scene,
  sprite: Phaser.GameObjects.Sprite,
  textureKey: string,
  loop: AnimatedSpriteLoop,
): void {
  if (!motionAllowed()) {
    sprite.anims.stop();
    sprite.setFrame(loop.start);
    return;
  }

  const key = ensureAnimation(scene, textureKey, loop);
  if (key) sprite.play(key);
}

export function addAnimatedSprite(scene: Phaser.Scene, options: AnimatedSpriteOptions): Phaser.GameObjects.Sprite | null {
  if (!hasTexture(scene, options.key)) return null;

  const sprite = scene.add.sprite(options.x, options.y, options.key, options.frame ?? options.loop.start);
  if (options.width && options.height) sprite.setDisplaySize(options.width, options.height);
  if (options.alpha !== undefined) sprite.setAlpha(options.alpha);
  if (options.depth !== undefined) sprite.setDepth(options.depth);
  if (options.origin !== undefined) sprite.setOrigin(options.origin);
  playNamedLoop(scene, sprite, options.key, options.loop);
  return sprite;
}
