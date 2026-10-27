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

## 2026-10-26 — аккаунт, общие компоненты, блоки, статистика и toolkit (T18)

Русский и казахский интерфейс: аккаунт и авторизация, метки/наблюдение/ABI, общие сущности и журналы, блоки/countdown/газ, известные метаданные статистики по ID, базовые элементы toolkit и сообщения клиентской валидации. Даты выбирают UTC/local независимо от языка; неизвестные данные API сохраняются. Словари читаются во время работы; KK требует вычитки носителем. Полная T18 ещё не завершена, Docker build отложен владельцем.

| Дата | Файл | Изменение |
|---|---|---|
| 2026-10-26 | `QUAT-CHANGES.md` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `lib/date/timestamp.spec.ts` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `lib/date/timestamp.ts` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `lib/stats/localizeStatsMetadata.spec.ts` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `lib/stats/localizeStatsMetadata.ts` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `locales/en.json` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `locales/kk.json` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `locales/ru.json` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `toolkit/chakra/close-button.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `toolkit/chakra/collapsible.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `toolkit/chakra/empty-state.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `toolkit/chakra/select.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `toolkit/components/AdaptiveTabs/AdaptiveTabsMenu.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `toolkit/components/Hint/Hint.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `toolkit/components/buttons/AddButton.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `toolkit/components/buttons/ClearButton.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `toolkit/components/buttons/RemoveButton.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `toolkit/components/forms/fields/FormFieldAddress.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `toolkit/components/forms/fields/FormFieldColor.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `toolkit/components/forms/fields/FormFieldEmail.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `toolkit/components/forms/fields/FormFieldSelect.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `toolkit/components/forms/fields/FormFieldSelectAsync.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `toolkit/components/forms/fields/FormFieldText.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `toolkit/components/forms/fields/image/FormFieldImagePreview.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `toolkit/components/forms/inputs/file/FileSnippet.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `toolkit/components/forms/utils/getFormFieldErrorText.spec.ts` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `toolkit/components/forms/utils/getFormFieldErrorText.ts` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `toolkit/components/loaders/ContentLoader.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `tools/i18n/account-translations.json` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `tools/i18n/blocks-stats-translations.json` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `tools/i18n/inventory.json` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `tools/i18n/shared-entities-translations.json` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `tools/i18n/shared-logs-translations.json` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `tools/i18n/shared-remainder-translations.json` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `tools/i18n/shared-search-items-translations.json` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `tools/i18n/stats-metadata-translations.json` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `tools/i18n/toolkit-translations.json` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/addressVerification/AddressVerificationModal.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/addressVerification/steps/AddressVerificationStepAddress.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/addressVerification/steps/AddressVerificationStepSignature.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/addressVerification/steps/AddressVerificationStepSuccess.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/apiKey/ApiKeyModal/ApiKeyForm.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/apiKey/ApiKeyModal/ApiKeyModal.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/apiKey/ApiKeyTable/ApiKeyTable.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/apiKey/DeleteApiKeyModal.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/blob/BlobData.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/blob/BlobDataImage.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/blob/BlobInfo.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/block/BlockCeloEpochTag.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/block/BlockDeposits.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/block/BlockDetails.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/block/BlockInternalTxs.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/block/BlockWithdrawals.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/block/details/BlockDetailsBaseFeeCelo.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/block/details/BlockDetailsBlobInfo.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/block/details/BlockDetailsZilliqaQuorumCertificate.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/blockCountdown/BlockCountdownTimer.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/blockCountdown/createGoogleCalendarLink.ts` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/blockCountdown/createIcsFileBlob.ts` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/blocks/Flashblocks.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/blocks/flashblocks/FlashblocksListItem.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/blocks/flashblocks/FlashblocksStats.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/blocks/flashblocks/FlashblocksTable.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/blocks/flashblocks/FlashblocksTableItem.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/customAbi/CustomAbiModal/CustomAbiForm.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/customAbi/CustomAbiModal/CustomAbiModal.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/customAbi/CustomAbiTable/CustomAbiTable.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/customAbi/DeleteCustomAbiModal.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/gasTracker/GasTrackerChart.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/gasTracker/GasTrackerFaq.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/gasTracker/GasTrackerNetworkUtilization.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/gasTracker/GasTrackerPriceSnippet.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/myProfile/MyProfileEmail.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/myProfile/MyProfileWallet.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/myProfile/fields/MyProfileFieldsEmail.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/pages/ApiKeys.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/pages/Blob.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/pages/Block.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/pages/BlockCountdown.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/pages/BlockCountdownIndex.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/pages/Blocks.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/pages/Chart.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/pages/CustomAbi.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/pages/GasTracker.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/pages/MyProfile.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/pages/PrivateTags.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/pages/PublicTagsSubmit.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/pages/Stats.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/pages/VerifiedAddresses.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/pages/Watchlist.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/privateTags/AddressModal/AddressForm.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/privateTags/AddressModal/AddressModal.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/privateTags/AddressTagTable/AddressTagListItem.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/privateTags/AddressTagTable/AddressTagTable.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/privateTags/DeletePrivateTagModal.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/privateTags/PrivateAddressTags.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/privateTags/PrivateTransactionTags.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/privateTags/TransactionModal/TransactionForm.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/privateTags/TransactionModal/TransactionModal.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/privateTags/TransactionTagTable/TransactionTagListItem.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/privateTags/TransactionTagTable/TransactionTagTable.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/publicTags/submit/PublicTagsSubmitForm.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/publicTags/submit/PublicTagsSubmitResult.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/publicTags/submit/fields/PublicTagsSubmitFieldAddresses.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/publicTags/submit/fields/PublicTagsSubmitFieldTag.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/publicTags/submit/fields/PublicTagsSubmitFieldTagIcon.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/publicTags/submit/fields/PublicTagsSubmitFieldTagType.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/publicTags/submit/result/PublicTagsSubmitResultSuccess.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/publicTags/submit/result/PublicTagsSubmitResultWithErrors.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/searchResults/SearchResultListItem.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/searchResults/SearchResultTableItem.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/shared/AccountActionsMenu/AccountActionsMenu.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/shared/AccountActionsMenu/items/MetadataUpdateMenuItem.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/shared/AccountActionsMenu/items/PrivateTagMenuItem.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/shared/AccountActionsMenu/items/PublicTagMenuItem.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/shared/AccountActionsMenu/items/TokenInfoMenuItem.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/shared/AdditionalInfoButton.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/shared/ClusterIcon.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/shared/ContractCertifiedLabel.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/shared/DataFetchAlert.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/shared/DeleteModal.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/shared/DetailedInfo/DetailedInfo.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/shared/DetailedInfo/DetailedInfoActionsWrapper.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/shared/DetailedInfo/DetailedInfoSponsoredItem.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/shared/DetailedInfo/DetailedInfoTimestamp.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/shared/EntityTags/EntityTagIcon.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/shared/EntityTags/EntityTagTooltip.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/shared/FormSubmitAlert.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/shared/GasUsedToTargetRatio.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/shared/InfoButton.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/shared/NativeTokenIcon.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/shared/NetworkAddToWallet.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/shared/NetworkExplorers.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/shared/PrevNext.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/shared/RawInputData.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/shared/ResetIconButton.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/shared/SocketAlert.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/shared/SocketNewItemsNotice.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/shared/TableItemActionButtons.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/shared/TokenTransfer/TokenTransferFilter.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/shared/TokenTransfer/TokenTransferListItem.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/shared/TokenTransfer/TokenTransferTable.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/shared/TokenTransfer/TokenTransferTableItem.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/shared/TokenTransfer/helpers.ts` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/shared/address/AddressFromToIcon.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/shared/alerts/ServiceDegradationWarning.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/shared/alerts/TestnetWarning.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/shared/batch/CeleniumLink.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/shared/batch/OptimisticL2TxnBatchDA.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/shared/blob/BlobDataType.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/shared/block/BlockGasUsed.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/shared/block/BlockPendingUpdateAlert.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/shared/block/BlockPendingUpdateHint.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/shared/celo/NativeTokenTag.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/shared/chart/ChartIntervalSelect.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/shared/chart/useChartQuery.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/shared/crossChain/CrossChainFromToTag.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/shared/entities/address/AddressEntity.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/shared/entities/address/AddressEntityContentProxy.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/shared/entities/address/AddressEntityInterop.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/shared/entities/address/AddressEntityTacTon.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/shared/entities/address/AddressEntityZetaChain.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/shared/entities/address/AddressIdenticon.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/shared/entities/address/NounsIdenticon.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/shared/entities/block/BlockEntity.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/shared/entities/clusters/ClustersEntity.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/shared/entities/crossChainMessage/CrossChainMessageEntity.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/shared/entities/ens/EnsEntity.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/shared/entities/token/TokenEntity.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/shared/entities/tx/TxEntity.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/shared/entities/tx/TxEntityInterop.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/shared/entities/userOp/UserOpEntity.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/shared/externalChains/ChainIcon.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/shared/externalChains/ChainLabel.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/shared/externalChains/ChainSelect.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/shared/externalChains/getChainTooltipText.ts` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/shared/fallbacks/FallbackChart.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/shared/fallbacks/FallbackRpcIcon.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/shared/filters/FilterButton.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/shared/filters/TableColumnFilter.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/shared/filters/TableColumnFilterWrapper.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/shared/filters/TokenTypeFilter.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/shared/gas/GasInfoTooltip.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/shared/gas/GasInfoTooltipRow.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/shared/links/AdvancedFilterLink.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/shared/links/LinkNewTab.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/shared/logs/LogDecodedInputDataHeader.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/shared/logs/LogDecodedInputDataTable.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/shared/logs/LogIndex.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/shared/logs/LogItem.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/shared/logs/LogTopic.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/shared/nft/NftImage.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/shared/reCaptcha/ReCaptcha.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/shared/search/ExternalSearchItem.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/shared/search/useLocalizedSearchItemTitles.ts` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/shared/sort/Sort.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/shared/statusTag/ArbitrumL2MessageStatus.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/shared/statusTag/ArbitrumL2TxnBatchStatus.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/shared/statusTag/CeloEpochStatus.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/shared/statusTag/ContractCreationStatus.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/shared/statusTag/CrossChainTxsStatusTag.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/shared/statusTag/InteropMessageStatus.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/shared/statusTag/ScrollL2TxnBatchStatus.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/shared/statusTag/TacOperationStatus.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/shared/statusTag/TxAuthorizationStatus.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/shared/statusTag/ValidatorStabilityStatus.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/shared/statusTag/ZkEvmL2TxnBatchStatus.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/shared/statusTag/ZkSyncL2TxnBatchStatus.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/shared/texts/AdminSupportText.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/shared/time/Time.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/shared/time/TimeWithTooltip.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/shared/tx/interpretation/TxInterpretation.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/shared/userOps/UserOpSponsorType.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/shared/userOps/UserOpStatus.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/shared/value/AssetValue.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/shared/value/calculateUsdValue.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/shared/zetaChain/ZetaChainCCTXStatusTag.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/shared/zetaChain/ZetaChainCCTXValue.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/snippets/auth/AuthModal.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/snippets/auth/screens/AuthModalScreenEmail.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/snippets/auth/screens/AuthModalScreenOtpCode.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/snippets/auth/screens/AuthModalScreenSelectMethod.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/snippets/auth/screens/AuthModalScreenSuccessEmail.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/snippets/auth/screens/AuthModalScreenSuccessWallet.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/snippets/auth/useLogout.ts` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/snippets/auth/useSignInWithWallet.ts` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/snippets/user/UserWalletAutoConnectAlert.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/snippets/user/profile/auth0/UserProfileButton.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/snippets/user/profile/auth0/UserProfileContent.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/snippets/user/profile/common/UserProfileContentWallet.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/snippets/user/profile/dynamic/UserProfileButton.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/snippets/user/profile/dynamic/UserProfilePopover.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/snippets/user/wallet/UserWalletButton.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/snippets/user/wallet/UserWalletMenuContent.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/stats/ChartWidgetContainer.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/stats/ChartsLoadingErrorAlert.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/stats/ChartsWidgetsList.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/stats/NumberWidgetsList.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/stats/StatsFilters.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/stats/constants/index.ts` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/stats/useStats.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/verifiedAddresses/VerifiedAddressesEmailAlert.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/verifiedAddresses/VerifiedAddressesListItem.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/verifiedAddresses/VerifiedAddressesStatus.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/verifiedAddresses/VerifiedAddressesTable.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/verifiedAddresses/VerifiedAddressesTableItem.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/watchlist/AddressModal/AddressForm.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/watchlist/AddressModal/AddressFormNotifications.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/watchlist/AddressModal/AddressModal.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/watchlist/DeleteAddressModal.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/watchlist/WatchlistEmailAlert.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/watchlist/WatchlistTable/WatchListAddressItem.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/watchlist/WatchlistTable/WatchListItem.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/watchlist/WatchlistTable/WatchListTableItem.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `ui/watchlist/WatchlistTable/WatchlistTable.tsx` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |
| 2026-10-26 | `vitest.i18n.config.mts` | T18: runtime-переводы, локализованные значения, инвентаризация или соответствующие проверки. |

