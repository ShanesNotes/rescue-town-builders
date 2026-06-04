# MVP play-test guide for a non-game-dev parent

Purpose: find out whether the first three missions are obvious, generous, and fun before agents build more missions.

## Setup

1. Start the prototype:
   ```sh
   npm install
   npm run dev
   ```
2. Open the local URL shown by Vite.
3. Use a laptop/tablet in landscape. If available, plug in a gamepad for at least part of the session.
4. Keep the session short: 15-20 minutes is enough.

## Parent role

- Sit nearby, but do not explain the game first.
- If the child asks what to do, answer simply: "Try what looks fun."
- Step in only if the child is stuck, upset, or the controls stop working.
- Write down observations in plain language. No game-development terms are needed.

## What to watch

For each mission, record:

- Did the child understand the goal within about 10 seconds?
- Which control did they try first: touch, keyboard, mouse, or gamepad?
- Did any button look too small or too far away?
- Did mistakes feel okay, or did the child seem frustrated?
- Did helper text help?
- Did they smile, laugh, narrate, or ask to replay?
- Did any screen feel boring, confusing, too loud, too busy, or too slow?

## Mission checklist

### Rivet's Reuse Workshop

- Can the child tell that old scraps are for building inventions, not just sorting?
- Are the three rescued-item cards easy to choose with touch/keyboard/gamepad?
- Does a wrong piece becoming decoration feel funny and safe?
- Does the invention payoff make the child smile, narrate, or ask to replay?

### Brick's House Builder

- Does the child understand the current neighbor wish and next glowing piece?
- Are house pieces easy to compare?
- Does a wrong piece becoming yard decoration/scaffold feel funny and safe?
- After repeated misses, does Brick's helper snap-in feel supportive rather than like a correction?

### Ember's Fire Fix

- Can the child move and spray without adult control help?
- Try this mission with a gamepad if possible.
- Are the cartoon fires clearly pretend and not scary?

## Gamepad smoke check

Try these with a common controller:

- D-pad moves a selection or character.
- A / button 0 confirms.
- B / button 1 goes back.
- X / button 2 performs the action, such as spray.
- No mission requires two hands at the same time.

## Asset and music notes

Keep placeholders for now. The generated theme music loop exists as four separate segments outside the repo. Before importing it:

1. Splice the segments into one clean loop.
2. Save the original prompt/source notes, tool used, and date.
3. Confirm it is safe for this project and not based on third-party music.
4. Add a row to `docs/assets/ASSET_BACKLOG.md` before committing audio.

For art, prefer one consistent placeholder pack per category over mixing many styles. Reject anything that resembles known branded characters, even if it claims to be free.

## Notes template

```text
Date:
Child age:
Device:
Controls tried:
Favorite mission:
Least clear moment:
Any frustration:
Any laughter/replay requests:
Gamepad notes:
Asset/music taste notes:
Must fix before more missions:
Nice-to-have polish:
```
