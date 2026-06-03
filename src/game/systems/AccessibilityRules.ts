export type TouchTarget = {
  width: number;
  height: number;
};

export const MIN_TOUCH_TARGET = 52;

export const polishChecklist = [
  'large-touch-targets',
  'no-hard-fail-language',
  'helper-mode',
  'no-flashing-effects',
  'keyboard-touch-gamepad',
  'local-save-only',
] as const;

// Detects shaming / hard-fail language. Tuned to flag genuine put-downs
// ("you failed", "you lost", "loser", "try harder") while allowing reassuring
// copy such as "there is no fail state" — a bare /\bfail\b/ wrongly flagged that.
const HARSH_FAILURE_WORDS = [
  /\bfailed\b/i,
  /\byou fail\b/i,
  /\byou (lose|lost)\b/i,
  /\bgame over\b/i,
  /\bbad job\b/i,
  /\b(loser|stupid|dumb)\b/i,
  /\btry harder\b/i,
];

export function meetsMinimumTouchTarget(target: TouchTarget): boolean {
  return target.width >= MIN_TOUCH_TARGET && target.height >= MIN_TOUCH_TARGET;
}

export function containsHarshFailureLanguage(text: string): boolean {
  return HARSH_FAILURE_WORDS.some((pattern) => pattern.test(text));
}
