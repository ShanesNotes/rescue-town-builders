import { expect, test, type Page } from '@playwright/test';

// Smoke-tests the REAL Matter.js path in Brick's Tower that the deterministic browser-smoke never
// touches: spawning dynamic falling bricks + the per-frame settle detector that freezes resting
// bodies. We only assert the path raises NO runtime errors (no flaky settle-count assertions), so it
// stays robust to physics timing.

async function waitForBridge(page: Page): Promise<void> {
  await page.waitForFunction(() => Boolean(window.__RTB_E2E__));
}
async function waitForScene(page: Page, key: string): Promise<void> {
  await page.evaluate((k) => window.__RTB_E2E__?.waitForScene(k, 5000), key);
}
async function press(page: Page, id: string): Promise<boolean> {
  return page.evaluate((i) => window.__RTB_E2E__?.pressButton(i) ?? false, id);
}

test("Brick's Tower real Matter physics drop path stays error-free", async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });

  await page.goto('/?rtb_e2e=1');
  await page.evaluate(() => localStorage.clear());
  await waitForBridge(page);
  await waitForScene(page, 'StartScene');
  await press(page, 'start.play');
  await waitForScene(page, 'ProfileScene');
  await press(page, 'profile.add');
  await waitForScene(page, 'TownMapScene');
  await press(page, 'townmap.mission.house-builder');
  await waitForScene(page, 'BrickTowerScene');

  // Spawn several REAL Matter bricks; let them fall, collide, settle, and freeze.
  for (let i = 0; i < 5; i += 1) {
    expect(await press(page, 'brick.drop.real'), 'real-drop hook exists').toBe(true);
    await page.waitForTimeout(220);
  }
  await page.waitForTimeout(1800); // give the settle detector time to freeze resting bricks
  await page.screenshot({ path: 'test-results/shots/brick-real-physics.png' });

  // Still in the mission (5 bricks < the 6-brick floor, ribbon not reached) and no errors thrown.
  expect(await page.evaluate(() => window.__RTB_E2E__?.currentSceneKey)).toBe('BrickTowerScene');
  expect(errors, `Matter path raised errors:\n${errors.join('\n')}`).toEqual([]);
});
