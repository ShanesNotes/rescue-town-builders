import type { MissionResult } from '../types';

export type CelebrationPlan = {
  starCount: 1 | 2 | 3;
  stickers: string[];
  confettiBursts: number;
  allowsFlashing: boolean;
  message: string;
};

export function createCelebrationPlan(result: MissionResult): CelebrationPlan {
  return {
    starCount: result.stars,
    stickers: result.stickersUnlocked,
    confettiBursts: result.stars + result.stickersUnlocked.length,
    allowsFlashing: false,
    message: result.stars === 3 ? 'Super helper!' : 'Great helping!',
  };
}
