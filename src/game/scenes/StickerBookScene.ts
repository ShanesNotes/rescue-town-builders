import Phaser from 'phaser';
import { fadeInScene } from '../systems/SceneTransitions';
import { getSaveSystem, getSfx } from '../systems/GameServices';
import { bindIntents } from '../systems/bindIntents';
import { registerE2EButton } from '../systems/E2EBridge';
import { returnToTownMap } from '../systems/SceneNavigation';
import { getAllStickers, getStickerById, isStickerUnlocked } from '../systems/StickerCatalog';
import { addIconButton } from '../ui/Button';
import { FONTS } from '../ui/typography';
import { hasTexture, motionAllowed } from '../ui/Sprite';

// A calm reward album. A child opens a sticker they found and a parent reads its little story
// aloud — "read it again" is the whole point. Locked stickers sleep as gentle silhouettes,
// never a lock-out (No-Fail). Grid + single-sticker reading page.
type GridCell = { x: number; y: number; open: () => void };

export class StickerBookScene extends Phaser.Scene {
  private readingId: string | null = null;
  private cells: GridCell[] = []; // CF-7: keyboard/gamepad grid navigation targets
  private gridCols = 7;
  private gridFocus = 0;
  private focusRing!: Phaser.GameObjects.Rectangle;

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

