// Quat Capital, 2026-10-25: isolated i18n tests without reading application ENV fixtures.
// Modified by Quat Capital, 2026-10-26: include stable-id stats metadata regressions. GPL-3.0.
// Modified by Quat Capital, 2026-10-27: metadata and L2 runtime localization regressions. GPL-3.0.
// Modified by Quat Capital, 2026-10-29: network actions, native token links and protocol-status regressions. GPL-3.0.
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
      'toolkit/components/charts/utils/localeFormatting.spec.ts',
      'ui/shared/gas/formatGasValue.spec.ts',
      'ui/epochs/electionRewards/utils.spec.ts',
      'ui/advancedFilter/localization.spec.ts',
      'lib/stats/localizeStatsMetadata.spec.ts',
      'lib/metadata/localization.spec.ts',
      'ui/txnBatches/l2Localization.spec.tsx',
      'ui/games/capybaraLocale.spec.ts',
      'ui/csvExport/localization.spec.tsx',
      'ui/blocks/flashblocks/localization.spec.tsx',
      'ui/address/contract/localization.spec.tsx',
      'ui/address/remainderLocalization.spec.tsx',
      'ui/snippets/localization.spec.tsx',
      'lib/web3/useAddChainClick.spec.tsx',
      'lib/token/tokenTypes.localization.spec.tsx',
      'lib/clusters/actionBarUtils.spec.ts',
      'ui/shared/statusTag/ArbitrumL2TxnBatchStatus.spec.tsx',
    ],
    exclude: [ '**/node_modules/**', '**/node_modules_linux/**' ],
  },
});
