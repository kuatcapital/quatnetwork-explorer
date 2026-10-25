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

## Контрольная точка T18: основные разделы, 2026-10-25

Подключены подготовленные переводы транзакций, адресов, контрактов, токенов/NFT и верификации. Словари: EN 1114 / RU 1142 / KK 1114. TypeScript и полный ESLint проходят (7 существующих upstream warnings); i18n tests 33/33, tooling 10/10. Полнота всех экранов и browser smoke пока не подтверждены; Docker build отложен владельцем.

Уточнены подписи optimizer runs по документации Solidity: https://docs.soliditylang.org/en/latest/internals/optimizer.html#optimizer-parameter-runs ; исправлена команда solc --version. Инвентаризация теперь учитывает tooltip content и hint.

| Дата | Файл | Изменение |
|---|---|---|
| 2026-10-25 | `.gitignore` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/address/Address3rdPartyWidgets.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/address/AddressAccountHistory.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/address/AddressAccountHistoryFilter.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/address/AddressBlocksValidated.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/address/AddressCsvExportLink.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/address/AddressDeposits.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/address/AddressDetails.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/address/AddressEpochRewards.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/address/AddressInternalTxs.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/address/AddressLogs.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/address/AddressMultichainInfoButton.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/address/AddressTokenTransfers.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/address/AddressTokenTransfersLocal.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/address/AddressTokens.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/address/AddressTxs.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/address/AddressTxsFilter.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/address/AddressWithdrawals.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/address/SolidityscanReport.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/address/accountHistory/AddressAccountHistoryListItem.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/address/blocksValidated/AddressBlocksValidatedListItem.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/address/clusters/AddressClusters.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/address/coinBalance/AddressCoinBalanceChart.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/address/coinBalance/AddressCoinBalanceHistory.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/address/coinBalance/AddressCoinBalanceListItem.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/address/contract/ContractAutoVerificationStatus.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/address/contract/ContractCodeIdes.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/address/contract/ContractDetails.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/address/contract/ContractDetailsByteCode.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/address/contract/ContractDetailsConstructorArgs.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/address/contract/ContractDetailsDeployedByteCode.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/address/contract/ContractDetailsVerificationButton.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/address/contract/ContractExternalLibraries.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/address/contract/ContractSourceAddressSelector.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/address/contract/ContractSourceCode.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/address/contract/alerts/ConflictingImplementationsModal.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/address/contract/alerts/ContractDetailsAlertProxyPattern.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/address/contract/alerts/ContractDetailsAlertVerificationStatus.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/address/contract/alerts/ContractDetailsAlerts.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/address/contract/audits/ContractSecurityAudits.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/address/contract/audits/ContractSubmitAuditForm.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/address/contract/info/ContractDetailsInfo.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/address/contract/info/ContractDetailsInfoCreator.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/address/contract/methods/ContractAbi.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/address/contract/methods/ContractAbiItem.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/address/contract/methods/ContractMethodsCustom.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/address/contract/methods/ContractMethodsFilters.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/address/contract/methods/ContractMethodsMudSystem.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/address/contract/methods/alerts/ConnectWalletAlert.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/address/contract/methods/alerts/ContractCustomAbiAlert.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/address/contract/methods/form/ContractMethodAddressButton.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/address/contract/methods/form/ContractMethodFieldInput.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/address/contract/methods/form/ContractMethodFieldLabel.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/address/contract/methods/form/ContractMethodForm.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/address/contract/methods/form/ContractMethodResultWalletClient.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/address/contract/useContractDetailsTabs.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/address/contract/useContractTabs.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/address/details/AddressAlerts.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/address/details/AddressAlternativeFormat.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/address/details/AddressBalance.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/address/details/AddressCeloAccount.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/address/details/AddressFavoriteButton.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/address/details/AddressImplementations.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/address/details/AddressNameInfo.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/address/details/AddressNetWorth.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/address/details/AddressQrCode.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/address/ensDomains/AddressEnsDomains.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/address/epochRewards/AddressEpochRewardsListItem.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/address/epochRewards/AddressEpochRewardsTable.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/address/mud/AddressMudBreadcrumbs.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/address/mud/AddressMudRecordValues.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/address/mud/AddressMudRecordsTable.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/address/mud/AddressMudTables.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/address/mud/AddressMudTablesListItem.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/address/mud/AddressMudTablesTable.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/address/mud/AddressMudTablesTableItem.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/address/tokenSelect/TokenSelect.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/address/tokenSelect/TokenSelectButton.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/address/tokenSelect/TokenSelectMenu.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/address/tokenSelect/TokenSelectMobile.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/address/tokens/AddressCollections.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/address/tokens/AddressNFTs.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/address/tokens/AddressNftDisplayTypeRadio.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/address/tokens/ERC20Tokens.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/address/tokens/ERC20TokensListItem.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/address/tokens/ERC20TokensTable.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/address/tokens/NFTItem.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/addresses/AddressesListItem.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/addresses/AddressesTable.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/contractVerification/ContractVerificationForm.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/contractVerification/fields/ContractVerificationFieldAddress.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/contractVerification/fields/ContractVerificationFieldAutodetectArgs.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/contractVerification/fields/ContractVerificationFieldCode.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/contractVerification/fields/ContractVerificationFieldCommit.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/contractVerification/fields/ContractVerificationFieldCompiler.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/contractVerification/fields/ContractVerificationFieldConstructorArgs.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/contractVerification/fields/ContractVerificationFieldEvmVersion.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/contractVerification/fields/ContractVerificationFieldGitHubRepo.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/contractVerification/fields/ContractVerificationFieldIsYul.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/contractVerification/fields/ContractVerificationFieldLibraries.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/contractVerification/fields/ContractVerificationFieldLibraryItem.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/contractVerification/fields/ContractVerificationFieldLicenseType.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/contractVerification/fields/ContractVerificationFieldMethod.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/contractVerification/fields/ContractVerificationFieldName.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/contractVerification/fields/ContractVerificationFieldOptimization.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/contractVerification/fields/ContractVerificationFieldSources.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/contractVerification/fields/ContractVerificationFieldZkCompiler.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/contractVerification/methods/ContractVerificationFlattenSourceCode.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/contractVerification/methods/ContractVerificationMultiPartFile.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/contractVerification/methods/ContractVerificationSolidityFoundry.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/contractVerification/methods/ContractVerificationSolidityHardhat.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/contractVerification/methods/ContractVerificationSourcify.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/contractVerification/methods/ContractVerificationStandardInput.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/contractVerification/methods/ContractVerificationStylusGitHubRepo.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/contractVerification/methods/ContractVerificationVyperContract.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/contractVerification/methods/ContractVerificationVyperMultiPartFile.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/contractVerification/methods/ContractVerificationVyperStandardInput.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/contractVerification/utils.ts` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/internalTxs/InternalTxsListItem.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/internalTxs/InternalTxsTable.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/internalTxs/InternalTxsTableItem.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/pages/Accounts.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/pages/Address.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/pages/ContractVerification.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/pages/InternalTxs.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/pages/TokenInstance.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/pages/TokenTransfers.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/pages/Tokens.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/pages/Transaction.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/pages/Transactions.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/pages/VerifiedContracts.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/shared/Utilization/Utilization.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/shared/statusTag/TxStatus.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/token/TokenDetails.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/token/TokenHolders/TokenHolders.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/token/TokenHolders/TokenHoldersListItem.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/token/TokenHolders/TokenHoldersTable.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/token/TokenInventory.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/token/TokenInventoryItem.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/token/TokenNftMarketplaces.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/token/TokenPageTitle.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/token/TokenProjectInfo/Content.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/token/TokenProjectInfo/DocsLink.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/token/TokenTransfer/TokenTransfer.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/token/TokenTransfer/TokenTransferListItem.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/token/TokenTransfer/TokenTransferTable.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/tokenInstance/TokenInstanceDetails.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/tokenInstance/TokenInstanceMetadata.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/tokenInstance/TokenInstanceMetadataFetcher.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/tokenInstance/TokenInstancePageTitle.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/tokenInstance/details/TokenInstanceCreatorAddress.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/tokenInstance/details/TokenInstanceMetadataInfo.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/tokenInstance/details/TokenInstanceTransfersCount.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/tokens/Tokens.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/tokens/TokensActionBar.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/tokens/TokensBridgedChainsFilter.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/tokens/TokensListItem.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/tokens/TokensTableItem.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/tokens/utils.ts` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/tx/TxAllowedPeekers.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/tx/TxAssetFlows.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/tx/TxAuthorizations.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/tx/TxBlobs.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/tx/TxDetailsWrapped.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/tx/TxExternalTxs.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/tx/TxFHEOperations.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/tx/TxInternals.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/tx/TxLogs.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/tx/TxPendingAlert.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/tx/TxRawTrace.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/tx/TxSocketAlert.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/tx/TxState.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/tx/TxSubHeading.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/tx/TxTokenTransfer.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/tx/assetFlows/TxAssetFlowsListItem.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/tx/authorizations/TxAuthorizationsListItem.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/tx/authorizations/TxAuthorizationsTable.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/tx/authorizations/TxAuthorizationsTableItem.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/tx/blobs/TxBlobListItem.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/tx/blobs/TxBlobsTable.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/tx/blobs/TxBlobsTableItem.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/tx/details/TxDetailsBurntFees.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/tx/details/TxDetailsCrossChainMessage.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/tx/details/TxDetailsCrossChainMessages.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/tx/details/TxDetailsCrossChainTransfers.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/tx/details/TxDetailsFeePerGas.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/tx/details/TxDetailsGasPrice.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/tx/details/TxDetailsGasUsage.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/tx/details/TxDetailsInterop.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/tx/details/TxDetailsOther.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/tx/details/TxDetailsSetMaxGasLimit.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/tx/details/TxDetailsTacOperation.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/tx/details/TxDetailsTokenTransfers.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/tx/details/TxDetailsTxFee.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/tx/details/TxDetailsWithdrawalStatusArbitrum.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/tx/details/TxDetailsWithdrawalStatusOptimistic.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/tx/details/TxInfo.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/tx/details/TxInfoScrollFees.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/tx/details/TxRevertReason.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/tx/details/txDetailsActions/TxDetailsAction.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/tx/fheOperations/TxFHEOperationsListItem.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/tx/fheOperations/TxFHEOperationsStats.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/tx/fheOperations/TxFHEOperationsTable.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/tx/fheOperations/TxFHEOperationsTableItem.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/tx/internals/TxInternalsListItem.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/tx/internals/TxInternalsTable.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/tx/internals/TxInternalsTableItem.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/tx/internals/utils.ts` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/tx/state/TxStateListItem.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/tx/state/TxStateTable.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/tx/state/TxStateTableItem.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/tx/state/TxStateTokenIdList.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/tx/state/utils.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/tx/tokenTransfers/TxTokenTransferCrossChain.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/tx/tokenTransfers/TxTokenTransferLocal.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/txs/TxAdditionalInfo.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/txs/TxAdditionalInfoContent.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/txs/TxType.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/txs/TxsContent.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/txs/TxsHeaderMobile.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/txs/TxsListItem.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/txs/TxsStats.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/txs/TxsTable.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/txs/TxsTabs.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/txs/useTxsSort.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/verifiedContracts/VerifiedContractsCounters.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/verifiedContracts/VerifiedContractsFilter.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/verifiedContracts/VerifiedContractsListItem.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/verifiedContracts/VerifiedContractsTable.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/verifiedContracts/VerifiedContractsTableItem.tsx` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/verifiedContracts/utils.ts` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `lib/i18n/plurals.spec.ts` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `tools/i18n/address-translations.json` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `tools/i18n/blocks-translations.json` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `tools/i18n/contracts-translations.json` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `tools/i18n/home-translations.json` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `tools/i18n/search-translations.json` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `tools/i18n/token-translations.json` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `tools/i18n/transactions-translations.json` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `tools/i18n/verification-translations.json` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/address/contract/sourceSelection.spec.ts` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/address/contract/sourceSelection.ts` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/address/useAddressValidationLabels.ts` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/shared/Utilization/formatUtilization.spec.ts` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/shared/Utilization/formatUtilization.ts` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
| 2026-10-25 | `ui/tx/details/confirmationDuration.ts` | T18: переводы, локализованные значения или их проверка; текущая контрольная точка. |
