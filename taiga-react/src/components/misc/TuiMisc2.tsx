import type {CSSProperties, HTMLAttributes, ReactNode} from 'react';

import {TUI_VERSION} from '../../version';

/** Фильтр-чипы — порт [tuiFilter]: ряд переключаемых чип-блоков. */
export function TuiFilter({
    items,
    value = [],
    onValueChange,
    size = 's',
    className,
    ...rest
}: Omit<HTMLAttributes<HTMLElement>, 'onChange'> & {
    items: readonly string[];
    value?: readonly string[];
    onValueChange?: (value: readonly string[]) => void;
    size?: 's' | 'm' | 'l';
}) {
    const toggle = (item: string) => {
        onValueChange?.(
            value.includes(item) ? value.filter((v) => v !== item) : [...value, item],
        );
    };

    return (
        <div tuifilter="" data-tui-version={TUI_VERSION} data-size={size} className={className} {...rest}>
            {items.map((item) => {
                const checked = value.includes(item);

                return (
                    <label key={item} className="t-item" tuiblock="" data-size={size} data-state={checked ? 'active' : undefined}>
                        <input type="checkbox" checked={checked} onChange={() => toggle(item)} />
                        <span className="t-text">{item}</span>
                    </label>
                );
            })}
        </div>
    );
}

/** Тайлы — порт tui-tiles: сетка ячеек-плиток. */
export function TuiTiles({
    columns = 3,
    children,
    className,
    ...rest
}: HTMLAttributes<HTMLElement> & {columns?: number; children?: ReactNode}) {
    return (
        <tui-tiles
            data-tui-version={TUI_VERSION}
            className={className}
            style={{'--t-columns': columns} as CSSProperties}
            {...rest}
        >
            {children}
        </tui-tiles>
    );
}

export function TuiTile({children, className, ...rest}: HTMLAttributes<HTMLElement>) {
    return (
        <tui-tile data-tui-version={TUI_VERSION} className={className} {...rest}>
            <div className="t-wrapper">{children}</div>
        </tui-tile>
    );
}

/** Таймлайн — порт tui-timeline: вертикальная/горизонтальная шкала событий. */
export function TuiTimeline({
    orientation = 'vertical',
    children,
    className,
    ...rest
}: HTMLAttributes<HTMLElement> & {orientation?: 'vertical' | 'horizontal'}) {
    return (
        <tui-timeline
            data-tui-version={TUI_VERSION}
            data-orientation={orientation}
            className={className}
            {...rest}
        >
            {children}
        </tui-timeline>
    );
}

export function TuiTimelineItem({
    width = 1,
    children,
    className,
    ...rest
}: HTMLAttributes<HTMLElement> & {width?: number}) {
    return (
        <tui-timeline-item
            data-tui-version={TUI_VERSION}
            className={className}
            style={{'--t-width': width} as CSSProperties}
            {...rest}
        >
            {children}
        </tui-timeline-item>
    );
}

/** Arc-чарт — порт tui-arc-chart: дуга-спидометр сегментами. */
export function TuiArcChart({
    value,
    max = 100,
    size = 'm',
    className,
    ...rest
}: HTMLAttributes<HTMLElement> & {
    value: readonly number[];
    max?: number;
    size?: 's' | 'm' | 'l';
}) {
    const total = value.reduce((sum, item) => sum + item, 0) || 1;
    // дуга 180°: сегменты как stroke-dasharray на полуокружности
    const radius = 100;
    const circumference = Math.PI * radius;

    let offset = 0;
    const segments = value.map((item, index) => {
        const length = (item / Math.max(total, max)) * circumference;
        const dash = `${length} ${circumference - length}`;
        const segment = {dash, offset, color: `var(--tui-chart-categorical-${String(index).padStart(2, '0')})`};

        offset += length;

        return segment;
    });

    return (
        <tui-arc-chart data-tui-version={TUI_VERSION} data-size={size} className={className} {...rest}>
            <svg focusable="false" height="100%" viewBox="0 0 200 100" width="100%">
                {segments.map((segment, index) => (
                    <circle
                        key={index}
                        cx="100"
                        cy="100"
                        r={radius}
                        fill="none"
                        stroke={segment.color}
                        strokeWidth="16"
                        strokeDasharray={segment.dash}
                        strokeDashoffset={-segment.offset}
                        transform="rotate(180 100 100)"
                    />
                ))}
            </svg>
        </tui-arc-chart>
    );
}

/** Список — порт [tuiList]: вертикальный список строк. */
export function TuiList({
    orientation = 'vertical',
    children,
    className,
    ...rest
}: HTMLAttributes<HTMLElement> & {orientation?: 'vertical' | 'horizontal'}) {
    return (
        <div tuilist="" data-orientation={orientation} className={className} {...rest}>
            {children}
        </div>
    );
}

/** Группа ячеек — порт [tuiItemGroup]. */
export function TuiItemGroup({children, className, ...rest}: HTMLAttributes<HTMLDivElement>) {
    return (
        <div tuitemgroup="" data-tui-version={TUI_VERSION} className={className} {...rest}>
            {children}
        </div>
    );
}

/** Форма — порт [tuiForm]: вертикальная раскладка полей карточкой. */
export function TuiForm({
    size = 'm',
    appearance = 'floating',
    children,
    className,
    ...rest
}: HTMLAttributes<HTMLFormElement> & {
    size?: 's' | 'm' | 'l';
    appearance?: 'floating' | 'outline' | 'opaque';
}) {
    return (
        <form
            tuiform=""
            tuicardlarge=""
            tuiappearance=""
          data-appearance={appearance}
            data-size={size}
            data-tui-version={TUI_VERSION}
            className={className}
            {...rest}
        >
            {children}
        </form>
    );
}

/** Блок деталей — порт [tuiBlockDetails]: контейнер с якорем-подписью. */
export function TuiBlockDetails({children, className, ...rest}: HTMLAttributes<HTMLDivElement>) {
    return (
        <div tuiblockdetails="" data-tui-version={TUI_VERSION} className={className} {...rest}>
            {children}
        </div>
    );
}
