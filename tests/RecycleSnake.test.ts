import { describe, expect, it } from 'vitest';
import {
  collectItemById,
  createRecycleSnakeState,
  getRecycleSnakeResult,
  isOpposite,
  setDirection,
  step,
  type RecycleSnakeLevel,
} from '../src/game/systems/RecycleSnake';

const LEVEL: RecycleSnakeLevel = {
  cols: 6,
  rows: 4,
  startX: 0,
  startY: 0,
  items: [
    { id: 'a', x: 1, y: 0, category: 'paper' },
    { id: 'b', x: 3, y: 0, category: 'metal' },
  ],
};

describe('RecycleSnake no-fail logic', () => {
  it('rejects a level with no items', () => {
    expect(() => createRecycleSnakeState({ ...LEVEL, items: [] })).toThrow();
  });

  it('starts as a single-cell cart heading right', () => {
    const s = createRecycleSnakeState(LEVEL);
    expect(s.body).toHaveLength(1);
    expect(s.dir).toEqual({ x: 1, y: 0 });
    expect(s.total).toBe(2);
    expect(s.completed).toBe(false);
  });

  it('ignores a 180° reverse once it has a tail, but allows it while length 1', () => {
    let s = createRecycleSnakeState(LEVEL);
    // length 1: a reverse is allowed (no tail to hit)
    s = setDirection(s, { x: -1, y: 0 });
    expect(s.pendingDir).toEqual({ x: -1, y: 0 });
    // grow a tail, then a reverse must be ignored
    s = createRecycleSnakeState(LEVEL);
    s = step(s); // eats 'a' at (1,0), body length 2, dir right
    expect(s.body.length).toBe(2);
    const before = s.pendingDir;
    s = setDirection(s, { x: -1, y: 0 }); // opposite of right -> ignored
    expect(s.pendingDir).toEqual(before);
  });

  it('picks up an item under the new head and grows the tail', () => {
    let s = createRecycleSnakeState(LEVEL);
    s = step(s); // head 0,0 -> 1,0 where item 'a' sits
    expect(s.collectedThisStep).toBe('paper');
    expect(s.collected).toEqual(['paper']);
    expect(s.body).toHaveLength(2);
    expect(s.items.map((i) => i.id)).toEqual(['b']);
  });

  it('keeps constant length when no item is eaten', () => {
    let s = createRecycleSnakeState(LEVEL);
    s = step(s); // eat a -> length 2
    s = step(s); // 1,0 -> 2,0 (no item) -> length stays 2
    expect(s.body).toHaveLength(2);
    expect(s.body[0]).toEqual({ x: 2, y: 0 });
  });

  it('wraps around walls instead of dying (no-fail)', () => {
    let s = createRecycleSnakeState({ ...LEVEL, items: [{ id: 'z', x: 0, y: 0, category: 'paper' }], startX: 5, startY: 0 });
    // The single item is filtered off the start cell, so re-add one elsewhere for a valid state:
    s = createRecycleSnakeState({ ...LEVEL, startX: 5, startY: 0, items: [{ id: 'z', x: 2, y: 2, category: 'paper' }] });
    s = step(s); // x 5 -> wrap to 0
    expect(s.body[0]).toEqual({ x: 0, y: 0 });
  });

  it('completes when every item is collected, and the result keeps the recycling sticker/missionId', () => {
    let s = createRecycleSnakeState(LEVEL);
    s = collectItemById(s, 'a');
    expect(s.completed).toBe(false);
    s = collectItemById(s, 'b');
    expect(s.completed).toBe(true);
    const r = getRecycleSnakeResult(s);
    expect(r.missionId).toBe('recycling-run');
    expect(r.stickersUnlocked).toContain('recycling-run-starter');
    expect(r.stars).toBe(3);
  });

  it('isOpposite is true only for exact reverses', () => {
    expect(isOpposite({ x: 1, y: 0 }, { x: -1, y: 0 })).toBe(true);
    expect(isOpposite({ x: 0, y: 1 }, { x: 0, y: -1 })).toBe(true);
    expect(isOpposite({ x: 1, y: 0 }, { x: 0, y: 1 })).toBe(false);
    expect(isOpposite({ x: 0, y: 0 }, { x: 0, y: 0 })).toBe(false);
  });
});
