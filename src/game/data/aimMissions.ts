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

// Spread across the playfield (within AimEngine bounds x:120–840, y:160–390); proven reachable.
const POS: Array<[number, number, number]> = [
  [360, 250, 2],
  [540, 210, 1],
  [690, 300, 2],
  [770, 220, 1],
  [450, 350, 2],
];
function targets(): AimTarget[] {
  return POS.map(([x, y, health], i) => ({ id: `t${i}`, x, y, health, maxHealth: health }));
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
    targets: targets(),
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
    targets: targets(),
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
    targets: targets(),
  },
};
