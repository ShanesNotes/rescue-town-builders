import Phaser from 'phaser';
import { FONTS } from './typography';

export function addTitle(scene: Phaser.Scene, text: string): Phaser.GameObjects.Text {
  return scene.add
    .text(480, 60, text, {
      fontFamily: FONTS.display,
      fontSize: '44px',
      color: '#203247',
      align: 'center',
      wordWrap: { width: 860 },
    })
    .setOrigin(0.5);
}

export function addBody(scene: Phaser.Scene, y: number, text: string): Phaser.GameObjects.Text {
  return scene.add
    .text(480, y, text, {
      fontFamily: FONTS.display,
      fontSize: '24px',
      color: '#203247',
      align: 'center',
      lineSpacing: 8,
      wordWrap: { width: 820 },
    })
    .setOrigin(0.5);
}
