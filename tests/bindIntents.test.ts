import { describe, expect, it, vi } from 'vitest';
import { bindIntents } from '../src/game/systems/bindIntents';

// A minimal stand-in for Phaser's keyboard/gamepad plugins (EventEmitters).
class FakeEmitter {
  handlers: Record<string, Array<(...args: unknown[]) => void>> = {};
  on(event: string, fn: (...args: unknown[]) => void): void {
    (this.handlers[event] ??= []).push(fn);
  }
  removeAllListeners(event: string): void {
    this.handlers[event] = [];
  }
  emit(event: string, ...args: unknown[]): void {
    (this.handlers[event] ?? []).forEach((fn) => fn(...args));
  }
  count(event: string): number {
    return (this.handlers[event] ?? []).length;
  }
}

function fakeScene() {
  const keyboard = new FakeEmitter();
  const gamepad = new FakeEmitter();
  return { scene: { input: { keyboard, gamepad } } as never, keyboard, gamepad };
}

describe('bindIntents', () => {
  it('clears prior listeners so re-binding never stacks handlers (the input leak)', () => {
    const { scene, keyboard, gamepad } = fakeScene();
    const onConfirm = vi.fn();
    // Two binds simulate a scene.restart() re-running create() — the old leak stacked a second set.
    bindIntents(scene, { onConfirm });
    bindIntents(scene, { onConfirm });
    expect(keyboard.count('keydown')).toBe(1);
    expect(gamepad.count('down')).toBe(1);

    keyboard.emit('keydown', { key: 'Enter' });
    expect(onConfirm).toHaveBeenCalledTimes(1); // exactly once, not twice
  });

  it('routes keyboard + gamepad events to the right handlers', () => {
    const { scene, keyboard, gamepad } = fakeScene();
    const onMove = vi.fn();
    const onConfirm = vi.fn();
    const onBack = vi.fn();
    bindIntents(scene, { onMove, onConfirm, onBack });

    keyboard.emit('keydown', { key: 'ArrowLeft' });
    expect(onMove).toHaveBeenCalledWith(-1, 0);

    keyboard.emit('keydown', { key: 'Escape' });
    expect(onBack).toHaveBeenCalledTimes(1);

    gamepad.emit('down', {}, { index: 0 });
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });
});
