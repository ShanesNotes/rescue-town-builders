# Hearthlight Town — Icon-First Copy Deck

> **Creative Director (Grok) — Phase 1 deliverable**  
> For Willem and every pre-reader. Words are gifts, not instructions.  
> 0–3 words + an icon is the rule for every child-facing surface.  
> No-Fail warmth in every nudge: trying is helping; the town glows because the child came.  
> The hidden soul lives here too: every rescue = a dark window lights warm. Cluckle holds the microcosm. Light from darkness is the core loop made visible and felt.

**Locked contract (with design-system.md):**  
- Bitmap font only for child layer (chunky, rounded, crisp).  
- Buttons = glowing icon-coins (candle-gold rim). Center icon is the word. Tiny label (0–2 words) only if the icon alone would be ambiguous.  
- Mission goals = picture-checklist that stamps ✓ with bounce. No prose goals.  
- HUD = big icon + fat numeral (bitmap) + warm chunky progress.  
- All nudges are tiny, encouraging, never corrective or shaming.  
- Parent layer (gate + settings) may use slightly fuller sentences — still warm, never cold or corporate.  
- Every string below is ready to drop into the scenes, data files, and systems. No new abstractions needed.

**Tone notes (make a dad tear up a little):**  
Gentle, present, grateful. The town is not a task list — it is a friend who was waiting. "You made the lamp remember." "Rivet kept the scrap company until it found its place." "Because you stayed, a window lit."

---

## 1. Title Scene (StartScene)

**Hero display (loading + title)**  
- Big title (display font, glowing): `RESCUE TOWN BUILDERS` (kept as proper name; treat as logo mark, not "label").  
- Loading whisper (very small, warm cream): `lighting the lamps...`  
  → Alternative (even warmer): `the town is dreaming you...`

**Primary action**  
- The one obvious thing: glowing Play coin (`hl.ui.play` or equivalent)  
  Icon: doorway with ▶ or open lantern.  
  Words: **none** (pure icon-coin). Pulse gently.  
  Test target: `start.play`

**No body text.** The world itself is the invitation (Cluckle silhouette with microcosm inside, heroes breathing on cobbles, drifting fireflies, warm bloom).

**Nudges / ambient (if any linger text appears):** none. The first three seconds must feel like opening a picture book at dusk.

---

## 2. Profile Scene (ProfileScene)

**Scene title**  
- `Choose a Helper` (or pure visual header with three small hero silhouettes)  
  2 words max. Icon: small Rivet/Brick/Ember faces row.

**Body instruction (pre-reader safe)**  
- Remove entirely or reduce to one line under title:  
  Current: "Create up to five local profiles. No accounts..."  
  Proposed: `Up to 5 friends. No grown-up logins.` (parent tone)  
  Or for child layer: **(no text — the row of glowing profile coins speaks)**

