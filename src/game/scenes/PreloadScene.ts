import Phaser from 'phaser';
import { fadeInScene } from '../systems/SceneTransitions';
import { SCENE_KEYS, startScene } from '../systems/SceneNavigation';
import { addBody, addTitle } from '../ui/SceneText';

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super('PreloadScene');
  }

  create(): void {
    fadeInScene(this);
    this.cameras.main.setBackgroundColor('#d9f5ff');
    addTitle(this, 'Rescue Town Builders');
    addBody(this, 190, 'Loading friendly placeholder shapes...');
    this.time.delayedCall(250, () => startScene(this, SCENE_KEYS.start));
  }
}
