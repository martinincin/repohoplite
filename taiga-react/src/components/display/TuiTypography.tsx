import type {AnchorHTMLAttributes, HTMLAttributes, ReactNode} from 'react';

import {TUI_VERSION} from '../../version';
import {join} from '../button/TuiButton';

export type TuiSizeS = 's' | 'm' | 'l';

/** Заголовок — порт [tuiTitle] (h1–h6 или произвольный контейнер). */
export function TuiTitle({
    level = 'h2',
    children,
    className,
    ...rest
}: HTMLAttributes<HTMLHeadingElement> & {level?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div'}) {
    const Tag = level;

    return (
        <Tag tuititle="" data-tui-version={TUI_VERSION} className={className} {...rest}>
            {children}
        </Tag>
    );
}

/** Подзаголовок — порт [tuiSubtitle], вкладывается в TuiTitle. */
export function TuiSubtitle({children, className, ...rest}: HTMLAttributes<HTMLSpanElement>) {
    return (
        <span tuisubtitle="" className={className} {...rest}>
            {children}
        </span>
    );
}

export type TuiLabelProps = HTMLAttributes<HTMLLabelElement> & {
    forId?: string;
};

/** Лейбл поля — порт [tuiLabel]. */
export function TuiLabel({forId, children, className, ...rest}: TuiLabelProps) {
    return (
        <label tuilabel="" data-tui-version={TUI_VERSION} htmlFor={forId} className={className} {...rest}>
            {children}
        </label>
    );
}

export type TuiLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
    appearance?: string;
    iconStart?: string;
    iconEnd?: string;
};

/** Ссылка — порт [tuiLink]. */
export function TuiLink({appearance = 'action', children, className, ...rest}: TuiLinkProps) {
    return (
        <a
            tuilink=""
            tuiappearance=""
            data-tui-version={TUI_VERSION}
            data-appearance={appearance}
            className={join('tui-interactive', className)}
            {...rest}
        >
            {children}
        </a>
    );
}

/** Ошибка валидации — порт tui-error. */
export function TuiError({children}: {children?: ReactNode}) {
    return children ? <tui-error data-tui-version={TUI_VERSION}>{children}</tui-error> : null;
}

/** Лоадер — порт tui-loader. */
export function TuiLoader({size = '1.5rem', className}: {size?: string; className?: string}) {
    return <tui-loader data-tui-version={TUI_VERSION} style={{fontSize: size}} className={className} />;
}
