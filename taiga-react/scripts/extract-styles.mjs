// Извлекает скомпилированные стили компонентов из fesm-бандлов @taiga-ui
// (в Angular они инжектятся в DOM через tuiWithStyles или как styles: [] с :host;
// для React-порта собираем их в статические CSS-файлы и переписываем :host
// на селектор тега компонента — семантика совпадает).
// Источник — оригинальные пакеты из node_modules корневого проекта репозитория.
// Регенерация: node scripts/extract-styles.mjs
import {readFileSync, writeFileSync, mkdirSync, existsSync} from 'node:fs';
import {resolve, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const workspace = resolve(here, '..', '..');
const out = resolve(here, '..', 'src', 'styles', 'extracted');

// [fesm-путь, имя css, тег для перезаписи :host (опционально)]
const TARGETS = [
    ['@taiga-ui/core/fesm2022/taiga-ui-core-components-data-list.mjs', 'data-list.css', null],
    ['@taiga-ui/core/fesm2022/taiga-ui-core-components-root.mjs', 'root.css', null],
    ['@taiga-ui/core/fesm2022/taiga-ui-core-portals-dialog.mjs', 'dialog.css', null],
    ['@taiga-ui/core/fesm2022/taiga-ui-core-portals-dropdown.mjs', 'dropdown.css', 'tui-dropdown'],
    ['@taiga-ui/core/fesm2022/taiga-ui-core-portals-hint.mjs', 'hint.css', 'tui-hint'],
    ['@taiga-ui/core/fesm2022/taiga-ui-core-components-error.mjs', 'error.css', 'tui-error'],
    ['@taiga-ui/core/fesm2022/taiga-ui-core-components-loader.mjs', 'loader.css', 'tui-loader'],
    ['@taiga-ui/core/fesm2022/taiga-ui-core-components-cell.mjs', 'cell.css', null],
    ['@taiga-ui/core/fesm2022/taiga-ui-core-components-expand.mjs', 'expand.css', 'tui-expand'],
    ['@taiga-ui/kit/fesm2022/taiga-ui-kit-components-segmented.mjs', 'segmented.css', null],
    ['@taiga-ui/kit/fesm2022/taiga-ui-kit-components-tabs.mjs', 'tabs.css', 'tui-tabs'],
    ['@taiga-ui/kit/fesm2022/taiga-ui-kit-components-accordion.mjs', 'accordion.css', null],
    ['@taiga-ui/kit/fesm2022/taiga-ui-kit-components-breadcrumbs.mjs', 'breadcrumbs.css', 'tui-breadcrumbs'],
    ['@taiga-ui/kit/fesm2022/taiga-ui-kit-components-pagination.mjs', 'pagination.css', 'tui-pagination'],
    ['@taiga-ui/kit/fesm2022/taiga-ui-kit-components-textarea.mjs', 'textarea.css', null],
    ['@taiga-ui/kit/fesm2022/taiga-ui-kit-directives-skeleton.mjs', 'skeleton.css', null],
    ['@taiga-ui/kit/fesm2022/taiga-ui-kit-directives-fade.mjs', 'fade.css', null],
    ['@taiga-ui/layout/fesm2022/taiga-ui-layout-components-card.mjs', 'card.css', null],
    ['@taiga-ui/layout/fesm2022/taiga-ui-layout-components-surface.mjs', 'surface.css', null],
    ['@taiga-ui/layout/fesm2022/taiga-ui-layout-components-block-status.mjs', 'block-status.css', null],
    ['@taiga-ui/layout/fesm2022/taiga-ui-layout-components-navigation.mjs', 'navigation.css', 'aside[tuiNavigationAside]'],
    ['@taiga-ui/addon-table/fesm2022/taiga-ui-addon-table-components-table.mjs', 'table.css', [null, 'th[tuiTh]', 'td[tuiTd]', 'table[tuiTable]', '[tuiTable]']],
    ['@taiga-ui/addon-charts/fesm2022/taiga-ui-addon-charts-components-axes.mjs', 'axes.css', 'tui-axes'],
    ['@taiga-ui/addon-charts/fesm2022/taiga-ui-addon-charts-components-bar-chart.mjs', 'bar-chart.css', 'tui-bar-chart'],
    ['@taiga-ui/addon-charts/fesm2022/taiga-ui-addon-charts-components-line-chart.mjs', 'line-chart.css', 'tui-line-chart'],
    ['@taiga-ui/core/fesm2022/taiga-ui-core-components-slider.mjs', 'slider.css', 'input[tuislider]'],
    ['@taiga-ui/addon-charts/fesm2022/taiga-ui-addon-charts-components-pie-chart.mjs', 'pie-chart.css', 'tui-pie-chart'],
    ['@taiga-ui/addon-charts/fesm2022/taiga-ui-addon-charts-components-ring-chart.mjs', 'ring-chart.css', 'tui-ring-chart'],
    ['@taiga-ui/core/fesm2022/taiga-ui-core-components-calendar.mjs', 'calendar.css', ['tui-calendar-sheet', null, 'tui-calendar-year', 'tui-calendar']],
    ['@taiga-ui/kit/fesm2022/taiga-ui-kit-components-combo-box.mjs', 'combo-box.css', null],
    ['@taiga-ui/kit/fesm2022/taiga-ui-kit-components-multi-select.mjs', 'multi-select.css', null],
    ['@taiga-ui/kit/fesm2022/taiga-ui-kit-components-stepper.mjs', 'stepper.css', ['tui-stepper', 'tui-step']],
    ['@taiga-ui/kit/fesm2022/taiga-ui-kit-components-counter.mjs', 'counter.css', 'tui-counter'],
    ['@taiga-ui/kit/fesm2022/taiga-ui-kit-components-copy.mjs', 'copy.css', '[tuicopy]'],
    ['@taiga-ui/kit/fesm2022/taiga-ui-kit-components-rating.mjs', 'rating.css', 'tui-rating'],
    ['@taiga-ui/kit/fesm2022/taiga-ui-kit-components-filter.mjs', 'filter.css', '[tuifilter]'],
    ['@taiga-ui/kit/fesm2022/taiga-ui-kit-components-tiles.mjs', 'tiles.css', 'tui-tiles'],
    ['@taiga-ui/kit/fesm2022/taiga-ui-kit-components-timeline.mjs', 'timeline.css', 'tui-timeline'],
    ['@taiga-ui/kit/fesm2022/taiga-ui-kit-components-line-clamp.mjs', 'line-clamp.css', '[tuilineclamp]'],
    ['@taiga-ui/kit/fesm2022/taiga-ui-kit-components-badge-notification.mjs', 'badge-notification.css', '[tuibadgenotification]'],
    ['@taiga-ui/layout/fesm2022/taiga-ui-layout-components-input-search.mjs', 'input-search.css', null],
    ['@taiga-ui/layout/fesm2022/taiga-ui-layout-components-item-group.mjs', 'item-group.css', null],
    ['@taiga-ui/layout/fesm2022/taiga-ui-layout-components-block-details.mjs', 'block-details.css', null],
    ['@taiga-ui/addon-charts/fesm2022/taiga-ui-addon-charts-components-arc-chart.mjs', 'arc-chart.css', 'tui-arc-chart'],
    ['@taiga-ui/addon-charts/fesm2022/taiga-ui-addon-charts-components-legend-item.mjs', 'legend-item.css', 'tui-legend-item'],
    ['@taiga-ui/core/fesm2022/taiga-ui-core-portals-alert.mjs', 'alert.css', null],
    ['@taiga-ui/core/fesm2022/taiga-ui-core-components-notification.mjs', 'notification-host.css', '[tuinotification]'],
];

function rewriteHost(css, tag) {
    if (!tag) {
        return css;
    }

    const rewritten = css
        // :host(th) / :host(td) — голый тег означает сам компонент
        .replace(/:host\(([a-z]+)\)/g, (_m, inner) =>
            inner === tag.split('[')[0] ? tag : `${tag}${inner}`,
        )
        // :host(.foo) → tag.foo
        .replace(/:host\(([^)]*)\)/g, (_m, inner) => `${tag}${inner.trim()}`)
        // :host-context(.foo) → .foo tag
        .replace(/:host-context\(([^)]*)\)/g, (_m, inner) => `${inner.trim()} ${tag}`)
        // :host → tag
        .replace(/:host/g, tag);

    return scopeSelectors(rewritten, tag);
}

