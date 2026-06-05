import type { DreamCatchLevel } from '../systems/DreamCatch';

// Three rounds of catching. The goal grows and the dreams fall faster each round (the scene reads
// the per-round fall speed), so it ramps gently. Each round mixes sun (day) and moon (night) dreams,
// which sort into their day/night bins — a soft echo of Inverse Dream's opposites.
export const dreamCatchLevels: DreamCatchLevel[] = [
  { goalDreams: 5, types: ['sun', 'moon', 'moon', 'sun', 'moon'] },
  { goalDreams: 6, types: ['moon', 'sun', 'sun', 'moon', 'sun', 'moon'] },
  { goalDreams: 7, types: ['sun', 'moon', 'sun', 'moon', 'moon', 'sun', 'moon'] },
];

// Initial downward speed of a falling dream, per round (faster = harder to line the basket up).
export const dreamFallSpeeds = [42, 62, 84];
