import {useEffect, useRef, type ButtonHTMLAttributes, type HTMLAttributes, type ReactNode} from 'react';

import {TUI_VERSION} from '../../version';
import {join} from '../button/TuiButton';

export type TuiTabsProps = Omit<HTMLAttributes<HTMLElement>, 'onChange'> & {
    /** Активный индекс (контролируемо); клик по табу вызывает onActiveIndexChange. */
    activeIndex?: number;
    onActiveIndexChange?: (index: number) => void;
    /** Подчёркивание активного таба (класс _underline, как в Angular). */
    underline?: boolean;
    size?: 's' | 'm' | 'l';
    children?: ReactNode;
};

/** Табы — порт tui-tabs: контейнер + кнопки [tuiTab]. */
export function TuiTabs({
    activeIndex = 0,
    onActiveIndexChange,
    underline = true,
    size = 'm',
    children,
    ...rest
}: TuiTabsProps) {
    const hostRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        const host = hostRef.current;

        if (!host) {
            return;
        }

        // аналог TUI_TAB_ACTIVATE: клик по [tuiTab] активирует его индекс
        const onActivate = (event: Event) => {
            const target = (event as CustomEvent).detail as HTMLElement | null;
            const tabs = [...host.querySelectorAll('[tuitab]')];
            const index = tabs.indexOf(target as never);

            if (index >= 0) {
                onActiveIndexChange?.(index);
            }
        };

        host.addEventListener('tui-tab-activate', onActivate);

        return () => host.removeEventListener('tui-tab-activate', onActivate);
    }, [onActiveIndexChange]);

    return (
        <tui-tabs
            ref={hostRef}
            data-tui-version={TUI_VERSION}
            data-size={size}
            className={join(underline && '_underline')}
            {...rest}
        >
            {children}
        </tui-tabs>
    );
}

export type TuiTabProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> & {
    active?: boolean;
    className?: string;
};

/** Таб — порт [tuiTab]; активное состояние — класс ._active (как в Angular). */
export function TuiTab({active, className, children, onClick, ...rest}: TuiTabProps) {
    return (
        <button
            tuitab=""
            type="button"
            data-tui-version={TUI_VERSION}
            className={join(active && '_active', className)}
            onClick={(event) => {
                onClick?.(event);
                // всплывающее событие активации — TuiTabs слушает его на контейнере
                event.currentTarget.dispatchEvent(
                    new CustomEvent('tui-tab-activate', {
                        bubbles: true,
                        detail: event.currentTarget,
                    }),
                );
            }}
            {...rest}
        >
            {children}
        </button>
    );
}
