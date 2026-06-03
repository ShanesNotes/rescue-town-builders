import Phaser from 'phaser';
import { SCENE_KEYS, startScene } from '../systems/SceneNavigation';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  create(): void {
    startScene(this, SCENE_KEYS.preload);
  }
}
