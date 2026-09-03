// Дамп исходников Taiga из sourcemap fesm-бандлов корневого Angular-проекта —
// используется при портировании компонентов (DOM-структура и логика).
import {readFileSync} from 'node:fs';
import {resolve, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const workspace = resolve(here, '..', '..');

const [, , fesm, pattern, maxLenArg] = process.argv;
const maxLen = Number(maxLenArg) || 4000;

if (!fesm || !pattern) {
    console.error('usage: node dump-sources.mjs <fesm-path-from-node_modules> <source-regex> [maxLen]');
    process.exit(1);
}

const map = JSON.parse(readFileSync(resolve(workspace, 'node_modules', `${fesm}.map`), 'utf8'));
const re = new RegExp(pattern);

map.sources.forEach((source, index) => {
    if (re.test(source) && map.sourcesContent[index]) {
        const content = map.sourcesContent[index];

        console.log(`##### SOURCE: ${source}`);
        console.log(
            content.length > maxLen ? `${content.slice(0, maxLen)}\n...[len=${content.length}]` : content,
        );
    }
});
