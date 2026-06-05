import Phaser from 'phaser';
import { fadeInScene } from '../systems/SceneTransitions';
import { recyclingItems, recyclingItemTextureKey, reuseBlueprints, reusePartKindLabels } from '../data/recyclingItems';
import { getSaveSystem, getSfx, getVoice } from '../systems/GameServices';
import { bindIntents } from '../systems/bindIntents';
import { registerE2EButton } from '../systems/E2EBridge';
import { Juice } from '../systems/Juice';
import { completeMission, returnToTownMap } from '../systems/SceneNavigation';
import { confirmMissionExit, isMissionExitOpen } from '../systems/confirmMissionExit';
import { isOverlayOpen } from '../systems/overlayLock';
import {
  chooseRecyclingItems,
  chooseReuseBlueprints,
  createRecyclingRunState,
  getActiveRecyclingCategories,
  getActiveReusePartKinds,
  getRecyclingRunResult,
  tryReusePart,
  type RecyclingItem,
  type RecyclingRunState,
  type ReuseBlueprint,
  type ReuseChoice,
} from '../systems/RecyclingRun';
import { addIconButton } from '../ui/Button';
import { bindPress } from '../ui/press';
import { FONTS } from '../ui/typography';
import { hasTexture, motionAllowed } from '../ui/Sprite';
import { playMissionIntro } from '../ui/MissionIntro';
import { missionRegistry } from '../systems/GameServices';

type ChoiceCard = {
  itemId: string;
  panel: Phaser.GameObjects.Rectangle;
  icon: Phaser.GameObjects.Image;
  label: Phaser.GameObjects.Text;
  x: number;
  y: number;
};

type SlotView = {
  slotId: string;
  ring: Phaser.GameObjects.Ellipse;
  label: Phaser.GameObjects.Text;
  pieces: Phaser.GameObjects.GameObject[];
  x: number;
  y: number;
};

const FALLBACK_ITEM_KEY: Record<RecyclingItem['category'], string> = {
  compost: 'props.recycling-compost',
  metal: 'props.recycling-metal',
  paper: 'props.recycling-paper',
  plastic: 'props.recycling-plastic',
  trash: 'props.recycling-trash',
};

const WORKSHOP = {
  blueprintX: 488,
  blueprintY: 228,
  choiceY: 438,
};

export class RecyclingRunScene extends Phaser.Scene {
  private state!: RecyclingRunState;
  private choiceCards: ChoiceCard[] = [];
  private slotViews: SlotView[] = [];
  private pips: Phaser.GameObjects.Arc[] = [];
  private title!: Phaser.GameObjects.Text;
  private problem!: Phaser.GameObjects.Text;
  private prompt!: Phaser.GameObjects.Text;
  private inventionName!: Phaser.GameObjects.Text;
  private selected = 0;
  private done = false;

  constructor() {
    super('RecyclingRunScene');
  }

  create(): void {
    fadeInScene(this);
    const profile = getSaveSystem().getSelectedProfile();
    const difficulty = profile?.settings.difficulty ?? 'helper';
    const activeKinds = getActiveReusePartKinds(difficulty);
    this.state = createRecyclingRunState(
      difficulty,
      chooseRecyclingItems(recyclingItems, getActiveRecyclingCategories(difficulty), 12),
      chooseReuseBlueprints(reuseBlueprints, activeKinds, difficulty === 'normal' ? 3 : 2),
    );
    this.choiceCards = [];
    this.slotViews = [];
    this.pips = [];
    this.selected = 0;
    this.done = false;

    this.paintWorld();
    this.buildHeader();
    this.buildBlueprintStage();
    this.buildPips();
    this.buildChoices();

    addIconButton(this, { x: 52, y: 46, size: 56, key: 'hl.ui.back', onPress: () => this.requestExit(), testId: 'recycling.back-to-map' }).setDepth(60);

    bindIntents(this, {
      onMove: (x, y) => !this.overlayBusy() && this.moveSelection(x || y),
      onConfirm: () => !this.overlayBusy() && this.attemptChoice(this.state.choices[this.selected]?.id),
      onBack: () => !isOverlayOpen(this) && this.requestExit(),
    });

    this.renderWorkshop();

    const panel = missionRegistry.get('recycling-run')?.introPanels[0];
    // A "build" mission — speak its mission-start line when the intro veil lifts (P4-02).
    const speakStart = (): void => getVoice().speak('mission-start-build');
    if (panel) playMissionIntro(this, { ...panel, characterId: 'rivet' }, speakStart);
    else speakStart();
  }