**Profile row buttons (one per existing profile)**  
- Icon: the helper avatar (Rivet teal satchel, Brick hardhat, Ember water pack) large.  
- Tiny label (1 line): `[name]  ⭐x` (name is child's chosen word; stars are visual coins)  
  Example: `Willem  ⭐⭐`  
- No "• avatar • " cruft. The picture *is* the avatar.

**Add new profile**  
- Coin/button: `+` or tiny blank silhouette icon + `New Friend` (2 words)  
  Or pure `+` coin if the row already shows the pattern.

**Nav coins (bottom, icon-coins per design-system)**  
- Parent Settings: coin icon = cozy key / lantern-gear / scroll. Words: none or `Grown-ups` (parent layer).  
- Back: coin icon = winding path or house-with-arrow. Words: `Back` (1 word) or none.

**Gamepad hint (bottom, smallest bitmap, parent-ish):**  
`D-pad • A • B` (keep minimal symbols; or replace with tiny d-pad icon later)

**No-Fail / encouraging microcopy (on create success path):**  
- After new profile: a tiny toast or sparkle line that fades: `A new light joins the town.` (or no text — just the avatar pops in warm)

---

## 3. Town Map Scene (TownMapScene)

**Scene title**  
- `Hearthlight` or `The Town` (1 word) + small Cluckle silhouette in header, or pure icon row of the three helpers.  
  Current "Rescue Town Map" → retire. The visual map *is* the title.

**Instruction line**  
- Current: `${name}, choose a mission...`  
- Proposed (icon-first): `[profile avatar icon]  Where will you bring light today?` (3 words + icon)  
  Or remove prose: the glowing nodes and character badges at nodes say it.

**Mission nodes (the big buttons become visual map nodes + tiny label)**  
Each node is a building silhouette (dark or already lit-window variant) + helper badge + tiny text:

- Recycling: icon ♻️ or bin + `Rivet` (or `♻️ Rivet`)  
- House: icon brick/house + `Brick`  
- Fire: icon flame/water + `Ember`

Under or beside: stars as fat bitmap numerals or star icons only: `⭐⭐` or empty pips `○○○` + `Ready`

Current long `title\nmapNodeId • starsLabel` → gone. MapNodeId was internal; stars visual.

**Nav coins (icon-first, bottom or corner)**  
- Parent Settings: key/scroll coin (same as profile)  
- Profiles: small face row or single avatar coin → `Friends` (1 word)  
- My Stickers: star or sticker-frame coin → `Stickers` (1 word) or pure joyful star coin

**Gamepad hint:** minimal symbols only, or omit (the coins + map nodes are discoverable).

**Secret hotspots (no text ever):**  
- Cluckle's Dream well: no label. The patient child finds the microcosm glow on 3rd touch. Sticker reveals the poem later.

**No-Fail microcopy (when a node is newly lit after return):**  
A tiny permanent thank-you detail appears on the building (flower box, flag, blanket) — no announcement text. The map simply grew kinder while you weren't looking.

---

## 4. Recycling Run Scene (RecyclingRunScene) — Rivet's Mission

**Scene title (icon + 2 words)**  
- `♻️ Rivet` or `Rivet Sorts`  
  (Retire "Rivet's Recycling Run" — the art and the raccoon say who it is.)

**Progress / goal (pure visual — no numbers for pre-reader if possible)**  
- 10 item slots as a picture strip or pips row at top. Each sorted item stamps a small ✓ or glows warm.  
- Current: `Sort 10 town items. Progress: ${sorted}/10 • Attempts: ${attempts}` → **retire the prose**.  
- Visual only: a row of 10 faint bin silhouettes; filled ones brighten with the item's icon inside or a warm stamp. Fat numeral optional in HUD corner if parent wants count: `3/10` (bitmap, small).

**Central item (the thing to sort)**  
- Large art sprite of the item (banana, bottle, etc.) — this *is* the label.  
- Current text label below: retire or 1-word max if the sprite is ambiguous: e.g. `peel` under banana art (rarely needed).  
- The art + Rivet avatar watching = the full story.

**Bin choices (5 glowing icon-coins or chunky bin sprites + tiny label)**  
Use the 5 distinct bin props (compost leaf, metal can, paper slot, plastic bottle, domed trash).  
Tiny label under each (1 word, bitmap):  
- `Compost` (or leaf icon only)  
- `Paper`  
- `Plastic`  
- `Metal`  
- `Trash` (or `Other`)

Current emoji + full word in buttons → the real bin art replaces the emoji; word is 1-word fallback.

**Hint / nudge area (when wrong — always warm, never "wrong")**  
Current style: `Hint: ${item.label} goes in ${item.category}. Try that bin.`  
Proposed tiny lines (cycle or pick one; appear under the item, fade on next try):

- `Almost! That one likes friends like it.`  
- `Rivet smiles — you're close.`  
- `Try the [leaf / bottle / can] bin again.` (use the bin's icon in text too if needed)  
- `Every try helps the town breathe easier.`

When correct (no text, just the bounce + single paper sparkle + bin hop):

- Optional tiny whisper that vanishes: `Home.` or `Thank you.`

**Back button**  
- Back-to-map coin: path icon + `Map` (1 word) or pure back coin.

**Mission-complete trigger:** when last item sorted, auto to Mission Complete. No "you finished" text in-scene.

**No-Fail framing for this mission (in lore-and-voice later):**  
Rivet sees a friend in every lost scrap. Sorting is "sending each thing home so the town can rest."

---

## 5. House Builder Scene (HouseBuilderScene) — Brick's Mission

**Scene title**  
- `Brick Builds` or `🏠 Brick` (icon + 1–2 words)

**Progress / goal**  
- Visual: three small house silhouettes in a row (or foundation→roof progression strip). Each completed house lights its tiny window.  
- Current count prose → retire. Optional small `2/3` bitmap in corner.

**Blueprint / ghost house (center)**  
- The ghost is the checklist: foundation, walls, roof, door, decoration slots light up as placed.  
- No long "Garden Cottage — next: Foundation". The visual order + current glowing slot = the instruction.  
- Current body: `${house.title} — ${hint or next label}` → reduce to 0–2 words if text needed at all: `Next piece glows.` (rare)

**Part tray (5 choices)**  
- Real prop art for each (foundation stones, walls, roof, door, flower/flag).  
- Tiny 1-word label only if silhouette needs it:  
  - `Base`  
  - `Walls`  
  - `Roof`  
  - `Door`  
  - `Bloom` (for decoration — warmer than "Decoration")

Current `▰ Foundation` etc → real art + 1 word max.

**Nudges (when wrong placement)**  
Current: `Try the ${label} next.`  
Proposed (warm, Brick's patient voice):

- `Brick listens to the ground. That piece waits its turn.`  
- `Almost home. Try the glowing one.`  
- `You're building something that will keep someone warm.`  
- `Take your time. The house is patient too.`

When snap success: chimney smoke ring + sparkles (no text, or tiny `Safe.` that fades).

**Secret:** Hidden Light hotspot (quiet glimmer, 1 touch). No label. When found, the parent's words appear in that one point of light.

**Back:** same map coin.

**Mission soul:** "Brick raises walls that feel like promises kept. Each house finished = a new lit window in the dark."

---

## 6. Fire Fix Scene (FireFixScene) — Ember's Mission

**Scene title**  
- `Ember Cares` or `💧 Ember` (gentle water, not alarm)

**Progress**  
- Visual: picnic blanket or shelter with 5 small flame icons. Each fire that goes out gets a soft ✓ or turns to steam curl + cool teal.  
- Current count → visual only. Optional `3/5` tiny.

**Playfield**  
- Ember avatar (moveable) with water-spray arc as cursor.  
- Fires: distinct shapes (grill, barrel, bush, picnic blanket, lantern) with health shown as shrinking size + color cool-down (orange → teal). No word labels like "Grill fire 2/2". The art + shrinking = health.  
  (Current on-fire labels retire for child view.)

**Controls (icon-coins or arrow glyphs + minimal)**  
- D-pad arrows: pure ←↑↓→ glyphs (or world icons: paw prints / wind).  
- Spray action: big coin with water-drop + hose icon. Words: none or `Spray` (1 word).  
- Current "Spray Water" button → water coin.

**Nudges / lastMessage area (always kind, Ember's gentle voice)**  
Current examples replaced with:

- Start / move: `Ember is ready. Get close, then spray.`  
- Miss: `Water missed. Move a little closer — Ember waits with you.`  
- Hit (still burning): `The fire is resting. One more gentle spray.`  
- Out: `Safe again. The picnic can laugh now.` (or no text — steam + happy tail wag)  
- Helper assist: `A friend helped too. Keep going.` (never "drone")

All lines short, one breath, warm. "Great helping!" becomes visual (tail wag + sparkle) + optional `Thank you.` whisper.

**Secret Friend hotspot:** tiny glimmer near hydrant (3 touches). No text. A shy creature appears for the patient child.

**Back coin.**

**Mission soul:** "Fires are visitors who stayed too long. Ember shows them the way to rest with cool kindness. The picnic glows again."

---

## 7. Mission Complete Scene (MissionCompleteScene)

**Scene title**  
- `A Window Glows` or `⭐ Lit!` (1–2 words + star)  
  Retire "Mission Complete!" — the light *is* the completion.

**The story (1–2 lines max, icon + warm sentence)**  
Current long summary →  

`[Rivet / Brick / Ember icon]  Because you helped, the [recycle center / house / picnic] lights up.`

Then: the number of stars as big chunky stars row (visual, no "with 2 stars").

Sticker reveal: the new sticker pops with its icon + short title (phase 4 names). One soft bounce.

**Celebration messages (keep short, always full joy — No-Fail)**  
- 1 star: `You did it!` (or warmer: `The town feels you.`)  
- 2 stars: `Great helping!` (or `Light spreads because of you.`)  
- 3 stars: `Super helper!` (or `Cluckle dreamed this light for you.`)

Bigger party for more stars (more confetti, more sparkles), but the base message never diminishes the 1-star child.

**Total stars line:** visual only or `Your light so far: [big number] ⭐` (parent layer ok).

**Action:** big warm "Back to Map" coin or path icon + `Town` (1 word). No other choices.

**Ambient:** confetti in palette colors, one or two lit-window sparkles, gentle camera feel.

---

## 8. Sticker Book Scene (StickerBookScene)

**Scene title (grid mode)**  
- `[Name]'s Book` or `Stickers` + small Cluckle or star icon.  
  Current long "Found X of Y" → a visual row of silhouette frames vs filled glowing frames at top (count by how many warm).

**Grid stickers**  
- Unlocked: big icon (the sticker art) + 1–3 word title below (phase 4 short joyful names). Tap opens reading.  
- Locked: soft silhouette or question-shaped warm shadow + tiny `Waiting` or `A secret for you` (2–3 words). Never "Keep playing to find me!" (that can feel like a chore). The silhouette itself invites return.

**Reading page (one sticker)**  
- Large icon at top.  
- Title (short).  
- childPoem: 2–4 short lines, read-aloud rhythm, wonder voice. Parent taps to re-highlight lines slowly if wanted.  
- parentNote: one warm sentence for the grown-up (can be slightly longer).  
- No "poem" label — the words *are* the gift.

**Actions (coins)**  
- `← Book` (back to grid)  
- `Town` (back to map)

**No-Fail:** every sticker is findable. Locked ones are "sleeping" not "locked out." The book fills with the child's own light.

---

## 9. Parent Settings Gate + Settings (ParentSettingsGateScene / ParentSettingsScene)

**Gate (child-safe wall, parent-only passage)**  
- Title: `Grown-up Gate` or `Parent Settings` (small key icon)  
- Instruction: `Grown-ups: hold the big coin 3 seconds.` (full sentence ok — this is the parent layer)  
- Hold button: big coin, label `Hold` or `Hold to enter` (tiny).  
- Status whispers: `Holding...` / `Let go to cancel.` / `Cancelled. Ready when you are.`

**Inside Settings (fuller words allowed — calm, local, reassuring)**  
- Header: `Parent Settings` + profile name.

Current dense status line → break into calm cards or simple lines:  
`Difficulty: Helper` (tap cycles: Helper → Easy → Normal — each with a short parent explanation if hovered, but child never sees)

Audio:  
- `Music` + big - / + coins or slider visual. Current "+25%" buttons → friendlier `Louder` / `Softer` or just volume pips.  
- `Sound` same.  
- `Mute all` toggle coin: `Quiet` / `Sound on` (1–2 words).

Other:  
- `Quiet defaults` → `Calm night` or `Soft sounds`  
- `Reset local save` → `Start fresh` (with confirm: `All lights return to dark. The town will wait for you again.` — warm, never scary)

- `Done` coin: path or check icon + `Back` (or pure check coin)

**Tone for parents:** "Everything stays on this device. No accounts, no sharing, no rush. Change anything anytime. The child only ever feels the warmth."

---

## 10. Shared / Cross-Scene Microcopy & Nudges

**Confirm exit dialog (every mission)**  
Current: "Keep playing, or go back to the map?" + "Your sticker isn't saved until you finish — that's okay!"  
Proposed (still gentle, No-Fail, pre-reader + parent):  

- Main: `Keep helping the town, or go back?`  
- Sub: `Your light is safe. Come back anytime.`  
- Buttons:  
  - Keep Playing coin (warm teal) — no text or `Stay`  
  - To Map coin — `Map`

Default focus/position on Keep (the "no accidental leave" rule remains).

**General No-Fail nudges (use in hints, toasts, secret reveals)**  
- `You're close. The town feels it.`  
- `Every try is a little light.`  
- `Rivet / Brick / Ember is glad you stayed.`  
- `Cluckle dreamed someone gentle would come.`  
- `Try again — the window is almost awake.`  
- On any finish, even low stars: `The town is brighter because you came.`

**Mission intro panels (in missions.ts data — icon + short)**  
Current wordy →  

- Recycling: icon ♻️ , `Sort treasures with Rivet` (or `Friends find home`)  
- House: icon 🏠 , `Build with Brick`  
- Fire: icon 💧 , `Care with Ember`

Text under: 1 line max, or none (the art + character will show the "why").

**Stars & progress anywhere**  
- Always visual first: star icons, pips, lit-window count on town map.  
- Numerals only as fat friendly bitmap when count matters (e.g. 3/10 items). Never "attempts" shown to child.

---

## 11. Data & Implementation Notes (for the team)

These strings live in data files and systems. Update them to match the deck; retire the old wordy ones from child surfaces.

**Files that will carry the new copy (strings only — no mechanics change):**
- `src/game/data/recyclingItems.ts` — keep `label` for internal/hint logic if needed, but shorten or icon-only for visible. `categoryLabels` become 1-word or retire in favor of bin art.
- `src/game/data/houseBlueprints.ts` + `systems/HouseBuilder.ts` (housePartTray) — shorten `label`s to 1 word (`Base`, `Walls`, `Roof`, `Door`, `Bloom`).
- `src/game/data/picnicFires.ts` — fire `label`s can stay for debug or become optional; visible UI uses art + health pips only.
- `src/game/data/missions.ts` — update `title` (short: "Rivet", "Brick", "Ember" or "Rivet's Run") and the `introPanels` icon + 1–3 word titles.
- `src/game/data/stickers.ts` — phase 4 will propose joyful short `title`, warm `childPoem`, loving `parentNote`.
- `src/game/systems/RecyclingRun.ts`, `HouseBuilder.ts`, `FireFix.ts`, `Celebration.ts` — replace hard-coded hint / lastMessage / CELEBRATION_MESSAGES strings with the warm versions above.
- `src/game/systems/confirmMissionExit.ts` — the two lines + two button labels.
- Scene files (for titles, bodies, remaining labels) — replace calls to `addTitle`/`addBody` and `label:` with the 0–3 word versions. Many bodies disappear entirely once icon UI and visual progress exist.
- `src/game/ui/SceneText.ts` — may stay as utility; the *content* passed to it changes.

**Icon-coin mapping (reference for Codex art prompts — see art-prompts.md extension):**
- Play: doorway / lantern + ▶
- Recycle / Rivet action: bin with arrows or leaf
- Build / Brick: stacked bricks or tiny house
- Fire / Ember: gentle flame + water drop or hose
- Stickers: warm star with tiny Cluckle or leaf inside
- Settings / parent: key or scroll or lantern-gear
- Back / map: winding path or house + arrow
- 9-slice panel, progress, star, sticker-frame, checkmark, sparkle etc. as specified in design-system.

**When the copy changes land:**
- Child never sees a sentence on a button.
- Every mistake still ends in warmth and invitation to continue.
- Progress is always visible as light spreading (lit windows on map, stamps on checklists, cooled fires, filled sticker frames).
- The Language of Creation is present even in the smallest string: "light", "dream", "home", "friend", "because you", "the town feels".

---

**End of Phase 1 copy deck.**  
This is the minimum viable warmth. Every word was chosen so a small hand can hold it and feel held back.

Next: Phase 2 extends the art-prompts bible with the exact backdrops, props, UI kit, and FX needed to make these icon-first surfaces sing in the locked Hearthlight dusk palette.

All for the child who leans in. All original. All light from darkness.