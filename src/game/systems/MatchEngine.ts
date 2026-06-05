import type { MissionId, MissionResult } from '../types';
import { starsForMatch } from './StarScoring';

// No-Fail assist floor (P1-09): after this many wrong taps on the SAME prompt the telegraph
// escalates; on the AUTO_RESOLVE_AT'th miss the engine resolves the prompt as if correct so a
// child who can't read the answer is never stuck. The scene reads `assistLevel`/`autoResolved`.
export const ESCALATE_AT = 2;
export const AUTO_RESOLVE_AT = 4;

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
  promptMisses: number; // wrong taps on the CURRENT prompt (resets each new prompt) — drives assist
  autoResolved: number; // prompts the No-Fail floor resolved for the child
  lastHint: string | null;
  completed: boolean;
};

export type MatchOutcome = {
  state: MatchState;
  correct: boolean;
  completed: boolean;
  // 0 = no help yet, 1 = escalate the telegraph (brighten right / dim wrong), 2 = auto-resolved.
  assistLevel: 0 | 1 | 2;
  autoResolved: boolean; // the engine placed the answer for the child (helper hops over)
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
    promptMisses: 0,
    autoResolved: 0,
    lastHint: null,
    completed: false,
  };
}

export function chooseMatch(state: MatchState, targetId: string): MatchOutcome {
  if (state.completed) return { state, correct: true, completed: true, assistLevel: 0, autoResolved: false };

  const prompt = state.prompts[state.currentIndex];
  if (!prompt) {
    return { state: { ...state, completed: true, currentPrompt: null }, correct: true, completed: true, assistLevel: 0, autoResolved: false };
  }

  const attempts = state.attempts + 1;
  if (targetId !== prompt.correctTargetId) {
    const promptMisses = state.promptMisses + 1;
    // No-Fail floor (P1-09): a child who can't read the answer is never stuck. After enough wrong
    // taps on THIS prompt, the engine resolves it for them (the scene's helper hops over + places).
    if (promptMisses >= AUTO_RESOLVE_AT) {
      const advanced = advance(state, { attempts, autoResolve: true });
      return { state: advanced.state, correct: true, completed: advanced.completed, assistLevel: 2, autoResolved: true };
    }
    // Otherwise a wrong pick only nudges — it never advances, blocks, or ends the mission.
    return {
      state: { ...state, attempts, mistakes: state.mistakes + 1, promptMisses, lastHint: prompt.hint ?? 'Almost — try the glowing one.', currentPrompt: prompt },
      correct: false,
      completed: false,
      assistLevel: promptMisses >= ESCALATE_AT ? 1 : 0,
      autoResolved: false,
    };
  }

  const advanced = advance(state, { attempts, autoResolve: false });
  return { state: advanced.state, correct: true, completed: advanced.completed, assistLevel: 0, autoResolved: false };
}

// Advance past the current prompt (real solve or No-Fail auto-resolve). Resets the per-prompt miss
// counter for the next prompt; an auto-resolve counts toward `autoResolved` (so scoring/3-star
// bonus can tell a clean run from an assisted one) without inflating `correct`.
function advance(state: MatchState, opts: { attempts: number; autoResolve: boolean }): { state: MatchState; completed: boolean } {
  const nextIndex = state.currentIndex + 1;
  const completed = nextIndex >= state.prompts.length;
  return {
    state: {
      ...state,
      currentIndex: nextIndex,
      currentPrompt: state.prompts[nextIndex] ?? null,
      solved: state.solved + 1,
      attempts: opts.attempts,
      correct: opts.autoResolve ? state.correct : state.correct + 1,
      autoResolved: opts.autoResolve ? state.autoResolved + 1 : state.autoResolved,
      promptMisses: 0,
      lastHint: null,
      completed,
    },
    completed,
  };
}

export function getMatchAccuracy(state: MatchState): number {
  if (state.attempts === 0) return 1;
  return state.correct / state.attempts;
}

export function getMatchResult(state: MatchState, missionId: MissionId, stickerId: string): MissionResult {
  const accuracy = getMatchAccuracy(state);
  // P1-08: a completed Match/Journey floors at 2 stars; 3 is the clean-run bonus (perfect accuracy
  // AND no auto-assist). `mistakes` counts only the wrong taps that did NOT trigger an auto-resolve.
  const usedAssist = state.autoResolved > 0;
  return {
    missionId,
    completed: state.completed,
    stars: starsForMatch(accuracy, usedAssist),
    score: Math.round(accuracy * 1000),
    stickersUnlocked: state.completed ? [stickerId] : [],
    stats: {
      solved: state.solved,
      attempts: state.attempts,
      mistakes: state.mistakes,
      autoResolved: state.autoResolved,
      accuracy,
    },
  };
}
