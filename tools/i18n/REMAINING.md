<!-- Modified by Quat Capital on 2026-10-28: actionable T18 remainder after phase6 validation. GPL-3.0. -->
<!-- Modified by Quat Capital on 2026-10-29: six own UI gaps closed in checked phase8; accessibility is next. GPL-3.0. -->
<!-- Modified by Quat Capital on 2026-10-29: step9 accessibility integration and explicit external UI remainder. GPL-3.0. -->
# T18: что ещё нужно закончить
<!-- Modified by Quat Capital, 2026-11-01: Dynamic dictionaries and bridge implemented; browser acceptance remains. GPL-3.0. -->

Дата сверки: 01.11.2026. Это остаток после десятого шага, не новый объём задачи. Проверки словарей и unit-тесты не заменяют проверку полноты интерфейса. Итоги последних групп — `PHASE9-HANDOFF.md`, `PHASE10-HANDOFF.md`.

Уточнение владельца от 28.10.2026: оставшаяся локализация и языковая приёмка — только RU/KK. Английский уже исходный язык эксплорера: отдельно его не переводить, не редактировать и не проверять обходом экранов. Существующий EN и переключатель сохраняются; общие проверки кода, структуры словарей и сборки остаются обязательными.

## 1. Собственные экраны

- Шаг8 закрыл toasts добавления сети/наград/собственной ошибки Dynamic, cluster search placeholder, Native token display и known unfinalized status. Исправлены четыре сравнения API-типа с переводом в двух portfolio-компонентах; machine ids снова стабильны. Эти места заново не извлекать.
- Шаг9 подключил поддержанные accessibility translations/aria в PinInput, Rating, Progress/ProgressCircle, Select, Popover и Toaster. Проверены caller overrides, сохранение отредактированных значений и фокуса при RU ↔ KK, прежние горячие клавиши; подробности в `PHASE9-HANDOFF.md`.

- Оболочки `/chakra`, `/sprite`, `/login` используют `developerUi`; в седьмой группе подключены RU/KK в 34 showcase-компонентах. `/chakra` и `/sprite` используют `base = factory([])` без dev-guard (`nextjs/getServerSideProps/main.ts`); поэтому содержимое не исключалось из перевода. Примеры исходных данных, Lorem ipsum и технические prop/value labels сохраняются. Браузерный обход и встроенные accessibility-строки Chakra/Ark UI ещё проверить.
- Просмотреть динамические пользовательские подписи, сообщения и aria-label во всех production-разделах по `tools/i18n/inventory.json`. После шестой группы оставшийся простой JSX-текст вне showcases в основном состоит из брендов, EIP и единиц; это не доказательство отсутствия пропусков в выражениях и данных конфигурации.
- Динамические ссылки `t(...)`: после шага9 check-locales отмечает 94 места для ручной сверки. Части покрыты regression specs; обращения Accordion/Table и toast placement сверены с ограниченными таблицами ключей, own-error/native labels проверены отдельно. Нельзя трактовать отсутствие literal-missing errors как полное покрытие.

## 2. Встроенные интерфейсы

| Точка входа | Незавершённая часть | Следующее действие |
|---|---|---|
| `ui/shared/monaco/`, `@monaco-editor/loader` | Свои controls переведены; внутренние Find/Command Palette, RU/KK и переключение без потери редактора не завершены | Проверить локальный NLS, источник доставки и жизненный цикл loader; не отключать функции |
| `ui/apiDocs/SwaggerUI.tsx` | `SwaggerUIReact` получает только URL, plugin скрытия info и interceptor; собственного механизма языка нет | Инвентаризировать внутренние controls и возможности plugins/wrapComponents установленной зависимости |
| `ui/apiDocs/GraphQL.tsx` | `GraphiQL` получает fetcher/query/theme, без локализации controls | Проверить API установленной зависимости; сохранить запрос, историю и редактор при смене языка |
| `ui/marketplace/essentialDapps/` | UI Multisender и внешних swap iframe | Проверить поддерживаемые locale props/URL; собственный перевод не даёт контроля над чужим iframe |
| `ui/shared/web3/providers/ReownProvider.tsx` | Диалоги Reown и интерфейс внешнего приложения кошелька | Проверить поддержанные API локализации; границы чужого приложения учитывать отдельно |

Прямой DOM-подменой текстов и отключением функций проблему не закрывать. Не обновлять GPL frontend на другую лицензию ради готового перевода.

Шаг10 подключил все 1005 исходных строк Dynamic и runtime-мост, исправил зависимость области экспорта от английского заголовка. Это закрывает словарь и интеграцию Dynamic; проверка реальных модальных сценариев в браузере остаётся. Конкретные наблюдения по Reown/Multisender и swap iframe — `EXTERNAL-UI-NOTES.md`. Работа со сторонним UI ещё не завершена.

## 3. Приёмка и доставка

1. Обход RU/KK на desktop/mobile: длинные строки, plurals, числа/даты, формы, ошибки, переключение языка и его сохранение. Отдельный обход и вычитка EN исключены владельцем.
2. Проверить реальную замену runtime JSON без пересборки и поведение при недоступном/повреждённом словаре. Unit-тесты есть, browser smoke ещё нет.
3. Казахский текст отдать носителю; машинные идентификаторы, ABI, пользовательский контент и raw API не переводить.
4. Docker build ранее отложен владельцем. Без него сборочный критерий T18 не закрыт. Серверы не использовать как обход.
5. Основной репозиторий: после проверки сборки заменить baseline SHA `42add5f...` в `scripts/explorer.sh`, завершить переход от старого overlay. Затем два PR: frontend в `claude/gpl-v2.7.2`, интеграция в `claude/besu-testnet`; мерджит владелец.

## 4. Сохранность

Подтверждена публикация frontend `713a619` (шаг9) и основного журнала `7d72883` в `astra/i18n`. Итог шага10 — `PHASE10-HANDOFF.md`; точный SHA после его push сохраняется в основном `docs/tasks/T18-HANDOFF.md`. Старые записи об отсутствии авторизации не описывают текущую сохранность девяти шагов.
