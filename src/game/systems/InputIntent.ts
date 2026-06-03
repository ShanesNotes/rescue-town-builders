export type InputIntent =
  | { type: 'move'; x: -1 | 0 | 1; y: -1 | 0 | 1 }
  | { type: 'confirm' }
  | { type: 'action' }
  | { type: 'back' }
  | { type: 'hint' };

export function inputIntentFromKeyboard(key: string): InputIntent | null {
  switch (key) {
    case 'ArrowLeft':
    case 'a':
    case 'A':
      return { type: 'move', x: -1, y: 0 };
    case 'ArrowRight':
    case 'd':
    case 'D':
      return { type: 'move', x: 1, y: 0 };
    case 'ArrowUp':
    case 'w':
    case 'W':
      return { type: 'move', x: 0, y: -1 };
    case 'ArrowDown':
    case 's':
    case 'S':
      return { type: 'move', x: 0, y: 1 };
    case 'Enter':
      return { type: 'confirm' };
    case ' ':
    case 'Spacebar':
      return { type: 'action' };
    case 'Escape':
      return { type: 'back' };
    case 'h':
    case 'H':
      return { type: 'hint' };
    default:
      return null;
  }
}

export function inputIntentFromGamepadButton(buttonIndex: number): InputIntent | null {
  switch (buttonIndex) {
    case 0:
      return { type: 'confirm' };
    case 1:
      return { type: 'back' };
    case 2:
      return { type: 'action' };
    case 3:
      return { type: 'hint' };
    case 12:
      return { type: 'move', x: 0, y: -1 };
    case 13:
      return { type: 'move', x: 0, y: 1 };
    case 14:
      return { type: 'move', x: -1, y: 0 };
    case 15:
      return { type: 'move', x: 1, y: 0 };
    default:
      return null;
  }
}

export function inputIntentFromPointer(): InputIntent {
  return { type: 'confirm' };
}
