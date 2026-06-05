import type { MissionId, MissionResult } from '../types';
import { clampStars } from './StarScoring';

// Pure, Phaser-free logic for Rivet's Recycle Snake — the no-fail Snake-like that replaces the old
// drag-to-sort Recycling Run. Rivet's cart drives on a grid; driving over a recyclable picks it up
// and grows a trailing tail; collect them all to win. NO DEATH: walls wrap, and the head may overlap
// its own tail harmlessly — the only objective is collecting, so a child can never lose. Reuses
// missionId 'recycling-run' + sticker 'recycling-run-starter'.

export type SnakeDir = { x: -1 | 0 | 1; y: -1 | 0 | 1 };
export type SnakeCell = { x: number; y: number };
export type SnakeItem = { id: string; x: number; y: number; category: string };

export type RecycleSnakeLevel = {
  cols: number;
  rows: number;
  startX: number;
  startY: number;
  items: SnakeItem[];
};

export type RecycleSnakeState = {
  cols: number;
  rows: number;
  dir: SnakeDir;
  pendingDir: SnakeDir;
  body: SnakeCell[]; // head is body[0]
  items: SnakeItem[];
  collected: string[]; // categories, in pickup order (for the tail)
  total: number;
  steps: number;
  completed: boolean;
  collectedThisStep: string | null;
};

const RIGHT: SnakeDir = { x: 1, y: 0 };

export function createRecycleSnakeState(level: RecycleSnakeLevel): RecycleSnakeState {
  if (level.items.length === 0) throw new Error("Rivet's Recycle Snake needs at least one item.");
  const head = { x: level.startX, y: level.startY };
  const items = level.items.filter((it) => !(it.x === head.x && it.y === head.y)).map((it) => ({ ...it }));
  return {
    cols: level.cols,
    rows: level.rows,
    dir: RIGHT,
    pendingDir: RIGHT,
    body: [head],
    items,
    collected: [],
    total: items.length,
    steps: 0,
    completed: false,
    collectedThisStep: null,
  };
}

function wrap(v: number, n: number): number {
  return ((v % n) + n) % n;
}

export function isOpposite(a: SnakeDir, b: SnakeDir): boolean {
  return (a.x !== 0 || a.y !== 0) && a.x === -b.x && a.y === -b.y;
}

/** Queue a turn for the next step. A 180° reverse into the tail is ignored (standard snake feel). */
export function setDirection(state: RecycleSnakeState, dir: SnakeDir): RecycleSnakeState {
  if (dir.x === 0 && dir.y === 0) return state;
  if (state.body.length > 1 && isOpposite(dir, state.dir)) return state;
  return { ...state, pendingDir: dir };
}

/** Advance one cell: move, wrap at walls, and pick up any item under the new head (growing the tail). */
export function step(state: RecycleSnakeState): RecycleSnakeState {
  if (state.completed) return { ...state, collectedThisStep: null };
  const dir = state.pendingDir;
  const head = state.body[0]!;
  const newHead = { x: wrap(head.x + dir.x, state.cols), y: wrap(head.y + dir.y, state.rows) };
  const idx = state.items.findIndex((it) => it.x === newHead.x && it.y === newHead.y);
  const newBody = [newHead, ...state.body];
  let items = state.items;
  let collected = state.collected;
  let collectedThisStep: string | null = null;
  if (idx >= 0) {
    const item = state.items[idx]!;
    items = state.items.filter((_, i) => i !== idx);
    collected = [...state.collected, item.category];
    collectedThisStep = item.category; // grow: keep the full new body
  } else {
    newBody.pop(); // no pickup: tail follows, length unchanged
  }
  return {
    ...state,
    dir,
    body: newBody,
    items,
    collected,
    total: state.total,
    steps: state.steps + 1,
    completed: collected.length >= state.total,
    collectedThisStep,
  };
}

/** Deterministically collect a specific item (used by the E2E harness — no real driving needed). */
export function collectItemById(state: RecycleSnakeState, itemId: string): RecycleSnakeState {
  const idx = state.items.findIndex((it) => it.id === itemId);
  if (idx < 0) return { ...state, collectedThisStep: null };
  const item = state.items[idx]!;
  const newHead = { x: item.x, y: item.y };
  const collected = [...state.collected, item.category];
  return {
    ...state,
    body: [newHead, ...state.body],
    items: state.items.filter((_, i) => i !== idx),
    collected,
    steps: state.steps + 1,
    completed: collected.length >= state.total,
    collectedThisStep: item.category,
  };
}

// Parameterized by the launching missionId so one scene can serve several recycling missions (e.g.
// recycling-run + recycled-inventions), each unlocking its own '<missionId>-starter' sticker.
export function getRecycleSnakeResult(state: RecycleSnakeState, missionId: MissionId = 'recycling-run'): MissionResult {
  return {
    missionId,
    completed: state.completed,
    // A gentle no-fail collect-a-thon: every finish is a proud three stars.
    stars: clampStars(3),
    score: state.completed ? Math.max(100, 1000 - state.steps * 4) : 0,
    stickersUnlocked: state.completed ? [`${missionId}-starter`] : [],
    stats: { collected: state.collected.length, total: state.total, steps: state.steps },
  };
}
