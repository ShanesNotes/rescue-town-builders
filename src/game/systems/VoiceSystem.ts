// Spoken VO so a non-reader can play fully solo (P4-02). Wraps the Web Speech API and reads a warm,
// short line for a moment key. Lines live in voiceLines.ts; this picks one DETERMINISTICALLY (a
// rotating per-key counter — never an RNG, never wall-clock) so a run is reproducible.
//
// No-Fail: when speechSynthesis is undefined/unavailable (headless, blocked, unsupported), every
// call is a silent no-op and nothing ever throws. Gated by an `enabled` getter so the existing
// Parent Settings (voiceEnabled + audioMuted) govern it with no extra wiring — same seam as SfxSystem.

import { VOICE_LINES, type VoiceKey } from '../data/voiceLines';

/** Pure, deterministic line lookup. `nth` rotates variants (0,1,0,1…). Always returns a string. */
export function pickVoiceLine(key: VoiceKey, nth: number): string {
  const variants = VOICE_LINES[key];
  return variants[nth % variants.length] ?? variants[0] ?? '';
}

/** Renders a chosen line aloud. A fake in tests; Web Speech in the browser. */
export interface VoiceSink {
  speak(line: string): void;
  cancel(): void;
}

export class VoiceSystem {
  // Per-key rotation so repeated visits to the same moment alternate variants deterministically.
  private counters = new Map<VoiceKey, number>();

  constructor(
    private readonly sink: VoiceSink,
    private readonly enabled: () => boolean,
  ) {}

  /** Speak the warm line for this moment. Silent + harmless when voice is off or muted (No-Fail). */
  speak(key: VoiceKey): void {
    if (!this.enabled()) return;
    const nth = this.counters.get(key) ?? 0;
    this.counters.set(key, nth + 1);
    const line = pickVoiceLine(key, nth);
    if (!line) return;
    this.sink.cancel(); // cancel any in-flight utterance before speaking
    this.sink.speak(line);
  }
}

/**
 * Browser sink: a gentle voice via window.speechSynthesis. Prefers a local English voice when one is
 * available, rate ~0.9, a slightly warm pitch. Any failure is swallowed — voice is a bonus and must
 * never interrupt a child's play (No-Fail). Not unit-tested (browser-only); the gating/pick logic is.
 */
export function createWebSpeechVoiceSink(): VoiceSink {
  const synth = typeof window !== 'undefined' ? window.speechSynthesis : undefined;
  if (!synth || typeof SpeechSynthesisUtterance === 'undefined') {
    // No Web Speech here (headless/unsupported): every call is a no-op.
    return { speak: () => undefined, cancel: () => undefined };
  }

  // Prefer a local English voice for warmth + offline reliability; the voice list can populate
  // asynchronously, so resolve lazily on first use rather than caching an early empty list.
  const pickVoice = (): SpeechSynthesisVoice | null => {
    try {
      const voices = synth.getVoices();
      if (voices.length === 0) return null;
      const en = voices.filter((v) => v.lang?.toLowerCase().startsWith('en'));
      return en.find((v) => v.localService) ?? en[0] ?? voices[0] ?? null;
    } catch {
      return null;
    }
  };

  return {
    speak(line) {
      try {
        const utterance = new SpeechSynthesisUtterance(line);
        const voice = pickVoice();
        if (voice) utterance.voice = voice;
        utterance.lang = voice?.lang ?? 'en-US';
        utterance.rate = 0.9; // unhurried, like reading a picture book at dusk
        utterance.pitch = 1.1; // a slight warm lift
        utterance.volume = 1;
        synth.speak(utterance);
      } catch {
        // No-Fail: a speech error must never interrupt the child's play.
      }
    },
    cancel() {
      try {
        synth.cancel();
      } catch {
        // No-Fail: cancelling is best-effort.
      }
    },
  };
}
