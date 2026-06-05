import type Phaser from 'phaser';

/**
 * Robust press model: confirm on pointerUP, but only when a pointerDOWN began on THIS target.
 * pointerdown-to-confirm (the old model) fired at touch-start, so drags, scrolls, and taps that
 * landed mid-teardown registered spuriously — the "buttons sometimes don't work" bug. Releasing
 * elsewhere never confirms; pressing-and-releasing on the control always does.
 *
 * The caller must have already made `target` interactive. Disarm on pointerout/pointercancel so a
 * later stray pointerup can never fire a "ghost tap" — the exact swipe-everything behavior a young
 * child exhibits. CF-8: this is the single shared helper for every tap-confirm target in the game.
 */
export function bindPress(target: Phaser.GameObjects.GameObject, handlers: { onDown?: () => void; onConfirm: () => void }): void {
  let armed = false;
  target.on('pointerdown', () => {
    armed = true;
    handlers.onDown?.();
  });
  target.on('pointerup', () => {
    if (!armed) return;
    armed = false;
    handlers.onConfirm();
  });
  const disarm = (): void => {
    armed = false;
  };
  target.on('pointerout', disarm);
  target.on('pointercancel', disarm);
}
