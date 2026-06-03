import { describe, expect, it } from 'vitest';
import { Secrets, type SecretId } from '../src/game/systems/Secrets';

describe('Secrets', () => {
  it('stays hidden until the touch threshold is crossed', () => {
    const secrets = new Secrets({ playerName: 'Willem' });

    expect(secrets.touch('secret-friend')).toBeNull();
    expect(secrets.touch('secret-friend')).toBeNull();

    const reveal = secrets.touch('secret-friend');
    expect(reveal).not.toBeNull();
    expect(reveal?.id).toBe('secret-friend');
    expect(reveal?.sticker).toBe('secret-friend');
  });

  it('greets the child by their profile name on reveal', () => {
    const secrets = new Secrets({ playerName: 'Willem' });

    secrets.touch('secret-friend');
    secrets.touch('secret-friend');
    const reveal = secrets.touch('secret-friend');

    expect(reveal?.message).toContain('Willem');
  });

  it('reveals the Hidden Light on the first touch and speaks the parent message', () => {
    const dadsWords = 'I love you to the moon and back, buddy. — Dad';
    const secrets = new Secrets({ playerName: 'Willem', hiddenLightMessage: dadsWords });

    const reveal = secrets.touch('hidden-light');

    expect(reveal?.id).toBe('hidden-light');
    expect(reveal?.message).toBe(dadsWords);
  });

  it('falls back to a gentle default light message when no parent words are set', () => {
    const secrets = new Secrets({ playerName: 'Willem' });

    const reveal = secrets.touch('hidden-light');

    expect(reveal?.message).toContain('Willem');
    expect(reveal?.message.length).toBeGreaterThan(0);
  });

  it('never reveals the same secret twice', () => {
    const secrets = new Secrets({ playerName: 'Willem' });

    expect(secrets.touch('hidden-light')).not.toBeNull();
    expect(secrets.touch('hidden-light')).toBeNull();
    expect(secrets.isDiscovered('hidden-light')).toBe(true);
  });

  it('rehydrates already-discovered secrets from a previous session', () => {
    const secrets = new Secrets({ discovered: ['cluckle-dream'] });

    expect(secrets.isDiscovered('cluckle-dream')).toBe(true);
    expect(secrets.touch('cluckle-dream')).toBeNull();
    expect(secrets.getDiscovered()).toContain('cluckle-dream');
  });

  it('tracks each secret independently', () => {
    const secrets = new Secrets({ playerName: 'Willem' });

    secrets.touch('secret-friend');
    secrets.touch('secret-friend');
    // cluckle-dream has had zero touches and must not ride along.
    expect(secrets.touch('cluckle-dream')).toBeNull();
    expect(secrets.isDiscovered('cluckle-dream')).toBe(false);
    // secret-friend still needs its third touch.
    expect(secrets.isDiscovered('secret-friend')).toBe(false);
  });

  it('records the Language-of-Creation pattern each secret embodies', () => {
    const secrets = new Secrets({ playerName: 'Willem' });
    const patterns: Record<SecretId, string> = {
      'secret-friend': 'naming-the-animals',
      'hidden-light': 'light-from-darkness',
      'cluckle-dream': 'microcosm',
    };

    const reveal = secrets.touch('hidden-light');
    expect(reveal?.pattern).toContain(patterns['hidden-light']);
  });
});
