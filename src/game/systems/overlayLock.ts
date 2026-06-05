import type Phaser from 'phaser';

// Shared overlay input-lock (Wave 8 CF-1). Pointer-only veils — the MissionIntro beat and the House
// title card — visually cover the gameplay but do NOT block keyboard/gamepad intents, so a confirm/
// back press underneath could mutate mission state the child can't even see. While such an overlay
// is up, the owning scene marks itself locked; intent handlers honor isOverlayOpen() exactly like
// isMissionExitOpen(), so keyboard/gamepad confirm/back do nothing instead of acting blind.
//
// Counted (not boolean) so stacked overlays — a House title card that appears over a still-fading
// intro — both have to clear before input is live again.

const counts = new WeakMap<Phaser.Scene, number>();

/** True while at least one pointer-only overlay is visible on this scene. */
export function isOverlayOpen(scene: Phaser.Scene): boolean {
  return (counts.get(scene) ?? 0) > 0;
}

/** Mark one overlay open. Returns a release fn (idempotent) the overlay calls when it dismisses. */
export function lockOverlay(scene: Phaser.Scene): () => void {
  counts.set(scene, (counts.get(scene) ?? 0) + 1);
  let released = false;
  return () => {
    if (released) return;
    released = true;
    counts.set(scene, Math.max(0, (counts.get(scene) ?? 0) - 1));
  };
}
