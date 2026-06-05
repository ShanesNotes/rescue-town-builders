import type { TownRideLevel } from '../systems/TownRide';

// Three legs of the ride, rounding up more friends and rolling faster each leg.
export const townRideLevels: TownRideLevel[] = [
  { goalFriends: 4 },
  { goalFriends: 5 },
  { goalFriends: 6 },
];

// Scroll-speed multiplier per leg (the scene reads it) — the road rolls faster as it ramps.
export const townRideSpeeds = [1, 1.22, 1.46];
