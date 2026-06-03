import type { MissionDefinition } from '../types';

export const missionDefinitions: MissionDefinition[] = [
  {
    id: 'recycling-run',
    title: "Rivet's Recycling Run",
    characterId: 'rivet',
    mapNodeId: 'recycling-center',
    introPanels: [
      {
        icon: '♻️',
        title: 'Sort the town treasures',
        text: 'Help Rivet send each item to the right bin.',
      },
    ],
    minAge: 4,
    estimatedSeconds: 120,
  },
  {
    id: 'house-builder',
    title: "Brick's House Builder",
    characterId: 'brick',
    mapNodeId: 'construction-lot',
    introPanels: [
      {
        icon: '🏠',
        title: 'Build cozy houses',
        text: 'Pick pieces in order and watch the house pop together.',
      },
    ],
    minAge: 4,
    estimatedSeconds: 120,
  },
  {
    id: 'fire-fix',
    title: "Ember's Fire Fix",
    characterId: 'ember',
    mapNodeId: 'picnic-park',
    introPanels: [
      {
        icon: '💧',
        title: 'Spray the silly fires',
        text: 'Help Ember keep the picnic safe with gentle water spray.',
      },
    ],
    minAge: 4,
    estimatedSeconds: 150,
  },
];
