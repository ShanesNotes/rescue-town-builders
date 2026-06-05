import { describe, expect, it } from 'vitest';
import { AUTO_RESOLVE_AT, chooseMatch, createMatchState, getMatchResult, type MatchPrompt, type MatchTarget } from '../src/game/systems/MatchEngine';

const TARGETS: MatchTarget[] = [
  { id: 'hot', label: 'Hot', icon: 'x' },
  { id: 'cold', label: 'Cold', icon: 'x' },
];
const PROMPTS: MatchPrompt[] = [
  { id: 'ice', label: 'Ice', icon: 'x', correctTargetId: 'cold' },
  { id: 'sun', label: 'Sun', icon: 'x', correctTargetId: 'hot' },
];

describe('MatchEngine', () => {
  it('advances on a correct match and completes after the last prompt', () => {
    let state = createMatchState(TARGETS, PROMPTS);
    const a = chooseMatch(state, 'cold');
    expect(a.correct).toBe(true);
    expect(a.completed).toBe(false);
    expect(a.state.solved).toBe(1);
    expect(a.state.currentPrompt?.id).toBe('sun');

    const b = chooseMatch(a.state, 'hot');
    expect(b.correct).toBe(true);
    expect(b.completed).toBe(true);
    expect(b.state.solved).toBe(2);
  });

  it('No-Fail: a wrong pick only hints — never advances, blocks, or completes', () => {
    const state = createMatchState(TARGETS, PROMPTS);
    const wrong = chooseMatch(state, 'hot'); // ice does not go in hot
    expect(wrong.correct).toBe(false);
    expect(wrong.completed).toBe(false);
    expect(wrong.state.solved).toBe(0);
    expect(wrong.state.currentPrompt?.id).toBe('ice'); // same prompt stays
    expect(wrong.state.lastHint).toBeTruthy();
    // The child can always still finish.
    const recover = chooseMatch(wrong.state, 'cold');
    expect(recover.correct).toBe(true);
    expect(recover.state.solved).toBe(1);
  });

  it('scores a clean run at 3 stars and unlocks the sticker only on completion', () => {
    let state = createMatchState(TARGETS, PROMPTS);
    state = chooseMatch(state, 'cold').state;
    const partial = getMatchResult(state, 'recycling-run', 'demo-sticker');
    expect(partial.completed).toBe(false);
    expect(partial.stickersUnlocked).toEqual([]);

    state = chooseMatch(state, 'hot').state;
    const done = getMatchResult(state, 'recycling-run', 'demo-sticker');
    expect(done.completed).toBe(true);
    expect(done.stars).toBe(3); // perfect, no help
    expect(done.stickersUnlocked).toEqual(['demo-sticker']);
  });

  it('escalates the telegraph after repeated wrong taps on the same prompt (P1-09)', () => {
    let state = createMatchState(TARGETS, PROMPTS);
    const first = chooseMatch(state, 'hot'); // wrong #1
    expect(first.assistLevel).toBe(0);
    expect(first.autoResolved).toBe(false);
    const second = chooseMatch(first.state, 'hot'); // wrong #2 → escalate
    expect(second.assistLevel).toBe(1);
    expect(second.autoResolved).toBe(false);
    expect(second.state.currentPrompt?.id).toBe('ice'); // still the same prompt — no auto-resolve yet
  });

  it('auto-resolves a prompt after the miss threshold so a stuck child is never blocked (P1-09)', () => {
    let state = createMatchState(TARGETS, PROMPTS);
    let outcome = chooseMatch(state, 'hot');
    // Keep tapping the WRONG target on the first prompt.
    for (let i = 1; i < AUTO_RESOLVE_AT - 1; i += 1) outcome = chooseMatch(outcome.state, 'hot');
    expect(outcome.autoResolved).toBe(false); // not yet
    const resolved = chooseMatch(outcome.state, 'hot'); // the AUTO_RESOLVE_AT'th miss
    expect(resolved.autoResolved).toBe(true);
    expect(resolved.assistLevel).toBe(2);
    expect(resolved.correct).toBe(true); // advances as if correct
    expect(resolved.state.solved).toBe(1); // moved past the prompt for the child
    expect(resolved.state.autoResolved).toBe(1);
    expect(resolved.state.currentPrompt?.id).toBe('sun'); // next prompt is now live
  });

  it('a fully auto-assisted completion still floors at 2 stars (P1-08)', () => {
    let state = createMatchState(TARGETS, PROMPTS);
    // Never tap a correct target — every prompt is carried by the No-Fail floor.
    let outcome = chooseMatch(state, 'wrong-id');
    let completed = outcome.completed;
    for (let i = 0; i < 200 && !completed; i += 1) {
      outcome = chooseMatch(outcome.state, 'wrong-id');
      completed = outcome.completed;
    }
    expect(completed).toBe(true); // the floor guarantees completion
    const result = getMatchResult(outcome.state, 'recycling-run', 'demo-sticker');
    expect(result.completed).toBe(true);
    expect(result.stars).toBeGreaterThanOrEqual(2); // never punished below 2 for needing help
    expect(result.stars).toBeLessThan(3); // but the clean-run bonus is reserved
    expect(result.stats.autoResolved).toBe(PROMPTS.length);
  });
});
