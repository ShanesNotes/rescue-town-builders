import Phaser from 'phaser';
import { fadeInScene } from '../systems/SceneTransitions';
import { getSaveSystem } from '../systems/GameServices';
import { bindIntents } from '../systems/bindIntents';
import { registerE2EButton } from '../systems/E2EBridge';
import { returnToTownMap } from '../systems/SceneNavigation';
import { getAllStickers, getStickerById, isStickerUnlocked } from '../systems/StickerCatalog';
import { addIconButton } from '../ui/Button';
import { FONTS } from '../ui/typography';
import { hasTexture } from '../ui/Sprite';

// A calm reward album. A child opens a sticker they found and a parent reads its little story
// aloud — "read it again" is the whole point. Locked stickers sleep as gentle silhouettes,
// never a lock-out (No-Fail). Grid + single-sticker reading page.
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
    const profile = getSaveSystem().getSelectedProfile();
    const owned = profile?.progress.stickers ?? [];
    const playerName = profile?.name ?? 'friend';

    this.add.image(480, 270, 'hl.bg.town').setDisplaySize(960, 540).setDepth(0);
    this.add.rectangle(480, 270, 960, 540, 0x101b2e, 0.5).setDepth(1);

    if (this.readingId) this.renderReadingPage(this.readingId, owned);
    else this.renderGrid(owned, playerName);

    addIconButton(this, {
      x: 52,
      y: 46,
      size: 56,
      key: 'hl.ui.back',
      onPress: () => (this.readingId ? this.scene.restart({}) : returnToTownMap(this)),
      testId: this.readingId ? 'stickerbook.back-to-book' : 'stickerbook.back-to-map',
    }).setDepth(40);

    bindIntents(this, { onBack: () => (this.readingId ? this.scene.restart({}) : returnToTownMap(this)) });
  }

  private renderGrid(owned: readonly string[], playerName: string): void {
    const stickers = getAllStickers();
    const found = stickers.filter((s) => isStickerUnlocked(s.id, owned)).length;

    this.add.rectangle(480, 296, 800, 392, 0x16243a, 0.82).setStrokeStyle(4, 0xffc857, 0.85).setDepth(2);
    this.add
      .text(480, 56, `${playerName.toUpperCase()}'S STICKERS`, { fontFamily: FONTS.display, fontSize: '32px', color: '#FFE2A6', fontStyle: 'bold', stroke: '#2A1606', strokeThickness: 7 })
      .setOrigin(0.5)
      .setDepth(40);
    // Found-count as star pips.
    const gap = 30;
    const startX = 480 - ((stickers.length - 1) * gap) / 2;
    stickers.forEach((_s, i) => {
      this.add.image(startX + i * gap, 104, i < found ? 'hl.ui.starFull' : 'hl.ui.starEmpty').setDisplaySize(24, 24).setDepth(40);
    });

    const cols = 3;
    const cellW = 240;
    const cellH = 168;
    const gridX = 480 - cellW;
    const gridY = 222;
    stickers.forEach((sticker, index) => {
      const unlocked = isStickerUnlocked(sticker.id, owned);
      const x = gridX + (index % cols) * cellW;
      const y = gridY + Math.floor(index / cols) * cellH;
      this.stickerCell(sticker.id, sticker.icon, sticker.title, x, y, unlocked, owned);
    });
  }

  private stickerCell(id: string, icon: string, title: string, x: number, y: number, unlocked: boolean, owned: readonly string[]): void {
    let frame: Phaser.GameObjects.Image | Phaser.GameObjects.Rectangle;
    if (hasTexture(this, 'hl.ui.stickerFrame')) {
      const img = this.add.image(x, y, 'hl.ui.stickerFrame').setDisplaySize(124, 124).setDepth(6);
      if (!unlocked) img.setTint(0x5a6a88).setAlpha(0.8);
      frame = img;
    } else {
      frame = this.add.rectangle(x, y, 124, 124, unlocked ? 0x1b2a41 : 0x101a2e, 0.9).setStrokeStyle(4, 0xffc857).setDepth(6);
    }
    this.add.text(x, y - 6, unlocked ? icon : '?', { fontSize: unlocked ? '48px' : '44px', color: unlocked ? '#ffffff' : '#7e8cab' }).setOrigin(0.5).setDepth(7);
    this.add
      .text(x, y + 56, unlocked ? title : 'waiting', { fontFamily: FONTS.display, fontSize: '15px', color: unlocked ? '#FFE2A6' : '#7e8cab', fontStyle: 'bold', stroke: '#2A1606', strokeThickness: 3, align: 'center', wordWrap: { width: 200 } })
      .setOrigin(0.5)
      .setDepth(7);
    frame.setInteractive({ useHandCursor: true }).on('pointerup', () => unlocked && this.scene.restart({ readingId: id }));
    registerE2EButton({ testId: `stickerbook.sticker.${id}`, label: title, sceneKey: this.scene.key, press: () => unlocked && this.scene.restart({ readingId: id }) });
  }

  private renderReadingPage(readingId: string, owned: readonly string[]): void {
    const sticker = getStickerById(readingId);
    if (!sticker || !isStickerUnlocked(sticker.id, owned)) {
      this.scene.restart({});
      return;
    }

    this.add.rectangle(480, 300, 700, 420, 0x16243a, 0.86).setStrokeStyle(4, 0xffc857, 0.85).setDepth(2);
    if (hasTexture(this, 'hl.ui.stickerFrame')) this.add.image(480, 150, 'hl.ui.stickerFrame').setDisplaySize(118, 118).setDepth(5);
    this.add.text(480, 144, sticker.icon, { fontSize: '60px' }).setOrigin(0.5).setDepth(6);
    this.add
      .text(480, 232, sticker.title, { fontFamily: FONTS.display, fontSize: '30px', color: '#FFE2A6', fontStyle: 'bold', stroke: '#2A1606', strokeThickness: 6 })
      .setOrigin(0.5)
      .setDepth(6);
    this.add
      .text(480, 318, sticker.childPoem, { fontFamily: FONTS.display, fontSize: '20px', color: '#EBDDDA', align: 'center', lineSpacing: 8, wordWrap: { width: 600 } })
      .setOrigin(0.5)
      .setDepth(6);
    this.add
      .text(480, 416, sticker.parentNote, { fontFamily: FONTS.label, fontSize: '13px', color: '#9DB4C0', align: 'center', lineSpacing: 6, wordWrap: { width: 600 } })
      .setOrigin(0.5)
      .setDepth(6);

    addIconButton(this, { x: 640, y: 500, size: 64, key: 'hl.ui.back', caption: 'Town', onPress: () => returnToTownMap(this), testId: 'stickerbook.back-to-map' }).setDepth(40);
  }
}
