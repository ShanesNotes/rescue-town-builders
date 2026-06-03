Yes. I’d shape this as an **original, web-first 2D mini-game collection** inspired by your son’s mechanics, not a Paw Patrol clone. The official LeapFrog/PAW Patrol toy is a good benchmark: it is aimed at ages 4–6, has 12 missions, replayable quick challenges, profiles, treats/stars, and learning-skill goals like logic, problem-solving, spatial reasoning, and visual discrimination. ([LeapFrog Store][1]) But PAW Patrol names, characters, logos, and related titles are trademarked/copyrighted, so the build spec below uses original characters and avoids official names/art/audio. ([LeapFrog Store][1])

## Recommended direction

Build **“Rescue Town Builders”**: a browser-based 2D mission game where a child chooses a helper character, plays a short mission, earns stars, unlocks silly story scenes, and gradually repairs a cheerful town.

For your setup, I’d choose **Phaser + TypeScript + Vite** over Godot for the first version. Phaser is a web-focused HTML5 game framework with Canvas/WebGL rendering, JavaScript/TypeScript support, npm setup, and official templates. ([GitHub][2]) Godot is excellent, but its web export has more platform caveats: Godot web builds require WebAssembly/WebGL 2, C# Godot 4 projects currently cannot export to web, and browser audio/fullscreen/persistence have extra limitations. ([Godot Engine documentation][3])

For MVP assets, use placeholder art from **Kenney**, whose asset-page game assets are CC0/public-domain licensed and usable even commercially, with attribution optional. ([Kenney][4]) For sound effects, Pixabay is usable for royalty-free sound effects, but you should still avoid fan art, logos, branded characters, or recognizable third-party IP. ([Pixabay][5])

---

# PRD v0.1 — Rescue Town Builders

## 1. Product summary

**Working title:** Rescue Town Builders
**Genre:** Kid-friendly 2D mini-game anthology
**Target player:** Ages 4–7, with parent nearby
**Target platform:** Browser first: desktop, tablet, Chromebook, mobile landscape
**Session length:** 5–12 minutes
**Mission length:** 60–180 seconds
**Game mode:** Single-player
**Backend:** None for MVP; use local save only
**Primary goal:** Let a young child choose helper characters and complete simple missions based on building, recycling, rescuing animals, firefighting, biking, boating, baking, and silly dream logic.

## 2. Core design principles

The game should feel like a playable toy rather than a hard video game. Every mission should have simple inputs, obvious feedback, generous timing, and no true failure state. The child can get fewer stars, but they should always finish the mission.

The game should also preserve your son’s original “wouldn’t it be better if…” energy. The missions should be playful, literal, and slightly surreal: a mayor dreaming about chicken statues, a chicken dreaming the inverse dream, goo everywhere, bears escaping the zoo, frogs needing sky rescue, and recyclables becoming gadgets.

## 3. IP-safe character translation

Use your son’s mechanics, but rename and redesign everything.

| Original child idea                                             | Original-game version                                                                  |
| --------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Rubble building houses                                          | **Brick the Builder Pup** builds houses from puzzle pieces                             |
| Chase catches slowing speedsters with grappling hook and lights | **Dash the Safety Pup** slows runaway scooters/cars with signal lights and a soft hook |
| Ryder builds things from Rocky’s recyclables                    | **Reed the Inventor Kid** builds gadgets from recycled parts                           |
| Rocky empties trash and recycles                                | **Rivet the Recycle Pup** sorts trash, compost, metal, paper, and plastic              |
| Skye flies to save a frog                                       | **Wings the Flying Pup** glides through rings to rescue a lost frog                    |
| Liberty rides scooter and catches zoo bears                     | **Scoot the City Pup** rides a scooter and guides friendly bears back to the zoo       |
| Marshall puts out fires                                         | **Ember the Fire Pup** sprays water at cartoon fires                                   |
| Alex explores neighborhood with bicycle                         | **Milo the Bike Kid** explores streets, finds neighbors, and collects map stickers     |
| Mayor Goodway dreams of statues of Chicoletta                   | **Mayor Merry** dreams of statues of her chicken, **Cluckle**                          |
| Chicoletta dreams inverse/opposite of Mayor Goodway             | **Cluckle the Chicken** dreams of tiny mayors instead of chicken statues               |
| Humdinger squirts goo over city                                 | **Mayor Grumble** makes a goo mess with silly goo cannons                              |
| Captain Turbot explores treasure boxes with boat                | **Captain Coral** sails and opens floating treasure boxes                              |
| Alex’s dad bakery guy bakes bread                               | **Baker Benny** bakes bread for townspeople                                            |
| Bad girl mischief invents asteroid blaster                      | **Nova Noodle** builds goofy inventions to blast incoming asteroids with foam stars    |

