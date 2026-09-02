import {
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
    type CSSProperties,
    type ReactNode,
} from 'react';

import {usePortal} from '../../portals/PortalProvider';
import {TUI_VERSION} from '../../version';

export type TuiDropdownAlign = 'left' | 'center' | 'right';
export type TuiDropdownDirection = 'bottom' | 'top';

export type TuiDropdownProps = {
    /** Триггер — один элемент. */
    children: ReactNode;
    /** Контент выпадающего блока. */
    content: ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    align?: TuiDropdownAlign;
    offset?: number;
    minHeight?: number;
    maxHeight?: number;
    appearance?: string;
};

type Rect = {top: number; left: number; maxHeight: number};

/**
 * Дропдаун — порт tui-dropdown: тот же элемент, та же CSS-анимация появления
 * (tui-enter/tui-leave из оригинальных стилей), позиционирование по триггеру
 * с разворотом вверх при нехватке места.
 */
export function TuiDropdown({
    children,
    content,
    open: controlledOpen,
    onOpenChange,
    align = 'left',
    offset = 8,
    minHeight = 2.5 * 16,
    maxHeight = 20 * 16,
    appearance = 'dropdown',
}: TuiDropdownProps) {
    const [uncontrolled, setUncontrolled] = useState(false);
    const open = controlledOpen ?? uncontrolled;
    const triggerRef = useRef<HTMLElement | null>(null);
    const [rect, setRect] = useState<Rect | null>(null);
    const [leaving, setLeaving] = useState(false);
    const [entering, setEntering] = useState(true);
    const mountedRef = useRef(false);
    const mount = usePortal();

    const setOpen = (next: boolean) => {
        onOpenChange?.(next);

        if (controlledOpen === undefined) {
            setUncontrolled(next);
        }
    };

    useEffect(() => {
        if (!open) {
            return;
        }

        const close = (event: Event) => {
            const target = event.target as Node;

            if (triggerRef.current?.contains(target)) {
                return;
            }

            if (!triggerRef.current?.isConnected) {
                setOpen(false);
            }
        };

        const onKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setOpen(false);
            }
        };

        const onCloseEvent = () => setOpen(false);

        document.addEventListener('pointerdown', close, true);
        document.addEventListener('keydown', onKey);
        document.addEventListener('tui-dropdown-close', onCloseEvent);

        return () => {
            document.removeEventListener('pointerdown', close, true);
            document.removeEventListener('keydown', onKey);
            document.removeEventListener('tui-dropdown-close', onCloseEvent);
        };
    }, [open]);

    // Появление: сначала невидимый (без top), затем позиция → CSS показывает
    // (tui-dropdown:not([style*=top]){visibility:hidden} из оригинальных стилей)
    useLayoutEffect(() => {
        if (!open || !triggerRef.current) {
            return;
        }

        const place = () => {
            // обёртка — display:contents (нулевой rect); измеряем сам триггер
            const host = (triggerRef.current?.firstElementChild ?? triggerRef.current) as HTMLElement | null;

            if (!host) {
                return;
            }

            const box = host.getBoundingClientRect();
            const spaceBelow = window.innerHeight - box.bottom;
            const direction: TuiDropdownDirection = spaceBelow > minHeight + offset ? 'bottom' : 'top';
            const top =
                direction === 'bottom'
                    ? box.bottom + offset
                    : Math.max(offset, box.top - maxHeight - offset / 2);

            let left = box.left;

            if (align === 'right') {
                left = box.right;
            }

            setRect({
                top: direction === 'bottom' ? top : Math.max(offset, box.top - Math.min(maxHeight, box.top - offset)),
                left,
                maxHeight:
                    direction === 'bottom'
                        ? Math.min(maxHeight, window.innerHeight - box.bottom - offset - offset)
                        : Math.min(maxHeight, box.top - offset - offset),
            });
        };

        place();

        const observer = new ResizeObserver(place);
        const host = triggerRef.current;

        if (host) {
            observer.observe(host.firstElementChild ?? host);
        }

        window.addEventListener('scroll', place, true);
        window.addEventListener('resize', place);

        return () => {
            observer.disconnect();
            window.removeEventListener('scroll', place, true);
            window.removeEventListener('resize', place);
        };
    }, [open, align, offset, minHeight, maxHeight]);

    // Анимация исчезновения: класс tui-leave, снятие через половину длительности
    useEffect(() => {
        if (open) {
            mountedRef.current = true;
            setLeaving(false);
            setEntering(true);

            return;
        }

        if (!mountedRef.current) {
            return;
        }

        setLeaving(true);
        const timer = setTimeout(() => {
            mountedRef.current = false;
            setLeaving(false);
        }, 150);

        return () => clearTimeout(timer);
    }, [open]);

    useEffect(() => {
        if (!open && !leaving) {
            return;
        }

        return mount(
            <tui-dropdown
                data-tui-version={TUI_VERSION}
                data-appearance={appearance}
                className={leaving ? 'tui-leave' : entering ? 'tui-enter' : undefined}
                onAnimationEnd={() => {
                    // как в Angular: класс снимается по окончании анимации
                    if (entering && !leaving) {
                        setEntering(false);
                    }
                }}
                style={
                    rect
                        ? ({
                              position: 'fixed',
                              top: `${rect.top}px`,
                              left: `${rect.left}px`,
                              maxHeight: `${rect.maxHeight}px`,
                          } as CSSProperties)
                        : {position: 'fixed'}
                }
            >
                {content}
            </tui-dropdown>,
        );
    }, [open, leaving, entering, rect, content, appearance, mount]);

    // Триггер оборачиваем в display:contents-хост: layout не меняется,
    // клики и ref идут на обёртку.
    return (
        <span
            ref={triggerRef}
            style={{display: 'contents'}}
            onClick={(event) => {
                event.stopPropagation();
                setOpen(!open);
            }}
            aria-expanded={open}
        >
            {children}
        </span>
    );
}
