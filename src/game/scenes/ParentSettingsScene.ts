import Phaser from 'phaser';
import { fadeInScene } from '../systems/SceneTransitions';
import type { Difficulty, PlayerProfile } from '../systems/SaveSystem';
import { getEffectiveAudioLevels } from '../systems/AudioSystem';
import { getSaveSystem, getSfx } from '../systems/GameServices';
import { bindIntents } from '../systems/bindIntents';
import { SCENE_KEYS, returnToParentScene, startScene, type ParentSettingsReturnScene } from '../systems/SceneNavigation';
import { addIconButton } from '../ui/Button';
import { openChoiceModal } from '../ui/ChoiceModal';
import { FONTS } from '../ui/typography';

const DIFFICULTY_ORDER: Difficulty[] = ['helper', 'easy', 'normal'];

// Parent layer: calm, local, reassuring. Fuller words are allowed here (the child never sees it).
// Rendered in place — toggles update their pill label without restarting the scene.
export class ParentSettingsScene extends Phaser.Scene {
  private returnScene: ParentSettingsReturnScene = SCENE_KEYS.profile;
  private labels: Record<string, Phaser.GameObjects.Text> = {};
  private profile!: PlayerProfile;
  private resetModalOpen = false;

  constructor() {
    super('ParentSettingsScene');
  }

  init(data: { returnScene?: ParentSettingsReturnScene }): void {
    this.returnScene = data.returnScene ?? SCENE_KEYS.profile;
  }

  create(): void {
    fadeInScene(this);
    this.labels = {};
    this.add.image(480, 270, 'hl.bg.town').setDisplaySize(960, 540).setDepth(0);
    this.add.rectangle(480, 270, 960, 540, 0x101b2e, 0.62).setDepth(1);
    this.add.rectangle(480, 300, 800, 468, 0x16243a, 0.85).setStrokeStyle(4, 0xffc857, 0.8).setDepth(2);
    this.add
      .text(480, 70, 'PARENT SETTINGS', { fontFamily: FONTS.display, fontSize: '34px', color: '#FFE2A6', fontStyle: 'bold', stroke: '#2A1606', strokeThickness: 7 })
      .setOrigin(0.5)
      .setDepth(40);

    const saves = getSaveSystem();
    const profile = saves.getSelectedProfile();

    if (!profile) {
      this.add.text(480, 180, 'Create a friend first — settings save on this device.', { fontFamily: FONTS.display, fontSize: '20px', color: '#EBDDDA', align: 'center', wordWrap: { width: 600 } }).setOrigin(0.5).setDepth(10);
      addIconButton(this, { x: 480, y: 320, size: 76, key: 'hl.ui.back', caption: 'Profiles', onPress: () => startScene(this, SCENE_KEYS.profile), testId: 'parent.back' }).setDepth(40);
      bindIntents(this, { onBack: () => startScene(this, SCENE_KEYS.profile) });
      return;
    }

    this.profile = profile;
    this.add
      .text(480, 116, 'Everything stays on this device. No accounts, no rush.', { fontFamily: FONTS.label, fontSize: '13px', color: '#9DB4C0', align: 'center' })
      .setOrigin(0.5)
      .setDepth(10);

    this.pill('difficulty', 270, 170, () => `Difficulty: ${this.profile.settings.difficulty}`, 0xffc857, () =>
      this.applySetting({ difficulty: this.nextDifficulty(this.profile.settings.difficulty) }),
    );
    this.pill('mute', 690, 170, () => `Sound: ${this.profile.settings.audioMuted ? 'off' : 'on'}`, 0xffc857, () =>
      this.applySetting({ audioMuted: !this.profile.settings.audioMuted }),
    );
    this.pill('music', 270, 240, () => `Music: ${this.pct(getEffectiveAudioLevels(this.profile.settings).music)}`, 0x43a29c, () =>
      this.applySetting({ musicVolume: this.cycleVol(this.profile.settings.musicVolume) }),
    );
    this.pill('sfx', 690, 240, () => `Sounds: ${this.pct(getEffectiveAudioLevels(this.profile.settings).sfx)}`, 0x43a29c, () =>
      this.applySetting({ sfxVolume: this.cycleVol(this.profile.settings.sfxVolume) }),
    );
    // Spoken VO so a non-reader can play solo (P4-02) — on by default; mutable here.
    this.pill('voice', 270, 310, () => `Talking: ${this.profile.settings.voiceEnabled ? 'on' : 'off'}`, 0x9b8fd6, () =>
      this.applySetting({ voiceEnabled: !this.profile.settings.voiceEnabled }),
    );
    this.pill('quiet', 690, 310, () => 'Calm night (soft sounds)', 0x76b3e6, () =>
      this.applySetting({ musicVolume: 0, sfxVolume: 0.4, audioMuted: false }),
    );
    this.pill('reset', 480, 380, () => 'Start fresh', 0xe8946a, () => this.confirmReset());

    addIconButton(this, { x: 480, y: 478, size: 76, key: 'hl.ui.back', caption: 'Done', onPress: () => returnToParentScene(this, this.returnScene), testId: 'parent.done' }).setDepth(40);
    bindIntents(this, {
      onBack: () => {
        if (this.resetModalOpen) return; // the modal owns Back while it's up (Escape = cancel)
        returnToParentScene(this, this.returnScene);
      },
    });
  }

