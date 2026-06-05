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

export type SecretId =
  | 'secret-friend'
  | 'hidden-light'
  | 'cluckle-dream'
  // One gentle off-route glimmer per Journey backdrop (P3-08), now reachable thanks to persisted
  // touch counts (P1-07) and charging feedback (P2-08).
  | 'meadow-nest'
  | 'lamplighter'
  | 'garden-cat'
  | 'message-bottle';

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
  // Journey off-route glimmers — a reward for the child who wanders a little off the path.
  // Naming-the-animals: a hidden meadow nest known only to the one who keeps coming back.
  'meadow-nest': {
    touchesToReveal: 3,
    sticker: 'meadow-nest',
    pattern: 'naming-the-animals: a hidden nest befriends the wanderer who returns',
  },
  // Light-from-darkness: a single street lamp warms the quiet edge of the crossing.
  'lamplighter': {
    touchesToReveal: 1,
    sticker: 'lamplighter',
    pattern: 'light-from-darkness: a lamp lit at the edge of the dark to guide a friend home',
  },
  // Naming-the-animals: a shy garden cat off the bike route waits to be noticed.
  'garden-cat': {
    touchesToReveal: 3,
    sticker: 'garden-cat',
    pattern: 'naming-the-animals: the unnoticed cat becomes a friend to the patient child',
  },
  // Light-from-darkness: a tiny message in a bottle, bobbing off the sea route.
  'message-bottle': {
    touchesToReveal: 1,
    sticker: 'message-bottle',
    pattern: 'light-from-darkness: a word of love sealed in a bottle, waiting on the quiet sea',
  },
};

export function isSecretId(value: string): value is SecretId {
  return Object.prototype.hasOwnProperty.call(SECRET_DEFINITIONS, value);
}

export interface SecretsConfig {
  /** The child's profile name, so a reveal can greet them by name. */
  playerName?: string;
  /** Secrets already found in a previous session (rehydrated from stickers). */
  discovered?: SecretId[];
  /** Per-secret touch counts from a previous session, so a multi-tap secret keeps charging. */
  touches?: Partial<Record<SecretId, number>>;
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
    // Rehydrate prior touch counts so a half-charged secret resumes where it left off.
    for (const [id, count] of Object.entries(config.touches ?? {})) {
      if (isSecretId(id) && typeof count === 'number') this.touches.set(id, count);
    }
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

  /** How many times this secret has been touched so far (for persistence). */
  getTouches(id: SecretId): number {
    return this.touches.get(id) ?? 0;
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
      case 'meadow-nest':
        return {
          ...base,
          message: `You found a little nest in the long grass! Three tiny eggs, warm and safe. They were waiting for a gentle friend like you, ${this.playerName}.`,
        };
      case 'lamplighter':
        return {
          ...base,
          message: `A quiet lamp flickers on just for you, ${this.playerName}. Now no one walking home in the dark will feel alone.`,
        };
      case 'garden-cat':
        return {
          ...base,
          message: `A shy garden cat peeks out and purrs! "You kept looking for me, ${this.playerName}. I'll wait here for you."`,
        };
      case 'message-bottle':
        return {
          ...base,
          message: `A little bottle bobs over with a tiny note inside: "Someone far away is thinking of you and loves you, ${this.playerName}."`,
        };
    }
  }
}