  private paintWorld(): void {
    this.add.image(480, 270, 'hl.bg.recycle').setDisplaySize(960, 540).setDepth(0);
    this.add.rectangle(480, 270, 960, 540, 0x101b2e, 0.3).setDepth(1);
    this.add.rectangle(480, 34, 960, 76, 0x101b2e, 0.48).setDepth(2);
    this.add.rectangle(480, 496, 960, 88, 0x101b2e, 0.48).setDepth(2);

    // Rivet is no longer a recycling mascot planted by bins; he is the inventor at the bench.
    this.add.ellipse(842, 350, 86, 20, 0x0a1322, 0.55).setDepth(8);
    this.add.image(842, 352, 'hl.char.rivet').setOrigin(0.5, 1).setDisplaySize(116, 116).setDepth(10);
    this.add
      .text(842, 386, 'Rivet sees\ntreasure!', { fontFamily: FONTS.display, fontSize: '18px', color: '#FFE2A6', stroke: '#2A1606', strokeThickness: 4, align: 'center' })
      .setOrigin(0.5)
      .setDepth(12);

    this.add.rectangle(WORKSHOP.blueprintX, WORKSHOP.blueprintY + 18, 438, 250, 0x16243a, 0.9).setStrokeStyle(4, 0xffc857, 0.8).setDepth(4);
    if (hasTexture(this, 'hl.prop.blueprintFrame')) this.add.image(WORKSHOP.blueprintX, WORKSHOP.blueprintY + 18, 'hl.prop.blueprintFrame').setDisplaySize(420, 244).setDepth(5).setAlpha(0.78);
    this.add.rectangle(WORKSHOP.blueprintX, WORKSHOP.blueprintY + 18, 384, 196, 0x3a4d6b, 0.2).setDepth(6);
  }

  private buildHeader(): void {
    this.title = this.add
      .text(480, 34, "Rivet's Reuse Workshop", { fontFamily: FONTS.display, fontSize: '30px', color: '#FFE2A6', fontStyle: 'bold', stroke: '#2A1606', strokeThickness: 6 })
      .setOrigin(0.5)
      .setDepth(20);
    this.problem = this.add
      .text(480, 84, '', { fontFamily: FONTS.display, fontSize: '19px', color: '#EBDDDA', stroke: '#2A1606', strokeThickness: 4, align: 'center', wordWrap: { width: 680 } })
      .setOrigin(0.5)
      .setDepth(20);
    this.prompt = this.add
      .text(480, 356, '', { fontFamily: FONTS.display, fontSize: '21px', color: '#FFC857', stroke: '#2A1606', strokeThickness: 5, align: 'center', wordWrap: { width: 680 } })
      .setOrigin(0.5)
      .setDepth(20);
  }

  private buildBlueprintStage(): void {
    this.inventionName = this.add
      .text(WORKSHOP.blueprintX, 132, '', { fontFamily: FONTS.display, fontSize: '24px', color: '#FFE2A6', fontStyle: 'bold', stroke: '#2A1606', strokeThickness: 5 })
      .setOrigin(0.5)
      .setDepth(20);
  }

  private buildPips(): void {
    const total = this.state.blueprints.length;
    const gap = 34;
    const startX = 480 - ((total - 1) * gap) / 2;
    for (let i = 0; i < total; i += 1) {
      this.pips.push(this.add.circle(startX + i * gap, 522, 8, 0x3a4a66).setStrokeStyle(2, 0x1b2a41).setDepth(25));
    }
  }

