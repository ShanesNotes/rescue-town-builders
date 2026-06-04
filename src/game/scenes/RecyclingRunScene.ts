import Phaser from 'phaser';
import { fadeInScene } from '../systems/SceneTransitions';
import { recyclingCategoryLabels, recyclingItems } from '../data/recyclingItems';
import { getSaveSystem, getSfx } from '../systems/GameServices';
import { bindIntents } from '../systems/bindIntents';
import { registerE2EButton } from '../systems/E2EBridge';
import { Juice } from '../systems/Juice';
import { completeMission, returnToTownMap } from '../systems/SceneNavigation';
import { confirmMissionExit, isMissionExitOpen } from '../systems/confirmMissionExit';
import {
  chooseRecyclingItems,
  createRecyclingRunState,
  getActiveRecyclingCategories,
  getRecyclingRunResult,
  sortCurrentRecyclingItem,
  type RecyclingCategory,
  type RecyclingRunState,
} from '../systems/RecyclingRun';
import { addIconButton } from '../ui/Button';
import { FONTS } from '../ui/typography';
import { hasTexture, motionAllowed } from '../ui/Sprite';

const ITEM_KEY: Record<RecyclingCategory, string> = {
  compost: 'props.recycling-compost',
  metal: 'props.recycling-metal',
  paper: 'props.recycling-paper',
  plastic: 'props.recycling-plastic',
  trash: 'props.recycling-trash',
};
const BIN_TINT: Record<RecyclingCategory, number> = {
  trash: 0x8a93a6,
  paper: 0x76b3e6,
  plastic: 0x43a29c,
  metal: 0xffc857,
  compost: 0x8fce6a,
};
// Codex's Hearthlight bins exist for these categories; plastic/metal fall back until rendered.
const BIN_HL: Partial<Record<RecyclingCategory, string>> = {
  trash: 'hl.prop.binTrash',
  paper: 'hl.prop.binPaper',
  compost: 'hl.prop.binCompost',
};
const HOME = { x: 480, y: 214 };

type Bin = { category: RecyclingCategory; x: number; bounds: Phaser.Geom.Rectangle; glow: Phaser.GameObjects.Rectangle; panel: Phaser.GameObjects.Rectangle };

export class RecyclingRunScene extends Phaser.Scene {
  private state!: RecyclingRunState;
  private item!: Phaser.GameObjects.Image;
  private bins: Bin[] = [];
  private pips: Phaser.GameObjects.Arc[] = [];
  private hint!: Phaser.GameObjects.Text;
  private selected = 0;
  private done = false;
  private itemBaseScale = 1;

  constructor() {
    super('RecyclingRunScene');
  }

  create(): void {
    fadeInScene(this);
    const profile = getSaveSystem().getSelectedProfile();
    const difficulty = profile?.settings.difficulty ?? 'helper';
    this.state = createRecyclingRunState(difficulty, chooseRecyclingItems(recyclingItems, getActiveRecyclingCategories(difficulty), 10));
    this.bins = [];
    this.pips = [];
    this.selected = 0;
    this.done = false;

    this.paintWorld();
    this.buildPips();
    this.buildBins();
    this.hint = this.add
      .text(480, 320, '', { fontFamily: FONTS.display, fontSize: '20px', color: '#FFE2A6', stroke: '#2A1606', strokeThickness: 5, align: 'center', wordWrap: { width: 560 } })
      .setOrigin(0.5)
      .setDepth(22);

    // Rivet watches, planted on the right.
    this.add.ellipse(862, 360, 70, 18, 0x0a1322, 0.5).setDepth(9);
    this.add.image(862, 360, 'hl.char.rivet').setOrigin(0.5, 1).setDisplaySize(96, 96).setDepth(10);

    // The draggable item.
    this.add.circle(HOME.x, HOME.y, 70, 0xffe2a6, 0.1).setBlendMode(Phaser.BlendModes.ADD).setDepth(14);
    this.item = this.add.image(HOME.x, HOME.y, ITEM_KEY.trash).setDisplaySize(108, 108).setDepth(30);
    this.item.setInteractive({ useHandCursor: true, draggable: true });
    this.input.setDraggable(this.item);
    this.wireDrag();

    addIconButton(this, { x: 52, y: 46, size: 56, key: 'hl.ui.back', onPress: () => this.requestExit(), testId: 'recycling.back-to-map' }).setDepth(40);

    bindIntents(this, {
      onMove: (x, y) => this.moveSelection(x || y),
      onConfirm: () => !isMissionExitOpen(this) && this.attemptSort(this.bins[this.selected]?.category),
      onBack: () => this.requestExit(),
    });

    this.loadItem();
  }