    const back = (): void => {
      if (this.readingId) this.scene.restart({});
      else returnToTownMap(this);
    };
    // CF-7: on the grid, keyboard/gamepad can move a visible focus ring across cells and confirm to
    // read; the reading page has no grid, so only Back is bound there.
    if (this.readingId) bindIntents(this, { onBack: back });
    else bindIntents(this, { onMove: (x, y) => this.moveGridFocus(x, y), onConfirm: () => this.openFocusedCell(), onBack: back });
  }

  private renderGrid(owned: readonly string[], playerName: string): void {
    const stickers = getAllStickers();
    const found = stickers.filter((s) => isStickerUnlocked(s.id, owned)).length;
    this.cells = [];

    this.add.rectangle(480, 296, 800, 392, 0x16243a, 0.82).setStrokeStyle(4, 0xffc857, 0.85).setDepth(2);
    this.add
      .text(480, 56, `${playerName.toUpperCase()}'S STICKERS`, { fontFamily: FONTS.display, fontSize: '32px', color: '#FFE2A6', fontStyle: 'bold', stroke: '#2A1606', strokeThickness: 7 })
      .setOrigin(0.5)
      .setDepth(40);
    // Found-count as star pips.
    const gap = 26;
    const startX = 480 - ((stickers.length - 1) * gap) / 2;
    stickers.forEach((_s, i) => {
      this.add.image(startX + i * gap, 102, i < found ? 'hl.ui.starFull' : 'hl.ui.starEmpty').setDisplaySize(19, 19).setDepth(40);
    });

    // 7 columns keeps the growing catalog (mission + secret stickers, incl. the Journey glimmers)
    // to three rows inside the panel — no overflow as new secrets are seeded.
    const cols = 7;
    const cellW = 112;
    const cellH = 116;
    const gridX = 480 - ((cols - 1) * cellW) / 2;
    const gridY = 196;
    this.gridCols = cols;
    stickers.forEach((sticker, index) => {
      const unlocked = isStickerUnlocked(sticker.id, owned);
      const x = gridX + (index % cols) * cellW;
      const y = gridY + Math.floor(index / cols) * cellH;
      const open = this.stickerCell(sticker.id, sticker.icon, sticker.title, x, y, unlocked, owned);
      this.cells.push({ x, y, open });
    });

    // CF-7: a visible focus ring for keyboard/gamepad grid navigation, hidden until the child moves.
    this.focusRing = this.add.rectangle(0, 0, 102, 102, 0x000000, 0).setStrokeStyle(5, 0xffe27a, 1).setDepth(8).setVisible(false);
    this.gridFocus = 0;
  }

  private stickerCell(id: string, icon: string, title: string, x: number, y: number, unlocked: boolean, owned: readonly string[]): () => void {
    let frame: Phaser.GameObjects.Image | Phaser.GameObjects.Rectangle;
    if (hasTexture(this, 'hl.ui.stickerFrame')) {
      const img = this.add.image(x, y, 'hl.ui.stickerFrame').setDisplaySize(90, 90).setDepth(6);
      if (!unlocked) img.setTint(0x5a6a88).setAlpha(0.8);
      frame = img;
    } else {
      frame = this.add.rectangle(x, y, 90, 90, unlocked ? 0x1b2a41 : 0x101a2e, 0.9).setStrokeStyle(3, 0xffc857).setDepth(6);
    }
    let mark: Phaser.GameObjects.Image | Phaser.GameObjects.Text;
    if (unlocked) mark = this.add.image(x, y - 4, icon).setDisplaySize(46, 46).setDepth(7);
    else mark = this.add.text(x, y - 4, '?', { fontSize: '32px', color: '#7e8cab' }).setOrigin(0.5).setDepth(7);
    this.add
      .text(x, y + 44, unlocked ? title : 'waiting', { fontFamily: FONTS.display, fontSize: '11px', color: unlocked ? '#FFE2A6' : '#7e8cab', fontStyle: 'bold', stroke: '#2A1606', strokeThickness: 3, align: 'center', wordWrap: { width: 106 } })
      .setOrigin(0.5)
      .setDepth(7);
    const open = (): void => {
      if (unlocked) this.scene.restart({ readingId: id });
      else this.notYet(mark); // locked taps aren't dead: a gentle 'not yet' wiggle + soft tick (P1-10)
    };
    // Drop the hand cursor when locked so a sleeping sticker doesn't promise a page it can't open.
    frame.setInteractive({ useHandCursor: unlocked }).on('pointerup', open);
    registerE2EButton({ testId: `stickerbook.sticker.${id}`, label: title, sceneKey: this.scene.key, press: open });
    return open;
  }

  // CF-7: move the grid focus ring; horizontal steps within a row, vertical steps a whole row, both
  // clamped to the catalog so the ring never leaves the grid.
  private moveGridFocus(dx: -1 | 0 | 1, dy: -1 | 0 | 1): void {
    if (this.cells.length === 0) return;
    const next = this.gridFocus + dx + dy * this.gridCols;
    if (next < 0 || next >= this.cells.length) return;
    this.gridFocus = next;
    this.paintGridFocus();
  }

  private paintGridFocus(): void {
    const cell = this.cells[this.gridFocus];
    if (!cell) return;
    this.tweens.killTweensOf(this.focusRing);
    this.focusRing.setPosition(cell.x, cell.y).setScale(1).setVisible(true);
    if (motionAllowed()) this.tweens.add({ targets: this.focusRing, scale: 1.05, duration: 600, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
  }

  private openFocusedCell(): void {
    this.cells[this.gridFocus]?.open();
  }

  // A locked-cell tap is never dead (No-Fail): the sleeping question-mark gives a gentle
  // 'not yet' wiggle and a soft muted tick, so the child feels the album answered (P1-10).
  private notYet(mark: Phaser.GameObjects.Image | Phaser.GameObjects.Text): void {
    getSfx().play('tap');
    if (!motionAllowed()) return;
    this.tweens.killTweensOf(mark);
    mark.setAngle(0);
    this.tweens.add({ targets: mark, angle: { from: -9, to: 9 }, duration: 70, yoyo: true, repeat: 3, ease: 'Sine.easeInOut', onComplete: () => mark.setAngle(0) });
  }

  private renderReadingPage(readingId: string, owned: readonly string[]): void {
    const sticker = getStickerById(readingId);
    if (!sticker || !isStickerUnlocked(sticker.id, owned)) {
      this.scene.restart({});
      return;
    }

    this.add.rectangle(480, 300, 700, 420, 0x16243a, 0.86).setStrokeStyle(4, 0xffc857, 0.85).setDepth(2);
    if (hasTexture(this, 'hl.ui.stickerFrame')) this.add.image(480, 150, 'hl.ui.stickerFrame').setDisplaySize(118, 118).setDepth(5);
    this.add.image(480, 146, sticker.icon).setDisplaySize(84, 84).setDepth(6);
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
    // Single, unambiguous exit: the top-left arrow (→ the grid). The grid has its own to-map back.
  }
}
