import type {CSSProperties, HTMLAttributes, ReactNode} from 'react';

import {TUI_VERSION} from '../../version';

/**
 * Оси графика — порт tui-axes: подписи Y слева, сетка из линий,
 * контент (графики) в .t-wrapper.
 */
export function TuiAxes({
    axisYLabels,
    axisXLabels,
    horizontalLines = 3,
    verticalLines = 0,
  axisYInset,
    className,
    children,
    ...rest
}: HTMLAttributes<HTMLElement> & {
    axisYLabels?: readonly string[];
    axisXLabels?: readonly string[];
    horizontalLines?: number;
    verticalLines?: number;
    axisYInset?: boolean;
    children?: ReactNode;
}) {
    return (
        <tui-axes
            data-tui-version={TUI_VERSION}
            className={className}
            style={
                {
                    '--t-columns': axisXLabels?.length ?? 0,
                    '--t-rows': horizontalLines + 1,
                } as CSSProperties
            }
            {...rest}
        >
            <div className="t-side">
                {axisYLabels && !axisYInset ? (
                    <div className="t-labels-y t-labels-y_primary">
                        {axisYLabels.map((label, index) => (
                            <div key={index} className="t-label-y">
                                {label}
                            </div>
                        ))}
                    </div>
                ) : null}
            </div>
            <div className="t-wrapper">
                {Array.from({length: horizontalLines + 1}, (_, index) => (
                    <div key={index} className="t-line-y" />
                ))}
                {Array.from({length: verticalLines}, (_, index) => (
                    <div key={index} className="t-line-x" />
                ))}
                {children}
                {axisXLabels ? (
                    <div className="t-labels-x">
                        {axisXLabels.map((label, index) => (
                            <div key={index} className="t-label-x">
                                {label}
                            </div>
                        ))}
                    </div>
                ) : null}
            </div>
        </tui-axes>
    );
}

export type TuiBarChartProps = HTMLAttributes<HTMLElement> & {
    /** Значения: массив колонок, каждая — массив сегментов (стек). */
    value: ReadonlyArray<readonly number[]>;
    max?: number;
    size?: 's' | 'm' | 'l';
    /** Складывать сегменты в одну колонку. */
    collapsed?: boolean;
};

/** Столбчатый график — порт tui-bar-chart (колонки .t-wrapper + tui-bar). */
export function TuiBarChart({value, max, size = 'm', collapsed = false, className, ...rest}: TuiBarChartProps) {
    const computedMax =
        max || value.reduce((result, next) => Math.max(result, ...next), 0) || 1;
    // транспонируем как в Angular: колонки -> ряды сегментов
    const transposed = value.reduce<ReadonlyArray<readonly number[]>>(
        (result, next) => next.map((_, index) => [...(result[index] || []), next[index] || 0]),
        [],
    );

    return (
        <tui-bar-chart
            data-tui-version={TUI_VERSION}
            data-size={size}
            className={className}
            {...rest}
        >
            {transposed.map((set, setIndex) => (
                <div key={setIndex} className="t-wrapper">
                    {set.map((item, index) => (
                        <tui-bar
                            key={index}
                            className="t-bar"
                            style={
                                {
                                    height: `${(Math.abs(item) / computedMax) * 100}%`,
                                    background: collapsed
                                        ? undefined
                                        : `var(--tui-chart-categorical-${String(index).padStart(2, '0')})`,
                                } as CSSProperties
                            }
                        />
                    ))}
                </div>
            ))}
        </tui-bar-chart>
    );
}

export type TuiLineChartProps = HTMLAttributes<HTMLElement> & {
    /** Точки [x, y] в координатах viewBox. */
    value: ReadonlyArray<readonly [number, number]>;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    smoothingFactor?: number;
    dots?: boolean;
    filled?: boolean;
};

/** Линейный график — порт tui-line-chart (SVG-путь + градиентная заливка + точки). */
export function TuiLineChart({
    value,
    x = 0,
    y = 0,
    width = 0,
    height = 0,
    smoothingFactor = 0,
    dots = false,
    filled = true,
    className,
    ...rest
}: TuiLineChartProps) {
    const d = buildPath(value, smoothingFactor);
    const fillD = value.length ? `${d}V ${y} H ${value[0]?.[0]} V ${value[0]?.[1]}` : d;
    const fillId = `tui-line-fill-${Math.random().toString(36).slice(2, 8)}`;

    return (
        <tui-line-chart data-tui-version={TUI_VERSION} className={className} {...rest}>
            <svg
                focusable="false"
                height="100%"
                width="100%"
                preserveAspectRatio="none"
                viewBox={`${x} ${y} ${width} ${height}`}
                className="t-svg"
            >
                <defs>
                    <linearGradient id={fillId} x1="0" x2="0" y1="1" y2="0">
                        <stop offset="0%" stopColor="currentColor" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                    </linearGradient>
                </defs>
                {filled ? <path stroke="none" d={fillD} fill={`url(#${fillId})`} /> : null}
                <path
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    vectorEffect="non-scaling-stroke"
                    d={d}
                />
            </svg>
            {dots
                ? value.map(([pointX, pointY], index) => (
                      <div
                          key={index}
                          className="t-dot"
                          style={
                              {
                                  insetBlockEnd: `${(pointY / (y + height || 1)) * 100}%`,
                                  insetInlineStart: `${(pointX / (x + width || 1)) * 100}%`,
                              } as CSSProperties
                          }
                      />
                  ))
                : null}
        </tui-line-chart>
    );
}

/** Путь через точки со сглаживанием — эквивалент tuiDraw из @taiga-ui/addon-charts. */
function buildPath(points: ReadonlyArray<readonly [number, number]>, smoothing: number): string {
    return points.reduce((path, point, index) => {
        if (!index) {
            return `M ${point[0]} ${point[1]}`;
        }

        const previous = points[index - 1];
        const [prevX, prevY] = previous;
        const [x, y] = point;
        const controlX = prevX + (x - prevX) * (1 - smoothing);
        const curve = smoothing ? `Q ${controlX} ${prevY} ${x} ${y}` : `L ${x} ${y}`;

        return `${path} ${curve}`;
    }, '');
}