## 4. Game structure

The game has a **Town Map Hub**. Each building or area opens a mini-game.

The initial MVP should not build all 14 missions. Build a reusable mission framework and ship 3 polished missions first.

**MVP mission set:**

1. **Rivet’s Recycling Run** — sorting trash and recyclables.
2. **Brick’s House Builder** — drag or select house parts in the right order.
3. **Ember’s Fire Fix** — move, aim, spray water, rescue a cat or toy.

After that, add the rest as content packs.

## 5. Core loop

Player opens the game. They choose or create a local profile. They land on the Rescue Town map. They choose a mission. A short animated intro shows the problem. They play the mini-game. They earn 1–3 stars plus a sticker. The town visually improves. The player returns to the map and can replay or choose another mission.

**Reward loop:**

Mission completed → stars earned → sticker unlocked → town decoration appears → optional “silly celebration” animation.

## 6. Controls

Support three input styles from day one:

| Input type | Required support                          |
| ---------- | ----------------------------------------- |
| Keyboard   | Arrow keys/WASD, Space/Enter              |
| Touch      | Large buttons, drag-and-drop, tap targets |
| Gamepad    | D-pad/left stick, A button, B/back button |

Every mission should have a **one-handed mode** where the child can succeed with only directional input and one action button.

## 7. Accessibility and kid-safety requirements

No accounts, chat, ads, purchases, external links in child-facing UI, or online multiplayer. Parent-only settings should be hidden behind a “hold for 3 seconds” button.

Accessibility requirements:

| Area         | Requirement                                               |
| ------------ | --------------------------------------------------------- |
| Reading      | All instructions must be icon-first and optionally voiced |
| Timing       | No hard fail timers in MVP                                |
| Motor skills | Large buttons and forgiving collision                     |
| Audio        | Music and SFX volume sliders                              |
| Visuals      | Avoid tiny UI, low contrast, flashing effects             |
| Difficulty   | Adaptive help after repeated misses                       |
| Failure      | Use “try again” language, not “you lost”                  |

## 8. Mission design specs

### Mission 1 — Rivet’s Recycling Run

**Fantasy:** Clean up the town by sorting items into the right bins.
**Skill:** Categorization, visual discrimination.
**Core mechanic:** Items appear on a conveyor or sidewalk. Player sends each item to trash, paper, plastic, metal, or compost.

**Gameplay:**

The player stands near bins. An item appears. The player selects the matching bin. Correct choices make the item bounce happily into the bin. Incorrect choices gently wobble and offer a hint.

**Difficulty levels:**

| Level  | Behavior                                     |
| ------ | -------------------------------------------- |
| Easy   | 2 bins, slow item pace, obvious items        |
| Medium | 3 bins, mixed items                          |
| Hard   | 4–5 bins, faster pace, similar-looking items |

**Completion:** Sort 10 items.
**Stars:** 1 star for finishing, 2 stars for 70% correct, 3 stars for 90% correct.
**No-fail rule:** Incorrect items reappear with a hint.

**Reusable systems created:** item spawning, category matching, star scoring, hint bubbles.

---

### Mission 2 — Brick’s House Builder

**Fantasy:** Build little houses for townspeople.
**Skill:** Sequencing, spatial matching.
**Core mechanic:** Choose foundation, walls, roof, door, and decoration in order.

**Gameplay:**

The house outline appears as a ghost shape. Player picks parts from a tray. Correct parts snap into place. The final house gets a silly animation, such as windows blinking or flowers popping up.

**Difficulty levels:**

