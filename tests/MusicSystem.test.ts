import { describe, expect, it } from 'vitest';
import {
  MusicSystem,
  MUSIC_THEME,
  musicGainFromLevel,
  createHtmlAudioMusicSink,
  createFallbackMusicSink,
  type MusicSink,
  type MusicTheme,
} from '../src/game/systems/MusicSystem';

function fakeSink() {
  const calls: { theme: MusicTheme; level: () => number }[] = [];
  let stops = 0;
  const sink: MusicSink = {
    start: (theme, level) => calls.push({ theme, level }),
    stop: () => {
      stops += 1;
    },
  };
  return { sink, calls, stops: () => stops };
}

describe('MusicSystem', () => {
  it('starts the looping theme through the sink', () => {
    const { sink, calls } = fakeSink();
    const music = new MusicSystem(sink, () => 0.6);

    music.start();

    expect(calls).toHaveLength(1);
    expect(calls[0]?.theme).toBe(MUSIC_THEME);
    expect(music.isPlaying()).toBe(true);
  });

  it('is idempotent so re-entering scenes never stacks duplicate loops', () => {
    const { sink, calls } = fakeSink();
    const music = new MusicSystem(sink, () => 0.6);

    music.start();
    music.start();
    music.start();

    expect(calls).toHaveLength(1);
  });

  it('passes a live level getter through so the volume slider works while playing', () => {
    const { sink, calls } = fakeSink();
    let level = 0.2;
    const music = new MusicSystem(sink, () => level);

    music.start();
    level = 0.9;

    expect(calls[0]?.level()).toBe(0.9);
  });

  it('stops only when playing (safe to call any time)', () => {
    const { sink, stops } = fakeSink();
    const music = new MusicSystem(sink, () => 0.5);

    music.stop();
    expect(stops()).toBe(0);

    music.start();
    music.stop();
    expect(stops()).toBe(1);
    expect(music.isPlaying()).toBe(false);
  });
});

describe('musicGainFromLevel', () => {
  it('clamps out-of-range or invalid levels so a bad setting cannot crash or blast', () => {
    expect(musicGainFromLevel(0.5)).toBe(0.5);
    expect(musicGainFromLevel(-1)).toBe(0);
    expect(musicGainFromLevel(2)).toBe(1);
    expect(musicGainFromLevel(Number.NaN)).toBe(0);
  });
});

describe('OGG fallback (No-Fail audio)', () => {
  // In the node test environment there is no `Audio` constructor, so the OGG sink cannot play —
  // exactly the case the fallback must cover. We assert it signals failure and never throws.
  it('fires onFailure when the OGG cannot play (no Audio available)', () => {
    let failed = false;
    const ogg = createHtmlAudioMusicSink('theme.ogg', () => {
      failed = true;
    });
    expect(() => ogg.start(MUSIC_THEME, () => 0.5)).not.toThrow();
    expect(failed).toBe(true);
    expect(() => ogg.stop()).not.toThrow();
  });

  it('start/stop on the fallback sink never throw even when the OGG is unavailable', () => {
    const sink = createFallbackMusicSink('theme.ogg');
    expect(() => sink.start(MUSIC_THEME, () => 0.5)).not.toThrow();
    expect(() => sink.stop()).not.toThrow();
  });
});
