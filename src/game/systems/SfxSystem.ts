// Synthesized sound effects — no audio files required.
//
// For a pre-reader, a sound is the primary "I did it!" signal, so every rewarding
// action earns one. Audio is always optional (No-Fail): when muted or at zero
// volume, cues are silent and nothing is ever blocked. The cue -> sound recipe
// lives here; a pluggable sink renders it (WebAudio in the browser, a fake in
// tests). Real CC0 samples can later be swapped in behind the same SfxCue
// interface without touching any caller.

export type SfxCue = 'tap' | 'try-again' | 'correct' | 'place' | 'spray-hit' | 'fanfare' | 'secret';

export type SfxRecipe = {
  /** Note frequencies in Hz, played in order. Ascending reads as "good / up". */
  notes: number[];
  /** Seconds per note. */
  noteDuration: number;
};

export const SFX_RECIPES: Record<SfxCue, SfxRecipe> = {
  tap: { notes: [659.25], noteDuration: 0.045 }, // E5, a soft press tick — the "I pressed it" signal
  'try-again': { notes: [466.16, 523.25], noteDuration: 0.07 }, // gentle up-nudge, NEVER a buzzer (No-Fail)
  correct: { notes: [523.25, 659.25], noteDuration: 0.09 }, // C5 -> E5, a happy blip
  place: { notes: [440, 587.33], noteDuration: 0.08 }, // A4 -> D5, a satisfying click-up
  'spray-hit': { notes: [392], noteDuration: 0.05 }, // short G4 tick
  fanfare: { notes: [523.25, 659.25, 783.99, 1046.5], noteDuration: 0.12 }, // C-E-G-C victory
  secret: { notes: [783.99, 987.77, 1318.51], noteDuration: 0.16 }, // shimmering reveal
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
        let start = ctx.currentTime;
        const peak = Math.max(0.0002, 0.18 * gain); // capped so it stays gentle
        for (const frequency of recipe.notes) {
          const osc = ctx.createOscillator();
          const amp = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.value = frequency;
          amp.gain.setValueAtTime(0.0001, start);
          amp.gain.exponentialRampToValueAtTime(peak, start + 0.012);
          amp.gain.exponentialRampToValueAtTime(0.0001, start + recipe.noteDuration);
          osc.connect(amp).connect(ctx.destination);
          osc.start(start);
          osc.stop(start + recipe.noteDuration + 0.02);
          start += recipe.noteDuration;
        }
      } catch {
        // No-Fail: a sound error must never interrupt the child's play.
      }
    },
  };
}
