export type MissionId = 'recycling-run' | 'house-builder' | 'fire-fix';

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
}

export interface MissionScene {
  startMission(): void;
  pauseMission(): void;
  resumeMission(): void;
  completeMission(result: MissionResult): void;
}