  private buildChoices(): void {
    const startX = 240;
    const gap = 240;
    for (let index = 0; index < 3; index += 1) {
      const x = startX + index * gap;
      const panel = this.add.rectangle(x, WORKSHOP.choiceY, 184, 122, 0x16243a, 0.92).setStrokeStyle(4, 0xffc857, 0.5).setDepth(30);
      const icon = this.add.image(x, WORKSHOP.choiceY - 22, FALLBACK_ITEM_KEY.trash).setDisplaySize(58, 58).setDepth(31);
      const label = this.add
        .text(x, WORKSHOP.choiceY + 38, '', { fontFamily: FONTS.display, fontSize: '17px', color: '#FFE2A6', stroke: '#2A1606', strokeThickness: 4, align: 'center', wordWrap: { width: 160 } })
        .setOrigin(0.5)
        .setDepth(31);
      panel.setInteractive({ useHandCursor: true });
      bindPress(panel, { onConfirm: () => !isMissionExitOpen(this) && this.attemptChoice(this.state.choices[index]?.id) });
      this.choiceCards.push({ itemId: '', panel, icon, label, x, y: WORKSHOP.choiceY });
    }
  }

  private renderWorkshop(): void {
    const blueprint = this.state.currentBlueprint;
    if (!blueprint) return;

    this.problem.setText(blueprint.problem);
    this.inventionName.setText(blueprint.title);
    this.prompt.setText(this.promptForCurrentSlot());
    this.renderSlots(blueprint);
    this.renderChoiceCards();
    this.updatePips();
  }

  private renderSlots(blueprint: ReuseBlueprint): void {
    this.slotViews.forEach((view) => {
      view.ring.destroy();
      view.label.destroy();
      view.pieces.forEach((piece) => piece.destroy());
    });
    this.slotViews = [];

    blueprint.slots.forEach((slot, index) => {
      const placed = this.state.placedParts.find((part) => part.slotId === slot.id);
      const isCurrent = this.state.currentSlot?.id === slot.id;
      const ring = this.add.ellipse(slot.x, slot.y, 92, 72, placed ? 0x43a29c : 0x1b2a41, placed ? 0.85 : 0.52).setStrokeStyle(4, isCurrent ? 0xffc857 : 0xebddda, isCurrent ? 1 : 0.5).setDepth(14);
      const label = this.add
        .text(slot.x, slot.y + 62, placed ? placed.item.partLabel : `${index + 1}. ${slot.label}`, { fontFamily: FONTS.display, fontSize: '16px', color: '#FFE2A6', stroke: '#2A1606', strokeThickness: 4, align: 'center', wordWrap: { width: 140 } })
        .setOrigin(0.5)
        .setDepth(16);
      const pieces: Phaser.GameObjects.GameObject[] = [];
      if (placed) {
        pieces.push(this.add.image(slot.x, slot.y - 4, this.itemKeyFor(placed.item)).setDisplaySize(60, 60).setDepth(15).setAlpha(placed.assisted ? 0.82 : 1));
      } else {
        pieces.push(this.add.text(slot.x, slot.y - 5, '?', { fontFamily: FONTS.display, fontSize: '36px', color: '#FFC857', stroke: '#2A1606', strokeThickness: 5 }).setOrigin(0.5).setDepth(15));
      }
      this.slotViews.push({ slotId: slot.id, ring, label, pieces, x: slot.x, y: slot.y });
    });
  }

  private renderChoiceCards(): void {
    this.choiceCards.forEach((card, index) => {
      const choice = this.state.choices[index];
      if (!choice) {
        card.panel.setVisible(false);
        card.icon.setVisible(false);
        card.label.setVisible(false);
        return;
      }
      card.itemId = choice.id;
      card.panel.setVisible(true).setStrokeStyle(4, 0xffc857, index === this.selected ? 1 : 0.42);
      card.icon.setVisible(true).setTexture(this.itemKeyFor(choice)).setDisplaySize(58, 58);
      card.label.setVisible(true).setText(choice.label);
      registerE2EButton({ testId: `recycling.choice.${index}`, label: choice.label, sceneKey: this.scene.key, press: () => this.attemptChoice(choice.id) });
    });
  }

