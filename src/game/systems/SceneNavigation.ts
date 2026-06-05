import type { MissionArchetype, MissionId, MissionResult } from '../types';
import type Phaser from 'phaser';
import { fadeOutAndStart } from './SceneTransitions';

export const SCENE_KEYS = {
  boot: 'BootScene',
  preload: 'PreloadScene',
  start: 'StartScene',
  profile: 'ProfileScene',
  townMap: 'TownMapScene',
  parentSettingsGate: 'ParentSettingsGateScene',
  parentSettings: 'ParentSettingsScene',
  recyclingRun: 'RecyclingRunScene',
  houseBuilder: 'HouseBuilderScene',
  brickTower: 'BrickTowerScene',
  fireFix: 'FireFixScene',
  emberBrigade: 'EmberBrigadeScene',
  matchMission: 'MatchMissionScene',
  aimMission: 'AimMissionScene',
  journeyMission: 'JourneyMissionScene',
  placeholderMission: 'PlaceholderMissionScene',
  missionComplete: 'MissionCompleteScene',
  stickerBook: 'StickerBookScene',
} as const;

export type SceneKey = (typeof SCENE_KEYS)[keyof typeof SCENE_KEYS];
export type ParentSettingsReturnScene = typeof SCENE_KEYS.profile | typeof SCENE_KEYS.townMap;

export const MVP_SCENE_FLOW = [
  SCENE_KEYS.boot,
  SCENE_KEYS.preload,
  SCENE_KEYS.start,
  SCENE_KEYS.profile,
  SCENE_KEYS.townMap,
  SCENE_KEYS.parentSettingsGate,
  SCENE_KEYS.parentSettings,
  SCENE_KEYS.recyclingRun,
  SCENE_KEYS.houseBuilder,
  SCENE_KEYS.fireFix,
  SCENE_KEYS.placeholderMission,
  SCENE_KEYS.missionComplete,
] as const;

// The original three have bespoke scenes; roadmap missions route by archetype to a shared engine scene.
export const MISSION_SCENE_KEYS: Partial<Record<MissionId, SceneKey>> = {
  'recycling-run': SCENE_KEYS.recyclingRun,
  // Brick's Tower (physics stacker) replaces the ordered House Builder; same missionId/node/sticker.
  'house-builder': SCENE_KEYS.brickTower,
  // Ember's Fire Brigade (Arcade water-arc) replaces Fire Fix; same missionId/node/sticker.
  'fire-fix': SCENE_KEYS.emberBrigade,
};

const ARCHETYPE_SCENE_KEYS: Record<MissionArchetype, SceneKey> = {
  match: SCENE_KEYS.matchMission,
  aim: SCENE_KEYS.aimMission,
  journey: SCENE_KEYS.journeyMission,
};

export function sceneKeyForMission(missionId: MissionId, archetype?: MissionArchetype): SceneKey {
  if (archetype) return ARCHETYPE_SCENE_KEYS[archetype];
  return MISSION_SCENE_KEYS[missionId] ?? SCENE_KEYS.placeholderMission;
}

export function startScene(scene: Phaser.Scene, key: SceneKey, data?: object): void {
  scene.scene.start(key, data);
}

// The hub navigations (title↔profile↔townmap↔mission↔complete) route through this so leaving a
// scene is a soft fade-out to warm cream, not an instant hard cut (P2-03). fadeOutAndStart is a
// no-op fade (starts immediately) under e2e / reduced motion, so specs never slow and nothing waits.
export function softStartScene(scene: Phaser.Scene, key: SceneKey, data?: object): void {
  fadeOutAndStart(scene, () => scene.scene.start(key, data));
}

export function startParentSettingsGate(scene: Phaser.Scene, returnScene: ParentSettingsReturnScene): void {
  softStartScene(scene, SCENE_KEYS.parentSettingsGate, { returnScene });
}

// Optionally open the map on a specific node (e.g. the mission just finished), selected and lit,
// so the child lands on the star they earned. Defaults to page 0 / index 0 (back-compat).
export function returnToTownMap(scene: Phaser.Scene, focus?: { page: number; selectedIndex: number }): void {
  softStartScene(scene, SCENE_KEYS.townMap, focus ? { ...focus, celebrate: true } : undefined);
}

// Optionally open straight to a single sticker's reading page (the just-earned one), so the
// celebration leads right into reading its little story (P2-02). Omit for the grid.
export function startStickerBook(scene: Phaser.Scene, readingId?: string): void {
  softStartScene(scene, SCENE_KEYS.stickerBook, readingId ? { readingId } : undefined);
}

export function returnToParentScene(scene: Phaser.Scene, returnScene: ParentSettingsReturnScene): void {
  softStartScene(scene, returnScene);
}

export function completeMission(scene: Phaser.Scene, result: MissionResult): void {
  softStartScene(scene, SCENE_KEYS.missionComplete, { result });
}
