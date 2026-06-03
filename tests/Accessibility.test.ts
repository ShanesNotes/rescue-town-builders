import { describe, expect, it } from 'vitest';
import { containsHarshFailureLanguage, meetsMinimumTouchTarget, polishChecklist } from '../src/game/systems/AccessibilityRules';

describe('AccessibilityRules', () => {
  it('requires large child-friendly touch targets', () => {
    expect(meetsMinimumTouchTarget({ width: 90, height: 52 })).toBe(true);
    expect(meetsMinimumTouchTarget({ width: 40, height: 40 })).toBe(false);
  });

  it('flags harsh failure language', () => {
    expect(containsHarshFailureLanguage('You lost the mission')).toBe(true);
    expect(containsHarshFailureLanguage('Try that bin next time')).toBe(false);
  });

  it('tracks the MVP polish checklist', () => {
    expect(polishChecklist).toContain('no-hard-fail-language');
    expect(polishChecklist).toContain('large-touch-targets');
    expect(polishChecklist).toContain('helper-mode');
  });
});
