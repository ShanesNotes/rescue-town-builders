import { describe, expect, it } from 'vitest';
import { MVP_SCENE_FLOW } from '../src/game/systems/SceneNavigation';

describe('MVP scene flow', () => {
  it('names the route from boot through the three MVP missions, result, and settings', () => {
    expect(MVP_SCENE_FLOW).toEqual([
      'BootScene',
      'PreloadScene',
      'StartScene',
      'ProfileScene',
      'TownMapScene',
      'ParentSettingsGateScene',
      'ParentSettingsScene',
      'RecyclingRunScene',
      'HouseBuilderScene',
      'FireFixScene',
      'PlaceholderMissionScene',
      'MissionCompleteScene',
    ]);
  });
});
