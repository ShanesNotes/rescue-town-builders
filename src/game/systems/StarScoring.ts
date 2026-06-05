export type StarRating = 0 | 1 | 2 | 3;
export type CompletedStarRating = 1 | 2 | 3;

export function clampStars(value: number): CompletedStarRating {
  if (value <= 1) return 1;
  if (value >= 3) return 3;
  return 2;
}

export function starsFromAccuracy(accuracy: number): CompletedStarRating {
  if (accuracy >= 0.9) return 3;
  if (accuracy >= 0.7) return 2;
  return 1;
}

// Match & Journey are the hardest missions for a non-reader to read, and the inverse-dream/recipe
// ones can drop a struggling child to 1 star (P1-08). No-Fail scoring: a *completed* Match/Journey
// floors at 2 stars; 3 is the gentle bonus, reserved for a clean run — no wrong taps and no
// auto-assist needed. Used instead of raw starsFromAccuracy for those archetypes.
export function starsForMatch(accuracy: number, usedAssist: boolean): CompletedStarRating {
  if (accuracy >= 1 && !usedAssist) return 3;
  return 2;
}

export function bestStars(current: StarRating, next: CompletedStarRating): CompletedStarRating {
  return clampStars(Math.max(current, next));
}
