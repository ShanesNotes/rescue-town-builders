import type { MissionId } from '../types';
import type { TownRideLevel } from '../systems/TownRide';

// Per-mission ride tuning so the four captured journeys play distinctly, not as backdrop reskins:
// each is 3 legs but with its own friend goals + scroll-speed feel.
export type TownRideTuning = { levels: TownRideLevel[]; speeds: number[] };

// Scooter Roundup — the baseline brisk meadow chase.
const SCOOTER: TownRideTuning = { levels: [{ goalFriends: 4 }, { goalFriends: 5 }, { goalFriends: 6 }], speeds: [1, 1.22, 1.46] };
// Bike Explorer — a longer, faster neighbourhood loop (more to round up, quicker road).
const BIKE: TownRideTuning = { levels: [{ goalFriends: 5 }, { goalFriends: 6 }, { goalFriends: 7 }], speeds: [1.1, 1.32, 1.55] };
// Safety Lights — calmer, steadier street crossings (gentle ramp, fewer at first).
const SAFETY: TownRideTuning = { levels: [{ goalFriends: 4 }, { goalFriends: 4 }, { goalFriends: 5 }], speeds: [0.95, 1.08, 1.22] };
// Treasure Boat — an unhurried open-sea voyage (slow drift, building to the haul).
const TREASURE: TownRideTuning = { levels: [{ goalFriends: 4 }, { goalFriends: 5 }, { goalFriends: 6 }], speeds: [0.9, 1.05, 1.22] };

export const townRideTuning: Partial<Record<MissionId, TownRideTuning>> = {
  'scooter-roundup': SCOOTER,
  'bike-explorer': BIKE,
  'safety-lights': SAFETY,
  'treasure-boat': TREASURE,
};
export const defaultTownRideTuning = SCOOTER;