## 2026-10-26 — награды, каталоги, валидаторы, фильтры, операции и редактор (T18)

Runtime-перевод собственного UI наград/каталога/tokenInfo, валидаторов/эпох/депозитов/выводов, расширенных фильтров, операций пользователей, редактора кода и графиков. Числовые и временные форматы сохраняют API-параметры и исходные данные. В дополнительных разделах переиспользованы согласованные ключи; они ещё требуют полного прохода. Семь существительных с отдельным английским окончанием заменены целыми plural-фразами; codemod теперь пропускает такие конструкции, добавлен regression test. Встроенный NLS Monaco и UI внешних SDK/iframe не завершены. KK требует вычитки носителем; Docker build отложен владельцем.

| Дата | Файл | Изменение |
|---|---|---|
| 2026-10-26 | `QUAT-CHANGES.md` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `docs/I18N.md` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `locales/en.json` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `locales/kk.json` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `locales/ru.json` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `toolkit/components/charts/Chart.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `toolkit/components/charts/ChartFullscreenDialog.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `toolkit/components/charts/ChartWidget.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `toolkit/components/charts/ChartWidgetContent.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `toolkit/components/charts/parts/ChartMenu.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `toolkit/components/charts/parts/ChartTooltip.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `toolkit/components/charts/parts/tooltip/ChartTooltipRow.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `toolkit/components/charts/parts/tooltip/ChartTooltipTitle.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `toolkit/components/charts/utils/getDateLabel.ts` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `toolkit/components/charts/utils/localeFormatting.spec.ts` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `toolkit/components/charts/utils/timeChartAxis.ts` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `toolkit/components/charts/utils/useTimeChartController.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `tools/i18n/SHARED-HANDOFF.md` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `tools/i18n/advanced-filter-translations.json` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `tools/i18n/charts-translations.json` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `tools/i18n/editor-shared-translations.json` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `tools/i18n/inventory.json` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `tools/i18n/localize-reviewed.mjs` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `tools/i18n/network-transfers-translations.json` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `tools/i18n/rewards-marketplace-translations.json` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `tools/i18n/section-counts-translations.json` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `tools/i18n/tooling.test.mjs` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `tools/i18n/user-operations-translations.json` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/advancedFilter/ColumnsButton.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/advancedFilter/ExportCSV.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/advancedFilter/FilterByColumn.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/advancedFilter/ItemByColumn.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/advancedFilter/constants.ts` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/advancedFilter/filters/AddressFilter.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/advancedFilter/filters/AddressRelationFilter.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/advancedFilter/filters/AmountFilter.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/advancedFilter/filters/AssetFilter.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/advancedFilter/filters/BaseAgeFilter.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/advancedFilter/filters/MethodFilter.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/advancedFilter/filters/TypeFilter.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/advancedFilter/lib.ts` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/advancedFilter/localization.spec.ts` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/crossChain/transfers/TokenTransfersCrossChainContent.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/crossChain/transfers/TokenTransfersCrossChainListItem.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/crossChain/transfers/TokenTransfersCrossChainTable.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/crossChain/tx/TxCrossChainDetails.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/crossChain/tx/TxCrossChainDetailsLifecycle.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/crossChain/tx/TxCrossChainDetailsTransfers.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/crossChain/tx/TxCrossChainTransfers.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/crossChain/txs/Transactions.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/crossChain/txs/TransactionsCrossChainListItem.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/crossChain/txs/TransactionsCrossChainStats.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/crossChain/txs/TransactionsCrossChainTable.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/crossChain/txs/TransactionsCrossChainTableItem.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/deposits/beaconChain/BeaconChainDepositsListItem.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/deposits/beaconChain/BeaconChainDepositsTable.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/deposits/optimisticL2/OptimisticDepositsListItem.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/deposits/optimisticL2/OptimisticDepositsTable.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/deposits/optimisticL2/OptimisticDepositsTableItem.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/deposits/scrollL2/ScrollL2DepositsListItem.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/deposits/scrollL2/ScrollL2DepositsTable.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/deposits/scrollL2/ScrollL2DepositsTableItem.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/deposits/shibarium/DepositsListItem.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/deposits/shibarium/DepositsTable.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/deposits/zkEvmL2/ZkEvmL2DepositsListItem.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/deposits/zkEvmL2/ZkEvmL2DepositsTable.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/deposits/zkEvmL2/ZkEvmL2DepositsTableItem.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/epochs/EpochDetails.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/epochs/EpochsListItem.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/epochs/EpochsTable.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/epochs/EpochsTableItem.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/epochs/electionRewards/EpochElectionRewardDetailsDesktop.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/epochs/electionRewards/EpochElectionRewardDetailsMobile.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/epochs/electionRewards/EpochElectionRewards.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/epochs/electionRewards/EpochElectionRewardsListItem.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/epochs/electionRewards/EpochElectionRewardsTableItem.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/epochs/electionRewards/utils.spec.ts` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/epochs/electionRewards/utils.ts` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/marketplace/Banner/FeaturedApp.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/marketplace/Banner/FeaturedAppMobile.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/marketplace/Banner/IframeBanner.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/marketplace/EmptySearchResult.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/marketplace/MarketplaceAppCard.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/marketplace/MarketplaceAppGraphLinks.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/marketplace/MarketplaceAppIframe.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/marketplace/MarketplaceAppInfo/Content.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/marketplace/MarketplaceAppIntegrationIcon.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/marketplace/MarketplaceAppModal.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/marketplace/MarketplaceAppTopBar.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/marketplace/MarketplaceDisclaimerModal.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/marketplace/Rating/PopoverContent.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/marketplace/Rating/TriggerButton.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/marketplace/essentialDapps/EssentialDappsList.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/marketplace/essentialDapps/revoke/Revoke.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/marketplace/essentialDapps/revoke/components/ApprovalsListItem.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/marketplace/essentialDapps/revoke/components/ApprovalsTable.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/marketplace/essentialDapps/revoke/components/ApprovalsTableItem.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/marketplace/essentialDapps/revoke/components/Content.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/marketplace/essentialDapps/revoke/components/SearchInput.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/marketplace/essentialDapps/revoke/components/StartScreen.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/marketplace/essentialDapps/revoke/hooks/useCoinBalanceQuery.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/marketplace/essentialDapps/revoke/hooks/useRevoke.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/marketplace/utils.ts` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/multichain/accounts/MultichainAccounts.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/multichain/address/MultichainAddressLogs.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/multichain/address/header/MultichainAddressEnsDomains.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/multichain/address/portfolio/MultichainAddressTokensListItem.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/multichain/address/portfolio/MultichainAddressTokensTable.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/multichain/blocks/MultichainBlocks.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/multichain/components/ClusterChainsPopover.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/multichain/ecosystems/MultichainEcosystems.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/multichain/home/ChainWidget.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/multichain/home/LatestTxsLocal.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/multichain/internalTxs/MultichainInternalTxs.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/multichain/searchResults/SearchResults.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/multichain/searchResults/SearchResultsTabAll.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/multichain/tokenTransfers/MultichainTokenTransfers.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/multichain/tokens/MultichainTokens.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/multichain/txs/MultichainTxs.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/multichain/userOps/MultichainUserOps.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/multichain/verifiedContracts/MultichainVerifiedContracts.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/nameDomain/NameDomainDetails.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/nameDomain/history/NameDomainHistoryListItem.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/nameDomain/history/NameDomainHistoryTable.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/nameServices/directories/ClustersDirectoryListItem.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/nameServices/directories/ClustersDirectoryTable.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/nameServices/directories/ClustersLeaderboardListItem.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/nameServices/directories/ClustersLeaderboardTable.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/nameServices/domains/NameDomainsActionBar.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/nameServices/domains/NameDomainsListItem.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/nameServices/domains/NameDomainsTable.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/pages/AdvancedFilter.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/pages/ArbitrumL2TxnWithdrawals.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/pages/BeaconChainDeposits.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/pages/BeaconChainWithdrawals.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/pages/Epoch.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/pages/Epochs.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/pages/Marketplace.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/pages/MarketplaceEssentialDapp.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/pages/OptimisticL2Deposits.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/pages/OptimisticL2Withdrawals.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/pages/RewardsDashboard.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/pages/ScrollL2Deposits.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/pages/ScrollL2Withdrawals.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/pages/ShibariumDeposits.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/pages/ShibariumWithdrawals.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/pages/ValidatorZilliqa.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/pages/ValidatorsBlackfort.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/pages/ValidatorsStability.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/pages/ValidatorsZilliqa.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/pages/ZkEvmL2Deposits.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/pages/ZkEvmL2Withdrawals.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/rewards/RewardsButton.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/rewards/dashboard/DailyRewardClaimButton.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/rewards/dashboard/RewardsActivityPassCard.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/rewards/dashboard/RewardsDashboardCard.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/rewards/dashboard/RewardsDashboardCardValue.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/rewards/dashboard/RewardsInstancesModal.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/rewards/dashboard/RewardsTaskDetailsModal.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/rewards/dashboard/streakModal/BadgeCard.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/rewards/dashboard/streakModal/ProgressSegment.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/rewards/dashboard/streakModal/RewardsStreakModal.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/rewards/dashboard/tabs/ActivityTab.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/rewards/dashboard/tabs/ReferralsTab.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/rewards/dashboard/tabs/ResourcesTab.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/rewards/hooks/useStreakBadges.ts` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/rewards/login/RewardsLoginModal.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/rewards/login/steps/CongratsStepContent.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/rewards/login/steps/LoginStepContent.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/shared/AppActionButton/AppActionButton.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/shared/EpochRewardTypeTag.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/shared/Noves/NovesFromTo.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/shared/TokenTransferSnippet/TokenTransferSnippetFiat.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/shared/TokenTransferSnippet/TokenTransferSnippetNft.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/shared/address/AddressAddToWallet.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/shared/gas/GasPrice.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/shared/gas/formatGasValue.spec.ts` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/shared/gas/formatGasValue.ts` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/shared/monaco/CodeEditor.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/shared/monaco/CodeEditorFileExplorer.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/shared/monaco/CodeEditorMainFileIndicator.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/shared/monaco/CodeEditorSearch.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/shared/monaco/CodeEditorSideBar.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/shared/monaco/CodeEditorTab.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/shared/monaco/utils/addExternalLibraryWarningDecoration.ts` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/shared/monaco/utils/addFileImportDecorations.ts` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/shared/monaco/utils/addMainContractCodeDecoration.ts` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/shared/solidityscanReport/SolidityscanReportButton.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/shared/solidityscanReport/SolidityscanReportScore.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/shared/solidityscanReport/useScoreLevelAndColor.ts` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/shared/stats/StatsWidget.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/tokenInfo/TokenInfoForm.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/tokenInfo/TokenInfoFormStatusText.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/tokenInfo/fields/TokenInfoFieldIconUrl.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/tokenInfo/fields/TokenInfoFieldProjectSector.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/tokenInfo/fields/TokenInfoFieldSupport.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/txnBatches/arbitrumL2/ArbitrumL2TxnBatchDetails.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/txnBatches/arbitrumL2/ArbitrumL2TxnBatchDetailsAnyTrustDA.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/txnBatches/arbitrumL2/ArbitrumL2TxnBatchDetailsCelestiaDA.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/txnBatches/arbitrumL2/ArbitrumL2TxnBatchesListItem.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/txnBatches/arbitrumL2/ArbitrumL2TxnBatchesTable.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/txnBatches/optimisticL2/OptimisticL2TxnBatchBlobCallData.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/txnBatches/optimisticL2/OptimisticL2TxnBatchBlobCelestia.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/txnBatches/optimisticL2/OptimisticL2TxnBatchBlobEigenda.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/txnBatches/optimisticL2/OptimisticL2TxnBatchBlobEip4844.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/txnBatches/optimisticL2/OptimisticL2TxnBatchDetails.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/txnBatches/optimisticL2/OptimisticL2TxnBatchesListItem.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/txnBatches/optimisticL2/OptimisticL2TxnBatchesTable.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/txnBatches/scrollL2/ScrollL2TxnBatchDetails.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/txnBatches/scrollL2/ScrollL2TxnBatchesListItem.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/txnBatches/scrollL2/ScrollL2TxnBatchesTable.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/txnBatches/scrollL2/ScrollL2TxnBatchesTableItem.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/txnBatches/zkEvmL2/ZkEvmL2TxnBatchDetails.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/txnBatches/zkEvmL2/ZkEvmTxnBatchesListItem.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/txnBatches/zkEvmL2/ZkEvmTxnBatchesTable.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/txnBatches/zkEvmL2/ZkEvmTxnBatchesTableItem.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/txnBatches/zkSyncL2/ZkSyncL2TxnBatchDetails.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/txnBatches/zkSyncL2/ZkSyncL2TxnBatchHashesInfo.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/txnBatches/zkSyncL2/ZkSyncTxnBatchesListItem.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/txnBatches/zkSyncL2/ZkSyncTxnBatchesTable.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/txnBatches/zkSyncL2/ZkSyncTxnBatchesTableItem.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/txnWithdrawals/arbitrumL2/ArbitrumL2TxnWithdrawalsClaimButton.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/txnWithdrawals/arbitrumL2/ArbitrumL2TxnWithdrawalsListItem.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/txnWithdrawals/arbitrumL2/ArbitrumL2TxnWithdrawalsTable.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/userOp/UserOpCallData.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/userOp/UserOpCallDataSwitch.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/userOp/UserOpDecodedCallData.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/userOp/UserOpDetails.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/userOp/UserOpSubHeading.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/userOps/UserOpsContent.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/userOps/UserOpsListItem.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/userOps/UserOpsTable.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/validators/blackfort/ValidatorsCounters.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/validators/blackfort/ValidatorsListItem.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/validators/blackfort/ValidatorsTable.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/validators/blackfort/ValidatorsTableItem.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/validators/blackfort/utils.ts` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/validators/stability/ValidatorsCounters.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/validators/stability/ValidatorsFilter.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/validators/stability/ValidatorsListItem.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/validators/stability/ValidatorsTable.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/validators/stability/ValidatorsTableItem.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/validators/stability/utils.ts` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/validators/zilliqa/ValidatorDetails.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/validators/zilliqa/ValidatorsListItem.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/validators/zilliqa/ValidatorsTable.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/validators/zilliqa/ValidatorsTableItem.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/withdrawals/beaconChain/BeaconChainWithdrawalsListItem.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/withdrawals/beaconChain/BeaconChainWithdrawalsTable.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/withdrawals/beaconChain/BeaconChainWithdrawalsTableItem.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/withdrawals/optimisticL2/OptimisticL2ClaimButton.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/withdrawals/optimisticL2/OptimisticL2ClaimModal.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/withdrawals/optimisticL2/OptimisticL2WithdrawalsItemStatus.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/withdrawals/optimisticL2/OptimisticL2WithdrawalsListItem.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/withdrawals/optimisticL2/OptimisticL2WithdrawalsTable.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/withdrawals/optimisticL2/OptimisticL2WithdrawalsTableItem.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/withdrawals/scrollL2/ScrollL2WithdrawalsListItem.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/withdrawals/scrollL2/ScrollL2WithdrawalsTable.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/withdrawals/scrollL2/ScrollL2WithdrawalsTableItem.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/withdrawals/shibarium/WithdrawalsListItem.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/withdrawals/shibarium/WithdrawalsTable.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/withdrawals/zkEvmL2/ZkEvmL2WithdrawalsListItem.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/withdrawals/zkEvmL2/ZkEvmL2WithdrawalsTable.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `ui/withdrawals/zkEvmL2/ZkEvmL2WithdrawalsTableItem.tsx` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |
| 2026-10-26 | `vitest.i18n.config.mts` | T18: runtime-переводы, точные локализованные значения, инвентаризация, документация или проверки. |

