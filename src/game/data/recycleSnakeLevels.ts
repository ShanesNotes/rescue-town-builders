import type { RecycleSnakeLevel } from '../systems/RecycleSnake';

// Three yards on the same 12×6 grid (so the scene's grid constants stay valid), with more recyclables
// to round up each yard (6 → 7 → 8). Rivet starts dead-centre-left driving right; no item sits on the
// start cell (2,3). Item ids map to real sprites + categories (compost/paper/plastic/metal).
const GRID = { cols: 12, rows: 6, startX: 2, startY: 3 };

export const recycleSnakeLevels: RecycleSnakeLevel[] = [
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
