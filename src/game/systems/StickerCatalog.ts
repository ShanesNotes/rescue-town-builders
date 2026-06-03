import { STICKER_DEFINITIONS, type StickerDefinition } from '../data/stickers';

// Pure read layer over the sticker lore. The Sticker Book scene renders these;
// nothing here has side effects, so it is fully testable through its interface.

export function getAllStickers(): StickerDefinition[] {
  return STICKER_DEFINITIONS;
}

export function getStickerById(id: string): StickerDefinition | undefined {
  return STICKER_DEFINITIONS.find((sticker) => sticker.id === id);
}

export function isStickerUnlocked(id: string, savedStickers: readonly string[]): boolean {
  return savedStickers.includes(id);
}

/** The stickers a child has actually collected, in catalog order. */
export function getUnlockedStickers(savedStickers: readonly string[]): StickerDefinition[] {
  const owned = new Set(savedStickers);
  return STICKER_DEFINITIONS.filter((sticker) => owned.has(sticker.id));
}

export function isSecretSticker(sticker: StickerDefinition): boolean {
  return sticker.source.kind === 'secret';
}
