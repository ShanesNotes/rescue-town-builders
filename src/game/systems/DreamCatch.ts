import type { MissionResult } from '../types';
import { clampStars } from './StarScoring';

// Pure, Phaser-free logic for Cluckle's Dream Catch — the no-fail Arcade catcher that replaces the
// drag-to-match Inverse Dream. The dreaming hen drops dream-orbs (sun = day, moon = night — a gentle
// nod to Inverse Dream's opposites); the child slides a basket to catch them, and each caught dream
// sorts into its day/night bin. NO FAIL: a missed dream simply drifts away and another falls — only
// catching counts. Reuses missionId 'inverse-dream' + sticker 'inverse-dream-starter'.

export type DreamType = 'sun' | 'moon';

export type DreamCatchLevel = {
  goalDreams: number;
  /** The bag of dream types that fall (cycled/shuffled by the scene). */
  types: DreamType[];
};

export type DreamCatchState = {
  caught: number;
  missed: number;
  goal: number;
  completed: boolean;
};

export function createDreamCatchState(level: DreamCatchLevel): DreamCatchState {
  if (level.goalDreams < 1) throw new Error("Cluckle's Dream Catch needs a goal of at least one dream.");
  return { caught: 0, missed: 0, goal: level.goalDreams, completed: false };
}

/** Catch a dream: one closer to the goal; the round completes when the basket has caught enough. */
export function catchDream(state: DreamCatchState): DreamCatchState {
  if (state.completed) return state;
  const caught = state.caught + 1;
  return { ...state, caught, completed: caught >= state.goal };
}

/** A dream slipped past — no penalty to completion (no-fail), only a soft nudge to star scoring. */
export function missDream(state: DreamCatchState): DreamCatchState {
  if (state.completed) return state;
  return { ...state, missed: state.missed + 1 };
}

export function dreamCatchProgress(state: DreamCatchState): number {
  return Math.max(0, Math.min(1, state.caught / state.goal));
}

export function getDreamCatchResult(state: DreamCatchState): MissionResult {
  // No-fail and gentle: a tidy catch is three stars; lots of misses still earns at least one.
  const stars = clampStars(3 - Math.floor(state.missed / 4));
  return {
    missionId: 'inverse-dream',
    completed: state.completed,
    stars,
    score: state.completed ? Math.max(100, 1000 - state.missed * 50) : 0,
    stickersUnlocked: state.completed ? ['inverse-dream-starter'] : [],
    stats: { caught: state.caught, missed: state.missed, goal: state.goal },
  };
}
