import type { DreamCatchLevel } from '../systems/DreamCatch';

// Catch eight dreams. A balanced bag of sun (day) and moon (night) dreams falls in a gentle rhythm;
// each caught dream sorts into its day/night bin — a soft echo of Inverse Dream's opposites.
export const dreamCatchLevel: DreamCatchLevel = {
  goalDreams: 8,
  types: ['sun', 'moon', 'moon', 'sun', 'sun', 'moon', 'sun', 'moon'],
};
