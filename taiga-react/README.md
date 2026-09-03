# taiga-ui-react

React-порт дизайн-системы [Taiga UI](https://taiga-ui.dev) (v5.22). Тот же визуальный язык — потому что используются **те же самые исходники стилей**: токены `@taiga-ui/design-tokens`, тема и компонентные стили `@taiga-ui/styles`, а также стили, которые Angular-версия инжектит из своих бандлов. Пиксель-в-пиксель тот же вид, те же анимации (`tuiFade`/`tuiSlide` и другие — в Taiga v5 все анимации на чистом CSS).

## Установка

```bash
npm i taiga-ui-react
```

Peer-зависимости: `react` и `react-dom` (18 или 19).

## Подключение

```tsx
import {TuiRoot, TuiThemeProvider, TuiButton} from 'taiga-ui-react';
import 'taiga-ui-react/taiga-ui.css';      // тема + стили компонентов (обязательно)
import 'taiga-ui-react/taiga-ui-fonts.css'; // Manrope (опционально, есть фолбэк на system-ui)

export default function App() {
    return (
        <TuiRoot>
            <TuiThemeProvider defaultDark={false}>
                <TuiButton appearance="secondary" iconStart="@tui.plus">Создать</TuiButton>
            </TuiThemeProvider>
        </TuiRoot>
    );
}
```

### Иконки

Иконки Taiga — 4000+ SVG из `@taiga-ui/icons`. Скопируйте их в публичную папку проекта (как это делает `ng add taiga-ui` в Angular):

```bash
cp -r node_modules/@taiga-ui/icons/src/* public/assets/taiga-ui/icons/
```

и при необходимости смените базовый путь:

```tsx
import {setTuiIconsBase} from 'taiga-ui-react';

setTuiIconsBase('/assets/taiga-ui/icons/');
```

## Механизм порта

1. **Стили** — `scripts/build-styles.mjs` компилирует `taiga-ui-theme.less` и каждый компонентный less-файл `@taiga-ui/styles` отдельно (та же изоляция единиц компиляции, что даёт `tuiWithStyles` в Angular: скоуп `[data-tui-version='5.22.0']`), затем склеивает со стилями, извлечёнными из fesm-бандлов Angular-пакетов (`scripts/extract-styles.mjs`: диалоги, дропдауны, хинты, таблица и т.д.).
2. **DOM** — React-компоненты воспроизводят ту же разметку и атрибуты (`tuiButton`, `data-appearance`, `data-size`, `data-icon-start` + CSS-маски иконок через `--t-icon-*`), под которую написаны оригинальные селекторы.
3. **Анимации** — из коробки: это CSS-анимации тех же стилевых файлов; классы `tui-enter`/`tui-leave` снимаются по `animationend`, как в Angular-версии.
4. **Тема** — `TuiThemeProvider` переключает `[tuiTheme]` на `<html>` (светлая/тёмная палитры токенов), состояние хранится в localStorage.

## Компоненты (~60)

- **Основа**: `TuiRoot`, `TuiThemeProvider`/`useTuiTheme`, `TuiButton`, `TuiIconButton`, `TuiIcon`, `TuiBadge`, `TuiAvatar`, `TuiAvatarStack`, `TuiChip`, `TuiTitle`/`TuiSubtitle`, `TuiLabel`, `TuiLink`, `TuiError`, `TuiLoader`, `TuiSkeleton`, `TuiStatus`, `TuiBadgeNotification`, `TuiBadgedContent`, `TuiLineClamp`
- **Формы**: `TuiTextfield` + `TuiInput`, `TuiTextarea` (со счётчиком), `TuiInputNumber`, `TuiSelect`, `TuiComboBox`, `TuiMultiSelect`, `TuiCheckbox`, `TuiSwitch`, `TuiRadio`, `TuiSegmented`, `TuiSlider`, `TuiCounter`, `TuiCopy`, `TuiRating`, `TuiFilter`
- **Календарь**: `TuiCalendar` (+ ISO-хелперы `toIso`/`fromIso`/`formatTuiDate`), `TuiInputDate`
- **Оверлеи**: `TuiDropdown`, `TuiHint`, `TuiDialogsProvider`/`useTuiDialogs` + `TuiConfirmContent`, `TuiNotificationsProvider`/`useTuiNotifications` + `TuiNotification`
- **Навигация и структура**: `TuiTabs`/`TuiTab`, `TuiAccordion`/`TuiAccordionItem` (+ `TuiExpand`), `TuiBreadcrumbs`/`TuiBreadcrumbItem`, `TuiPagination`, `TuiStepper`/`TuiStep`, `TuiTimeline`/`TuiTimelineItem`, навигационный шелл (`TuiNavigationAside`/`TuiNavigationHeader`/`TuiNavigationMain`/`TuiNavigationNav`/`TuiNavigationLogo`/`TuiAsideItemLink`/`TuiAsideItemButton`/`TuiFade`)
- **Данные и layout**: `TuiTable`/`TuiTh` (sticky)/`TuiTd` (sticky)/`TuiTbody`/`TuiTablePagination`, `TuiProgressBar`, `TuiSurface`, `TuiCard`, `TuiHeader`, `TuiCell`, `TuiBlockStatus`, `TuiBlockDetails`, `TuiDataList`/`TuiOption`/`TuiOptGroup`, `TuiList`, `TuiItemGroup`, `TuiForm`, `TuiTiles`/`TuiTile`
- **Графики**: `TuiAxes`, `TuiBarChart`, `TuiLineChart`, `TuiPieChart`, `TuiRingChart`, `TuiArcChart`, `TuiLegendItem`

Размеры сверены с Angular-версией по вычисленным стилям; клик-тест всех интерактивных элементов демо — 32/32.

## Осталось (последний прогон)

Датапикеры-варианты (range/month/time), input-phone (маски), mobile-компоненты (`addon-mobile`), редактор (`addon-editor`), «more»-режим breadcrumbs, tree, carousel, drawer, preview, files, input-chip, pin/pincode.

## Разработка

```bash
npm run build        # dist/: ESM + типы + taiga-ui.css
npm run build:css    # пересборка CSS из @taiga-ui/styles
node scripts/extract-styles.mjs   # регенерация стилей из fesm-бандлов (нужен Angular-проект с установленными @taiga-ui/*)
cd demo && npm i && npm run setup:icons && npm run dev   # галерея компонентов (vite, порт 5173)
```

Демо-галерея (`demo/`) показывает все компоненты, тёмную тему и оверлеи.

## Статус и ограничения

Порт покрывает ядро дизайн-системы (37 компонентов). Не перенесено: календари/датапикеры, слайдеры, мобильные компоненты (`addon-mobile`), редактор (`addon-editor`), pie/ring-диаграммы, sticky-колонки таблиц, счётчик символов textarea, «more»-режим breadcrumbs. Архитектура (портальный реестр, атрибутная разметка, сборка стилей) рассчитана на постепенное расширение тем же паттерном.

## Лицензия и происхождение

Apache-2.0. Стили и иконки — оригинальные артефакты [taiga-family/taiga-ui](https://github.com/taiga-family/taiga-ui) (Apache-2.0); каждый извлечённый файл содержит пометку источника.
