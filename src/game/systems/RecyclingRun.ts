import type { Difficulty } from './SaveSystem';
import { starsFromAccuracy } from './StarScoring';
import type { MissionResult } from '../types';

export type RecyclingCategory = 'trash' | 'paper' | 'plastic' | 'metal' | 'compost';

export type RecyclingItem = {
  id: string;
  label: string;
  icon: string;
  category: RecyclingCategory;
};

export type RecyclingRunState = {
  difficulty: Difficulty;
  activeCategories: RecyclingCategory[];
  items: RecyclingItem[];
  currentIndex: number;
  currentItem: RecyclingItem | null;
  sorted: number;
  attempts: number;
  correct: number;
  mistakes: number;
  hintsUsed: number;
  lastHint: string | null;
  completed: boolean;
};

export type SortOutcome = {
  state: RecyclingRunState;
  correct: boolean;
  hint: string | null;
  completed: boolean;
};

export function getActiveRecyclingCategories(difficulty: Difficulty): RecyclingCategory[] {
  if (difficulty === 'helper') return ['trash', 'paper'];
  if (difficulty === 'easy') return ['trash', 'paper', 'plastic'];
  return ['trash', 'paper', 'plastic', 'metal', 'compost'];
}

export function chooseRecyclingItems(
  sourceItems: RecyclingItem[],
  activeCategories: RecyclingCategory[],
  count = 10,
): RecyclingItem[] {
  const eligible = sourceItems.filter((item) => activeCategories.includes(item.category));
  if (eligible.length === 0) {
    throw new Error('Recycling Run needs at least one item for the active categories.');
  }

  return Array.from({ length: count }, (_value, index) => eligible[index % eligible.length]);
}

export function createRecyclingRunState(difficulty: Difficulty, items: RecyclingItem[]): RecyclingRunState {
  if (items.length === 0) {
    throw new Error('Recycling Run needs at least one item.');
  }
  return {
    difficulty,
    activeCategories: getActiveRecyclingCategories(difficulty),
    items,
    currentIndex: 0,
    currentItem: items[0] ?? null,
    sorted: 0,
    attempts: 0,
    correct: 0,
    mistakes: 0,
    hintsUsed: 0,
    lastHint: null,
    completed: false,
  };
}

export function sortCurrentRecyclingItem(
  state: RecyclingRunState,
  selectedCategory: RecyclingCategory,
): SortOutcome {
  if (state.completed) {
    return { state, correct: true, hint: null, completed: true };
  }

  const item = state.items[state.currentIndex];
  if (!item) {
    return { state: { ...state, completed: true, currentItem: null }, correct: true, hint: null, completed: true };
  }

  const attempts = state.attempts + 1;
  if (item.category !== selectedCategory) {
    const hint = `${item.label} goes in ${item.category}. Try that bin.`;
    return {
      state: {
        ...state,
        attempts,
        mistakes: state.mistakes + 1,
        hintsUsed: state.hintsUsed + 1,
        lastHint: hint,
        currentItem: item,
      },
      correct: false,
      hint,
      completed: false,
    };
  }

  const nextIndex = state.currentIndex + 1;
  const completed = nextIndex >= state.items.length;
  const nextState: RecyclingRunState = {
    ...state,
    currentIndex: nextIndex,
    currentItem: state.items[nextIndex] ?? null,
    sorted: state.sorted + 1,
    attempts,
    correct: state.correct + 1,
    lastHint: null,
    completed,
  };

  return {
    state: nextState,
    correct: true,
    hint: null,
    completed,
  };
}

export function getRecyclingAccuracy(state: RecyclingRunState): number {
  if (state.attempts === 0) return 1;
  return state.correct / state.attempts;
}

export function getRecyclingRunResult(state: RecyclingRunState): MissionResult {
  const accuracy = getRecyclingAccuracy(state);
  return {
    missionId: 'recycling-run',
    completed: state.completed,
    stars: starsFromAccuracy(accuracy),
    score: Math.round(accuracy * 1000),
    stickersUnlocked: state.completed ? ['recycling-run-starter'] : [],
    stats: {
      sorted: state.sorted,
      attempts: state.attempts,
      mistakes: state.mistakes,
      hintsUsed: state.hintsUsed,
      accuracy,
    },
  };
}