  private attemptChoice(itemId: string | undefined): void {
    if (!itemId || this.done) return;
    const outcome = tryReusePart(this.state, itemId);
    this.state = outcome.state;

    if (outcome.decorated) this.decorateWithWrongPiece(itemId);
    if (outcome.placedPart) this.sparkSlot(outcome.placedPart.slotId, outcome.assisted ? 0xf4a24c : 0x43a29c);

    if (outcome.correct || outcome.assisted) {
      getSfx().play('correct');
    } else {
      getSfx().play('try-again');
    }

    if (outcome.completedBlueprint) {
      this.testInvention(outcome.completedBlueprint);
    } else {
      this.prompt.setText(outcome.message || this.promptForCurrentSlot());
      this.renderWorkshop();
    }

    if (outcome.completed) {
      this.done = true;
      this.time.delayedCall(motionAllowed() ? 900 : 0, () => completeMission(this, getRecyclingRunResult(this.state)));
    }
  }

  private decorateWithWrongPiece(itemId: string): void {
    const item = this.state.items.find((candidate) => candidate.id === itemId);
    if (!item) return;
    const x = 300 + (this.state.decoratedParts.length % 6) * 34;
    const y = 138 + (this.state.decoratedParts.length % 2) * 34;
    const deco = this.add.image(x, y, this.itemKeyFor(item)).setDisplaySize(28, 28).setDepth(18).setAlpha(0.88);
    if (motionAllowed()) this.tweens.add({ targets: deco, angle: 10, yoyo: true, repeat: 3, duration: 100 });
  }

  private sparkSlot(slotId: string, color: number): void {
    const slot = this.slotViews.find((view) => view.slotId === slotId);
    if (!slot) return;
    Juice.burst(this, slot.x, slot.y, { color, count: 10 });
    if (motionAllowed()) Juice.punch(this, slot.ring, 1.1, 130);
  }

  private testInvention(blueprint: ReuseBlueprint): void {
    this.renderWorkshop();
    this.prompt.setText(blueprint.testMessage);
    const x = WORKSHOP.blueprintX;
    const y = WORKSHOP.blueprintY + 18;
    const burstColor = blueprint.id === 'bubble-sprinkler' ? 0x43a29c : blueprint.id === 'moon-chime' ? 0xffc857 : 0xf4a24c;
    Juice.burst(this, x, y, { color: burstColor, count: 16 });
    if (motionAllowed()) {
      const invention = this.add.text(x, y - 10, '✨', { fontSize: '56px' }).setOrigin(0.5).setDepth(40);
      this.tweens.add({ targets: invention, y: y - 52, alpha: 0, scale: 1.6, duration: 760, ease: 'Quad.easeOut', onComplete: () => invention.destroy() });
    }
    this.time.delayedCall(motionAllowed() ? 760 : 0, () => {
      if (!this.done) this.renderWorkshop();
    });
  }

  private promptForCurrentSlot(): string {
    const slot = this.state.currentSlot;
    if (!slot) return 'Test the invention!';
    return `Choose ${reusePartKindLabels[slot.kind]} for ${slot.label}.`;
  }

  private updatePips(): void {
    this.pips.forEach((pip, i) => {
      const done = i < this.state.currentBlueprintIndex;
      pip.setFillStyle(done ? 0xffc857 : 0x3a4a66);
      if (done && motionAllowed()) Juice.punch(this, pip, 1.35, 120);
    });
  }

  private itemKeyFor(item: { id: string; category: RecyclingItem['category'] }): string {
    const hl = recyclingItemTextureKey(item.id);
    return hasTexture(this, hl) ? hl : FALLBACK_ITEM_KEY[item.category];
  }

  private moveSelection(delta: number): void {
    if (!delta || this.done) return;
    this.selected = Math.max(0, Math.min(this.state.choices.length - 1, this.selected + delta));
    this.renderChoiceCards();
  }

  // CF-1: ignore confirm/move intents while the intro veil covers the workshop or the exit modal is up.
  private overlayBusy(): boolean {
    return isMissionExitOpen(this) || isOverlayOpen(this);
  }

  private requestExit(): void {
    confirmMissionExit(this, () => returnToTownMap(this));
  }
}
