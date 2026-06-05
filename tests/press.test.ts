import { describe, expect, it, vi } from 'vitest';
import { bindPress } from '../src/game/ui/press';

// A minimal fake of the only Phaser surface bindPress touches: target.on(event, handler).
// The e2e drives buttons through the E2EBridge (direct handler calls), so this is the only
// automated coverage of the real pointer-confirm semantics — the most-used input primitive.
function fakeTarget() {
  const handlers: Record<string, Array<() => void>> = {};
  return {
    on(event: string, cb: () => void) {
      (handlers[event] ??= []).push(cb);
      return this;
    },
    emit(event: string) {
      (handlers[event] ?? []).forEach((cb) => cb());
    },
  };
}
type Target = Parameters<typeof bindPress>[0];

describe('bindPress — the shared hardened down-up press model (CF-8)', () => {
  it('confirms on a down then up on the same target', () => {
    const onConfirm = vi.fn();
    const t = fakeTarget();
    bindPress(t as unknown as Target, { onConfirm });
    t.emit('pointerdown');
    t.emit('pointerup');
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('never confirms on a stray pointerup with no preceding pointerdown', () => {
    const onConfirm = vi.fn();
    const t = fakeTarget();
    bindPress(t as unknown as Target, { onConfirm });
    t.emit('pointerup');
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it('disarms on pointerout so a slide-off-then-release is a no-op (ghost-tap guard)', () => {
    const onConfirm = vi.fn();
    const t = fakeTarget();
    bindPress(t as unknown as Target, { onConfirm });
    t.emit('pointerdown');
    t.emit('pointerout');
    t.emit('pointerup');
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it('disarms on pointercancel', () => {
    const onConfirm = vi.fn();
    const t = fakeTarget();
    bindPress(t as unknown as Target, { onConfirm });
    t.emit('pointerdown');
    t.emit('pointercancel');
    t.emit('pointerup');
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it('fires onDown immediately on pointerdown', () => {
    const onDown = vi.fn();
    const t = fakeTarget();
    bindPress(t as unknown as Target, { onDown, onConfirm: () => undefined });
    t.emit('pointerdown');
    expect(onDown).toHaveBeenCalledTimes(1);
  });

  it('re-arms for a second tap after a completed press', () => {
    const onConfirm = vi.fn();
    const t = fakeTarget();
    bindPress(t as unknown as Target, { onConfirm });
    t.emit('pointerdown');
    t.emit('pointerup');
    t.emit('pointerdown');
    t.emit('pointerup');
    expect(onConfirm).toHaveBeenCalledTimes(2);
  });
});
