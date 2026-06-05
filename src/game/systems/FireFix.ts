import type { MissionResult } from '../types';
import { clampStars } from './StarScoring';

export type Direction = { x: -1 | 0 | 1; y: -1 | 0 | 1 };

export type FireObject = {
  id: string;
  label: string;
  x: number;
  y: number;
  health: number;
  maxHealth: number;
};

export type FireFixState = {
  player: { x: number; y: number };
  aim: Direction;
  fires: FireObject[];
  sprays: number;
  hits: number;
  helperAssists: number;
  completed: boolean;
  lastMessage: string;
};

export type SprayOutcome = {
  state: FireFixState;
  hit: boolean;
  completed: boolean;
};

const START = { x: 260, y: 260 };
const STEP = 80;
const SPRAY_RANGE = 190;
// No-Fail assist thresholds, mirrored from AimEngine (P2-11): fire one early helper pass once a
// child has sprayed a couple of times with no fire reachable (the old sprays>=5 && pressure>=5 gate
// left a silent dead-zone), then help on EVERY subsequent miss so a spray-only run always converges.
const ASSIST_EARLY_AT = 2;
const ASSIST_FLOOR_AT = 3;

export function createFireFixState(fires: FireObject[]): FireFixState {
  if (fires.length === 0) {
    throw new Error('Fire Fix needs at least one cartoon fire.');
  }
  return withCompletion({
    player: START,
    aim: { x: 1, y: 0 },
    fires: fires.map((fire) => ({ ...fire })),
    sprays: 0,
    hits: 0,
    helperAssists: 0,
    completed: false,
    lastMessage: 'Move close, aim, and spray. There is no fail state.',
  });
}

export function moveFirefighter(state: FireFixState, direction: Direction): FireFixState {
  if (direction.x === 0 && direction.y === 0) return state;
  return {
    ...state,
    player: {
      x: clamp(state.player.x + direction.x * STEP, 120, 840),
      y: clamp(state.player.y + direction.y * STEP, 160, 390),
    },
    aim: direction,
    lastMessage: 'Aim set. Spray when Ember is close to a fire.',
  };
}

export function sprayWater(state: FireFixState): SprayOutcome {
  if (state.completed) return { state, hit: false, completed: true };

  const targetIndex = state.fires.findIndex((fire) => fire.health > 0 && isInSprayCone(state, fire));
  if (targetIndex < 0) {
    const missed = {
      ...state,
      sprays: state.sprays + 1,
      lastMessage: 'Water missed. Move closer or aim at a fire.',
    };
    const assisted = maybeAssist(missed);
    return { state: assisted, hit: false, completed: assisted.completed };
  }

  const fires = state.fires.map((fire, index) =>
    index === targetIndex ? { ...fire, health: Math.max(0, fire.health - 1) } : fire,
  );
  const nextState = withCompletion({
    ...state,
    fires,
    sprays: state.sprays + 1,
    hits: state.hits + 1,
    lastMessage: fires[targetIndex]?.health === 0 ? 'Fire out. Great helping!' : 'The fire shrank. Spray again.',
  });

  return { state: nextState, hit: true, completed: nextState.completed };
}

export function applyHelperDrone(state: FireFixState): FireFixState {
  return withCompletion({
    ...state,
    fires: state.fires.map((fire) => ({ ...fire, health: Math.max(0, fire.health - 1) })),
    helperAssists: state.helperAssists + 1,
    lastMessage: 'Helper drone sprayed too. Keep going!',
  });
}

export function getFireFixResult(state: FireFixState): MissionResult {
  const firesOut = state.fires.filter((fire) => fire.health === 0).length;
  const penalty = Math.floor(state.sprays / 8) + state.helperAssists;
  return {
    missionId: 'fire-fix',
    completed: state.completed,
    stars: clampStars(3 - penalty),
    score: Math.max(0, 1000 - state.sprays * 40 - state.helperAssists * 100),
    stickersUnlocked: state.completed ? ['fire-fix-starter'] : [],
    stats: {
      firesOut,
      sprays: state.sprays,
      hits: state.hits,
      helperAssists: state.helperAssists,
    },
  };
}

function maybeAssist(state: FireFixState): FireFixState {
  const remainingPressure = state.fires.reduce((total, fire) => total + fire.health, 0);
  if (remainingPressure === 0) return state;
  // Mirrors AimEngine.maybeAssist (P2-11): only ever called on a miss (no fire reachable). Fire one
  // early drone pass once a child has sprayed a couple of times (no pressure gate — that left a
  // silent dead-zone), then help on every subsequent miss so a spray-only run always converges.
  if (state.sprays >= ASSIST_EARLY_AT && state.helperAssists === 0) return applyHelperDrone(state);
  if (state.sprays >= ASSIST_FLOOR_AT) return applyHelperDrone(state);
  return state;
}

function isInSprayCone(state: FireFixState, fire: FireObject): boolean {
  const dx = fire.x - state.player.x;
  const dy = fire.y - state.player.y;
  const distance = Math.hypot(dx, dy);
  if (distance > SPRAY_RANGE) return false;
  const horizontalOk = state.aim.x === 0 || Math.sign(dx) === state.aim.x;
  const verticalOk = state.aim.y === 0 || Math.sign(dy) === state.aim.y;
  return horizontalOk && verticalOk;
}

function withCompletion(state: FireFixState): FireFixState {
  return {
    ...state,
    completed: state.fires.every((fire) => fire.health === 0),
  };
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
