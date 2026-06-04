import type { MissionId, MissionResult } from '../types';
import { clampStars } from './StarScoring';

// A reusable "move, aim, act on real-time targets" engine — the generalized core of the proven
// Fire Fix loop. Powers roadmap Aim missions (Goo Cleanup, Frog Flight, Asteroid Blaster): a hero
// moves on a field, aims, and acts (spray/clean/blast) on targets in a cone; targets diminish to
// nothing. Pure + immutable. No-Fail: a No-Fail helper floor finishes the mission for a child who
// only ever acts and never moves, so nobody is ever stranded.

export type AimVec = { x: -1 | 0 | 1; y: -1 | 0 | 1 };
export type AimTarget = { id: string; x: number; y: number; health: number; maxHealth: number };

export type AimConfig = {
  start: { x: number; y: number };
  step: number;
  range: number;
  bounds: { minX: number; maxX: number; minY: number; maxY: number };
  assistEarlyAt: number; // after this many acts with heavy load left, one helper pass
  assistFloorAt: number; // after this many acts, the helper assists on every miss (No-Fail floor)
};

export const DEFAULT_AIM_CONFIG: AimConfig = {
  start: { x: 260, y: 260 },
  step: 80,
  range: 190,
  bounds: { minX: 120, maxX: 840, minY: 160, maxY: 390 },
  assistEarlyAt: 5,
  assistFloorAt: 8,
};

export type AimState = {
  player: { x: number; y: number };
  aim: AimVec;
  targets: AimTarget[];
  acts: number;
  hits: number;
  assists: number;
  completed: boolean;
  lastMessage: string;
  config: AimConfig;
};

export type AimOutcome = { state: AimState; hit: boolean; completed: boolean };

export type AimStateOverrides = Partial<Omit<AimState, 'targets' | 'config'>>;

export function createAimState(
  targets: AimTarget[],
  config: AimConfig = DEFAULT_AIM_CONFIG,
  overrides: AimStateOverrides = {},
): AimState {
  if (targets.length === 0) throw new Error('An aim mission needs at least one target.');
  return withCompletion({
    player: overrides.player ? { ...overrides.player } : { ...config.start },
    aim: overrides.aim ?? { x: 1, y: 0 },
    targets: targets.map((t) => ({ ...t })),
    acts: overrides.acts ?? 0,
    hits: overrides.hits ?? 0,
    assists: overrides.assists ?? 0,
    completed: overrides.completed ?? false,
    lastMessage: overrides.lastMessage ?? 'Get close, aim, and go. There is no way to lose.',
    config,
  });
}

export function moveAimer(state: AimState, dir: AimVec): AimState {
  if (dir.x === 0 && dir.y === 0) return state;
  const b = state.config.bounds;
  return {
    ...state,
    player: {
      x: clamp(state.player.x + dir.x * state.config.step, b.minX, b.maxX),
      y: clamp(state.player.y + dir.y * state.config.step, b.minY, b.maxY),
    },
    aim: dir,
    lastMessage: 'Aim set. Act when you are close.',
  };
}

export function act(state: AimState): AimOutcome {
  if (state.completed) return { state, hit: false, completed: true };

  const index = state.targets.findIndex((t) => t.health > 0 && inCone(state, t));
  if (index < 0) {
    const missed = { ...state, acts: state.acts + 1, lastMessage: 'Missed — move a little closer.' };
    const assisted = maybeAssist(missed);
    return { state: assisted, hit: false, completed: assisted.completed };
  }

  const targets = state.targets.map((t, i) => (i === index ? { ...t, health: Math.max(0, t.health - 1) } : t));
  const next = withCompletion({
    ...state,
    targets,
    acts: state.acts + 1,
    hits: state.hits + 1,
    lastMessage: targets[index]?.health === 0 ? 'Done — nicely helped!' : 'Almost — once more.',
  });
  return { state: next, hit: true, completed: next.completed };
}

export function applyAssist(state: AimState): AimState {
  return withCompletion({
    ...state,
    targets: state.targets.map((t) => ({ ...t, health: Math.max(0, t.health - 1) })),
    assists: state.assists + 1,
    lastMessage: 'A friend helped too. Keep going!',
  });
}

export function getAimResult(state: AimState, missionId: MissionId, stickerId: string): MissionResult {
  const cleared = state.targets.filter((t) => t.health === 0).length;
  const penalty = Math.floor(state.acts / 8) + state.assists;
  return {
    missionId,
    completed: state.completed,
    stars: clampStars(3 - penalty),
    score: Math.max(0, 1000 - state.acts * 40 - state.assists * 100),
    stickersUnlocked: state.completed ? [stickerId] : [],
    stats: { cleared, acts: state.acts, hits: state.hits, assists: state.assists },
  };
}

function maybeAssist(state: AimState): AimState {
  const remaining = state.targets.reduce((sum, t) => sum + t.health, 0);
  if (remaining === 0) return state;
  if (state.acts >= state.config.assistEarlyAt && remaining >= 5 && state.assists === 0) return applyAssist(state);
  if (state.acts >= state.config.assistFloorAt) return applyAssist(state);
  return state;
}

function inCone(state: AimState, target: AimTarget): boolean {
  const dx = target.x - state.player.x;
  const dy = target.y - state.player.y;
  if (Math.hypot(dx, dy) > state.config.range) return false;
  const horizontalOk = state.aim.x === 0 || Math.sign(dx) === state.aim.x;
  const verticalOk = state.aim.y === 0 || Math.sign(dy) === state.aim.y;
  return horizontalOk && verticalOk;
}

function withCompletion(state: AimState): AimState {
  return { ...state, completed: state.targets.every((t) => t.health === 0) };
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
