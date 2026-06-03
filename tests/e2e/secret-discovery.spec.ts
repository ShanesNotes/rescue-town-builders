import { expect, test, type Page } from '@playwright/test';

// Proves the hidden-secret mechanic works end-to-end: a child who patiently taps the quiet
// glimmer on the Town Map (Cluckle's Dream, 3 touches) sees a reveal and earns a secret
// sticker that persists. This guards the soul of the gift, not just a mechanic.

async function scene(page: Page, key: string): Promise<void> {
  await page.evaluate((k) => window.__RTB_E2E__?.waitForScene(k, 5000), key);
}
async function tap(page: Page, id: string): Promise<void> {
  await page.evaluate((i) => window.__RTB_E2E__?.pressButton(i), id);
}

test('finding the Town Map secret unlocks a sticker that persists', async ({ page }) => {
  await page.goto('/?rtb_e2e=1');
  await page.evaluate(() => localStorage.clear());
  await page.waitForFunction(() => Boolean(window.__RTB_E2E__));
  await scene(page, 'StartScene');
  await tap(page, 'start.play');
  await scene(page, 'ProfileScene');
  await tap(page, 'profile.add');
  await scene(page, 'TownMapScene');

  // Map the Cluckle's Dream hotspot's game coords (70,150 in the 960x540 world) to the
  // scaled canvas, so the click lands regardless of FIT scaling/letterboxing.
  const box = await page.locator('canvas').boundingBox();
  expect(box).not.toBeNull();
  const cx = box!.x + 70 * (box!.width / 960);
  const cy = box!.y + 150 * (box!.height / 540);

  await page.mouse.click(cx, cy);
  await page.mouse.click(cx, cy);
  await page.mouse.click(cx, cy);

  // The miniature dream-town blooms for a beat; capture it, then let the words arrive.
  await page.waitForTimeout(450);
  await page.screenshot({ path: 'test-results/shots/secret-cluckle.png' });

  // The secret sticker is persisted synchronously on the revealing touch.
  const found = await page.evaluate(
    () => window.__RTB_E2E__?.getSaveData()?.profiles[0]?.progress.stickers.length ?? 0,
  );
  expect(found).toBeGreaterThanOrEqual(1);

  // And it survives a refresh.
  await page.reload();
  await page.waitForFunction(() => Boolean(window.__RTB_E2E__));
  await scene(page, 'StartScene');
  const stickers = await page.evaluate(
    () => window.__RTB_E2E__?.getSaveData()?.profiles[0]?.progress.stickers ?? [],
  );
  expect(stickers.length).toBeGreaterThanOrEqual(1);
});
