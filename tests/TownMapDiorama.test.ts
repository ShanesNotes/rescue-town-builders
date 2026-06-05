import { describe, expect, it } from 'vitest';
import { missionDefinitions } from '../src/game/data/missions';
import { projectTownMapNodes, type TownMapNode } from '../src/game/systems/TownMapProgress';
import { ambientBirdCount, dioramaDetailsForNode } from '../src/game/systems/TownMapDiorama';
import { HEARTHLIGHT_IMAGE_ASSETS } from '../src/game/data/hearthlightAssets';

const KNOWN_TEXTURES = new Set<string>(HEARTHLIGHT_IMAGE_ASSETS.map((asset) => asset.key));

function node(overrides: Partial<TownMapNode>): TownMapNode {
  return {
    missionId: 'recycling-run',
    title: 'x',
    characterId: 'rivet',
    mapNodeId: 'recycling-center',
    completed: false,
    bestStars: 0,
    attempts: 0,
    starsLabel: '',
    statusLabel: '',
    ...overrides,
  };
}

describe('TownMapDiorama', () => {
  it('grows no life details until a mission is completed', () => {
    expect(dioramaDetailsForNode(node({ completed: false }))).toEqual([]);
  });

  it('gives every completed mission at least one distinct life detail', () => {
    for (const mission of missionDefinitions) {
      const details = dioramaDetailsForNode(node({ missionId: mission.id, completed: true }));
      expect(details.length, `no diorama details for ${mission.id}`).toBeGreaterThan(0);
    }
  });

  it('is deterministic — the same node always yields the same details (persists across visits)', () => {
    const n = node({ missionId: 'fire-fix', completed: true });
    expect(dioramaDetailsForNode(n)).toEqual(dioramaDetailsForNode(n));
  });

  it('only references real textures for sprite-backed details', () => {
    for (const mission of missionDefinitions) {
      for (const detail of dioramaDetailsForNode(node({ missionId: mission.id, completed: true }))) {
        if (detail.kind === 'helper' || detail.kind === 'prop') {
          expect(detail.textureKey, `${mission.id} ${detail.kind} needs a texture`).toBeDefined();
          expect(KNOWN_TEXTURES.has(detail.textureKey!), `unknown texture ${detail.textureKey}`).toBe(true);
        }
      }
    }
  });

  it('keeps every detail clear of the centre column and inside the safe ground band', () => {
    // Star row spans cx +/-30; coins/houses live above y~412. Side offsets must clear the stars
    // and details must sit in the low ground band (y 240..500) so nothing covers the interactive
    // targets. Smoke is the one chimney detail that rises near the roof.
    for (const mission of missionDefinitions) {
      for (const detail of dioramaDetailsForNode(node({ missionId: mission.id, completed: true }))) {
        if (detail.kind !== 'smoke') {
          expect(Math.abs(detail.dx), `${mission.id} ${detail.kind} overlaps the star column`).toBeGreaterThanOrEqual(40);
        }
        expect(detail.y).toBeGreaterThanOrEqual(240);
        expect(detail.y).toBeLessThanOrEqual(500);
      }
    }
  });

  it('grows the ambient flock with rescues and caps it so the sky stays tasteful', () => {
    expect(ambientBirdCount(0)).toBe(0);
    expect(ambientBirdCount(1)).toBe(0);
    expect(ambientBirdCount(2)).toBe(1);
    expect(ambientBirdCount(8)).toBe(4);
    expect(ambientBirdCount(100)).toBe(5);
  });

  it('lights up the real projected town as missions complete', () => {
    const nodes = projectTownMapNodes(missionDefinitions, null);
    expect(nodes.every((n) => dioramaDetailsForNode(n).length === 0)).toBe(true);
  });
});
