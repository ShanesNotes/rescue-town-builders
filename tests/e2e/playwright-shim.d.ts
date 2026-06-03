declare module '@playwright/test' {
  export type Page = {
    goto(url: string): Promise<void>;
    evaluate<R, A = unknown>(fn: (arg: A) => R | Promise<R>, arg?: A): Promise<R>;
    waitForFunction(fn: () => boolean): Promise<unknown>;
    setViewportSize(size: { width: number; height: number }): Promise<void>;
    reload(): Promise<void>;
    locator(selector: string): { boundingBox(): Promise<{ width: number; height: number } | null> };
  };
  export const expect: ((actual: unknown, message?: string) => {
    toBe(expected: unknown): void;
    toEqual(expected: unknown): void;
    toHaveLength(expected: number): void;
    toBeGreaterThanOrEqual(expected: number): void;
    toBeLessThanOrEqual(expected: number): void;
    toBeNull(): void;
    not: { toBe(expected: unknown): void; toBeNull(): void };
  }) & { arrayContaining(values: unknown[]): unknown };
  export const test: (name: string, fn: (args: { page: Page }) => Promise<void>) => void;
}