Проверка четвёртой контрольной точки (2026-10-26): полный TypeScript PASS; полный ESLint 0 errors / 7 существующих upstream skipped-test warnings; isolated Vitest 54/54; tooling 11/11; check-locales PASS — EN 2368 / RU 2446 / KK 2368, 2989 literal references. Датированные пометки и список файлов проверены для 265 файлов. Независимое read-only ревью фильтров и графиков не обнаружило ошибок; browser smoke, встроенные сторонние UI, вычитка KK и Docker build остаются незавершёнными.

## 2026-10-27: промежуточное сохранение пятой группы T18

Сохранена незавершённая работа перед продолжением после переключения на T28. Новые fragments ещё не включены в runtime-словари; код и переводы требуют проверки. Это WIP, не готовый выпуск. Подробности: `tools/i18n/PHASE5-HANDOFF.md`.

| Дата | Файл | Изменение |
|---|---|---|
| 2026-10-27 | `lib/metadata/generate.ts` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `lib/metadata/templates/description.ts` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `lib/metadata/templates/localize.ts` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `lib/metadata/templates/title.ts` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `lib/metadata/update.ts` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `lib/operations/tac.ts` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `nextjs/PageMetadata.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `tools/i18n/PHASE5-HANDOFF.md` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `tools/i18n/l2-remaining-translations.json` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `tools/i18n/multichain-remaining-translations.json` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `tools/i18n/pages-api-translations.json` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `tools/i18n/supplemental-translations.json` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/addressesLabelSearch/AddressesLabelSearchListItem.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/addressesLabelSearch/AddressesLabelSearchTable.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/apiDocs/EthRpcApi.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/apiDocs/RestApi.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/apiDocs/RpcApi.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/apiDocs/utils.ts` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/cluster/ClusterDetails.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/crossChain/transfers/TokenTransfersCrossChain.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/crossChain/transfers/TokenTransfersCrossChainListItem.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/crossChain/transfers/TokenTransfersCrossChainTable.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/crossChain/tx/TxCrossChain.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/crossChain/tx/TxCrossChainDetails.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/crossChain/tx/TxCrossChainDetailsTransfers.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/crossChain/txs/Transactions.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/crossChain/txs/TransactionsCrossChain.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/crossChain/txs/TransactionsCrossChainContent.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/crossChain/txs/TransactionsCrossChainListItem.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/crossChain/txs/TransactionsCrossChainTable.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/disputeGames/optimisticL2/OptimisticL2DisputeGamesListItem.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/disputeGames/optimisticL2/OptimisticL2DisputeGamesTable.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/disputeGames/optimisticL2/OptimisticL2DisputeGamesTableItem.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/disputeGames/optimisticL2/localizeDisputeGameStatus.ts` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/games/CapybaraRunner.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/games/Puzzle15.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/hotContracts/HotContractsIntervalSelect.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/hotContracts/HotContractsListItem.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/hotContracts/HotContractsTable.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/hotContracts/HotContractsTableItem.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/hotContracts/utils.ts` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/interopMessages/InteropMessageAdditionalInfo.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/interopMessages/InteropMessagesListItem.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/interopMessages/InteropMessagesTable.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/megaEth/uptime/Uptime.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/megaEth/uptime/UptimeCharts.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/megaEth/uptime/UptimeStats.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/megaEth/uptime/UptimeStatus.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/messages/ArbitrumL2Messages.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/messages/ArbitrumL2MessagesListItem.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/messages/ArbitrumL2MessagesTable.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/messages/ArbitrumL2MessagesTableItem.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/mudWorlds/MudWorldsListItem.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/mudWorlds/MudWorldsTable.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/mudWorlds/MudWorldsTableItem.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/multichain/address/MultichainAddress.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/multichain/address/MultichainAddressCoinBalanceHistory.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/multichain/address/MultichainAddressInternalTxs.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/multichain/address/MultichainAddressPortfolio.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/multichain/address/MultichainAddressTokenTransfers.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/multichain/address/MultichainAddressTxs.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/multichain/address/header/MultichainAddressEnsDomains.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/multichain/address/portfolio/MultichainAddressPortfolioCards.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/multichain/address/portfolio/MultichainAddressPortfolioNetWorth.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/multichain/address/portfolio/MultichainAddressPortfolioTokens.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/multichain/address/portfolio/MultichainAddressTokensListItem.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/multichain/address/portfolio/MultichainAddressTokensTable.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/multichain/blocks/MultichainBlocks.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/multichain/components/ClusterChainsPopover.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/multichain/components/ListCounterText.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/multichain/components/NativeTokenIcon.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/multichain/ecosystems/MultichainEcosystems.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/multichain/ecosystems/MultichainEcosystemsListItem.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/multichain/ecosystems/MultichainEcosystemsTable.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/multichain/ecosystems/MultichainEcosystemsTableItem.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/multichain/ecosystems/utils.ts` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/multichain/home/ChainIndicators.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/multichain/home/ChainWidget.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/multichain/home/LatestTxs.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/multichain/home/MultichainHome.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/multichain/internalTxs/MultichainInternalTxs.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/multichain/searchResults/SearchResultTabContent.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/multichain/searchResults/SearchResults.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/multichain/searchResults/SearchResultsTabAll.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/multichain/searchResults/items/SearchResultItemToken.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/multichain/searchResults/utils.ts` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/multichain/stats/MultichainStats.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/multichain/tokenTransfers/MultichainTokenTransfers.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/multichain/tokenTransfers/MultichainTokenTransfersLocal.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/multichain/txs/MultichainTxs.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/multichain/userOps/MultichainUserOps.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/multichain/verifiedContracts/MultichainVerifiedContracts.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/nameDomain/NameDomainDetails.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/nameDomain/NameDomainExpiryStatus.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/nameDomain/NameDomainHistory.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/nameDomain/details/NameDomainDetailsAlert.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/nameServices/directories/Clusters.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/nameServices/directories/ClustersActionBar.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/nameServices/directories/ClustersDirectoryListItem.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/nameServices/directories/ClustersDirectoryTable.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/nameServices/directories/ClustersLeaderboardListItem.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/nameServices/directories/ClustersLeaderboardTable.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/nameServices/domains/NameDomains.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/nameServices/domains/NameDomainsActionBar.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/nameServices/domains/NameDomainsListItem.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/nameServices/domains/NameDomainsTable.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/nameServices/domains/utils.ts` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/operation/tac/TacOperationDetails.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/operation/tac/TacOperationLifecycleAccordion.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/operation/tac/TacOperationLifecycleAccordionItemContent.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/operations/tac/TacOperationsListItem.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/operations/tac/TacOperationsTable.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/outputRoots/optimisticL2/OptimisticL2OutputRootsListItem.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/outputRoots/optimisticL2/OptimisticL2OutputRootsTable.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/pages/AccountsLabelSearch.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/pages/ApiDocs.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/pages/ArbitrumL2TxnBatch.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/pages/ArbitrumL2TxnBatches.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/pages/Chart.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/pages/Cluster.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/pages/HotContracts.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/pages/InteropMessages.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/pages/MarketplaceApp.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/pages/MudWorlds.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/pages/NameDomain.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/pages/NameServices.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/pages/OptimisticL2DisputeGames.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/pages/OptimisticL2OutputRoots.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/pages/OptimisticL2TxnBatch.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/pages/OptimisticL2TxnBatches.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/pages/Pool.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/pages/Pools.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/pages/ScrollL2TxnBatch.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/pages/ScrollL2TxnBatches.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/pages/SearchResults.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/pages/Sol2Uml.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/pages/TacOperation.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/pages/TacOperations.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/pages/Token.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/pages/TokenInstance.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/pages/TransactionsZetaChain.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/pages/UserOp.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/pages/UserOps.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/pages/ZetaChainCCTX.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/pages/ZkEvmL2TxnBatch.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/pages/ZkEvmL2TxnBatches.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/pages/ZkSyncL2TxnBatch.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/pages/ZkSyncL2TxnBatches.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/pool/PoolInfo.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/pools/PoolsListItem.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/pools/PoolsTable.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/pools/PoolsTableItem.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/searchResults/SearchResultListItem.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/searchResults/SearchResultTableItem.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/shared/TacOperationTag.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/shared/statusTag/TacOperationStatus.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/sol2uml/Sol2UmlDiagram.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/tokenTransfers/TokenTransfersListItem.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/tokenTransfers/TokenTransfersLocal.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/tokenTransfers/TokenTransfersTable.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/tx/details/TxDetailsTacOperation.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/txnBatches/arbitrumL2/ArbitrumL2TxnBatchDetails.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/txnBatches/arbitrumL2/ArbitrumL2TxnBatchDetailsAnyTrustDA.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/txnBatches/arbitrumL2/ArbitrumL2TxnBatchDetailsCelestiaDA.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/txnBatches/arbitrumL2/ArbitrumL2TxnBatchesListItem.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/txnBatches/arbitrumL2/ArbitrumL2TxnBatchesTable.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/txnBatches/arbitrumL2/ArbitrumL2TxnBatchesTableItem.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/txnBatches/optimisticL2/OptimisticL2TxnBatchBlobCallData.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/txnBatches/optimisticL2/OptimisticL2TxnBatchBlobCelestia.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/txnBatches/optimisticL2/OptimisticL2TxnBatchBlobEigenda.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/txnBatches/optimisticL2/OptimisticL2TxnBatchBlobEip4844.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/txnBatches/optimisticL2/OptimisticL2TxnBatchDetails.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/txnBatches/optimisticL2/OptimisticL2TxnBatchesListItem.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/txnBatches/optimisticL2/OptimisticL2TxnBatchesTable.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/txnBatches/optimisticL2/OptimisticL2TxnBatchesTableItem.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/txnBatches/scrollL2/ScrollL2TxnBatchDetails.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/txnBatches/scrollL2/ScrollL2TxnBatchesListItem.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/txnBatches/scrollL2/ScrollL2TxnBatchesTable.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/txnBatches/scrollL2/ScrollL2TxnBatchesTableItem.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/txnBatches/zkEvmL2/ZkEvmL2TxnBatchDetails.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/txnBatches/zkEvmL2/ZkEvmTxnBatchesListItem.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/txnBatches/zkEvmL2/ZkEvmTxnBatchesTable.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/txnBatches/zkEvmL2/ZkEvmTxnBatchesTableItem.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/txnBatches/zkSyncL2/ZkSyncL2TxnBatchDetails.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/txnBatches/zkSyncL2/ZkSyncL2TxnBatchHashesInfo.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/txnBatches/zkSyncL2/ZkSyncTxnBatchesListItem.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/txnBatches/zkSyncL2/ZkSyncTxnBatchesTable.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/txnBatches/zkSyncL2/ZkSyncTxnBatchesTableItem.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/zetaChain/ZetaChainCCTXsTab.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/zetaChain/ZetaChainEvmTransactions.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/zetaChain/cctxDetails/ZetaChainCCTXDetails.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/zetaChain/cctxDetails/ZetaChainCCTXDetailsLifecycleIn.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/zetaChain/cctxDetails/ZetaChainCCTXDetailsLifecycleOut.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/zetaChain/cctxs/ZetaChainCCTXListItem.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/zetaChain/cctxs/ZetaChainCCTxs.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/zetaChain/cctxs/ZetaChainCCTxsTable.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/zetaChain/filters/ZetaChainAssetFilter.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/zetaChain/filters/ZetaChainFilterTags.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/zetaChain/filters/ZetaChainReceiverFilter.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/zetaChain/filters/ZetaChainSenderFilter.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |
| 2026-10-27 | `ui/zetaChain/filters/ZetaChainStatusFilter.tsx` | T18 WIP: сохранены частичные переводы, metadata или handoff; общая проверка ещё не выполнена. |

## 2026-10-27: завершение пятой группы T18

Замороженные L2, multichain, supplemental, pages/API, SEO и CSV fragments объединены с runtime-словарями. API ids/route params и пользовательские данные сохраняются; дополнительно исправлены partial-ошибки машинных вкладок и точных чисел. Это проверка очередной группы, полное T18 ещё не завершено.

| Дата | Файл | Изменение |
|---|---|---|
| 2026-10-27 | `lib/metadata/generate.ts` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `lib/metadata/getPageOgType.ts` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `lib/metadata/localization.spec.ts` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `lib/metadata/templates/description.ts` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `lib/metadata/templates/localize.ts` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `lib/metadata/templates/title.ts` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `lib/metadata/update.ts` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `lib/mixpanel/getPageType.ts` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `lib/operations/tac.ts` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `locales/en.json` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `locales/kk.json` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `locales/ru.json` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `nextjs/PageMetadata.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `nextjs/nextjs-routes.d.ts` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `public/static/capybara/index.js` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `toolkit/components/forms/utils/getFormFieldErrorText.spec.ts` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `toolkit/components/forms/utils/getFormFieldErrorText.ts` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `tools/i18n/PHASE5-HANDOFF.md` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `tools/i18n/l2-remaining-translations.json` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `tools/i18n/metadata-translations.json` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `tools/i18n/multichain-remaining-translations.json` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `tools/i18n/page-remainder-translations.json` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `tools/i18n/pages-api-translations.json` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `tools/i18n/supplemental-translations.json` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/addressesLabelSearch/AddressesLabelSearchListItem.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/addressesLabelSearch/AddressesLabelSearchTable.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/addressesLabelSearch/AddressesLabelSearchTableItem.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/apiDocs/EthRpcApi.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/apiDocs/RestApi.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/apiDocs/RpcApi.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/apiDocs/utils.ts` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/cluster/ClusterDetails.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/crossChain/transfers/TokenTransfersCrossChain.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/crossChain/transfers/TokenTransfersCrossChainListItem.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/crossChain/transfers/TokenTransfersCrossChainTable.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/crossChain/tx/TxCrossChain.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/crossChain/tx/TxCrossChainDetails.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/crossChain/tx/TxCrossChainDetailsLifecycle.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/crossChain/tx/TxCrossChainDetailsTransfers.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/crossChain/txs/Transactions.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/crossChain/txs/TransactionsCrossChain.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/crossChain/txs/TransactionsCrossChainContent.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/crossChain/txs/TransactionsCrossChainListItem.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/crossChain/txs/TransactionsCrossChainStats.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/crossChain/txs/TransactionsCrossChainTable.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/csvExport/CsvExportForm.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/csvExport/CsvExportFormField.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/csvExport/localization.spec.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/csvExport/localization.ts` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/disputeGames/optimisticL2/OptimisticL2DisputeGamesListItem.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/disputeGames/optimisticL2/OptimisticL2DisputeGamesTable.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/disputeGames/optimisticL2/OptimisticL2DisputeGamesTableItem.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/disputeGames/optimisticL2/localizeDisputeGameStatus.ts` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/games/CapybaraRunner.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/games/Puzzle15.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/games/capybaraLocale.spec.ts` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/hotContracts/HotContractsIntervalSelect.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/hotContracts/HotContractsListItem.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/hotContracts/HotContractsTable.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/hotContracts/HotContractsTableItem.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/hotContracts/utils.ts` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/interopMessages/InteropMessageAdditionalInfo.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/interopMessages/InteropMessagesListItem.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/interopMessages/InteropMessagesTable.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/megaEth/uptime/Uptime.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/megaEth/uptime/UptimeCharts.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/megaEth/uptime/UptimeStats.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/megaEth/uptime/UptimeStatus.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/messages/ArbitrumL2Messages.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/messages/ArbitrumL2MessagesListItem.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/messages/ArbitrumL2MessagesTable.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/messages/ArbitrumL2MessagesTableItem.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/mudWorlds/MudWorldsListItem.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/mudWorlds/MudWorldsTable.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/mudWorlds/MudWorldsTableItem.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/multichain/address/MultichainAddress.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/multichain/address/MultichainAddressCoinBalanceHistory.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/multichain/address/MultichainAddressInternalTxs.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/multichain/address/MultichainAddressPortfolio.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/multichain/address/MultichainAddressTokenTransfers.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/multichain/address/MultichainAddressTxs.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/multichain/address/header/MultichainAddressEnsDomains.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/multichain/address/portfolio/MultichainAddressPortfolioCard.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/multichain/address/portfolio/MultichainAddressPortfolioCards.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/multichain/address/portfolio/MultichainAddressPortfolioNetWorth.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/multichain/address/portfolio/MultichainAddressPortfolioTokens.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/multichain/address/portfolio/MultichainAddressTokensListItem.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/multichain/address/portfolio/MultichainAddressTokensTable.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/multichain/address/portfolio/MultichainAddressTokensTableItem.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/multichain/address/portfolio/utils.ts` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/multichain/blocks/MultichainBlocks.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/multichain/components/ClusterChainsPopover.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/multichain/components/ListCounterText.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/multichain/components/NativeTokenIcon.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/multichain/ecosystems/MultichainEcosystems.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/multichain/ecosystems/MultichainEcosystemsListItem.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/multichain/ecosystems/MultichainEcosystemsTable.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/multichain/ecosystems/MultichainEcosystemsTableItem.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/multichain/ecosystems/utils.ts` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/multichain/home/ChainIndicators.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/multichain/home/ChainWidget.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/multichain/home/LatestTxs.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/multichain/home/MultichainHome.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/multichain/home/Stats.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/multichain/internalTxs/MultichainInternalTxs.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/multichain/searchResults/SearchResultTabContent.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/multichain/searchResults/SearchResults.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/multichain/searchResults/SearchResultsTabAll.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/multichain/searchResults/items/SearchResultItemToken.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/multichain/searchResults/utils.ts` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/multichain/stats/MultichainStats.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/multichain/tokenTransfers/MultichainTokenTransfers.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/multichain/tokenTransfers/MultichainTokenTransfersLocal.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/multichain/txs/MultichainTxs.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/multichain/userOps/MultichainUserOps.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/multichain/verifiedContracts/MultichainVerifiedContracts.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/nameDomain/NameDomainDetails.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/nameDomain/NameDomainExpiryStatus.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/nameDomain/NameDomainHistory.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/nameDomain/details/NameDomainDetailsAlert.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/nameDomain/history/NameDomainHistoryListItem.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/nameDomain/history/NameDomainHistoryTable.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/nameServices/directories/Clusters.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/nameServices/directories/ClustersActionBar.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/nameServices/directories/ClustersDirectoryListItem.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/nameServices/directories/ClustersDirectoryTable.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/nameServices/directories/ClustersDirectoryTableItem.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/nameServices/directories/ClustersLeaderboardListItem.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/nameServices/directories/ClustersLeaderboardTable.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/nameServices/directories/ClustersLeaderboardTableItem.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/nameServices/domains/NameDomains.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/nameServices/domains/NameDomainsActionBar.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/nameServices/domains/NameDomainsListItem.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/nameServices/domains/NameDomainsTable.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/nameServices/domains/utils.ts` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/operation/tac/TacOperationDetails.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/operation/tac/TacOperationLifecycleAccordion.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/operation/tac/TacOperationLifecycleAccordionItemContent.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/operations/tac/TacOperationsListItem.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/operations/tac/TacOperationsTable.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/outputRoots/optimisticL2/OptimisticL2OutputRootsListItem.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/outputRoots/optimisticL2/OptimisticL2OutputRootsTable.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/pages/AccountsLabelSearch.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/pages/ApiDocs.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/pages/ArbitrumL2TxnBatch.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/pages/ArbitrumL2TxnBatches.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/pages/Chart.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/pages/Cluster.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/pages/ContractVerificationForAddress.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/pages/CsvExport.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/pages/HotContracts.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/pages/InteropMessages.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/pages/KettleTxs.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/pages/MarketplaceApp.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/pages/MudWorlds.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/pages/NameDomain.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/pages/NameServices.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/pages/OptimisticL2DisputeGames.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/pages/OptimisticL2OutputRoots.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/pages/OptimisticL2TxnBatch.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/pages/OptimisticL2TxnBatches.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/pages/Pool.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/pages/Pools.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/pages/ScrollL2TxnBatch.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/pages/ScrollL2TxnBatches.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/pages/SearchResults.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/pages/Sol2Uml.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/pages/TacOperation.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/pages/TacOperations.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/pages/Token.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/pages/TokenInstance.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/pages/TransactionsZetaChain.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/pages/UserOp.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/pages/UserOps.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/pages/ZetaChainCCTX.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/pages/ZkEvmL2TxnBatch.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/pages/ZkEvmL2TxnBatches.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/pages/ZkSyncL2TxnBatch.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/pages/ZkSyncL2TxnBatches.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/pool/PoolInfo.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/pools/PoolsListItem.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/pools/PoolsTable.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/pools/PoolsTableItem.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/searchResults/SearchResultListItem.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/searchResults/SearchResultTableItem.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/shared/TacOperationTag.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/shared/statusTag/TacOperationStatus.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/sol2uml/Sol2UmlDiagram.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/tokenTransfers/TokenTransfersListItem.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/tokenTransfers/TokenTransfersLocal.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/tokenTransfers/TokenTransfersTable.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/tx/details/TxDetailsTacOperation.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/txnBatches/arbitrumL2/ArbitrumL2TxnBatchDetails.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/txnBatches/arbitrumL2/ArbitrumL2TxnBatchDetailsAnyTrustDA.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/txnBatches/arbitrumL2/ArbitrumL2TxnBatchDetailsCelestiaDA.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/txnBatches/arbitrumL2/ArbitrumL2TxnBatchesListItem.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/txnBatches/arbitrumL2/ArbitrumL2TxnBatchesTable.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/txnBatches/arbitrumL2/ArbitrumL2TxnBatchesTableItem.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/txnBatches/l2Localization.spec.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/txnBatches/optimisticL2/OptimisticL2TxnBatchBlobCallData.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/txnBatches/optimisticL2/OptimisticL2TxnBatchBlobCelestia.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/txnBatches/optimisticL2/OptimisticL2TxnBatchBlobEigenda.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/txnBatches/optimisticL2/OptimisticL2TxnBatchBlobEip4844.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/txnBatches/optimisticL2/OptimisticL2TxnBatchDetails.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/txnBatches/optimisticL2/OptimisticL2TxnBatchesListItem.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/txnBatches/optimisticL2/OptimisticL2TxnBatchesTable.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/txnBatches/optimisticL2/OptimisticL2TxnBatchesTableItem.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/txnBatches/scrollL2/ScrollL2TxnBatchDetails.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/txnBatches/scrollL2/ScrollL2TxnBatchesListItem.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/txnBatches/scrollL2/ScrollL2TxnBatchesTable.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/txnBatches/scrollL2/ScrollL2TxnBatchesTableItem.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/txnBatches/zkEvmL2/ZkEvmL2TxnBatchDetails.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/txnBatches/zkEvmL2/ZkEvmTxnBatchesListItem.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/txnBatches/zkEvmL2/ZkEvmTxnBatchesTable.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/txnBatches/zkEvmL2/ZkEvmTxnBatchesTableItem.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/txnBatches/zkSyncL2/ZkSyncL2TxnBatchDetails.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/txnBatches/zkSyncL2/ZkSyncL2TxnBatchHashesInfo.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/txnBatches/zkSyncL2/ZkSyncTxnBatchesListItem.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/txnBatches/zkSyncL2/ZkSyncTxnBatchesTable.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/txnBatches/zkSyncL2/ZkSyncTxnBatchesTableItem.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/zetaChain/ZetaChainCCTXsTab.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/zetaChain/ZetaChainEvmTransactions.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/zetaChain/cctxDetails/ZetaChainCCTXDetails.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/zetaChain/cctxDetails/ZetaChainCCTXDetailsLifecycleIn.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/zetaChain/cctxDetails/ZetaChainCCTXDetailsLifecycleOut.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/zetaChain/cctxs/ZetaChainCCTXListItem.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/zetaChain/cctxs/ZetaChainCCTXsStats.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/zetaChain/cctxs/ZetaChainCCTxs.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/zetaChain/cctxs/ZetaChainCCTxsTable.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/zetaChain/filters/ZetaChainAssetFilter.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/zetaChain/filters/ZetaChainFilterTags.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/zetaChain/filters/ZetaChainReceiverFilter.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/zetaChain/filters/ZetaChainSenderFilter.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `ui/zetaChain/filters/ZetaChainStatusFilter.tsx` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |
| 2026-10-27 | `vitest.i18n.config.mts` | T18: runtime-переводы, безопасная интерполяция, точные числа, тесты или документация пятой группы. |


## 2026-10-28: проверенная шестая группа T18

Контракты/ABI и локальные ошибки, ники и адреса, транзакционные подсказки, меню и настройки, flashblocks, оболочки developer pages. Canonical EN3185/RU3313/KK3185. TypeScript PASS; полный ESLint 0 ошибок и 7 старых warnings; Vitest 96/96, после исправлений двух specs повторно 14/14; tooling 11/11; check-locales PASS. Это не завершение T18; остаток в tools/i18n/REMAINING.md.

| Дата | Файл | Изменение |
|---|---|---|
| 2026-10-28 | `locales/en.json` | Шестая группа T18: runtime-локализация, проверенные словари, регрессии или передача контекста. |
| 2026-10-28 | `locales/kk.json` | Шестая группа T18: runtime-локализация, проверенные словари, регрессии или передача контекста. |
| 2026-10-28 | `locales/ru.json` | Шестая группа T18: runtime-локализация, проверенные словари, регрессии или передача контекста. |
| 2026-10-28 | `tools/i18n/PHASE6-HANDOFF.md` | Шестая группа T18: runtime-локализация, проверенные словари, регрессии или передача контекста. |
| 2026-10-28 | `tools/i18n/REMAINING.md` | Шестая группа T18: runtime-локализация, проверенные словари, регрессии или передача контекста. |
| 2026-10-28 | `tools/i18n/contracts-remainder-translations.json` | Шестая группа T18: runtime-локализация, проверенные словари, регрессии или передача контекста. |
| 2026-10-28 | `tools/i18n/developer-pages-translations.json` | Шестая группа T18: runtime-локализация, проверенные словари, регрессии или передача контекста. |
| 2026-10-28 | `tools/i18n/flashblock-translations.json` | Шестая группа T18: runtime-локализация, проверенные словари, регрессии или передача контекста. |
| 2026-10-28 | `tools/i18n/inventory.json` | Шестая группа T18: runtime-локализация, проверенные словари, регрессии или передача контекста. |
| 2026-10-28 | `tools/i18n/shell-remainder-translations.json` | Шестая группа T18: runtime-локализация, проверенные словари, регрессии или передача контекста. |
| 2026-10-28 | `tools/i18n/tx-address-remainder-translations.json` | Шестая группа T18: runtime-локализация, проверенные словари, регрессии или передача контекста. |
| 2026-10-28 | `ui/address/SolidityscanReport.tsx` | Шестая группа T18: runtime-локализация, проверенные словари, регрессии или передача контекста. |
| 2026-10-28 | `ui/address/address3rdPartyWidgets/useWidgetData.ts` | Шестая группа T18: runtime-локализация, проверенные словари, регрессии или передача контекста. |
| 2026-10-28 | `ui/address/blocksValidated/AddressBlocksValidatedListItem.tsx` | Шестая группа T18: runtime-локализация, проверенные словари, регрессии или передача контекста. |
| 2026-10-28 | `ui/address/blocksValidated/AddressBlocksValidatedTableItem.tsx` | Шестая группа T18: runtime-локализация, проверенные словари, регрессии или передача контекста. |
| 2026-10-28 | `ui/address/coinBalance/AddressCoinBalanceChart.tsx` | Шестая группа T18: runtime-локализация, проверенные словари, регрессии или передача контекста. |
| 2026-10-28 | `ui/address/coinBalance/AddressCoinBalanceListItem.tsx` | Шестая группа T18: runtime-локализация, проверенные словари, регрессии или передача контекста. |
| 2026-10-28 | `ui/address/contract/ContractCodeIdes.tsx` | Шестая группа T18: runtime-локализация, проверенные словари, регрессии или передача контекста. |
| 2026-10-28 | `ui/address/contract/ContractSourceCode.tsx` | Шестая группа T18: runtime-локализация, проверенные словари, регрессии или передача контекста. |
| 2026-10-28 | `ui/address/contract/alerts/ConflictingImplementationsModal.tsx` | Шестая группа T18: runtime-локализация, проверенные словари, регрессии или передача контекста. |
| 2026-10-28 | `ui/address/contract/alerts/ContractDetailsAlertProxyPattern.tsx` | Шестая группа T18: runtime-локализация, проверенные словари, регрессии или передача контекста. |
| 2026-10-28 | `ui/address/contract/alerts/ContractDetailsAlerts.tsx` | Шестая группа T18: runtime-локализация, проверенные словари, регрессии или передача контекста. |
| 2026-10-28 | `ui/address/contract/audits/ContractSecurityAudits.tsx` | Шестая группа T18: runtime-локализация, проверенные словари, регрессии или передача контекста. |
| 2026-10-28 | `ui/address/contract/audits/ContractSubmitAuditForm.tsx` | Шестая группа T18: runtime-локализация, проверенные словари, регрессии или передача контекста. |
| 2026-10-28 | `ui/address/contract/info/ContractDetailsInfo.tsx` | Шестая группа T18: runtime-локализация, проверенные словари, регрессии или передача контекста. |
| 2026-10-28 | `ui/address/contract/info/ContractDetailsInfoImplementations.tsx` | Шестая группа T18: runtime-локализация, проверенные словари, регрессии или передача контекста. |
| 2026-10-28 | `ui/address/contract/localization.spec.tsx` | Шестая группа T18: runtime-локализация, проверенные словари, регрессии или передача контекста. |
| 2026-10-28 | `ui/address/contract/localization.ts` | Шестая группа T18: runtime-локализация, проверенные словари, регрессии или передача контекста. |
| 2026-10-28 | `ui/address/contract/methods/ContractAbi.tsx` | Шестая группа T18: runtime-локализация, проверенные словари, регрессии или передача контекста. |
| 2026-10-28 | `ui/address/contract/methods/ContractAbiItem.tsx` | Шестая группа T18: runtime-локализация, проверенные словари, регрессии или передача контекста. |
| 2026-10-28 | `ui/address/contract/methods/ContractMethodsContainer.tsx` | Шестая группа T18: runtime-локализация, проверенные словари, регрессии или передача контекста. |
| 2026-10-28 | `ui/address/contract/methods/ContractMethodsProxy.tsx` | Шестая группа T18: runtime-локализация, проверенные словари, регрессии или передача контекста. |
| 2026-10-28 | `ui/address/contract/methods/alerts/ConnectWalletAlert.tsx` | Шестая группа T18: runtime-локализация, проверенные словари, регрессии или передача контекста. |
| 2026-10-28 | `ui/address/contract/methods/form/ContractMethodAddressButton.tsx` | Шестая группа T18: runtime-локализация, проверенные словари, регрессии или передача контекста. |
| 2026-10-28 | `ui/address/contract/methods/form/ContractMethodFieldInput.tsx` | Шестая группа T18: runtime-локализация, проверенные словари, регрессии или передача контекста. |
| 2026-10-28 | `ui/address/contract/methods/form/ContractMethodFieldInputArray.tsx` | Шестая группа T18: runtime-локализация, проверенные словари, регрессии или передача контекста. |
| 2026-10-28 | `ui/address/contract/methods/form/ContractMethodFieldInputTuple.tsx` | Шестая группа T18: runtime-локализация, проверенные словари, регрессии или передача контекста. |
| 2026-10-28 | `ui/address/contract/methods/form/ContractMethodFieldLabel.tsx` | Шестая группа T18: runtime-локализация, проверенные словари, регрессии или передача контекста. |
| 2026-10-28 | `ui/address/contract/methods/form/ContractMethodForm.tsx` | Шестая группа T18: runtime-локализация, проверенные словари, регрессии или передача контекста. |
| 2026-10-28 | `ui/address/contract/methods/form/ContractMethodResultPublicClient.tsx` | Шестая группа T18: runtime-локализация, проверенные словари, регрессии или передача контекста. |
| 2026-10-28 | `ui/address/contract/methods/form/ContractMethodResultWalletClient.tsx` | Шестая группа T18: runtime-локализация, проверенные словари, регрессии или передача контекста. |
| 2026-10-28 | `ui/address/contract/methods/form/utils.ts` | Шестая группа T18: runtime-локализация, проверенные словари, регрессии или передача контекста. |
| 2026-10-28 | `ui/address/contract/methods/useCallMethodPublicClient.ts` | Шестая группа T18: runtime-локализация, проверенные словари, регрессии или передача контекста. |
| 2026-10-28 | `ui/address/contract/methods/useCallMethodWalletClient.ts` | Шестая группа T18: runtime-локализация, проверенные словари, регрессии или передача контекста. |
| 2026-10-28 | `ui/address/contract/methods/useFormSubmit.ts` | Шестая группа T18: runtime-локализация, проверенные словари, регрессии или передача контекста. |
| 2026-10-28 | `ui/address/details/AddressCounterItem.tsx` | Шестая группа T18: runtime-локализация, проверенные словари, регрессии или передача контекста. |
| 2026-10-28 | `ui/address/ensDomains/AddressEnsDomains.tsx` | Шестая группа T18: runtime-локализация, проверенные словари, регрессии или передача контекста. |
| 2026-10-28 | `ui/address/epochRewards/AddressEpochRewardsListItem.tsx` | Шестая группа T18: runtime-локализация, проверенные словари, регрессии или передача контекста. |
| 2026-10-28 | `ui/address/epochRewards/AddressEpochRewardsTable.tsx` | Шестая группа T18: runtime-локализация, проверенные словари, регрессии или передача контекста. |
| 2026-10-28 | `ui/address/filecoin/FilecoinActorTag.tsx` | Шестая группа T18: runtime-локализация, проверенные словари, регрессии или передача контекста. |
| 2026-10-28 | `ui/address/localization.ts` | Шестая группа T18: runtime-локализация, проверенные словари, регрессии или передача контекста. |
| 2026-10-28 | `ui/address/mud/AddressMudRecordValues.tsx` | Шестая группа T18: runtime-локализация, проверенные словари, регрессии или передача контекста. |
| 2026-10-28 | `ui/address/mud/AddressMudRecordsTable.tsx` | Шестая группа T18: runtime-локализация, проверенные словари, регрессии или передача контекста. |
| 2026-10-28 | `ui/address/mud/AddressMudTable.tsx` | Шестая группа T18: runtime-локализация, проверенные словари, регрессии или передача контекста. |
| 2026-10-28 | `ui/address/mud/AddressMudTablesListItem.tsx` | Шестая группа T18: runtime-локализация, проверенные словари, регрессии или передача контекста. |
| 2026-10-28 | `ui/address/mud/AddressMudTablesTableItem.tsx` | Шестая группа T18: runtime-локализация, проверенные словари, регрессии или передача контекста. |
| 2026-10-28 | `ui/address/remainderLocalization.spec.tsx` | Шестая группа T18: runtime-локализация, проверенные словари, регрессии или передача контекста. |
| 2026-10-28 | `ui/address/tokenSelect/TokenSelectButton.tsx` | Шестая группа T18: runtime-локализация, проверенные словари, регрессии или передача контекста. |
| 2026-10-28 | `ui/address/tokenSelect/TokenSelectItem.tsx` | Шестая группа T18: runtime-локализация, проверенные словари, регрессии или передача контекста. |
| 2026-10-28 | `ui/address/tokenSelect/TokenSelectMenu.tsx` | Шестая группа T18: runtime-локализация, проверенные словари, регрессии или передача контекста. |
| 2026-10-28 | `ui/address/tokens/AddressCollections.tsx` | Шестая группа T18: runtime-локализация, проверенные словари, регрессии или передача контекста. |
| 2026-10-28 | `ui/address/tokens/ERC20TokensListItem.tsx` | Шестая группа T18: runtime-локализация, проверенные словари, регрессии или передача контекста. |
| 2026-10-28 | `ui/address/tokens/ERC20TokensTable.tsx` | Шестая группа T18: runtime-локализация, проверенные словари, регрессии или передача контекста. |
| 2026-10-28 | `ui/address/tokens/TokenBalances.tsx` | Шестая группа T18: runtime-локализация, проверенные словари, регрессии или передача контекста. |
| 2026-10-28 | `ui/blocks/Flashblocks.tsx` | Шестая группа T18: runtime-локализация, проверенные словари, регрессии или передача контекста. |
| 2026-10-28 | `ui/blocks/flashblocks/FlashblocksStats.tsx` | Шестая группа T18: runtime-локализация, проверенные словари, регрессии или передача контекста. |
| 2026-10-28 | `ui/blocks/flashblocks/localization.spec.tsx` | Шестая группа T18: runtime-локализация, проверенные словари, регрессии или передача контекста. |
| 2026-10-28 | `ui/blocks/flashblocks/localization.ts` | Шестая группа T18: runtime-локализация, проверенные словари, регрессии или передача контекста. |
| 2026-10-28 | `ui/contractVerification/methods/ContractVerificationMultiPartFile.tsx` | Шестая группа T18: runtime-локализация, проверенные словари, регрессии или передача контекста. |
| 2026-10-28 | `ui/pages/Blocks.tsx` | Шестая группа T18: runtime-локализация, проверенные словари, регрессии или передача контекста. |
| 2026-10-28 | `ui/pages/Chakra.tsx` | Шестая группа T18: runtime-локализация, проверенные словари, регрессии или передача контекста. |
| 2026-10-28 | `ui/pages/Login.tsx` | Шестая группа T18: runtime-локализация, проверенные словари, регрессии или передача контекста. |
| 2026-10-28 | `ui/pages/Sprite.tsx` | Шестая группа T18: runtime-локализация, проверенные словари, регрессии или передача контекста. |
| 2026-10-28 | `ui/shared/SocketNewItemsNotice.tsx` | Шестая группа T18: runtime-локализация, проверенные словари, регрессии или передача контекста. |
| 2026-10-28 | `ui/snippets/header/Burger.tsx` | Шестая группа T18: runtime-локализация, проверенные словари, регрессии или передача контекста. |
| 2026-10-28 | `ui/snippets/header/alerts/IndexingBlocksAlert.tsx` | Шестая группа T18: runtime-локализация, проверенные словари, регрессии или передача контекста. |
| 2026-10-28 | `ui/snippets/localization.spec.tsx` | Шестая группа T18: runtime-локализация, проверенные словари, регрессии или передача контекста. |
| 2026-10-28 | `ui/snippets/localization.ts` | Шестая группа T18: runtime-локализация, проверенные словари, регрессии или передача контекста. |
| 2026-10-28 | `ui/snippets/navigation/RollupStageBadge.tsx` | Шестая группа T18: runtime-локализация, проверенные словари, регрессии или передача контекста. |
| 2026-10-28 | `ui/snippets/navigation/TestnetBadge.tsx` | Шестая группа T18: runtime-локализация, проверенные словари, регрессии или передача контекста. |
| 2026-10-28 | `ui/snippets/navigation/mobile/NavLinkGroup.tsx` | Шестая группа T18: runtime-локализация, проверенные словари, регрессии или передача контекста. |
| 2026-10-28 | `ui/snippets/navigation/promoBanner/NavigationPromoBannerContent.tsx` | Шестая группа T18: runtime-локализация, проверенные словари, регрессии или передача контекста. |
| 2026-10-28 | `ui/snippets/navigation/vertical/NavLink.tsx` | Шестая группа T18: runtime-локализация, проверенные словари, регрессии или передача контекста. |
| 2026-10-28 | `ui/snippets/navigation/vertical/NavLinkGroup.tsx` | Шестая группа T18: runtime-локализация, проверенные словари, регрессии или передача контекста. |
| 2026-10-28 | `ui/snippets/navigation/vertical/NavigationDesktop.tsx` | Шестая группа T18: runtime-локализация, проверенные словари, регрессии или передача контекста. |
| 2026-10-28 | `ui/snippets/networkLogo/NetworkIcon.tsx` | Шестая группа T18: runtime-локализация, проверенные словари, регрессии или передача контекста. |
| 2026-10-28 | `ui/snippets/networkLogo/NetworkLogo.tsx` | Шестая группа T18: runtime-локализация, проверенные словари, регрессии или передача контекста. |
| 2026-10-28 | `ui/snippets/networkMenu/NetworkMenuContent.tsx` | Шестая группа T18: runtime-локализация, проверенные словари, регрессии или передача контекста. |
| 2026-10-28 | `ui/snippets/networkMenu/NetworkMenuLink.tsx` | Шестая группа T18: runtime-локализация, проверенные словари, регрессии или передача контекста. |
| 2026-10-28 | `ui/snippets/topBar/NetworkMenu.tsx` | Шестая группа T18: runtime-локализация, проверенные словари, регрессии или передача контекста. |
| 2026-10-28 | `ui/snippets/topBar/TopBarStats.tsx` | Шестая группа T18: runtime-локализация, проверенные словари, регрессии или передача контекста. |
| 2026-10-28 | `ui/snippets/topBar/settings/Settings.tsx` | Шестая группа T18: runtime-локализация, проверенные словари, регрессии или передача контекста. |
| 2026-10-28 | `ui/snippets/topBar/settings/SettingsAddressFormat.tsx` | Шестая группа T18: runtime-локализация, проверенные словари, регрессии или передача контекста. |
| 2026-10-28 | `ui/snippets/topBar/settings/SettingsColorTheme.tsx` | Шестая группа T18: runtime-локализация, проверенные словари, регрессии или передача контекста. |
| 2026-10-28 | `ui/snippets/topBar/settings/SettingsIdentIcon.tsx` | Шестая группа T18: runtime-локализация, проверенные словари, регрессии или передача контекста. |
| 2026-10-28 | `ui/snippets/topBar/settings/SettingsPoorReputationTokens.tsx` | Шестая группа T18: runtime-локализация, проверенные словари, регрессии или передача контекста. |
| 2026-10-28 | `ui/snippets/topBar/settings/SettingsScamTokens.tsx` | Шестая группа T18: runtime-локализация, проверенные словари, регрессии или передача контекста. |
| 2026-10-28 | `ui/tx/TxAssetFlows.tsx` | Шестая группа T18: runtime-локализация, проверенные словари, регрессии или передача контекста. |
| 2026-10-28 | `ui/tx/assetFlows/utils/generateFlowViewData.ts` | Шестая группа T18: runtime-локализация, проверенные словари, регрессии или передача контекста. |
| 2026-10-28 | `ui/tx/details/TxDetailsTxFee.tsx` | Шестая группа T18: runtime-локализация, проверенные словари, регрессии или передача контекста. |
| 2026-10-28 | `ui/tx/details/TxInfo.tsx` | Шестая группа T18: runtime-локализация, проверенные словари, регрессии или передача контекста. |
| 2026-10-28 | `ui/txs/TxsStats.tsx` | Шестая группа T18: runtime-локализация, проверенные словари, регрессии или передача контекста. |
| 2026-10-28 | `vitest.i18n.config.mts` | Шестая группа T18: runtime-локализация, проверенные словари, регрессии или передача контекста. |

## 2026-10-28: уточнение языкового объёма T18 владельцем

| Date | File | Change |
|---|---|---|
| 2026-10-28 | `tools/i18n/REMAINING.md` | Оставшаяся локализация и языковая приёмка только RU/KK; исходный EN сохраняется без отдельного перевода и обхода экранов. |
