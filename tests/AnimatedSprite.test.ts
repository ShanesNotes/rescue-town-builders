import { animationKey, DEFAULT_ANIMATION_FRAME_RATE, resolveLoopTiming } from '../src/game/ui/AnimatedSprite';

describe('AnimatedSprite helpers', () => {
  it('builds stable animation keys from texture and loop names', () => {
    expect(animationKey('hl.fx.sparkle', 'twinkle')).toBe('hl.fx.sparkle.twinkle');
  });

  it('defaults to a gentle looping animation timing', () => {
    expect(resolveLoopTiming({ name: 'loop', start: 0, end: 3 })).toEqual({
      frameRate: DEFAULT_ANIMATION_FRAME_RATE,
      repeat: -1,
    });
  });

  it('keeps explicit loop timing overrides', () => {
    expect(resolveLoopTiming({ name: 'burst', start: 0, end: 3, frameRate: 12, repeat: 0 })).toEqual({
      frameRate: 12,
      repeat: 0,
    });
  });
});
