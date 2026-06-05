import type { RecycleSnakeLevel } from '../systems/RecycleSnake';

// A 12×6 yard. Eight recyclables scattered for Rivet to collect, coloured by category (the tail
// shows what he's gathered). Start dead-centre-left driving right. No item sits on the start cell.
export const recycleSnakeLevel: RecycleSnakeLevel = {
  cols: 12,
  rows: 6,
  startX: 2,
  startY: 3,
  items: [
    { id: 'banana-peel', x: 5, y: 1, category: 'compost' },
    { id: 'newspaper', x: 8, y: 2, category: 'paper' },
    { id: 'yogurt-cup', x: 10, y: 4, category: 'plastic' },
    { id: 'soup-can', x: 6, y: 4, category: 'metal' },
    { id: 'apple-core', x: 3, y: 0, category: 'compost' },
    { id: 'paper-bag', x: 9, y: 0, category: 'paper' },
    { id: 'plastic-lid', x: 4, y: 5, category: 'plastic' },
    { id: 'foil-ball', x: 11, y: 2, category: 'metal' },
  ],
};
