<!-- Modified by Quat Capital on 2026-10-28: installed-source evidence for remaining third-party RU/KK UI. GPL-3.0. -->
<!-- Modified by Quat Capital on 2026-10-29: own Dynamic errors localized separately from the SDK UI. GPL-3.0. -->
# T18: встроенные интерфейсы — факты для продолжения

Проверено 28.10.2026 по локальным исходникам и декларациям установленных зависимостей. Это состояние данного checkout, не утверждение о последних доступных версиях. Файлы зависимостей не менялись.

## Dynamic

- Реальная точка подключения — `ui/shared/web3/providers/DynamicProvider.tsx`, а не `lib/web3/`. Провайдер пока не передаёт `locale`. Собственные Error/fallback и помеченная ошибка неверного ответа подключены к runtime-переводам в шаге8; неизвестные API/SDK errors сохраняются как данные. Это не локализация встроенного UI Dynamic.
- В установленном `@dynamic-labs/locale` **4.74.1** (`package.json`) `src/lib/type.d.ts` определяет `LocaleResource` как словари переводов по языкам. RU включён в тип `Lang`, KK отсутствует. Простая передача `locale="ru"` неверна: ожидается объект ресурсов.
- `src/lib/locale.js`: `Locale.setup()` создаёт отдельный экземпляр i18next, исходно с `lng: 'en'`; `setResources()` игнорирует повторное заполнение после первого вызова. Поэтому обновлять только prop `locale` недостаточно для runtime JSON и переключения.
- Экспорт `Locale` доступен через `src/index.js`. `Locale.getInstance()` возвращает экземпляр i18next; контекст SDK также предоставляет `locale.changeLanguage` (`sdk-react-core/src/lib/context/DynamicContext/types/IDynamicContext.d.ts`).
- Следующий шаг: подготовить полный RU/KK словарь по `src/lib/en/translation.js`, проверить поддерживаемое обновление ресурсов отдельного i18next и мост переключения без повторной инициализации кошелька. Проверить конфликт типового списка языков с KK. Не обходить его бессодержательным приведением типов и не заявлять готовность после перевода одного окна.

## Reown

- Точка подключения — `ui/shared/web3/providers/ReownProvider.tsx`: `createAppKit()` вызывается при инициализации модуля; React-компонент синхронизирует только тему.
- В просмотренных декларациях `@reown/appkit/dist/types` и `@reown/appkit-controllers/dist/types` не найдено явного параметра locale/language/translations. Это результат поиска в данных путях, не доказательство невозможности локализации всей библиотеки. Нужна отдельная проверка компонентов UI и официального API установленной версии.

## Multisender

- Точка подключения — `ui/marketplace/essentialDapps/multisend/Multisend.tsx`.
- Установлен `@multisender.app/multisender-react-widget` **0.2.3** (`package.json`). Экспортируемый `dist/MultisenderWidget.d.ts` перечисляет config, аналитику, тему, логотип и classNames; явного параметра языка/словаря нет.
- Объявление дополнительно расширяет `SharedMultisenderMantineProviderProps`; указанный относительный файл не найден по ожидаемому пути. Полный вывод об отсутствии расширений языка пока не подтверждён. Следующая проверка — фактические exports/README и доступные исходники виджета.

## Swap iframe

- `ui/marketplace/essentialDapps/swap/Swap.tsx` передаёт внешнему iframe сообщение `type: 'config'` с сетями, оформлением и комиссиями. Параметр языка сейчас не передаётся.
- Нельзя произвольно добавить `locale` и считать задачу закрытой: необходим подтверждённый контракт принимающей стороны и проверка его применения. Не подменять DOM чужого iframe.

## Другие открытые участки

Monaco, Swagger и GraphiQL остаются в `REMAINING.md`; их механизмы в этой группе не изменялись. Дополнительно проверить генерируемые библиотеками accessibility-строки Chakra/Ark UI, например у PinInput/Rating. Видимые подписи примеров уже переведены, библиотечные строки автоматически готовыми не считать.
