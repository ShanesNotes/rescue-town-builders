import Phaser from 'phaser';
import { fadeInScene } from '../systems/SceneTransitions';
import { houseBlueprints } from '../data/houseBlueprints';
import { bindIntents } from '../systems/bindIntents';
import { registerE2EButton, isE2EEnabled } from '../systems/E2EBridge';
import { Juice } from '../systems/Juice';
import { completeMission, returnToTownMap } from '../systems/SceneNavigation';
import { confirmMissionExit, isMissionExitOpen } from '../systems/confirmMissionExit';
import { getSfx } from '../systems/GameServices';
import { createSecretsForProfile, addSecretHotspot } from '../systems/secretHotspot';
import {
  createHouseBuilderState,
  getHouseBuilderResult,
  placeHousePart,
  type HouseBlueprint,
  type HouseBuilderState,
  type HousePartId,
} from '../systems/HouseBuilder';
import { addIconButton } from '../ui/Button';
import { FONTS } from '../ui/typography';
import { hasTexture, motionAllowed } from '../ui/Sprite';
import { playMissionIntro } from '../ui/MissionIntro';
import { missionRegistry } from '../systems/GameServices';

const PART_KEY: Record<HousePartId, string> = {
  foundation: 'hl.prop.houseFoundation',
  walls: 'hl.prop.houseWall',
  roof: 'hl.prop.houseRoof',
  door: 'hl.prop.houseDoor',
  decoration: 'hl.prop.houseDecoration',
};
const FALLBACK_KEY: Record<HousePartId, string> = {
  foundation: 'props.house-foundation',
  walls: 'props.house-walls',
  roof: 'props.house-roof',
  door: 'props.house-door',
  decoration: 'props.house-decoration',
};
const PART_LABEL: Record<HousePartId, string> = { foundation: 'Base', walls: 'Walls', roof: 'Roof', door: 'Door', decoration: 'Bloom' };
// Where each part lands in the assembled cottage.
const SLOT: Record<HousePartId, { x: number; y: number; w: number; h: number }> = {
  foundation: { x: 480, y: 322, w: 198, h: 46 },
  walls: { x: 480, y: 272, w: 158, h: 104 },
  roof: { x: 480, y: 204, w: 210, h: 88 },
  door: { x: 480, y: 298, w: 50, h: 66 },
  decoration: { x: 558, y: 310, w: 56, h: 56 },
};
const ORDER: HousePartId[] = ['foundation', 'walls', 'roof', 'door', 'decoration'];

type TrayView = {
  id: HousePartId;
  frame: Phaser.GameObjects.Rectangle;
  part: Phaser.GameObjects.Image;
  label: Phaser.GameObjects.Text;
  arrow: Phaser.GameObjects.Text;
  base: number;
  pulse?: Phaser.Tweens.Tween;
  arrowPulse?: Phaser.Tweens.Tween;
};

export class HouseBuilderScene extends Phaser.Scene {
  private state!: HouseBuilderState;
  private slots = new Map<HousePartId, Phaser.GameObjects.Image>();
  private trays: TrayView[] = [];
  private telegraph!: Phaser.GameObjects.Rectangle;
  private hint!: Phaser.GameObjects.Text;
  private pips: Phaser.GameObjects.Arc[] = [];
  private selected = 0;
  private done = false;

  constructor() {
    super('HouseBuilderScene');
  }

  create(): void {
    fadeInScene(this);
    this.state = createHouseBuilderState(houseBlueprints);
    this.slots = new Map();
    this.trays = [];
    this.pips = [];
    this.selected = 0;
    this.done = false;

    this.paintWorld();
    this.buildPips();

    // A blueprint pad behind the build area — reads "build here, here's the plan" against the busy lot.
    this.add.rectangle(480, 252, 372, 360, 0x0e1a2e, 0.5).setDepth(3);
    if (hasTexture(this, 'hl.prop.blueprintFrame')) {
      this.add.image(480, 252, 'hl.prop.blueprintFrame').setDisplaySize(360, 360).setDepth(4).setAlpha(0.92);
    }

    // The cottage assembling: each part sits faint in its slot until placed, then snaps in solid.
    this.telegraph = this.add.rectangle(0, 0, 10, 10, 0xffd98a, 0).setBlendMode(Phaser.BlendModes.ADD).setDepth(5);
    ORDER.forEach((id) => {
      const s = SLOT[id];
      const key = hasTexture(this, PART_KEY[id]) ? PART_KEY[id] : FALLBACK_KEY[id];
      const img = this.add.image(s.x, s.y, key).setDisplaySize(s.w, s.h).setDepth(6);
      this.slots.set(id, img);
    });

    // Brick watches, planted on the right.
    this.add.ellipse(860, 392, 70, 18, 0x0a1322, 0.5).setDepth(9);
    this.add.image(860, 392, 'hl.char.brick').setOrigin(0.5, 1).setDisplaySize(98, 98).setDepth(10);

    this.hint = this.add
      .text(480, 372, '', { fontFamily: FONTS.display, fontSize: '20px', color: '#FFE2A6', stroke: '#2A1606', strokeThickness: 5, align: 'center', wordWrap: { width: 520 } })
      .setOrigin(0.5)
      .setDepth(22);

    this.buildTray();

    addIconButton(this, { x: 52, y: 46, size: 56, key: 'hl.ui.back', onPress: () => this.requestExit(), testId: 'house.back-to-map' }).setDepth(40);

    // Hidden Light: a quiet glimmer holding a loved one's words (1 touch).
    const secrets = createSecretsForProfile();
    addSecretHotspot(this, secrets, 'hidden-light', 888, 268);

    bindIntents(this, {
      onMove: (x, y) => this.moveSelection(x || y),
      onConfirm: () => !isMissionExitOpen(this) && this.placePart(ORDER[this.selected]),
      onBack: () => this.requestExit(),
    });

    this.render();

    const panel = missionRegistry.get('house-builder')?.introPanels[0];
    if (panel) playMissionIntro(this, { ...panel, characterId: 'brick' }, () => undefined);
  }

