import Phaser from 'phaser';
import { assetCatalog, listLoadableAssets, resolveAssetPath } from '../systems/AssetCatalog';
import { fadeInScene } from '../systems/SceneTransitions';
import { SCENE_KEYS, startScene } from '../systems/SceneNavigation';
import { addBody, addTitle } from '../ui/SceneText';

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
  }

  create(): void {
    fadeInScene(this);
    this.cameras.main.setBackgroundColor('#d9f5ff');
    addTitle(this, 'Rescue Town Builders');
    addBody(this, 190, 'Loading friendly CC0 assets with placeholder fallbacks...');
    this.time.delayedCall(250, () => startScene(this, SCENE_KEYS.start));
  }
}
