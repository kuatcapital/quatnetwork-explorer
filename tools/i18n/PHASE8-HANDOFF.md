<!-- Modified by Quat Capital, 2026-10-29: small core UI continuation after seven checked groups. GPL-3.0. -->
# T18: шаг 8, собственные уведомления и служебные подписи

База: опубликованный `56480fb`, семь прежних групп. Не начинать перевод заново. Английский отдельно не переводить/не обходить, новые EN-значения являются копией прежних строк для работы ключей. Шаг 8 проверен; точный SHA смотреть через git log.

## Реализация

- Root: useAddChainClick, rewards error toast и собственная ошибка ответа Dynamic получают runtime-перевод. Только специально помеченная `OwnUiMessageError` переводится; текст произвольных SDK/API errors сохраняется. SIWE, auth payload, analytics и операции кошелька не менялись.
- Root: known `unfinalized` отображается через `sharedStatus.unfinalized`, `finalized` сохраняет прежний тип badge; неизвестные значения остаются исходными данными.
- `core_labels8` закончил Native token display (13 мест), cluster placeholder и исправил четыре ошибочных сравнения типа с переводом в двух portfolio-компонентах. Машинное значение снова `'NATIVE'`. SSR проверяет реальные portfolio-компоненты с Native/ERC-20 и неизвестными именами оператора.
- Fragments: `core-toasts8-translations.json` и `core-labels8-translations.json` по одному ключу на язык. Canonical объединяет только root; новый toast key уже включён, labels key добавить после freeze (агент подтвердил KEY FREEZE).
- Новые specs: `lib/i18n/uiMessages.spec.ts`, `lib/web3/useAddChainClick.spec.tsx`, `lib/token/tokenTypes.localization.spec.tsx`, `ui/shared/statusTag/ArbitrumL2TxnBatchStatus.spec.tsx`. Root добавил соответствующие пути в isolated config.

## Сверка машинных данных

Независимый read-only AST-аудит 2043 own sourcefiles просмотрел сравнения/case, query/API/cookie и JSX machine props, включая алиасы tQuat/tEco. Дополнительных подтверждённых ошибок за пределами исправляемых NATIVE-сравнений не найдено. 54 подозрительных места проверены как display-only. Временный отчёт: `node_modules/.cache/t18-machine-audit8-summary.json`.

## Дальше

1. Строго объединить labels fragment, выполнить dictionaries/refs, новые и общие unit checks, полный TypeScript/ESLint, GPL/QUAT/diff-check, затем отдельный commit и попытка push `astra/i18n`.
2. Обновить основной `docs/tasks/T18-HANDOFF.md` и журнал §8, сохранить отдельный commit. Не считать commit опубликованным без подтверждения push/remote.
3. Следующий небольшой шаг9: поддержанные runtime accessibility-подписи Chakra/Ark wrappers PinInput/Rating/Progress/Select/Popover/Toaster. Агент `ark_accessibility9` пока только исследовал исходники; до STEP8 READY код не меняет. Сохранять caller overrides и API semantics.
4. Встроенные Monaco/Swagger/GraphiQL/wallet SDK/iframe и браузерная приёмка RU/KK остаются. Не отключать функции и не подменять DOM ради перевода. Вычитка KK и отложенный Docker build не выполнены. Серверы/контейнеры/ключи/`.env` не трогать.

## Проверенный итог

- Оба fragments строго объединены: EN3397/RU3525/KK3397, normalized3333/lang. Check-locales PASS: 4501 literal refs, 93 dynamic refs. Прежние значения словарей не редактировались.
- Полный `corepack yarn lint:tsc --pretty false` PASS. Полный `yarn lint:eslint` PASS: 2693 файла, 0 errors / 7 прежних skipped-test warnings.
- Изолированный Vitest **116/116 PASS**, 29 specs, включая 10 прежних тестов cluster action bar и 10 новых регрессий этого шага. Tooling **11/11 PASS**. API/SDK сообщения сохраняются, wallet add/switch/analytics и Native/ERC-20 ссылки проверены.
- Четыре некорректных сравнения перевода с NATIVE исправлены. Дополнительных подтверждённых machine-value ошибок независимый AST-аудит не обнаружил. Это не browser smoke и не доказательство полноты встроенных UI.
- Inventory обновлён: 3065 эвристических кандидатов, parse errors0. Метаданные генератора исправлены: modifiedOn29.10 и отдельный generatedAt. Не трактовать число кандидатов как остаток перевода.
- Следующая работа: STEP9 accessibility wrappers по плану агента; SDK/редакторы ещё открыты. Сохранять caller overrides, focus/values и контролируемое состояние. Каждый следующий checkpoint проверять отдельно.
