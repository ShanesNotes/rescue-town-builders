import type { MissionId, MissionResult } from '../types';
import { starsFromAccuracy } from './StarScoring';

// A reusable "match the prompt to the right target" engine — the generalized core of the proven
// Recycling loop. It powers the roadmap Match missions (Inverse Dream, Dream Statues, Recycled
// Inventions, Bread Rush, ...): a sequence of prompts, each matched to one of a fixed set of
// targets. Pure + immutable; No-Fail (a wrong pick only hints, never blocks or fails the mission).
// `icon` fields are texture keys so scenes render Hearthlight art, not text.

export type MatchTarget = { id: string; label: string; icon: string };
export type MatchPrompt = { id: string; label: string; icon: string; correctTargetId: string; hint?: string };

export type MatchState = {
  targets: MatchTarget[];
  prompts: MatchPrompt[];
  currentIndex: number;
  currentPrompt: MatchPrompt | null;
  solved: number;
  attempts: number;
  correct: number;
  mistakes: number;
  lastHint: string | null;
  completed: boolean;
};

export type MatchOutcome = {
  state: MatchState;
  correct: boolean;
  completed: boolean;
};

export function createMatchState(targets: MatchTarget[], prompts: MatchPrompt[]): MatchState {
  if (targets.length === 0) throw new Error('A match mission needs at least one target.');
  if (prompts.length === 0) throw new Error('A match mission needs at least one prompt.');
  return {
    targets,
    prompts,
    currentIndex: 0,
    currentPrompt: prompts[0] ?? null,
    solved: 0,
    attempts: 0,
    correct: 0,
    mistakes: 0,
    lastHint: null,
    completed: false,
  };
}

export function chooseMatch(state: MatchState, targetId: string): MatchOutcome {
  if (state.completed) return { state, correct: true, completed: true };

  const prompt = state.prompts[state.currentIndex];
  if (!prompt) {
    return { state: { ...state, completed: true, currentPrompt: null }, correct: true, completed: true };
  }

  const attempts = state.attempts + 1;
  if (targetId !== prompt.correctTargetId) {
    // No-Fail: a wrong pick only nudges — it never advances, blocks, or ends the mission.
    return {
      state: { ...state, attempts, mistakes: state.mistakes + 1, lastHint: prompt.hint ?? 'Almost — try the glowing one.', currentPrompt: prompt },
      correct: false,
      completed: false,
    };
  }

  const nextIndex = state.currentIndex + 1;
  const completed = nextIndex >= state.prompts.length;
  return {
    state: {
      ...state,
      currentIndex: nextIndex,
      currentPrompt: state.prompts[nextIndex] ?? null,
      solved: state.solved + 1,
      attempts,
      correct: state.correct + 1,
      lastHint: null,
      completed,
    },
    correct: true,
    completed,
  };
}

export function getMatchAccuracy(state: MatchState): number {
  if (state.attempts === 0) return 1;
  return state.correct / state.attempts;
}

export function getMatchResult(state: MatchState, missionId: MissionId, stickerId: string): MissionResult {
  const accuracy = getMatchAccuracy(state);
  return {
    missionId,
    completed: state.completed,
    stars: starsFromAccuracy(accuracy),
    score: Math.round(accuracy * 1000),
    stickersUnlocked: state.completed ? [stickerId] : [],
    stats: {
      solved: state.solved,
      attempts: state.attempts,
      mistakes: state.mistakes,
      accuracy,
    },
  };
}
