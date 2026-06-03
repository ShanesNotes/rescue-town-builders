import { expect, test, type Page } from '@playwright/test';

type SaveData = {
  profiles: Array<{
    progress: {
      missions: Record<string, { completed: boolean; bestStars: number }>;
      stickers: string[];
      totalStars: number;
    };
  }>;
};

async function waitForBridge(page: Page): Promise<void> {
  await page.waitForFunction(() => Boolean(window.__RTB_E2E__));
}

async function waitForScene(page: Page, sceneKey: string): Promise<void> {
  await page.evaluate((scene) => window.__RTB_E2E__?.waitForScene(scene, 5000), sceneKey);
}

async function press(page: Page, testId: string, sceneAfter?: string): Promise<void> {
  const ok = await page.evaluate((id) => window.__RTB_E2E__?.pressButton(id) ?? false, testId);
  expect(ok, `button ${testId} exists`).toBe(true);
  if (sceneAfter) await waitForScene(page, sceneAfter);
}

async function completeRecycling(page: Page): Promise<void> {
  const sequence = ['paper', 'paper', 'trash', 'trash', 'paper', 'paper', 'paper', 'trash', 'trash', 'paper'];
  for (const category of sequence) await press(page, `recycling.bin.${category}`);
  await waitForScene(page, 'MissionCompleteScene');
  await press(page, 'mission.complete.back-to-map', 'TownMapScene');
}

async function completeHouseBuilder(page: Page): Promise<void> {
  const parts = ['foundation', 'walls', 'roof', 'door', 'decoration'];
  for (let house = 0; house < 3; house += 1) {
    for (const part of parts) await press(page, `house.part.${part}`);
  }
  await waitForScene(page, 'MissionCompleteScene');
  await press(page, 'mission.complete.back-to-map', 'TownMapScene');
}

async function completeFireFix(page: Page): Promise<void> {
  for (const action of [
    'fire.spray',
    'fire.spray',
    'fire.move.right',
    'fire.spray',
    'fire.spray',
    'fire.spray',
    'fire.move.right',
    'fire.move.right',
    'fire.spray',
    'fire.spray',
    'fire.move.right',
    'fire.move.left',
    'fire.move.down',
    'fire.spray',
  ]) {
    await press(page, action);
  }
  await waitForScene(page, 'MissionCompleteScene');
  await press(page, 'mission.complete.back-to-map', 'TownMapScene');
}

function assertCompletedSave(save: SaveData | null): void {
  expect(save?.profiles).toHaveLength(1);
  const progress = save?.profiles[0]?.progress;
  expect(progress?.missions['recycling-run']?.completed).toBe(true);
  expect(progress?.missions['house-builder']?.completed).toBe(true);
  expect(progress?.missions['fire-fix']?.completed).toBe(true);
  expect(progress?.stickers).toEqual(
    expect.arrayContaining(['recycling-run-starter', 'house-builder-starter', 'fire-fix-starter']),
  );
  expect(progress?.totalStars).toBeGreaterThanOrEqual(6);
}

test('creates a profile, completes all MVP missions, and persists stars/stickers after refresh', async ({ page }) => {
  await page.goto('/?rtb_e2e=1');
  await page.evaluate(() => localStorage.clear());
  await waitForBridge(page);
  await waitForScene(page, 'StartScene');
  await press(page, 'start.play', 'ProfileScene');
  await press(page, 'profile.add', 'TownMapScene');

  await press(page, 'townmap.mission.recycling-run', 'RecyclingRunScene');
  await completeRecycling(page);

  await press(page, 'townmap.mission.house-builder', 'HouseBuilderScene');
  await completeHouseBuilder(page);

  await press(page, 'townmap.mission.fire-fix', 'FireFixScene');
  await completeFireFix(page);

  const beforeRefresh = await page.evaluate(() => window.__RTB_E2E__?.getSaveData() ?? null);
  assertCompletedSave(beforeRefresh);

  await page.reload();
  await waitForBridge(page);
  await waitForScene(page, 'StartScene');
  const afterRefresh = await page.evaluate(() => window.__RTB_E2E__?.getSaveData() ?? null);
  assertCompletedSave(afterRefresh);
});

test('mobile landscape viewport keeps the canvas visible and fitted', async ({ page }) => {
  await page.setViewportSize({ width: 844, height: 390 });
  await page.goto('/?rtb_e2e=1');
  const box = await page.locator('canvas').boundingBox();
  expect(box).not.toBeNull();
  expect(box?.width).toBeLessThanOrEqual(844);
  expect(box?.height).toBeLessThanOrEqual(390);
  const scroll = await page.evaluate(() => ({ x: document.documentElement.scrollWidth, y: document.documentElement.scrollHeight }));
  expect(scroll.x).toBeLessThanOrEqual(844);
  expect(scroll.y).toBeLessThanOrEqual(390);
});
