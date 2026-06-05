import type { MissionId, MissionResult } from '../types';
import { clampStars } from './StarScoring';

// Pure, Phaser-free logic for Ember's Fire Brigade — the Arcade water-arc firefighter that replaces
// the old move-and-cone Fire Fix. The scene owns the arcing water bodies and flames; this owns the
// heat/douse/win rules + the no-fail helper floor + scoring, kept unit-testable. Reuses missionId
// 'fire-fix' and sticker 'fire-fix-starter' so the town-map node, sticker, and registry carry over.

export type BrigadeFireSpec = { id: string; x: number; y: number; heat: number };

export type BrigadeFire = { id: string; x: number; y: number; heat: number; maxHeat: number };

export type FireBrigadeState = {
  fires: BrigadeFire[];
  sprays: number;
  hits: number;
  helperAssists: number;
  completed: boolean;
};

export function createFireBrigadeState(specs: BrigadeFireSpec[]): FireBrigadeState {
  if (specs.length === 0) throw new Error("Ember's Fire Brigade needs at least one fire.");
  return withCompletion({
    fires: specs.map((f) => ({ id: f.id, x: f.x, y: f.y, heat: f.heat, maxHeat: Math.max(1, f.heat) })),
    sprays: 0,
    hits: 0,
    helperAssists: 0,
    completed: false,
  });
}

export function liveFires(state: FireBrigadeState): BrigadeFire[] {
  return state.fires.filter((f) => f.heat > 0);
}

export function nearestLiveFire(state: FireBrigadeState, x: number, y: number): BrigadeFire | null {
  let best: BrigadeFire | null = null;
  let bestD = Infinity;
  for (const f of state.fires) {
    if (f.heat <= 0) continue;
    const d = Math.hypot(f.x - x, f.y - y);
    if (d < bestD) {
      bestD = d;
      best = f;
    }
  }
  return best;
}

/** Count a water burst leaving the hose (hit or not) — for honest spray-count scoring. */
export function countSpray(state: FireBrigadeState): FireBrigadeState {
  return { ...state, sprays: state.sprays + 1 };
}

/** A droplet struck a fire: cool it by `amount`; returns new state + whether that fire just went out. */
export function douseFire(state: FireBrigadeState, fireId: string, amount = 1): { state: FireBrigadeState; out: boolean; hit: boolean } {
  const target = state.fires.find((f) => f.id === fireId);
  if (!target || target.heat <= 0) return { state, out: false, hit: false };
  const fires = state.fires.map((f) => (f.id === fireId ? { ...f, heat: Math.max(0, f.heat - amount) } : f));
  const out = target.heat - amount <= 0;
  return { state: withCompletion({ ...state, fires, hits: state.hits + 1 }), out, hit: true };
}

/** No-fail floor: a friend cools the weakest remaining fire by one, guaranteeing convergence. */
export function applyHelper(state: FireBrigadeState): FireBrigadeState {
  const live = liveFires(state);
  if (live.length === 0) return state;
  const weakest = live.reduce((a, b) => (b.heat < a.heat ? b : a));
  const fires = state.fires.map((f) => (f.id === weakest.id ? { ...f, heat: Math.max(0, f.heat - 1) } : f));
  return withCompletion({ ...state, fires, helperAssists: state.helperAssists + 1 });
}

// Parameterized by the launching missionId so one spray scene can serve several "douse the targets"
// missions (fire-fix + the captured goo-cleanup), each unlocking its own '<missionId>-starter' sticker.
export function getFireBrigadeResult(state: FireBrigadeState, missionId: MissionId = 'fire-fix'): MissionResult {
  const firesOut = state.fires.filter((f) => f.heat === 0).length;
  // Arc-shooting throws many droplets, so spray count is loose; a clean, helper-free win is 3 stars.
  const penalty = Math.floor(state.sprays / 18) + state.helperAssists;
  return {
    missionId,
    completed: state.completed,
    stars: clampStars(3 - penalty),
    score: Math.max(0, 1000 - state.helperAssists * 120 - state.sprays * 8),
    stickersUnlocked: state.completed ? [`${missionId}-starter`] : [],
    stats: {
      firesOut,
      sprays: state.sprays,
      hits: state.hits,
      helperAssists: state.helperAssists,
    },
  };
}

function withCompletion(state: FireBrigadeState): FireBrigadeState {
  return { ...state, completed: state.fires.every((f) => f.heat === 0) };
}
