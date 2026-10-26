<!-- Modified by Quat Capital on 2026-10-26: T18 shared-component continuation checkpoint. GPL-3.0. -->
# Shared UI — продолжение T18

Предыдущая группа сохранена root в `c8b67b7`. Canonical JSON объединяет только root. Fragments `shared-entities-translations.json`, `shared-logs-translations.json`, `shared-remainder-translations.json`, `shared-search-items-translations.json` заморожены.

Проверки предыдущей группы: scoped ESLint 98 файлов — 0 ошибок / 0 предупреждений; отдельные два searchResults-компонента и новый hook — ESLint 0 ошибок. Virtual dictionary check: 227 literal references в 98 исходниках, 0 ошибок; 4 динамические ссылки просмотрены вручную. Реальный i18next проверил 72 сочетания socket-message/type/locale/count (1, 2, 5, 21). Root отдельно прогнал полные TypeScript/ESLint и 44 теста для checkpoint.

## Следующая группа

Новый fragment: `tools/i18n/editor-shared-translations.json` (`en` / `ru` / `kk`), EN56 / RU60 / KK56. Собственные элементы перечисленной ниже группы реализованы и объединены root. Проверки: scoped ESLint 22 source/test файлов 0/0, 69 literal refs и динамические ветки PASS, газовые тесты 3/3 PASS, GPL 22/22. Встроенные интерфейсы сторонних библиотек остаются открытым пунктом.

- `ui/shared/monaco/`: собственные кнопки, вкладки, sidebar, search, зарегистрированные actions и ховеры decorations. При смене языка actions нужно dispose/re-register; decoration ids удалять перед обновлением. Встроенные функции Monaco не отключать ради перевода.
- `ui/shared/address/AddressAddToWallet.tsx`: тосты и пояснения добавления токена.
- `ui/shared/Noves/NovesFromTo.tsx`: перевести display labels; `Noves/utils.ts` содержит машинные маркеры `Sent to` / `Received from`, которые участвуют в `getFromToValue` и не должны ломаться от перевода.
- `ui/shared/gas/GasPrice.tsx`, `formatGasValue.ts`: explicit locale для чисел и собственный N/A fallback; сохранить machine units.
- `ui/shared/solidityscanReport/`: кнопка, уровни оценки и полная фраза оценки.
- `ui/shared/EpochRewardTypeTag.tsx`: четыре типа вознаграждения и их подсказки.
- `ui/shared/TokenTransferSnippet/`: перевести целые фразы с компонентами суммы / ID / токена, сохранив их порядок по языку.
- `ui/shared/stats/StatsWidget.tsx`: подписи периода и fallback числовой разницы.
- `ui/shared/AppActionButton/AppActionButton.tsx`: собственный alt; текст кнопки из внешних metadata оставить данными.
- `ui/searchResults/`: в checkpoint переведены только category labels. Остальные исходные строки этих экранов требуют отдельной группы, не считать их завершёнными.

## Границы

`Time.tsx`, `TimeWithTooltip.tsx`, `lib/date/timestamp.ts` — root. `ui/shared/chart/{ChartIntervalSelect,useChartQuery}.tsx` — агент блоков/статистики. `AccountActionsMenu` — агент аккаунта. Web3 providers — root. Серверы, контейнеры, Docker и `.env` не затрагивать.

В установленном `monaco-editor/min/vs/editor/` есть NLS bundles RU и EN; KK bundle отсутствует. `@monaco-editor/loader` документирует `vs/nls.availableLanguages` при инициализации AMD loader. Из этого не следует runtime-переключение встроенного Find/Command Palette у уже загруженного экземпляра. Собственные компоненты переводятся через runtime dictionaries; встроенный NLS остаётся отдельным открытым пунктом T18. Исходники редактора и имена файлов не переводить.

Дополнительно проверен `node_modules/@monaco-editor/loader/lib/es/config/index.js`: текущий loader по умолчанию грузит CDN Monaco 0.52.2, хотя зависимость `monaco-editor` в исходном package.json — 0.34.x. Доставку и функции редактора эта группа не меняла. Не считать собственные переведённые кнопки доказательством полной локализации встроенного Monaco.
