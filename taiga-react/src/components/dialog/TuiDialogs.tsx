import {
    useEffect,
    useState,
    createContext,
    useCallback,
    useContext,
    useMemo,
    useRef,
    type CSSProperties,
    type ReactNode,
} from 'react';

import {TUI_VERSION} from '../../version';
import {join, TuiIconButton} from '../button/TuiButton';

export type TuiDialogOptions = {
    label?: string;
    size?: 's' | 'm' | 'l';
    appearance?: string;
    closable?: boolean;
    /** Обязательный диалог: без закрытия по Esc/клику по фону. */
    required?: boolean;
};

export type TuiDialogHandle<T = void> = {
    resolve: (value: T) => void;
    dismiss: () => void;
};

type DialogEntry = {
    readonly id: number;
    readonly node: ReactNode;
};

type DialogsApi = {
    open: <T = void>(render: (handle: TuiDialogHandle<T>) => ReactNode, options?: TuiDialogOptions) => Promise<T>;
};

const DialogsContext = createContext<DialogsApi | null>(null);

/**
 * Диалоги — порт tui-dialog: элемент tui-dialog с header, крестиком [tuiButtonX]
 * и CSS-анимацией появления из оригинальных стилей; backdrop — tui-modal.
 */
export function TuiDialogsProvider({children}: {children: ReactNode}) {
    const [dialogs, setDialogs] = useState<readonly DialogEntry[]>([]);
    const nextId = useRef(0);

    const open = useCallback(function openDialog<T = void>(
        render: (handle: TuiDialogHandle<T>) => ReactNode,
        options: TuiDialogOptions = {},
    ): Promise<T> {
        const id = ++nextId.current;

        return new Promise<T>((resolvePromise) => {
            const remove = () => {
                setDialogs((current) => current.filter((dialog) => dialog.id !== id));
            };

            const handle: TuiDialogHandle<T> = {
                resolve: (value) => {
                    remove();
                    resolvePromise(value);
                },
                dismiss: () => {
                    remove();
                    resolvePromise(undefined as T);
                },
            };

            const node = (
                <TuiDialogShell
                    key={id}
                    options={options}
                    onClose={() => {
                        if (!options.required) {
                            handle.dismiss();
                        }
                    }}
                >
                    {render(handle)}
                </TuiDialogShell>
            );

            setDialogs((current) => [...current, {id, node}]);
        });
    }, []);

    const api = useMemo(() => ({open}), [open]);

    return (
        <DialogsContext.Provider value={api}>
            {children}
            <tui-popups-dialogs>
                {dialogs.map((dialog) => dialog.node)}
            </tui-popups-dialogs>
        </DialogsContext.Provider>
    );
}

export function useTuiDialogs(): DialogsApi {
    const api = useContext(DialogsContext);

    if (!api) {
        throw new Error('TuiDialogsProvider обязателен');
    }

    return api;
}

function TuiDialogShell({
    options,
    onClose,
    children,
}: {
    options: TuiDialogOptions;
    onClose: () => void;
    children: ReactNode;
}) {
    const {label, size = 's', appearance = '', closable = true, required} = options;
    const [entered, setEntered] = useState(false);
    const [leaving, setLeaving] = useState(false);

    useEffect(() => {
        const frame = requestAnimationFrame(() => setEntered(true));

        return () => cancelAnimationFrame(frame);
    }, []);

    useEffect(() => {
        if (!required) {
            const onKey = (event: KeyboardEvent) => {
                if (event.key === 'Escape') {
                    setLeaving(true);
                    setTimeout(onClose, 150);
                }
            };

            document.addEventListener('keydown', onKey);

            return () => document.removeEventListener('keydown', onKey);
        }
    }, [required, onClose]);

    return (
        <tui-modal
            className={leaving ? 'tui-leave' : undefined}
            onClick={(event) => {
                if (event.target === event.currentTarget && !required) {
                    setLeaving(true);
                    setTimeout(onClose, 150);
                }
            }}
        >
            <tui-dialog
                data-tui-version={TUI_VERSION}
                data-appearance={appearance || undefined}
                data-size={size}
                className={join('_closable', entered && 'tui-enter', leaving && 'tui-leave')}
                onClick={(event) => event.stopPropagation()}
            >
                {label ? <header>{label}</header> : null}
                {closable ? (
                    <TuiIconButton
                        appearance="icon"
                        iconStart="@tui.x"
                        tuibuttonx=""
                        aria-label="Закрыть"
                        onClick={() => {
                            setLeaving(true);
                            setTimeout(onClose, 150);
                        }}
                        style={{'--t-radius': '100%'} as CSSProperties}
                    >
                        Закрыть
                    </TuiIconButton>
                ) : null}
                {children}
            </tui-dialog>
        </tui-modal>
    );
}

/** Подтверждение — порт TUI_CONFIRM (TuiConfirm из @taiga-ui/kit). */
export function TuiConfirmContent({
    content,
    yes = 'Да',
    no = 'Отмена',
    onYes,
    onNo,
}: {
    content: ReactNode;
    yes?: string;
    no?: string;
    onYes: () => void;
    onNo: () => void;
}) {
    return (
        <div style={{display: 'grid', gap: '1rem'}}>
            <div>{content}</div>
            <footer style={{display: 'flex', justifyContent: 'flex-end', gap: '0.75rem'}}>
                <button tuiappearance="" tuibutton="" data-appearance="flat" type="button" onClick={onNo}>
                    {no}
                </button>
                <button tuiappearance="" tuibutton="" data-appearance="primary" type="button" onClick={onYes}>
                    {yes}
                </button>
            </footer>
        </div>
    );
}
