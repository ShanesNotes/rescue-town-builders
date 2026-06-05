import Phaser from 'phaser';
import { motionAllowed } from './Sprite';

// Shared sustained-hold controller (Wave 2). A single press must NEVER pass — the fill only
// completes after a continuous DOWN of `durationMs` across pointer, keyboard, AND gamepad. Any
// up / release / blur cancels. This closes the gamepad parent-gate bypass (P0-04): previously a
// gamepad A-tap started the timer with no button-up cancel, so one tap walked through.
//
// `hit` is the interactive pointer target; the controller wires pointerdown/up/out on it and
// owns the keyboard (key-down/up) + gamepad (button-down/up) + blur listeners, tearing them ALL
// down on destroy so nothing leaks. Pass `fill` (an Arc scaled 0→1) for the visible progress ring.

export type HoldGateOptions = {
  scene: Phaser.Scene;
  hit: Phaser.GameObjects.GameObject & { on: Phaser.GameObjects.GameObject['on'] };
  fill: Phaser.GameObjects.Arc;
  durationMs: number;
  onComplete: () => void;
  onStart?: () => void;
  onCancel?: () => void;
};

export type HoldGateHandle = {
  /** Remove every listener and kill the fill tween. Idempotent. */
  destroy: () => void;
};

export function createHoldGate(options: HoldGateOptions): HoldGateHandle {
  const { scene, hit, fill, durationMs, onComplete, onStart, onCancel } = options;
  let timer: Phaser.Time.TimerEvent | null = null;
  let destroyed = false;

  const start = (): void => {
    if (destroyed || timer) return; // already holding
    onStart?.();
    if (motionAllowed()) {
      scene.tweens.killTweensOf(fill);
      fill.setScale(0);
      scene.tweens.add({ targets: fill, scale: 1, duration: durationMs, ease: 'Linear' });
    }
    timer = scene.time.delayedCall(durationMs, () => {
      timer = null;
      onComplete();
    });
  };

  const cancel = (): void => {
    if (!timer) return;
    timer.remove(false);
    timer = null;
    scene.tweens.killTweensOf(fill);
    fill.setScale(0);
    onCancel?.();
  };

  // Pointer: down starts, up/out cancels.
  hit.on('pointerdown', start);
  hit.on('pointerup', cancel);
  hit.on('pointerout', cancel);

  // Keyboard: only the CONFIRM keys (Enter / Space) start the hold; key UP cancels (CF-9). Escape is
  // a back intent, NOT a hold-start — it must never arm the gate. keyup is unconditional so releasing
  // the confirm key always cancels even if another key was pressed meanwhile.
  const isHoldKey = (key: string): boolean => key === 'Enter' || key === ' ' || key === 'Spacebar';
  const onKeyDown = (event: KeyboardEvent): void => {
    if (event.repeat) return; // auto-repeat must not re-arm; the original down already started it
    if (!isHoldKey(event.key)) return; // Escape/arrows/etc. don't start the hold
    start();
  };
  const onKeyUp = (): void => cancel();
  scene.input.keyboard?.on('keydown', onKeyDown);
  scene.input.keyboard?.on('keyup', onKeyUp);

  // Gamepad: only A (button 0) starts the hold; B (button 1) is back and must NOT start it, and the
  // d-pad must not either (CF-9). button UP cancels (the original bypass fix — there was no up before).
  const onPadDown = (_pad: unknown, button: { index: number }): void => {
    if (button.index !== 0) return; // only A arms the gate
    start();
  };
  const onPadUp = (): void => cancel();
  scene.input.gamepad?.on('down', onPadDown);
  scene.input.gamepad?.on('up', onPadUp);

  // Losing focus mid-hold (alt-tab, etc.) must cancel — a child can't "keep holding" a blurred tab.
  const onBlur = (): void => cancel();
  scene.game.events.on(Phaser.Core.Events.BLUR, onBlur);

  const destroy = (): void => {
    if (destroyed) return;
    destroyed = true;
    cancel();
    hit.off('pointerdown', start);
    hit.off('pointerup', cancel);
    hit.off('pointerout', cancel);
    scene.input.keyboard?.off('keydown', onKeyDown);
    scene.input.keyboard?.off('keyup', onKeyUp);
    scene.input.gamepad?.off('down', onPadDown);
    scene.input.gamepad?.off('up', onPadUp);
    scene.game.events.off(Phaser.Core.Events.BLUR, onBlur);
  };

  scene.events.once(Phaser.Scenes.Events.SHUTDOWN, destroy);
  scene.events.once(Phaser.Scenes.Events.DESTROY, destroy);

  return { destroy };
}
