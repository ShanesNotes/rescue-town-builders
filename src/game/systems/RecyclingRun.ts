import type { Difficulty } from './SaveSystem';
import { starsFromAccuracy } from './StarScoring';
import type { MissionResult } from '../types';

export type RecyclingCategory = 'trash' | 'paper' | 'plastic' | 'metal' | 'compost';
export type ReusePartKind = 'soft' | 'sheet' | 'tube' | 'shiny' | 'grow';

export type RecyclingItem = {
  id: string;
  label: string;
  icon: string;
  category: RecyclingCategory;
  partKind: ReusePartKind;
  partLabel: string;
  reuseVerb: string;
};

export type ReuseBlueprintSlot = {
  id: string;
  kind: ReusePartKind;
  label: string;
  x: number;
  y: number;
};

export type ReuseBlueprint = {
  id: string;
  title: string;
  problem: string;
  invention: string;
  testMessage: string;
  slots: ReuseBlueprintSlot[];
};

export type PlacedReusePart = {
  slotId: string;
  item: RecyclingItem;
  assisted: boolean;
};

export type ReuseChoice = RecyclingItem & { isMatch: boolean };

export type RecyclingRunState = {
  difficulty: Difficulty;
  activeCategories: RecyclingCategory[];
  activePartKinds: ReusePartKind[];
  items: RecyclingItem[];
  blueprints: ReuseBlueprint[];
  currentBlueprintIndex: number;
  currentBlueprint: ReuseBlueprint | null;
  currentSlotIndex: number;
  currentSlot: ReuseBlueprintSlot | null;
  choices: ReuseChoice[];
  placedParts: PlacedReusePart[];
  decoratedParts: RecyclingItem[];
  attempts: number;
  correct: number;
  hintsUsed: number;
  helperAssists: number;
  missesOnSlot: number;
  lastHint: string | null;
  completed: boolean;
};

export type SortOutcome = {
  state: RecyclingRunState;
  correct: boolean;
  hint: string | null;
  completed: boolean;
  assisted: boolean;
  decorated: boolean;
  message: string;
  placedPart: PlacedReusePart | null;
  completedBlueprint: ReuseBlueprint | null;
};

const PART_KIND_TO_CATEGORY: Record<ReusePartKind, RecyclingCategory> = {
  soft: 'trash',
  sheet: 'paper',
  tube: 'plastic',
  shiny: 'metal',
  grow: 'compost',
};

export function getActiveRecyclingCategories(difficulty: Difficulty): RecyclingCategory[] {
  return getActiveReusePartKinds(difficulty).map((kind) => PART_KIND_TO_CATEGORY[kind]);
}

export function getActiveReusePartKinds(difficulty: Difficulty): ReusePartKind[] {
  if (difficulty === 'helper') return ['sheet', 'tube'];
  if (difficulty === 'easy') return ['sheet', 'tube', 'shiny'];
  return ['soft', 'sheet', 'tube', 'shiny', 'grow'];
}

export function chooseRecyclingItems(
  sourceItems: RecyclingItem[],
  activeCategories: RecyclingCategory[],
  count = 10,
): RecyclingItem[] {
  const eligible = sourceItems.filter((item) => activeCategories.includes(item.category));
  if (eligible.length === 0) {
    throw new Error('Rivet\'s Reuse Workshop needs at least one item for the active categories.');
  }

  return Array.from({ length: count }, (_value, index) => eligible[index % eligible.length]);
}

export function chooseReuseBlueprints(
  blueprints: ReuseBlueprint[],
  activePartKinds: ReusePartKind[],
  count = 2,
): ReuseBlueprint[] {
  const eligible = blueprints.filter((blueprint) => blueprint.slots.every((slot) => activePartKinds.includes(slot.kind)));
  if (eligible.length === 0) {
    throw new Error('Rivet\'s Reuse Workshop needs at least one blueprint for the active part kinds.');
  }

  return Array.from({ length: count }, (_value, index) => eligible[index % eligible.length]);
}

