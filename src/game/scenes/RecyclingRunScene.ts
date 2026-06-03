import Phaser from 'phaser';
import { fadeInScene } from '../systems/SceneTransitions';
import { recyclingCategoryIcons, recyclingCategoryLabels, recyclingItems } from '../data/recyclingItems';
import { getSaveSystem } from '../systems/GameServices';
import { inputIntentFromGamepadButton, inputIntentFromKeyboard } from '../systems/InputIntent';
import {
  chooseRecyclingItems,
  createRecyclingRunState,
  getActiveRecyclingCategories,
  getRecyclingRunResult,
  sortCurrentRecyclingItem,
  type RecyclingCategory,
  type RecyclingRunState,
} from '../systems/RecyclingRun';
import { addButton } from '../ui/Button';
import { addBody, addTitle } from '../ui/SceneText';

export class RecyclingRunScene extends Phaser.Scene {
  private state: RecyclingRunState | null = null;
  private selectedCategoryIndex = 0;

  constructor() {
    super('RecyclingRunScene');
  }

  init(data: { state?: RecyclingRunState; selectedCategoryIndex?: number }): void {
    this.state = data.state ?? null;
    this.selectedCategoryIndex = data.selectedCategoryIndex ?? 0;
  }

  create(): void {
    fadeInScene(this);
    this.cameras.main.setBackgroundColor('#e7fff2');
    const profile = getSaveSystem().getSelectedProfile();
    const difficulty = profile?.settings.difficulty ?? 'helper';
    if (!this.state) {
      this.state = createRecyclingRunState(
        difficulty,
        chooseRecyclingItems(recyclingItems, getActiveRecyclingCategories(difficulty), 10),
      );
    }

    const state = this.state;
    const item = state.currentItem;
    addTitle(this, "Rivet's Recycling Run");
    addBody(this, 104, `Sort 10 town items. Progress: ${state.sorted}/10 • Attempts: ${state.attempts}`);

    if (!item) {
      this.completeMission();
      return;
    }

    this.add
      .text(480, 205, `${item.icon}\n${item.label}`, {
        fontFamily: 'Trebuchet MS, Arial, sans-serif',
        fontSize: '44px',
        color: '#203247',
        align: 'center',
      })
      .setOrigin(0.5);

    if (state.lastHint) {
      addBody(this, 300, `Hint: ${state.lastHint}`);
    } else {
      addBody(this, 300, 'Choose the bin that matches the item. Mistakes just give hints.');
    }

    state.activeCategories.forEach((category, index) => {
      const selected = index === this.selectedCategoryIndex ? '▶ ' : '';
      addButton(this, {
        x: 110 + index * 180,
        y: 400,
        width: 165,
        height: 92,
        label: `${selected}${recyclingCategoryIcons[category]}\n${recyclingCategoryLabels[category]}`,
        fill: index === this.selectedCategoryIndex ? 0xfff4bf : 0xffffff,
        onPress: () => this.chooseCategory(category, index),
      });
    });

    addButton(this, {
      x: 130,
      y: 515,
      width: 200,
      height: 52,
      label: 'Back to Map',
      fill: 0xffffff,
      onPress: () => this.scene.start('TownMapScene'),
    });

    this.input.keyboard?.on('keydown', (event: KeyboardEvent) => {
      const intent = inputIntentFromKeyboard(event.key);
      if (intent?.type === 'move') this.moveSelection(intent.x || intent.y, state.activeCategories.length);
      if (intent?.type === 'confirm' || intent?.type === 'action') {
        this.chooseCategory(state.activeCategories[this.selectedCategoryIndex] ?? state.activeCategories[0], this.selectedCategoryIndex);
      }
      if (intent?.type === 'back') this.scene.start('TownMapScene');
    });

    this.input.gamepad?.on('down', (_pad: unknown, button: { index: number }) => {
      const intent = inputIntentFromGamepadButton(button.index);
      if (intent?.type === 'move') this.moveSelection(intent.x || intent.y, state.activeCategories.length);
      if (intent?.type === 'confirm' || intent?.type === 'action') {
        this.chooseCategory(state.activeCategories[this.selectedCategoryIndex] ?? state.activeCategories[0], this.selectedCategoryIndex);
      }
      if (intent?.type === 'back') this.scene.start('TownMapScene');
    });
  }

  private moveSelection(delta: number, count: number): void {
    if (delta === 0) return;
    this.selectedCategoryIndex = Math.max(0, Math.min(count - 1, this.selectedCategoryIndex + delta));
    this.scene.restart({ state: this.state, selectedCategoryIndex: this.selectedCategoryIndex });
  }

  private chooseCategory(category: RecyclingCategory | undefined, selectedCategoryIndex: number): void {
    if (!this.state || !category) return;
    const outcome = sortCurrentRecyclingItem(this.state, category);
    if (outcome.completed) {
      this.state = outcome.state;
      this.completeMission();
      return;
    }
    this.scene.restart({
      state: outcome.state,
      selectedCategoryIndex: outcome.correct ? 0 : selectedCategoryIndex,
    });
  }

  private completeMission(): void {
    if (!this.state) return;
    this.scene.start('MissionCompleteScene', { result: getRecyclingRunResult(this.state) });
  }
}
