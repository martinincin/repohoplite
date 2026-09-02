import type {HTMLAttributes} from 'react';

import {TUI_VERSION} from '../../version';

export type TuiSurfaceAppearance = 'opaque' | 'elevated' | 'overstated' | 'floating' | 'outline-grayscale';

/** Поверхность — порт [tuiSurface]. */
export function TuiSurface({
    appearance = 'opaque',
    className,
    ...rest
}: HTMLAttributes<HTMLDivElement> & {appearance?: TuiSurfaceAppearance}) {
    return (
        <div
            tuisurface=""
            data-tui-version={TUI_VERSION}
            data-appearance={appearance}
            className={className}
            {...rest}
        />
    );
}

export type TuiCardSize = 'large' | 'medium' | 'row' | 'collapsed';

/** Карточка — порт [tuiCardLarge]/[tuiCardMedium]/[tuiCardRow]. */
export function TuiCard({
    size = 'large',
    children,
    className,
    ...rest
}: HTMLAttributes<HTMLElement> & {size?: TuiCardSize}) {
    return (
        <section
            tuicardlarge={size === 'large' ? '' : undefined}
            tuicardmedium={size === 'medium' ? '' : undefined}
            tuicardrow={size === 'row' ? '' : undefined}
            tuicardcollapsed={size === 'collapsed' ? '' : undefined}
            data-tui-version={TUI_VERSION}
            className={className}
            {...rest}
        >
            {children}
        </section>
    );
}

/** Шапка страницы/блока — порт [tuiHeader]. */
export function TuiHeader({
    size = 'h2',
    children,
    className,
    ...rest
}: HTMLAttributes<HTMLElement> & {size?: '' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body-l' | 'body-m' | 'body-s'}) {
    return (
        <header
            tuiheader={size}
            data-tui-version={TUI_VERSION}
            className={className}
            {...rest}
        >
            {children}
        </header>
    );
}

export type TuiCellProps = HTMLAttributes<HTMLDivElement> & {
    size?: 's' | 'm' | 'l';
    height?: 'normal' | 'spacious' | 'compact';
};

/** Ячейка-строка — порт [tuiCell]. */
export function TuiCell({size = 'l', height = 'normal', className, ...rest}: TuiCellProps) {
    return (
        <div
            tuicell=""
            data-tui-version={TUI_VERSION}
            data-size={size}
            data-height={height}
            className={className}
            {...rest}
        />
    );
}
