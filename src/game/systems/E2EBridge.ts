import type { SaveData } from './SaveSystem';

export type E2EButton = {
  testId: string;
  label: string;
  sceneKey: string;
  press: () => void;
};

export type E2ETextureInfo = {
  key: string;
  exists: boolean;
  width: number;
  height: number;
  frameTotal: number;
};

export type RescueTownE2EBridge = {
  currentSceneKey: string;
  getSaveData: () => SaveData | null;
  getVisibleButtons: () => Array<Pick<E2EButton, 'testId' | 'label' | 'sceneKey'>>;
  getTextureInfo: () => E2ETextureInfo[];
  pressButton: (testId: string) => boolean;
  waitForScene: (sceneKey: string, timeoutMs?: number) => Promise<void>;
};

const SAVE_KEY = 'rescue-town-builders.save.v1';
const POLL_MS = 25;
const E2E_QUERY_PARAM = 'rtb_e2e';

type BridgeState = {
  currentSceneKey: string;
  buttons: E2EButton[];
};

const state: BridgeState = {
  currentSceneKey: '',
  buttons: [],
};
let textureInfoGetter: (() => E2ETextureInfo[]) | null = null;

function readSaveData(): SaveData | null {
  try {
    const raw = window.localStorage.getItem(SAVE_KEY);
    return raw ? (JSON.parse(raw) as SaveData) : null;
  } catch {
    return null;
  }
}

export function isE2EEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  if (window.__RTB_E2E__) return true;
  return new URLSearchParams(window.location.search).get(E2E_QUERY_PARAM) === '1';
}

function ensureBridge(): RescueTownE2EBridge | null {
  if (typeof window === 'undefined' || !isE2EEnabled()) return null;
  const existing = window.__RTB_E2E__;
  if (existing) return existing;

  const bridge: RescueTownE2EBridge = {
    get currentSceneKey() {
      return state.currentSceneKey;
    },
    getSaveData: readSaveData,
    getVisibleButtons: () => state.buttons.map(({ testId, label, sceneKey }) => ({ testId, label, sceneKey })),
    getTextureInfo: () => textureInfoGetter?.() ?? [],
    pressButton: (testId: string) => {
      const button = state.buttons.find((candidate) => candidate.testId === testId);
      if (!button) return false;
      button.press();
      return true;
    },
    waitForScene: (sceneKey: string, timeoutMs = 3000) =>
      new Promise((resolve, reject) => {
        const start = Date.now();
        const tick = () => {
          if (state.currentSceneKey === sceneKey) {
            resolve();
            return;
          }
          if (Date.now() - start > timeoutMs) {
            reject(new Error(`Timed out waiting for ${sceneKey}; current scene is ${state.currentSceneKey || 'unknown'}.`));
            return;
          }
          window.setTimeout(tick, POLL_MS);
        };
        tick();
      }),
  };
  window.__RTB_E2E__ = bridge;
  return bridge;
}

export function registerE2EScene(sceneKey: string): void {
  if (!isE2EEnabled()) return;
  if (state.currentSceneKey !== sceneKey) {
    state.currentSceneKey = sceneKey;
    state.buttons = [];
  }
  ensureBridge();
}

export function registerE2EButton(button: E2EButton): void {
  if (!isE2EEnabled()) return;
  registerE2EScene(button.sceneKey);
  state.buttons = state.buttons.filter((candidate) => candidate.testId !== button.testId);
  state.buttons.push(button);
}

export function registerE2ETextureInfo(getter: () => E2ETextureInfo[]): void {
  if (!isE2EEnabled()) return;
  textureInfoGetter = getter;
  ensureBridge();
}

declare global {
  interface Window {
    __RTB_E2E__?: RescueTownE2EBridge;
  }
}
