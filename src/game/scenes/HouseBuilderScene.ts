import Phaser from 'phaser';
import { fadeInScene } from '../systems/SceneTransitions';
import { houseBlueprints } from '../data/houseBlueprints';
import { inputIntentFromGamepadButton, inputIntentFromKeyboard } from '../systems/InputIntent';
import { completeMission, returnToTownMap } from '../systems/SceneNavigation';
import { getSfx } from '../systems/GameServices';
import { createSecretsForProfile, touchSecret, showSecretReveal } from '../systems/secretHotspot';
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
import { addHelperAvatar, addSprite } from '../ui/Sprite';

const housePartSpriteKeys: Record<HousePartId, string> = {
  foundation: 'props.house-foundation',
  walls: 'props.house-walls',
  roof: 'props.house-roof',
  door: 'props.house-door',
  decoration: 'props.house-decoration',
};

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
    addHelperAvatar(this, 'brick', 770, 215, 86, { idle: true, pop: true });
    addBody(this, 290, state.lastHint ?? `Next snap target: ${part.label}`);

    housePartTray.forEach((trayPart, index) => {
      const selected = index === this.selectedPartIndex ? '▶ ' : '';
      const x = 115 + index * 180;
      addSprite(this, {
        key: housePartSpriteKeys[trayPart.id],
        x,
        y: 348,
        width: 48,
        height: 48,
        alpha: index === this.selectedPartIndex ? 1 : 0.84,
        pop: index === this.selectedPartIndex,
      });
      addButton(this, {
        x,
        y: 405,
        width: 165,
        height: 84,
        label: `${selected}${trayPart.icon}\n${trayPart.label}`,
        fill: index === this.selectedPartIndex ? 0xfff4bf : 0xffffff,
        onPress: () => this.choosePart(trayPart.id, index),
        testId: `house.part.${trayPart.id}`,
      });
    });

    addButton(this, {
      x: 130,
      y: 515,
      width: 200,
      height: 52,
      label: 'Back to Map',
      fill: 0xffffff,
      onPress: () => returnToTownMap(this),
      testId: 'house.back-to-map',
    });

    // Hidden Light: a quiet glimmer that holds a loved one's words (1 touch).
    const secrets = createSecretsForProfile();
    this.add.circle(840, 150, 16, 0xfff4bf, 0.18).setInteractive().on('pointerdown', () => {
      const message = touchSecret(secrets, 'hidden-light');
      if (message) showSecretReveal(this, message);
    });

    this.input.keyboard?.on('keydown', (event: KeyboardEvent) => {
      const intent = inputIntentFromKeyboard(event.key);
      if (intent?.type === 'move') this.moveSelection(intent.x || intent.y, housePartTray.length);
      if (intent?.type === 'confirm' || intent?.type === 'action') {
        this.choosePart(housePartTray[this.selectedPartIndex]?.id ?? 'foundation', this.selectedPartIndex);
      }
      if (intent?.type === 'back') returnToTownMap(this);
    });

    this.input.gamepad?.on('down', (_pad: unknown, button: { index: number }) => {
      const intent = inputIntentFromGamepadButton(button.index);
      if (intent?.type === 'move') this.moveSelection(intent.x || intent.y, housePartTray.length);
      if (intent?.type === 'confirm' || intent?.type === 'action') {
        this.choosePart(housePartTray[this.selectedPartIndex]?.id ?? 'foundation', this.selectedPartIndex);
      }
      if (intent?.type === 'back') returnToTownMap(this);
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
    this.addHousePartSprite('foundation', centerX - 118, y + 78, placed > 0, placed === 0);
    this.add.rectangle(centerX, y + 18, 185, 94, wallColor).setStrokeStyle(3, 0x203247);
    this.addHousePartSprite('walls', centerX + 118, y + 20, placed > 1, placed === 1);
    this.add.triangle(centerX, y - 70, -115, 70, 115, 70, 0, -15, roofColor).setStrokeStyle(3, 0x203247);
    this.addHousePartSprite('roof', centerX, y - 84, placed > 2, placed === 2);
    this.add.rectangle(centerX, y + 46, 42, 55, doorColor).setStrokeStyle(3, 0x203247);
    this.addHousePartSprite('door', centerX, y + 46, placed > 3, placed === 3);
    this.add.circle(centerX + 126, y + 75, 18, decorColor).setStrokeStyle(3, 0x203247);
    this.addHousePartSprite('decoration', centerX + 168, y + 75, placed > 4, placed === 4);
  }

  private addHousePartSprite(partId: HousePartId, x: number, y: number, built: boolean, next: boolean): void {
    this.add.circle(x, y, next ? 30 : 26, built ? 0xffffff : 0xfff4bf, built ? 0.82 : 0.34);
    addSprite(this, {
      key: housePartSpriteKeys[partId],
      x,
      y,
      width: next ? 54 : 44,
      height: next ? 54 : 44,
      alpha: built ? 1 : 0.36,
      pop: built || next,
    });
  }

  private moveSelection(delta: number, count: number): void {
    if (delta === 0) return;
    this.selectedPartIndex = Math.max(0, Math.min(count - 1, this.selectedPartIndex + delta));
    this.scene.restart({ state: this.state, selectedPartIndex: this.selectedPartIndex });
  }

  private choosePart(partId: HousePartId, selectedPartIndex: number): void {
    if (!this.state) return;
    const outcome = placeHousePart(this.state, partId);
    if (outcome.correct) getSfx().play('place');
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
    completeMission(this, getHouseBuilderResult(this.state));
  }
}
