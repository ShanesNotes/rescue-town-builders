import type { RecyclingCategory, RecyclingItem, ReuseBlueprint, ReusePartKind } from '../systems/RecyclingRun';

export const recyclingCategoryLabels: Record<RecyclingCategory, string> = {
  trash: 'Soft scraps',
  paper: 'Flat sheets',
  plastic: 'Tubes & cups',
  metal: 'Shiny bits',
  compost: 'Garden snacks',
};

export const recyclingCategoryIcons: Record<RecyclingCategory, string> = {
  trash: '🧸',
  paper: '📄',
  plastic: '🧴',
  metal: '🥫',
  compost: '🌱',
};

export const reusePartKindLabels: Record<ReusePartKind, string> = {
  soft: 'something soft or bendy',
  sheet: 'a flat sheet',
  tube: 'a tube or cup',
  shiny: 'a shiny bit',
  grow: 'a garden snack',
};

export const recyclingItems: RecyclingItem[] = [
  { id: 'banana-peel', label: 'Banana peel', icon: '🍌', category: 'compost', partKind: 'grow', partLabel: 'garden food', reuseVerb: 'soil sparkle' },
  { id: 'apple-core', label: 'Apple core', icon: '🍎', category: 'compost', partKind: 'grow', partLabel: 'seed snack', reuseVerb: 'flower fuel' },
  { id: 'newspaper', label: 'Newspaper', icon: '📰', category: 'paper', partKind: 'sheet', partLabel: 'foldy sheet', reuseVerb: 'a kite fin' },
  { id: 'cardboard-box', label: 'Cardboard box', icon: '📦', category: 'paper', partKind: 'sheet', partLabel: 'sturdy panel', reuseVerb: 'a ramp wall' },
  { id: 'water-bottle', label: 'Water bottle', icon: '🧴', category: 'plastic', partKind: 'tube', partLabel: 'bubble tube', reuseVerb: 'a sprinkler tank' },
  { id: 'yogurt-cup', label: 'Yogurt cup', icon: '🥛', category: 'plastic', partKind: 'tube', partLabel: 'scoop cup', reuseVerb: 'a tiny bucket' },
  { id: 'soup-can', label: 'Soup can', icon: '🥫', category: 'metal', partKind: 'shiny', partLabel: 'shiny drum', reuseVerb: 'a bright wheel' },
  { id: 'foil-ball', label: 'Foil ball', icon: '⚪', category: 'metal', partKind: 'shiny', partLabel: 'moon mirror', reuseVerb: 'a sparkle reflector' },
  { id: 'broken-crayon', label: 'Broken crayon', icon: '🖍️', category: 'trash', partKind: 'soft', partLabel: 'color nub', reuseVerb: 'rainbow trim' },
  { id: 'sticky-wrapper', label: 'Sticky wrapper', icon: '🍬', category: 'trash', partKind: 'soft', partLabel: 'crinkle ribbon', reuseVerb: 'flutter tape' },
  { id: 'paper-bag', label: 'Paper bag', icon: '🛍️', category: 'paper', partKind: 'sheet', partLabel: 'rustle sheet', reuseVerb: 'a wind sail' },
  { id: 'plastic-lid', label: 'Plastic lid', icon: '🔵', category: 'plastic', partKind: 'tube', partLabel: 'round cap', reuseVerb: 'a spinny nozzle' },
];

export const reuseBlueprints: ReuseBlueprint[] = [
  {
    id: 'bubble-sprinkler',
    title: 'Bubble Sprinkler',
    problem: 'The sleepy flowers want water and giggles.',
    invention: 'bubble sprinkler',
    testMessage: 'Pop-pop! The flowers wake up under bubble rain.',
    slots: [
      { id: 'tank', kind: 'tube', label: 'a tube for water', x: 430, y: 212 },
      { id: 'sail', kind: 'sheet', label: 'a flat fin', x: 515, y: 230 },
    ],
  },
  {
    id: 'rain-flute',
    title: 'Rain Flute',
    problem: 'The puddle band lost the tune that makes it rain-dance.',
    invention: 'rain flute',
    testMessage: 'Toot-toot! Happy raindrops hop along to the flute song.',
    slots: [
      { id: 'pipe', kind: 'tube', label: 'a tube to toot', x: 440, y: 218 },
      { id: 'flag', kind: 'sheet', label: 'a flat song-flag', x: 520, y: 238 },
    ],
  },
  {
    id: 'moon-chime',
    title: 'Moon Chime',
    problem: 'The town square needs a shiny bedtime song.',
    invention: 'moon chime',
    testMessage: 'Ting-ting! Warm moon music drifts over Rescue Town.',
    slots: [
      { id: 'bell', kind: 'shiny', label: 'a shiny bell', x: 445, y: 210 },
      { id: 'hanger', kind: 'sheet', label: 'a flat hanger', x: 515, y: 255 },
    ],
  },
  {
    id: 'garden-rocket',
    title: 'Garden Rocket',
    problem: 'The compost patch wants to blast seeds into silly rows.',
    invention: 'garden rocket',
    testMessage: 'Whoosh! Seeds land in a perfect zig-zag garden.',
    slots: [
      { id: 'nose', kind: 'grow', label: 'garden fuel', x: 420, y: 235 },
      { id: 'body', kind: 'tube', label: 'a hollow body', x: 500, y: 215 },
      { id: 'stripe', kind: 'shiny', label: 'a shiny stripe', x: 560, y: 260 },
    ],
  },
  {
    id: 'crinkle-kite',
    title: 'Crinkle Kite',
    problem: 'A lost breeze needs a bright thing to push.',
    invention: 'crinkle kite',
    testMessage: 'Flap-flap! The kite pulls cloud shadows into funny shapes.',
    slots: [
      { id: 'body', kind: 'sheet', label: 'a flat kite body', x: 450, y: 218 },
      { id: 'tail', kind: 'soft', label: 'a flutter tail', x: 525, y: 270 },
    ],
  },
];
