import {useId, type CSSProperties, type InputHTMLAttributes} from 'react';

import {tuiIconUrl} from '../../utils/icons';
import {TUI_VERSION} from '../../version';
import {TuiInput, TuiTextfield} from '../textfield/TuiTextfield';

export type TuiInputNumberProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'value' | 'onChange'> & {
    value?: number | null;
    onValueChange?: (value: number | null) => void;
    min?: number;
    max?: number;
    step?: number;
    size?: 's' | 'm' | 'l';
    placeholder?: string;
};

/** Числовое поле со степперами — порт tui-input-number. */
export function TuiInputNumber({
    value,
    onValueChange,
    min,
    max,
    step = 1,
    size = 'l',
    placeholder,
    disabled,
    ...rest
}: TuiInputNumberProps) {
    const inputId = useId();

    return (
        <TuiTextfield size={size}>
            <TuiInput
                id={inputId}
                type="number"
                inputMode="decimal"
                placeholder={placeholder}
                disabled={disabled}
                value={value ?? ''}
                min={min}
                max={max}
                step={step}
                onInput={(event) => {
                    const raw = (event.target as HTMLInputElement).value;

                    onValueChange?.(raw === '' ? null : Number(raw));
                }}
                {...rest}
            />
            <span className="t-content">
                <span className="t-steppers">
                    <button
                        tuiappearance=""
                        tuiiconbutton=""
                        tuiicons=""
                        data-tui-version={TUI_VERSION}
                        data-appearance="icon"
                        data-size="xs"
                        type="button"
                        tabIndex={-1}
                        disabled={disabled || (max !== undefined && value != null && value >= max)}
                        onClick={() => onValueChange?.(clamp((value ?? 0) + step, min, max))}
                        aria-label="Увеличить"
                    >
                        Увеличить
                        <tui-icon tuiicons="" style={{'--t-icon': `url(${tuiIconUrl('@tui.chevron-up')})`} as CSSProperties} />
                    </button>
                    <button
                        tuiappearance=""
                        tuiiconbutton=""
                        tuiicons=""
                        data-tui-version={TUI_VERSION}
                        data-appearance="icon"
                        data-size="xs"
                        type="button"
                        tabIndex={-1}
                        disabled={disabled || (min !== undefined && value != null && value <= min)}
                        onClick={() => onValueChange?.(clamp((value ?? 0) - step, min, max))}
                    >
                        Уменьшить
                        <tui-icon tuiicons="" style={{'--t-icon': `url(${tuiIconUrl('@tui.chevron-down')})`} as CSSProperties} />
                    </button>
                </span>
            </span>
        </TuiTextfield>
    );
}

function clamp(next: number, min?: number, max?: number): number {
    let value = next;

    if (min !== undefined) {
        value = Math.max(min, value);
    }

    if (max !== undefined) {
        value = Math.min(max, value);
    }

    return value;
}
