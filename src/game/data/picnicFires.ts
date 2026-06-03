import type { FireObject } from '../systems/FireFix';

export const picnicFires: FireObject[] = [
  { id: 'grill-fire', label: 'Grill fire', x: 360, y: 260, health: 2, maxHealth: 2 },
  { id: 'barrel-fire', label: 'Barrel fire', x: 520, y: 210, health: 2, maxHealth: 2 },
  { id: 'bush-fire', label: 'Bush fire', x: 680, y: 300, health: 2, maxHealth: 2 },
  { id: 'picnic-fire', label: 'Picnic fire', x: 760, y: 210, health: 1, maxHealth: 1 },
  { id: 'lantern-fire', label: 'Lantern fire', x: 450, y: 350, health: 1, maxHealth: 1 },
];
