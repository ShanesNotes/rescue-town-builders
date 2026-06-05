import { describe, expect, it } from 'vitest';
import { MISSION_SCENE_KEYS, MVP_SCENE_FLOW, SCENE_KEYS, sceneKeyForMission } from '../src/game/systems/SceneNavigation';

describe('SceneNavigation', () => {
  it('keeps route keys centralized for the MVP scene flow', () => {
    expect(MVP_SCENE_FLOW).toEqual([
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
    ]);
  });

  it('maps each MVP mission id to its scene route', () => {
    expect(MISSION_SCENE_KEYS).toEqual({
      'recycling-run': SCENE_KEYS.recyclingRun,
      // The house-builder mission now routes to Brick's Tower (the physics-stacker rebuild).
      'house-builder': SCENE_KEYS.brickTower,
      // Ember's water-arc scene serves fire-fix + the captured goo-cleanup.
      'fire-fix': SCENE_KEYS.emberBrigade,
      'goo-cleanup': SCENE_KEYS.emberBrigade,
      // Dream Catch captures inverse-dream + dream-statues (Arcade catcher).
      'inverse-dream': SCENE_KEYS.dreamCatch,
      'dream-statues': SCENE_KEYS.dreamCatch,
      // Town Ride captures all the journey missions.
      'scooter-roundup': SCENE_KEYS.townRide,
      'bike-explorer': SCENE_KEYS.townRide,
      'safety-lights': SCENE_KEYS.townRide,
      'treasure-boat': SCENE_KEYS.townRide,
      // Recycle Snake also captures recycled-inventions (same scene key as recycling-run).
      'recycled-inventions': SCENE_KEYS.recyclingRun,
    });
    expect(sceneKeyForMission('fire-fix')).toBe(SCENE_KEYS.emberBrigade);
    // A bespoke override wins over the archetype engine; an un-captured sibling still uses it.
    expect(sceneKeyForMission('inverse-dream', 'match')).toBe(SCENE_KEYS.dreamCatch);
    expect(sceneKeyForMission('dream-statues', 'match')).toBe(SCENE_KEYS.dreamCatch);
    expect(sceneKeyForMission('recycled-inventions', 'match')).toBe(SCENE_KEYS.recyclingRun);
    expect(sceneKeyForMission('bread-rush', 'match')).toBe(SCENE_KEYS.matchMission);
    expect(sceneKeyForMission('scooter-roundup', 'journey')).toBe(SCENE_KEYS.townRide);
    expect(sceneKeyForMission('bike-explorer', 'journey')).toBe(SCENE_KEYS.townRide);
    expect(sceneKeyForMission('treasure-boat', 'journey')).toBe(SCENE_KEYS.townRide);
  });
});
