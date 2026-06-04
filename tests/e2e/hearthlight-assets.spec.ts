import { mkdirSync } from 'node:fs';
import { expect, test, type Page } from '@playwright/test';
import {
  HEARTHLIGHT_ASSETS,
  HEARTHLIGHT_SPRITESHEET_ASSETS,
  hearthlightAssetUrl,
  type HearthlightAsset,
} from '../../src/game/data/hearthlightAssets';

type TextureInfo = {
  key: string;
  exists: boolean;
  width: number;
  height: number;
  frameTotal: number;
};

type GalleryCheck = {
  key: string;
  width: number;
  height: number;
  alphaPixels: number;
  colorCount: number;
};

const SHOTS = process.env.RTB_SHOTS ?? 'test-results/shots';

const SURFACES = [
  {
    name: 'mission-backdrops',
    keys: ['hl.bg.recycle', 'hl.bg.build', 'hl.bg.fire'],
  },
  {
    name: 'mission-props',
    keys: [
      'hl.prop.binPaper',
      'hl.prop.binGlass',
      'hl.prop.binCompost',
      'hl.prop.binTrash',
      'hl.prop.itemBananaPeel',
      'hl.prop.itemAppleCore',
      'hl.prop.itemNewspaper',
      'hl.prop.itemCardboardBox',
      'hl.prop.itemGlassBottle',
      'hl.prop.itemYogurtCup',
      'hl.prop.itemSoupCan',
      'hl.prop.itemFoilBall',
      'hl.prop.itemBrokenCrayon',
      'hl.prop.itemStickyWrapper',
      'hl.prop.itemPaperBag',
      'hl.prop.itemPlasticLid',
      'hl.prop.blueprintFrame',
      'hl.prop.houseFoundation',
      'hl.prop.houseWall',
      'hl.prop.houseRoof',
      'hl.prop.houseDoor',
      'hl.prop.houseWindow',
      'hl.prop.houseDecoration',
      'hl.prop.housePreview',
      'hl.prop.campfire',
      'hl.prop.embers',
      'hl.prop.hose',
      'hl.prop.waterSplash',
      'hl.prop.picnicBlanket',
      'hl.prop.picnicBasket',
      'hl.prop.hydrant',
      'hl.prop.smokeWisp',
    ],
  },
  {
    name: 'ui-kit',
    keys: [
      'hl.ui.panel',
      'hl.ui.help',
      'hl.ui.pause',
      'hl.ui.next',
      'hl.ui.retry',
      'hl.ui.mute',
      'hl.ui.starEmpty',
      'hl.ui.starFull',
      'hl.ui.heart',
      'hl.ui.progressPip',
      'hl.ui.stickerFrame',
      'hl.ui.checkmark',
    ],
  },
  {
    name: 'fx-sheets',
    keys: [
      'hl.fx.particleSheet',
      'hl.fx.sparkle',
      'hl.fx.dustPuff',
      'hl.fx.waterDroplet',
      'hl.fx.smokeWisp',
      'hl.fx.confetti',
      'hl.fx.lightBurst',
    ],
  },
  {
    name: 'town-map',
    keys: ['hl.map.sky', 'hl.map.farHills', 'hl.map.midTown', 'hl.map.nearPath', 'hl.map.houseDark', 'hl.map.houseLit'],
  },
] as const;

const assetByKey = new Map<string, HearthlightAsset>(HEARTHLIGHT_ASSETS.map((asset) => [asset.key, asset]));
const spritesheetByKey = new Map<string, (typeof HEARTHLIGHT_SPRITESHEET_ASSETS)[number]>(
  HEARTHLIGHT_SPRITESHEET_ASSETS.map((asset) => [asset.key, asset]),
);

function surfaceAssets(keys: readonly string[]): Array<HearthlightAsset & { url: string }> {
  return keys.map((key) => {
    const asset = assetByKey.get(key);
    if (!asset) throw new Error(`Missing Hearthlight asset metadata for ${key}`);
    return { ...asset, url: hearthlightAssetUrl('/', asset.rel) };
  });
}

async function waitForBridge(page: Page): Promise<void> {
  await page.waitForFunction(() => Boolean(window.__RTB_E2E__));
}

