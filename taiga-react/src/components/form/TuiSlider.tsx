import {useState, type InputHTMLAttributes} from 'react';

import {TUI_VERSION} from '../../version';
import {join} from '../button/TuiButton';

export type TuiSliderProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> & {
    /** Значение (контролируемо). */
    value?: number;
    onValueChange?: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    /** Ключевые точки (сегменты) для градиента делений, как segments в Angular. */
    segments?: number | readonly number[];
};

/**
 * Слайдер — порт input[type=range][tuiSlider]: заливка трека через
 * --tui-slider-fill-ratio (в WebKit нет нативной заливки, как и в Angular-версии).
 */
export function TuiSlider({
    value,
    onValueChange,
    min = 0,
    max = 100,
    step,
    segments,
    className,
    ...rest
}: TuiSliderProps) {
    const [internal, setInternal] = useState(min);
    const current = value ?? internal;
    const ratio = max > min ? (current - min) / (max - min) : 0;

    return (
        <input
            type="range"
            tuislider=""
            data-tui-version={TUI_VERSION}
            className={join(className)}
            style={{'--tui-slider-fill-ratio': String(ratio)} as React.CSSProperties}
            min={min}
            max={max}
            step={step}
            value={current}
            onInput={(event) => {
                const next = Number(event.currentTarget.value);

                setInternal(next);
                onValueChange?.(next);
            }}
            {...rest}
        />
    );
}