| Level  | Behavior                         |
| ------ | -------------------------------- |
| Easy   | Highlight the next correct piece |
| Medium | Show shape silhouette only       |
| Hard   | Add color/pattern matching       |

**Completion:** Build 3 houses.
**Stars:** Based on hints used and number of correct first attempts.
**No-fail rule:** Wrong pieces bounce back.

**Reusable systems created:** drag/drop, snap zones, construction sequencing.

---

### Mission 3 — Ember’s Fire Fix

**Fantasy:** Put out small cartoon fires and save the town picnic.
**Skill:** Directional control, timing, prioritization.
**Core mechanic:** Move firefighter pup, aim hose, spray water.

**Gameplay:**

Small animated fires appear on safe objects like grills, barrels, or bushes. Player moves near the fire and sprays. Fires shrink as water hits them. Friendly townspeople cheer.

**Difficulty levels:**

| Level  | Behavior                           |
| ------ | ---------------------------------- |
| Easy   | Stationary fires, unlimited water  |
| Medium | Water meter refills at hydrant     |
| Hard   | Fires spread slowly unless sprayed |

**Completion:** Put out 5 fires.
**Stars:** Based on total time and picnic items saved.
**No-fail rule:** If a fire gets too big, an helper drone appears and assists.

**Reusable systems created:** movement, projectile/spray collision, interactable hazards, refill meter.

---

## 9. Full mission roadmap

| Mission               | Character     |                                     Mechanic | Implementation complexity |
| --------------------- | ------------- | -------------------------------------------: | ------------------------: |
| Recycling Run         | Rivet         |                    Sorting objects into bins |                       Low |
| House Builder         | Brick         |                       Drag/drop construction |                       Low |
| Fire Fix              | Ember         |                               Move/aim/spray |                    Medium |
| Frog Flight           | Wings         |            Flying through rings, rescue frog |                    Medium |
| Scooter Bear Roundup  | Scoot         |              Scooter driving, gentle herding |                    Medium |
| Safety Lights Chase   | Dash          | Traffic-light timing and soft grappling hook |                    Medium |
| Recycled Inventions   | Reed          |                   Combine parts into gadgets |                    Medium |
| Bike Explorer         | Milo          |                 Neighborhood map exploration |                    Medium |
| Goo Cleanup           | Mayor Grumble |                Avoid/spray/clean goo puddles |                    Medium |
| Dream Statues         | Mayor Merry   |            Whimsical statue placement puzzle |                       Low |
| Chicken Inverse Dream | Cluckle       |             Opposite/inverse matching puzzle |                    Medium |
| Treasure Boat         | Captain Coral |           Boat movement, open treasure boxes |                    Medium |
| Bakery Bread Rush     | Baker Benny   |               Recipe sequencing and delivery |                    Medium |
| Asteroid Blaster      | Nova Noodle   |                  Aim foam stars at asteroids |               Medium–High |

## 10. UI spec

### Screens

| Screen           | Purpose                                |
| ---------------- | -------------------------------------- |
| Loading screen   | Preload assets, show friendly mascot   |
| Start screen     | Big “Play” button, settings gear       |
| Profile screen   | Up to 5 local profiles, icon-based     |
| Town map         | Mission selection hub                  |
| Mission intro    | 1–3 panels explaining the problem      |
| Mission gameplay | Mini-game-specific UI                  |
| Mission complete | Stars, sticker, celebration            |
| Sticker book     | View unlocked rewards                  |
| Parent settings  | Audio, difficulty, reset save, credits |

The profile idea mirrors the toy’s family-friendly local-profile pattern; the official listing says the toy supports up to five player profiles. ([LeapFrog Store][1])

### HUD requirements

Every mission HUD should include:

| UI element    | Notes                                     |
| ------------- | ----------------------------------------- |
| Goal icon     | Example: “Sort 10 items”                  |
| Progress bar  | Large, visual, not text-heavy             |
| Action button | Touch-friendly                            |
| Pause button  | Top-right, hold-to-confirm on touch       |
| Hint button   | Optional; appears after delay             |
| Star preview  | Shows likely star rating without pressure |

## 11. Art direction

