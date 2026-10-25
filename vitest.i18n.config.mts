// Quat Capital, 2026-10-25: isolated i18n tests without reading application ENV fixtures.
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [ tsconfigPaths({ ignoreConfigErrors: true }) ],
  test: {
    environment: 'node',
    include: [ 'lib/i18n/*.spec.ts', 'lib/i18n/*.spec.tsx', 'lib/format/*.spec.ts', 'lib/date/dayjs.spec.ts', 'deploy/tools/envs-validator/i18n.spec.ts' ],
    exclude: [ '**/node_modules/**', '**/node_modules_linux/**' ],
  },
});
