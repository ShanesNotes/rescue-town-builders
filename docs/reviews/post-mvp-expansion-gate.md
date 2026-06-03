# Post-MVP expansion gate

Date: 2026-06-03

## Verdict

**Conditional pass for MVP stabilization; hold roadmap expansion.**

The prototype has enough framework and three playable missions to invite a small child/parent play-test, but it should not add roadmap missions yet. The best next route is to stabilize the first three missions, collect play-test notes, and prepare asset/audio intake.

## Evidence already in the repo

- Three real MVP missions route from the Town Map Hub and persist stars/stickers locally.
- Mission logic is covered by unit tests for save/profile, registry, input intent, star scoring, map projection, Recycling Run, House Builder, Fire Fix, accessibility rules, audio setting semantics, celebration plans, and scene transition constants.
- Placeholder assets are runtime shapes/text/emoji only; no third-party art or music has been imported.
- Gamepad intent mapping exists for confirm, back, action, hint, and D-pad movement.
- Static deployment is configured as a manual GitHub Pages workflow, not automatically published.

## Gate checks

| Gate | Status | Evidence | Required before new missions |
| ---- | ------ | -------- | ---------------------------- |
| Architecture | Pass | Pure mission modules and shared Save/Input/Scoring/Registry seams are testable. `SceneNavigation` now centralizes route keys, mission-to-scene mapping, parent-settings returns, map returns, and mission completion payloads. | Keep new missions behind current Mission Definition + pure mission module + scene route pattern; expand `SceneNavigation` only when new route payload conventions arrive. |
| Play-test | Open | No direct child/parent play-test evidence is recorded yet. | Run `docs/playtesting/mvp-playtest-guide.md` and record observations. |
| Asset state | Open | `docs/assets/ASSET_BACKLOG.md` tracks placeholders; theme loop remains four external segments. | Curate placeholder/production packs by category and record source/license notes before import. |
| Fun | Open | Missions are playable, generous, and no-fail by design, but repeat-play enjoyment is unverified. | Confirm the child understands each goal, asks to replay at least one mission, and does not get stuck or shamed. |
| Accessibility/controls | Pass with manual smoke pending | Large target rule, no harsh failure language checklist, helper/no-fail modules, keyboard/touch/gamepad intent mapping. | Complete mobile landscape and physical gamepad smoke checks. |
| Deployment | Pass for setup; activation deferred | Manual workflow exists; local and Pages-base builds pass. | Only dispatch/activate Pages when public deployment is intentionally approved. |

## Architecture deepening opportunities

1. **Scene Navigation**
   - **Files**: `src/game/systems/SceneNavigation.ts`, `src/game/scenes/*`, `src/game/systems/SceneTransitions.ts`.
   - **Problem**: Direct scene starts were readable for the MVP but would scatter route and payload conventions as more missions arrive.
   - **Solution**: Added a small Scene Navigation module that owns route keys, MVP scene flow, mission-to-scene mapping, parent-settings returns, map returns, and mission completion payloads. Scenes now call this seam instead of `scene.start(...)` directly.
   - **Benefits**: Better locality for route bugs and more leverage for future smoke tests without a heavy router abstraction.

2. **Mission Scene Shell**
   - **Files**: `src/game/scenes/RecyclingRunScene.ts`, `HouseBuilderScene.ts`, `FireFixScene.ts`, `src/game/ui/*`.
   - **Problem**: Mission scenes repeat title/body/control/back-button setup. The repetition is still readable, but could grow shallow with more missions.
   - **Solution**: After play-test feedback, extract only the repeated mission chrome that survives the deletion test: title placement, back-to-map affordance, safe copy, and input binding helpers.
   - **Benefits**: More leverage for accessibility polish while keeping mission-specific play loops local.

3. **Asset Catalog + License Ledger**
   - **Files**: `src/game/systems/AssetCatalog.ts`, `docs/assets/ASSET_BACKLOG.md`, future `src/game/assets/*`.
   - **Problem**: The asset catalog exists as a policy seam, but no production assets are imported yet. Importing art/audio without ledger discipline would create IP and style drift.
   - **Solution**: Treat every imported asset as an asset-catalog entry plus a license-ledger row. Do not import the four music segments until splicing and source notes are ready.
   - **Benefits**: Strong locality for IP safety and easier replacement passes.

4. **Mission Runtime Result Contract**
   - **Files**: `src/game/systems/*`, `src/game/types.ts`, `src/game/scenes/MissionCompleteScene.ts`.
   - **Problem**: Result creation is already pure and tested, but save/update/celebration flow will become more important as stickers and town decorations expand.
   - **Solution**: Keep result creation mission-local for now. Deepen a Reward/Progress module only when the Sticker Book or Town Decoration features arrive.
   - **Benefits**: Avoids speculative abstraction while preserving a clear future seam.

## Human-friendly next route

1. Run one 15-20 minute play-test using `docs/playtesting/mvp-playtest-guide.md`.
2. Record whether the child understands each mission without detailed adult explanation.
3. Use the gamepad for at least one mission because gamepad controls are a known preference.
4. Keep music and art minimal until the asset intake checklist is complete.
5. Open the next issue as **MVP stabilization**, not **new mission expansion**. Created: [#9](https://github.com/ShanesNotes/rescue-town-builders/issues/9).

## Expansion exit criteria

New roadmap missions are allowed only after all are true:

- `npm test`, `npm run typecheck`, and `npm run build` pass.
- Mobile landscape smoke checklist has no blocking issue.
- Physical gamepad smoke check passes for map navigation and at least two missions.
- Child/parent play-test notes show no repeated confusion or frustration blocker.
- Asset backlog has current placeholder, production, and music-splice status.
- Any architecture watch item needed by the next mission has either been fixed or explicitly deferred; current route-key and mission route governance lives in `SceneNavigation`.
