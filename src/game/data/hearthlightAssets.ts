import type Phaser from 'phaser';

export type HearthlightImageAsset = {
  readonly key: string;
  readonly rel: string;
  readonly loadType: 'image';
};

export type HearthlightSpritesheetAsset = {
  readonly key: string;
  readonly rel: string;
  readonly loadType: 'spritesheet';
  readonly frameWidth: number;
  readonly frameHeight: number;
  readonly frameCount: number;
};

export type HearthlightAsset = HearthlightImageAsset | HearthlightSpritesheetAsset;

// The Hearthlight pixel-art set (Codex-generated, original + IP-safe; see design-system.md).
// Pixel-art rendering in GameConfig keeps image and spritesheet textures crisp.
export const HEARTHLIGHT_IMAGE_ASSETS = [
  { key: 'hl.bg.town', rel: 'bg/town-backdrop.png', loadType: 'image' },
  { key: 'hl.bg.hills', rel: 'bg/far-hills.png', loadType: 'image' },
  { key: 'hl.bg.trees', rel: 'bg/mid-trees.png', loadType: 'image' },
  { key: 'hl.bg.recycle', rel: 'bg/recycle-yard.png', loadType: 'image' },
  { key: 'hl.bg.build', rel: 'bg/construction-lot.png', loadType: 'image' },
  { key: 'hl.bg.fire', rel: 'bg/picnic-fire.png', loadType: 'image' },
  { key: 'hl.map.sky', rel: 'map/sky.png', loadType: 'image' },
  { key: 'hl.map.farHills', rel: 'map/far-hills.png', loadType: 'image' },
  { key: 'hl.map.midTown', rel: 'map/mid-town.png', loadType: 'image' },
  { key: 'hl.map.nearPath', rel: 'map/near-path.png', loadType: 'image' },
  { key: 'hl.map.houseDark', rel: 'map/house-node-dark.png', loadType: 'image' },
  { key: 'hl.map.houseLit', rel: 'map/house-node-lit.png', loadType: 'image' },
  { key: 'hl.char.rivet', rel: 'characters/rivet.png', loadType: 'image' },
  { key: 'hl.char.brick', rel: 'characters/brick.png', loadType: 'image' },
  { key: 'hl.char.ember', rel: 'characters/ember.png', loadType: 'image' },
  { key: 'hl.char.cluckle', rel: 'characters/cluckle.png', loadType: 'image' },
  { key: 'hl.ui.play', rel: 'ui/play.png', loadType: 'image' },
  { key: 'hl.ui.recycle', rel: 'ui/recycle.png', loadType: 'image' },
  { key: 'hl.ui.build', rel: 'ui/build.png', loadType: 'image' },
  { key: 'hl.ui.fire', rel: 'ui/fire.png', loadType: 'image' },
  { key: 'hl.ui.stickers', rel: 'ui/stickers.png', loadType: 'image' },
  { key: 'hl.ui.settings', rel: 'ui/settings.png', loadType: 'image' },
  { key: 'hl.ui.back', rel: 'ui/back.png', loadType: 'image' },
  { key: 'hl.ui.panel', rel: 'ui/panel-9slice.png', loadType: 'image' },
  { key: 'hl.ui.help', rel: 'ui/help.png', loadType: 'image' },
  { key: 'hl.ui.pause', rel: 'ui/pause.png', loadType: 'image' },
  { key: 'hl.ui.next', rel: 'ui/next.png', loadType: 'image' },
  { key: 'hl.ui.retry', rel: 'ui/retry.png', loadType: 'image' },
  { key: 'hl.ui.mute', rel: 'ui/mute.png', loadType: 'image' },
  { key: 'hl.ui.starEmpty', rel: 'ui/star-empty.png', loadType: 'image' },
  { key: 'hl.ui.starFull', rel: 'ui/star-full.png', loadType: 'image' },
  { key: 'hl.ui.heart', rel: 'ui/heart.png', loadType: 'image' },
  { key: 'hl.ui.progressPip', rel: 'ui/progress-pip.png', loadType: 'image' },
  { key: 'hl.ui.stickerFrame', rel: 'ui/sticker-frame.png', loadType: 'image' },
  { key: 'hl.ui.checkmark', rel: 'ui/checkmark.png', loadType: 'image' },
  { key: 'hl.prop.houseDark', rel: 'props/house-dark.png', loadType: 'image' },
  { key: 'hl.prop.houseLit', rel: 'props/house-lit.png', loadType: 'image' },
  { key: 'hl.prop.lantern', rel: 'props/lantern.png', loadType: 'image' },
  { key: 'hl.prop.firefly', rel: 'props/firefly.png', loadType: 'image' },
  { key: 'hl.prop.binPaper', rel: 'props/bin-paper.png', loadType: 'image' },
  { key: 'hl.prop.binGlass', rel: 'props/bin-glass.png', loadType: 'image' },
  { key: 'hl.prop.binCompost', rel: 'props/bin-compost.png', loadType: 'image' },
  { key: 'hl.prop.binTrash', rel: 'props/bin-trash.png', loadType: 'image' },
  { key: 'hl.prop.itemBananaPeel', rel: 'props/item-banana-peel.png', loadType: 'image' },
  { key: 'hl.prop.itemAppleCore', rel: 'props/item-apple-core.png', loadType: 'image' },
  { key: 'hl.prop.itemNewspaper', rel: 'props/item-newspaper.png', loadType: 'image' },
  { key: 'hl.prop.itemCardboardBox', rel: 'props/item-cardboard-box.png', loadType: 'image' },
  { key: 'hl.prop.itemGlassBottle', rel: 'props/item-glass-bottle.png', loadType: 'image' },
  { key: 'hl.prop.itemYogurtCup', rel: 'props/item-yogurt-cup.png', loadType: 'image' },
  { key: 'hl.prop.itemSoupCan', rel: 'props/item-soup-can.png', loadType: 'image' },
  { key: 'hl.prop.itemFoilBall', rel: 'props/item-foil-ball.png', loadType: 'image' },
  { key: 'hl.prop.itemBrokenCrayon', rel: 'props/item-broken-crayon.png', loadType: 'image' },
  { key: 'hl.prop.itemStickyWrapper', rel: 'props/item-sticky-wrapper.png', loadType: 'image' },
  { key: 'hl.prop.itemPaperBag', rel: 'props/item-paper-bag.png', loadType: 'image' },
  { key: 'hl.prop.itemPlasticLid', rel: 'props/item-plastic-lid.png', loadType: 'image' },
  { key: 'hl.prop.blueprintFrame', rel: 'props/blueprint-frame.png', loadType: 'image' },
  { key: 'hl.prop.houseFoundation', rel: 'props/house-foundation.png', loadType: 'image' },
  { key: 'hl.prop.houseWall', rel: 'props/house-wall.png', loadType: 'image' },
  { key: 'hl.prop.houseRoof', rel: 'props/house-roof.png', loadType: 'image' },
  { key: 'hl.prop.houseDoor', rel: 'props/house-door.png', loadType: 'image' },
  { key: 'hl.prop.houseWindow', rel: 'props/house-window.png', loadType: 'image' },
  { key: 'hl.prop.houseDecoration', rel: 'props/house-decoration.png', loadType: 'image' },
  { key: 'hl.prop.housePreview', rel: 'props/house-preview.png', loadType: 'image' },
  { key: 'hl.prop.campfire', rel: 'props/campfire.png', loadType: 'image' },
  { key: 'hl.prop.embers', rel: 'props/embers.png', loadType: 'image' },
  { key: 'hl.prop.hose', rel: 'props/hose.png', loadType: 'image' },
  { key: 'hl.prop.waterSplash', rel: 'props/water-splash.png', loadType: 'image' },
  { key: 'hl.prop.picnicBlanket', rel: 'props/picnic-blanket.png', loadType: 'image' },
  { key: 'hl.prop.picnicBasket', rel: 'props/picnic-basket.png', loadType: 'image' },
  { key: 'hl.prop.hydrant', rel: 'props/hydrant.png', loadType: 'image' },
  { key: 'hl.prop.smokeWisp', rel: 'props/smoke-wisp.png', loadType: 'image' },
  { key: 'hl.prop.panel', rel: 'props/panel-9slice.png', loadType: 'image' },
  { key: 'hl.prop.star', rel: 'props/star.png', loadType: 'image' },
] as const satisfies readonly HearthlightImageAsset[];

