import type Phaser from 'phaser';
import { inputIntentFromGamepadButton, inputIntentFromKeyboard } from './InputIntent';

export type IntentHandlers = {
  onMove?: (x: -1 | 0 | 1, y: -1 | 0 | 1) => void;
  onConfirm?: () => void;
  onBack?: () => void;
  onHint?: () => void;
};

/**
 * Centralizes the keyboard + gamepad intent binding that every scene needs, and — critically —
 * clears prior listeners FIRST. Without this, a `scene.restart()` (or re-create) stacks another
 * full handler set every time, so one keypress eventually fires N times: the nondeterministic
 * "input sometimes does the wrong thing / fires twice" leak. Call once per `create()`.
 */
export function bindIntents(scene: Phaser.Scene, handlers: IntentHandlers): void {
  scene.input.keyboard?.removeAllListeners('keydown');
  scene.input.gamepad?.removeAllListeners('down');

  const dispatch = (intent: ReturnType<typeof inputIntentFromKeyboard>): void => {
    if (!intent) return;
    if (intent.type === 'move') handlers.onMove?.(intent.x, intent.y);
    else if (intent.type === 'confirm' || intent.type === 'action') handlers.onConfirm?.();
    else if (intent.type === 'back') handlers.onBack?.();
    else if (intent.type === 'hint') handlers.onHint?.();
  };

  scene.input.keyboard?.on('keydown', (event: KeyboardEvent) => dispatch(inputIntentFromKeyboard(event.key)));
  scene.input.gamepad?.on('down', (_pad: unknown, button: { index: number }) => dispatch(inputIntentFromGamepadButton(button.index)));
}
