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
  resident: string;
  wish: string;
  completionLine: string;
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
  decorativeTries: number;
  scaffoldAssists: number;
  missesOnPart: number;
  lastHint: string | null;
  completed: boolean;
};

export type PlaceHousePartOutcome = {
  state: HouseBuilderState;
  correct: boolean;
  hint: string | null;
  completed: boolean;
  assisted: boolean;
  decorated: boolean;
  message: string;
  placedPartId: HousePartId | null;
  completedHouse: HouseBlueprint | null;
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
    decorativeTries: 0,
    scaffoldAssists: 0,
    missesOnPart: 0,
    lastHint: null,
    completed: false,
  });
}

export function placeHousePart(state: HouseBuilderState, selectedPartId: HousePartId): PlaceHousePartOutcome {
  if (state.completed) {
    return outcome(state, true, null, true, false, false, 'All cozy houses are built.', null, null);
  }

  const expected = state.currentPart;
  if (!expected) {
    const completedState = withCurrent({ ...state, completed: true });
    return outcome(completedState, true, null, true, false, false, 'All cozy houses are built.', null, null);
  }

  const attempts = state.attempts + 1;
  if (selectedPartId !== expected.id) {
    const missesOnPart = state.missesOnPart + 1;
    const decoratedBase = {
      ...state,
      attempts,
      mistakes: state.mistakes + 1,
      hintsUsed: state.hintsUsed + 1,
      decorativeTries: state.decorativeTries + 1,
      missesOnPart,
    };

    if (missesOnPart >= 2) {
      const previousHouse = state.currentHouse;
      const advanced = advancePart({
        ...decoratedBase,
        scaffoldAssists: state.scaffoldAssists + 1,
        missesOnPart: 0,
        lastHint: `${labelFor(selectedPartId)} became a silly scaffold. Brick snapped in the ${expected.label}.`,
      });
      return outcome(
        advanced,
        false,
        advanced.lastHint,
        advanced.completed,
        true,
        true,
        advanced.lastHint ?? `Brick helped with the ${expected.label}.`,
        expected.id,
        didJustCompleteHouse(state, advanced) ? previousHouse : null,
      );
    }

    const hint = `${labelFor(selectedPartId)} can decorate the yard. This home wants the ${expected.label} next.`;
    return outcome(
      withCurrent({
        ...decoratedBase,
        lastHint: hint,
      }),
      false,
      hint,
      false,
      false,
      true,
      hint,
      null,
      null,
    );
  }

  const previousHouse = state.currentHouse;
  const nextState = advancePart({
    ...state,
    attempts,
    correctPlacements: state.correctPlacements + 1,
    missesOnPart: 0,
    lastHint: null,
  });

  return outcome(
    nextState,
    true,
    null,
    nextState.completed,
    false,
    false,
    `${expected.label} clicked into place.`,
    expected.id,
    didJustCompleteHouse(state, nextState) ? previousHouse : null,
  );
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
    score: Math.round(accuracy * 900 + state.housesBuilt * 30 + state.decorativeTries * 8),
    stickersUnlocked: state.completed ? ['house-builder-starter'] : [],
    stats: {
      housesBuilt: state.housesBuilt,
      attempts: state.attempts,
      mistakes: state.mistakes,
      hintsUsed: state.hintsUsed,
      decorativeTries: state.decorativeTries,
      scaffoldAssists: state.scaffoldAssists,
      accuracy,
    },
  };
}

function advancePart(state: HouseBuilderState): HouseBuilderState {
  const nextPartIndex = state.currentPartIndex + 1;
  const houseComplete = nextPartIndex >= (state.currentHouse?.parts.length ?? 0);
  const nextHouseIndex = houseComplete ? state.currentHouseIndex + 1 : state.currentHouseIndex;
  const housesBuilt = houseComplete ? state.housesBuilt + 1 : state.housesBuilt;
  const completed = nextHouseIndex >= state.blueprints.length;

  return withCurrent({
    ...state,
    currentHouseIndex: nextHouseIndex,
    currentPartIndex: houseComplete ? 0 : nextPartIndex,
    housesBuilt,
    completed,
  });
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

function didJustCompleteHouse(previous: HouseBuilderState, next: HouseBuilderState): boolean {
  return next.housesBuilt > previous.housesBuilt;
}

function labelFor(id: HousePartId): string {
  return housePartTray.find((part) => part.id === id)?.label ?? id;
}

function outcome(
  state: HouseBuilderState,
  correct: boolean,
  hint: string | null,
  completed: boolean,
  assisted: boolean,
  decorated: boolean,
  message: string,
  placedPartId: HousePartId | null,
  completedHouse: HouseBlueprint | null,
): PlaceHousePartOutcome {
  return { state, correct, hint, completed, assisted, decorated, message, placedPartId, completedHouse };
}
