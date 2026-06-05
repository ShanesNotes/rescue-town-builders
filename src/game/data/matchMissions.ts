import type { MissionId } from '../types';
import type { MatchPrompt, MatchTarget } from '../systems/MatchEngine';

// Content for the roadmap Match missions (driven by MatchEngine + MatchMissionScene).
// icons are Hearthlight texture keys. Each mission: a fixed target row + a sequence of prompts.
export type MatchMissionData = {
  characterId: string;
  backdrop: string;
  stickerId: string;
  coinKey: string;
  targets: MatchTarget[];
  prompts: MatchPrompt[];
  /** Shuffle prompt order each play (replay variety) — off for order-meaningful missions (recipes). */
  shuffle?: boolean;
  /**
   * Shuffle the TARGET ROW positions each play (keeps recipe ORDER but breaks tap-position memory, so
   * a child must read the icon, not memorise where to tap). For order-meaningful missions (recipes).
   */
  shuffleTargets?: boolean;
  /** Recipe-progress payoff: a bowl that visibly fills with each correct add, ending in a baked loaf. */
  recipeBowl?: boolean;
  /** Per-mission correct-match payoff theme (P3-07): the answer 'lands and transforms' on its target. */
  payoff?: MatchPayoff;
};

// How a correct match resolves ON the target (per-mission soul, P3-07). Reuses existing per-mission
// art — no new image assets; pure tint/tween/particle juice keyed by these themes.
export type MatchPayoff = {
  /** Burst + accent color for the landing flourish. */
  color: number;
  /** 'plinth' lights + statue pops (statues); 'gadget' slot fills + spins (inventions); 'pour' grows a bowl (bread); 'mirror' flips bright (inverse). */
  kind: 'plinth' | 'gadget' | 'pour' | 'mirror';
};

const P = 'hl.prop.';

export const matchMissions: Partial<Record<MissionId, MatchMissionData>> = {
  'inverse-dream': {
    characterId: 'cluckle',
    backdrop: 'hl.bg.inverseDream',
    stickerId: 'inverse-dream-starter',
    coinKey: 'hl.char.cluckle',
    shuffle: true,
    payoff: { color: 0x9be7ff, kind: 'mirror' },
    targets: [
      { id: 'moon', label: 'Moon', icon: `${P}inverseMoon` },
      { id: 'cold', label: 'Cold', icon: `${P}inverseColdSnowflake` },
      { id: 'small', label: 'Small', icon: `${P}inverseSmall` },
      { id: 'night', label: 'Night', icon: `${P}inverseNight` },
      { id: 'quiet', label: 'Quiet', icon: `${P}inverseQuiet` },
    ],
    prompts: [
      { id: 'sun', label: 'Sun', icon: `${P}inverseSun`, correctTargetId: 'moon' },
      { id: 'hot', label: 'Hot', icon: `${P}inverseHotEmber`, correctTargetId: 'cold' },
      { id: 'big', label: 'Big', icon: `${P}inverseBig`, correctTargetId: 'small' },
      { id: 'day', label: 'Day', icon: `${P}inverseDay`, correctTargetId: 'night' },
      { id: 'loud', label: 'Loud', icon: `${P}inverseLoud`, correctTargetId: 'quiet' },
    ],
  },
  'dream-statues': {
    characterId: 'merry',
    backdrop: 'hl.bg.dreamStatues',
    stickerId: 'dream-statues-starter',
    coinKey: 'hl.char.merry',
    shuffle: true,
    payoff: { color: 0xffd98a, kind: 'plinth' },
    targets: [
      { id: 'hen', label: 'Hen', icon: `${P}plinthHen` },
      { id: 'cloud', label: 'Cloud', icon: `${P}plinthCloud` },
      { id: 'moon', label: 'Moon', icon: `${P}plinthMoon` },
      { id: 'leaf', label: 'Leaf', icon: `${P}plinthLeaf` },
    ],
    prompts: [
      { id: 'statue-hen', label: 'Hen', icon: `${P}statueHen`, correctTargetId: 'hen' },
      { id: 'statue-cloud', label: 'Cloud', icon: `${P}statueCloud`, correctTargetId: 'cloud' },
      { id: 'statue-moon', label: 'Moon', icon: `${P}statueMoon`, correctTargetId: 'moon' },
      { id: 'statue-leaf', label: 'Leaf', icon: `${P}statueLeaf`, correctTargetId: 'leaf' },
    ],
  },
  'recycled-inventions': {
    characterId: 'reed',
    backdrop: 'hl.bg.recycledInventions',
    stickerId: 'recycled-inventions-starter',
    coinKey: 'hl.char.reed',
    shuffle: true,
    payoff: { color: 0x43a29c, kind: 'gadget' },
    targets: [
      { id: 'gear', label: 'Gear', icon: `${P}gadgetSlotGear` },
      { id: 'spring', label: 'Spring', icon: `${P}gadgetSlotSpring` },
      { id: 'tube', label: 'Tube', icon: `${P}gadgetSlotTube` },
      { id: 'wheel', label: 'Wheel', icon: `${P}gadgetSlotWheel` },
      { id: 'core', label: 'Spark', icon: `${P}gadgetSlotCore` },
    ],
    prompts: [
      { id: 'scrap-gear', label: 'Gear', icon: `${P}scrapGear`, correctTargetId: 'gear' },
      { id: 'scrap-spring', label: 'Spring', icon: `${P}scrapSpring`, correctTargetId: 'spring' },
      { id: 'scrap-tube', label: 'Tube', icon: `${P}scrapTube`, correctTargetId: 'tube' },
      { id: 'scrap-wheel', label: 'Wheel', icon: `${P}scrapWheel`, correctTargetId: 'wheel' },
      { id: 'scrap-core', label: 'Spark', icon: `${P}scrapSparkCore`, correctTargetId: 'core' },
    ],
  },
  'bread-rush': {
    characterId: 'benny',
    backdrop: 'hl.bg.breadRush',
    stickerId: 'bread-rush-starter',
    coinKey: 'hl.char.benny',
    // Recipe ORDER stays meaningful, but the target ROW positions shuffle each play so a child can't
    // win by tapping the same spot — they must read the ingredient icon (P2-10).
    shuffleTargets: true,
    recipeBowl: true,
    payoff: { color: 0xffc857, kind: 'pour' },
    targets: [
      { id: 'flour', label: 'Flour', icon: `${P}ingredientFlour` },
      { id: 'water', label: 'Water', icon: `${P}ingredientWater` },
      { id: 'yeast', label: 'Yeast', icon: `${P}ingredientYeast` },
      { id: 'dough', label: 'Dough', icon: `${P}ingredientDough` },
      { id: 'butter', label: 'Butter', icon: `${P}ingredientButter` },
    ],
    // Recipe order — the prompt shows the next ingredient to add.
    prompts: [
      { id: 'add-flour', label: 'Flour', icon: `${P}ingredientFlour`, correctTargetId: 'flour' },
      { id: 'add-water', label: 'Water', icon: `${P}ingredientWater`, correctTargetId: 'water' },
      { id: 'add-yeast', label: 'Yeast', icon: `${P}ingredientYeast`, correctTargetId: 'yeast' },
      { id: 'add-dough', label: 'Dough', icon: `${P}ingredientDough`, correctTargetId: 'dough' },
      { id: 'add-butter', label: 'Butter', icon: `${P}ingredientButter`, correctTargetId: 'butter' },
    ],
  },
};
