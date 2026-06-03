import { readFileSync, existsSync } from 'node:fs';
import { validatePostMvpGate } from './post-mvp-gate-core.mjs';

const evidencePath = 'docs/playtesting/mvp-gate-evidence.md';
const evidenceExists = existsSync(evidencePath);
const result = validatePostMvpGate({
  missionSource: readFileSync('src/game/data/missions.ts', 'utf8'),
  evidenceText: evidenceExists ? readFileSync(evidencePath, 'utf8') : null,
  evidenceExists,
});

if (!result.ok) {
  console.error(result.message);
  if (result.reason === 'missing-evidence-file') {
    console.error(`Create ${evidencePath} with completed play-test, mobile, gamepad, asset-intake, and expansion verdict evidence before registering roadmap missions.`);
  }
  process.exit(1);
}

console.log(result.message);
