// Собирает единый CSS дизайн-системы Taiga для React-порта.
// Источники:
//   1. @taiga-ui/styles — тема (токены, палитра, appearance) + 29 компонентных less-файлов.
//      Каждый компонент компилируется ОТДЕЛЬНО с обёрткой [data-tui-version='…'] —
//      ровно так же, как Angular-версия компилирует стили через tuiWithStyles:
//      изолированные единицы компиляции, :where(*&) даёт то же скоуп-правило.
//   2. src/styles/extracted/*.css — стили, которые Taiga в Angular инжектит прямо из
//      fesm-бандлов (диалоги, дропдауны, хинты, таблица и т.д.). Извлечены scripts/extract-styles.mjs.
// Итог: тот же CSS, что в Angular-приложении, — идентичный вид и анимации по построению.
import {readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {resolve, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const pkg = resolve(here, '..');
const stylesPkg = resolve(pkg, 'node_modules', '@taiga-ui', 'styles');
const extractedDir = resolve(pkg, 'src', 'styles', 'extracted');
const tmpDir = resolve(pkg, '.css-build');
const dist = resolve(pkg, 'dist');

const version = JSON.parse(readFileSync(resolve(stylesPkg, 'package.json'), 'utf8')).version;

const PACKAGE_COMPONENTS = [
    'appearance',
    'avatar',
    'badge',
    'block',
    'button',
    'checkbox',
    'chip',
    'comment',
    'compass',
    'form',
    'group',
    'header',
    'icon',
    'icons',
    'label',
    'like',
    'link',
    'list',
    'message',
    'meter',
    'notification',
    'pin',
    'progress-bar',
    'radio',
    'status',
    'switch',
    'textfield',
    'title',
    'toast',
];

const lessc = resolve(pkg, 'node_modules', '.bin', 'lessc');

function compile(lessPath, outPath, wrap) {
    const entry = resolve(tmpDir, `entry-${Math.random().toString(36).slice(2)}.less`);
    const abs = lessPath.replace(/\\/g, '/');

    writeFileSync(entry, wrap ? `${wrap} { @import '${abs}'; }` : `@import '${abs}';`);
    execFileSync(lessc, [entry, outPath], {stdio: 'pipe', cwd: pkg});
}

function compileToBuffer(lessPath, wrap) {
    const out = resolve(tmpDir, `out-${Math.random().toString(36).slice(2)}.css`);

    compile(lessPath, out, wrap);

    return readFileSync(out, 'utf8');
}

mkdirSync(tmpDir, {recursive: true});
mkdirSync(dist, {recursive: true});

const parts = [];
const header = `/* taiga-ui-react: собрано из @taiga-ui/styles@${version} и стилей fesm-бандлов @taiga-ui (Apache-2.0) */\n`;

// 1. Тема: токены, палитра, appearance-примеси
parts.push(compileToBuffer(resolve(stylesPkg, 'taiga-ui-theme.less'), null));

// 2. Компонентные стили — по одному, как в tuiWithStyles
for (const name of PACKAGE_COMPONENTS) {
    parts.push(compileToBuffer(resolve(stylesPkg, 'components', `${name}.less`), `[data-tui-version='${version}']`));
}

// 3. Стили, извлечённые из fesm-бандлов
if (existsSync(extractedDir)) {
    for (const name of readdirSync(extractedDir).filter((n) => n.endsWith('.css'))) {
        parts.push(readFileSync(resolve(extractedDir, name), 'utf8'));
    }
}

// 4. Дополнения порта (backdrop диалога, хост уведомлений) — там, где Angular
//    рисует императивно, а статических стилей в пакетах нет
const portDir = resolve(pkg, 'src', 'styles', 'port');

if (existsSync(portDir)) {
    for (const name of readdirSync(portDir).filter((n) => n.endsWith('.css'))) {
        parts.push(readFileSync(resolve(portDir, name), 'utf8'));
    }
}

writeFileSync(resolve(dist, 'taiga-ui.css'), header + parts.join('\n'));

// 5. Шрифты — отдельным файлом: @import url(...) грузится в рантайме
const fontsOut = resolve(dist, 'taiga-ui-fonts.css');
const fontsTmpOut = resolve(tmpDir, 'fonts.css');

compile(resolve(stylesPkg, 'taiga-ui-fonts.less'), fontsTmpOut, null);
writeFileSync(fontsOut, readFileSync(fontsTmpOut, 'utf8'));

execFileSync('rm', ['-rf', tmpDir]);

console.log(`dist/taiga-ui.css + dist/taiga-ui-fonts.css (токены @taiga-ui/styles@${version})`);