async function renderGallery(page: Page, assets: Array<HearthlightAsset & { url: string }>): Promise<GalleryCheck[]> {
  return page.evaluate(async (items) => {
    document.body.innerHTML = '';
    document.body.style.cssText =
      'margin:0;background:#1B2A41;color:#FFE6A3;font:14px system-ui;min-height:100vh;overflow:auto;';

    const main = document.createElement('main');
    main.style.cssText =
      'box-sizing:border-box;display:grid;grid-template-columns:repeat(auto-fill,minmax(132px,1fr));gap:12px;padding:16px;';
    document.body.append(main);

    const checks: GalleryCheck[] = [];
    for (const asset of items) {
      const image = new Image();
      image.alt = asset.key;
      image.src = asset.url;
      await new Promise<void>((resolve, reject) => {
        image.onload = () => resolve();
        image.onerror = () => reject(new Error(`Could not load ${asset.url}`));
      });

      const canvas = document.createElement('canvas');
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const context = canvas.getContext('2d');
      if (!context) throw new Error('Canvas 2D context unavailable.');
      context.drawImage(image, 0, 0);

      const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
      const colors = new Set<string>();
      let alphaPixels = 0;
      for (let index = 0; index < pixels.length; index += 4) {
        const alpha = pixels[index + 3] ?? 0;
        if (alpha === 0) continue;
        alphaPixels += 1;
        if (colors.size < 32) {
          colors.add(`${pixels[index]},${pixels[index + 1]},${pixels[index + 2]},${alpha}`);
        }
      }

      const tile = document.createElement('figure');
      tile.style.cssText =
        'margin:0;border:1px solid #3A4D6B;background:#243652;padding:8px;min-height:124px;display:flex;flex-direction:column;gap:6px;align-items:center;justify-content:center;';
      image.style.cssText =
        'image-rendering:pixelated;max-width:100%;max-height:118px;object-fit:contain;background:repeating-conic-gradient(#1B2A41 0% 25%,#3A4D6B 0% 50%) 50% / 16px 16px;';
      const label = document.createElement('figcaption');
      label.textContent = asset.key;
      label.style.cssText = 'font-size:10px;color:#EBDDDA;overflow-wrap:anywhere;text-align:center;';
      tile.append(image, label);
      main.append(tile);

      checks.push({
        key: asset.key,
        width: image.naturalWidth,
        height: image.naturalHeight,
        alphaPixels,
        colorCount: colors.size,
      });
    }
    return checks;
  }, assets);
}

test('loads every Hearthlight texture and captures nonblank asset surfaces', async ({ page }) => {
  mkdirSync(SHOTS, { recursive: true });
  const errors: string[] = [];
  const failedResponses: string[] = [];
  page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(`console: ${message.text()}`);
  });
  page.on('response', (response) => {
    if (response.status() >= 400 && !response.url().includes('favicon')) {
      failedResponses.push(`${response.status()} ${response.url()}`);
    }
  });

  await page.goto('/?rtb_e2e=1');
  await waitForBridge(page);
  await page.evaluate(() => window.__RTB_E2E__?.waitForScene('StartScene', 5000));

  const textures = await page.evaluate(() => window.__RTB_E2E__?.getTextureInfo() ?? []);
  const textureByKey = new Map((textures as TextureInfo[]).map((texture) => [texture.key, texture]));
  for (const asset of HEARTHLIGHT_ASSETS) {
    const texture = textureByKey.get(asset.key);
    expect(texture?.exists, `${asset.key} exists in Phaser texture cache`).toBe(true);
    expect(texture?.width ?? 0, `${asset.key} has width`).toBeGreaterThanOrEqual(1);
    expect(texture?.height ?? 0, `${asset.key} has height`).toBeGreaterThanOrEqual(1);

    const spritesheet = spritesheetByKey.get(asset.key);
    if (spritesheet) {
      expect(texture?.frameTotal ?? 0, `${asset.key} exposes the exact animation frame count`).toBe(
        spritesheet.frameCount,
      );
    }
  }

  for (const surface of SURFACES) {
    const checks = await renderGallery(page, surfaceAssets(surface.keys));
    for (const check of checks) {
      expect(check.width, `${check.key} natural width`).toBeGreaterThanOrEqual(1);
      expect(check.height, `${check.key} natural height`).toBeGreaterThanOrEqual(1);
      expect(check.alphaPixels, `${check.key} nonblank visible pixels`).toBeGreaterThanOrEqual(32);
      expect(check.colorCount, `${check.key} has visible color variety`).toBeGreaterThanOrEqual(2);
    }
    await page.screenshot({ path: `${SHOTS}/hearthlight-${surface.name}.png` });
  }

  await page.waitForTimeout(100);
  expect(errors, `page errors:\n${errors.join('\n')}`).toEqual([]);
  expect(failedResponses, `failed responses:\n${failedResponses.join('\n')}`).toEqual([]);
});
