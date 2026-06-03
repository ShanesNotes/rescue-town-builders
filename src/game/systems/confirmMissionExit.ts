import type Phaser from 'phaser';
import { addButton } from '../ui/Button';

// No-Fail mission-exit guard (ADR-0007, issue #18).
//
// A child's in-progress mission work (sorted items, placed parts, sprayed fires) is only
// persisted when the mission COMPLETES. Leaving mid-mission via the Back button or a
// back-intent would silently discard it — a real No-Fail violation for a 6-year-old who
// taps Back by accident. This shows a gentle confirm that DEFAULTS to keep playing; only an
// explicit "Go to Map" leaves. It is a narrow seam, not a runtime (ADR-0007).

const openModals = new WeakSet<Phaser.Scene>();

/** True while an exit-confirm modal is open for this scene; handlers should ignore input. */
export function isMissionExitOpen(scene: Phaser.Scene): boolean {
  return openModals.has(scene);
}

/** Show the gentle exit confirm. `onLeave` runs only if the child explicitly chooses to go. */
export function confirmMissionExit(scene: Phaser.Scene, onLeave: () => void): void {
  if (openModals.has(scene)) return; // never stack (e.g. repeated Back presses)
  openModals.add(scene);

  const depth = 1200;
  const objects: Phaser.GameObjects.GameObject[] = [];
  const dismiss = () => {
    openModals.delete(scene);
    objects.forEach((object) => object.destroy());
  };

  // Full-screen backdrop blocks the game behind; the buttons sit above it (higher depth),
  // so only they receive taps. The backdrop itself does nothing (no accidental dismiss).
  objects.push(scene.add.rectangle(480, 270, 960, 540, 0x10243a, 0.72).setDepth(depth).setInteractive());
  objects.push(scene.add.rectangle(480, 250, 680, 250, 0xfff7dc).setStrokeStyle(4, 0x203247).setDepth(depth));
  objects.push(
    scene.add
      .text(480, 198, 'Keep playing, or go back to the map?', {
        fontFamily: 'Trebuchet MS, Arial, sans-serif',
        fontSize: '26px',
        color: '#203247',
        align: 'center',
        fontStyle: 'bold',
        wordWrap: { width: 620 },
      })
      .setOrigin(0.5)
      .setDepth(depth + 1),
  );
  objects.push(
    scene.add
      .text(480, 244, "Your sticker isn't saved until you finish — that's okay!", {
        fontFamily: 'Trebuchet MS, Arial, sans-serif',
        fontSize: '18px',
        color: '#5a6b7a',
        align: 'center',
      })
      .setOrigin(0.5)
      .setDepth(depth + 1),
  );

  const keep = addButton(scene, {
    x: 330,
    y: 312,
    width: 250,
    height: 72,
    label: '▶ Keep Playing',
    fill: 0x9be7c4,
    onPress: dismiss,
    testId: 'mission.exit.keep',
  });
  const leave = addButton(scene, {
    x: 630,
    y: 312,
    width: 230,
    height: 72,
    label: 'Go to Map',
    fill: 0xffffff,
    onPress: () => {
      dismiss();
      onLeave();
    },
    testId: 'mission.exit.leave',
  });
  keep.setDepth(depth + 1);
  leave.setDepth(depth + 1);
  objects.push(keep, leave);
}
