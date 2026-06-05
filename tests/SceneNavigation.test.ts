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
      // The fire-fix mission now routes to Ember's Fire Brigade (the Arcade water-arc rebuild).
      'fire-fix': SCENE_KEYS.emberBrigade,
      // The inverse-dream match mission now routes to Cluckle's Dream Catch (Arcade catcher).
      'inverse-dream': SCENE_KEYS.dreamCatch,
      // The scooter-roundup journey mission now routes to Town Ride (momentum ride).
      'scooter-roundup': SCENE_KEYS.townRide,
    });
    expect(sceneKeyForMission('fire-fix')).toBe(SCENE_KEYS.emberBrigade);
    // A bespoke override wins over the archetype engine; a sibling mission still uses it.
    expect(sceneKeyForMission('inverse-dream', 'match')).toBe(SCENE_KEYS.dreamCatch);
    expect(sceneKeyForMission('dream-statues', 'match')).toBe(SCENE_KEYS.matchMission);
    expect(sceneKeyForMission('scooter-roundup', 'journey')).toBe(SCENE_KEYS.townRide);
    expect(sceneKeyForMission('bike-explorer', 'journey')).toBe(SCENE_KEYS.journeyMission);
  });
});
