import type { MissionId, MissionResult } from '../types';
import { clampStars } from './StarScoring';

// Pure, Phaser-free logic for Town Ride — the no-fail momentum ride that replaces the tap-the-waypoint
// Scooter Roundup. Scoot rides along the lane; the child steers up/down to scoop up runaway friends
// and gently bump past cones. NO FAIL: a bump only slows Scoot for a beat (never ends the run), and
// friends keep coming until enough are rounded up. Reuses missionId 'scooter-roundup' + its sticker.

export type TownRideLevel = { goalFriends: number };

export type TownRideState = {
  caught: number;
  goal: number;
  bumps: number;
  completed: boolean;
};

export function createTownRideState(level: TownRideLevel): TownRideState {
  if (level.goalFriends < 1) throw new Error('Town Ride needs at least one friend to round up.');
  return { caught: 0, goal: level.goalFriends, bumps: 0, completed: false };
}

/** Scoop up a runaway friend — one closer to the pen; the ride wins when enough are gathered. */
export function catchFriend(state: TownRideState): TownRideState {
  if (state.completed) return state;
  const caught = state.caught + 1;
  return { ...state, caught, completed: caught >= state.goal };
}

/** Bump a cone — slows Scoot for a beat but never fails the run (only a soft nudge to scoring). */
export function bumpObstacle(state: TownRideState): TownRideState {
  if (state.completed) return state;
  return { ...state, bumps: state.bumps + 1 };
}

export function townRideProgress(state: TownRideState): number {
  return Math.max(0, Math.min(1, state.caught / state.goal));
}

// Parameterized by the launching missionId so one ride scene can serve several journey missions
// (scooter-roundup + the captured bike-explorer / safety-lights / treasure-boat), each unlocking its
// own '<missionId>-starter' sticker.
export function getTownRideResult(state: TownRideState, missionId: MissionId = 'scooter-roundup'): MissionResult {
  // No-fail and gentle: a clean round-up is three stars; lots of bumps still earns at least one.
  const stars = clampStars(3 - Math.floor(state.bumps / 4));
  return {
    missionId,
    completed: state.completed,
    stars,
    score: state.completed ? Math.max(100, 1000 - state.bumps * 40) : 0,
    stickersUnlocked: state.completed ? [`${missionId}-starter`] : [],
    stats: { caught: state.caught, goal: state.goal, bumps: state.bumps },
  };
}
