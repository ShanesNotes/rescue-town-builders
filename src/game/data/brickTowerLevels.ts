import type { BrickTowerLevel } from '../systems/BrickTower';

// One satisfying tower for v1. The ribbon sits high enough that a child must stack several solid
// bricks to reach it, but the brick-count floor (goalBricks) guarantees the round still completes
// for a child who just keeps dropping. Ground is ~y500, ribbon at y180 ≈ a chest-high tower.
export const brickTowerLevels: BrickTowerLevel[] = [
  {
    id: 'brick-first-tower',
    goalBricks: 6,
    targetY: 196,
    brickWidth: 118,
    brickHeight: 52,
  },
];
