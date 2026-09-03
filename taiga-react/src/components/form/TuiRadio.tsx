import type {CSSProperties, HTMLAttributes, InputHTMLAttributes, ReactNode} from 'react';

import {iconVars} from '../../utils/icons';
import {TUI_VERSION} from '../../version';
import {join} from '../button/TuiButton';

export type TuiRadioProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> & {
    size?: 's' | 'm';
};

/** Радио — порт [tuiRadio]: та же маска галочки через --t-icon-start. */
export function TuiRadio({size = 'm', checked, className, style, ...rest}: TuiRadioProps) {
    return (
        <input
            type="radio"
            tuiradio=""
            tuiappearance=""
            tuiicons=""
            data-tui-version={TUI_VERSION}
            data-appearance="secondary"
            data-size={size}
            data-mode={checked ? 'checked' : undefined}
            checked={!!checked}
            className={join('tui-interactive', className)}
            style={{...iconVars({start: '@tui.check'}), ...style} as CSSProperties}
            {...rest}
        />
    );
}

export type TuiChipProps = HTMLAttributes<HTMLDivElement> & {
    appearance?: string;
    size?: 'xs' | 's' | 'm';
    iconStart?: string;
    iconEnd?: string;
    children?: ReactNode;
};

/** Чип — порт [tuiChip]. */
export function TuiChip({appearance, size = 'm', iconStart, iconEnd, className, style, children, ...rest}: TuiChipProps) {
    return (
        <div
            tuichip=""
            tuiappearance=""
            tuiicons=""
            data-tui-version={TUI_VERSION}
            data-appearance={appearance}
            data-size={size}
            data-icon-start={iconStart ? 'tui' : undefined}
            data-icon-end={iconEnd ? 'tui' : undefined}
            className={join('tui-interactive', className)}
            style={{...iconVars({start: iconStart, end: iconEnd}), ...style} as CSSProperties}
            {...rest}
        >
            {children}
        </div>
    );
}
