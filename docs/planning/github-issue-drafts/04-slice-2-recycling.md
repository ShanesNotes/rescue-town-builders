## Parent

#1

## What to build

Build Rivet's Recycling Run as the first real mini-game: sort 10 items into bins, give gentle hints after mistakes, award accuracy-based stars, and save the result.

## Acceptance criteria

- [ ] Sorting item data defines trash, paper, plastic, metal, and compost categories as needed by difficulty.
- [ ] Keyboard and touch bin selection work with large targets.
- [ ] Incorrect choices wobble or hint and never fail the mission.
- [ ] Completing 10 items awards 1-3 stars.
- [ ] Best result persists to the selected profile.
- [ ] Asset needs for bins/items are recorded in `docs/assets/ASSET_BACKLOG.md`.

## Blocked by

Slice 1 and enough placeholder bin/item assets.

## TDD notes

Start with item/category matching, scoring thresholds, and no-fail retry behavior before scene implementation.
