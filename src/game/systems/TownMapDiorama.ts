import type { MissionId } from '../types';
import type { TownMapNode } from './TownMapProgress';

// The living diorama (P4-01): each rescued mission leaves a PERMANENT, mission-distinct bit of
// life on the town map, so the child literally SEES the place they healed grow from dark-and-
// sparse to warm-and-bustling. This module is PURE: completion state -> a deterministic list of
// "life details" per node. No randomness — the same save always yields the same town, so returning
// feels like the town kept the life the child gave it (not a different town each visit).
//
// Rendering (shapes/sprites/tweens) lives in TownMapScene; this only decides WHAT and WHERE,
// keyed off the node's column so details slot beside the house without ever covering the coins,
// houses, star rows, pager, page dots, or corner buttons.

export type DioramaDetailKind =
  // A rescued helper character strolling near the node they came from.
  | 'helper'
  // Chimney smoke curling from the lit house.
  | 'smoke'
  // A planted tree (procedural foliage).
  | 'tree'
  // A flower box (procedural blooms).
  | 'flowers'
  // A street lamp that flickers warmly on.
  | 'lamp'
  // A picnic blanket on the grass.
  | 'picnic'
  // A small prop sprite that belongs to this mission (scooter, chest, frog...).
  | 'prop';

export type DioramaDetail = {
  kind: DioramaDetailKind;
  /** Horizontal offset from the node's centre column (px). */
  dx: number;
  /** Absolute y on the 960x540 stage; all details sit in the low ground band. */
  y: number;
  /** A texture key for 'helper'/'prop' kinds; ignored by procedural kinds. */
  textureKey?: string;
  /** A warm accent colour for procedural kinds (tree/flowers/lamp). */
  tint?: number;
};

// One signature detail per mission. Chosen so each rescued node reads as a distinct new life:
// the helper you freed strolls home, a chimney smokes, a lamp warms the crossing, etc. Offsets
// keep every detail to the SIDE of and BELOW the house (houses end ~y392, star row at y412), and
// inside x 130..830 so they never reach the corner buttons or centre page dots.
const DETAILS_BY_MISSION: Record<MissionId, DioramaDetail[]> = {
  'recycling-run': [
    { kind: 'helper', dx: -78, y: 470, textureKey: 'hl.char.rivet' },
    { kind: 'smoke', dx: 18, y: 250 },
  ],
  'house-builder': [
    { kind: 'helper', dx: 80, y: 470, textureKey: 'hl.char.brick' },
    { kind: 'tree', dx: -82, y: 466, tint: 0x6fc28a },
  ],
  'fire-fix': [
    { kind: 'helper', dx: -80, y: 470, textureKey: 'hl.char.ember' },
    { kind: 'picnic', dx: 70, y: 474 },
  ],
  'inverse-dream': [
    { kind: 'helper', dx: 78, y: 470, textureKey: 'hl.char.cluckle' },
    { kind: 'lamp', dx: -84, y: 462, tint: 0xc9b8e8 },
  ],
  'dream-statues': [
    { kind: 'helper', dx: -80, y: 470, textureKey: 'hl.char.merry' },
    { kind: 'flowers', dx: 80, y: 476, tint: 0xff9ec4 },
  ],
  'recycled-inventions': [
    { kind: 'helper', dx: 80, y: 470, textureKey: 'hl.char.reed' },
    { kind: 'smoke', dx: 18, y: 250 },
  ],
  'bread-rush': [
    { kind: 'helper', dx: -80, y: 470, textureKey: 'hl.char.benny' },
    { kind: 'smoke', dx: 18, y: 250 },
  ],
  'goo-cleanup': [
    { kind: 'helper', dx: 80, y: 470, textureKey: 'hl.char.grumble' },
    { kind: 'flowers', dx: -82, y: 476, tint: 0xffd166 },
  ],
  'frog-flight': [
    { kind: 'helper', dx: -78, y: 470, textureKey: 'hl.char.wings' },
    { kind: 'prop', dx: 82, y: 462, textureKey: 'hl.prop.frogFriend' },
  ],
  'asteroid-blaster': [
    { kind: 'helper', dx: 80, y: 470, textureKey: 'hl.char.nova' },
    { kind: 'lamp', dx: -84, y: 462, tint: 0xb7e6ff },
  ],
  'scooter-roundup': [
    { kind: 'helper', dx: -80, y: 470, textureKey: 'hl.char.scoot' },
    { kind: 'prop', dx: 84, y: 470, textureKey: 'hl.prop.scooter' },
  ],
  'safety-lights': [
    { kind: 'helper', dx: 80, y: 470, textureKey: 'hl.char.dash' },
    { kind: 'lamp', dx: -84, y: 462, tint: 0xffd98a },
  ],
  'bike-explorer': [
    { kind: 'helper', dx: -80, y: 470, textureKey: 'hl.char.milo' },
    { kind: 'tree', dx: 82, y: 466, tint: 0x8ed081 },
  ],
  'treasure-boat': [
    { kind: 'helper', dx: 80, y: 470, textureKey: 'hl.char.coral' },
    { kind: 'prop', dx: -84, y: 466, textureKey: 'hl.prop.treasureChest' },
  ],
};

/**
 * The life details for ONE node, or [] if the mission is not completed yet. The node's column x
 * is applied by the caller; here we only know its in-page offset.
 */
export function dioramaDetailsForNode(node: TownMapNode): DioramaDetail[] {
  if (!node.completed) return [];
  return DETAILS_BY_MISSION[node.missionId] ?? [];
}

/**
 * Town-wide ambient life that grows with the total number of rescued nodes (not tied to one
 * column): a few birds drifting across the sky. Shown on every page so the whole town feels
 * more alive the more the child has healed, even while looking at a page whose nodes are unlit.
 * Returns deterministic positions so the flock is the same every visit.
 */
export function ambientBirdCount(rescued: number): number {
  // 0 rescued -> empty sky; then one small flock element per two rescues, capped so it stays tasteful.
  return Math.min(5, Math.floor(rescued / 2));
}
