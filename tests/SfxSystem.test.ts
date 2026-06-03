import { describe, expect, it } from 'vitest';
import { SfxSystem, SFX_RECIPES, type SfxCue, type SfxRecipe, type SfxSink } from '../src/game/systems/SfxSystem';

function fakeSink() {
  const calls: { recipe: SfxRecipe; gain: number }[] = [];
  const sink: SfxSink = { render: (recipe, gain) => calls.push({ recipe, gain }) };
  return { sink, calls };
}

describe('SfxSystem', () => {
  it('plays a cue through the sink when sfx is audible', () => {
    const { sink, calls } = fakeSink();
    const sfx = new SfxSystem(sink, () => 0.7);

    sfx.play('correct');

    expect(calls).toHaveLength(1);
    expect(calls[0]?.recipe).toBe(SFX_RECIPES.correct);
  });

  it('passes the effective sfx level through as gain so the volume control works', () => {
    const { sink, calls } = fakeSink();
    const sfx = new SfxSystem(sink, () => 0.4);

    sfx.play('fanfare');

    expect(calls[0]?.gain).toBe(0.4);
  });

  it('stays silent when audio is muted or at zero (No-Fail: sound is never required)', () => {
    const { sink, calls } = fakeSink();
    const sfx = new SfxSystem(sink, () => 0);

    sfx.play('correct');
    sfx.play('fanfare');

    expect(calls).toHaveLength(0);
  });

  it('clamps an out-of-range or invalid level so a bad setting cannot crash or blast', () => {
    const over = fakeSink();
    new SfxSystem(over.sink, () => 5).play('place');
    expect(over.calls).toHaveLength(1);
    expect(over.calls[0]?.gain).toBe(1);

    const bad = fakeSink();
    new SfxSystem(bad.sink, () => Number.NaN).play('place');
    expect(bad.calls).toHaveLength(0);
  });

  it('has a sound recipe for every cue so no action can request an unplayable sound', () => {
    const cues: SfxCue[] = ['correct', 'place', 'spray-hit', 'fanfare', 'secret'];
    for (const cue of cues) {
      expect(SFX_RECIPES[cue].notes.length).toBeGreaterThan(0);
      expect(SFX_RECIPES[cue].noteDuration).toBeGreaterThan(0);
    }
  });
});