  private paintWorld(): void {
    this.add.image(480, 270, 'hl.bg.build').setDisplaySize(960, 540).setDepth(0);
    this.add.rectangle(480, 270, 960, 540, 0x101b2e, 0.2).setDepth(1);
    this.add.rectangle(480, 30, 960, 70, 0x101b2e, 0.4).setDepth(1);
  }

  private buildPips(): void {
    const total = this.state.blueprints.length;
    const gap = 30;
    const startX = 480 - ((total - 1) * gap) / 2;
    for (let i = 0; i < total; i += 1) {
      this.pips.push(this.add.circle(startX + i * gap, 40, 8, 0x3a4a66).setStrokeStyle(2, 0x1b2a41).setDepth(20));
    }
  }

  private buildTray(): void {
    const xs = [150, 312, 474, 636, 798];
    ORDER.forEach((id, index) => {
      const x = xs[index];
      const y = 470;
      const key = hasTexture(this, PART_KEY[id]) ? PART_KEY[id] : FALLBACK_KEY[id];
      const frame = this.add.rectangle(x, y, 132, 108, 0x16243a, 0.78).setStrokeStyle(3, 0xffc857, 0.7).setDepth(15);
      const part = this.add.image(x, y - 8, key).setDisplaySize(72, 72).setDepth(17);
      const label = this.add.text(x, y + 40, PART_LABEL[id], { fontFamily: FONTS.display, fontSize: '16px', color: '#FFE2A6', fontStyle: 'bold', stroke: '#2A1606', strokeThickness: 3 }).setOrigin(0.5).setDepth(17);
      // A bobbing finger above the tray piece a child should grab next (hidden until it's active).
      const arrow = this.add.text(x, y - 64, '👇', { fontSize: '34px' }).setOrigin(0.5).setDepth(18).setVisible(false);
      const baseScale = part.scale;
      part.setData('home', { x, y: y - 8 }).setData('id', id).setData('base', baseScale);
      part.setInteractive({ useHandCursor: true, draggable: true });
      this.input.setDraggable(part);
      part.on('pointerup', () => !this.draggingThisFrame && this.placePart(id)); // tap-to-place
      registerE2EButton({ testId: `house.part.${id}`, label: id, sceneKey: this.scene.key, press: () => this.placePart(id) });
      this.trays.push({ id, frame, part, label, arrow, base: baseScale });
    });
    this.wireDrag();
  }

