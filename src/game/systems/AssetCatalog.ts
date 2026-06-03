export type AssetStatus = 'placeholder' | 'backlog' | 'production';
export type AssetKind = 'character' | 'tile' | 'prop' | 'ui' | 'fx' | 'audio' | 'font';
export type AssetLoadType = 'image' | 'audio' | 'spritesheet';

export type AssetSource = {
  name: string;
  url: string;
  license: 'CC0-1.0';
  author: string;
  notes: string;
};

export type AssetNeed = {
  key: string;
  kind: AssetKind;
  status: AssetStatus;
  description: string;
  path?: string;
  loadType?: AssetLoadType;
  source?: AssetSource;
  notes: string;
};

const originalCc0Source: AssetSource = {
  name: 'Rescue Town Builders original placeholder asset set',
  url: 'public/assets/',
  license: 'CC0-1.0',
  author: 'Rescue Town Builders project',
  notes: 'Original geometric SVGs created for this repository; no third-party IP, names, logos, likenesses, or fan art.',
};

const kenneyUiPackSource: AssetSource = {
  name: 'Kenney UI Pack',
  url: 'https://kenney.nl/assets/ui-pack',
  license: 'CC0-1.0',
  author: 'Kenney',
  notes: 'Official Kenney asset page lists Creative Commons CC0; imported only selected PNG button/star assets.',
};

const kenneyTinyTownSource: AssetSource = {
  name: 'Kenney Tiny Town',
  url: 'https://kenney.nl/assets/tiny-town',
  license: 'CC0-1.0',
  author: 'Kenney',
  notes: 'Official Kenney asset page lists Creative Commons CC0; imported only selected map tile/prop PNG assets.',
};

const kenneyShapeCharactersSource: AssetSource = {
  name: 'Kenney Shape Characters',
  url: 'https://kenney.nl/assets/shape-characters',
  license: 'CC0-1.0',
  author: 'Kenney',
  notes: 'Official Kenney asset page lists Creative Commons CC0; imported only selected body, face, hand, and shadow PNG assets.',
};

