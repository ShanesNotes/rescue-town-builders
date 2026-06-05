import { expect, test, type Page } from '@playwright/test';

// Proves all three hidden secrets work end-to-end and that each one's bespoke reveal
// animation runs without error: Cluckle's Dream (Town Map, microcosm), Hidden Light (House,
// light-from-darkness), Secret Friend (Fire, naming-the-animals). A child who patiently taps
// the quiet glimmers earns secret stickers that persist. This guards the soul of the gift.

async function scene(page: Page, key: string): Promise<void> {
  await page.evaluate((k) => window.__RTB_E2E__?.waitForScene(k, 6000), key);
}
async function tap(page: Page, id: string): Promise<void> {
  await page.evaluate((i) => window.__RTB_E2E__?.pressButton(i), id);
}
async function stickerCount(page: Page): Promise<number> {
  return page.evaluate(() => window.__RTB_E2E__?.getSaveData()?.profiles[0]?.progress.stickers.length ?? 0);
}

// Click a game-world coordinate, mapping through the FIT-scaled canvas so it lands regardless
// of viewport scaling/letterboxing.
async function clickGame(page: Page, gx: number, gy: number, times: number): Promise<void> {
  const box = await page.locator('canvas').boundingBox();
  expect(box).not.toBeNull();
  const cx = box!.x + gx * (box!.width / 960);
  const cy = box!.y + gy * (box!.height / 540);
  for (let i = 0; i < times; i += 1) await page.mouse.click(cx, cy);
}

test('all three secrets reveal without error and persist as stickers', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  page.on('console', (m) => {
    // The real clicks resume the AudioContext, which has no output device in headless
    // Chromium — a benign environment artifact, not a game error (the synth sinks swallow it).
    if (m.type() === 'error' && !/audiocontext|audio device|webaudio/i.test(m.text())) {
      errors.push(`console: ${m.text()}`);
    }
  });

  await page.goto('/?rtb_e2e=1');
  await page.evaluate(() => localStorage.clear());
  await page.waitForFunction(() => Boolean(window.__RTB_E2E__));
  await scene(page, 'StartScene');
  await tap(page, 'start.play');
  await scene(page, 'ProfileScene');
  await tap(page, 'profile.add');
  await scene(page, 'TownMapScene');

  // 1) Cluckle's Dream — Town Map (3 touches). Capture the miniature dream-town mid-bloom.
  // The hotspot sits in the quiet bottom-left corner of the Hearthlight hub.
  await clickGame(page, 70, 498, 3);
  await page.waitForTimeout(450);
  await page.screenshot({ path: 'test-results/shots/secret-cluckle.png' });
  await page.waitForTimeout(2200); // let the reveal text appear...
  await clickGame(page, 480, 120, 1); // ...and dismiss it (empty band above the mission coins)
  await scene(page, 'TownMapScene');

  // 2) Hidden Light — House Builder (1 touch).
  await tap(page, 'townmap.mission.house-builder');
  await scene(page, 'BrickTowerScene');
  await clickGame(page, 888, 268, 1);
  await page.waitForTimeout(450);
  await page.screenshot({ path: 'test-results/shots/secret-hidden-light.png' });
  await page.waitForTimeout(1800);
  await clickGame(page, 480, 270, 1);
  await tap(page, 'house.back-to-map');
  await page.waitForTimeout(150);
  await tap(page, 'mission.exit.leave');
  await scene(page, 'TownMapScene');

  // 3) Secret Friend — Fire Fix (3 touches).
  await tap(page, 'townmap.mission.fire-fix');
  await scene(page, 'EmberBrigadeScene');
  await clickGame(page, 822, 438, 3);
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'test-results/shots/secret-friend.png' });
  await page.waitForTimeout(1800);

  expect(await stickerCount(page), 'all three secrets unlocked').toBeGreaterThanOrEqual(3);
  expect(errors, `no errors during secret reveals:\n${errors.join('\n')}`).toEqual([]);

  // Secrets persist across a refresh.
  await page.reload();
  await page.waitForFunction(() => Boolean(window.__RTB_E2E__));
  await scene(page, 'StartScene');
  expect(await stickerCount(page)).toBeGreaterThanOrEqual(3);
});
