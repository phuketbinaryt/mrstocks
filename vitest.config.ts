import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
      // Tests run in node and can freely import server modules.
      // The real 'server-only' shim throws on import — neutralize it.
      'server-only': path.resolve(__dirname, './tests/shims/server-only.ts'),
    },
  },
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts', '**/*.test.ts'],
    exclude: ['node_modules', '.next', 'tests/**/*.integration.test.ts', 'design_handoff_mrstocks/**'],
  },
});
