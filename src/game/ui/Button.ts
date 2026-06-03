import Phaser from 'phaser';

export type ButtonOptions = {
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  fill?: number;
  stroke?: number;
  onPress: () => void;
};

export function addButton(scene: Phaser.Scene, options: ButtonOptions): Phaser.GameObjects.Container {
  const fill = options.fill ?? 0xffffff;
  const stroke = options.stroke ?? 0x203247;
  const container = scene.add.container(options.x, options.y);
  const panel = scene.add.rectangle(0, 0, options.width, options.height, fill, 1);
  panel.setStrokeStyle(4, stroke, 1);
  const label = scene.add.text(0, 0, options.label, {
    fontFamily: 'Trebuchet MS, Arial, sans-serif',
    fontSize: '28px',
    color: '#203247',
    align: 'center',
    wordWrap: { width: options.width - 32 },
  });
  label.setOrigin(0.5);
  container.add([panel, label]);
  container.setSize(options.width, options.height);
  container.setInteractive({ useHandCursor: true });
  container.on('pointerdown', options.onPress);
  container.on('pointerover', () => panel.setFillStyle(0xfff4bf));
  container.on('pointerout', () => panel.setFillStyle(fill));
  return container;
}
