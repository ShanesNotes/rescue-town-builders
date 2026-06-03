// Hidden secrets for Rescue Town Builders.
//
// Each secret embodies a pattern from the Language of Creation
// (see docs/design/secrets-language-of-creation.md). They are never required,
// never announced, never scored — a child finds them only by lingering where
// most rush past. Every secret shares one shape:
//
//     hidden  ->  drawn into the light  ->  revealed as meaning
//
// This module is pure logic. Scenes call touch() on a hotspot and, on a reveal,
// celebrate it and persist the returned sticker via the existing sticker system
// (MissionResult.stickersUnlocked). No save-schema change is needed.

export type SecretId = 'secret-friend' | 'hidden-light' | 'cluckle-dream';

export interface SecretReveal {
  id: SecretId;
  /** The sticker id this reveal unlocks (reuses the existing sticker system). */
  sticker: string;
  /** What the child sees at the moment of revelation, personalised by name. */
  message: string;
  /** The Language-of-Creation pattern this secret embodies. */
  pattern: string;
}

export interface SecretDefinition {
  /** How many gentle touches before the hidden thing steps into the light. */
  touchesToReveal: number;
  sticker: string;
  pattern: string;
}

export const SECRET_DEFINITIONS: Record<SecretId, SecretDefinition> = {
  // Naming the animals / hosting the angel: a small hidden creature is known
  // only to the child who keeps returning to it. Persistence becomes relationship.
  'secret-friend': {
    touchesToReveal: 3,
    sticker: 'secret-friend',
    pattern: 'naming-the-animals: the hidden creature becomes a friend to the one who keeps coming back',
  },
  // Light from darkness / lowering meaning into matter: a parent's word, set
  // into a single point of light, waiting to be found.
  'hidden-light': {
    touchesToReveal: 1,
    sticker: 'hidden-light',
    pattern: 'light-from-darkness: a word of love lowered into the smallest light',
  },
  // Microcosm / the symbol that re-presents the whole: Cluckle dreams a tiny
  // town inside the town — the world made small enough for a child to hold.
  'cluckle-dream': {
    touchesToReveal: 3,
    sticker: 'cluckle-dream',
    pattern: 'microcosm: the whole town re-presented, small enough to hold in a dream',
  },
};

export interface SecretsConfig {
  /** The child's profile name, so a reveal can greet them by name. */
  playerName?: string;
  /** Secrets already found in a previous session (rehydrated from stickers). */
  discovered?: SecretId[];
  /** A parent's own words for the Hidden Light. Falls back to a gentle default. */
  hiddenLightMessage?: string;
}

export class Secrets {
  private readonly playerName: string;
  private readonly hiddenLightMessage?: string;
  private readonly discovered: Set<SecretId>;
  private readonly touches = new Map<SecretId, number>();

  constructor(config: SecretsConfig = {}) {
    this.playerName = config.playerName?.trim() || 'friend';
    this.hiddenLightMessage = config.hiddenLightMessage?.trim() || undefined;
    this.discovered = new Set(config.discovered ?? []);
  }

  /**
   * Touch a hidden spot. Returns the reveal the first time the touch count
   * crosses the secret's threshold; null otherwise (already found, or not yet).
   * No-Fail Rule: touching is never wrong and never penalised.
   */
  touch(id: SecretId): SecretReveal | null {
    if (this.discovered.has(id)) {
      return null;
    }
    const next = (this.touches.get(id) ?? 0) + 1;
    this.touches.set(id, next);
    if (next < SECRET_DEFINITIONS[id].touchesToReveal) {
      return null;
    }
    this.discovered.add(id);
    return this.reveal(id);
  }

  isDiscovered(id: SecretId): boolean {
    return this.discovered.has(id);
  }

  getDiscovered(): SecretId[] {
    return [...this.discovered];
  }

  private reveal(id: SecretId): SecretReveal {
    const def = SECRET_DEFINITIONS[id];
    const base = { id, sticker: def.sticker, pattern: def.pattern };
    switch (id) {
      case 'secret-friend':
        return {
          ...base,
          message: `You found a friend! "Hi ${this.playerName}! You kept looking for me. Let's be friends forever."`,
        };
      case 'hidden-light':
        return {
          ...base,
          message:
            this.hiddenLightMessage ??
            `A tiny light glows just for you, ${this.playerName}. Someone who loves you hid it here.`,
        };
      case 'cluckle-dream':
        return {
          ...base,
          message: `Cluckle is dreaming... and the whole town is inside the dream, tiny and shining. Sweet dreams, ${this.playerName}!`,
        };
    }
  }
}
