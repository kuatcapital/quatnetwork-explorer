<!-- Modified by Quat Capital, 2026-10-25: T18 change log and partial implementation checkpoint. GPL-3.0. -->
# Quat Network Testnet explorer — modified Blockscout frontend

This repository is the Corresponding Source of the explorer frontend served at
https://testnet.quatcapital.kz (Quat Network Testnet, chainId 77477).

- Upstream: [blockscout/frontend v2.7.2](https://github.com/blockscout/frontend/tree/v2.7.2),
  commit `446c409eeb54274aab90ff371a705f9699cd84ef`, licensed under **GNU GPL v3.0** (see `LICENSE`).
- The first commit of this repository is the unmodified upstream source.
- Later commits are modifications by Quat Capital (ИП «QUAT CAPITAL», Almaty, Kazakhstan).
  They are distributed under the same GPL-3.0 licence.

## Modifications

| Date | File | Change |
|------|------|--------|
| 2026-10-25 | `ui/snippets/footer/Footer.tsx` | Footer simplified: removed the "Blockscout" links column, the project description and the version lines. Kept the "Made with Blockscout" link and the Blockscout Limited copyright notice. Custom link groups come from `NEXT_PUBLIC_FOOTER_LINKS`. |
| 2026-10-25 | `ui/snippets/footer/Footer.tsx` | Removed the "Made with Blockscout" logo and the copyright line (GPL-3.0 §5(d): the original interface does not display full Appropriate Legal Notices). Added a "Based on Blockscout · GPL-3.0" line (in Russian) linking to this repository. Copyright notices in source files and `LICENSE` are unchanged. |

## Build

Standard upstream Dockerfile:

```bash
docker build -t quat/blockscout-frontend:v2.7.2 \
  --build-arg GIT_TAG=v2.7.2 --build-arg GIT_COMMIT_SHA=$(git rev-parse --short HEAD) .
```

Runtime configuration (environment variables) for the testnet lives in the operator's deployment and contains no code.

Blockscout is a trademark of Blockscout Limited. This project is not affiliated with or endorsed by Blockscout Limited.

## T18 · 2026-10-25 · основа и первая группа перевода

Изменено Quat Capital 2026-10-25. Лицензия исходников сохраняется GPL-3.0.

**Промежуточная контрольная точка: весь интерфейс ещё не переведён.** Добавлены RU/KK к исходному EN, runtime-словари, переключатель RU/KZ/EN, SSR и первые группы общего интерфейса. Казахский требует вычитки носителем; browser smoke и Docker build ещё не выполнены. Docker build владелец отложил.

Выбраны i18next 26.5.10, react-i18next 17.1.8 и i18next-http-backend 4.0.5: HTTP-загрузка/повторная загрузка JSON и постепенное извлечение захардкоженных строк подходят существующему Pages Router. JSON не импортируется в клиентский bundle; доставка через assets и optional runtime API. Английские исходные фразы сохраняются. RU — default, казахская locale — kk.

Проверки первой группы: полный TypeScript — PASS; полный ESLint — 0 ошибок (7 существующих warnings в upstream Playwright). После review-исправлений 26 isolated unit tests (включая Day.js) и 10 tooling fixtures — PASS; рабочий jq-фильтр миграции словарей проверен 17 fixtures. Последующие группы проверяются отдельно перед своими коммитами. Эти проверки не подтверждают завершение всей T18.

План и журнал продолжения: [T18](https://github.com/kuatcapital/quatnetwork/blob/astra/i18n/docs/tasks/T18-HANDOFF.md).

| Date | File | Change |
|------|------|--------|
| 2026-10-25 | `.gitattributes` | LF для проверяемого кода на Windows; существующее правило LFS сохранено. |
| 2026-10-25 | `configs/app/i18n.ts` | Документирование и проверка optional runtime-настроек локализации. |
| 2026-10-25 | `configs/app/index.ts` | Документирование и проверка optional runtime-настроек локализации. |
| 2026-10-25 | `deploy/tools/envs-validator/i18n.spec.ts` | Изолированные регрессионные проверки i18n, без application ENV fixtures. |
| 2026-10-25 | `deploy/tools/envs-validator/schema.ts` | Документирование и проверка optional runtime-настроек локализации. |
| 2026-10-25 | `deploy/tools/envs-validator/schema_multichain.ts` | Документирование и проверка optional runtime-настроек локализации. |
| 2026-10-25 | `deploy/tools/envs-validator/schemas/i18n.ts` | Документирование и проверка optional runtime-настроек локализации. |
| 2026-10-25 | `docs/ENVS.md` | Документирование и проверка optional runtime-настроек локализации. |
| 2026-10-25 | `docs/I18N.md` | Инструкция переводчика и честные ограничения покрытия. |
| 2026-10-25 | `lib/date/dayjs.spec.ts` | Изолированные регрессионные проверки i18n, без application ENV fixtures. |
| 2026-10-25 | `lib/date/dayjs.ts` | Явная локаль даты/числа; без общего изменяемого языка и подмены Number.prototype. |
| 2026-10-25 | `lib/format/localeNumbers.spec.ts` | Изолированные регрессионные проверки i18n, без application ENV fixtures. |
| 2026-10-25 | `lib/format/localeNumbers.ts` | Явная локаль даты/числа; без общего изменяемого языка и подмены Number.prototype. |
| 2026-10-25 | `lib/hooks/useNavItems.tsx` | Навигация RU/KK/EN с пересчётом при смене языка. |
| 2026-10-25 | `lib/hooks/useTimeAgoIncrement.tsx` | Явная локаль даты/числа; без общего изменяемого языка и подмены Number.prototype. |
| 2026-10-25 | `lib/i18n/client.spec.ts` | Изолированные регрессионные проверки i18n, без application ENV fixtures. |
| 2026-10-25 | `lib/i18n/client.ts` | Runtime-загрузка, проверка JSON, SSR snapshot, fallback и переключение локали. |
| 2026-10-25 | `lib/i18n/config.spec.ts` | Изолированные регрессионные проверки i18n, без application ENV fixtures. |
| 2026-10-25 | `lib/i18n/config.ts` | Runtime-загрузка, проверка JSON, SSR snapshot, fallback и переключение локали. |
| 2026-10-25 | `lib/i18n/provider.tsx` | Runtime-загрузка, проверка JSON, SSR snapshot, fallback и переключение локали. |
| 2026-10-25 | `lib/i18n/server.spec.ts` | Изолированные регрессионные проверки i18n, без application ENV fixtures. |
| 2026-10-25 | `lib/i18n/server.ts` | Runtime-загрузка, проверка JSON, SSR snapshot, fallback и переключение локали. |
| 2026-10-25 | `lib/setLocale.ts` | Явная локаль даты/числа; без общего изменяемого языка и подмены Number.prototype. |
| 2026-10-25 | `locales/en.json` | Внешний runtime-словарь; общий набор ключей EN/RU/KK, metadata об изменении. |
| 2026-10-25 | `locales/kk.json` | Внешний runtime-словарь; общий набор ключей EN/RU/KK, metadata об изменении. |
| 2026-10-25 | `locales/ru.json` | Внешний runtime-словарь; общий набор ключей EN/RU/KK, metadata об изменении. |
| 2026-10-25 | `nextjs/getServerSideProps/handlers.ts` | SSR-контекст локали, HTML lang, provider и standalone API словарей. |
| 2026-10-25 | `package.json` | Точные зависимости i18next/react-i18next/HTTP backend и команды проверок. |
| 2026-10-25 | `pages/_app.tsx` | SSR-контекст локали, HTML lang, provider и standalone API словарей. |
| 2026-10-25 | `pages/_document.tsx` | SSR-контекст локали, HTML lang, provider и standalone API словарей. |
| 2026-10-25 | `pages/api/i18n/[locale].ts` | SSR-контекст локали, HTML lang, provider и standalone API словарей. |
| 2026-10-25 | `tools/i18n/check-locales.mjs` | AST-инвентаризация, контроль словарей и ограниченный просмотренный codemod. |
| 2026-10-25 | `tools/i18n/inventory.json` | AST-инвентаризация, контроль словарей и ограниченный просмотренный codemod. |
| 2026-10-25 | `tools/i18n/inventory.mjs` | AST-инвентаризация, контроль словарей и ограниченный просмотренный codemod. |
| 2026-10-25 | `tools/i18n/localize-reviewed.mjs` | AST-инвентаризация, контроль словарей и ограниченный просмотренный codemod. |
| 2026-10-25 | `tools/i18n/sources.mjs` | AST-инвентаризация, контроль словарей и ограниченный просмотренный codemod. |
| 2026-10-25 | `tools/i18n/tooling.test.mjs` | Изолированные регрессионные проверки i18n, без application ENV fixtures. |
| 2026-10-25 | `ui/blocks/BlocksContent.tsx` | Пользовательские строки вынесены в runtime-ключи; выбранная локаль для отображаемых значений. |
| 2026-10-25 | `ui/blocks/BlocksListItem.tsx` | Пользовательские строки вынесены в runtime-ключи; выбранная локаль для отображаемых значений. |
| 2026-10-25 | `ui/blocks/BlocksTabSlot.tsx` | Пользовательские строки вынесены в runtime-ключи; выбранная локаль для отображаемых значений. |
| 2026-10-25 | `ui/blocks/BlocksTable.tsx` | Пользовательские строки вынесены в runtime-ключи; выбранная локаль для отображаемых значений. |
| 2026-10-25 | `ui/blocks/BlocksTableItem.tsx` | Пользовательские строки вынесены в runtime-ключи; выбранная локаль для отображаемых значений. |
| 2026-10-25 | `ui/home/HeroBanner.tsx` | Пользовательские строки вынесены в runtime-ключи; выбранная локаль для отображаемых значений. |
| 2026-10-25 | `ui/home/LatestBlocks.tsx` | Пользовательские строки вынесены в runtime-ключи; выбранная локаль для отображаемых значений. |
| 2026-10-25 | `ui/home/LatestBlocksItem.tsx` | Пользовательские строки вынесены в runtime-ключи; выбранная локаль для отображаемых значений. |
| 2026-10-25 | `ui/home/LatestTxs.tsx` | Пользовательские строки вынесены в runtime-ключи; выбранная локаль для отображаемых значений. |
| 2026-10-25 | `ui/home/LatestTxsItem.tsx` | Пользовательские строки вынесены в runtime-ключи; выбранная локаль для отображаемых значений. |
| 2026-10-25 | `ui/home/LatestTxsItemMobile.tsx` | Пользовательские строки вынесены в runtime-ключи; выбранная локаль для отображаемых значений. |
| 2026-10-25 | `ui/home/LatestWatchlistTxs.tsx` | Пользовательские строки вынесены в runtime-ключи; выбранная локаль для отображаемых значений. |
| 2026-10-25 | `ui/home/Stats.tsx` | Пользовательские строки вынесены в runtime-ключи; выбранная локаль для отображаемых значений. |
| 2026-10-25 | `ui/home/Transactions.tsx` | Пользовательские строки вынесены в runtime-ключи; выбранная локаль для отображаемых значений. |
| 2026-10-25 | `ui/home/fallbacks/LatestBlocksDegraded.tsx` | Пользовательские строки вынесены в runtime-ключи; выбранная локаль для отображаемых значений. |
| 2026-10-25 | `ui/home/fallbacks/LatestBlocksFallback.tsx` | Пользовательские строки вынесены в runtime-ключи; выбранная локаль для отображаемых значений. |
| 2026-10-25 | `ui/home/fallbacks/LatestTxsDegraded.tsx` | Пользовательские строки вынесены в runtime-ключи; выбранная локаль для отображаемых значений. |
| 2026-10-25 | `ui/home/fallbacks/LatestTxsFallback.tsx` | Пользовательские строки вынесены в runtime-ключи; выбранная локаль для отображаемых значений. |
| 2026-10-25 | `ui/home/fallbacks/StatsDegraded.tsx` | Пользовательские строки вынесены в runtime-ключи; выбранная локаль для отображаемых значений. |
| 2026-10-25 | `ui/home/indicators/ChainIndicatorChartContainer.tsx` | Пользовательские строки вынесены в runtime-ключи; выбранная локаль для отображаемых значений. |
| 2026-10-25 | `ui/home/indicators/ChainIndicatorItem.tsx` | Пользовательские строки вынесены в runtime-ключи; выбранная локаль для отображаемых значений. |
| 2026-10-25 | `ui/home/indicators/ChainIndicators.tsx` | Пользовательские строки вынесены в runtime-ключи; выбранная локаль для отображаемых значений. |
| 2026-10-25 | `ui/home/indicators/ChainIndicatorsChart.tsx` | Пользовательские строки вынесены в runtime-ключи; выбранная локаль для отображаемых значений. |
| 2026-10-25 | `ui/home/indicators/useChartDataQuery.tsx` | Пользовательские строки вынесены в runtime-ключи; выбранная локаль для отображаемых значений. |
| 2026-10-25 | `ui/home/latestBatches/LatestArbitrumL2Batches.tsx` | Пользовательские строки вынесены в runtime-ключи; выбранная локаль для отображаемых значений. |
| 2026-10-25 | `ui/home/latestBatches/LatestBatchItem.tsx` | Пользовательские строки вынесены в runtime-ключи; выбранная локаль для отображаемых значений. |
| 2026-10-25 | `ui/home/latestBatches/LatestZkEvmL2Batches.tsx` | Пользовательские строки вынесены в runtime-ключи; выбранная локаль для отображаемых значений. |
| 2026-10-25 | `ui/home/latestCrossChainTxs/LatestCrossChainTxs.tsx` | Пользовательские строки вынесены в runtime-ключи; выбранная локаль для отображаемых значений. |
| 2026-10-25 | `ui/home/latestDeposits/LatestArbitrumDeposits.tsx` | Пользовательские строки вынесены в runtime-ключи; выбранная локаль для отображаемых значений. |
| 2026-10-25 | `ui/home/latestDeposits/LatestDeposits.tsx` | Пользовательские строки вынесены в runtime-ключи; выбранная локаль для отображаемых значений. |
| 2026-10-25 | `ui/home/latestDeposits/LatestDepositsItem.tsx` | Пользовательские строки вынесены в runtime-ключи; выбранная локаль для отображаемых значений. |
| 2026-10-25 | `ui/home/latestDeposits/LatestOptimisticDeposits.tsx` | Пользовательские строки вынесены в runtime-ключи; выбранная локаль для отображаемых значений. |
| 2026-10-25 | `ui/home/latestZetaChainCCTX/LatestZetaChainCCTXs.tsx` | Пользовательские строки вынесены в runtime-ключи; выбранная локаль для отображаемых значений. |
| 2026-10-25 | `ui/pages/Blocks.tsx` | Пользовательские строки вынесены в runtime-ключи; выбранная локаль для отображаемых значений. |
| 2026-10-25 | `ui/pages/Token.tsx` | Пользовательские строки вынесены в runtime-ключи; выбранная локаль для отображаемых значений. |
| 2026-10-25 | `ui/shared/AppError/AppError.tsx` | Пользовательские строки вынесены в runtime-ключи; выбранная локаль для отображаемых значений. |
| 2026-10-25 | `ui/shared/AppError/custom/AppErrorBlockConsensus.tsx` | Пользовательские строки вынесены в runtime-ключи; выбранная локаль для отображаемых значений. |
| 2026-10-25 | `ui/shared/AppError/custom/AppErrorTooManyRequests.tsx` | Пользовательские строки вынесены в runtime-ключи; выбранная локаль для отображаемых значений. |
| 2026-10-25 | `ui/shared/AppError/custom/AppErrorTxNotFound.tsx` | Пользовательские строки вынесены в runtime-ключи; выбранная локаль для отображаемых значений. |
| 2026-10-25 | `ui/shared/CopyToClipboard.tsx` | Пользовательские строки вынесены в runtime-ключи; выбранная локаль для отображаемых значений. |
| 2026-10-25 | `ui/shared/NumberEntity.tsx` | Пользовательские строки вынесены в runtime-ключи; выбранная локаль для отображаемых значений. |
| 2026-10-25 | `ui/shared/pagination/Pagination.tsx` | Пользовательские строки вынесены в runtime-ключи; выбранная локаль для отображаемых значений. |
| 2026-10-25 | `ui/shared/time/Time.tsx` | Явная локаль даты/числа; без общего изменяемого языка и подмены Number.prototype. |
| 2026-10-25 | `ui/shared/time/TimeFormatToggle.tsx` | Явная локаль даты/числа; без общего изменяемого языка и подмены Number.prototype. |
| 2026-10-25 | `ui/shared/time/TimeWithTooltip.tsx` | Явная локаль даты/числа; без общего изменяемого языка и подмены Number.prototype. |
| 2026-10-25 | `ui/shared/value/NativeCoinValue.tsx` | Пользовательские строки вынесены в runtime-ключи; выбранная локаль для отображаемых значений. |
| 2026-10-25 | `ui/shared/value/SimpleValue.tsx` | Пользовательские строки вынесены в runtime-ключи; выбранная локаль для отображаемых значений. |
| 2026-10-25 | `ui/shared/value/utils.ts` | Пользовательские строки вынесены в runtime-ключи; выбранная локаль для отображаемых значений. |
| 2026-10-25 | `ui/snippets/footer/Footer.tsx` | Пользовательские строки вынесены в runtime-ключи; выбранная локаль для отображаемых значений. |
| 2026-10-25 | `ui/snippets/footer/FooterLinkItem.tsx` | Пользовательские строки вынесены в runtime-ключи; выбранная локаль для отображаемых значений. |
| 2026-10-25 | `ui/snippets/footer/IntTxsIndexingStatus.tsx` | Пользовательские строки вынесены в runtime-ключи; выбранная локаль для отображаемых значений. |
| 2026-10-25 | `ui/snippets/header/HeaderAlert.tsx` | Пользовательские строки вынесены в runtime-ключи; выбранная локаль для отображаемых значений. |
| 2026-10-25 | `ui/snippets/header/HeaderDesktop.tsx` | Пользовательские строки вынесены в runtime-ключи; выбранная локаль для отображаемых значений. |
| 2026-10-25 | `ui/snippets/header/HeaderMobile.tsx` | Пользовательские строки вынесены в runtime-ключи; выбранная локаль для отображаемых значений. |
| 2026-10-25 | `ui/snippets/header/LanguageSelector.tsx` | Пользовательские строки вынесены в runtime-ключи; выбранная локаль для отображаемых значений. |
| 2026-10-25 | `ui/snippets/searchBar/SearchBarDesktop.tsx` | Пользовательские строки вынесены в runtime-ключи; выбранная локаль для отображаемых значений. |
| 2026-10-25 | `ui/snippets/searchBar/SearchBarInput.tsx` | Пользовательские строки вынесены в runtime-ключи; выбранная локаль для отображаемых значений. |
| 2026-10-25 | `ui/snippets/searchBar/SearchBarMobile.tsx` | Пользовательские строки вынесены в runtime-ключи; выбранная локаль для отображаемых значений. |
| 2026-10-25 | `ui/snippets/searchBar/SearchBarRecentKeywords.tsx` | Пользовательские строки вынесены в runtime-ключи; выбранная локаль для отображаемых значений. |
| 2026-10-25 | `ui/snippets/searchBar/SearchBarSuggest/SearchBarSuggest.tsx` | Пользовательские строки вынесены в runtime-ключи; выбранная локаль для отображаемых значений. |
| 2026-10-25 | `ui/snippets/searchBar/SearchBarSuggest/SearchBarSuggestAddress.tsx` | Пользовательские строки вынесены в runtime-ключи; выбранная локаль для отображаемых значений. |
| 2026-10-25 | `ui/snippets/searchBar/SearchBarSuggest/SearchBarSuggestApp.tsx` | Пользовательские строки вынесены в runtime-ключи; выбранная локаль для отображаемых значений. |
| 2026-10-25 | `ui/snippets/searchBar/SearchBarSuggest/SearchBarSuggestBlock.tsx` | Пользовательские строки вынесены в runtime-ключи; выбранная локаль для отображаемых значений. |
| 2026-10-25 | `ui/snippets/searchBar/SearchBarSuggest/SearchBarSuggestBlockCountdown.tsx` | Пользовательские строки вынесены в runtime-ключи; выбранная локаль для отображаемых значений. |
| 2026-10-25 | `ui/snippets/searchBar/SearchBarSuggest/SearchBarSuggestDomain.tsx` | Пользовательские строки вынесены в runtime-ключи; выбранная локаль для отображаемых значений. |
| 2026-10-25 | `ui/snippets/searchBar/SearchBarSuggest/SearchBarSuggestToken.tsx` | Пользовательские строки вынесены в runtime-ключи; выбранная локаль для отображаемых значений. |
| 2026-10-25 | `ui/snippets/searchBar/useLocalizedSearchCategories.ts` | Пользовательские строки вынесены в runtime-ключи; выбранная локаль для отображаемых значений. |
| 2026-10-25 | `ui/snippets/searchBar/useSearchMultichain.tsx` | Пользовательские строки вынесены в runtime-ключи; выбранная локаль для отображаемых значений. |
| 2026-10-25 | `ui/snippets/topBar/settings/SettingsLocalTime.tsx` | Явная локаль даты/числа; без общего изменяемого языка и подмены Number.prototype. |
| 2026-10-25 | `ui/tokens/TokensTable.tsx` | Пользовательские строки вынесены в runtime-ключи; выбранная локаль для отображаемых значений. |
| 2026-10-25 | `vitest.i18n.config.mts` | Изолированные регрессионные проверки i18n, без application ENV fixtures. |
| 2026-10-25 | `yarn.lock` | Точные зависимости i18next/react-i18next/HTTP backend и команды проверок. |
| 2026-10-25 | `QUAT-CHANGES.md` | Перечень файлов и проверок контрольной точки T18. |
