import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['server/**/*.{test,spec}.ts'],
    setupFiles: './server/test/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['server/**/*.ts'],
      exclude: [
        'server/**/*.{test,spec}.ts',
        'server/generate-db.ts',
        'server/serverData.ts',
        'server/types.ts',
      ],
    },
  },
});
