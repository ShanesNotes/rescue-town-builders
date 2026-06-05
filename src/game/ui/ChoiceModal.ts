import Phaser from 'phaser';
import { addButton } from './Button';
import { motionAllowed } from './Sprite';
import { FONTS } from './typography';

// Shared child-safe choice/focus controller (Wave 2 spine).
//
// Renders a backdrop + panel + 2-3 big picture-first choice buttons, each with an icon glyph and a
// short caption, and gives FULL input parity so no child is ever soft-locked:
//   - Pointer: each choice reuses addButton (bindPress + tap SFX + E2E registration come for free).
//   - Keyboard: Left/Right (and Up/Down) move a VISIBLE pulsing focus ring; Enter/Space activate the
//     focused choice; Escape activates the designated SAFE choice.
//   - Gamepad: d-pad moves focus; A (button 0) activates focused; B (button 1) activates SAFE.
// On close it removes ALL listeners (keyboard + gamepad + per-object) and destroys every object, so
// nothing leaks across opens. A No-Fail seam, not a runtime.

export type ChoiceModalButton = {
  /** Large glyph shown above the caption (e.g. '▶', '🏠'). */
  icon: string;
  /** Short caption under the icon. */
  caption: string;
  /** Pointer/keyboard/gamepad activation handler. */
  onPress: () => void;
  /** E2E testId — must be preserved for existing specs. */
  testId: string;
  /** Fill color of the button panel. */
  fill?: number;
  /** Marks the SAFE/default choice: focused on open, and the target of Escape/B/back. */
  safe?: boolean;
};

export type ChoiceModalOptions = {
  title: string;
  subtitle?: string;
  buttons: ChoiceModalButton[];
};

export type ChoiceModalHandle = {
  /** Tear down all objects + listeners. Idempotent. */
  close: () => void;
};

const DEPTH = 1200;

/**
 * Open a child-safe choice modal on `scene`. Returns a handle; the modal also auto-closes itself
 * when any choice is activated (the choice's own onPress runs after teardown).
 */
export function openChoiceModal(scene: Phaser.Scene, options: ChoiceModalOptions): ChoiceModalHandle {
  const objects: Phaser.GameObjects.GameObject[] = [];
  const focusRings: Phaser.GameObjects.Rectangle[] = [];
  const safeIndex = Math.max(0, options.buttons.findIndex((b) => b.safe));
  let focusIndex = safeIndex;
  let closed = false;

  // --- backdrop + panel -----------------------------------------------------------------------
  const panelW = options.buttons.length >= 3 ? 760 : 680;
  const panelH = 270;
  objects.push(scene.add.rectangle(480, 270, 960, 540, 0x10243a, 0.72).setDepth(DEPTH).setInteractive());
  objects.push(scene.add.rectangle(480, 250, panelW, panelH, 0xfff7dc).setStrokeStyle(4, 0x203247).setDepth(DEPTH));
  objects.push(
    scene.add
      .text(480, 168, options.title, {
        fontFamily: FONTS.display,
        fontSize: '30px',
        color: '#203247',
        align: 'center',
        fontStyle: 'bold',
        wordWrap: { width: panelW - 60 },
      })
      .setOrigin(0.5)
      .setDepth(DEPTH + 1),
  );
  if (options.subtitle) {
    objects.push(
      scene.add
        .text(480, 206, options.subtitle, {
          fontFamily: FONTS.label,
          fontSize: '15px',
          color: '#7a8a99',
          align: 'center',
          wordWrap: { width: panelW - 80 },
        })
        .setOrigin(0.5)
        .setDepth(DEPTH + 1),
    );
  }

  // --- choices --------------------------------------------------------------------------------
  const count = options.buttons.length;
  const slot = panelW / count;
  const firstX = 480 - panelW / 2 + slot / 2;
  const btnY = 322;
  const btnW = Math.min(260, slot - 24);

  options.buttons.forEach((choice, index) => {
    const x = firstX + index * slot;

    // Visible pulsing focus ring (behind the button), shown only on the focused choice.
    const ring = scene.add
      .rectangle(x, btnY, btnW + 22, 100, 0x000000, 0)
      .setStrokeStyle(6, 0xffc857, 1)
      .setDepth(DEPTH + 1)
      .setVisible(false);
    focusRings.push(ring);
    objects.push(ring);

    const button = addButton(scene, {
      x,
      y: btnY,
      width: btnW,
      height: 88,
      label: `${choice.icon}\n${choice.caption}`,
      fill: choice.fill,
      onPress: () => activate(index),
      testId: choice.testId,
    });
    button.setDepth(DEPTH + 2);
    objects.push(button);
  });

  // --- focus + activation ---------------------------------------------------------------------
  function paintFocus(): void {
    focusRings.forEach((ring, index) => {
      const on = index === focusIndex;
      ring.setVisible(on);
      scene.tweens.killTweensOf(ring);
      ring.setScale(1);
      if (on && motionAllowed()) {
        scene.tweens.add({ targets: ring, scale: 1.06, duration: 620, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
      }
    });
  }

  function moveFocus(delta: -1 | 1): void {
    focusIndex = (focusIndex + delta + count) % count;
    paintFocus();
  }

  function activate(index: number): void {
    if (closed) return;
    const handler = options.buttons[index]?.onPress;
    close();
    handler?.();
  }

  // --- keyboard + gamepad listeners (own teardown) --------------------------------------------
  const onKey = (event: KeyboardEvent): void => {
    if (closed) return;
    switch (event.key) {
      case 'ArrowLeft':
      case 'a':
      case 'A':
      case 'ArrowUp':
      case 'w':
      case 'W':
        moveFocus(-1);
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
      case 'ArrowDown':
      case 's':
      case 'S':
        moveFocus(1);
        break;
      case 'Enter':
      case ' ':
      case 'Spacebar':
        activate(focusIndex);
        break;
      case 'Escape':
        activate(safeIndex);
        break;
      default:
        break;
    }
  };

  const onPad = (_pad: unknown, button: { index: number }): void => {
    if (closed) return;
    switch (button.index) {
      case 14: // d-pad left
      case 12: // d-pad up
        moveFocus(-1);
        break;
      case 15: // d-pad right
      case 13: // d-pad down
        moveFocus(1);
        break;
      case 0: // A
        activate(focusIndex);
        break;
      case 1: // B → safe
        activate(safeIndex);
        break;
      default:
        break;
    }
  };

  scene.input.keyboard?.on('keydown', onKey);
  scene.input.gamepad?.on('down', onPad);

  function close(): void {
    if (closed) return;
    closed = true;
    scene.input.keyboard?.off('keydown', onKey);
    scene.input.gamepad?.off('down', onPad);
    objects.forEach((object) => {
      scene.tweens.killTweensOf(object);
      object.destroy();
    });
    objects.length = 0;
    focusRings.length = 0;
  }

  paintFocus();
  return { close };
}