export function createRecyclingRunState(
  difficulty: Difficulty,
  items: RecyclingItem[],
  blueprints: ReuseBlueprint[] = createLegacySortBlueprints(items),
): RecyclingRunState {
  if (items.length === 0) {
    throw new Error('Rivet\'s Reuse Workshop needs at least one rescued item.');
  }
  if (blueprints.length === 0) {
    throw new Error('Rivet\'s Reuse Workshop needs at least one invention blueprint.');
  }

  const activePartKinds = getActiveReusePartKinds(difficulty);
  const state = withCurrent({
    difficulty,
    activeCategories: getActiveRecyclingCategories(difficulty),
    activePartKinds,
    items,
    blueprints,
    currentBlueprintIndex: 0,
    currentBlueprint: null,
    currentSlotIndex: 0,
    currentSlot: null,
    choices: [],
    placedParts: [],
    decoratedParts: [],
    attempts: 0,
    correct: 0,
    hintsUsed: 0,
    helperAssists: 0,
    missesOnSlot: 0,
    lastHint: null,
    completed: false,
  });

  return state;
}

export function sortCurrentRecyclingItem(
  state: RecyclingRunState,
  selectedCategory: RecyclingCategory,
): SortOutcome {
  const selected = state.choices.find((choice) => choice.category === selectedCategory) ?? state.items.find((item) => item.category === selectedCategory);
  if (!selected) return blockedOutcome(state, `Try one of Rivet's invention pieces.`);
  return tryReusePart(state, selected.id);
}

export function tryReusePart(state: RecyclingRunState, selectedItemId: string): SortOutcome {
  if (state.completed) {
    return { state, correct: true, hint: null, completed: true, assisted: false, decorated: false, message: 'Workshop complete!', placedPart: null, completedBlueprint: null };
  }

  const slot = state.currentSlot;
  const blueprint = state.currentBlueprint;
  if (!slot || !blueprint) {
    const completedState = { ...state, completed: true, currentBlueprint: null, currentSlot: null, choices: [] };
    return { state: completedState, correct: true, hint: null, completed: true, assisted: false, decorated: false, message: 'Workshop complete!', placedPart: null, completedBlueprint: null };
  }

  const selected = state.choices.find((choice) => choice.id === selectedItemId) ?? state.items.find((item) => item.id === selectedItemId);
  if (!selected) return blockedOutcome(state, `Rivet can't find that piece yet.`);

  const attempts = state.attempts + 1;
  if (selected.partKind !== slot.kind) {
    const decoratedParts = [...state.decoratedParts, selected];
    const missesOnSlot = state.missesOnSlot + 1;
    if (missesOnSlot >= 2) {
      const helperItem = findFirstMatchingItem(state.items, slot.kind);
      const placedPart = { slotId: slot.id, item: helperItem, assisted: true };
      const nextState = advanceWorkshopSlot({
        ...state,
        attempts,
        hintsUsed: state.hintsUsed + 1,
        helperAssists: state.helperAssists + 1,
        missesOnSlot: 0,
        decoratedParts,
        placedParts: [...state.placedParts, placedPart],
        lastHint: `Rivet turned ${selected.label} into sparkle trim and snapped in ${helperItem.partLabel}.`,
      });
      const completedBlueprint = didJustCompleteBlueprint(state, nextState) ? blueprint : null;
      return {
        state: nextState,
        correct: false,
        hint: nextState.lastHint,
        completed: nextState.completed,
        assisted: true,
        decorated: true,
        message: nextState.lastHint ?? 'Rivet helped the invention along.',
        placedPart,
        completedBlueprint,
      };
    }

    const hint = `${selected.label} became silly trim. This spot wants ${slot.label}.`;
    return {
      state: {
        ...state,
        attempts,
        hintsUsed: state.hintsUsed + 1,
        missesOnSlot,
        decoratedParts,
        lastHint: hint,
      },
      correct: false,
      hint,
      completed: false,
      assisted: false,
      decorated: true,
      message: hint,
      placedPart: null,
      completedBlueprint: null,
    };
  }

  const placedPart = { slotId: slot.id, item: selected, assisted: false };
  const nextState = advanceWorkshopSlot({
    ...state,
    attempts,
    correct: state.correct + 1,
    missesOnSlot: 0,
    lastHint: null,
    placedParts: [...state.placedParts, placedPart],
  });
  const completedBlueprint = didJustCompleteBlueprint(state, nextState) ? blueprint : null;

  return {
    state: nextState,
    correct: true,
    hint: null,
    completed: nextState.completed,
    assisted: false,
    decorated: false,
    message: `${selected.label} became ${selected.reuseVerb}!`,
    placedPart,
    completedBlueprint,
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
    score: Math.round(accuracy * 800 + state.placedParts.length * 35 + state.decoratedParts.length * 10),
    stickersUnlocked: state.completed ? ['recycling-run-starter'] : [],
    stats: {
      inventionsBuilt: state.currentBlueprintIndex,
      partsPlaced: state.placedParts.length,
      decorations: state.decoratedParts.length,
      attempts: state.attempts,
      correct: state.correct,
      hintsUsed: state.hintsUsed,
      helperAssists: state.helperAssists,
      accuracy,
    },
  };
}

