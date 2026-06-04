import Phaser from 'phaser';
import { HEARTHLIGHT_ASSETS, loadHearthlightAssets } from '../data/hearthlightAssets';
import { assetCatalog, listLoadableAssets, resolveAssetPath } from '../systems/AssetCatalog';
import { registerE2ETextureInfo } from '../systems/E2EBridge';
import { fadeInScene } from '../systems/SceneTransitions';
import { SCENE_KEYS, startScene } from '../systems/SceneNavigation';
import { FONTS } from '../ui/typography';

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super('PreloadScene');
  }

  preload(): void {
    for (const asset of listLoadableAssets(assetCatalog)) {
      const path = resolveAssetPath(asset, import.meta.env.BASE_URL);
      if (!path || !asset.loadType) continue;
      if (asset.loadType === 'image') {
        // SVGs must rasterize via load.svg; load.image renders them as black squares in
        // Phaser's WebGL renderer. scale:2 keeps the aspect ratio and stays crisp.
        if (path.endsWith('.svg')) this.load.svg(asset.key, path, { scale: 2 });
        else this.load.image(asset.key, path);
      }
      if (asset.loadType === 'audio') this.load.audio(asset.key, path);
    }
    loadHearthlightAssets(this, import.meta.env.BASE_URL);
  }

  create(): void {
    registerE2ETextureInfo(() =>
      HEARTHLIGHT_ASSETS.map((asset) => {
        const exists = this.textures.exists(asset.key);
        const frame = exists ? (this.textures.getFrame(asset.key, 0) ?? this.textures.getFrame(asset.key)) : null;
        const texture = exists ? this.textures.get(asset.key) : null;
        return {
          key: asset.key,
          exists,
          width: frame?.width ?? 0,
          height: frame?.height ?? 0,
          frameTotal: texture?.getFrameNames(false).length ?? 0,
        };
      }),
    );
    fadeInScene(this);
    this.cameras.main.setBackgroundColor('#1B2A41');
    this.add
      .text(480, 250, 'RESCUE TOWN BUILDERS', {
        fontFamily: FONTS.display,
        fontSize: '40px',
        color: '#FFE2A6',
        fontStyle: 'bold',
        stroke: '#2A1606',
        strokeThickness: 6,
      })
      .setOrigin(0.5);
    this.add
      .text(480, 312, 'lighting the lamps...', {
        fontFamily: FONTS.label,
        fontSize: '15px',
        color: '#9DB4C0',
      })
      .setOrigin(0.5);
    this.time.delayedCall(250, () => startScene(this, SCENE_KEYS.start));
  }
}
