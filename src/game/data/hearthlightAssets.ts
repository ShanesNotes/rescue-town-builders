import type Phaser from 'phaser';

// The Hearthlight pixel-art set (Codex-generated, original + IP-safe; see design-system.md).
// Loaded as plain images (pixelArt rendering in GameConfig keeps them crisp).
export const HEARTHLIGHT_ASSETS = [
  ['hl.bg.town', 'bg/town-backdrop.png'],
  ['hl.bg.hills', 'bg/far-hills.png'],
  ['hl.bg.trees', 'bg/mid-trees.png'],
  ['hl.bg.recycle', 'bg/recycle-yard.png'],
  ['hl.bg.build', 'bg/construction-lot.png'],
  ['hl.bg.fire', 'bg/picnic-fire.png'],
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
  ['hl.prop.binPaper', 'props/bin-paper.png'],
  ['hl.prop.binGlass', 'props/bin-glass.png'],
  ['hl.prop.binCompost', 'props/bin-compost.png'],
  ['hl.prop.binTrash', 'props/bin-trash.png'],
  ['hl.prop.itemBananaPeel', 'props/item-banana-peel.png'],
  ['hl.prop.itemAppleCore', 'props/item-apple-core.png'],
  ['hl.prop.itemNewspaper', 'props/item-newspaper.png'],
  ['hl.prop.itemCardboardBox', 'props/item-cardboard-box.png'],
  ['hl.prop.itemGlassBottle', 'props/item-glass-bottle.png'],
  ['hl.prop.itemYogurtCup', 'props/item-yogurt-cup.png'],
  ['hl.prop.itemSoupCan', 'props/item-soup-can.png'],
  ['hl.prop.itemFoilBall', 'props/item-foil-ball.png'],
  ['hl.prop.itemBrokenCrayon', 'props/item-broken-crayon.png'],
  ['hl.prop.itemStickyWrapper', 'props/item-sticky-wrapper.png'],
  ['hl.prop.itemPaperBag', 'props/item-paper-bag.png'],
  ['hl.prop.itemPlasticLid', 'props/item-plastic-lid.png'],
  ['hl.prop.blueprintFrame', 'props/blueprint-frame.png'],
  ['hl.prop.houseFoundation', 'props/house-foundation.png'],
  ['hl.prop.houseWall', 'props/house-wall.png'],
  ['hl.prop.houseRoof', 'props/house-roof.png'],
  ['hl.prop.houseDoor', 'props/house-door.png'],
  ['hl.prop.houseWindow', 'props/house-window.png'],
  ['hl.prop.houseDecoration', 'props/house-decoration.png'],
  ['hl.prop.housePreview', 'props/house-preview.png'],
  ['hl.prop.campfire', 'props/campfire.png'],
  ['hl.prop.embers', 'props/embers.png'],
  ['hl.prop.hose', 'props/hose.png'],
  ['hl.prop.waterSplash', 'props/water-splash.png'],
  ['hl.prop.picnicBlanket', 'props/picnic-blanket.png'],
  ['hl.prop.picnicBasket', 'props/picnic-basket.png'],
  ['hl.prop.hydrant', 'props/hydrant.png'],
  ['hl.prop.smokeWisp', 'props/smoke-wisp.png'],
  ['hl.prop.panel', 'props/panel-9slice.png'],
  ['hl.prop.star', 'props/star.png'],
] as const;

export function loadHearthlightAssets(scene: Phaser.Scene, baseUrl: string): void {
  const base = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  for (const [key, rel] of HEARTHLIGHT_ASSETS) {
    scene.load.image(key, `${base}assets/hearthlight/${rel}`);
  }
}
