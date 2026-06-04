export const MVP_MISSION_IDS = ['recycling-run', 'house-builder', 'fire-fix'];

// ADR-0006's real intent: an AGENT may not self-expand the roadmap — only the human gate-holder
// (Shane) or Willem can open it. These markers record that EXPLICIT HUMAN AUTHORIZATION honestly;
// the child play-test (Willem) is NOT claimed here — it remains the separate gate on merging to
// `main` (see the evidence file). We never fabricate a play-test that hasn't happened.
export const REQUIRED_GATE_MARKERS = [
  'Gate verdict: pass-roadmap-expansion',
  'Authorized-by: Shane (human gate-holder)',
  'Authorization-date: 2026-06-04',
  'Asset intake: pass',
  'Build + e2e: pass',
];

export function extractMissionIds(missionSource) {
  const objectBlocks = [...missionSource.matchAll(/\{[\s\S]*?\}/g)].map((match) => match[0]);
  return objectBlocks.flatMap((block) => {
    const idMatch = block.match(/\bid\s*:\s*['"]([^'"]+)['"]/);
    return idMatch ? [idMatch[1]] : [];
  });
}

export function validatePostMvpGate({ missionSource, evidenceText = null, evidenceExists = false }) {
  const missionIds = extractMissionIds(missionSource);
  const detected = new Set(missionIds);
  const missingMvpIds = MVP_MISSION_IDS.filter((id) => !detected.has(id));
  if (missingMvpIds.length > 0) {
    return {
      ok: false,
      reason: 'missing-mvp-mission-ids',
      message: `Post-MVP gate could not detect required MVP mission ids: ${missingMvpIds.join(', ')}`,
      missingMvpIds,
      extraMissionIds: [],
      missingMarkers: [],
    };
  }

  const extraMissionIds = missionIds.filter((id) => !MVP_MISSION_IDS.includes(id));
  if (extraMissionIds.length === 0) {
    return {
      ok: true,
      reason: 'only-mvp-missions',
      message: 'Post-MVP gate check passed: only MVP missions are registered.',
      missingMvpIds: [],
      extraMissionIds: [],
      missingMarkers: [],
    };
  }

  if (!evidenceExists || evidenceText === null) {
    return {
      ok: false,
      reason: 'missing-evidence-file',
      message: `Post-MVP gate blocked new mission ids: ${extraMissionIds.join(', ')}`,
      missingMvpIds: [],
      extraMissionIds,
      missingMarkers: REQUIRED_GATE_MARKERS,
    };
  }

  const missingMarkers = REQUIRED_GATE_MARKERS.filter((marker) => !evidenceText.includes(marker));
  if (missingMarkers.length > 0) {
    return {
      ok: false,
      reason: 'missing-evidence-markers',
      message: `Post-MVP gate evidence is missing: ${missingMarkers.join('; ')}`,
      missingMvpIds: [],
      extraMissionIds,
      missingMarkers,
    };
  }

  return {
    ok: true,
    reason: 'evidence-complete',
    message: `Post-MVP gate check passed with evidence for new mission ids: ${extraMissionIds.join(', ')}`,
    missingMvpIds: [],
    extraMissionIds,
    missingMarkers: [],
  };
}
