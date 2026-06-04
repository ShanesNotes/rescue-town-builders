import Phaser from 'phaser';
import { fadeInScene } from '../systems/SceneTransitions';
import { SCENE_KEYS, startParentSettingsGate, startScene } from '../systems/SceneNavigation';
import { inputIntentFromGamepadButton, inputIntentFromKeyboard } from '../systems/InputIntent';
import { getSaveSystem } from '../systems/GameServices';
import { addIconButton } from '../ui/Button';
import { FONTS } from '../ui/typography';
import { motionAllowed } from '../ui/Sprite';

type ProfileAction = { type: 'select'; profileId: string } | { type: 'create' } | { type: 'settings' } | { type: 'back' };

// Only the three live, IP-reviewed MVP helpers ship. Roadmap characters stay out of the bundle
// until ADR-0006's expansion gate opens. The modulo wrap means profiles 4-5 reuse a vetted avatar.
const AVATARS = ['rivet', 'brick', 'ember'];

export class ProfileScene extends Phaser.Scene {
  private selectedIndex = 0;
  private actions: ProfileAction[] = [];

  constructor() {
    super('ProfileScene');
  }

  create(): void {
    fadeInScene(this);
    const saves = getSaveSystem();
    const profiles = saves.getProfiles();
    this.actions = [];

    this.paintWorld();
    this.paintHeader('CHOOSE A HELPER');

    // Slots = each profile (a portrait coin) + an Add coin (until 5). Laid out as a centered row.
    const canAdd = profiles.length < 5;
    const slotCount = profiles.length + (canAdd ? 1 : 0);
    const spacing = Math.min(168, 780 / Math.max(slotCount, 1));
    const startX = 480 - ((slotCount - 1) * spacing) / 2;
    const rowY = 250;

    profiles.forEach((profile, index) => {
      const actionIndex = this.actions.length;
      this.actions.push({ type: 'select', profileId: profile.id });
      this.profileCoin(profile, startX + index * spacing, rowY, actionIndex === this.selectedIndex);
    });

    if (canAdd) {
      const actionIndex = this.actions.length;
      this.actions.push({ type: 'create' });
      this.addCoin(startX + profiles.length * spacing, rowY, actionIndex === this.selectedIndex);
    }

    // First run (no profiles yet): the three helpers wait on the cobbles to be chosen.
    if (profiles.length === 0) {
      const heroes = ['hl.char.rivet', 'hl.char.brick', 'hl.char.ember'];
      heroes.forEach((key, i) => this.plantCharacter(key, 300 + i * 180, 470, 104, i));
    }

    // Nav coins (icon-first; same destinations + testIds as before).
    this.actions.push({ type: 'settings' }, { type: 'back' });
    addIconButton(this, { x: 52, y: 46, size: 58, key: 'hl.ui.back', onPress: () => this.choose({ type: 'back' }), testId: 'profile.back' }).setDepth(30);
    addIconButton(this, { x: 908, y: 46, size: 58, key: 'hl.ui.settings', onPress: () => this.choose({ type: 'settings' }), testId: 'profile.parent-settings' }).setDepth(30);

    this.bindInput();
  }

  private profileCoin(
    profile: { id: string; name: string; avatarId: string; progress: { totalStars: number } },
    x: number,
    y: number,
    selected: boolean,
  ): void {
    const avatar = AVATARS.includes(profile.avatarId) ? profile.avatarId : 'rivet';
    addIconButton(this, {
      x,
      y,
      size: 110,
      key: `hl.char.${avatar}`,
      caption: profile.name,
      onPress: () => this.choose({ type: 'select', profileId: profile.id }),
      testId: `profile.select.${profile.id}`,
      pulse: selected,
    }).setDepth(20);
    this.starTag(x, y + 92, profile.progress.totalStars);
  }

  private addCoin(x: number, y: number, selected: boolean): void {
    const coin = addIconButton(this, {
      x,
      y,
      size: 110,
      key: '__add__', // no texture → falls back to a candle-gold coin we mark with a +
      caption: 'New',
      onPress: () => this.choose({ type: 'create' }),
      testId: 'profile.add',
      pulse: selected,
    });
    coin.setDepth(20);
    coin.add(
      this.add.text(0, 0, '+', { fontFamily: FONTS.display, fontSize: '64px', color: '#2A1606', fontStyle: 'bold' }).setOrigin(0.5),
    );
  }

