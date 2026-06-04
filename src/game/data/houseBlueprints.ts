import type { HouseBlueprint } from '../systems/HouseBuilder';
import { housePartTray } from '../systems/HouseBuilder';

const orderedParts = housePartTray;

export const houseBlueprints: HouseBlueprint[] = [
  {
    id: 'garden-cottage',
    title: 'Garden Cottage',
    resident: 'Mossy Mole',
    wish: 'A low, cozy home with a flower by the door.',
    completionLine: 'Mossy wiggles in and hangs a tiny seed lantern.',
    parts: orderedParts,
  },
  {
    id: 'sunny-bungalow',
    title: 'Sunny Bungalow',
    resident: 'Pip Finch',
    wish: 'A bright roof where morning songs can land.',
    completionLine: 'Pip chirps three notes and the windows glow warm.',
    parts: orderedParts,
  },
  {
    id: 'rainbow-nook',
    title: 'Rainbow Nook',
    resident: 'Nella Newt',
    wish: 'A silly nook with a bloom that catches moon puddles.',
    completionLine: 'Nella paints one careful rainbow dot beside the step.',
    parts: orderedParts,
  },
];
