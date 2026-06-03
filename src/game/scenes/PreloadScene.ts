import Phaser from 'phaser';
import { addBody, addTitle } from '../ui/SceneText';

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super('PreloadScene');
  }

  create(): void {
    this.cameras.main.setBackgroundColor('#d9f5ff');
    addTitle(this, 'Rescue Town Builders');
    addBody(this, 190, 'Loading friendly placeholder shapes...');
    this.time.delayedCall(250, () => this.scene.start('StartScene'));
  }
}
