import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
  },
  resolve: {
    alias: {
      obsidian: path.resolve(__dirname, 'test/__mocks__/obsidian.ts'),
    },
  },
});