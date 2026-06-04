import type { MissionId } from '../types';

// Content for the roadmap Journey missions: tap the next glowing waypoint and the hero travels
// there; reaching the last completes. Sequential + No-Fail (tapping a not-yet waypoint only hints).
// Runs on MatchEngine's sequence logic with a spatial JourneyMissionScene.
export type JourneyWaypoint = { id: string; x: number; y: number; label: string };
export type JourneyMissionData = {
  characterId: string;
  backdrop: string;
  stickerId: string;
  coinKey: string;
  start: { x: number; y: number };
  waypointKey: string;
  finalKey?: string;
  waypoints: JourneyWaypoint[];
};

// A wandering path across the field (within the scene's playable area).
const PATH: Array<[number, number]> = [
  [240, 410],
  [430, 300],
  [650, 370],
  [840, 280],
];
function waypoints(labels: string[]): JourneyWaypoint[] {
  return PATH.map(([x, y], i) => ({ id: `w${i}`, x, y, label: labels[i] ?? `Stop ${i + 1}` }));
}

export const journeyMissions: Partial<Record<MissionId, JourneyMissionData>> = {
  'scooter-roundup': {
    characterId: 'scoot',
    backdrop: 'hl.bg.scooterRoundup',
    stickerId: 'scooter-roundup-starter',
    coinKey: 'hl.char.scoot',
    start: { x: 120, y: 470 },
    waypointKey: 'hl.prop.runawayFriend',
    finalKey: 'hl.prop.softFence',
    waypoints: waypoints(['Friend', 'Friend', 'Friend', 'Pen']),
  },
  'safety-lights': {
    characterId: 'dash',
    backdrop: 'hl.bg.safetyLights',
    stickerId: 'safety-lights-starter',
    coinKey: 'hl.char.dash',
    start: { x: 120, y: 470 },
    waypointKey: 'hl.prop.crosswalkMark',
    finalKey: 'hl.prop.safetyLantern',
    waypoints: waypoints(['Cross', 'Cross', 'Cross', 'Home']),
  },
  'bike-explorer': {
    characterId: 'milo',
    backdrop: 'hl.bg.bikeExplorer',
    stickerId: 'bike-explorer-starter',
    coinKey: 'hl.char.milo',
    start: { x: 120, y: 470 },
    waypointKey: 'hl.prop.bikeWaypoint',
    finalKey: 'hl.prop.neighborDoor',
    waypoints: waypoints(['Look', 'Look', 'Look', 'Home']),
  },
  'treasure-boat': {
    characterId: 'coral',
    backdrop: 'hl.bg.treasureBoat',
    stickerId: 'treasure-boat-starter',
    coinKey: 'hl.char.coral',
    start: { x: 120, y: 470 },
    waypointKey: 'hl.prop.buoy',
    finalKey: 'hl.prop.treasureChest',
    waypoints: waypoints(['Buoy', 'Buoy', 'Buoy', 'Treasure']),
  },
};
