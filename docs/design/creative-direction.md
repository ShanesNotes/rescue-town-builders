# Rescue Town Builders — Creative Direction

> For Willem.  
> A town that fits inside a hen’s dream, waiting for small hands to help it wake up kinder.

This document holds the warm, magical heart for the game. It is the north star for title screen, visuals, helpers, tiny delights, and the first procedural music — all tuned for a 6-year-old who will meet it with wonder, not pressure. Everything stays inside the No-Fail Rule, the IP-safe original world, and the hidden Language-of-Creation soul (light from darkness, naming the animals, the microcosm held safe).

## Title-Screen Concept

**Mood:** The very first second a child opens the game should feel like cracking open a favorite picture book at bedtime — safe, glowing, full of quiet promise. Soft pre-dawn sky melting into warm cream at the horizon. The town is visible in gentle silhouette at the bottom third: rounded roofs, a little winding path, a single tree with a nest. Nothing is loud or busy.

**What’s on screen:**
- A large, rounded, sticker-like title “Rescue Town Builders” centered high, letters built from soft blocks and leaves, with a very subtle outer glow (like the edge of a cloud catching first light). Font warm and rounded, never thin or sharp.
- Below the title, almost at center, the silhouette of Cluckle the hen, round and feathery, eyes gently closed in a dreaming smile. Her body is the softest warm cream with a faint lavender edge. Inside her outline (visible only on very close look or after a secret is found), tiny glowing dots and miniature roof shapes pulse like slow fireflies — the whole town already living inside her dream.
- Three small helper badges (Rivet, Brick, Ember) peek from behind low clouds or the hill at the sides, facing inward toward the title, as if they are also waiting for the child.
- One or two drifting elements: a single paper leaf or seed floating down on the left, a very slow sparkle drifting up from Cluckle on the right. No frantic animation.
- Large, friendly “Play” button (mint or honey) low-center, with generous hit area. Optional tiny text underneath: “For you and a grown-up nearby.”
- Background is the soft sky gradient we will use everywhere (#D4EFFF at top fading to #FFF8E7 near ground). No hard horizon line.

**The feeling when a child first sees it:**  
“This place already knows I’m coming. It has been dreaming about me. Nothing here will rush me or scare me. I get to help.” It should make a 6-year-old want to lean closer to the screen, not click away. The magic is already happening before any button is pressed — the town is small enough to hold, and the child is already inside the story.

## Cohesive Color Palette (Rounded / Flat Sticker-Book Cartoon Style)

Style rule: flat fills, generous rounded corners (rx 12–28 on 128-unit badges), soft outlines in the deep ink color, high-value pastels so nothing feels harsh or scary under any lighting. Colors work for both light and slightly dimmer kid tablets. All hexes are rounded for easy memory in code.

**Sky & Backgrounds**
- Dream Sky (primary title & many scene bgs): `#D4EFFF`
- Grass Whisper (town map, calm areas): `#D8F0D0`
- Cream Nest (sticker book, profile, paper moments): `#FFF8E7`
- Blush Cloud (mission-complete soft pink): `#FFF0F6`
- Warm Sand (house & cozy accents): `#FFEFD6`

**Core Accents (the helpers live here)**
- Rivet Teal (recycle, water, calm growth): `#5EC8B5`
- Brick Warmth (builder earth, wood, steady): `#F4A261`
- Ember Glow (gentle fire-flower, not scary red): `#F48A9E`
- Star Honey (rewards, highlights, Cluckle’s inner lights): `#F7C948`
- Button Mint (primary action, always safe & cheerful): `#8FDBB8`

**Supporting & Magic**
- Leaf Green (growing things, success bounce): `#7DCB8F`
- Magic Dust (secrets, light reveals, dream glow): `#C9B8E8`
- Gentle Rose (love notes, hidden light): `#FFDBE6`
- Paper Light (labels, inner circles on badges): `#FFF7DC`

**Text & Structure (high contrast, never thin)**
- Ink Story (all body & title text, strong outlines): `#203247`
- Cloud White (button labels on dark fills, highlights): `#FFFFFF`

**Usage notes for sticker-book feel:**
- Badge backgrounds use the accent colors (teal for Rivet items, warmth for Brick, glow for Ember).
- Always pair a color fill with the Ink Story stroke (6–8 px on 128 viewBox) and a soft inner Paper Light circle.
- Stars and sparkles live in Star Honey + Magic Dust.
- Never use pure black, neon, or dark muddy tones. Everything stays in the “sun through clean laundry” range.

This palette lets every scene feel like pages from the same storybook. The town map can shift slightly greener, missions can borrow their helper’s accent, sticker book stays in cream so poems feel like handwritten notes.

## One-Paragraph Personality Bios for the Original Helpers

**Rivet (recycle)**  
Rivet is a small, bright raccoon with a satchel of found things and a patient heart. He notices what others overlook — a crumpled paper longing for its stack, a peel ready for the earth — and with a soft nudge and a smile, he guides each one home. Nothing is trash to Rivet; everything is a friend who has lost its place. His quiet joy is the click of the right thing finding the right bin, and the town breathing easier because he stayed to listen.

**Brick (builder)**  
Brick is a sturdy, thoughtful badger who builds with his whole body and his quiet care. He listens to the ground before he lays the first stone, chooses each wall and roof like he is telling a story that must end safely. When Brick finishes a house, even the windows seem to sigh with relief, knowing someone small will be warm inside. He measures twice not because he is afraid of mistakes, but because he wants the house to feel like a promise kept.

**Ember (fire)**  
Ember is a quick little fox with a big water pack and an even bigger gentleness. Fires to her are not enemies but visitors who have stayed too long at the picnic. She sprays with a steady paw and a kind word, never scaring them, only reminding them it is time to rest. When the last flame curls into steam, Ember’s tail gives a happy little wag for the friends who can now stay and play. Her gift is turning “oh no” into “it’s okay now — let’s keep the story going.”

**Cluckle (the dreaming hen — the secret heart)**  
Cluckle is the round, feathery hen who is the secret heart of Rescue Town. With her eyes half-closed in a dreaming smile, she holds the whole world inside her — every roof, every river, every helper, every child — glowing like fireflies in the dark of her sleep. She never asks to be found; she simply waits, offering the town as a gift to anyone gentle enough to notice the quiet place where dreams live. She is the living proof that something enormous and real can be carried safely inside something small, soft, and patient.

## Delight Moments (5–8 Tiny UX Touches That Make a 6-Year-Old Grin)

These are the invisible “I love this game” moments. They cost almost nothing in code but live in memory for years.

1. Reuse Workshop snap: the rescued scrap bounces into a blueprint slot with extra spring, the slot glows (scale 1.0 → 1.08 → 1.0 in 180 ms), and one tiny invention spark flies straight up like the idea just woke up.

2. House Builder roof snap: the finished house’s chimney releases one perfect, slow smoke ring (a soft circle that expands and fades). For a split second the ring catches the Star Honey light and looks like a little halo, then dissolves into three even smaller sparkles.

3. Ember’s water spray: every successful hit leaves 3–4 tiny rainbow droplets (using the Magic Dust + Star Honey) that drift down at different speeds and vanish with the gentlest visual “plink” — the kind of detail a child will try to make happen again on purpose.

4. Sticker Book open: the chosen sticker’s icon does one soft, single bounce (ease-out, 220 ms) right as the childPoem fades in. It feels like the sticker itself is happy to be read out loud.

5. Cluckle’s Dream hotspot (the faint circle on the town map): after the third patient, un-rushed touch, for exactly one breath a miniature glowing town (tiny roofs, path, one tree) appears inside the circle at 20 % opacity, then fades like a secret you are now allowed to keep. No text, no announcement.

6. Town map after-mission growth: once a mission is complete, a tiny permanent detail appears on that building the next time the map loads — a flower box on the house, a little flag on the recycling center, a picnic blanket edge at the park. No fanfare. The town simply grew a thank-you while you weren’t looking.

7. Title screen (future): the big Play button has the three helper badges peeking from its left and right edges. If the child waits 6–8 seconds without pressing, Brick’s badge does a tiny one-frame “hello” wave (the letter or silhouette shifts right then back). It never demands attention; it just notices the child noticing.

8. Slow-read in sticker viewing: tapping the poem area again after it has appeared makes the lines highlight one by one from top to bottom with a soft traveling glow (300 ms per line). A parent can tap in time with reading aloud; the child feels the words are being given to them, not just shown.

All of these are optional polish, never required for core loop. They reward lingering and gentleness exactly the way the secrets do.

## Music Mood Board — Gentle, Cheerful, Non-Annoying Looping Theme for Procedural WebAudio

**Core directive:** The music must feel like a friend humming beside you while you walk through a town that is mostly asleep but happy. It must survive 20–30 loops in a 10-minute session without becoming annoying or “video-gamey.” No strong drums, no rising tension, no sudden changes. Volume and filter can breathe with the moment (slightly brighter on map, dreamier near Cluckle).

**Key:** G major — open, warm, resolves beautifully on the tonic, easy for simple instruments, child-voice friendly range.

**Tempo:** 76 BPM. A relaxed walking/rocking pace. Feels like breathing or being carried. Quarter note ≈ 789 ms. Never faster than 82, never slower than 70.

**Main melodic motif (the “town hum” — 16 notes, one 8-bar phrase, highly singable):**

Use these exact note names (octave 4 is comfortable for melody; G4 is the home note):

```
G4  E4  G4  A4    B4  D5  B4  A4
G4  E4  G4  A4    B4  G4  E4  D4
```

(Last D4 can resolve or hold into the next G4 on loop.)

This motif has a small happy lift (the D5) like a bird or a leaf catching light, then settles back down with a gentle sigh. It is short enough to remember after one listen, long enough to feel like a real tune.

**Variation idea (for 2nd or 4th repeat of the loop, very subtle):**  
On the second half, a soft harmony a third above:
```
B4  G4  B4  C5    D5  F#5 D5  C5
B4  G4  B4  C5    D5  B4  G4  E4
```
Keep the harmony 40–50 % quieter than the lead voice.

**Chord pads (the breathing bed):**
Slow, sustained, almost no attack. Each chord lasts 2–4 beats (or whole bars). Use 2–3 oscillators per chord (root + 5th + octave, or add 6th/9th for extra warmth). Low-pass filter with cutoff around 800–1200 Hz, resonance low. Slight detune (3–7 cents) between voices for “choir in a field” feel.

Suggested progression (I–IV–V–I with a soft vi option):
- G major (I)   — 4 beats
- C major (IV)  — 4 beats
- D major (V)   — 2 beats
- Em (vi)       — 2 beats   (optional wistful lift)
- D major (V)   — 2 beats
- G major (I)   — 4 beats (resolve, let ring)

Pads should fade in over 500–800 ms and fade out over 600+ ms when changing so there is never a “cut.”

**Bass & low end:**
Very quiet sine-wave root notes (G2, C2, D2) every 2–4 beats or on chord changes only. Volume 10–15 % of the melody. Round, never clicky. Optional: a single soft “heartbeat” pulse (volume swell 200 ms) once per 4 bars on the tonic.

**Light texture layer (the “feathers / sleepy wind”):**
Extremely quiet pink or brown noise, low-pass filtered heavily (cutoff 300–500 Hz), volume 3–8 % of main. Gives the sense of air moving through leaves or soft feathers without ever becoming “whoosh” or wind-machine. Can be amplitude-modulated very slowly (8–12 second cycle) for life.

**Overall structure for a seamless loop:**
- 16–32 bar loop (roughly 50–100 seconds real time at 76 BPM).
- A A B A form where B is the harmonized or slightly varied repeat.
- After the final bar, it crossfades or simply restarts on the G4 with zero silence and zero click (use a short 20–40 ms linear ramp on all voices at loop point).
- Small “Cluckle moment” every 4th cycle: during the resolve, add one soft extra grace note (quick G4–A4–G4) that sounds like a contented hen cluck, then back to normal. This rewards the child who has stayed long enough to hear the town’s secret song.

**How it should feel in the body:**
Like sunlight on closed eyelids. Like being read a story you already know the ending of and still want to hear again. Cheerful without sugar-rush, magical without spooky, present without demanding. A child should be able to hum the first four notes after one play session and feel the town is still with them when the device is off.

**WebAudio implementation notes (for the engineer who will turn this into code):**
- Max 4–5 simultaneous voices (lead + harmony + 2 pads + bass + optional texture).
- All oscillators: sine or triangle for warmth; mild saw for pads if filtered.
- Envelopes: slow attack (120–400 ms for melody, 600+ for pads), medium release.
- One global low-pass filter on the music bus that can be automated (open for map/activity, close gently for dream/secret moments or when volume slider is low).
- Expose a “dreaminess” parameter (0–1) that lowers cutoff and slightly slows LFOs.
- The motif can be stored as an array of note/frequency/duration objects and scheduled with AudioContext timing for perfect loops.
- Provide a silent or near-silent fallback so the game is always playable with music off.

This music is not background noise. It is another character — the town’s own quiet voice — and it must love the child back every time it loops.

---

The creative direction is complete when a 6-year-old who has never seen the game before leans in, smiles at Cluckle, and says (without being asked) “Can I play now?” That is the only metric that matters.

Keep the soul hidden but alive in every pixel, every line of a poem, every note: the whole big world can be held safely inside something small that loves you.
