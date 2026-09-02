// Копирует иконки Taiga в публичную папку demo — так же, как это делает
// ng-add в Angular-проектах (assets/taiga-ui/icons).
import {cpSync, mkdirSync, existsSync, rmSync} from 'node:fs';
import {resolve, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const demo = resolve(here, '..');
const lib = resolve(demo, '..');
const from = resolve(lib, 'node_modules', '@taiga-ui', 'icons', 'src');
const to = resolve(demo, 'public', 'assets', 'taiga-ui', 'icons');

if (!existsSync(from)) {
    console.error('Нет источника иконок:', from);
    process.exit(1);
}

rmSync(to, {recursive: true, force: true});
mkdirSync(to, {recursive: true});
cpSync(from, to, {recursive: true});

console.log('Иконки скопированы в', to);
