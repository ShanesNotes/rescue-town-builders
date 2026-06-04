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

// Each mission has its OWN route shape + stop count, so they don't feel identical (within the
// scene's playable area, x:120–840, y:250–450).
function route(points: Array<[number, number, string]>): JourneyWaypoint[] {
  return points.map(([x, y, label], i) => ({ id: `w${i}`, x, y, label }));
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
    // meadow zig-zag, ends at the pen
    waypoints: route([
      [270, 410, 'Friend'],
      [450, 300, 'Friend'],
      [650, 400, 'Friend'],
      [840, 300, 'Pen'],
    ]),
  },
  'safety-lights': {
    characterId: 'dash',
    backdrop: 'hl.bg.safetyLights',
    stickerId: 'safety-lights-starter',
    coinKey: 'hl.char.dash',
    start: { x: 120, y: 430 },
    waypointKey: 'hl.prop.crosswalkMark',
    finalKey: 'hl.prop.safetyLantern',
    // a straight street of crossings
    waypoints: route([
      [250, 360, 'Cross'],
      [450, 360, 'Cross'],
      [650, 360, 'Cross'],
      [840, 360, 'Home'],
    ]),
  },
  'bike-explorer': {
    characterId: 'milo',
    backdrop: 'hl.bg.bikeExplorer',
    stickerId: 'bike-explorer-starter',
    coinKey: 'hl.char.milo',
    start: { x: 120, y: 470 },
    waypointKey: 'hl.prop.bikeWaypoint',
    finalKey: 'hl.prop.neighborDoor',
    // a 5-stop neighborhood loop
    waypoints: route([
      [240, 430, 'Look'],
      [400, 300, 'Look'],
      [580, 270, 'Look'],
      [760, 330, 'Look'],
      [860, 440, 'Home'],
    ]),
  },
  'treasure-boat': {
    characterId: 'coral',
    backdrop: 'hl.bg.treasureBoat',
    stickerId: 'treasure-boat-starter',
    coinKey: 'hl.char.coral',
    start: { x: 120, y: 450 },
    waypointKey: 'hl.prop.buoy',
    finalKey: 'hl.prop.treasureChest',
    // an open-sea curve out to the treasure
    waypoints: route([
      [260, 380, 'Buoy'],
      [470, 300, 'Buoy'],
      [690, 370, 'Buoy'],
      [850, 290, 'Treasure'],
    ]),
  },
};
