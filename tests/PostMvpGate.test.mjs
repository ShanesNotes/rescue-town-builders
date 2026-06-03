import { execFileSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';
import { extractMissionIds, REQUIRED_GATE_MARKERS, validatePostMvpGate } from '../scripts/post-mvp-gate-core.mjs';

const currentMvpMissionSource = `
export const missionDefinitions = [
  { id: 'recycling-run', title: 'Recycle' },
  { id : "house-builder", title: 'Build' },
  { id: 'fire-fix', title: 'Fire' },
];
`;

function runCliGateSmoke() {
  try {
    execFileSync('node', ['scripts/check-post-mvp-gate.mjs'], { encoding: 'utf8' });
    return { ok: true };
  } catch (error) {
    if (error?.code === 'EPERM') return { ok: true, skipped: 'spawn-unavailable' };
    throw error;
  }
}

const expandedMissionSource = `
export const missionDefinitions = [
  { id: 'recycling-run', title: 'Recycle' },
  { id: 'house-builder', title: 'Build' },
  { id: 'fire-fix', title: 'Fire' },
  { id : 'garden-rescue', title: 'Garden Rescue' },
];
`;

describe('post-MVP gate check', () => {
  it('extracts mission ids with normal or spaced id property syntax', () => {
    expect(extractMissionIds(currentMvpMissionSource)).toEqual(['recycling-run', 'house-builder', 'fire-fix']);
  });

  it('passes while only the three MVP missions are registered', () => {
    expect(validatePostMvpGate({ missionSource: currentMvpMissionSource })).toMatchObject({
      ok: true,
      reason: 'only-mvp-missions',
    });
    const cliSmoke = runCliGateSmoke();
    expect(cliSmoke).toMatchObject({ ok: true });
    if (cliSmoke.skipped) expect(cliSmoke.skipped).toBe('spawn-unavailable');
  });

  it('fails if the required MVP mission ids cannot be detected', () => {
    expect(validatePostMvpGate({ missionSource: `export const missionDefinitions = [{ title: 'Untyped' }];` })).toMatchObject({
      ok: false,
      reason: 'missing-mvp-mission-ids',
      missingMvpIds: ['recycling-run', 'house-builder', 'fire-fix'],
    });
  });

  it('blocks new roadmap missions when gate evidence is missing', () => {
    expect(validatePostMvpGate({ missionSource: expandedMissionSource })).toMatchObject({
      ok: false,
      reason: 'missing-evidence-file',
      extraMissionIds: ['garden-rescue'],
    });
  });

  it('blocks new roadmap missions when evidence markers are incomplete', () => {
    expect(validatePostMvpGate({
      missionSource: expandedMissionSource,
      evidenceExists: true,
      evidenceText: 'Gate verdict: pass-roadmap-expansion\nPlay-test: pass\n',
    })).toMatchObject({
      ok: false,
      reason: 'missing-evidence-markers',
      missingMarkers: REQUIRED_GATE_MARKERS.slice(2),
    });
  });

  it('allows new roadmap missions only when all gate evidence markers exist', () => {
    expect(validatePostMvpGate({
      missionSource: expandedMissionSource,
      evidenceExists: true,
      evidenceText: REQUIRED_GATE_MARKERS.join('\n'),
    })).toMatchObject({
      ok: true,
      reason: 'evidence-complete',
      extraMissionIds: ['garden-rescue'],
    });
  });
});