// В Angular стили компонента инкапсулированы; в fesm правила классов (`.t-content`)
// приходят без скоупа. Скоупим каждый селектор под тег компонента, чтобы классы
// не утекали глобально (например, `.t-content` ring-chart ломал текстфилды).
// Селекторы, уже содержащие тег (в т.ч. переписанные из :host-context), не трогаем.
function scopeSelectors(css, tag) {
    const skip = /^(@|:|html\b|body\b|tui-root\b|\[dir)/;

    return css.replace(/(^|\})([^{}@]+)\{/g, (match, brace, rawSelectors) => {
        const scoped = rawSelectors
            .split(',')
            .map((raw) => raw.trim())
            .filter(Boolean)
            .map((selector) => {
                if (skip.test(selector) || selector.includes(tag)) {
                    return selector;
                }

                return `${tag} ${selector}`;
            })
            .join(', ');

        return `${brace}${scoped}{`;
    });
}

function extractStyleStrings(source, tag) {
    const found = [];
    // "…" (fesm экранирует переводы строк) и `…` (шаблонные литералы)
    const patterns = [/"((?:[^"\\\n]|\\.)*)"/g, /`((?:[^`\\]|\\.)*)`/g];

    for (const re of patterns) {
        let match;

        while ((match = re.exec(source)) !== null) {
            const raw = match[1];

            if (!/data-tui-version|:host|@keyframes|^\.?tui-|^\[tui/.test(raw) || !/[{}]/.test(raw)) {
                continue;
            }

            let decoded;

            try {
                // raw — содержимое JS-строки fesm: экранирование уже валидно для JSON
                decoded = JSON.parse('"' + raw + '"');
            } catch {
                try {
                    // шаблонный литерал: интерполяции версий -> значение, снять экранирование
                    decoded = raw
                        .replace(/\$\{[^}]*\}/g, '5.22.0')
                        .replace(/\\(["\\])/g, '$1')
                        .replace(/\\n/g, '\n');
                } catch {
                    continue;
                }
            }

            const css = rewriteHost(decoded, tag);

            // обрывки шаблонных литералов fesm (например, `tui-alert-${TUI_VERSION}`)
            if (css.includes('{') && !css.includes('${') && !css.includes('`') && !found.includes(css)) {
                found.push(css);
            }
        }
    }

    return found;
}

mkdirSync(out, {recursive: true});

for (const [fesm, cssName, tag] of TARGETS) {
    const fesmPath = resolve(workspace, 'node_modules', fesm);

    if (!existsSync(fesmPath)) {
        console.warn('пропущено, нет файла:', fesm);
        continue;
    }

    const styles = extractStyleStrings(readFileSync(fesmPath, 'utf8'), Array.isArray(tag) ? null : tag);
    const header = `/* Извлечено из ${fesm} (@taiga-ui, Apache-2.0). Не редактировать вручную. */\n`;

    // массив тегов = пер-блочная перезапись :host (блоки fesm идут в порядке объявления)
    const rewritten = Array.isArray(tag)
        ? styles.map((css, index) => rewriteHost(css, tag[index] ?? null))
        : styles;

    writeFileSync(resolve(out, cssName), header + rewritten.join('\n') + '\n');
    console.log(cssName, '<-', styles.length, 'блок(ов)');
}
