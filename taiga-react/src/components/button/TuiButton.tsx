import {forwardRef, type ButtonHTMLAttributes, type CSSProperties} from 'react';

import {iconVars} from '../../utils/icons';
import {TUI_VERSION} from '../../version';

export type TuiButtonAppearance =
    | 'primary'
    | 'secondary'
    | 'secondary-destructive'
    | 'secondary-grayscale'
    | 'accent'
    | 'flat'
    | 'flat-destructive'
    | 'flat-grayscale'
    | 'grayscale'
    | 'icon'
    | 'negative'
    | 'positive'
    | 'outline'
    | 'outline-grayscale'
    | 'action'
    | 'action-grayscale';

export type TuiSize = 'xs' | 's' | 'm' | 'l' | 'xl';

type TuiButtonBaseProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'size'> & {
    appearance?: TuiButtonAppearance;
    size?: TuiSize;
    iconStart?: string;
    iconEnd?: string;
    loading?: boolean;
};

export type TuiButtonProps = TuiButtonBaseProps;

/** Кнопка — порт [tuiButton]: те же атрибуты и CSS-маски иконок, что в Angular. */
export const TuiButton = forwardRef<HTMLButtonElement, TuiButtonProps>(function TuiButton(
    {appearance = 'primary', size = 'l', iconStart, iconEnd, loading, className, style, children, ...rest},
    ref,
) {
    return (
        <button
            ref={ref}
            tuiappearance=""
            tuibutton=""
            tuiicons=""
            data-tui-version={TUI_VERSION}
            data-appearance={appearance}
            data-size={size}
            data-icon-start={iconStart ? 'tui' : undefined}
            data-icon-end={iconEnd ? 'tui' : undefined}
            className={join('tui-interactive', loading && '_loading', className)}
            style={{...iconVars({start: iconStart, end: iconEnd}), ...style} as CSSProperties}
            {...rest}
        >
            {loading ? <span className="t-loader"><span className="t-text">{children}</span></span> : children}
        </button>
    );
});

/** Иконочная кнопка — порт [tuiIconButton]. */
export const TuiIconButton = forwardRef<HTMLButtonElement, TuiButtonBaseProps>(function TuiIconButton(
    {appearance = 'secondary-grayscale', size = 's', iconStart, iconEnd, loading, className, style, children, ...rest},
    ref,
) {
    return (
        <button
            ref={ref}
            tuiappearance=""
            tuiiconbutton=""
            tuiicons=""
            data-tui-version={TUI_VERSION}
            data-appearance={appearance}
            data-size={size}
            data-icon-start={iconStart ? 'tui' : undefined}
            data-icon-end={iconEnd ? 'tui' : undefined}
            className={join('tui-interactive', loading && '_loading', className)}
            style={{...iconVars({start: iconStart, end: iconEnd}), ...style} as CSSProperties}
            {...rest}
        >
            {children}
        </button>
    );
});

export function join(...parts: Array<string | false | null | undefined>): string | undefined {
    const value = parts.filter(Boolean).join(' ');

    return value || undefined;
}
