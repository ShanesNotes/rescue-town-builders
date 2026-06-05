import { expect, test, type Page } from '@playwright/test';

// Proves the consolidation in-browser: the roadmap missions that were CAPTURED into hero games
// (Cycles 12-13) actually launch the right hero scene, complete via its deterministic button, and
// unlock their OWN sticker (the missionId parameterization). inverse-dream + scooter-roundup are
// already covered by screenshots.spec; this covers the not-yet-played ones across all three
// capturing scenes (Dream Catch, Recycle Snake, Town Ride — incl. a journey that carries a secret).

async function bridge(page: Page): Promise<void> {
  await page.waitForFunction(() => Boolean(window.__RTB_E2E__));
}
async function waitForScene(page: Page, key: string): Promise<void> {
  await page.evaluate((k) => window.__RTB_E2E__?.waitForScene(k, 5000), key);
}
async function tap(page: Page, id: string): Promise<boolean> {
  return page.evaluate((i) => window.__RTB_E2E__?.pressButton(i) ?? false, id);
}
async function visibleIds(page: Page): Promise<string[]> {
  return page.evaluate(() => window.__RTB_E2E__?.getVisibleButtons().map((b) => b.testId) ?? []);
}
async function stickers(page: Page): Promise<string[]> {
  return page.evaluate(() => window.__RTB_E2E__?.getSaveData()?.profiles?.[0]?.progress?.stickers ?? []);
}

// Page the town map to wherever the given mission node is visible (robust to node order): rewind to
// page 0 (prev until gone), then advance (next) until the mission's coin is on screen.
async function gotoMission(page: Page, missionId: string): Promise<void> {
  for (let i = 0; i < 8; i += 1) {
    if (!(await visibleIds(page)).includes('townmap.prev')) break;
    await tap(page, 'townmap.prev');
    await waitForScene(page, 'TownMapScene');
  }
  for (let i = 0; i < 8; i += 1) {
    const ids = await visibleIds(page);
    if (ids.includes(`townmap.mission.${missionId}`)) {
      await tap(page, `townmap.mission.${missionId}`);
      return;
    }
    if (!ids.includes('townmap.next')) break;
    await tap(page, 'townmap.next');
    await waitForScene(page, 'TownMapScene');
  }
  throw new Error(`town-map node for ${missionId} never became visible`);
}

async function complete(page: Page, sceneKey: string, button: string, max: number): Promise<void> {
  for (let i = 0; i < max; i += 1) {
    const scene = await page.evaluate(() => window.__RTB_E2E__?.currentSceneKey);
    if (scene !== sceneKey) break;
    await page.evaluate((b) => window.__RTB_E2E__?.pressButton(b), button);
  }
  await waitForScene(page, 'MissionCompleteScene');
  await tap(page, 'mission.complete.back-to-map');
  await waitForScene(page, 'TownMapScene');
}

test('captured roadmap missions launch their hero scene, complete, and unlock their own sticker', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });

  await page.goto('/?rtb_e2e=1');
  await page.evaluate(() => localStorage.clear());
  await bridge(page);
  await waitForScene(page, 'StartScene');
  await tap(page, 'start.play');
  await waitForScene(page, 'ProfileScene');
  await tap(page, 'profile.add');
  await waitForScene(page, 'TownMapScene');

  // dream-statues -> Dream Catch (captured), unlocks dream-statues-starter.
  await gotoMission(page, 'dream-statues');
  await waitForScene(page, 'DreamCatchScene');
  await complete(page, 'DreamCatchScene', 'dream.catch', 30);
  expect((await stickers(page)).includes('dream-statues-starter'), 'dream-statues sticker').toBe(true);

  // recycled-inventions -> Recycle Snake (captured), unlocks recycled-inventions-starter.
  await gotoMission(page, 'recycled-inventions');
  await waitForScene(page, 'RecyclingRunScene');
  await complete(page, 'RecyclingRunScene', 'recycling.choice.0', 40);
  expect((await stickers(page)).includes('recycled-inventions-starter'), 'recycled-inventions sticker').toBe(true);

  // bike-explorer -> Town Ride (captured journey, carries the garden-cat secret), unlocks bike-explorer-starter.
  await gotoMission(page, 'bike-explorer');
  await waitForScene(page, 'TownRideScene');
  await complete(page, 'TownRideScene', 'ride.catch', 30);
  expect((await stickers(page)).includes('bike-explorer-starter'), 'bike-explorer sticker').toBe(true);

  expect(errors, `console/page errors during captured-mission playthrough:\n${errors.join('\n')}`).toEqual([]);
});
