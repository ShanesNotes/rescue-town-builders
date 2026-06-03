import Phaser from 'phaser';

export type HelperCharacterId = 'rivet' | 'brick' | 'ember';

type SpriteOptions = {
  key: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  alpha?: number;
  angle?: number;
  depth?: number;
  origin?: number;
  pop?: boolean;
  idle?: boolean;
};

type TweenTarget = Phaser.GameObjects.Image | Phaser.GameObjects.Container;

const helperParts: Record<HelperCharacterId, { body: string; face: string; hand: string; fallback: string }> = {
  rivet: {
    body: 'kenney.shape.green-body-circle',
    face: 'kenney.shape.face-happy',
    hand: 'kenney.shape.green-hand-open',
    fallback: 'character.rivet',
  },
  brick: {
    body: 'kenney.shape.yellow-body-squircle',
    face: 'kenney.shape.face-calm',
    hand: 'kenney.shape.yellow-hand-open',
    fallback: 'character.brick',
  },
  ember: {
    body: 'kenney.shape.red-body-circle',
    face: 'kenney.shape.face-bright',
    hand: 'kenney.shape.red-hand-open',
    fallback: 'character.ember',
  },
};

export function hasTexture(scene: Phaser.Scene, key: string): boolean {
  return scene.textures.exists(key);
}

export function motionAllowed(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return true;
  return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function addSprite(scene: Phaser.Scene, options: SpriteOptions): Phaser.GameObjects.Image | null {
  if (!hasTexture(scene, options.key)) return null;
  const sprite = scene.add.image(options.x, options.y, options.key);
  if (options.width && options.height) sprite.setDisplaySize(options.width, options.height);
  if (options.alpha !== undefined) sprite.setAlpha(options.alpha);
  if (options.angle !== undefined) sprite.setAngle(options.angle);
  if (options.depth !== undefined) sprite.setDepth(options.depth);
  if (options.origin !== undefined) sprite.setOrigin(options.origin);
  if (options.pop) softPop(scene, sprite);
  if (options.idle) idleBob(scene, sprite);
  return sprite;
}

export function addHelperAvatar(
  scene: Phaser.Scene,
  id: HelperCharacterId,
  x: number,
  y: number,
  size: number,
  options: { idle?: boolean; pop?: boolean; alpha?: number; depth?: number } = {},
): TweenTarget | null {
  const parts = helperParts[id];
  if (!hasTexture(scene, parts.body) || !hasTexture(scene, parts.face) || !hasTexture(scene, parts.hand)) {
    return addSprite(scene, {
      key: parts.fallback,
      x,
      y,
      width: size,
      height: size,
      alpha: options.alpha,
      depth: options.depth,
      idle: options.idle,
      pop: options.pop,
    });
  }

  const container = scene.add.container(x, y);
  if (options.alpha !== undefined) container.setAlpha(options.alpha);
  if (options.depth !== undefined) container.setDepth(options.depth);

  const shadow = hasTexture(scene, 'kenney.shape.shadow')
    ? scene.add.image(0, size * 0.38, 'kenney.shape.shadow').setDisplaySize(size * 0.86, size * 0.18).setAlpha(0.28)
    : null;
  const body = scene.add.image(0, 0, parts.body).setDisplaySize(size, size);
  const face = scene.add.image(0, -size * 0.03, parts.face).setDisplaySize(size * 0.58, size * 0.34);
  const leftHand = scene.add.image(-size * 0.47, size * 0.03, parts.hand).setDisplaySize(size * 0.28, size * 0.24);
  const rightHand = scene.add.image(size * 0.47, size * 0.03, parts.hand).setDisplaySize(size * 0.28, size * 0.24).setFlipX(true);

  container.add(shadow ? [shadow, body, leftHand, rightHand, face] : [body, leftHand, rightHand, face]);
  container.setSize(size, size);
  if (options.pop) softPop(scene, container);
  if (options.idle) idleBob(scene, container);
  return container;
}

export function softPop(scene: Phaser.Scene, target: TweenTarget): void {
  if (!motionAllowed()) return;
  const scaleX = target.scaleX;
  const scaleY = target.scaleY;
  target.setScale(scaleX * 0.9, scaleY * 0.9).setAlpha(Math.max(0.01, target.alpha * 0.65));
  scene.tweens.add({
    targets: target,
    scaleX,
    scaleY,
    alpha: target.alpha / 0.65,
    duration: 180,
    ease: 'Back.Out',
  });
}

export function idleBob(scene: Phaser.Scene, target: TweenTarget, distance = 5): void {
  if (!motionAllowed()) return;
  scene.tweens.add({
    targets: target,
    y: target.y - distance,
    duration: 1150,
    yoyo: true,
    repeat: -1,
    ease: 'Sine.easeInOut',
  });
}

export function shrinkAndFade(scene: Phaser.Scene, target: TweenTarget): void {
  if (!motionAllowed()) {
    target.setAlpha(0.25);
    return;
  }
  scene.tweens.add({
    targets: target,
    scaleX: target.scaleX * 0.45,
    scaleY: target.scaleY * 0.45,
    alpha: 0,
    duration: 340,
    ease: 'Sine.easeOut',
  });
}
