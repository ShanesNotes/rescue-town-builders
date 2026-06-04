export type MissionId =
  | 'recycling-run'
  | 'house-builder'
  | 'fire-fix'
  // PRD v0.1.0 roadmap (built on the reusable Match/Aim/Journey engines)
  | 'frog-flight'
  | 'scooter-roundup'
  | 'safety-lights'
  | 'recycled-inventions'
  | 'bike-explorer'
  | 'goo-cleanup'
  | 'dream-statues'
  | 'inverse-dream'
  | 'treasure-boat'
  | 'bread-rush'
  | 'asteroid-blaster';

export type MissionArchetype = 'match' | 'aim' | 'journey';

export type IntroPanel = {
  icon: string;
  title: string;
  text: string;
};

export type MissionResult = {
  missionId: MissionId;
  completed: boolean;
  stars: 1 | 2 | 3;
  score: number;
  stickersUnlocked: string[];
  stats: Record<string, number | string | boolean>;
};

export interface MissionDefinition {
  id: MissionId;
  title: string;
  characterId: string;
  mapNodeId: string;
  introPanels: IntroPanel[];
  minAge: number;
  estimatedSeconds: number;
  /** Roadmap missions route to a generic engine scene by archetype; the core three omit it. */
  archetype?: MissionArchetype;
  /** Town-map mission-coin texture key (defaults to the helper's face-coin). */
  coinKey?: string;
}

export interface MissionScene {
  startMission(): void;
  pauseMission(): void;
  resumeMission(): void;
  completeMission(result: MissionResult): void;
}
