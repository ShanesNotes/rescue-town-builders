// Spoken VO script — warm, short, IP-safe, No-Fail (ported from Grok's voice-and-copy.md §1).
//
// For Willem and every pre-reader who plays solo: a gentle voice carries the game when eyes cannot.
// Each key holds 1-2 variants; VoiceSystem picks one deterministically (a rotating counter, not an
// RNG and not wall-clock) so a run is reproducible. No file assets — Web Speech reads these aloud,
// and a parent can read the same lines if speech is unavailable.

export type VoiceKey =
  | 'title' // app/title open
  | 'pick-helper' // profile: choose a friend
  | 'mission-start-generic' // any mission start
  | 'mission-start-build' // build archetype (recycling/house/fire)
  | 'mission-start-match' // match archetype
  | 'mission-start-aim' // aim archetype
  | 'mission-start-journey' // journey archetype
  | 'correct' // a piece fits / a target clears
  | 'try-again' // gentle No-Fail nudge
  | 'friend-helped' // assist / helper stepped in
  | 'mission-complete' // a window glows
  | 'secret-found' // a quiet secret revealed
  | 'sticker' // here is your sticker
  | 'goodbye'; // back to title / session end

import type { MissionArchetype } from '../types';

// Map a mission's archetype to its spoken mission-start key. The core trio (recycling/house/fire)
// have no archetype and are the "build" family (Grok §1.3), so undefined → build.
export function missionStartVoiceKey(archetype: MissionArchetype | undefined): VoiceKey {
  switch (archetype) {
    case 'match':
      return 'mission-start-match';
    case 'aim':
      return 'mission-start-aim';
    case 'journey':
      return 'mission-start-journey';
    default:
      return 'mission-start-build';
  }
}

// Two variants where variety helps; one where a single warm line is enough.
export const VOICE_LINES: Record<VoiceKey, string[]> = {
  title: ['The town is dreaming you.', 'Lamps are waking for you.'],
  'pick-helper': ['Who brings light today?', 'Your friend is waiting.'],
  'mission-start-generic': ["Let's bring a little light.", 'The town is glad you came.'],
  'mission-start-build': ['Build something that stays warm.', 'One piece at a time, friend.'],
  'mission-start-match': ['Find the friend that fits.', 'Each piece has a home.'],
  'mission-start-aim': ['Get close, then help.', 'Aim gentle, then go.'],
  'mission-start-journey': ["Let's visit every friend.", 'The path glows when you go.'],
  correct: ['Yes! That fits just right.', 'The town feels that.'],
  'try-again': ['Almost — try the glowing one.', 'Every try is a little light.'],
  'friend-helped': ['A friend helped too. Keep going.', "You're not alone — keep helping."],
  'mission-complete': ['A window glows for you.', 'Because you stayed, it lights.'],
  'secret-found': ['You found something special.', 'Cluckle dreamed you would notice.'],
  sticker: ['A story for your book.', 'This light is yours to keep.'],
  goodbye: ['The town will dream of you.', 'Come back when you want light.'],
};
