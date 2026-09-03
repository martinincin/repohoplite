import type {AnchorHTMLAttributes, ButtonHTMLAttributes, HTMLAttributes, ReactNode} from 'react';

import {iconVars} from '../../utils/icons';
import {TUI_VERSION} from '../../version';
import {join} from '../button/TuiButton';

/**
 * Навигационный шелл — порт @taiga-ui/layout/navigation: тёмный сайдбар
 * (aside[tuiNavigationAside]), шапка (header[tuiNavigationHeader]) и контент
 * (main[tuiNavigationMain]) с той же разметкой и стилями, что в Angular.
 */

export type TuiNavigationAsideProps = HTMLAttributes<HTMLElement> & {
    /** Развёрнут ли сайдбар (иконочный рельс при false). */
    expanded?: boolean;
    children?: ReactNode;
};

export function TuiNavigationAside({expanded = true, children, ...rest}: TuiNavigationAsideProps) {
    return (
        <aside tuinavigationaside="" data-tui-version={TUI_VERSION} className={join(expanded && '_expanded')} {...rest}>
            {children}
        </aside>
    );
}

export type TuiNavigationHeaderProps = HTMLAttributes<HTMLElement> & {children?: ReactNode};

export function TuiNavigationHeader({children, ...rest}: TuiNavigationHeaderProps) {
    return (
        <header tuinavigationheader="" data-tui-version={TUI_VERSION} {...rest}>
            {children}
        </header>
    );
}

export type TuiNavigationMainProps = HTMLAttributes<HTMLElement> & {children?: ReactNode};

export function TuiNavigationMain({children, ...rest}: TuiNavigationMainProps) {
    return (
        <main tuinavigationmain="" data-tui-version={TUI_VERSION} {...rest}>
            {children}
        </main>
    );
}

export type TuiNavigationNavProps = HTMLAttributes<HTMLElement> & {children?: ReactNode};

export function TuiNavigationNav({children, ...rest}: TuiNavigationNavProps) {
    return (
        <nav tuinavigationnav="" data-tui-version={TUI_VERSION} {...rest}>
            {children}
        </nav>
    );
}

export type TuiNavigationLogoProps = HTMLAttributes<HTMLElement> & {children?: ReactNode};

export function TuiNavigationLogo({children, ...rest}: TuiNavigationLogoProps) {
    return (
        <span tuinavigationlogo="" data-tui-version={TUI_VERSION} {...rest}>
            {children}
        </span>
    );
}

export type TuiNavigationSegmentsProps = HTMLAttributes<HTMLElement> & {children?: ReactNode};

export function TuiNavigationSegments({children, ...rest}: TuiNavigationSegmentsProps) {
    return (
        <span tuinavigationsegments="" {...rest}>
            {children}
        </span>
    );
}

type TuiAsideItemBase = {
    iconStart?: string;
    iconEnd?: string;
    /** Подсказка при свёрнутом сайдбаре (tuiHintAside). */
    hint?: string;
    children?: ReactNode;
};

export type TuiAsideItemLinkProps = TuiAsideItemBase &
    Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className'> & {className?: string};

/** Пункт сайдбара-ссылка — порт [tuiAsideItem]. */
export function TuiAsideItemLink({iconStart, iconEnd, children, className, style, ...rest}: TuiAsideItemLinkProps) {
    return (
        <a
            tuiasideitem=""
            tuiappearance=""
            tuibutton=""
            tuiicons=""
            data-tui-version={TUI_VERSION}
            data-appearance="flat-grayscale"
            data-size="s"
            data-icon-start={iconStart ? 'tui' : undefined}
            data-icon-end={iconEnd ? 'tui' : undefined}
            className={join('tui-interactive', className)}
            style={{...iconVars({start: iconStart, end: iconEnd}), ...style} as React.CSSProperties}
            {...rest}
        >
            {children}
        </a>
    );
}

export type TuiAsideItemButtonProps = TuiAsideItemBase &
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> & {className?: string};

/** Пункт сайдбара-кнопка — порт [tuiAsideItem]. */
export function TuiAsideItemButton({iconStart, iconEnd, children, className, style, ...rest}: TuiAsideItemButtonProps) {
    return (
        <button
            tuiasideitem=""
            tuiappearance=""
            tuibutton=""
            tuiicons=""
            data-tui-version={TUI_VERSION}
            data-appearance="flat-grayscale"
            data-size="s"
            data-icon-start={iconStart ? 'tui' : undefined}
            data-icon-end={iconEnd ? 'tui' : undefined}
            className={join('tui-interactive', className)}
            style={{...iconVars({start: iconStart, end: iconEnd}), ...style} as React.CSSProperties}
            {...rest}
        >
            {children}
        </button>
    );
}

export type TuiFadeProps = HTMLAttributes<HTMLElement> & {
    direction?: 'horizontal' | 'vertical';
    children?: ReactNode;
};

/** Затухание текста — порт [tuiFade]. */
export function TuiFade({direction = 'horizontal', children, ...rest}: TuiFadeProps) {
    return (
        <span tuifade={direction} data-tui-version={TUI_VERSION} {...rest}>
            {children}
        </span>
    );
}
