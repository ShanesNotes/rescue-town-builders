import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { BrickTowerScene } from './scenes/BrickTowerScene';
import { DreamCatchScene } from './scenes/DreamCatchScene';
import { EmberBrigadeScene } from './scenes/EmberBrigadeScene';
import { AimMissionScene } from './scenes/AimMissionScene';
import { JourneyMissionScene } from './scenes/JourneyMissionScene';
import { MatchMissionScene } from './scenes/MatchMissionScene';
import { MissionCompleteScene } from './scenes/MissionCompleteScene';
import { ParentSettingsGateScene } from './scenes/ParentSettingsGateScene';
import { ParentSettingsScene } from './scenes/ParentSettingsScene';
import { PlaceholderMissionScene } from './scenes/PlaceholderMissionScene';
import { PreloadScene } from './scenes/PreloadScene';
import { ProfileScene } from './scenes/ProfileScene';
import { RecycleSnakeScene } from './scenes/RecycleSnakeScene';
import { StartScene } from './scenes/StartScene';
import { StickerBookScene } from './scenes/StickerBookScene';
import { TownRideScene } from './scenes/TownRideScene';
import { TownMapScene } from './scenes/TownMapScene';

export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'game',
  // Hearthlight (ADR-0008): pixel-art rendering kills the bilinear blur; navy letterbox reads
  // as intentional night. Logical canvas stays 960×540; art is authored 2× from a 480×270 grid.
  backgroundColor: '#1B2A41',
  pixelArt: true,
  roundPixels: true,
  width: 960,
  height: 540,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  input: {
    keyboard: true,
    mouse: true,
    touch: true,
    gamepad: true,
  },
  scene: [
    BootScene,
    PreloadScene,
    StartScene,
    ProfileScene,
    TownMapScene,
    ParentSettingsGateScene,
    ParentSettingsScene,
    RecycleSnakeScene,
    BrickTowerScene,
    EmberBrigadeScene,
    DreamCatchScene,
    TownRideScene,
    MatchMissionScene,
    AimMissionScene,
    JourneyMissionScene,
    PlaceholderMissionScene,
    MissionCompleteScene,
    StickerBookScene,
  ],
};
