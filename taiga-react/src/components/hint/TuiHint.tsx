import {useEffect, useLayoutEffect, useRef, useState, type ReactNode} from 'react';

import {usePortal} from '../../portals/PortalProvider';
import {TUI_VERSION} from '../../version';

export type TuiHintDirection = 'top' | 'bottom';

/**
 * Хинт — порт tui-hint: тот же элемент и стили, показ по наведению/фокусу,
 * позиционирование рядом с триггером.
 */
export function TuiHint({
    content,
    direction = 'top',
    offset = 8,
    children,
}: {
    content: ReactNode;
    direction?: TuiHintDirection;
    offset?: number;
    children: ReactNode;
}) {
    const [visible, setVisible] = useState(false);
    const [pos, setPos] = useState<{top: number; left: number} | null>(null);
    const [entering, setEntering] = useState(true);
    const hostRef = useRef<HTMLSpanElement | null>(null);
    const mount = usePortal();

    useLayoutEffect(() => {
        if (!visible || !hostRef.current) {
            return;
        }

        // обёртка — display:contents (нулевой rect); измеряем сам триггер
        const host = (hostRef.current.firstElementChild ?? hostRef.current) as HTMLElement | null;

        if (!host) {
            return;
        }

        const box = host.getBoundingClientRect();

        setPos({
            top: direction === 'top' ? box.top - offset : box.bottom + offset,
            left: box.left + box.width / 2,
        });
    }, [visible, direction, offset]);

    useEffect(() => {
        if (!visible) {
            return;
        }

        return mount(
            <tui-hint
                data-tui-version={TUI_VERSION}
                className={entering ? 'tui-enter' : undefined}
                onAnimationEnd={() => setEntering(false)}
                style={{
                    position: 'fixed',
                    top: `${pos?.top ?? -9999}px`,
                    left: `${pos?.left ?? -9999}px`,
                    transform: direction === 'top' ? 'translate(-50%, -100%)' : 'translate(-50%, 0)',
                }}
            >
                {content}
            </tui-hint>,
        );
    }, [visible, pos, direction, content, mount, entering]);

    return (
        <span
            ref={hostRef}
            style={{display: 'contents'}}
            onPointerEnter={() => setVisible(true)}
            onPointerLeave={() => setVisible(false)}
            onFocusCapture={() => setVisible(true)}
            onBlurCapture={() => setVisible(false)}
        >
            {children}
        </span>
    );
}
