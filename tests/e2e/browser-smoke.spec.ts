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
  // The active blueprint slot is data-driven, so rotate through the three rescued
  // item cards until the workshop completes. Wrong pieces become decoration and
  // Helper Mode snaps in the needed part after repeated misses (No-Fail).
  const choices = ['recycling.choice.0', 'recycling.choice.1', 'recycling.choice.2'];
  for (let i = 0; i < 40; i += 1) {
    const scene = await page.evaluate(() => window.__RTB_E2E__?.currentSceneKey);
    if (scene !== 'RecyclingRunScene') break;
    await page.evaluate((id) => window.__RTB_E2E__?.pressButton(id), choices[i % choices.length]);
  }
  await waitForScene(page, 'MissionCompleteScene');
  await press(page, 'mission.complete.back-to-map', 'TownMapScene');
}

async function completeHouseBuilder(page: Page): Promise<void> {
  // Brick's Tower (physics stacker): drop bricks until the tower completes. In E2E the drop is
  // deterministic (no physics wait), so a handful of presses finishes the round.
  for (let i = 0; i < 30; i += 1) {
    const scene = await page.evaluate(() => window.__RTB_E2E__?.currentSceneKey);
    if (scene !== 'BrickTowerScene') break;
    await page.evaluate(() => window.__RTB_E2E__?.pressButton('brick.drop'));
  }
  await waitForScene(page, 'MissionCompleteScene');
  await press(page, 'mission.complete.back-to-map', 'TownMapScene');
}

async function completeFireFix(page: Page): Promise<void> {
  // Spray-only: the No-Fail helper-drone floor guarantees completion even if the
  // child never moves Ember (this exercises the Cycle 1 hard-block fix in-browser).
  for (let i = 0; i < 40; i += 1) {
    const scene = await page.evaluate(() => window.__RTB_E2E__?.currentSceneKey);
    if (scene !== 'FireFixScene') break;
    await page.evaluate(() => window.__RTB_E2E__?.pressButton('fire.spray'));
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
  // No-Fail floor: every completed mission earns at least one star, so three missions
  // total at least three. (Exact stars depend on play accuracy; the smoke run sorts
  // imperfectly on purpose to stay robust to item order.)
  expect(progress?.totalStars).toBeGreaterThanOrEqual(3);
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

  await press(page, 'townmap.mission.house-builder', 'BrickTowerScene');
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
  await waitForBridge(page);
  await waitForScene(page, 'StartScene');
  const box = await page.locator('canvas').boundingBox();
  expect(box).not.toBeNull();
  expect(box?.width).toBeLessThanOrEqual(844);
  expect(box?.height).toBeLessThanOrEqual(390);
  const scroll = await page.evaluate(() => ({ x: document.documentElement.scrollWidth, y: document.documentElement.scrollHeight }));
  expect(scroll.x).toBeLessThanOrEqual(844);
  expect(scroll.y).toBeLessThanOrEqual(390);
});
