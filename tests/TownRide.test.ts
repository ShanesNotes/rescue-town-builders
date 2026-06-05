import { describe, expect, it } from 'vitest';
import {
  bumpObstacle,
  catchFriend,
  createTownRideState,
  getTownRideResult,
  townRideProgress,
  type TownRideLevel,
} from '../src/game/systems/TownRide';

const LEVEL: TownRideLevel = { goalFriends: 3 };

describe('TownRide no-fail logic', () => {
  it('rejects a level with no friends to round up', () => {
    expect(() => createTownRideState({ goalFriends: 0 })).toThrow();
  });

  it('starts empty and incomplete', () => {
    const s = createTownRideState(LEVEL);
    expect(s.caught).toBe(0);
    expect(s.completed).toBe(false);
    expect(townRideProgress(s)).toBe(0);
  });

  it('completes once enough friends are rounded up', () => {
    let s = createTownRideState(LEVEL);
    s = catchFriend(catchFriend(s));
    expect(s.completed).toBe(false);
    s = catchFriend(s);
    expect(s.completed).toBe(true);
    expect(townRideProgress(s)).toBe(1);
  });

  it('a bump never fails the run and never changes the caught count (no-fail)', () => {
    let s = createTownRideState(LEVEL);
    s = bumpObstacle(bumpObstacle(s));
    expect(s.caught).toBe(0);
    expect(s.completed).toBe(false);
    s = catchFriend(catchFriend(catchFriend(s)));
    expect(s.completed).toBe(true);
    expect(s.bumps).toBe(2);
  });

  it('does not overshoot caught after completion', () => {
    let s = createTownRideState({ goalFriends: 1 });
    s = catchFriend(s);
    s = catchFriend(s);
    expect(s.caught).toBe(1);
  });

  it('scores 3 stars clean, fewer with many bumps, keeps the scooter sticker/missionId', () => {
    let clean = createTownRideState(LEVEL);
    clean = catchFriend(catchFriend(catchFriend(clean)));
    const cr = getTownRideResult(clean);
    expect(cr.stars).toBe(3);
    expect(cr.missionId).toBe('scooter-roundup');
    expect(cr.stickersUnlocked).toContain('scooter-roundup-starter');

    let bumpy = createTownRideState(LEVEL);
    for (let i = 0; i < 8; i += 1) bumpy = bumpObstacle(bumpy);
    bumpy = catchFriend(catchFriend(catchFriend(bumpy)));
    expect(getTownRideResult(bumpy).stars).toBeLessThan(3);
  });
});