export const assetCatalog = [
  {
    key: 'ui.placeholder-shapes',
    kind: 'ui',
    status: 'placeholder',
    description: 'Runtime-drawn rounded rectangles, stars, panels, and large buttons.',
    notes: 'No imported art is required for No-Fail fallback rendering.',
  },
  {
    key: 'character.rivet',
    kind: 'character',
    status: 'production',
    description: 'Original recycle helper character badge art.',
    path: 'assets/characters/rivet.svg',
    loadType: 'image',
    source: originalCc0Source,
    notes: 'Simple original badge, safe fallback to text/emoji if missing.',
  },
  {
    key: 'character.brick',
    kind: 'character',
    status: 'production',
    description: 'Original builder helper character badge art.',
    path: 'assets/characters/brick.svg',
    loadType: 'image',
    source: originalCc0Source,
    notes: 'Simple original badge, safe fallback to text/emoji if missing.',
  },
  {
    key: 'character.ember',
    kind: 'character',
    status: 'production',
    description: 'Original fire helper character badge art.',
    path: 'assets/characters/ember.svg',
    loadType: 'image',
    source: originalCc0Source,
    notes: 'Simple original badge, safe fallback to text/emoji if missing.',
  },
  {
    key: 'town.map-node',
    kind: 'tile',
    status: 'production',
    description: 'Friendly town-map mission node marker.',
    path: 'assets/props/town-map-node.svg',
    loadType: 'image',
    source: originalCc0Source,
    notes: 'Supports town map polish while scene keeps runtime rectangles as fallback.',
  },
  {
    key: 'props.recycling-bin',
    kind: 'prop',
    status: 'production',
    description: 'Generic recycling bin icon for bin buttons.',
    path: 'assets/props/recycling-bin.svg',
    loadType: 'image',
    source: originalCc0Source,
    notes: 'Does not depict branded municipal marks.',
  },
  {
    key: 'props.recycling-paper',
    kind: 'prop',
    status: 'production',
    description: 'Paper recycling item icon.',
    path: 'assets/props/recycling-paper.svg',
    loadType: 'image',
    source: originalCc0Source,
    notes: 'Used by manifest coverage; gameplay can fall back to emoji labels.',
  },
  {
    key: 'props.recycling-trash',
    kind: 'prop',
    status: 'production',
    description: 'Trash item icon.',
    path: 'assets/props/recycling-trash.svg',
    loadType: 'image',
    source: originalCc0Source,
    notes: 'Used by manifest coverage; gameplay can fall back to emoji labels.',
  },
  ...(['compost', 'plastic', 'metal'] as const).map((category) => ({
    key: `props.recycling-${category}`,
    kind: 'prop' as const,
    status: 'production' as const,
    description: `${category} recycling item icon.`,
    path: `assets/props/recycling-${category}.svg`,
    loadType: 'image' as const,
    source: originalCc0Source,
    notes: 'Original category item art for Recycling Run; emoji/text remain fallback labels.',
  })),
  ...(['foundation', 'walls', 'roof', 'door', 'decoration'] as const).map((part) => ({
    key: `props.house-${part}`,
    kind: 'prop' as const,
    status: 'production' as const,
    description: `House Builder ${part} icon.`,
    path: `assets/props/house-${part}.svg`,
    loadType: 'image' as const,
    source: originalCc0Source,
    notes: 'Original simple SVG; runtime ghost house remains the fallback.',
  })),
  {
    key: 'props.fire',
    kind: 'prop',
    status: 'production',
    description: 'Cartoon fire icon for Fire Fix.',
    path: 'assets/props/fire.svg',
    loadType: 'image',
    source: originalCc0Source,
    notes: 'Friendly non-scary badge; scene circles remain fallback.',
  },
  {
    key: 'props.water-spray',
    kind: 'fx',
    status: 'production',
    description: 'Water spray feedback icon.',
    path: 'assets/props/water-spray.svg',
    loadType: 'image',
    source: originalCc0Source,
    notes: 'Scene line remains fallback.',
  },
  {
    key: 'props.hydrant',
    kind: 'prop',
    status: 'production',
    description: 'Friendly hydrant prop icon.',
    path: 'assets/props/hydrant.svg',
    loadType: 'image',
    source: originalCc0Source,
    notes: 'Generic original hydrant marker.',
  },
  {
    key: 'ui.sticker-star',
    kind: 'ui',
    status: 'production',
    description: 'Sticker/star reward badge.',
    path: 'assets/ui/sticker-star.svg',
    loadType: 'image',
    source: originalCc0Source,
    notes: 'Supports celebration polish with text-star fallback.',
  },
  {
    key: 'ui.button-panel',
    kind: 'ui',
    status: 'production',
    description: 'Reusable button/panel badge.',
    path: 'assets/ui/button-panel.svg',
    loadType: 'image',
    source: originalCc0Source,
    notes: 'Runtime button rectangles remain authoritative fallback.',
  },
  {
    key: 'fx.confetti',
    kind: 'fx',
    status: 'production',
    description: 'Celebration confetti sparkle badge.',
    path: 'assets/fx/confetti.svg',
    loadType: 'image',
    source: originalCc0Source,
    notes: 'Runtime circles remain fallback.',
  },
  ...(['blue', 'green', 'yellow', 'red'] as const).map((color) => ({
    key: `kenney.ui.button-${color}`,
    kind: 'ui' as const,
    status: 'production' as const,
    description: `Kenney UI Pack ${color} rectangle button panel.`,
    path: `assets/kenney/ui/button-${color}.png`,
    loadType: 'image' as const,
    source: kenneyUiPackSource,
    notes: 'Used as a visual layer under existing accessible button hit targets.',
  })),
  {
    key: 'kenney.ui.star-yellow',
    kind: 'ui',
    status: 'production',
    description: 'Kenney UI Pack yellow star.',
    path: 'assets/kenney/ui/star-yellow.png',
    loadType: 'image',
    source: kenneyUiPackSource,
    notes: 'Used for profile and town-map reward polish.',
  },
  ...([
    ['grass', 'grass tile'],
    ['tree-green', 'green tree tile'],
    ['tree-yellow', 'yellow tree tile'],
    ['target', 'mission target marker'],
    ['well', 'town well prop'],
  ] as const).map(([id, description]) => ({
    key: `kenney.tiny-town.${id}`,
    kind: id === 'grass' ? ('tile' as const) : ('prop' as const),
    status: 'production' as const,
    description: `Kenney Tiny Town ${description}.`,
    path: `assets/kenney/tiny-town/${id}.png`,
    loadType: 'image' as const,
    source: kenneyTinyTownSource,
    notes: 'Used to build a lightweight decorative town-map background.',
  })),
  ...([
    ['green-body-circle', 'green circular body'],
    ['yellow-body-squircle', 'yellow rounded-square body'],
    ['red-body-circle', 'red circular body'],
    ['face-happy', 'happy face'],
    ['face-calm', 'calm face'],
    ['face-bright', 'bright face'],
    ['green-hand-open', 'green open hand'],
    ['yellow-hand-open', 'yellow open hand'],
    ['red-hand-open', 'red open hand'],
    ['shadow', 'soft character shadow'],
  ] as const).map(([id, description]) => ({
    key: `kenney.shape.${id}`,
    kind: 'character' as const,
    status: 'production' as const,
    description: `Kenney Shape Characters ${description}.`,
    path: `assets/kenney/shape/${id}.png`,
    loadType: 'image' as const,
    source: kenneyShapeCharactersSource,
    notes: 'Layered into original Rivet, Brick, and Ember helper avatars.',
  })),
  {
    key: 'audio.theme-loop',
    kind: 'audio',
    status: 'backlog',
    description: 'Generated theme music loop currently in four segments that need splicing.',
    notes: 'Do not import yet. Keep Slice 0 silent/minimal until audio settings and license/source notes exist.',
  },
] satisfies AssetNeed[];

export function ensureUniqueAssetKeys(assets: readonly AssetNeed[]): boolean {
  return new Set(assets.map((asset) => asset.key)).size === assets.length;
}

export function listAssetNeedsByStatus(assets: readonly AssetNeed[], status: AssetStatus): AssetNeed[] {
  return assets.filter((asset) => asset.status === status);
}

export function listLoadableAssets(assets: readonly AssetNeed[] = assetCatalog): AssetNeed[] {
  return assets.filter((asset) => asset.status === 'production' && Boolean(asset.path && asset.loadType));
}

export function assetHasVerifiedCc0Source(asset: AssetNeed): boolean {
  return asset.status !== 'production' || asset.source?.license === 'CC0-1.0';
}

export function resolveAssetPath(asset: AssetNeed, baseUrl = '/'): string | null {
  if (!asset.path) return null;
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  return new URL(asset.path, `http://rescue-town-builders.local${normalizedBase}`).pathname;
}