**Style:** Rounded, flat, colorful, sticker-book cartoon style.
**Camera:** 2D side-view or top-down depending on mission.
**Characters:** Original animal/kid helpers with simple silhouettes.
**Animation:** 4–8 frame loops for walking, idle, success, and “oops.”
**Environment:** Modular town tiles: road, park, beach, bakery, fire station, recycling center, construction lot, harbor, dream plaza.

### MVP asset list

| Asset category | Required MVP assets                                             |
| -------------- | --------------------------------------------------------------- |
| Characters     | Rivet, Brick, Ember, generic townspeople                        |
| Tiles          | grass, road, sidewalk, house lot, park, picnic area             |
| Props          | bins, trash items, house parts, hydrant, fires, stars, stickers |
| UI             | buttons, panels, progress bar, profile icons                    |
| FX             | sparkle, water spray, smoke puff, correct/incorrect feedback    |
| Audio          | click, pop, sparkle, spray, cheering, short music loop          |

## 12. Audio spec

Use short, non-annoying loops. The music should be cheerful but not hyperactive. Every action should have lightweight feedback.

| Event            | Sound                           |
| ---------------- | ------------------------------- |
| Button press     | Soft pop                        |
| Correct action   | Sparkle/chime                   |
| Incorrect action | Gentle boop, never harsh buzzer |
| Star earned      | Rising chime                    |
| Mission complete | 3–5 second fanfare              |
| Water spray      | Loop while button held          |
| Fire out         | Steam puff                      |
| Item sorted      | Bin thunk/pop                   |

No voice acting is required for MVP. Add optional generated or recorded parent voice later.

## 13. Technical architecture

### Recommended stack

| Layer        | Choice                                                    |
| ------------ | --------------------------------------------------------- |
| Game engine  | Phaser + TypeScript                                       |
| App bundler  | Vite                                                      |
| Save data    | browser localStorage                                      |
| Rendering    | Phaser Canvas/WebGL auto mode                             |
| Physics      | Phaser Arcade Physics where useful                        |
| Tests        | Vitest for pure logic; Playwright smoke tests later       |
| Art pipeline | PNG spritesheets + JSON atlas                             |
| Audio        | OGG/MP3 fallback                                          |
| Deployment   | Static hosting: Netlify, Vercel, GitHub Pages, or itch.io |

Phaser’s own tutorial uses a config with preload/create/update scenes and recommends `Phaser.AUTO`, which tries WebGL and falls back to Canvas when needed. ([Phaser][6])

### No backend for MVP

Do not build accounts, cloud saves, analytics, payments, leaderboards, or multiplayer. Those add risk and complexity without helping the first playable version.

Use this save model:

```ts
type SaveData = {
  version: number;
  profiles: PlayerProfile[];
  selectedProfileId: string | null;
};

type PlayerProfile = {
  id: string;
  name: string;
  avatarId: string;
  createdAt: string;
  settings: {
    difficulty: "easy" | "normal" | "helper";
    musicVolume: number;
    sfxVolume: number;
  };
  progress: {
    missions: Record<string, MissionProgress>;
    stickers: string[];
    totalStars: number;
  };
};

type MissionProgress = {
  completed: boolean;
  bestStars: 0 | 1 | 2 | 3;
  attempts: number;
  lastPlayedAt: string;
};
```

## 14. Code architecture for Codex

Use a simple folder structure that encourages small issues:

```txt
src/
  main.ts
  game/
    GameConfig.ts
    scenes/
      BootScene.ts
      PreloadScene.ts
      StartScene.ts
      ProfileScene.ts
      TownMapScene.ts
      MissionIntroScene.ts
      MissionCompleteScene.ts
      missions/
        RecyclingRunScene.ts
        HouseBuilderScene.ts
        FireFixScene.ts
    systems/
      SaveSystem.ts
      AudioSystem.ts
      InputSystem.ts
      MissionRegistry.ts
      StarScoring.ts
      HintSystem.ts
    ui/
      Button.ts
      ProgressBar.ts
      StarDisplay.ts
      Modal.ts
    data/
      missions.ts
      items.ts
      stickers.ts
assets/
  art/
  audio/
  atlases/
  fonts/
tests/
  StarScoring.test.ts
  SaveSystem.test.ts
  MissionRegistry.test.ts
```

