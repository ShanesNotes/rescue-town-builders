import type { MissionId } from '../types';
import type { DreamCatchLevel } from '../systems/DreamCatch';

// Per-mission catch tuning so the two captured dream missions play distinctly: each is 3 rounds of
// catching sun (day) + moon (night) dreams that sort into day/night bins, but with its own goal counts,
// fall speeds, and sun/moon mix.
export type DreamCatchTuning = { levels: DreamCatchLevel[]; speeds: number[] };

// Inverse Dream — the gentle baseline.
const INVERSE: DreamCatchTuning = {
  levels: [
    { goalDreams: 5, types: ['sun', 'moon', 'moon', 'sun', 'moon'] },
    { goalDreams: 6, types: ['moon', 'sun', 'sun', 'moon', 'sun', 'moon'] },
    { goalDreams: 7, types: ['sun', 'moon', 'sun', 'moon', 'moon', 'sun', 'moon'] },
  ],
  speeds: [42, 62, 84],
};
// Dream Statues — a busier, faster dream (more to catch, quicker falls, a moon-heavy night mix).
const STATUES: DreamCatchTuning = {
  levels: [
    { goalDreams: 6, types: ['moon', 'sun', 'moon', 'moon', 'sun', 'moon'] },
    { goalDreams: 7, types: ['sun', 'moon', 'moon', 'sun', 'moon', 'moon', 'sun'] },
    { goalDreams: 8, types: ['moon', 'moon', 'sun', 'moon', 'sun', 'moon', 'moon', 'sun'] },
  ],
  speeds: [52, 74, 98],
};

export const dreamCatchTuning: Partial<Record<MissionId, DreamCatchTuning>> = {
  'inverse-dream': INVERSE,
  'dream-statues': STATUES,
};
export const defaultDreamCatchTuning = INVERSE;
