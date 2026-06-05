import type { BrigadeFireSpec } from '../systems/FireBrigade';

// Five cartoon fires across the upper-middle play area (clear of Ember bottom-left and the
// secret bottom-right). Total heat 19 — a child arcs water onto each until it's a curl of steam.
// Heat is tuned so each fire takes a few satisfying direct hits, never a slog.
export const fireBrigadeLevel: BrigadeFireSpec[] = [
  { id: 'grill-fire', x: 392, y: 300, heat: 4 },
  { id: 'barrel-fire', x: 560, y: 248, heat: 5 },
  { id: 'bush-fire', x: 712, y: 330, heat: 4 },
  { id: 'picnic-fire', x: 470, y: 366, heat: 3 },
  { id: 'roof-fire', x: 648, y: 198, heat: 3 },
];
