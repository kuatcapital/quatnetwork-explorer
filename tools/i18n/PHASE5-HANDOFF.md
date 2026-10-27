<!-- Modified by Quat Capital on 2026-10-27: preserve unfinished T18 work before resuming. GPL-3.0. -->
# T18: пятая группа, продолжение 27.10.2026

Это промежуточное сохранение, **не завершение T18**. Последний проверенный и ранее опубликованный checkpoint: `9ec95ed`. Владелец возобновил T18 после временного переключения на T28. Юридическая работа отдельно сохранена в основном репозитории, ветка `astra/legal`, коммит `b30e0a1`; её не смешивать с переводом.

## Состояние при возобновлении

- Найдены 194 реально изменённых tracked-файла (+1742/-1119) и 6 новых файлов. Ложные изменения Windows stat без diff не включать.
- Сохранены частичные fragments: `l2-remaining-translations.json` EN176/RU198/KK176; `multichain-remaining-translations.json` EN222/RU240/KK222; `supplemental-translations.json` 97 на язык; `pages-api-translations.json` 18 на язык.
- Эти fragments **ещё не объединены с canonical** `locales/*.json`. KEY FREEZE не получен. Компоненты с новыми ключами до объединения не считать работающим переводом.
- L2: txnBatches/outputRoots/disputeGames/messages/interopMessages/TAC и связанные страницы. Остались отдельные rich phrases, ручная сверка динамических ключей и проверки.
- Multichain: crossChain/multichain/Zeta/nameServices/nameDomain/cluster/searchResults и связанные страницы. Работа прервалась на SORT/SEARCH tabs, lifecycle, числах и датах; требуется повторная сверка.
- Supplemental: pool/pools/hotContracts/MegaEth/games/MUD/sol2uml/tokenTransfers и отдельные Token/TokenInstance. Требуются завершение scoped проверок и отдельное решение для текста внутри canvas Capybara.
- Root: UserOp/UserOps, API docs и per-request SEO metadata. Код metadata частичный, ресурса `metadata-translations.json` пока нет. Свежая таблица 78 переводов titles сохранена в игнорируемом `node_modules/.cache/t18-metadata-title-rows.json`; не исполнять старые temp-скрипты без чтения.

## Проверки и ограничения

Новые правки пока **не проходили полный TypeScript/ESLint/Vitest**. PASS 54 unit / 11 tooling и предыдущие lint относятся к `9ec95ed`. Перед готовым checkpoint объединить словари со строгой проверкой коллизий, проверить все динамические ключи, GPL notices и QUAT-CHANGES, затем выполнить общие проверки.

После этой группы остаются встроенные Monaco/Swagger/GraphiQL/SDK/iframe UI, ручной обход страниц, browser smoke, вычитка KK и Docker build. Функции не отключать ради перевода. Docker build ранее отложен владельцем, серверную сборку не запускать. `.env`, ключи, серверы и контейнеры не трогать.

Canonical объединяет только root из замороженных fragments. `reviewed-dryrun.json` и старые temp-файлы не включать. В основном репозитории использовать ветку `astra/i18n`, читать `docs/tasks/T18-HANDOFF.md`, журнал добавлять в §8. Доступ GitHub основного репозитория в последней попытке отсутствовал; локальное сохранение не означает push.
