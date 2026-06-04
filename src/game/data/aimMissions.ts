import type { MissionId } from '../types';
import type { AimTarget } from '../systems/AimEngine';

// Content for the roadmap Aim missions (driven by AimEngine + AimMissionScene): a hero moves a
// field, aims, and acts on targets that diminish to nothing. No-Fail helper floor guarantees
// completion. icon fields are Hearthlight texture keys.
export type AimMissionData = {
  characterId: string;
  backdrop: string;
  stickerId: string;
  coinKey: string;
  actLabel: string;
  actIconKey: string;
  targetKey: string;
  clearedKey?: string;
  targets: AimTarget[];
};

// Each mission has its own target layout + count (within AimEngine bounds x:120–840, y:160–390),
// so the three Aim missions don't feel identical.
function targetsAt(points: Array<[number, number, number]>): AimTarget[] {
  return points.map(([x, y, health], i) => ({ id: `t${i}`, x, y, health, maxHealth: health }));
}

export const aimMissions: Partial<Record<MissionId, AimMissionData>> = {
  'goo-cleanup': {
    characterId: 'grumble',
    backdrop: 'hl.bg.gooCleanup',
    stickerId: 'goo-cleanup-starter',
    coinKey: 'hl.char.grumble',
    actLabel: 'Clean',
    actIconKey: 'hl.prop.grumbleSpray',
    targetKey: 'hl.prop.gooBlobLarge',
    clearedKey: 'hl.prop.cleanPatch',
    targets: targetsAt([[330, 260, 2], [540, 210, 1], [700, 300, 2], [420, 360, 2], [630, 370, 1]]),
  },
  'frog-flight': {
    characterId: 'wings',
    backdrop: 'hl.bg.frogFlight',
    stickerId: 'frog-flight-starter',
    coinKey: 'hl.char.wings',
    actLabel: 'Fly',
    actIconKey: 'hl.prop.leafGlider',
    targetKey: 'hl.prop.skyRing',
    clearedKey: 'hl.prop.rescueBasket',
    targets: targetsAt([[300, 330, 1], [470, 260, 1], [650, 220, 1], [800, 280, 1]]),
  },
  'asteroid-blaster': {
    characterId: 'nova',
    backdrop: 'hl.bg.asteroidBlaster',
    stickerId: 'asteroid-blaster-starter',
    coinKey: 'hl.char.nova',
    actLabel: 'Blast',
    actIconKey: 'hl.prop.foamStar',
    targetKey: 'hl.prop.asteroidLarge',
    clearedKey: 'hl.prop.asteroidSmall',
    targets: targetsAt([[320, 230, 1], [490, 300, 2], [640, 210, 1], [760, 330, 2], [560, 370, 1], [830, 250, 1]]),
  },
};
