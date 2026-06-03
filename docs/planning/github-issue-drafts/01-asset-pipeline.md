## Parent

#1

## What to build

Establish the MVP asset curation pipeline before real art/audio imports. This includes placeholder rules, license ledger fields, source review, and naming/path conventions once the app structure exists.

## Acceptance criteria

- [ ] `docs/assets/ASSET_BACKLOG.md` remains the source of truth for needed assets and license status.
- [ ] Placeholder assets are either simple original shapes or approved licensed sources.
- [ ] Every imported asset records source URL, source/author, license, attribution need, date checked, and path.
- [ ] No Paw Patrol names, logos, images, music, character likenesses, fan art, or confusing third-party lookalikes are accepted.
- [ ] Asset needs discovered during each implementation slice are added back to the backlog.

## Blocked by

None - can start immediately.

## TDD notes

Not a code-first slice. If asset manifest code starts here, test duplicate keys, missing source metadata, and preload manifest validation.

## Audio note

A generated theme loop exists outside the repo in four segments. Keep it backlog-only until splicing, source/license notes, and the audio settings module are ready.
