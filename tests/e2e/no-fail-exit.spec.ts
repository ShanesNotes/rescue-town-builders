import { expect, test, type Page } from '@playwright/test';

// Proves the No-Fail mission-exit guard (ADR-0007, #18): pressing Back mid-mission does NOT
// silently dump a child to the map and discard progress — it shows a gentle confirm that
// defaults to keep playing. Only an explicit "Go to Map" leaves.

async function tap(page: Page, id: string): Promise<boolean> {
  return page.evaluate((i) => window.__RTB_E2E__?.pressButton(i) ?? false, id);
}
async function scene(page: Page, key: string): Promise<void> {
  await page.evaluate((k) => window.__RTB_E2E__?.waitForScene(k, 5000), key);
}
async function current(page: Page): Promise<string | undefined> {
  return page.evaluate(() => window.__RTB_E2E__?.currentSceneKey);
}

test('Back mid-mission asks before leaving and never discards progress silently', async ({ page }) => {
  await page.goto('/?rtb_e2e=1');
  await page.evaluate(() => localStorage.clear());
  await page.waitForFunction(() => Boolean(window.__RTB_E2E__));
  await scene(page, 'StartScene');
  await tap(page, 'start.play');
  await scene(page, 'ProfileScene');
  await tap(page, 'profile.add');
  await scene(page, 'TownMapScene');
  await tap(page, 'townmap.mission.recycling-run');
  await scene(page, 'RecyclingRunScene');

  // Press Back: the guard must appear and we must STILL be in the mission.
  await tap(page, 'recycling.back-to-map');
  await page.waitForTimeout(150);
  expect(await current(page), 'guard keeps us in the mission').toBe('RecyclingRunScene');

  // "Keep Playing" dismisses the guard and we stay in the mission.
  expect(await tap(page, 'mission.exit.keep'), 'keep-playing button exists').toBe(true);
  await page.waitForTimeout(150);
  expect(await current(page)).toBe('RecyclingRunScene');

  // Back again, then explicit "Go to Map" — only now do we leave.
  await tap(page, 'recycling.back-to-map');
  await page.waitForTimeout(150);
  expect(await tap(page, 'mission.exit.leave'), 'go-to-map button exists').toBe(true);
  await scene(page, 'TownMapScene');
  expect(await current(page)).toBe('TownMapScene');
});
