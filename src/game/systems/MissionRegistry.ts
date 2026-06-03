import type { MissionDefinition, MissionId } from '../types';

export class MissionRegistry {
  private readonly byId = new Map<MissionId, MissionDefinition>();

  constructor(definitions: MissionDefinition[]) {
    for (const definition of definitions) {
      if (this.byId.has(definition.id)) {
        throw new Error(`Duplicate mission id: ${definition.id}`);
      }
      this.byId.set(definition.id, definition);
    }
  }

  list(): MissionDefinition[] {
    return [...this.byId.values()];
  }

  get(id: string): MissionDefinition | null {
    return this.byId.get(id as MissionId) ?? null;
  }
}
