import { describe, expect, it } from 'vitest';
import { containsHarshFailureLanguage, meetsMinimumTouchTarget, polishChecklist } from '../src/game/systems/AccessibilityRules';
import { missionDefinitions } from '../src/game/data/missions';

describe('AccessibilityRules', () => {
  it('requires large child-friendly touch targets', () => {
    expect(meetsMinimumTouchTarget({ width: 90, height: 52 })).toBe(true);
    expect(meetsMinimumTouchTarget({ width: 40, height: 40 })).toBe(false);
  });

  it('flags harsh failure language', () => {
    expect(containsHarshFailureLanguage('You lost the mission')).toBe(true);
    expect(containsHarshFailureLanguage('Try that bin next time')).toBe(false);
  });

  it('does not flag reassuring "no fail" copy as harsh', () => {
    // The actual Fire Fix intro line. It promises safety; it must read as kind.
    expect(containsHarshFailureLanguage('Move close, aim, and spray. There is no fail state.')).toBe(false);
    expect(containsHarshFailureLanguage('There is no fail state.')).toBe(false);
  });

  it('flags genuinely shaming language', () => {
    for (const shaming of ['You failed!', 'Game over', "You're a loser", 'Try harder, you lose']) {
      expect(containsHarshFailureLanguage(shaming)).toBe(true);
    }
  });

  it('keeps every child-facing mission intro panel free of harsh language', () => {
    for (const mission of missionDefinitions) {
      for (const panel of mission.introPanels) {
        expect(containsHarshFailureLanguage(panel.title)).toBe(false);
        expect(containsHarshFailureLanguage(panel.text)).toBe(false);
      }
    }
  });

  it('tracks the MVP polish checklist', () => {
    expect(polishChecklist).toContain('no-hard-fail-language');
    expect(polishChecklist).toContain('large-touch-targets');
    expect(polishChecklist).toContain('helper-mode');
  });
});
