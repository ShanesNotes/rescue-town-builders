import { describe, expect, it } from 'vitest';
import { VoiceSystem, pickVoiceLine, createWebSpeechVoiceSink, type VoiceSink } from '../src/game/systems/VoiceSystem';
import { VOICE_LINES, missionStartVoiceKey, type VoiceKey } from '../src/game/data/voiceLines';

function fakeSink() {
  const spoken: string[] = [];
  let cancels = 0;
  const sink: VoiceSink = { speak: (line) => spoken.push(line), cancel: () => (cancels += 1) };
  return { sink, spoken, cancels: () => cancels };
}

const ALL_KEYS = Object.keys(VOICE_LINES) as VoiceKey[];

describe('VoiceSystem', () => {
  it('has a non-empty spoken line for every moment key (a non-reader is never left silent)', () => {
    for (const key of ALL_KEYS) {
      expect(pickVoiceLine(key, 0)).toBeTypeOf('string');
      expect(pickVoiceLine(key, 0).length).toBeGreaterThan(0);
    }
  });

  it('picks variants deterministically by a rotating index, never an RNG or wall-clock', () => {
    const key: VoiceKey = 'title'; // two variants
    expect(pickVoiceLine(key, 0)).toBe(VOICE_LINES.title[0]);
    expect(pickVoiceLine(key, 1)).toBe(VOICE_LINES.title[1]);
    expect(pickVoiceLine(key, 2)).toBe(VOICE_LINES.title[0]); // wraps
  });

  it('rotates variants across repeated speaks of the same key, and cancels in-flight first', () => {
    const { sink, spoken, cancels } = fakeSink();
    const voice = new VoiceSystem(sink, () => true);

    voice.speak('title');
    voice.speak('title');

    expect(spoken).toEqual([VOICE_LINES.title[0], VOICE_LINES.title[1]]);
    expect(cancels()).toBe(2); // one cancel before each utterance
  });

  it('is a silent no-op when voice is disabled (respects voiceEnabled + mute, No-Fail)', () => {
    const { sink, spoken } = fakeSink();
    const voice = new VoiceSystem(sink, () => false);

    voice.speak('title');
    voice.speak('mission-complete');

    expect(spoken).toHaveLength(0);
  });

  it('maps a mission archetype to its mission-start key (build is the default for the core trio)', () => {
    expect(missionStartVoiceKey('match')).toBe('mission-start-match');
    expect(missionStartVoiceKey('aim')).toBe('mission-start-aim');
    expect(missionStartVoiceKey('journey')).toBe('mission-start-journey');
    expect(missionStartVoiceKey(undefined)).toBe('mission-start-build');
  });

  it('the Web Speech sink is a safe no-op when speechSynthesis is absent (headless never throws)', () => {
    // In the test (jsdom-free) environment there is no window.speechSynthesis: the sink must build
    // and run without throwing, speaking nothing.
    const sink = createWebSpeechVoiceSink();
    expect(() => {
      sink.speak('hello');
      sink.cancel();
    }).not.toThrow();
  });
});