  private paintWorld(): void {
    this.add.image(480, 270, 'hl.bg.recycle').setDisplaySize(960, 540).setDepth(0);
    this.add.rectangle(480, 270, 960, 540, 0x101b2e, 0.22).setDepth(1);
    this.add.rectangle(480, 30, 960, 70, 0x101b2e, 0.4).setDepth(1);
  }

  private buildPips(): void {
    const total = this.state.items.length;
    const gap = 26;
    const startX = 480 - ((total - 1) * gap) / 2;
    for (let i = 0; i < total; i += 1) {
      this.pips.push(this.add.circle(startX + i * gap, 40, 7, 0x3a4a66).setStrokeStyle(2, 0x1b2a41).setDepth(20));
    }
  }

  private updatePips(): void {
    this.pips.forEach((pip, i) => {
      const done = i < this.state.sorted;
      pip.setFillStyle(done ? 0xffc857 : 0x3a4a66);
      if (done && motionAllowed()) Juice.punch(this, pip, 1.4, 120);
    });
  }

  private buildBins(): void {
    const cats = this.state.activeCategories;
    const spacing = Math.min(210, 760 / cats.length);
    const startX = 480 - ((cats.length - 1) * spacing) / 2;
    cats.forEach((category, index) => {
      const x = startX + index * spacing;
      const y = 446;
      const bounds = new Phaser.Geom.Rectangle(x - 84, y - 74, 168, 150);
      const glow = this.add.rectangle(x, y, 176, 158, 0xffc857, 0).setDepth(8).setBlendMode(Phaser.BlendModes.ADD);
      const panel = this.add.rectangle(x, y, 168, 150, 0x16243a, 0.84).setStrokeStyle(4, 0xffc857, 0.85).setDepth(9);
      const hlBin = BIN_HL[category];
      if (hlBin && hasTexture(this, hlBin)) {
        this.add.image(x, y - 6, hlBin).setDisplaySize(94, 94).setDepth(10);
      } else {
        this.add.image(x, y - 8, 'props.recycling-bin').setDisplaySize(76, 76).setDepth(10).setTint(BIN_TINT[category]);
      }
      this.add
        .text(x, y + 52, recyclingCategoryLabels[category], { fontFamily: FONTS.display, fontSize: '18px', color: '#FFE2A6', fontStyle: 'bold', stroke: '#2A1606', strokeThickness: 4 })
        .setOrigin(0.5)
        .setDepth(11);
      // Tap-a-bin also sorts (No-Fail: drag OR tap OR keyboard all work).
      panel.setInteractive({ useHandCursor: true }).on('pointerup', () => !isMissionExitOpen(this) && this.attemptSort(category));
      registerE2EButton({ testId: `recycling.bin.${category}`, label: category, sceneKey: this.scene.key, press: () => this.attemptSort(category) });
      this.bins.push({ category, x, bounds, glow, panel });
    });
  }

  private wireDrag(): void {
    this.input.on('dragstart', () => {
      if (this.done) return;
      this.item.setDepth(40);
      if (motionAllowed()) this.tweens.add({ targets: this.item, scale: this.itemBaseScale * 1.12, duration: 120, ease: 'Quad.easeOut' });
    });
    this.input.on('drag', (_p: Phaser.Input.Pointer, obj: Phaser.GameObjects.GameObject, dragX: number, dragY: number) => {
      if (this.done || obj !== this.item) return;
      this.item.setPosition(dragX, dragY);
      this.bins.forEach((bin) => bin.panel.setScale(Phaser.Geom.Rectangle.Contains(bin.bounds, dragX, dragY) ? 1.06 : 1));
    });
    this.input.on('dragend', () => {
      if (this.done) return;
      this.bins.forEach((bin) => bin.panel.setScale(1));
      const target = this.bins.find((bin) => Phaser.Geom.Rectangle.Contains(bin.bounds, this.item.x, this.item.y));
      if (target) this.attemptSort(target.category);
      else this.springHome();
    });
  }

