<!-- Modified by Quat Capital, 2026-10-27: continuation ownership after checked checkpoint 1c6e140. GPL-3.0. -->
# T18: шестая группа основных экранов

База: **`1c6e140`**, пятая группа. Её проверки: TypeScript/ESLint PASS (0 errors, 7 upstream warnings), 75 unit и11 tooling PASS, canonical3042/3162/3042. Новые изменения ниже пока не входят в эти PASS.

## Владение и продолжение

- `core_contracts6`: `ui/address/contract/**`, SolidityscanReport и реальные остатки `ui/contractVerification/**`. Большинство переводов уже находится в canonical `contracts`/`verification`: подключить их, не извлекать повторно. Валидацию переводить при render только для известных client messages, server/manual/unknown сохранять. Новый fragment `contracts-remainder-translations.json`.
- `shell_remainder6`: snippets/header/settings/network menu/promo/aria/статусные badges, новый `shell-remainder-translations.json` (на промежуточном этапе34keys/lang). Свой spec `ui/snippets/localization.spec.tsx` включить root в isolated config. EN artwork badges сохраняется.
- Его дочерний агент: production address/tx/txs leftovers без contract/**/SolidityscanReport, отдельный `tx-address-remainder-translations.json`.
- Root: `ui/pages/Blocks`, `ui/blocks/Flashblocks`, `ui/blocks/flashblocks/FlashblocksStats`, `ui/shared/SocketNewItemsNotice`, новый helper/spec. `flashblock-translations.json`10keys/lang уже объединён root с canonical. Machine tab/socket ids не менялись. English names/hints сохранены, RU/KK feature names локализованы. Новый flashblock spec2/2PASS; scoped lint выполняется.

Canonical объединяет только root после KEY FREEZE. Fragments других агентов пока не merged; наличие файла не означает готовности. Новые paths после1c6e140 должны получить datedGPLnotice27.10 и QUAT-CHANGES. Не добавлять старый reviewed-dryrun/temp/cache в Git. Следующая проверка после freeze: dictionaries+refs, meaningful specs, полный yarn TypeScript/ESLint, GPL+diff-check.

## Остаток вне шестой группы

Showcase/dev pages (`Chakra`, `Login`, `Sprite`, `ui/showcases/**`) и встроенные Monaco/Swagger/GraphiQL/wallet SDK/Multisender/iframe UI требуют отдельной работы. Не отключать функции ради перевода. Browser smoke, вычитка KK, Docker build и финальный deployment SHA pin/PR ещё не готовы. Docker build отложен владельцем; серверы/контейнеры/ключи/`.env` не трогать.

## Сохранность

Frontend1c6e140 и основной журнал16163d4 сохранены локально; push frontend не прошёл из-за отсутствия GitHub-авторизации. Последний ранее подтверждённыйremote9ec95ed. Не заявлять, что новые коммиты опубликованы. Юридическая задачаT28 отдельно в основном репозитории `astra/legal` b30e0a1; не смешивать её с T18.

## Проверенный итог 28.10.2026

- Root сверил фактическую шестую группу после другой сессии. Пять фрагментов уже объединены и совпадают с основными словарями: contracts remainder — 5 ключей на язык, shell — 34, address/tx — 37/45/37, flashblocks — 10, developer pages — 57. Всего EN 3185 / RU 3313 / KK 3185. Check-locales PASS: 3985 статических ссылок в 2117 исходниках; 77 динамических ссылок требуют отдельной сверки.
- Полный TypeScript сначала обнаружил 3 ошибки типов JSON в двух тестах. Исправлено: тесты контрактов и address/tx теперь читают проверенные основные словари, без наложения фрагментов. Повторный полный TypeScript PASS. Полный ESLint: 0 ошибок / 7 старых предупреждений upstream; после исправления двух тестовых файлов их отдельная проверка ESLint также PASS.
- Изолированный Vitest: 96/96 PASS (24 тестовых файла); после правки чтения словарей повторены 14/14 тестов двух затронутых файлов. Проверки tooling: 11/11 PASS. Ошибка EPERM временного кэша в sandbox устранена штатным запуском разрешённых тестов вне sandbox.
- Inventory обновлён: 2117 исходников, 3605 эвристических кандидатов, 0 ошибок разбора. Число кандидатов НЕ равно числу непереведённых строк. Основной остаток и точки входа перечислены в `REMAINING.md`.
- Следующая работа: завершить showcase-экраны, встроенные UI сторонних библиотек и ручную приёмку. Полную T18 не объявлять завершённой. Docker build по-прежнему отложен владельцем.