## 15. Mission framework contract

Codex should build missions against a shared interface:

```ts
export type MissionId =
  | "recycling-run"
  | "house-builder"
  | "fire-fix";

export type MissionResult = {
  missionId: MissionId;
  completed: boolean;
  stars: 1 | 2 | 3;
  score: number;
  stickersUnlocked: string[];
  stats: Record<string, number | string | boolean>;
};

export interface MissionDefinition {
  id: MissionId;
  title: string;
  characterId: string;
  mapNodeId: string;
  introPanels: IntroPanel[];
  minAge: number;
  estimatedSeconds: number;
}

export interface MissionScene {
  startMission(): void;
  pauseMission(): void;
  resumeMission(): void;
  completeMission(result: MissionResult): void;
}
```

## 16. MVP acceptance criteria

The MVP is done when:

1. A child can open the game in a browser and press Play.
2. A local profile can be created and selected.
3. The town map shows at least 3 missions.
4. Recycling Run, House Builder, and Fire Fix are playable from start to completion.
5. Each mission awards 1–3 stars.
6. Stars persist after refresh.
7. The sticker book shows at least 3 unlockable stickers.
8. Game works with keyboard and touch.
9. Sound can be muted.
10. No Paw Patrol names, logos, images, music, or character likenesses are present.

## 17. Implementation slices for Codex

### Slice 0 — Project foundation

**Goal:** Running Phaser app with empty scenes.

**Issues:**

| Issue               | Deliverable                                  |
| ------------------- | -------------------------------------------- |
| Initialize app      | Vite + TypeScript + Phaser project           |
| Add scene flow      | Boot → Preload → Start → TownMap             |
| Add asset manifest  | Central asset keys and preload list          |
| Add basic UI button | Reusable large button component              |
| Add save system     | localStorage save/load/reset with versioning |

**Acceptance test:** Refreshing the browser keeps a test profile.

---

### Slice 1 — Profile and town map

**Goal:** Child can select a profile and mission.

**Issues:**

| Issue             | Deliverable                                    |
| ----------------- | ---------------------------------------------- |
| Profile screen    | Create/select up to 5 profiles                 |
| Town map scene    | Static map with 3 clickable mission nodes      |
| Mission registry  | Data-driven list of missions                   |
| Navigation system | Start → Profile → Map → Mission → Result → Map |
| Parent settings   | Volume, reset save, difficulty                 |

**Acceptance test:** Player can complete a fake mission and see stars saved on the map.

---

### Slice 2 — Recycling Run

**Goal:** First real mini-game.

**Issues:**

| Issue             | Deliverable                     |
| ----------------- | ------------------------------- |
| Sorting item data | Item category definitions       |
| Bin UI            | Large labeled/icon bins         |
| Item spawner      | Random item sequence            |
| Sort interaction  | Keyboard/touch selection        |
| Scoring           | Accuracy-based stars            |
| Hints             | Gentle correction after mistake |

**Acceptance test:** Sort 10 items, get stars, save result.

---

### Slice 3 — House Builder

**Goal:** Construction sequence mini-game.

**Issues:**

| Issue                | Deliverable                    |
| -------------------- | ------------------------------ |
| House blueprint data | Part order definitions         |
| Part tray UI         | Selectable or draggable pieces |
| Snap zones           | Correct piece placement        |
| Build animation      | House completion celebration   |
| Scoring              | Hints/attempts to stars        |

**Acceptance test:** Build 3 houses and unlock a sticker.

---

### Slice 4 — Fire Fix

**Goal:** Movement and action mission.

**Issues:**

| Issue            | Deliverable                        |
| ---------------- | ---------------------------------- |
| Player movement  | Keyboard/touch/gamepad movement    |
| Fire objects     | Fires with health/shrink animation |
| Hose spray       | Directional water collision        |
| Refill hydrant   | Optional water meter               |
| Completion logic | Put out all fires                  |
| Star scoring     | Time and remaining picnic items    |

**Acceptance test:** Player can move, spray, extinguish fires, and finish mission.

---

