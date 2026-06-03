// Procedural background music — no audio files required.
//
// A pre-reader feels a place through its music. This synthesizes a gentle, cheerful,
// non-hyperactive loop in WebAudio so the town always hums softly with life. Like the
// SFX, music is always optional (No-Fail): muting or a zero music slider makes it silent
// and nothing is ever blocked. The loop is started once on the first user gesture (browser
// autoplay policy) and then plays across every scene from a single persistent sink.
//
// The real recorded theme (Shane's Audacity track, catalog key `audio.theme-loop`, still in
// four segments) can later be spliced to OGG and swapped in behind this same MusicSink
// interface without touching any caller — exactly as planned for the SFX samples.

export type MusicTheme = {
  /** Seconds per melody step. Unhurried — this is a lullaby-bright loop, not a march. */
  noteDuration: number;
  /** Melody frequencies in Hz, looped. 0 = a rest (breath). */
  melody: number[];
  /** Slow bass, one note per `barLength` melody steps. Roots the harmony gently. */
  bass: number[];
  /** Melody steps per bass note. */
  barLength: number;
};

// A warm C-major pentatonic motif: rises like a sunrise over the town, settles home.
// Authored to be swappable — Grok's creative-direction motif can replace these arrays.
const C4 = 261.63;
const D4 = 293.66;
const E4 = 329.63;
const G4 = 392.0;
const A4 = 440.0;
const C5 = 523.25;
const C3 = 130.81;
const A2 = 110.0;
const G2 = 98.0;

export const MUSIC_THEME: MusicTheme = {
  noteDuration: 0.42,
  melody: [E4, G4, A4, G4, E4, D4, C4, 0, E4, G4, C5, A4, G4, E4, D4, 0],
  bass: [C3, C3, A2, G2],
  barLength: 4,
};

export interface MusicSink {
  /** Begin the looping theme, polling `level()` (0..1) live so the volume slider works. */
  start(theme: MusicTheme, level: () => number): void;
  /** Stop and release the loop. */
  stop(): void;
}

/** Clamp a raw music level to a safe, gentle gain. Music sits under SFX, so it is quiet. */
export function musicGainFromLevel(level: number): number {
  if (!Number.isFinite(level)) return 0;
  return Math.max(0, Math.min(1, level));
}

export class MusicSystem {
  private playing = false;

  constructor(
    private readonly sink: MusicSink,
    private readonly musicLevel: () => number,
  ) {}

  /** Start the loop once (idempotent). Call on the first user gesture. */
  start(): void {
    if (this.playing) return;
    this.playing = true;
    this.sink.start(MUSIC_THEME, this.musicLevel);
  }

  /** Stop the loop. Safe to call when not playing. */
  stop(): void {
    if (!this.playing) return;
    this.playing = false;
    this.sink.stop();
  }

  isPlaying(): boolean {
    return this.playing;
  }
}

/**
 * Browser sink: a small lookahead scheduler synthesizes the melody + bass with soft
 * envelopes at a low peak gain, reading the live level each step so muting/volume changes
 * apply within a beat. Any failure is swallowed — music is a bonus and must never interrupt
 * play (No-Fail). Not unit-tested (browser-only); the gating/lifecycle logic above is.
 */
export function createWebAudioMusicSink(): MusicSink {
  let ctx: AudioContext | null = null;
  let timer: ReturnType<typeof setInterval> | null = null;
  let step = 0;
  let nextTime = 0;

  const SCHEDULE_AHEAD = 0.3; // seconds
  const TICK_MS = 60;

  function voice(frequency: number, when: number, duration: number, peak: number, type: OscillatorType): void {
    if (frequency <= 0 || peak <= 0 || !ctx) return;
    const osc = ctx.createOscillator();
    const amp = ctx.createGain();
    osc.type = type;
    osc.frequency.value = frequency;
    amp.gain.setValueAtTime(0.0001, when);
    amp.gain.exponentialRampToValueAtTime(peak, when + 0.04);
    amp.gain.exponentialRampToValueAtTime(0.0001, when + duration);
    osc.connect(amp).connect(ctx.destination);
    osc.start(when);
    osc.stop(when + duration + 0.03);
  }

  return {
    start(theme, level) {
      try {
        const Ctor =
          window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!Ctor) return;
        ctx ??= new Ctor();
        void ctx.resume?.();
        step = 0;
        nextTime = ctx.currentTime + 0.1;
        const dur = theme.noteDuration;
        timer = setInterval(() => {
          if (!ctx) return;
          const gain = musicGainFromLevel(level());
          while (nextTime < ctx.currentTime + SCHEDULE_AHEAD) {
            if (gain > 0) {
              const note = theme.melody[step % theme.melody.length] ?? 0;
              // Triangle melody is soft and round; gentle, well under the SFX peak.
              voice(note, nextTime, dur * 0.9, 0.05 * gain, 'triangle');
              if (step % theme.barLength === 0) {
                const bassNote = theme.bass[(step / theme.barLength) % theme.bass.length] ?? 0;
                voice(bassNote, nextTime, dur * theme.barLength * 0.95, 0.045 * gain, 'sine');
              }
            }
            nextTime += dur;
            step += 1;
          }
        }, TICK_MS);
      } catch {
        // No-Fail: a music error must never interrupt the child's play.
      }
    },
    stop() {
      if (timer) clearInterval(timer);
      timer = null;
    },
  };
}
