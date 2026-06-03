import { describe, expect, it } from 'vitest';
import { assetCatalog, ensureUniqueAssetKeys, listAssetNeedsByStatus } from '../src/game/systems/AssetCatalog';

describe('AssetCatalog', () => {
  it('keeps placeholder asset keys unique', () => {
    expect(ensureUniqueAssetKeys(assetCatalog)).toBe(true);
  });

  it('tracks the generated theme loop as backlog-only until audio polish', () => {
    const backlog = listAssetNeedsByStatus(assetCatalog, 'backlog');
    expect(backlog.some((asset) => asset.key === 'audio.theme-loop')).toBe(true);
  });
});
