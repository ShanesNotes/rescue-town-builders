export type AssetStatus = 'placeholder' | 'backlog' | 'production';
export type AssetKind = 'character' | 'tile' | 'prop' | 'ui' | 'fx' | 'audio' | 'font';

export type AssetNeed = {
  key: string;
  kind: AssetKind;
  status: AssetStatus;
  description: string;
  path?: string;
  notes: string;
};

export const assetCatalog: AssetNeed[] = [
  {
    key: 'ui.placeholder-shapes',
    kind: 'ui',
    status: 'placeholder',
    description: 'Runtime-drawn rounded rectangles, stars, panels, and large buttons.',
    notes: 'No imported art needed for Slice 0.',
  },
  {
    key: 'character.rivet',
    kind: 'character',
    status: 'backlog',
    description: 'Original recycle helper character art.',
    notes: 'Use simple text/emoji marker until production-safe art is selected.',
  },
  {
    key: 'character.brick',
    kind: 'character',
    status: 'backlog',
    description: 'Original builder helper character art.',
    notes: 'Use simple text/emoji marker until production-safe art is selected.',
  },
  {
    key: 'character.ember',
    kind: 'character',
    status: 'backlog',
    description: 'Original fire helper character art.',
    notes: 'Use simple text/emoji marker until production-safe art is selected.',
  },
  {
    key: 'props.recycling-bins-items',
    kind: 'prop',
    status: 'placeholder',
    description: 'Runtime emoji/text placeholders for Recycling Run bins and sortable items.',
    notes: 'Implemented in code for Slice 2; production icon-first art remains in the asset backlog.',
  },
  {
    key: 'props.house-parts',
    kind: 'prop',
    status: 'placeholder',
    description: 'Runtime shape/text placeholders for House Builder foundation, walls, roof, door, and decoration parts.',
    notes: 'Implemented in code for Slice 3; production icon-first house-part art remains in the asset backlog.',
  },
  {
    key: 'audio.theme-loop',
    kind: 'audio',
    status: 'backlog',
    description: 'Generated theme music loop currently in four segments that need splicing.',
    notes: 'Do not import yet. Keep Slice 0 silent/minimal until audio settings and license/source notes exist.',
  },
];

export function ensureUniqueAssetKeys(assets: AssetNeed[]): boolean {
  return new Set(assets.map((asset) => asset.key)).size === assets.length;
}

export function listAssetNeedsByStatus(assets: AssetNeed[], status: AssetStatus): AssetNeed[] {
  return assets.filter((asset) => asset.status === status);
}
