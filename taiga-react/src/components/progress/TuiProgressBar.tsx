import type {CSSProperties, HTMLAttributes} from 'react';

/** Прогресс-бар — порт [tuiProgressBar] на нативном <progress> (как в Angular). */
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
            value={value}
            className={className}
            style={{...(color && {'--tui-progress-color': color})} as CSSProperties}
            {...rest}
        />
    );
}
