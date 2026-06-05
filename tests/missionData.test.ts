import { describe, expect, it } from 'vitest';
import { HEARTHLIGHT_ASSETS } from '../src/game/data/hearthlightAssets';
import { matchMissions } from '../src/game/data/matchMissions';
import { aimMissions } from '../src/game/data/aimMissions';
import { journeyMissions } from '../src/game/data/journeyMissions';
import { missionDefinitions } from '../src/game/data/missions';

// Static integrity for every roadmap mission's content: a typo'd texture key or a match prompt
// pointing at a non-existent target would only surface at runtime, so guard it here. Combined with
// the per-archetype e2e and the engine No-Fail unit tests, this confirms all 14 missions are sound.
const keys = new Set<string>(HEARTHLIGHT_ASSETS.map((asset) => asset.key));

describe('roadmap mission data integrity', () => {
  it('Match: every prompt maps to a real target, and all icons/backdrops are real textures', () => {
    for (const [id, m] of Object.entries(matchMissions)) {
      const targetIds = new Set(m.targets.map((t) => t.id));
      for (const p of m.prompts) expect(targetIds.has(p.correctTargetId), `${id}: prompt ${p.id} → ${p.correctTargetId}`).toBe(true);
      for (const t of m.targets) expect(keys.has(t.icon), `${id}: target icon ${t.icon}`).toBe(true);
      for (const p of m.prompts) expect(keys.has(p.icon), `${id}: prompt icon ${p.icon}`).toBe(true);
      expect(keys.has(m.backdrop), `${id}: backdrop ${m.backdrop}`).toBe(true);
    }
  });

  it('Match: every mission has a distinct payoff theme; bread-rush shuffles target row but keeps recipe order (P2-10/P3-07)', () => {
    for (const [id, m] of Object.entries(matchMissions)) {
      expect(m.payoff, `${id}: has a payoff theme`).toBeTruthy();
    }
    const bread = matchMissions['bread-rush'];
    expect(bread?.shuffleTargets).toBe(true); // tap-position memory broken
    expect(bread?.shuffle).toBeFalsy(); // recipe ORDER stays meaningful
    expect(bread?.recipeBowl).toBe(true);
    expect(bread?.prompts.map((p) => p.correctTargetId)).toEqual(['flour', 'water', 'yeast', 'dough', 'butter']);
  });

  it('Aim: target/act/cleared/backdrop textures are all real', () => {
    for (const [id, m] of Object.entries(aimMissions)) {
      expect(keys.has(m.backdrop), `${id}: backdrop`).toBe(true);
      expect(keys.has(m.targetKey), `${id}: target`).toBe(true);
      expect(keys.has(m.actIconKey), `${id}: act`).toBe(true);
      if (m.clearedKey) expect(keys.has(m.clearedKey), `${id}: cleared`).toBe(true);
      expect(m.targets.length).toBeGreaterThan(0);
    }
  });

  it('Journey: waypoint/final/backdrop textures are all real', () => {
    for (const [id, m] of Object.entries(journeyMissions)) {
      expect(keys.has(m.backdrop), `${id}: backdrop`).toBe(true);
      expect(keys.has(m.waypointKey), `${id}: waypoint`).toBe(true);
      if (m.finalKey) expect(keys.has(m.finalKey), `${id}: final`).toBe(true);
      expect(m.waypoints.length).toBeGreaterThan(0);
    }
  });

  it('every roadmap mission has matching engine data + a real character portrait', () => {
    for (const def of missionDefinitions) {
      if (!def.archetype) continue;
      const data =
        def.archetype === 'match' ? matchMissions[def.id] : def.archetype === 'aim' ? aimMissions[def.id] : journeyMissions[def.id];
      expect(data, `${def.id}: has ${def.archetype} data`).toBeTruthy();
      expect(keys.has(`hl.char.${def.characterId}`), `${def.id}: portrait hl.char.${def.characterId}`).toBe(true);
    }
  });
});
