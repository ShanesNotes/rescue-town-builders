import type { MissionId } from '../types';
import type { RecycleSnakeLevel } from '../systems/RecycleSnake';

// All yards share the same 12×6 grid (the scene derives its grid constants from the default's first
// yard, so the grid size must stay constant), but each mission gets its OWN item layouts so the two
// captured recycling missions play distinctly. Start is dead-centre-left (2,3); no item sits there.
const GRID = { cols: 12, rows: 6, startX: 2, startY: 3 };

// Recycling Run — a balanced spread of all five categories, 6 → 7 → 8 items.
const RECYCLING_YARDS: RecycleSnakeLevel[] = [
  {
    ...GRID,
    items: [
      { id: 'banana-peel', x: 5, y: 1, category: 'compost' },
      { id: 'newspaper', x: 8, y: 2, category: 'paper' },
      { id: 'yogurt-cup', x: 10, y: 4, category: 'plastic' },
      { id: 'soup-can', x: 6, y: 4, category: 'metal' },
      { id: 'apple-core', x: 3, y: 0, category: 'compost' },
      { id: 'paper-bag', x: 9, y: 0, category: 'paper' },
    ],
  },
  {
    ...GRID,
    items: [
      { id: 'banana-peel', x: 4, y: 0, category: 'compost' },
      { id: 'newspaper', x: 7, y: 1, category: 'paper' },
      { id: 'yogurt-cup', x: 10, y: 2, category: 'plastic' },
      { id: 'soup-can', x: 5, y: 5, category: 'metal' },
      { id: 'apple-core', x: 9, y: 4, category: 'compost' },
      { id: 'paper-bag', x: 1, y: 1, category: 'paper' },
      { id: 'plastic-lid', x: 6, y: 3, category: 'plastic' },
    ],
  },
  {
    ...GRID,
    items: [
      { id: 'banana-peel', x: 3, y: 1, category: 'compost' },
      { id: 'newspaper', x: 6, y: 0, category: 'paper' },
      { id: 'yogurt-cup', x: 9, y: 1, category: 'plastic' },
      { id: 'soup-can', x: 11, y: 3, category: 'metal' },
      { id: 'apple-core', x: 1, y: 4, category: 'compost' },
      { id: 'paper-bag', x: 5, y: 5, category: 'paper' },
      { id: 'plastic-lid', x: 8, y: 4, category: 'plastic' },
      { id: 'foil-ball', x: 10, y: 5, category: 'metal' },
    ],
  },
];

// Recycled Inventions — Reed's parts run: biased to the shiny metal + plastic "parts", different
// layouts, a slightly tighter 5 → 7 → 8.
const INVENTIONS_YARDS: RecycleSnakeLevel[] = [
  {
    ...GRID,
    items: [
      { id: 'soup-can', x: 3, y: 1, category: 'metal' },
      { id: 'foil-ball', x: 7, y: 2, category: 'metal' },
      { id: 'plastic-lid', x: 9, y: 4, category: 'plastic' },
      { id: 'yogurt-cup', x: 5, y: 5, category: 'plastic' },
      { id: 'newspaper', x: 10, y: 0, category: 'paper' },
    ],
  },
  {
    ...GRID,
    items: [
      { id: 'foil-ball', x: 2, y: 0, category: 'metal' },
      { id: 'soup-can', x: 6, y: 2, category: 'metal' },
      { id: 'plastic-lid', x: 9, y: 1, category: 'plastic' },
      { id: 'yogurt-cup', x: 4, y: 4, category: 'plastic' },
      { id: 'banana-peel', x: 11, y: 3, category: 'compost' },
      { id: 'paper-bag', x: 1, y: 5, category: 'paper' },
      { id: 'newspaper', x: 7, y: 5, category: 'paper' },
    ],
  },
  {
    ...GRID,
    items: [
      { id: 'soup-can', x: 3, y: 0, category: 'metal' },
      { id: 'foil-ball', x: 10, y: 2, category: 'metal' },
      { id: 'plastic-lid', x: 6, y: 1, category: 'plastic' },
      { id: 'yogurt-cup', x: 8, y: 4, category: 'plastic' },
      { id: 'apple-core', x: 1, y: 2, category: 'compost' },
      { id: 'banana-peel', x: 11, y: 5, category: 'compost' },
      { id: 'paper-bag', x: 4, y: 5, category: 'paper' },
      { id: 'newspaper', x: 9, y: 0, category: 'paper' },
    ],
  },
];

export const recycleSnakeTuning: Partial<Record<MissionId, RecycleSnakeLevel[]>> = {
  'recycling-run': RECYCLING_YARDS,
  'recycled-inventions': INVENTIONS_YARDS,
};
export const defaultRecycleSnakeYards = RECYCLING_YARDS;
