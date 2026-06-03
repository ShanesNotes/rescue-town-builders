import type { MissionDefinition, MissionId } from '../types';
import type { PlayerProfile } from './SaveSystem';

export type TownMapNode = {
  missionId: MissionId;
  title: string;
  characterId: string;
  mapNodeId: string;
  completed: boolean;
  bestStars: 0 | 1 | 2 | 3;
  attempts: number;
  starsLabel: string;
  statusLabel: string;
};

export function projectTownMapNodes(
  definitions: MissionDefinition[],
  profile: PlayerProfile | null,
): TownMapNode[] {
  return definitions.map((definition) => {
    const progress = profile?.progress.missions[definition.id];
    const bestStars = progress?.bestStars ?? 0;
    return {
      missionId: definition.id,
      title: definition.title,
      characterId: definition.characterId,
      mapNodeId: definition.mapNodeId,
      completed: progress?.completed ?? false,
      bestStars,
      attempts: progress?.attempts ?? 0,
      starsLabel: bestStars > 0 ? '⭐'.repeat(bestStars) : 'No stars yet',
      statusLabel: progress?.completed ? `Best: ${'⭐'.repeat(bestStars)}` : 'Ready to try',
    };
  });
}
