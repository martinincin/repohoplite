// Разрешение имён иконок Taiga («@tui.chevron-down») в URL SVG-файла.
// Иконки кладутся в публичную папку проекта (см. README: копирование из
// node_modules/@taiga-ui/icons/src). Базовый путь настраивается.
let base = '/assets/taiga-ui/icons/';

export function setTuiIconsBase(url: string): void {
    base = url;
}

export function tuiIconUrl(icon: string): string {
    return icon.startsWith('@tui.') ? `${base}${icon.slice('@tui.'.length)}.svg` : icon;
}

type IconVars = Record<`--t-icon-${'start' | 'end'}` | '--t-icon', string>;

export function iconVars(
    icons: {start?: string | null; end?: string | null; icon?: string | null},
): IconVars {
    const vars: Record<string, string> = {};

    if (icons.start) {
        vars['--t-icon-start'] = `url(${tuiIconUrl(icons.start)})`;
    }

    if (icons.end) {
        vars['--t-icon-end'] = `url(${tuiIconUrl(icons.end)})`;
    }

    if (icons.icon) {
        vars['--t-icon'] = `url(${tuiIconUrl(icons.icon)})`;
    }

    return vars as IconVars;
}
