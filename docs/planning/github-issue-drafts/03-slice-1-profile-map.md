## Parent

#1

## What to build

Build the profile, parent settings, and town map progress loop so a child can select a profile, choose missions from a static map, complete a fake mission, and see saved stars on return.

## Acceptance criteria

- [ ] Up to 5 local profiles can be created and selected.
- [ ] Parent settings expose mute/volume/difficulty/reset behind child-safe interaction.
- [ ] Mission registry drives static town map nodes.
- [ ] MissionComplete updates map stars and persists after refresh.
- [ ] Navigation works Start → Profile → Map → Mission → Result → Map.

## Blocked by

Slice 0.

## TDD notes

Test profile cap, selected profile persistence, settings update/reset, and map progress projection before UI polish.
