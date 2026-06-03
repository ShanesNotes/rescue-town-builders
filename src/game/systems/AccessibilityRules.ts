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

const HARSH_FAILURE_WORDS = [/\blost\b/i, /\bfailed\b/i, /\bfail\b/i, /\bgame over\b/i, /\bbad job\b/i];

export function meetsMinimumTouchTarget(target: TouchTarget): boolean {
  return target.width >= MIN_TOUCH_TARGET && target.height >= MIN_TOUCH_TARGET;
}

export function containsHarshFailureLanguage(text: string): boolean {
  return HARSH_FAILURE_WORDS.some((pattern) => pattern.test(text));
}
