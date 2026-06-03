import type { MissionResult } from '../types';

export type CelebrationPlan = {
  starCount: 1 | 2 | 3;
  stickers: string[];
  confettiBursts: number;
  allowsFlashing: boolean;
  message: string;
};

// Every finish is celebrated warmly — even one star earns an enthusiastic cheer,
// never a lesser-feeling message (No-Fail). More stars simply throw a bigger party.
const CELEBRATION_MESSAGES: Record<1 | 2 | 3, string> = {
  1: 'You did it!',
  2: 'Great helping!',
  3: 'Super helper!',
};

export function createCelebrationPlan(result: MissionResult): CelebrationPlan {
  return {
    starCount: result.stars,
    stickers: result.stickersUnlocked,
    // Scale the party with the stars so three feels the biggest, while one star
    // still gets a real burst — finishing is always worth celebrating.
    confettiBursts: result.stars * 3 + result.stickersUnlocked.length * 2,
    allowsFlashing: false,
    message: CELEBRATION_MESSAGES[result.stars],
  };
}