  // State advances synchronously; the sorted item flies away as a throwaway "ghost" so the next
  // item can appear immediately (snappy, and never blocks a fast tapper — drag/tap/keyboard alike).
  private attemptSort(category: RecyclingCategory | undefined): void {
    if (!category || this.done) return;
    const targetBin = this.bins.find((b) => b.category === category);
    const outcome = sortCurrentRecyclingItem(this.state, category);
    this.state = outcome.state;

    if (!outcome.correct) {
      getSfx().play('try-again');
      this.hint.setText('Almost! Try the glowing bin.');
      this.springHome();
      return;
    }

    getSfx().play('correct');
    this.hint.setText('');
    this.updatePips();
    if (targetBin) {
      Juice.punch(this, targetBin.panel, 1.1, 110);
      Juice.burst(this, targetBin.x, targetBin.bounds.y, { color: 0xffe2a6, count: 8 });
      this.flyAway(targetBin);
    }

    if (outcome.completed) {
      this.done = true;
      this.time.delayedCall(motionAllowed() ? 300 : 0, () => completeMission(this, getRecyclingRunResult(this.state)));
      return;
    }
    this.loadItem();
  }

  // A cosmetic copy of the just-sorted item, tumbling into the bin.
  private flyAway(bin: Bin): void {
    if (!motionAllowed()) return;
    const ghost = this.add.image(this.item.x, this.item.y, this.item.texture.key).setDisplaySize(108, 108).setDepth(31);
    this.tweens.add({ targets: ghost, x: bin.x, y: bin.bounds.y + 70, scale: 0, angle: 220, duration: 320, ease: 'Quad.easeIn', onComplete: () => ghost.destroy() });
  }

  private loadItem(): void {
    const current = this.state.currentItem;
    if (!current) {
      completeMission(this, getRecyclingRunResult(this.state));
      return;
    }
    this.item.setTexture(this.itemKeyFor(current)).setDisplaySize(108, 108).setPosition(HOME.x, HOME.y).setAngle(0).setDepth(30);
    this.itemBaseScale = this.item.scale;
    this.telegraph(current.category);
    if (motionAllowed()) {
      this.item.setScale(0);
      this.tweens.add({ targets: this.item, scale: this.itemBaseScale, duration: 320, ease: 'Back.easeOut' });
    }
  }

  // Prefer Codex's Hearthlight item art (matched by id); fall back to the CC0 category sprite.
  private itemKeyFor(item: { id: string; category: RecyclingCategory }): string {
    const pascal = item.id.split('-').map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join('');
    const hl = `hl.prop.item${pascal}`;
    return hasTexture(this, hl) ? hl : ITEM_KEY[item.category];
  }

  // Gently glow the correct bin so a pre-reader is guided (No-Fail: you can't truly fail, only learn).
  private telegraph(category: RecyclingCategory): void {
    this.bins.forEach((bin) => {
      this.tweens.killTweensOf(bin.glow);
      const isTarget = bin.category === category;
      bin.glow.setAlpha(0);
      if (isTarget && motionAllowed()) {
        this.tweens.add({ targets: bin.glow, alpha: 0.22, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
      } else if (isTarget) {
        bin.glow.setAlpha(0.18);
      }
    });
  }

  private springHome(): void {
    if (!motionAllowed()) {
      this.item.setPosition(HOME.x, HOME.y);
      return;
    }
    this.tweens.add({ targets: this.item, x: HOME.x, y: HOME.y, scale: this.itemBaseScale, duration: 360, ease: 'Back.easeOut' });
  }

  private moveSelection(delta: number): void {
    if (!delta || this.done) return;
    this.selected = Math.max(0, Math.min(this.bins.length - 1, this.selected + delta));
    this.bins.forEach((bin, i) => bin.panel.setStrokeStyle(4, 0xffc857, i === this.selected ? 1 : 0.5));
  }

  private requestExit(): void {
    confirmMissionExit(this, () => returnToTownMap(this));
  }
}
