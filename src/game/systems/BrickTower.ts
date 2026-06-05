import type { MissionResult } from '../types';
import { clampStars } from './StarScoring';

// Pure, Phaser-free logic for Brick's Tower (the physics block-stacker that replaces the old
// ordered House Builder). The scene owns the Matter bodies; this owns the no-fail win rules and
// scoring so they stay unit-testable and survive renderer/physics churn.
//
// No-fail spine: a round completes when EITHER a settled brick's top reaches the target ribbon
// (the real goal) OR enough bricks have come to rest (the floor) — a child can never get stuck,
// and a messy tower still wins by persistence. Reuses missionId 'house-builder' so the town-map
// node, sticker, and mission registry entry all carry over untouched.

export type BrickTowerLevel = {
  id: string;
  /** Bricks that must come to rest to win on the no-fail floor. */
  goalBricks: number;
  /** Y (logical px, smaller = higher) of the target ribbon; a settled brick top reaching it wins. */
  targetY: number;
  brickWidth: number;
  brickHeight: number;
};

export type BrickTowerState = {
  level: BrickTowerLevel;
  dropped: number;
  settled: number;
  knocked: number;
  /** Highest settled brick top so far (smaller y = higher). +Infinity until the first brick rests. */
  maxTopY: number;
  reachedTarget: boolean;
  completed: boolean;
};

export function createBrickTowerState(level: BrickTowerLevel): BrickTowerState {
  if (level.goalBricks < 1) throw new Error("Brick's Tower needs a goal of at least one brick.");
  return {
    level,
    dropped: 0,
    settled: 0,
    knocked: 0,
    maxTopY: Number.POSITIVE_INFINITY,
    reachedTarget: false,
    completed: false,
  };
}

export function dropBrick(state: BrickTowerState): BrickTowerState {
  return { ...state, dropped: state.dropped + 1 };
}

/** The real goal: a settled brick top has risen to (or above) the ribbon line. */
export function towerReachedTarget(topY: number, targetY: number): boolean {
  return topY <= targetY;
}

/** Record a brick coming to rest at the given top-y; recompute height, target, and completion. */
export function settleBrick(state: BrickTowerState, topY: number): BrickTowerState {
  const settled = state.settled + 1;
  const maxTopY = Math.min(state.maxTopY, topY);
  const reachedTarget = state.reachedTarget || towerReachedTarget(maxTopY, state.level.targetY);
  const completed = state.completed || reachedTarget || settled >= state.level.goalBricks;
  return { ...state, settled, maxTopY, reachedTarget, completed };
}

/** A brick that had to be re-caught / fell out of the column — soft, only nudges star scoring. */
export function knockBrick(state: BrickTowerState): BrickTowerState {
  return { ...state, knocked: state.knocked + 1 };
}

/** 0..1 progress toward the round (brick-count floor — the steady pip fill a child can read). */
export function brickTowerProgress(state: BrickTowerState): number {
  if (state.completed) return 1;
  return Math.max(0, Math.min(1, state.settled / state.level.goalBricks));
}

export function getBrickTowerResult(state: BrickTowerState): MissionResult {
  // Reaching the ribbon is the proud win (3 stars, fewer knocks = cleaner); the floor still earns
  // a star so a child is never punished. Mirrors the No-Fail star floor of the old missions.
  const stars = state.reachedTarget ? (state.knocked <= 1 ? 3 : 2) : 1;
  return {
    missionId: 'house-builder',
    completed: state.completed,
    stars: clampStars(stars),
    score: state.settled * 100 + (state.reachedTarget ? 500 : 0),
    stickersUnlocked: state.completed ? ['house-builder-starter'] : [],
    stats: {
      bricksDropped: state.dropped,
      bricksSettled: state.settled,
      knocked: state.knocked,
      reachedTarget: state.reachedTarget,
    },
  };
}
