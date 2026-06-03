import { defineConfig } from 'vitest/config';

export default defineConfig({
  base: process.env.GITHUB_PAGES === 'true' ? '/rescue-town-builders/' : '/',
  server: {
    port: 5173,
  },
  preview: {
    port: 4173,
  },
  build: {
    chunkSizeWarningLimit: 1600,
  },
  test: {
    environment: 'node',
    globals: true,
  },
});
