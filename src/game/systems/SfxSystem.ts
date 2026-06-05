// Synthesized sound effects — no audio files required.
//
// For a pre-reader, a sound is the primary "I did it!" signal, so every rewarding
// action earns one. Audio is always optional (No-Fail): when muted or at zero
// volume, cues are silent and nothing is ever blocked. The cue -> sound recipe
// lives here; a pluggable sink renders it (WebAudio in the browser, a fake in
// tests). Real CC0 samples can later be swapped in behind the same SfxCue
// interface without touching any caller.

export type SfxCue = 'tap' | 'try-again' | 'correct' | 'place' | 'spray-hit' | 'fanfare' | 'secret' | 'sticker';

export type SfxRecipe = {
  /** Note frequencies in Hz, played in order. Ascending reads as "good / up". */
  notes: number[];
  /** Seconds per note. */
  noteDuration: number;
  /** Optional chord pad held UNDER the melody for a fuller, warmer body (Hz). */
  chord?: number[];
  /** Optional sparkle layer: high shimmer notes sprinkled over the melody. */
  sparkle?: number[];
  /** The final melody note rings on for this many extra seconds (a sustained celebratory tail). */
  sustain?: number;
};

export const SFX_RECIPES: Record<SfxCue, SfxRecipe> = {
  tap: { notes: [659.25], noteDuration: 0.045 }, // E5, a soft press tick — the "I pressed it" signal
  'try-again': { notes: [466.16, 523.25], noteDuration: 0.07 }, // gentle up-nudge, NEVER a buzzer (No-Fail)
  correct: { notes: [523.25, 659.25], noteDuration: 0.09 }, // C5 -> E5, a happy blip
  place: { notes: [440, 587.33], noteDuration: 0.08 }, // A4 -> D5, a satisfying click-up
  'spray-hit': { notes: [392], noteDuration: 0.05 }, // short G4 tick
  // A fuller victory (P3-01): a rising C-E-G-C melody over a held C-major chord pad, a high sparkle
  // layer, and a final C6 that RINGS on so the tail lasts roughly as long as the confetti settles.
  fanfare: {
    notes: [523.25, 659.25, 783.99, 1046.5],
    noteDuration: 0.13,
    chord: [261.63, 329.63, 392.0], // C3-E3-G3 warm pad
    sparkle: [1567.98, 2093.0], // G6 + C7 twinkle
    sustain: 1.4, // the ringing 'we did it' note
  },
  secret: { notes: [783.99, 987.77, 1318.51], noteDuration: 0.16 }, // shimmering reveal (reserved for TRUE secrets)
  // A dedicated warm 'new sticker' cue (P3-01) — a soft major arpeggio with a gentle held chord,
  // distinct from the secret's bright shimmer so the album reward has its own voice.
  sticker: { notes: [587.33, 739.99, 880.0], noteDuration: 0.12, chord: [293.66, 369.99], sustain: 0.5 },
};

export interface SfxSink {
  /** Render a cue's recipe at the given gain (0..1). */
  render(recipe: SfxRecipe, gain: number): void;
}

export class SfxSystem {
  constructor(
    private readonly sink: SfxSink,
    private readonly sfxLevel: () => number,
  ) {}

  /** Play a reward cue. Silent and harmless when audio is muted or at zero. */
  play(cue: SfxCue): void {
    const gain = clampGain(this.sfxLevel());
    if (gain <= 0) return;
    this.sink.render(SFX_RECIPES[cue], gain);
  }
}

function clampGain(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(1, value));
}

/**
 * Browser sink: synthesizes each note with a short, gentle envelope so cues are
 * soft and never harsh for a child. Lazily creates one AudioContext. Any failure
 * is swallowed — audio is a bonus and must never interrupt play (No-Fail).
 * Not unit-tested (browser-only); the decision/gating logic above is.
 */
export function createWebAudioSfxSink(): SfxSink {
  let ctx: AudioContext | null = null;
  return {
    render(recipe, gain) {
      try {
        const Ctor =
          window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!Ctor) return;
        ctx ??= new Ctor();
        const peak = Math.max(0.0002, 0.18 * gain); // capped so it stays gentle
        const begin = ctx.currentTime;

        // One soft note with an attack/decay envelope. `hold` extends the ring (the celebratory tail).
        const tone = (frequency: number, at: number, duration: number, level: number, type: OscillatorType = 'sine'): void => {
          const osc = ctx!.createOscillator();
          const amp = ctx!.createGain();
          osc.type = type;
          osc.frequency.value = frequency;
          amp.gain.setValueAtTime(0.0001, at);
          amp.gain.exponentialRampToValueAtTime(Math.max(0.0002, level), at + 0.012);
          amp.gain.exponentialRampToValueAtTime(0.0001, at + duration);
          osc.connect(amp).connect(ctx!.destination);
          osc.start(at);
          osc.stop(at + duration + 0.02);
        };

        // Melody notes in sequence; the last note rings on for `sustain` (P3-01 fanfare tail).
        let start = begin;
        recipe.notes.forEach((frequency, i) => {
          const last = i === recipe.notes.length - 1;
          const duration = recipe.noteDuration + (last && recipe.sustain ? recipe.sustain : 0);
          tone(frequency, start, duration, peak);
          start += recipe.noteDuration;
        });
        const totalDuration = start - begin + (recipe.sustain ?? 0);

        // A warm chord pad held softly under the whole melody — gives the cue body without harshness.
        if (recipe.chord) {
          for (const frequency of recipe.chord) tone(frequency, begin, totalDuration, peak * 0.5, 'triangle');
        }
        // A sprinkled high sparkle layer over the back half of the melody.
        if (recipe.sparkle) {
          recipe.sparkle.forEach((frequency, i) => {
            tone(frequency, begin + totalDuration * (0.4 + i * 0.18), 0.14, peak * 0.4);
          });
        }
      } catch {
        // No-Fail: a sound error must never interrupt the child's play.
      }
    },
  };
}
