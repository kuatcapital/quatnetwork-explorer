// Quat Capital, 2026-10-25: isolated i18n tests without reading application ENV fixtures.
// Modified by Quat Capital, 2026-10-26: include stable-id stats metadata regressions. GPL-3.0.
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [ tsconfigPaths({ ignoreConfigErrors: true }) ],
  test: {
    environment: 'node',
    include: [
      'lib/i18n/*.spec.ts', 'lib/i18n/*.spec.tsx', 'lib/format/*.spec.ts', 'lib/date/*.spec.ts',
      'deploy/tools/envs-validator/i18n.spec.ts', 'ui/address/contract/sourceSelection.spec.ts',
      'ui/shared/Utilization/formatUtilization.spec.ts',
      'toolkit/components/forms/utils/getFormFieldErrorText.spec.ts',
      'lib/stats/localizeStatsMetadata.spec.ts',
    ],
    exclude: [ '**/node_modules/**', '**/node_modules_linux/**' ],
  },
});
