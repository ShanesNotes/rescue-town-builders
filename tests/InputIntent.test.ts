import { describe, expect, it } from 'vitest';
import { inputIntentFromGamepadButton, inputIntentFromKeyboard, inputIntentFromPointer } from '../src/game/systems/InputIntent';

describe('InputIntent', () => {
  it('maps keyboard controls to child-friendly intents', () => {
    expect(inputIntentFromKeyboard('ArrowLeft')).toEqual({ type: 'move', x: -1, y: 0 });
    expect(inputIntentFromKeyboard('Enter')).toEqual({ type: 'confirm' });
    expect(inputIntentFromKeyboard(' ')).toEqual({ type: 'action' });
    expect(inputIntentFromKeyboard('Escape')).toEqual({ type: 'back' });
  });

  it('maps gamepad buttons for one-handed play', () => {
    expect(inputIntentFromGamepadButton(0)).toEqual({ type: 'confirm' });
    expect(inputIntentFromGamepadButton(1)).toEqual({ type: 'back' });
    expect(inputIntentFromGamepadButton(12)).toEqual({ type: 'move', x: 0, y: -1 });
    expect(inputIntentFromGamepadButton(15)).toEqual({ type: 'move', x: 1, y: 0 });
  });

  it('maps touch/pointer taps to confirmation', () => {
    expect(inputIntentFromPointer()).toEqual({ type: 'confirm' });
  });
});