export const HEARTHLIGHT_SPRITESHEET_ASSETS = [
  {
    key: 'hl.fx.particleSheet',
    rel: 'fx/particle-fx-sheet.png',
    loadType: 'spritesheet',
    frameWidth: 64,
    frameHeight: 64,
    frameCount: 24,
  },
  {
    key: 'hl.fx.sparkle',
    rel: 'fx/sparkle.png',
    loadType: 'spritesheet',
    frameWidth: 64,
    frameHeight: 64,
    frameCount: 4,
  },
  {
    key: 'hl.fx.dustPuff',
    rel: 'fx/dust-puff.png',
    loadType: 'spritesheet',
    frameWidth: 64,
    frameHeight: 64,
    frameCount: 4,
  },
  {
    key: 'hl.fx.waterDroplet',
    rel: 'fx/water-droplet.png',
    loadType: 'spritesheet',
    frameWidth: 64,
    frameHeight: 64,
    frameCount: 4,
  },
  {
    key: 'hl.fx.smokeWisp',
    rel: 'fx/smoke-wisp.png',
    loadType: 'spritesheet',
    frameWidth: 64,
    frameHeight: 64,
    frameCount: 4,
  },
  {
    key: 'hl.fx.confetti',
    rel: 'fx/confetti.png',
    loadType: 'spritesheet',
    frameWidth: 64,
    frameHeight: 64,
    frameCount: 4,
  },
  {
    key: 'hl.fx.lightBurst',
    rel: 'fx/light-burst.png',
    loadType: 'spritesheet',
    frameWidth: 64,
    frameHeight: 64,
    frameCount: 4,
  },
] as const satisfies readonly HearthlightSpritesheetAsset[];

export const HEARTHLIGHT_ASSETS = [
  ...HEARTHLIGHT_IMAGE_ASSETS,
  ...HEARTHLIGHT_SPRITESHEET_ASSETS,
] as const satisfies readonly HearthlightAsset[];

export function hearthlightAssetUrl(baseUrl: string, rel: string): string {
  const base = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  return `${base}assets/hearthlight/${rel}`;
}

export function loadHearthlightAssets(scene: Phaser.Scene, baseUrl: string): void {
  for (const asset of HEARTHLIGHT_IMAGE_ASSETS) {
    scene.load.image(asset.key, hearthlightAssetUrl(baseUrl, asset.rel));
  }
  for (const asset of HEARTHLIGHT_SPRITESHEET_ASSETS) {
    scene.load.spritesheet(asset.key, hearthlightAssetUrl(baseUrl, asset.rel), {
      frameWidth: asset.frameWidth,
      frameHeight: asset.frameHeight,
    });
  }
}
