import Phaser from 'phaser';
import { fadeInScene } from '../systems/SceneTransitions';
import { houseBlueprints } from '../data/houseBlueprints';
import { inputIntentFromGamepadButton, inputIntentFromKeyboard } from '../systems/InputIntent';
import {
  createHouseBuilderState,
  getHouseBuilderResult,
  housePartTray,
  placeHousePart,
  type HouseBuilderState,
  type HousePartId,
} from '../systems/HouseBuilder';
import { addButton } from '../ui/Button';
import { addBody, addTitle } from '../ui/SceneText';

export class HouseBuilderScene extends Phaser.Scene {
  private state: HouseBuilderState | null = null;
  private selectedPartIndex = 0;

  constructor() {
    super('HouseBuilderScene');
  }

  init(data: { state?: HouseBuilderState; selectedPartIndex?: number }): void {
    this.state = data.state ?? null;
    this.selectedPartIndex = data.selectedPartIndex ?? 0;
  }

  create(): void {
    fadeInScene(this);
    this.cameras.main.setBackgroundColor('#fff8e6');
    this.state ??= createHouseBuilderState(houseBlueprints);
    const state = this.state;
    const house = state.currentHouse;
    const part = state.currentPart;

    addTitle(this, "Brick's House Builder");
    addBody(this, 105, `Build 3 houses. Complete: ${state.housesBuilt}/3 • Attempts: ${state.attempts}`);

    if (!house || !part) {
      this.completeMission();
      return;
    }

    this.drawHouseGhost(state);
    addBody(this, 290, state.lastHint ?? `Next snap target: ${part.label}`);

    housePartTray.forEach((trayPart, index) => {
      const selected = index === this.selectedPartIndex ? '▶ ' : '';
      addButton(this, {
        x: 115 + index * 180,
        y: 405,
        width: 165,
        height: 84,
        label: `${selected}${trayPart.icon}\n${trayPart.label}`,
        fill: index === this.selectedPartIndex ? 0xfff4bf : 0xffffff,
        onPress: () => this.choosePart(trayPart.id, index),
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
      if (intent?.type === 'move') this.moveSelection(intent.x || intent.y, housePartTray.length);
      if (intent?.type === 'confirm' || intent?.type === 'action') {
        this.choosePart(housePartTray[this.selectedPartIndex]?.id ?? 'foundation', this.selectedPartIndex);
      }
      if (intent?.type === 'back') this.scene.start('TownMapScene');
    });

    this.input.gamepad?.on('down', (_pad: unknown, button: { index: number }) => {
      const intent = inputIntentFromGamepadButton(button.index);
      if (intent?.type === 'move') this.moveSelection(intent.x || intent.y, housePartTray.length);
      if (intent?.type === 'confirm' || intent?.type === 'action') {
        this.choosePart(housePartTray[this.selectedPartIndex]?.id ?? 'foundation', this.selectedPartIndex);
      }
      if (intent?.type === 'back') this.scene.start('TownMapScene');
    });
  }

  private drawHouseGhost(state: HouseBuilderState): void {
    const centerX = 480;
    const y = 170;
    const placed = state.currentPartIndex;
    this.add.text(centerX, y - 40, state.currentHouse?.title ?? 'House', {
      fontFamily: 'Trebuchet MS, Arial, sans-serif',
      fontSize: '26px',
      color: '#203247',
      align: 'center',
    }).setOrigin(0.5);

    const foundationColor = placed > 0 ? 0x8d6e63 : 0xffffff;
    const wallColor = placed > 1 ? 0xffd6a5 : 0xffffff;
    const roofColor = placed > 2 ? 0xff8fab : 0xffffff;
    const doorColor = placed > 3 ? 0x7b4f2f : 0xffffff;
    const decorColor = placed > 4 ? 0x9be7c4 : 0xffffff;

    this.add.rectangle(centerX, y + 76, 240, 24, foundationColor).setStrokeStyle(3, 0x203247);
    this.add.rectangle(centerX, y + 18, 185, 94, wallColor).setStrokeStyle(3, 0x203247);
    this.add.triangle(centerX, y - 70, -115, 70, 115, 70, 0, -15, roofColor).setStrokeStyle(3, 0x203247);
    this.add.rectangle(centerX, y + 46, 42, 55, doorColor).setStrokeStyle(3, 0x203247);
    this.add.circle(centerX + 126, y + 75, 18, decorColor).setStrokeStyle(3, 0x203247);
  }

  private moveSelection(delta: number, count: number): void {
    if (delta === 0) return;
    this.selectedPartIndex = Math.max(0, Math.min(count - 1, this.selectedPartIndex + delta));
    this.scene.restart({ state: this.state, selectedPartIndex: this.selectedPartIndex });
  }

  private choosePart(partId: HousePartId, selectedPartIndex: number): void {
    if (!this.state) return;
    const outcome = placeHousePart(this.state, partId);
    if (outcome.completed) {
      this.state = outcome.state;
      this.completeMission();
      return;
    }
    this.scene.restart({
      state: outcome.state,
      selectedPartIndex: outcome.correct ? 0 : selectedPartIndex,
    });
  }

  private completeMission(): void {
    if (!this.state) return;
    this.scene.start('MissionCompleteScene', { result: getHouseBuilderResult(this.state) });
  }
}
