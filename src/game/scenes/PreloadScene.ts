import Phaser from 'phaser';
import { HEARTHLIGHT_ASSETS, loadHearthlightAssets } from '../data/hearthlightAssets';
import { assetCatalog, listLoadableAssets, resolveAssetPath } from '../systems/AssetCatalog';
import { registerE2ETextureInfo } from '../systems/E2EBridge';
import { fadeInScene } from '../systems/SceneTransitions';
import { SCENE_KEYS, startScene } from '../systems/SceneNavigation';
import { FONTS } from '../ui/typography';
import { motionAllowed } from '../ui/Sprite';

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

    // A warm little firefly fades up during the wait so the splash feels alive, not frozen.
    if (motionAllowed()) {
      const firefly = this.add.circle(480, 376, 5, 0xffe2a6, 0).setBlendMode(Phaser.BlendModes.ADD);
      this.tweens.add({ targets: firefly, alpha: 0.9, scale: 1.4, duration: 700, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    }

    this.startWhenFontsReady();
  }

  // Join the pixel-font readiness into the splash gate so the title never flashes a fallback font
  // (P3-09): wait for document.fonts.ready, but always hold the splash a minimum beat so the
  // transition still feels intentional rather than a blink.
  private startWhenFontsReady(): void {
    const MIN_SPLASH_MS = 250;
    const MAX_WAIT_MS = 1500; // No-Fail: a stuck FontFace must never freeze the splash forever.
    const start = Date.now();
    let started = false;
    const proceed = (): void => {
      if (started) return;
      started = true;
      const elapsed = Date.now() - start;
      this.time.delayedCall(Math.max(0, MIN_SPLASH_MS - elapsed), () => startScene(this, SCENE_KEYS.start));
    };
    const fonts = typeof document !== 'undefined' ? document.fonts : null;
    if (fonts?.ready) void fonts.ready.then(proceed, proceed);
    else proceed();
    this.time.delayedCall(MAX_WAIT_MS, proceed); // hard ceiling, whatever the font state
  }
}
