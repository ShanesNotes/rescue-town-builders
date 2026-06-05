import { describe, expect, it } from 'vitest';
import {
  catchDream,
  createDreamCatchState,
  dreamCatchProgress,
  getDreamCatchResult,
  missDream,
  type DreamCatchLevel,
} from '../src/game/systems/DreamCatch';

const LEVEL: DreamCatchLevel = { goalDreams: 3, types: ['sun', 'moon', 'sun'] };

describe('DreamCatch no-fail logic', () => {
  it('rejects a level with no goal', () => {
    expect(() => createDreamCatchState({ ...LEVEL, goalDreams: 0 })).toThrow();
  });

  it('starts empty and incomplete', () => {
    const s = createDreamCatchState(LEVEL);
    expect(s.caught).toBe(0);
    expect(s.completed).toBe(false);
    expect(dreamCatchProgress(s)).toBe(0);
  });

  it('completes once the goal of dreams is caught', () => {
    let s = createDreamCatchState(LEVEL);
    s = catchDream(s);
    s = catchDream(s);
    expect(s.completed).toBe(false);
    s = catchDream(s);
    expect(s.completed).toBe(true);
    expect(dreamCatchProgress(s)).toBe(1);
  });

  it('a miss never blocks completion (no-fail) and never decrements progress', () => {
    let s = createDreamCatchState(LEVEL);
    s = missDream(s);
    s = missDream(s);
    expect(s.caught).toBe(0);
    expect(s.completed).toBe(false);
    s = catchDream(s);
    s = catchDream(s);
    s = catchDream(s);
    expect(s.completed).toBe(true);
    expect(s.missed).toBe(2);
  });

  it('caught counter never overshoots after completion', () => {
    let s = createDreamCatchState({ ...LEVEL, goalDreams: 1 });
    s = catchDream(s);
    s = catchDream(s); // already complete -> ignored
    expect(s.caught).toBe(1);
  });

  it('scores 3 stars clean, fewer with many misses, keeps the inverse-dream sticker/missionId', () => {
    let clean = createDreamCatchState(LEVEL);
    clean = catchDream(catchDream(catchDream(clean)));
    const cr = getDreamCatchResult(clean);
    expect(cr.stars).toBe(3);
    expect(cr.missionId).toBe('inverse-dream');
    expect(cr.stickersUnlocked).toContain('inverse-dream-starter');

    let messy = createDreamCatchState(LEVEL);
    for (let i = 0; i < 8; i += 1) messy = missDream(messy);
    messy = catchDream(catchDream(catchDream(messy)));
    expect(getDreamCatchResult(messy).stars).toBeLessThan(3);
  });
});
