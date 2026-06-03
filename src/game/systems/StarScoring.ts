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

export function bestStars(current: StarRating, next: CompletedStarRating): CompletedStarRating {
  return clampStars(Math.max(current, next));
}