### Slice 5 — Polish pass

**Goal:** Make it feel like a toy.

**Issues:**

| Issue              | Deliverable                               |
| ------------------ | ----------------------------------------- |
| Audio system       | Music/SFX, mute, volume                   |
| Celebration FX     | Stars, stickers, confetti                 |
| Scene transitions  | Soft wipes/fades                          |
| Accessibility pass | Bigger buttons, no hard fail, helper mode |
| Mobile layout      | Landscape touch controls                  |
| Build/deploy       | Static hosted playable build              |

## 18. Backlog after MVP

After the first 3 missions are solid, add missions in this order:

1. **Frog Flight** — introduces flying movement.
2. **Scooter Bear Roundup** — reuses movement plus herding.
3. **Goo Cleanup** — reuses spray mechanics from Fire Fix.
4. **Recycled Inventions** — expands sorting into crafting.
5. **Bakery Bread Rush** — sequencing and delivery.
6. **Treasure Boat** — boat movement and treasure reveal.
7. **Dream Statues** — silly puzzle mission.
8. **Chicken Inverse Dream** — opposite-matching puzzle.
9. **Safety Lights Chase** — timing and obstacle control.
10. **Asteroid Blaster** — arcade aiming finale.

## 19. Risks and decisions

| Risk                  | Recommendation                           |
| --------------------- | ---------------------------------------- |
| Scope explosion       | Build 3 missions first, not 14           |
| AI agent getting lost | Keep each issue under one scene/system   |
| Art bottleneck        | Use placeholder CC0 assets first         |
| IP risk               | Use original names, art, music, and town |
| Kid frustration       | No fail states; adaptive hints           |
| Mobile bugs           | Design UI for touch from the beginning   |
| Backend complexity    | No backend until the game is fun locally |
| Audio annoyance       | Short sounds, volume controls, mute      |

## 20. First Codex prompt

Here is a good first prompt to give Codex:

```md
We are building a browser-based 2D kids mini-game anthology called Rescue Town Builders.

Tech stack:
- Phaser
- TypeScript
- Vite
- localStorage only
- No backend
- No copyrighted Paw Patrol names, images, logos, audio, or character likenesses

Initial goal:
Create the project foundation and scene flow:
BootScene -> PreloadScene -> StartScene -> ProfileScene -> TownMapScene.

Requirements:
1. Use TypeScript.
2. Create a clean folder structure under src/game.
3. Add a SaveSystem that supports up to 5 local profiles.
4. Add a MissionRegistry with 3 placeholder missions:
   - recycling-run
   - house-builder
   - fire-fix
5. TownMapScene should show 3 large mission buttons.
6. Clicking a mission should route to a placeholder mission scene, then a MissionCompleteScene.
7. MissionCompleteScene should award 1-3 stars and save bestStars for that mission.
8. Add simple Vitest tests for SaveSystem and StarScoring.
9. Use placeholder shapes if no art exists.
10. Keep the implementation small and readable.

Acceptance criteria:
- `npm install`, `npm run dev`, and `npm test` work.
- A user can create a profile, choose a mission, complete it, and see saved stars after refresh.
```

This is enough to begin engineering without overbuilding. The key is to make the **mission framework** first, then treat each of your son’s ideas as a content module.

[1]: https://store.leapfrog.com/en-us/store/p/paw-patrol-to-the-rescue/_/A-prod80-616000 "PAW Patrol: To the Rescue! Learning Video Game, LeapFrog | LeapFrog"
[2]: https://github.com/phaserjs/phaser "GitHub - phaserjs/phaser: Phaser is a fun, free and fast 2D game framework for making HTML5 games for desktop and mobile web browsers, supporting Canvas and WebGL rendering. · GitHub"
[3]: https://docs.godotengine.org/en/latest/tutorials/export/exporting_for_web.html "Exporting for the Web — Godot Engine (latest) documentation in English"
[4]: https://kenney.nl/support "Support · Kenney"
[5]: https://pixabay.com/service/faq/ "FAQ"
[6]: https://phaser.io/tutorials/making-your-first-phaser-3-game/part1 "Making your first Phaser 3 game - Part 1 - Introduction | Phaser"
