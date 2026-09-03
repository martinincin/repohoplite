import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useRef,
    useState,
    type CSSProperties,
    type ReactNode,
} from 'react';

import {TUI_VERSION} from '../../version';
import {iconVars} from '../../utils/icons';
import {join, TuiIconButton} from '../button/TuiButton';

export type TuiNotificationOptions = {
    /** Метка слева (аналог label в Angular). */
    label?: string;
    /** Имя иконки слева. */
    icon?: string;
    /** Автозакрытие, мс (0 — не закрывать). */
    autoClose?: number;
    /** Тема уведомления — как appearance в Angular-версии. */
    appearance?: 'positive' | 'negative' | 'warning' | 'info' | 'neutral' | 'accent' | '';
};

type NotificationEntry = {
    readonly id: number;
    readonly text: ReactNode;
    readonly options: TuiNotificationOptions;
};

type NotificationsApi = {
    notify: (text: ReactNode, options?: TuiNotificationOptions) => void;
};

const NotificationsContext = createContext<NotificationsApi | null>(null);

const DEFAULT_ICONS: Record<string, string> = {
    positive: '@tui.check',
    negative: '@tui.circle-alert',
    warning: '@tui.circle-alert',
    info: '@tui.info',
    accent: '@tui.info',
    neutral: '@tui.info',
};

/**
 * Уведомления — порт хоста алертов Taiga: элементы с атрибутом [tuiAlert]
 * в фиксированном гриде справа сверху, анимация tui-enter/tui-leave из
 * оригинальных стилей.
 */
export function TuiNotificationsProvider({children}: {children: ReactNode}) {
    const [entries, setEntries] = useState<readonly NotificationEntry[]>([]);
    const nextId = useRef(0);

    const notify = useCallback<NotificationsApi['notify']>((text, options = {}) => {
        const id = ++nextId.current;

        setEntries((current) => [...current, {id, text, options}]);

        const {autoClose = 3000} = options;

        if (autoClose > 0) {
            setTimeout(() => {
                setEntries((current) => current.filter((entry) => entry.id !== id));
            }, autoClose);
        }
    }, []);

    const api = useMemo(() => ({notify}), [notify]);

    return (
        <NotificationsContext.Provider value={api}>
            {children}
            <tui-alert-host>
                {entries.map((entry) => (
                    <TuiNotificationShell key={entry.id} entry={entry} />
                ))}
            </tui-alert-host>
        </NotificationsContext.Provider>
    );
}

export function useTuiNotifications(): NotificationsApi {
    const api = useContext(NotificationsContext);

    if (!api) {
        throw new Error('TuiNotificationsProvider обязателен');
    }

    return api;
}

function TuiNotificationShell({entry}: {entry: NotificationEntry}) {
    const [leaving, setLeaving] = useState(false);
    const [entering, setEntering] = useState(true);
    const {text, options} = entry;
    const appearance = options.appearance ?? '';
    const icon = options.icon ?? DEFAULT_ICONS[appearance] ?? '';

    return (
        <div
            tuialert=""
            data-tui-version={TUI_VERSION}
            className={leaving ? 'tui-leave' : entering ? 'tui-enter' : undefined}
            onAnimationEnd={() => {
                if (entering && !leaving) {
                    setEntering(false);
                }
            }}
        >
            <div
                tuinotification=""
                tuiappearance=""
                data-tui-version={TUI_VERSION}
                data-appearance={appearance || undefined}
                data-size="s"
                className="tui-interactive"
                style={{...iconVars({start: icon})} as CSSProperties}
            >
                {options.label ? <span className="t-label">{options.label}</span> : null}
                <span className="t-text">{text}</span>
                <TuiIconButton
                    appearance="icon"
                    iconStart="@tui.x"
                    aria-label="Закрыть"
                    onClick={() => setLeaving(true)}
                    style={{'--t-radius': '100%'} as CSSProperties}
                >
                    Закрыть
                </TuiIconButton>
            </div>
        </div>
    );
}

/** Готовый компонент уведомления — порт [tuiNotification] (для статики). */
export function TuiNotification({
    appearance = '',
    icon,
    label,
    children,
    className,
}: {
    appearance?: string;
    icon?: string;
    label?: ReactNode;
    children?: ReactNode;
    className?: string;
}) {
    const resolvedIcon = icon ?? DEFAULT_ICONS[appearance] ?? '';

    return (
        <div
            tuinotification=""
            tuiappearance=""
            data-tui-version={TUI_VERSION}
            data-appearance={appearance || undefined}
            className={join('tui-interactive', className)}
            style={{...iconVars({start: resolvedIcon})} as CSSProperties}
        >
            {label ? <span className="t-label">{label}</span> : null}
            <span className="t-text">{children}</span>
        </div>
    );
}
