export const SCENE_KEYS = {
  boot: 'BootScene',
  preload: 'PreloadScene',
  start: 'StartScene',
  profile: 'ProfileScene',
  townMap: 'TownMapScene',
  parentSettingsGate: 'ParentSettingsGateScene',
  parentSettings: 'ParentSettingsScene',
  placeholderMission: 'PlaceholderMissionScene',
  missionComplete: 'MissionCompleteScene',
} as const;

export const SLICE_1_SCENE_FLOW = [
  SCENE_KEYS.boot,
  SCENE_KEYS.preload,
  SCENE_KEYS.start,
  SCENE_KEYS.profile,
  SCENE_KEYS.townMap,
  SCENE_KEYS.parentSettingsGate,
  SCENE_KEYS.parentSettings,
  SCENE_KEYS.placeholderMission,
  SCENE_KEYS.missionComplete,
] as const;
