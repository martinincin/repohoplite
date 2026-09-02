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
    ['@taiga-ui/kit/fesm2022/taiga-ui-kit-components-segmented.mjs', 'segmented.css', null],
    ['@taiga-ui/layout/fesm2022/taiga-ui-layout-components-card.mjs', 'card.css', null],
    ['@taiga-ui/layout/fesm2022/taiga-ui-layout-components-surface.mjs', 'surface.css', null],
    ['@taiga-ui/addon-table/fesm2022/taiga-ui-addon-table-components-table.mjs', 'table.css', null],
    ['@taiga-ui/core/fesm2022/taiga-ui-core-portals-alert.mjs', 'alert.css', null],
    ['@taiga-ui/core/fesm2022/taiga-ui-core-components-notification.mjs', 'notification-host.css', null],
];

function rewriteHost(css, tag) {
    if (!tag) {
        return css;
    }

    return (
        css
            // :host(.foo) → tag.foo
            .replace(/:host\(([^)]*)\)/g, (_m, inner) => `${tag}${inner.trim()}`)
            // :host-context(.foo) → .foo tag
            .replace(/:host-context\(([^)]*)\)/g, (_m, inner) => `${inner.trim()} ${tag}`)
            // :host → tag
            .replace(/:host/g, tag)
    );
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

    const styles = extractStyleStrings(readFileSync(fesmPath, 'utf8'), tag);
    const header = `/* Извлечено из ${fesm} (@taiga-ui, Apache-2.0). Не редактировать вручную. */\n`;

    writeFileSync(resolve(out, cssName), header + styles.join('\n') + '\n');
    console.log(cssName, '<-', styles.length, 'блок(ов)');
}
