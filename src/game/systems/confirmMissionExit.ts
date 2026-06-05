import type Phaser from 'phaser';
import { openChoiceModal, type ChoiceModalHandle } from '../ui/ChoiceModal';

// No-Fail mission-exit guard (ADR-0007, issue #18).
//
// A child's in-progress mission work (sorted items, placed parts, sprayed fires) is only
// persisted when the mission COMPLETES. Leaving mid-mission via the Back button or a
// back-intent would silently discard it — a real No-Fail violation for a 6-year-old who
// taps Back by accident. This shows a gentle, picture-first confirm that DEFAULTS to keep
// playing (Escape / gamepad-B / back-intent all land on Keep Playing); only an explicit
// "Go to Map" leaves. It is a narrow seam, not a runtime (ADR-0007).
//
// Built on the shared child-safe ChoiceModal so a keyboard- or gamepad-only child gets a
// visible pulsing focus ring and Left/Right/Enter/A parity, and can never be soft-locked.

const openHandles = new WeakMap<Phaser.Scene, ChoiceModalHandle>();

/** True while an exit-confirm modal is open for this scene; handlers should ignore input. */
export function isMissionExitOpen(scene: Phaser.Scene): boolean {
  return openHandles.has(scene);
}

/** Show the gentle exit confirm. `onLeave` runs only if the child explicitly chooses to go. */
export function confirmMissionExit(scene: Phaser.Scene, onLeave: () => void): void {
  if (openHandles.has(scene)) return; // never stack (e.g. repeated Back presses)

  const handle = openChoiceModal(scene, {
    title: 'Keep playing?',
    subtitle: 'Finish to keep your sticker — no worries either way.',
    buttons: [
      {
        icon: '▶',
        caption: 'Keep Playing',
        fill: 0x9be7c4, // happy green — the SAFE default
        safe: true,
        testId: 'mission.exit.keep',
        onPress: () => openHandles.delete(scene),
      },
      {
        icon: '🏠',
        caption: 'Go to Map',
        fill: 0xffffff,
        testId: 'mission.exit.leave',
        onPress: () => {
          openHandles.delete(scene);
          onLeave();
        },
      },
    ],
  });

  openHandles.set(scene, handle);
}
