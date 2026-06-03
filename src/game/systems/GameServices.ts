import { missionDefinitions } from '../data/missions';
import { MissionRegistry } from './MissionRegistry';
import { SaveSystem } from './SaveSystem';

export const missionRegistry = new MissionRegistry(missionDefinitions);

let saveSystem: SaveSystem | null = null;

export function getSaveSystem(): SaveSystem {
  saveSystem ??= new SaveSystem();
  return saveSystem;
}
