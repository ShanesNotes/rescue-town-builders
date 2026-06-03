# Hidden secrets — woven from the Language of Creation

> *For Willem. The kind of thing you only find when you stop rushing.*

Rescue Town Builders hides three secrets. None are required, scored, or
announced. They reward the child who lingers — who touches the same quiet corner
again, who looks where the mission never points. They are the game's small
embodiment of the symbolic patterns in `/home/ark/language-of-creation`
(Pageau / Genesis cosmic grammar): a symbol is a *fact that embodies a higher
truth*, and meaning is *lowered into matter* so a small hand can raise it back up.

## The shared shape

Every secret moves through the same three beats — the creation arc in miniature:

1. **Hidden** — present but unseen, in the dark at the edge of attention.
2. **Drawn into the light** — repeated, patient attention calls it forward.
3. **Revealed as meaning** — it turns out to *mean* something, and it knows the child's name.

## The three secrets

| Secret | Touches | Pattern from the Language of Creation |
|---|---|---|
| **Secret Friend** | 3 | *Naming the animals / hosting the angel* — a hidden creature becomes a friend to the one who keeps coming back. Relationship is built by returning, not by winning. |
| **Hidden Light** | 1 | *Light from darkness / lowering meaning into matter* — a parent's own words, set into a single point of light, waiting in a quiet corner to be found. |
| **Cluckle's Dream** | 3 | *Microcosm / the symbol that re-presents the whole* — Cluckle dreams a tiny town inside the town: the whole world made small enough for a child to hold. |

## Implementation

- `src/game/systems/Secrets.ts` — pure logic. `touch(id)` returns a `SecretReveal`
  the first time touches cross the threshold, `null` otherwise (already found, or
  not yet). Touching is **never wrong** (No-Fail Rule).
- Reveals carry a `sticker` id. Scenes persist it through the existing sticker
  system (`MissionResult.stickersUnlocked`) — no save-schema change.
- Reveals are personalised by the child's profile name.

## Two knobs for Dad

1. **Player name** — auto-fills from the active profile. Greets the child by name.
2. **The Hidden Light message** — left to a gentle default on purpose. This is the
   heart of the whole thing: *your* words to Willem, lowered into the light.
   Set `hiddenLightMessage` when you're ready and they will appear, in that one
   point of light, exactly as you wrote them.
