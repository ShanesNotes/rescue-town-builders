# Rivet's Reuse Workshop mechanics pivot

Status: tracer-bullet direction for the Recycling Run replacement.

## Why this pivot exists

The first Recycling Run slice was safe and readable, but its core verb was only
"put the item in the correct bin." That made the mission feel like a compliance
worksheet instead of the product's intended playable-toy fantasy. The PRD asks
for missions that preserve "wouldn't it be better if..." energy, feel playful and
slightly surreal, and let recyclables become gadgets. This pivot keeps the same
MVP mission id and accessibility contract, but changes the fantasy from sorting
waste to inventing with rescued parts.

## New fantasy

Rivet is not a recycling mascot. Rivet is a small workshop inventor who sees a
friend in every lost scrap. Old objects are "rescued pieces" that can become
bubble sprinklers, moon chimes, garden rockets, kite tails, ramps, reflectors,
and other tiny town contraptions.

## Current tracer-bullet loop

1. Rivet presents a town problem and an invention blueprint.
2. The child chooses from three rescued items.
3. A matching item snaps into the current blueprint slot.
4. A non-matching item becomes silly trim instead of a failure.
5. After repeated misses on the same slot, Helper Mode snaps in a matching part
   while keeping the child's chosen item as decoration.
6. Completing a blueprint tests the invention with a short celebratory message.
7. Completing the workshop returns the normal `recycling-run` mission result,
   sticker, stars, and local-save progress.

## Design principles

- **Reuse over disposal:** teach that old stuff can become useful, funny, or
  beautiful.
- **Wrong becomes charming:** an incorrect piece should decorate, sparkle, or
  wobble; it should not shame or dead-end the child.
- **Icon-first:** all instructions must be understandable through object shapes,
  slots, glow, and motion before reading.
- **Tiny inventions:** every blueprint should create an immediately visible town
  benefit in 5-20 seconds.
- **No engine pivot yet:** this is intentionally implemented inside the existing
  Phaser scene seam so we test the mechanic before questioning the engine.

## Prototype success criteria

- A child understands that scraps are for building, not merely categorizing.
- The child sees at least one surprising transformation.
- Repeated wrong choices still move toward completion with Helper Mode.
- The mission earns a replay request before we add more roadmap missions.

## Near-next experiments

- Add one true animated invention payoff per blueprint: bubble sprinkler, moon
  chime, garden rocket, crinkle kite.
- Replace text labels with Hearthlight part silhouettes and slot icons.
- Let completed inventions appear as town decorations on the map.
- Explore a small "free remix" bonus where any three decorated scraps create a
  silly sticker.
