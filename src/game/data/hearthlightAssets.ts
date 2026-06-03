import type Phaser from 'phaser';

// The Hearthlight pixel-art set (Codex-generated, original + IP-safe; see design-system.md).
// Loaded as plain images (pixelArt rendering in GameConfig keeps them crisp).
export const HEARTHLIGHT_ASSETS = [
  ['hl.bg.town', 'bg/town-backdrop.png'],
  ['hl.bg.hills', 'bg/far-hills.png'],
  ['hl.bg.trees', 'bg/mid-trees.png'],
  ['hl.char.rivet', 'characters/rivet.png'],
  ['hl.char.brick', 'characters/brick.png'],
  ['hl.char.ember', 'characters/ember.png'],
  ['hl.char.cluckle', 'characters/cluckle.png'],
  ['hl.ui.play', 'ui/play.png'],
  ['hl.ui.recycle', 'ui/recycle.png'],
  ['hl.ui.build', 'ui/build.png'],
  ['hl.ui.fire', 'ui/fire.png'],
  ['hl.ui.stickers', 'ui/stickers.png'],
  ['hl.ui.settings', 'ui/settings.png'],
  ['hl.ui.back', 'ui/back.png'],
  ['hl.prop.houseDark', 'props/house-dark.png'],
  ['hl.prop.houseLit', 'props/house-lit.png'],
  ['hl.prop.lantern', 'props/lantern.png'],
  ['hl.prop.firefly', 'props/firefly.png'],
  ['hl.prop.panel', 'props/panel-9slice.png'],
  ['hl.prop.star', 'props/star.png'],
] as const;

export function loadHearthlightAssets(scene: Phaser.Scene, baseUrl: string): void {
  const base = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  for (const [key, rel] of HEARTHLIGHT_ASSETS) {
    scene.load.image(key, `${base}assets/hearthlight/${rel}`);
  }
}
