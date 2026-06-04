import { expect, test, type Page } from '@playwright/test';

// A full-playthrough capture + integrity pass (long-running-plan.md, verification section).
// It walks every screen, saves a PNG of each, and asserts the playthrough produced no page
// errors and no 4xx/5xx responses — the checks a callback-only smoke test can't give once
// real art is on the canvas. Screenshots land in test-results/shots/ (gitignored) for review.

const SHOTS = process.env.RTB_SHOTS ?? 'test-results/shots';

async function bridge(page: Page): Promise<void> {
  await page.waitForFunction(() => Boolean(window.__RTB_E2E__));
}
async function scene(page: Page, key: string): Promise<void> {
  await page.evaluate((k) => window.__RTB_E2E__?.waitForScene(k, 5000), key);
}
async function tap(page: Page, id: string): Promise<void> {
  await page.evaluate((i) => window.__RTB_E2E__?.pressButton(i), id);
}
async function shot(page: Page, name: string): Promise<void> {
  await page.waitForTimeout(450); // let the fade-in + idle tweens settle for a clean frame
  await page.screenshot({ path: `${SHOTS}/${name}.png` });
}
async function currentScene(page: Page): Promise<string | undefined> {
  return page.evaluate(() => window.__RTB_E2E__?.currentSceneKey);
}

async function clearMission(page: Page, sceneKey: string, taps: string[], max: number): Promise<void> {
  for (let i = 0; i < max; i += 1) {
    if ((await currentScene(page)) !== sceneKey) break;
    await tap(page, taps[i % taps.length] ?? taps[0]!);
  }
  await scene(page, 'MissionCompleteScene');
}

test('captures every screen and stays error-free across a full playthrough', async ({ page }) => {
  const errors: string[] = [];
  const bad: string[] = [];
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(`console: ${m.text()}`);
  });
  page.on('response', (r) => {
    if (r.status() >= 400 && !r.url().includes('favicon')) bad.push(`${r.status()} ${r.url()}`);
  });

  await page.goto('/?rtb_e2e=1');
  await page.evaluate(() => localStorage.clear());
  await bridge(page);

  await scene(page, 'StartScene');
  await shot(page, '01-title');

  await tap(page, 'start.play');
  await scene(page, 'ProfileScene');
  await shot(page, '02-profile');

  await tap(page, 'profile.add');
  await scene(page, 'TownMapScene');
  await shot(page, '03-townmap');

  await tap(page, 'townmap.mission.recycling-run');
  await scene(page, 'RecyclingRunScene');
  await shot(page, '04-recycling');
  await clearMission(page, 'RecyclingRunScene', ['recycling.bin.trash', 'recycling.bin.paper'], 40);
  await shot(page, '05-complete');
  await tap(page, 'mission.complete.back-to-map');
  await scene(page, 'TownMapScene');

  await tap(page, 'townmap.mission.house-builder');
  await scene(page, 'HouseBuilderScene');
  await shot(page, '06-house');
  await clearMission(
    page,
    'HouseBuilderScene',
    ['house.part.foundation', 'house.part.walls', 'house.part.roof', 'house.part.door', 'house.part.decoration'],
    80,
  );
  await tap(page, 'mission.complete.back-to-map');
  await scene(page, 'TownMapScene');

  await tap(page, 'townmap.mission.fire-fix');
  await scene(page, 'FireFixScene');
  await shot(page, '07-fire');
  await clearMission(page, 'FireFixScene', ['fire.spray'], 40);
  await tap(page, 'mission.complete.back-to-map');
  await scene(page, 'TownMapScene');

  // Roadmap (Epic H): page to the next town screen and play a Match mission end-to-end.
  await tap(page, 'townmap.next');
  await scene(page, 'TownMapScene');
  await shot(page, '09-townmap-roadmap');
  await tap(page, 'townmap.mission.inverse-dream');
  await scene(page, 'MatchMissionScene');
  await shot(page, '10-inverse-dream');
  await clearMission(page, 'MatchMissionScene', [
    'inverse-dream.target.moon',
    'inverse-dream.target.cold',
    'inverse-dream.target.small',
    'inverse-dream.target.night',
    'inverse-dream.target.quiet',
  ], 60);
  await tap(page, 'mission.complete.back-to-map');
  await scene(page, 'TownMapScene');

  // An Aim mission (Goo Cleanup) — verify the AimMissionScene + No-Fail drone floor.
  await tap(page, 'townmap.next');
  await scene(page, 'TownMapScene');
  await tap(page, 'townmap.next');
  await scene(page, 'TownMapScene');
  await tap(page, 'townmap.mission.goo-cleanup');
  await scene(page, 'AimMissionScene');
  await shot(page, '11-goo-cleanup');
  await clearMission(page, 'AimMissionScene', ['goo-cleanup.act'], 40);
  await tap(page, 'mission.complete.back-to-map');
  await scene(page, 'TownMapScene');

  // A Journey mission (Scooter Roundup) — verify the JourneyMissionScene waypoint flow.
  await tap(page, 'townmap.next');
  await scene(page, 'TownMapScene');
  await tap(page, 'townmap.next');
  await scene(page, 'TownMapScene');
  await tap(page, 'townmap.next');
  await scene(page, 'TownMapScene');
  await tap(page, 'townmap.mission.scooter-roundup');
  await scene(page, 'JourneyMissionScene');
  await shot(page, '12-scooter-roundup');
  await clearMission(page, 'JourneyMissionScene', [
    'scooter-roundup.waypoint.w0',
    'scooter-roundup.waypoint.w1',
    'scooter-roundup.waypoint.w2',
    'scooter-roundup.waypoint.w3',
  ], 40);
  await tap(page, 'mission.complete.back-to-map');
  await scene(page, 'TownMapScene');

  await tap(page, 'townmap.sticker-book');
  await scene(page, 'StickerBookScene');
  await shot(page, '08-stickers');

  expect(errors, `page errors during playthrough:\n${errors.join('\n')}`).toEqual([]);
  expect(bad, `failed responses during playthrough:\n${bad.join('\n')}`).toEqual([]);
});
