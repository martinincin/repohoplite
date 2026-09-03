import {useId, type HTMLAttributes} from 'react';

import {TUI_VERSION} from '../../version';

export type TuiSegmentedProps = Omit<HTMLAttributes<HTMLElement>, 'onChange'> & {
    /** Активный индекс (контролируемо). */
    activeIndex?: number;
    onActiveIndexChange?: (index: number) => void;
    size?: 's' | 'm' | 'l';
    items?: readonly string[];
    children?: React.ReactNode;
};

/** Сегментированный переключатель — порт tui-segmented (CSS anchor-positioning). */
export function TuiSegmented({
    activeIndex = 0,
    onActiveIndexChange,
    size = 's',
    items,
    children,
    ...rest
}: TuiSegmentedProps) {
    // уникальное имя якоря для «пилюли» активного сегмента (как tuiGenerateId в Angular)
    const anchor = `--tui-${useId().replace(/[^a-zA-Z0-9-]/g, '')}`;

    return (
        <tui-segmented
            data-tui-version={TUI_VERSION}
            data-size={size}
            style={{'--t-anchor': anchor} as React.CSSProperties}
            {...rest}
        >
            {items
                ? items.map((item, index) => (
                      <button
                          key={item}
                          type="button"
                          className={index === activeIndex ? 'tui-segmented_active' : undefined}
                          onClick={() => onActiveIndexChange?.(index)}
                      >
                          {item}
                      </button>
                  ))
                : children}
        </tui-segmented>
    );
}
