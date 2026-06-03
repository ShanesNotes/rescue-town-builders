import Phaser from 'phaser';
import { MIN_TOUCH_TARGET } from '../systems/AccessibilityRules';
import { registerE2EButton, registerE2EScene } from '../systems/E2EBridge';
import { hasTexture } from './Sprite';

export type ButtonOptions = {
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  fill?: number;
  stroke?: number;
  onPress: () => void;
  testId?: string;
};

export function addButton(scene: Phaser.Scene, options: ButtonOptions): Phaser.GameObjects.Container {
  registerE2EScene(scene.scene.key);
  const fill = options.fill ?? 0xffffff;
  const stroke = options.stroke ?? 0x203247;
  const width = Math.max(options.width, MIN_TOUCH_TARGET);
  const height = Math.max(options.height, MIN_TOUCH_TARGET);
  const container = scene.add.container(options.x, options.y);
  const panel = scene.add.rectangle(0, 0, width, height, fill, 1);
  panel.setStrokeStyle(4, stroke, 1);
  const panelArtKey = panelArtForFill(fill);
  const panelArt = panelArtKey && hasTexture(scene, panelArtKey)
    ? scene.add.image(0, 0, panelArtKey).setDisplaySize(width, height)
    : null;
  if (panelArt) panel.setAlpha(0.18);
  const label = scene.add.text(0, 0, options.label, {
    fontFamily: 'Trebuchet MS, Arial, sans-serif',
    fontSize: '28px',
    color: '#203247',
    align: 'center',
    wordWrap: { width: width - 32 },
  });
  label.setOrigin(0.5);
  container.add(panelArt ? [panel, panelArt, label] : [panel, label]);
  container.setSize(width, height);
  container.setInteractive({ useHandCursor: true });
  container.on('pointerdown', options.onPress);
  if (options.testId) {
    registerE2EButton({
      testId: options.testId,
      label: options.label,
      sceneKey: scene.scene.key,
      press: options.onPress,
    });
  }
  container.on('pointerover', () => {
    panel.setFillStyle(0xfff4bf);
    panelArt?.setAlpha(0.92);
  });
  container.on('pointerout', () => {
    panel.setFillStyle(fill);
    panelArt?.setAlpha(1);
  });
  return container;
}

function panelArtForFill(fill: number): string {
  if (fill === 0xfff4bf) return 'kenney.ui.button-yellow';
  if (fill === 0x9be7c4) return 'kenney.ui.button-green';
  if (fill === 0xb7e6ff) return 'kenney.ui.button-blue';
  if (fill === 0xffb3c6) return 'kenney.ui.button-red';
  return 'kenney.ui.button-blue';
}
