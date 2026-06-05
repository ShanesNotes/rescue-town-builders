import type { HouseBlueprint } from '../systems/HouseBuilder';
import { housePartTray } from '../systems/HouseBuilder';

const orderedParts = housePartTray;

export const houseBlueprints: HouseBlueprint[] = [
  {
    id: 'garden-cottage',
    title: 'Garden Cottage',
    parts: orderedParts,
    accent: 0x8fce8f, // leafy green
  },
  {
    id: 'sunny-bungalow',
    title: 'Sunny Bungalow',
    parts: orderedParts,
    accent: 0xffd166, // warm yellow
  },
  {
    id: 'rainbow-nook',
    title: 'Rainbow Nook',
    parts: orderedParts,
    accent: 0xff9ecb, // bright rose
  },
];
