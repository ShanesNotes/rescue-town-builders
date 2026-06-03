import type { MissionResult } from '../types';
import { starsFromAccuracy } from './StarScoring';

export type HousePartId = 'foundation' | 'walls' | 'roof' | 'door' | 'decoration';

export type HousePart = {
  id: HousePartId;
  label: string;
  icon: string;
};

export type HouseBlueprint = {
  id: string;
  title: string;
  parts: HousePart[];
};

export type HouseBuilderState = {
  blueprints: HouseBlueprint[];
  currentHouseIndex: number;
  currentPartIndex: number;
  currentHouse: HouseBlueprint | null;
  currentPart: HousePart | null;
  housesBuilt: number;
  attempts: number;
  correctPlacements: number;
  mistakes: number;
  hintsUsed: number;
  lastHint: string | null;
  completed: boolean;
};

export type PlaceHousePartOutcome = {
  state: HouseBuilderState;
  correct: boolean;
  hint: string | null;
  completed: boolean;
};

export const housePartTray: HousePart[] = [
  { id: 'foundation', label: 'Foundation', icon: '▰' },
  { id: 'walls', label: 'Walls', icon: '▣' },
  { id: 'roof', label: 'Roof', icon: '▲' },
  { id: 'door', label: 'Door', icon: '🚪' },
  { id: 'decoration', label: 'Decoration', icon: '🌼' },
];

export function createHouseBuilderState(blueprints: HouseBlueprint[]): HouseBuilderState {
  if (blueprints.length === 0) {
    throw new Error('House Builder needs at least one blueprint.');
  }
  return withCurrent({
    blueprints,
    currentHouseIndex: 0,
    currentPartIndex: 0,
    currentHouse: null,
    currentPart: null,
    housesBuilt: 0,
    attempts: 0,
    correctPlacements: 0,
    mistakes: 0,
    hintsUsed: 0,
    lastHint: null,
    completed: false,
  });
}

export function placeHousePart(state: HouseBuilderState, selectedPartId: HousePartId): PlaceHousePartOutcome {
  if (state.completed) {
    return { state, correct: true, hint: null, completed: true };
  }

  const expected = state.currentPart;
  if (!expected) {
    const completedState = withCurrent({ ...state, completed: true });
    return { state: completedState, correct: true, hint: null, completed: true };
  }

  const attempts = state.attempts + 1;
  if (selectedPartId !== expected.id) {
    const hint = `Try the ${expected.label} next.`;
    return {
      state: withCurrent({
        ...state,
        attempts,
        mistakes: state.mistakes + 1,
        hintsUsed: state.hintsUsed + 1,
        lastHint: hint,
      }),
      correct: false,
      hint,
      completed: false,
    };
  }

  const nextPartIndex = state.currentPartIndex + 1;
  const houseComplete = nextPartIndex >= (state.currentHouse?.parts.length ?? 0);
  const nextHouseIndex = houseComplete ? state.currentHouseIndex + 1 : state.currentHouseIndex;
  const housesBuilt = houseComplete ? state.housesBuilt + 1 : state.housesBuilt;
  const completed = nextHouseIndex >= state.blueprints.length;

  const nextState = withCurrent({
    ...state,
    currentHouseIndex: nextHouseIndex,
    currentPartIndex: houseComplete ? 0 : nextPartIndex,
    housesBuilt,
    attempts,
    correctPlacements: state.correctPlacements + 1,
    lastHint: null,
    completed,
  });

  return {
    state: nextState,
    correct: true,
    hint: null,
    completed,
  };
}

export function getHouseBuilderAccuracy(state: HouseBuilderState): number {
  if (state.attempts === 0) return 1;
  return state.correctPlacements / state.attempts;
}

export function getHouseBuilderResult(state: HouseBuilderState): MissionResult {
  const accuracy = getHouseBuilderAccuracy(state);
  return {
    missionId: 'house-builder',
    completed: state.completed,
    stars: starsFromAccuracy(accuracy),
    score: Math.round(accuracy * 1000),
    stickersUnlocked: state.completed ? ['house-builder-starter'] : [],
    stats: {
      housesBuilt: state.housesBuilt,
      attempts: state.attempts,
      mistakes: state.mistakes,
      hintsUsed: state.hintsUsed,
      accuracy,
    },
  };
}

function withCurrent(state: HouseBuilderState): HouseBuilderState {
  const currentHouse = state.completed ? null : (state.blueprints[state.currentHouseIndex] ?? null);
  const currentPart = currentHouse?.parts[state.currentPartIndex] ?? null;
  return {
    ...state,
    currentHouse,
    currentPart,
    completed: state.completed || state.currentHouseIndex >= state.blueprints.length,
  };
}
