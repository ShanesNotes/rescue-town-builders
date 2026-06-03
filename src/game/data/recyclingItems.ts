import type { RecyclingCategory, RecyclingItem } from '../systems/RecyclingRun';

export const recyclingCategoryLabels: Record<RecyclingCategory, string> = {
  trash: 'Trash',
  paper: 'Paper',
  plastic: 'Plastic',
  metal: 'Metal',
  compost: 'Compost',
};

export const recyclingCategoryIcons: Record<RecyclingCategory, string> = {
  trash: '🗑️',
  paper: '📄',
  plastic: '🧴',
  metal: '🥫',
  compost: '🍌',
};

export const recyclingItems: RecyclingItem[] = [
  { id: 'banana-peel', label: 'Banana peel', icon: '🍌', category: 'compost' },
  { id: 'apple-core', label: 'Apple core', icon: '🍎', category: 'compost' },
  { id: 'newspaper', label: 'Newspaper', icon: '📰', category: 'paper' },
  { id: 'cardboard-box', label: 'Cardboard box', icon: '📦', category: 'paper' },
  { id: 'water-bottle', label: 'Water bottle', icon: '🧴', category: 'plastic' },
  { id: 'yogurt-cup', label: 'Yogurt cup', icon: '🥛', category: 'plastic' },
  { id: 'soup-can', label: 'Soup can', icon: '🥫', category: 'metal' },
  { id: 'foil-ball', label: 'Foil ball', icon: '⚪', category: 'metal' },
  { id: 'broken-crayon', label: 'Broken crayon', icon: '🖍️', category: 'trash' },
  { id: 'sticky-wrapper', label: 'Sticky wrapper', icon: '🍬', category: 'trash' },
  { id: 'paper-bag', label: 'Paper bag', icon: '🛍️', category: 'paper' },
  { id: 'plastic-lid', label: 'Plastic lid', icon: '🔵', category: 'plastic' },
];
