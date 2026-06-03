import type Phaser from 'phaser';
import type { MissionId, MissionResult } from '../types';

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
  fireFix: 'FireFixScene',
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

export const MISSION_SCENE_KEYS: Record<MissionId, SceneKey> = {
  'recycling-run': SCENE_KEYS.recyclingRun,
  'house-builder': SCENE_KEYS.houseBuilder,
  'fire-fix': SCENE_KEYS.fireFix,
};

export function sceneKeyForMission(missionId: MissionId): SceneKey {
  return MISSION_SCENE_KEYS[missionId];
}

export function startScene(scene: Phaser.Scene, key: SceneKey, data?: object): void {
  scene.scene.start(key, data);
}

export function startParentSettingsGate(scene: Phaser.Scene, returnScene: ParentSettingsReturnScene): void {
  startScene(scene, SCENE_KEYS.parentSettingsGate, { returnScene });
}

export function returnToTownMap(scene: Phaser.Scene): void {
  startScene(scene, SCENE_KEYS.townMap);
}

export function startStickerBook(scene: Phaser.Scene): void {
  startScene(scene, SCENE_KEYS.stickerBook);
}

export function returnToParentScene(scene: Phaser.Scene, returnScene: ParentSettingsReturnScene): void {
  startScene(scene, returnScene);
}

export function completeMission(scene: Phaser.Scene, result: MissionResult): void {
  startScene(scene, SCENE_KEYS.missionComplete, { result });
}
