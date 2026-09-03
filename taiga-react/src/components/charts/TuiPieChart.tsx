import type {CSSProperties, HTMLAttributes, ReactNode} from 'react';

import {TUI_VERSION} from '../../version';

const RADII: Readonly<Record<string, string>> = {
    xs: '50',
    s: '50',
    m: '77.8',
    l: '81.9',
    xl: '81.3',
};

export type TuiPieChartProps = Omit<HTMLAttributes<HTMLElement>, 'children'> & {
    value: readonly number[];
    size?: 'xs' | 's' | 'm' | 'l' | 'xl';
    /** Кольцо (маска по радиусу) — режим tui-ring-chart. */
    masked?: boolean;
    children?: ReactNode;
};

/**
 * Круговая диаграмма — порт tui-pie-chart: SVG viewBox -100..100,
 * сегменты-дуги с категориальными цветами, маска для кольца.
 */
export function TuiPieChart({
    value,
    size = 'm',
    masked = false,
    className,
    children,
    ...rest
}: TuiPieChartProps) {
    const sum = value.reduce((total, item) => total + item, 0);
    const maskId = `tui-pie-mask-${Math.random().toString(36).slice(2, 8)}`;
    const radius = RADII[size] ?? RADII.m;

    // накопительные углы сегментов, как getDeg/segments в Angular
    const segments = value.map((initial, index) => {
        const before = value.reduce((acc, current, j) => (j < index ? acc + deg(current, sum) : acc), 0);

        return [before, before + deg(initial, sum)] as const;
    });

    return (
        <tui-pie-chart
            data-tui-version={TUI_VERSION}
            data-size={size}
            className={className}
            {...rest}
        >
            <svg focusable="false" height="100%" viewBox="-100 -100 200 200" width="100%" className="t-svg">
                {masked ? (
                    <defs>
                        <mask id={maskId}>
                            <rect fill="white" height="400" width="400" x="-200" y="-200" />
                            <circle cx="0" cy="0" r={radius} />
                        </mask>
                    </defs>
                ) : null}
                <g style={{mask: masked ? `url(#${maskId})` : undefined} as CSSProperties}>
                    <circle cx="0" cy="0" r="100" className="t-placeholder" />
                    {segments.map(([start, end], index) => (
                        <path
                            key={index}
                            className="t-segment"
                            fill="currentColor"
                            style={{color: `var(--tui-chart-categorical-${String(index).padStart(2, '0')})`}}
                            d={piePath(start, end)}
                        />
                    ))}
                </g>
            </svg>
            {children}
        </tui-pie-chart>
    );
}

export type TuiRingChartProps = Omit<HTMLAttributes<HTMLElement>, 'children'> & {
    value: readonly number[];
    size?: 'xs' | 's' | 'm' | 'l' | 'xl';
    /** Содержимое в центре кольца. */
    children?: ReactNode;
};

/** Кольцевая диаграмма — порт tui-ring-chart: pie с маской + контент в центре. */
export function TuiRingChart({value, size = 'm', className, children, ...rest}: TuiRingChartProps) {
    return (
        <tui-ring-chart
            data-tui-version={TUI_VERSION}
            data-size={size}
            className={className}
            {...rest}
        >
            <div className="t-content">
                <div className="t-wrapper">{children}</div>
            </div>
            <TuiPieChart className="t-chart" value={value} size={size} masked />
            <div className="t-shield" />
        </tui-ring-chart>
    );
}

function deg(value: number, sum: number): number {
    return sum ? (value / sum) * 360 : 0;
}

function piePath(start: number, end: number): string {
    const startX = 100 * Math.cos(rad(start - 90));
    const startY = 100 * Math.sin(rad(start - 90));
    const endX = 100 * Math.cos(rad(end - 90));
    const endY = 100 * Math.sin(rad(end - 90));
    const largeArc = end - start > 180 ? 1 : 0;

    return `M 0 0 L ${startX.toFixed(2)} ${startY.toFixed(2)} A 100 100 0 ${largeArc} 1 ${endX.toFixed(2)} ${endY.toFixed(2)} Z`;
}

function rad(degrees: number): number {
    return (degrees * Math.PI) / 180;
}
