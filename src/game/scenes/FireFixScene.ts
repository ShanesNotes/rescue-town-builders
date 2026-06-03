import Phaser from 'phaser';
import { fadeInScene } from '../systems/SceneTransitions';
import { picnicFires } from '../data/picnicFires';
import { inputIntentFromGamepadButton, inputIntentFromKeyboard } from '../systems/InputIntent';
import { completeMission, returnToTownMap } from '../systems/SceneNavigation';
import { getSfx } from '../systems/GameServices';
import { createSecretsForProfile, touchSecret, showSecretReveal } from '../systems/secretHotspot';
import {
  createFireFixState,
  getFireFixResult,
  moveFirefighter,
  sprayWater,
  type Direction,
  type FireFixState,
} from '../systems/FireFix';
import { addButton } from '../ui/Button';
import { addBody, addTitle } from '../ui/SceneText';
import { addHelperAvatar, addSprite, shrinkAndFade } from '../ui/Sprite';

export class FireFixScene extends Phaser.Scene {
  private state: FireFixState | null = null;

  constructor() {
    super('FireFixScene');
  }

  init(data: { state?: FireFixState }): void {
    this.state = data.state ?? null;
  }

  create(): void {
    fadeInScene(this);
    this.cameras.main.setBackgroundColor('#eaf7ff');
    this.state ??= createFireFixState(picnicFires);
    const state = this.state;

    addTitle(this, "Ember's Fire Fix");
    addBody(this, 95, `Spray cartoon fires. Out: ${state.fires.filter((fire) => fire.health === 0).length}/5 • Sprays: ${state.sprays}`);
    addBody(this, 130, state.lastMessage);

    this.drawPlayfield(state);
    this.addControls();
    this.bindInput();

    // Secret Friend: a tiny shy creature that appears for a child who keeps looking
    // (3 touches). Placed outside the fire playfield, so it never affects the spray.
    const secrets = createSecretsForProfile();
    this.add.circle(880, 110, 16, 0xfff4bf, 0.18).setInteractive().on('pointerdown', () => {
      const message = touchSecret(secrets, 'secret-friend');
      if (message) showSecretReveal(this, message);
    });
  }

  private drawPlayfield(state: FireFixState): void {
    this.add.rectangle(480, 275, 760, 290, 0xdff8d8).setStrokeStyle(4, 0x203247);
    addSprite(this, { key: 'props.hydrant', x: 170, y: 360, width: 64, height: 64, pop: true });
    this.add.circle(state.player.x, state.player.y, 28, 0xffffff, 0.78).setStrokeStyle(4, 0x203247);
    addHelperAvatar(this, 'ember', state.player.x, state.player.y - 5, 64, { pop: true });
    this.add.text(state.player.x, state.player.y - 45, 'Ember', {
      fontFamily: 'Trebuchet MS, Arial, sans-serif',
      fontSize: '18px',
      color: '#203247',
    }).setOrigin(0.5);
    this.add.line(
      state.player.x,
      state.player.y,
      0,
      0,
      state.aim.x * 60,
      state.aim.y * 60,
      0x2299ff,
      1,
    ).setLineWidth(6);
    addSprite(this, {
      key: 'props.water-spray',
      x: state.player.x + state.aim.x * 78,
      y: state.player.y + state.aim.y * 78,
      width: 82,
      height: 48,
      angle: angleForDirection(state.aim),
      alpha: 0.76,
    });

    for (const fire of state.fires) {
      const intensity = fire.health / fire.maxHealth;
      const color = fire.health === 0 ? 0x9be7c4 : intensity > 0.5 ? 0xff6b35 : 0xffc857;
      this.add.circle(fire.x, fire.y, 22 + fire.health * 5, color).setStrokeStyle(4, 0x203247);
      const fireSprite = addSprite(this, {
        key: 'props.fire',
        x: fire.x,
        y: fire.y,
        width: fire.health === 0 ? 38 : 52 + intensity * 30,
        height: fire.health === 0 ? 38 : 52 + intensity * 30,
        alpha: fire.health === 0 ? 0.5 : 1,
        pop: fire.health > 0,
      });
      if (fire.health === 0 && fireSprite) shrinkAndFade(this, fireSprite);
      this.add.text(fire.x, fire.y - 48, `${fire.label}\n${fire.health}/${fire.maxHealth}`, {
        fontFamily: 'Trebuchet MS, Arial, sans-serif',
        fontSize: '16px',
        color: '#203247',
        align: 'center',
      }).setOrigin(0.5);
    }

    if (state.helperAssists > 0) {
      this.add.text(780, 160, '🤖 Helper drone helped!', {
        fontFamily: 'Trebuchet MS, Arial, sans-serif',
        fontSize: '20px',
        color: '#203247',
      }).setOrigin(0.5);
    }
  }

  private addControls(): void {
    addButton(this, { x: 120, y: 470, width: 90, height: 52, label: '←', fill: 0xffffff, onPress: () => this.move({ x: -1, y: 0 }), testId: 'fire.move.left' });
    addButton(this, { x: 220, y: 470, width: 90, height: 52, label: '→', fill: 0xffffff, onPress: () => this.move({ x: 1, y: 0 }), testId: 'fire.move.right' });
    addButton(this, { x: 170, y: 415, width: 90, height: 52, label: '↑', fill: 0xffffff, onPress: () => this.move({ x: 0, y: -1 }), testId: 'fire.move.up' });
    addButton(this, { x: 170, y: 525, width: 90, height: 52, label: '↓', fill: 0xffffff, onPress: () => this.move({ x: 0, y: 1 }), testId: 'fire.move.down' });
    addButton(this, { x: 480, y: 500, width: 250, height: 74, label: 'Spray Water', fill: 0xb7e6ff, onPress: () => this.spray(), testId: 'fire.spray' });
    addButton(this, { x: 800, y: 515, width: 210, height: 52, label: 'Back to Map', fill: 0xffffff, onPress: () => returnToTownMap(this), testId: 'fire.back-to-map' });
  }

  private bindInput(): void {
    this.input.keyboard?.on('keydown', (event: KeyboardEvent) => {
      const intent = inputIntentFromKeyboard(event.key);
      if (intent?.type === 'move') this.move(intent);
      if (intent?.type === 'confirm' || intent?.type === 'action') this.spray();
      if (intent?.type === 'back') returnToTownMap(this);
    });

    this.input.gamepad?.on('down', (_pad: unknown, button: { index: number }) => {
      const intent = inputIntentFromGamepadButton(button.index);
      if (intent?.type === 'move') this.move(intent);
      if (intent?.type === 'confirm' || intent?.type === 'action') this.spray();
      if (intent?.type === 'back') returnToTownMap(this);
    });
  }

  private move(direction: Direction): void {
    if (!this.state) return;
    this.scene.restart({ state: moveFirefighter(this.state, direction) });
  }

  private spray(): void {
    if (!this.state) return;
    const outcome = sprayWater(this.state);
    if (outcome.hit) getSfx().play('spray-hit');
    if (outcome.completed) {
      completeMission(this, getFireFixResult(outcome.state));
      return;
    }
    this.scene.restart({ state: outcome.state });
  }
}

function angleForDirection(direction: Direction): number {
  if (direction.x === 0 && direction.y === 0) return 0;
  return Phaser.Math.RadToDeg(Math.atan2(direction.y, direction.x));
}
