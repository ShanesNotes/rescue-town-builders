import { describe, expect, it } from 'vitest';
import { chooseMatch, createMatchState, getMatchResult, type MatchPrompt, type MatchTarget } from '../src/game/systems/MatchEngine';

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

  it('scores accuracy into stars and unlocks the sticker only on completion', () => {
    let state = createMatchState(TARGETS, PROMPTS);
    state = chooseMatch(state, 'cold').state;
    const partial = getMatchResult(state, 'recycling-run', 'demo-sticker');
    expect(partial.completed).toBe(false);
    expect(partial.stickersUnlocked).toEqual([]);

    state = chooseMatch(state, 'hot').state;
    const done = getMatchResult(state, 'recycling-run', 'demo-sticker');
    expect(done.completed).toBe(true);
    expect(done.stars).toBeGreaterThanOrEqual(1);
    expect(done.stickersUnlocked).toEqual(['demo-sticker']);
  });
});
