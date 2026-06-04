import type { MissionResult } from '../types';
import { clampStars } from './StarScoring';
import { act, applyAssist, createAimState, moveAimer, type AimState, type AimTarget, type AimVec } from './AimEngine';

export type Direction = AimVec;

export type FireObject = AimTarget & {
  label: string;
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

export function createFireFixState(fires: FireObject[]): FireFixState {
  return fromAimState(createAimState(fires), 'Move close, aim, and spray. There is no fail state.');
}

export function moveFirefighter(state: FireFixState, direction: Direction): FireFixState {
  const moved = moveAimer(toAimState(state), direction);
  return fromAimState(moved, 'Aim set. Spray when Ember is close to a fire.');
}

export function sprayWater(state: FireFixState): SprayOutcome {
  if (state.completed) return { state, hit: false, completed: true };

  const beforeAssists = state.helperAssists;
  const beforeFiresOut = countFiresOut(state.fires);
  const outcome = act(toAimState(state));
  const nextFires = outcome.state.targets as FireObject[];
  const afterFiresOut = countFiresOut(nextFires);
  const assisted = outcome.state.assists > beforeAssists;
  const message = assisted
    ? 'Helper drone sprayed too. Keep going!'
    : outcome.hit && afterFiresOut > beforeFiresOut
      ? 'Fire out. Great helping!'
      : outcome.hit
        ? 'The fire shrank. Spray again.'
        : 'Water missed. Move closer or aim at a fire.';

  return { state: fromAimState(outcome.state, message), hit: outcome.hit, completed: outcome.completed };
}

export function applyHelperDrone(state: FireFixState): FireFixState {
  return fromAimState(applyAssist(toAimState(state)), 'Helper drone sprayed too. Keep going!');
}

export function getFireFixResult(state: FireFixState): MissionResult {
  const firesOut = countFiresOut(state.fires);
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

function toAimState(state: FireFixState): AimState {
  return createAimState(state.fires, undefined, {
    player: state.player,
    aim: state.aim,
    acts: state.sprays,
    hits: state.hits,
    assists: state.helperAssists,
    completed: state.completed,
    lastMessage: state.lastMessage,
  });
}

function fromAimState(state: AimState, lastMessage = state.lastMessage): FireFixState {
  return {
    player: state.player,
    aim: state.aim,
    fires: state.targets as FireObject[],
    sprays: state.acts,
    hits: state.hits,
    helperAssists: state.assists,
    completed: state.completed,
    lastMessage,
  };
}

function countFiresOut(fires: FireObject[]): number {
  return fires.filter((fire) => fire.health === 0).length;
}
