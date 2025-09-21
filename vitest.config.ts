import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    include: ['tests/**/*.spec.ts', 'src/test/**/*.test.tsx'],
    exclude: ['tests/e2e/**'],
    environment: 'jsdom',
    setupFiles: ['src/test/setup.ts'],
    globals: true,
    coverage: {
      enabled: false
    }
  }
});
