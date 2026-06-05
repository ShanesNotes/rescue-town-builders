import type { BrigadeFireSpec } from '../systems/FireBrigade';

// Five fires across the upper-middle lot (clear of Ember bottom-left and the secret bottom-right).
const POSITIONS: Array<{ id: string; x: number; y: number }> = [
  { id: 'grill-fire', x: 392, y: 300 },
  { id: 'barrel-fire', x: 560, y: 248 },
  { id: 'bush-fire', x: 712, y: 330 },
  { id: 'picnic-fire', x: 470, y: 366 },
  { id: 'roof-fire', x: 648, y: 198 },
];

// Three waves at the same five spots, hotter each time (heat 2 → 3 → 4): the fires take more sprays
// to cool as the round goes on, so it ramps without ever being a slog. Total heat 10+15+20 = 45
// (the deterministic E2E spray cools one heat per press, so e2e loops must exceed 45).
export const fireBrigadeWaves: BrigadeFireSpec[][] = [2, 3, 4].map((heat) =>
  POSITIONS.map((p) => ({ ...p, heat })),
);