function advanceWorkshopSlot(state: RecyclingRunState): RecyclingRunState {
  const blueprint = state.currentBlueprint;
  if (!blueprint) return withCurrent(state);

  const nextSlotIndex = state.currentSlotIndex + 1;
  if (nextSlotIndex < blueprint.slots.length) {
    return withCurrent({ ...state, currentSlotIndex: nextSlotIndex });
  }

  return withCurrent({ ...state, currentBlueprintIndex: state.currentBlueprintIndex + 1, currentSlotIndex: 0 });
}

function withCurrent(state: RecyclingRunState): RecyclingRunState {
  const currentBlueprint = state.blueprints[state.currentBlueprintIndex] ?? null;
  const currentSlot = currentBlueprint?.slots[state.currentSlotIndex] ?? null;
  const completed = !currentBlueprint;
  return {
    ...state,
    currentBlueprint,
    currentSlot,
    choices: !completed && currentSlot ? buildChoices(state.items, currentSlot.kind) : [],
    completed,
  };
}

function buildChoices(items: RecyclingItem[], matchingKind: ReusePartKind): ReuseChoice[] {
  const match = findFirstMatchingItem(items, matchingKind);
  const distractors = items.filter((item) => item.partKind !== matchingKind).slice(0, 2);
  const extras = items.filter((item) => item.id !== match.id && !distractors.some((distractor) => distractor.id === item.id));
  return [match, ...distractors, ...extras].slice(0, 3).map((item) => ({ ...item, isMatch: item.partKind === matchingKind }));
}

function findFirstMatchingItem(items: RecyclingItem[], matchingKind: ReusePartKind): RecyclingItem {
  const item = items.find((candidate) => candidate.partKind === matchingKind);
  if (!item) throw new Error(`Rivet's Reuse Workshop needs an item with part kind: ${matchingKind}`);
  return item;
}

function blockedOutcome(state: RecyclingRunState, message: string): SortOutcome {
  return { state, correct: false, hint: message, completed: state.completed, assisted: false, decorated: false, message, placedPart: null, completedBlueprint: null };
}

function didJustCompleteBlueprint(previous: RecyclingRunState, next: RecyclingRunState): boolean {
  return next.currentBlueprintIndex > previous.currentBlueprintIndex;
}

function createLegacySortBlueprints(items: RecyclingItem[]): ReuseBlueprint[] {
  return items.map((item) => ({
    id: `sort-${item.id}`,
    title: `${item.partLabel} rescue`,
    problem: `Rivet found ${item.label}. What could it become?`,
    invention: item.partLabel,
    testMessage: `${item.label} got a second life!`,
    slots: [{ id: `${item.id}-slot`, kind: item.partKind, label: item.partLabel, x: 480, y: 270 }],
  }));
}
