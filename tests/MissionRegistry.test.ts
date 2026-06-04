import { describe, expect, it } from 'vitest';
import { MissionRegistry } from '../src/game/systems/MissionRegistry';
import { missionDefinitions } from '../src/game/data/missions';

describe('MissionRegistry', () => {
  it('lists every registered mission, with the three MVP missions first in PRD order', () => {
    const registry = new MissionRegistry(missionDefinitions);

    expect(registry.list().map((mission) => mission.id)).toEqual(missionDefinitions.map((d) => d.id));
    expect(registry.list().slice(0, 3).map((mission) => mission.id)).toEqual([
      'recycling-run',
      'house-builder',
      'fire-fix',
    ]);
  });

  it('looks up mission definitions by id', () => {
    const registry = new MissionRegistry(missionDefinitions);

    expect(registry.get('fire-fix')?.title).toBe("Ember's Fire Fix");
    expect(registry.get('missing')).toBeNull();
  });
});
