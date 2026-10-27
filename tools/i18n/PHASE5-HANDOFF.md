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

## Продолжение после WIP `8f2c6ec`

- Root завершил runtime SEO для 91 маршрута и 5 enhanced titles, 8 отдельных descriptions и общего default. `tools/i18n/metadata-translations.json` содержит 111 ключей на язык, `pages-api-translations.json` ещё 18. Они строго объединены в canonical.
- Regeneration штатным `nextjs-routes/core.js` обнаружила отсутствующий в старом generated declaration маршрут `/api/i18n/[locale]`. Обновлены exhaustive maps title/description/OG/analytics; generated types проверяются до Docker build, без чтения `.env` и запуска сервисов.
- Четыре metadata regression tests PASS: все маршруты и исходный EN, пять enriched routes, API/JSON-LD/canonical без изменений, независимые языки запросов, однократная интерполяция и защита от query-ключей `lng`/`ns`. Файл `lib/metadata/localization.spec.ts` включён в isolated config.
- L2 fragment заморожен EN177/RU199/KK177, scoped ESLint 74 production + spec 0/0, 6 unit/SSR PASS; исправлены 6 ошибочно переведённых машинных `tab=blocks`. Multichain fragment заморожен EN244/RU264/KK244, virtual refs и 183 SSR assertions PASS; финальный scoped lint уточняется. Supplemental fragment заморожен 99/lang, scoped ESLint73 файлов 0/0, 60 SSR/helper checks PASS, canvas Capybara 5/5 tests PASS.
- Все три замороженных feature fragments уже строго объединены: canonical **EN3017/RU3137/KK3017**, normalized2957/lang, dictionary-only check PASS. Это промежуточные цифры до CSV.
- Дополнительно агент L2 завершает `ui/pages/CsvExport`, ContractVerificationForAddress, KettleTxs, `ui/csvExport/**` и mapping клиентской ошибки Incorrect date. Новый fragment `page-remainder-translations.json` **пока не FREEZE и не canonical**. Не выполнять общий source-key check до его объединения.
- Новые isolated specs: `ui/txnBatches/l2Localization.spec.tsx`, `ui/games/capybaraLocale.spec.ts`. Root уже включил оба в config. Canvas GAME OVER/HI используют runtime t через data attrs; RU/KK рисуются текстом, EN sprite сохранён; locale change не сбрасывает счёт.
- Дополнительный inventory показал реальные EN-хвосты production в contract alerts/methods/info, отдельных snippets/tx details; прежняя формулировка «остались только сторонние UI» недостаточна. Showcase/dev pages имеют отдельный большой хвост. Нужна следующая ручная группа после checked checkpoint; 3728 эвристических кандидатов не являются числом непереведённых фраз.
- **Полный финальный TypeScript/ESLint/Vitest пока не запускались на замороженной общей группе.** Промежуточный tsc выявил недостающий chart fixture.resolutions и два string-to-Intl-counter callsites; исправления сохранены, требуется финальный повтор.

## Проверенный итог пятой группы

- Root после остановки агентов по лимиту закончил CSV (25 keys/lang), исправил два optional-counter callsites и последние 15 ошибок ESLint в multichain. Шесть новых fragments строго объединены с canonical: **EN3042/RU3162/KK3042**, normalized2982/lang.
- `corepack yarn lint:tsc --pretty false` **PASS**, `corepack yarn lint:eslint` **PASS: 0 errors / 7 существующих upstream skipped-test warnings**, 2680 файлов.
- Изолированный Vitest **75/75 PASS** (20 specs), tooling **11/11 PASS**. Check-locales **PASS**, 3843 literal refs в 2113 sources; dynamic keys отдельно покрыты тестами/ручной сверкой. Это не доказательство полноты всех экранов.
- GPL notices проверены для всех **236** файлов совокупного diff относительно `9ec95ed`, все пути внесены в QUAT-CHANGES. `git diff --check` PASS.
- Следующая группа: production остаток контрактов/ABI/методов/валидации, snippets/header/settings/network menus и отдельные address/tx подписи. Значительная часть контрактных фраз уже есть в canonical: подключить существующие ключи, не переводить повторно. Showcase/dev pages, flashblock names и встроенные сторонние UI остаются отдельно.
- Browser smoke, вычитка KK, Docker build и итоговый deployment pin/PR **ещё не выполнены**. Подробности новых изменений после этого checkpoint сохранять отдельно; не приписывать им эти PASS.