  // Show the child WHICH tray piece to grab for the current ordered part: the required one gets a
  // gold stroke + gentle scale-pulse + a bobbing finger; the rest dim back so the eye is unambiguous.
  private updateTrayHighlight(): void {
    const activeId = this.done ? undefined : ORDER[this.state.currentPartIndex];
    this.trays.forEach((tray) => {
      const active = tray.id === activeId;
      // Stop only the looping highlight tweens — NOT a springTray return tween that may still be
      // animating a just-dropped piece home (killTweensOf(part) used to strand it at the drop point).
      tray.pulse?.stop();
      tray.pulse = undefined;
      tray.arrowPulse?.stop();
      tray.arrowPulse = undefined;
      tray.part.setScale(tray.base);
      if (active) {
        tray.frame.setStrokeStyle(5, 0xffe27a, 1);
        tray.part.setAlpha(1);
        tray.label.setAlpha(1);
        tray.arrow.setVisible(true).setAlpha(1).setY(tray.part.y - 56);
        if (motionAllowed()) {
          tray.pulse = this.tweens.add({ targets: tray.part, scale: tray.base * 1.12, duration: 620, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
          tray.arrowPulse = this.tweens.add({ targets: tray.arrow, y: tray.arrow.y + 12, duration: 520, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
        }
      } else {
        tray.frame.setStrokeStyle(3, 0xffc857, 0.5);
        tray.part.setAlpha(0.6);
        tray.label.setAlpha(0.6);
        tray.arrow.setVisible(false);
      }
    });
  }

  private draggingThisFrame = false;

  private wireDrag(): void {
    this.input.on('dragstart', (_p: Phaser.Input.Pointer, obj: Phaser.GameObjects.Image) => {
      if (this.done) return;
      this.draggingThisFrame = true;
      obj.setDepth(45);
      if (motionAllowed()) this.tweens.add({ targets: obj, scale: (obj.getData('base') as number) * 1.12, duration: 110, ease: 'Quad.easeOut' });
    });
    this.input.on('drag', (_p: Phaser.Input.Pointer, obj: Phaser.GameObjects.Image, dragX: number, dragY: number) => {
      if (this.done) return;
      obj.setPosition(dragX, dragY);
    });
    this.input.on('dragend', (_p: Phaser.Input.Pointer, obj: Phaser.GameObjects.Image) => {
      const overHouse = obj.x > 300 && obj.x < 660 && obj.y > 130 && obj.y < 390;
      this.springTray(obj);
      if (overHouse && !this.done) this.placePart(obj.getData('id') as HousePartId);
      this.time.delayedCall(40, () => (this.draggingThisFrame = false));
    });
  }

  private springTray(obj: Phaser.GameObjects.Image): void {
    const home = obj.getData('home') as { x: number; y: number };
    const base = obj.getData('base') as number;
    obj.setDepth(17);
    if (!motionAllowed()) {
      obj.setPosition(home.x, home.y).setScale(base);
      return;
    }
    this.tweens.add({ targets: obj, x: home.x, y: home.y, scale: base, duration: 300, ease: 'Back.easeOut' });
  }

  private placePart(id: HousePartId | undefined): void {
    if (!id || this.done) return;
    const prevHouses = this.state.housesBuilt;
    const placedId = this.state.currentPart?.id;
    const placedAccent = this.state.currentHouse?.accent; // capture BEFORE state advances to the next house
    const outcome = placeHousePart(this.state, id);
    this.state = outcome.state;

    if (!outcome.correct) {
      getSfx().play('try-again');
      this.hint.setText('Almost — try the glowing piece.');
      return;
    }

    getSfx().play('place');
    this.hint.setText('');
    if (placedId) this.snapSlot(placedId, placedAccent);

    const houseFinished = this.state.housesBuilt > prevHouses;
    if (houseFinished) this.celebrateHouse(placedAccent);
    this.render();

    if (outcome.completed) {
      this.done = true;
      this.time.delayedCall(motionAllowed() ? 420 : 0, () => completeMission(this, getHouseBuilderResult(this.state)));
      return;
    }
    // Between houses, a short title card announces the next build (P3-03).
    if (houseFinished && this.state.currentHouse) this.showHouseTitleCard(this.state.currentHouse);
  }

  private snapSlot(id: HousePartId, accent: number | undefined): void {
    const slot = this.slots.get(id);
    if (!slot) return;
    this.applyAccent(slot, id, accent);
    Juice.squashStretch(this, slot, 0.18, 150);
    Juice.burst(this, slot.x, slot.y, { color: accent ?? 0xd9c2a0, count: 7, radius: 36 });
  }

  // Each house carries its own accent so they don't all look identical (P3-03): the roof + bloom take
  // the house's tint; structural parts stay neutral so the cottage still reads as a house.
  private applyAccent(slot: Phaser.GameObjects.Image, id: HousePartId, accent: number | undefined): void {
    if (accent !== undefined && (id === 'roof' || id === 'decoration')) slot.setTint(accent).setAlpha(1);
    else slot.clearTint().setAlpha(1);
  }

  private celebrateHouse(accent: number | undefined): void {
    if (!motionAllowed()) return;
    const glow = this.add.circle(480, 260, 150, accent ?? 0xffc14a, 0.26).setBlendMode(Phaser.BlendModes.ADD).setDepth(8);
    this.tweens.add({ targets: glow, scale: 1.3, alpha: 0, duration: 700, ease: 'Quad.easeOut', onComplete: () => glow.destroy() });
    const ghostKey = hasTexture(this, 'hl.prop.housePreview') ? 'hl.prop.housePreview' : null;
    if (ghostKey) {
      const ghost = this.add.image(480, 322, ghostKey).setOrigin(0.5, 1).setDisplaySize(220, 220).setDepth(9);
      ghost.setScale(ghost.scale * 0.9);
      this.tweens.add({ targets: ghost, scale: ghost.scale * 1.16, alpha: 0, duration: 760, ease: 'Back.easeOut', onComplete: () => ghost.destroy() });
    }
    Juice.shake(this, 120, 0.003);
    Juice.confetti(this, 28);
  }

  // A short title card between houses so each variant feels like a fresh build, not a repeat (P3-03):
  // "Now build: Rainbow Nook!" with a tiny accent-tinted preview silhouette + Brick pointing. Reuses
  // the Wave-3 intro pattern (scrim + big title + helper). Never blocks logic; e2e skips it.
  private showHouseTitleCard(house: HouseBlueprint): void {
    if (isE2EEnabled()) return;
    const depth = 800;
    const objects: Phaser.GameObjects.GameObject[] = [];
    objects.push(this.add.rectangle(480, 270, 960, 540, 0x10243a, 0.6).setDepth(depth).setInteractive());
    objects.push(
      this.add
        .text(480, 168, 'Now build:', { fontFamily: FONTS.display, fontSize: '26px', color: '#EBDDDA', stroke: '#2A1606', strokeThickness: 5 })
        .setOrigin(0.5)
        .setDepth(depth + 1),
    );
    objects.push(
      this.add
        .text(480, 214, `${house.title}!`, { fontFamily: FONTS.display, fontSize: '42px', color: '#FFE2A6', fontStyle: 'bold', stroke: '#2A1606', strokeThickness: 7, align: 'center', wordWrap: { width: 760 } })
        .setOrigin(0.5)
        .setDepth(depth + 1),
    );
    // Tiny preview silhouette tinted with the house's accent so the child sees what's coming.
    const previewKey = hasTexture(this, 'hl.prop.housePreview') ? 'hl.prop.housePreview' : null;
    if (previewKey) {
      const preview = this.add.image(480, 360, previewKey).setOrigin(0.5, 1).setDisplaySize(150, 150).setDepth(depth + 1);
      if (house.accent !== undefined) preview.setTint(house.accent);
      objects.push(preview);
      if (motionAllowed()) this.tweens.add({ targets: preview, scale: preview.scale * 1.08, duration: 560, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    }
    // Brick hops in pointing at the next build.
    const brick = this.add.image(720, 400, 'hl.char.brick').setOrigin(0.5, 1).setDisplaySize(120, 120).setDepth(depth + 1);
    objects.push(brick);
    if (motionAllowed()) this.tweens.add({ targets: brick, y: brick.y - 12, duration: 480, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

    const dismiss = (): void => {
      if (!motionAllowed()) {
        objects.forEach((o) => o.destroy());
        return;
      }
      this.tweens.add({ targets: objects, alpha: 0, duration: 240, ease: 'Sine.easeIn', onComplete: () => objects.forEach((o) => o.destroy()) });
    };
    this.time.delayedCall(1500, dismiss);
  }

  // Slots show built parts solid; not-yet-built parts sleep faint + cool. The next part glows.
  private render(): void {
    const placed = this.state.currentPartIndex;
    const accent = this.state.currentHouse?.accent;
    ORDER.forEach((id, i) => {
      const slot = this.slots.get(id);
      if (!slot) return;
      if (i < placed) this.applyAccent(slot, id, accent);
      else slot.setTint(0x9aa6c8).setAlpha(0.4);
    });
    this.updatePips();
    this.placeTelegraph(placed);
    this.updateTrayHighlight();
  }

  private placeTelegraph(placed: number): void {
    const id = ORDER[placed];
    this.tweens.killTweensOf(this.telegraph);
    if (!id || this.done) {
      this.telegraph.setAlpha(0);
      return;
    }
    const s = SLOT[id];
    this.telegraph.setPosition(s.x, s.y).setSize(s.w + 26, s.h + 26).setAlpha(0);
    if (motionAllowed()) this.tweens.add({ targets: this.telegraph, alpha: 0.22, duration: 850, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    else this.telegraph.setAlpha(0.16);
  }

  private updatePips(): void {
    this.pips.forEach((pip, i) => {
      const done = i < this.state.housesBuilt;
      pip.setFillStyle(done ? 0xffc857 : 0x3a4a66);
      if (done && motionAllowed()) Juice.punch(this, pip, 1.4, 120);
    });
  }

  private moveSelection(delta: number): void {
    if (!delta || this.done) return;
    this.selected = Math.max(0, Math.min(ORDER.length - 1, this.selected + delta));
  }

  private requestExit(): void {
    confirmMissionExit(this, () => returnToTownMap(this));
  }
}
