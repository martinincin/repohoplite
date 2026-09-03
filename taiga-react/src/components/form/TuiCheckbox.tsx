import type {CSSProperties, InputHTMLAttributes} from 'react';

import {iconVars} from '../../utils/icons';
import {TUI_VERSION} from '../../version';
import {join} from '../button/TuiButton';

export type TuiCheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> & {
    size?: 's' | 'm';
    indeterminate?: boolean;
    onCheckedChange?: (checked: boolean) => void;
};

/** Чекбокс — порт [tuiCheckbox]: маска галочки через --t-icon-start. */
export function TuiCheckbox({
    size = 'm',
    checked,
    indeterminate,
    onCheckedChange,
    className,
    style,
    ...rest
}: TuiCheckboxProps) {
    const mode = indeterminate ? 'indeterminate' : checked ? 'checked' : undefined;

    return (
        <input
            type="checkbox"
            tuicheckbox=""
            tuiappearance=""
            tuiicons=""
            data-tui-version={TUI_VERSION}
            data-appearance="secondary"
            data-size={size}
            data-mode={mode}
            checked={!!checked}
            className={join('tui-interactive', className)}
            style={{...iconVars({start: '@tui.check'}), ...style} as CSSProperties}
            onChange={(event) => onCheckedChange?.(event.currentTarget.checked)}
            {...rest}
        />
    );
}

/** Переключатель — порт [tuiSwitch]. */
export function TuiSwitch({
    size = 'm',
    checked,
    onCheckedChange,
    className,
    style,
    ...rest
}: TuiCheckboxProps) {
    return (
        <input
            type="checkbox"
            tuiswitch=""
            tuiappearance=""
            tuiicons=""
            data-tui-version={TUI_VERSION}
            data-appearance="secondary"
            data-size={size}
            data-mode={checked ? 'checked' : undefined}
            checked={!!checked}
            className={join('tui-interactive', className)}
            style={style}
            onChange={(event) => onCheckedChange?.(event.currentTarget.checked)}
            {...rest}
        />
    );
}
