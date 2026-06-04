import Phaser from 'phaser';
import './styles.css';
import { gameConfig } from './game/GameConfig';
import { loadFonts } from './game/ui/typography';

// Load the pixel fonts first so the very first frame is already crisp; boot regardless on failure.
void loadFonts().finally(() => {
  new Phaser.Game(gameConfig);
});
