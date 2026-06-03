import type { HouseBlueprint } from '../systems/HouseBuilder';
import { housePartTray } from '../systems/HouseBuilder';

const orderedParts = housePartTray;

export const houseBlueprints: HouseBlueprint[] = [
  {
    id: 'garden-cottage',
    title: 'Garden Cottage',
    parts: orderedParts,
  },
  {
    id: 'sunny-bungalow',
    title: 'Sunny Bungalow',
    parts: orderedParts,
  },
  {
    id: 'rainbow-nook',
    title: 'Rainbow Nook',
    parts: orderedParts,
  },
];
