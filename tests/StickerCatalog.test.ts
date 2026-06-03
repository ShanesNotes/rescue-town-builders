import { describe, expect, it } from 'vitest';
import {
  getAllStickers,
  getStickerById,
  getUnlockedStickers,
  isStickerUnlocked,
  isSecretSticker,
} from '../src/game/systems/StickerCatalog';
import { missionDefinitions } from '../src/game/data/missions';
import { SECRET_DEFINITIONS, type SecretId } from '../src/game/systems/Secrets';

describe('StickerCatalog', () => {
  it('lists every sticker with complete, child-ready lore', () => {
    const all = getAllStickers();
    expect(all.length).toBeGreaterThanOrEqual(6);
    for (const sticker of all) {
      expect(sticker.title.length).toBeGreaterThan(0);
      expect(sticker.childPoem.length).toBeGreaterThan(0);
      expect(sticker.parentNote.length).toBeGreaterThan(0);
      expect(sticker.icon.length).toBeGreaterThan(0);
    }
  });

  it('finds a sticker by id and returns undefined for an unknown id', () => {
    expect(getStickerById('secret-friend')?.title).toBe('A Friend Appears');
    expect(getStickerById('not-a-real-sticker')).toBeUndefined();
  });

  it('returns only the collected stickers, in catalog order', () => {
    const unlocked = getUnlockedStickers(['fire-fix-starter', 'recycling-run-starter']);
    expect(unlocked.map((sticker) => sticker.id)).toEqual(['recycling-run-starter', 'fire-fix-starter']);
    expect(isStickerUnlocked('fire-fix-starter', ['fire-fix-starter'])).toBe(true);
    expect(isStickerUnlocked('fire-fix-starter', [])).toBe(false);
  });

  it('covers the starter sticker for every mission', () => {
    for (const mission of missionDefinitions) {
      const sticker = getStickerById(`${mission.id}-starter`);
      expect(sticker, `missing sticker for ${mission.id}`).toBeDefined();
      expect(sticker?.source).toEqual({ kind: 'mission', id: mission.id });
    }
  });

  it('covers every hidden secret and marks it as a secret', () => {
    for (const secretId of Object.keys(SECRET_DEFINITIONS) as SecretId[]) {
      const sticker = getStickerById(SECRET_DEFINITIONS[secretId].sticker);
      expect(sticker, `missing sticker for secret ${secretId}`).toBeDefined();
      expect(sticker && isSecretSticker(sticker)).toBe(true);
    }
  });
});
