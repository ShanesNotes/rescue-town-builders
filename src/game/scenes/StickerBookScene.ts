import Phaser from 'phaser';
import { fadeInScene } from '../systems/SceneTransitions';
import { getSaveSystem } from '../systems/GameServices';
import { inputIntentFromGamepadButton, inputIntentFromKeyboard } from '../systems/InputIntent';
import { returnToTownMap } from '../systems/SceneNavigation';
import { getAllStickers, getStickerById, isStickerUnlocked } from '../systems/StickerCatalog';
import { addButton } from '../ui/Button';
import { addBody, addTitle } from '../ui/SceneText';

// A calm, read-only reward shelf. A child opens a sticker they found and a parent
// reads its little story aloud — "read it again" is the whole point. Locked stickers
// show a gentle silhouette, never a lock-out (No-Fail). Two modes via restart data:
// the grid overview, and a single-sticker reading page.
export class StickerBookScene extends Phaser.Scene {
  private readingId: string | null = null;

  constructor() {
    super('StickerBookScene');
  }

  init(data: { readingId?: string }): void {
    this.readingId = data.readingId ?? null;
  }

  create(): void {
    fadeInScene(this);
    this.cameras.main.setBackgroundColor('#fff7dc');
    const profile = getSaveSystem().getSelectedProfile();
    const owned = profile?.progress.stickers ?? [];
    const playerName = profile?.name ?? 'friend';

    if (this.readingId) {
      this.renderReadingPage(this.readingId, owned);
    } else {
      this.renderGrid(owned, playerName);
    }

    this.input.keyboard?.on('keydown', (event: KeyboardEvent) => {
      this.handleBack(inputIntentFromKeyboard(event.key)?.type);
    });
    this.input.gamepad?.on('down', (_pad: unknown, button: { index: number }) => {
      this.handleBack(inputIntentFromGamepadButton(button.index)?.type);
    });
  }

  private renderGrid(owned: readonly string[], playerName: string): void {
    const stickers = getAllStickers();
    const found = stickers.filter((sticker) => isStickerUnlocked(sticker.id, owned)).length;
    addTitle(this, `${playerName}'s Sticker Book`);
    addBody(this, 104, `Found ${found} of ${stickers.length}. Tap a sticker you found to read its little story.`);

    const cols = 3;
    stickers.forEach((sticker, index) => {
      const unlocked = isStickerUnlocked(sticker.id, owned);
      const x = 200 + (index % cols) * 280;
      const y = 210 + Math.floor(index / cols) * 150;
      addButton(this, {
        x,
        y,
        width: 250,
        height: 120,
        label: unlocked ? `${sticker.icon}\n${sticker.title}` : '❓\nKeep playing to find me!',
        fill: unlocked ? 0xfff4bf : 0xe6e6e6,
        onPress: () => {
          if (unlocked) this.scene.restart({ readingId: sticker.id });
        },
        testId: `stickerbook.sticker.${sticker.id}`,
      });
    });

    addButton(this, {
      x: 480,
      y: 505,
      width: 280,
      height: 58,
      label: 'Back to Map',
      fill: 0x9be7c4,
      onPress: () => returnToTownMap(this),
      testId: 'stickerbook.back-to-map',
    });
  }

  private renderReadingPage(readingId: string, owned: readonly string[]): void {
    const sticker = getStickerById(readingId);
    if (!sticker || !isStickerUnlocked(sticker.id, owned)) {
      this.scene.restart({});
      return;
    }

    this.add.text(480, 150, sticker.icon, { fontSize: '72px' }).setOrigin(0.5);
    addTitle(this, sticker.title);
    addBody(this, 245, sticker.childPoem);
    addBody(this, 380, sticker.parentNote);

    addButton(this, {
      x: 320,
      y: 500,
      width: 250,
      height: 58,
      label: '← Sticker Book',
      fill: 0xffffff,
      onPress: () => this.scene.restart({}),
      testId: 'stickerbook.back-to-book',
    });
    addButton(this, {
      x: 640,
      y: 500,
      width: 250,
      height: 58,
      label: 'Back to Map',
      fill: 0x9be7c4,
      onPress: () => returnToTownMap(this),
      testId: 'stickerbook.back-to-map',
    });
  }

  private handleBack(intentType: string | undefined): void {
    if (intentType === 'back') {
      if (this.readingId) {
        this.scene.restart({});
      } else {
        returnToTownMap(this);
      }
    }
  }
}
