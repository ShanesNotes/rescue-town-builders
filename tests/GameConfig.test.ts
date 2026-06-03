import { describe, expect, it } from 'vitest';
import { SLICE_1_SCENE_FLOW } from '../src/game/scenes/sceneKeys';

describe('Slice 1 scene flow', () => {
  it('names the route from start through profile, map, fake mission, result, and settings', () => {
    expect(SLICE_1_SCENE_FLOW).toEqual([
      'BootScene',
      'PreloadScene',
      'StartScene',
      'ProfileScene',
      'TownMapScene',
      'ParentSettingsGateScene',
      'ParentSettingsScene',
      'PlaceholderMissionScene',
      'MissionCompleteScene',
    ]);
  });
});
