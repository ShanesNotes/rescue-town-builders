import type { BrickTowerLevel } from '../systems/BrickTower';

// Three progressively taller towers. The 6-brick floor guarantees each round completes (no-fail),
// while the ribbon climbs higher each round, so a NEAT stack is rewarded more as it gets harder.
// Brick size is constant across rounds (the generated brick textures are shared). Ground is ~y500;
// the 6th brick tops out near y188, so every ribbon (>=190) stays reachable by a tidy stack.
export const brickTowerLevels: BrickTowerLevel[] = [
  { id: 'tower-1', goalBricks: 6, targetY: 252, brickWidth: 118, brickHeight: 52 },
  { id: 'tower-2', goalBricks: 6, targetY: 220, brickWidth: 118, brickHeight: 52 },
  { id: 'tower-3', goalBricks: 6, targetY: 190, brickWidth: 118, brickHeight: 52 },
];
