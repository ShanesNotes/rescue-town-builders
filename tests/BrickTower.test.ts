import { describe, expect, it } from 'vitest';
import {
  brickTowerProgress,
  createBrickTowerState,
  dropBrick,
  getBrickTowerResult,
  knockBrick,
  settleBrick,
  towerReachedTarget,
  type BrickTowerLevel,
} from '../src/game/systems/BrickTower';

const LEVEL: BrickTowerLevel = { id: 'test', goalBricks: 4, targetY: 200, brickWidth: 100, brickHeight: 50 };

describe('BrickTower no-fail logic', () => {
  it('rejects a level with no bricks to stack', () => {
    expect(() => createBrickTowerState({ ...LEVEL, goalBricks: 0 })).toThrow();
  });

  it('starts empty and incomplete', () => {
    const s = createBrickTowerState(LEVEL);
    expect(s.settled).toBe(0);
    expect(s.completed).toBe(false);
    expect(s.maxTopY).toBe(Number.POSITIVE_INFINITY);
    expect(brickTowerProgress(s)).toBe(0);
  });

  it('reads the ribbon as reached only when a brick top rises to it', () => {
    expect(towerReachedTarget(220, 200)).toBe(false);
    expect(towerReachedTarget(200, 200)).toBe(true);
    expect(towerReachedTarget(140, 200)).toBe(true);
  });

  it('completes on the brick-count floor even if the ribbon is never reached (no-fail)', () => {
    let s = createBrickTowerState(LEVEL);
    for (let i = 0; i < LEVEL.goalBricks; i += 1) s = settleBrick(s, 480); // all rest low, never reach
    expect(s.reachedTarget).toBe(false);
    expect(s.completed).toBe(true);
    expect(brickTowerProgress(s)).toBe(1);
  });

  it('completes early and proudly when the ribbon is reached', () => {
    let s = createBrickTowerState(LEVEL);
    s = settleBrick(s, 460);
    s = settleBrick(s, 190); // crosses the ribbon at y200
    expect(s.reachedTarget).toBe(true);
    expect(s.completed).toBe(true);
    expect(s.settled).toBe(2); // fewer than goalBricks, but the height won it
  });

  it('tracks the highest settled top regardless of drop order', () => {
    let s = createBrickTowerState(LEVEL);
    s = settleBrick(s, 300);
    s = settleBrick(s, 250);
    s = settleBrick(s, 280);
    expect(s.maxTopY).toBe(250);
  });

  it('scores 3 stars for a clean ribbon win, fewer for knocks or a floor win', () => {
    let clean = createBrickTowerState(LEVEL);
    clean = settleBrick(clean, 190);
    expect(getBrickTowerResult(clean).stars).toBe(3);

    let knocked = createBrickTowerState(LEVEL);
    knocked = knockBrick(knockBrick(knocked));
    knocked = settleBrick(knocked, 190);
    expect(getBrickTowerResult(knocked).stars).toBe(2);

    let floor = createBrickTowerState(LEVEL);
    for (let i = 0; i < LEVEL.goalBricks; i += 1) floor = settleBrick(floor, 480);
    expect(getBrickTowerResult(floor).stars).toBe(1);
  });

  it('unlocks the house-builder sticker and keeps the missionId for town-map continuity', () => {
    let s = createBrickTowerState(LEVEL);
    s = dropBrick(s);
    for (let i = 0; i < LEVEL.goalBricks; i += 1) s = settleBrick(s, 480);
    const result = getBrickTowerResult(s);
    expect(result.missionId).toBe('house-builder');
    expect(result.stickersUnlocked).toContain('house-builder-starter');
    expect(result.completed).toBe(true);
  });
});
