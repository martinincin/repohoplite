import type {CSSProperties, HTMLAttributes} from 'react';

import {TUI_VERSION} from '../../version';

/** Прогресс-бар — порт [tuiProgressBar] на нативном <progress>. */
export function TuiProgressBar({
    value = 0,
    max = 100,
    color,
    className,
    ...rest
}: HTMLAttributes<HTMLProgressElement> & {value?: number; max?: number; color?: string}) {
    return (
        <progress
            max={max}
            tuiprogressbar=""
            data-tui-version={TUI_VERSION}
            value={value}
            className={className}
            style={{...(color && {'--tui-progress-color': color})} as CSSProperties}
            {...rest}
        />
    );
}
