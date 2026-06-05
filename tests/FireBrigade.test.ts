import { describe, expect, it } from 'vitest';
import {
  applyHelper,
  countSpray,
  createFireBrigadeState,
  douseFire,
  getFireBrigadeResult,
  liveFires,
  nearestLiveFire,
  type BrigadeFireSpec,
} from '../src/game/systems/FireBrigade';

const SPECS: BrigadeFireSpec[] = [
  { id: 'a', x: 100, y: 100, heat: 2 },
  { id: 'b', x: 500, y: 300, heat: 1 },
];

describe('FireBrigade no-fail logic', () => {
  it('rejects a level with no fires', () => {
    expect(() => createFireBrigadeState([])).toThrow();
  });

  it('starts with all fires lit and incomplete', () => {
    const s = createFireBrigadeState(SPECS);
    expect(liveFires(s)).toHaveLength(2);
    expect(s.completed).toBe(false);
  });

  it('douses a fire and reports when it goes out', () => {
    let s = createFireBrigadeState(SPECS);
    let r = douseFire(s, 'a');
    expect(r.hit).toBe(true);
    expect(r.out).toBe(false); // heat 2 -> 1
    s = r.state;
    r = douseFire(s, 'a');
    expect(r.out).toBe(true); // heat 1 -> 0
    expect(liveFires(r.state)).toHaveLength(1);
  });

  it('ignores dousing an already-out fire (no negative heat, no false hit)', () => {
    let s = createFireBrigadeState(SPECS);
    s = douseFire(s, 'b').state; // b heat 1 -> 0
    const r = douseFire(s, 'b');
    expect(r.hit).toBe(false);
    expect(r.state.fires.find((f) => f.id === 'b')?.heat).toBe(0);
  });

  it('completes only when every fire is out', () => {
    let s = createFireBrigadeState(SPECS);
    s = douseFire(s, 'a').state;
    s = douseFire(s, 'a').state;
    expect(s.completed).toBe(false);
    s = douseFire(s, 'b').state;
    expect(s.completed).toBe(true);
  });

  it('the helper floor always cools the weakest live fire and can finish the round', () => {
    let s = createFireBrigadeState(SPECS);
    for (let i = 0; i < 10 && !s.completed; i += 1) s = applyHelper(s);
    expect(s.completed).toBe(true);
    expect(s.helperAssists).toBeGreaterThan(0);
  });

  it('finds the nearest live fire and skips out ones', () => {
    let s = createFireBrigadeState(SPECS);
    expect(nearestLiveFire(s, 110, 110)?.id).toBe('a');
    s = douseFire(s, 'a').state;
    s = douseFire(s, 'a').state;
    expect(nearestLiveFire(s, 110, 110)?.id).toBe('b'); // a is out, b is the only one left
  });

  it('scores 3 stars clean, fewer with helpers, and keeps the fire-fix sticker + missionId', () => {
    let clean = createFireBrigadeState(SPECS);
    clean = countSpray(clean);
    clean = douseFire(clean, 'a').state;
    clean = douseFire(clean, 'a').state;
    clean = douseFire(clean, 'b').state;
    const cr = getFireBrigadeResult(clean);
    expect(cr.stars).toBe(3);
    expect(cr.missionId).toBe('fire-fix');
    expect(cr.stickersUnlocked).toContain('fire-fix-starter');

    let helped = createFireBrigadeState(SPECS);
    for (let i = 0; i < 10 && !helped.completed; i += 1) helped = applyHelper(helped);
    expect(getFireBrigadeResult(helped).stars).toBeLessThan(3);
  });
});