  // "Start fresh" wipes ALL profiles/stars/stickers irreversibly — never on one tap. Gate it
  // behind the shared child-safe choice modal whose SAFE default (focused, Escape/B) is cancel.
  private confirmReset(): void {
    if (this.resetModalOpen) return;
    this.resetModalOpen = true;
    openChoiceModal(this, {
      title: 'Start fresh?',
      subtitle: 'This erases every friend, star, and sticker on this device. It cannot be undone.',
      buttons: [
        {
          icon: '✕',
          caption: 'Keep Everything',
          fill: 0x9be7c4,
          safe: true,
          testId: 'parent.reset.cancel',
          onPress: () => {
            this.resetModalOpen = false;
          },
        },
        {
          icon: '🗑',
          caption: 'Erase All',
          fill: 0xffb3c6,
          testId: 'parent.reset.confirm',
          onPress: () => {
            this.resetModalOpen = false;
            getSaveSystem().reset();
            startScene(this, SCENE_KEYS.profile);
          },
        },
      ],
    });
  }

  private pill(key: string, x: number, y: number, label: () => string, color: number, onPress: () => void): void {
    const rect = this.add.rectangle(x, y, 360, 60, 0x0f1c30, 0.92).setStrokeStyle(3, color, 0.9).setDepth(6);
    this.labels[key] = this.add
      .text(x, y, label(), { fontFamily: FONTS.display, fontSize: '20px', color: '#FFE2A6', fontStyle: 'bold', align: 'center', wordWrap: { width: 332 } })
      .setOrigin(0.5)
      .setDepth(7);
    this.labels[key].setData('label', label);
    let armed = false;
    rect.setInteractive({ useHandCursor: true });
    rect.on('pointerover', () => rect.setStrokeStyle(4, color, 1));
    rect.on('pointerout', () => { armed = false; rect.setStrokeStyle(3, color, 0.9); });
    rect.on('pointerdown', () => { armed = true; try { getSfx().play('tap'); } catch { /* optional */ } });
    rect.on('pointerup', () => { if (armed) { armed = false; onPress(); } });
  }

  private refresh(): void {
    for (const text of Object.values(this.labels)) {
      const label = text.getData('label') as (() => string) | undefined;
      if (label) text.setText(label());
    }
  }

  private applySetting(settings: Parameters<ReturnType<typeof getSaveSystem>['updateProfileSettings']>[1]): void {
    const saves = getSaveSystem();
    saves.updateProfileSettings(this.profile.id, settings);
    this.profile = saves.getSelectedProfile() ?? this.profile; // re-fetch (getSelectedProfile clones)
    this.refresh();
  }

  private pct(v: number): string {
    return `${Math.round(v * 100)}%`;
  }

  private cycleVol(v: number): number {
    const next = Math.round(v * 4) / 4 + 0.25;
    return next > 1.0001 ? 0 : next;
  }

  private nextDifficulty(current: Difficulty): Difficulty {
    const index = DIFFICULTY_ORDER.indexOf(current);
    return DIFFICULTY_ORDER[(index + 1) % DIFFICULTY_ORDER.length] ?? 'helper';
  }
}
