import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  // tsconfig sets jsx: "preserve" for Next; Vitest 4 uses the oxc transformer,
  // so override the JSX runtime here. Without this, oxc preserves JSX in any
  // .tsx module imported by the code under test (e.g. lib/education/load.ts now
  // imports the MDX component registry) and import-analysis fails to parse it.
  oxc: {
    jsx: { runtime: 'automatic' },
  },
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
