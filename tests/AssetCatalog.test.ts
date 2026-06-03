import { describe, expect, it } from 'vitest';
import {
  assetCatalog,
  assetHasVerifiedCc0Source,
  ensureUniqueAssetKeys,
  listAssetNeedsByStatus,
  listLoadableAssets,
  resolveAssetPath,
} from '../src/game/systems/AssetCatalog';

describe('AssetCatalog', () => {
  it('keeps asset keys unique', () => {
    expect(ensureUniqueAssetKeys(assetCatalog)).toBe(true);
  });

  it('tracks the generated theme loop as backlog-only until audio polish', () => {
    const backlog = listAssetNeedsByStatus(assetCatalog, 'backlog');
    expect(backlog.some((asset) => asset.key === 'audio.theme-loop')).toBe(true);
  });

  it('only marks production assets when CC0 source metadata is recorded', () => {
    expect(assetCatalog.every(assetHasVerifiedCc0Source)).toBe(true);
  });

  it('exposes loadable production assets for all MVP visual areas', () => {
    const keys = listLoadableAssets(assetCatalog).map((asset) => asset.key);
    expect(keys).toEqual(
      expect.arrayContaining([
        'character.rivet',
        'character.brick',
        'character.ember',
        'town.map-node',
        'props.recycling-bin',
        'props.house-foundation',
        'props.fire',
        'props.water-spray',
        'props.hydrant',
        'ui.sticker-star',
        'fx.confetti',
      ]),
    );
  });

  it('resolves asset URLs under a deployment base path', () => {
    const rivet = assetCatalog.find((asset) => asset.key === 'character.rivet');
    expect(resolveAssetPath(rivet!, '/rescue-town-builders/')).toBe('/rescue-town-builders/assets/characters/rivet.svg');
  });
});