  private starTag(x: number, y: number, total: number): void {
    if (total <= 0) return;
    this.add.image(x - 14, y, 'hl.prop.star').setDisplaySize(24, 24).setDepth(21);
    this.add
      .text(x + 4, y, `${total}`, { fontFamily: FONTS.display, fontSize: '22px', color: '#FFE2A6', fontStyle: 'bold', stroke: '#2A1606', strokeThickness: 4 })
      .setOrigin(0, 0.5)
      .setDepth(21);
  }

  private paintWorld(): void {
    this.add.image(480, 270, 'hl.bg.town').setDisplaySize(960, 540).setDepth(0);
    this.add.rectangle(480, 270, 960, 540, 0x101b2e, 0.28).setDepth(1);
    this.add.rectangle(480, 270, 960, 540, 0xf2b45a, 0.05).setBlendMode(Phaser.BlendModes.ADD).setDepth(1);
    this.add.rectangle(480, 32, 960, 92, 0x101b2e, 0.42).setDepth(1);
  }

  private paintHeader(text: string): void {
    this.add
      .text(480, 34, text, { fontFamily: FONTS.display, fontSize: '34px', color: '#FFE2A6', fontStyle: 'bold', stroke: '#2A1606', strokeThickness: 7 })
      .setOrigin(0.5)
      .setDepth(30);
  }

  private plantCharacter(key: string, x: number, feetY: number, size: number, index: number): void {
    this.add.ellipse(x, feetY + 2, size * 0.7, size * 0.18, 0x0a1322, 0.5).setDepth(9);
    const sprite = this.add.image(x, feetY, key).setOrigin(0.5, 1).setDisplaySize(size, size).setDepth(11).setAlpha(0.92);
    if (!motionAllowed()) return;
    const baseScaleY = sprite.scaleY;
    this.tweens.add({ targets: sprite, scaleY: baseScaleY * 1.03, duration: 1200 + index * 130, yoyo: true, repeat: -1, ease: 'Sine.easeInOut', delay: index * 160 });
  }

  private bindInput(): void {
    this.input.keyboard?.on('keydown', (event: KeyboardEvent) => {
      const intent = inputIntentFromKeyboard(event.key);
      if (intent?.type === 'move') this.moveSelection(intent.x || intent.y);
      if (intent?.type === 'confirm' || intent?.type === 'action') this.choose(this.actions[this.selectedIndex]);
      if (intent?.type === 'back') this.choose({ type: 'back' });
    });
    this.input.gamepad?.on('down', (_pad: unknown, button: { index: number }) => {
      const intent = inputIntentFromGamepadButton(button.index);
      if (intent?.type === 'move') this.moveSelection(intent.x || intent.y);
      if (intent?.type === 'confirm' || intent?.type === 'action') this.choose(this.actions[this.selectedIndex]);
      if (intent?.type === 'back') this.choose({ type: 'back' });
    });
  }

  private moveSelection(delta: number): void {
    if (delta === 0 || this.actions.length === 0) return;
    this.selectedIndex = Math.max(0, Math.min(this.actions.length - 1, this.selectedIndex + delta));
    this.scene.restart();
  }

  private choose(action: ProfileAction | undefined): void {
    if (!action) return;
    const saves = getSaveSystem();
    if (action.type === 'select') {
      saves.selectProfile(action.profileId);
      startScene(this, SCENE_KEYS.townMap);
      return;
    }
    if (action.type === 'create') {
      const nextNumber = saves.getProfiles().length + 1;
      saves.createProfile({ name: `Player ${nextNumber}`, avatarId: AVATARS[(nextNumber - 1) % AVATARS.length] ?? 'rivet' });
      startScene(this, SCENE_KEYS.townMap);
      return;
    }
    if (action.type === 'settings') {
      startParentSettingsGate(this, SCENE_KEYS.profile);
      return;
    }
    startScene(this, SCENE_KEYS.start);
  }
}
