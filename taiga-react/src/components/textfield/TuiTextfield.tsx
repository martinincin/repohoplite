import {
    createContext,
    useContext,
    useLayoutEffect,
    useRef,
    useState,
    type CSSProperties,
    type HTMLAttributes,
    type InputHTMLAttributes,
    type ReactNode,
} from 'react';

import {iconVars} from '../../utils/icons';
import {TUI_VERSION} from '../../version';
import {join, TuiIconButton} from '../button/TuiButton';

type TuiTextfieldSize = 's' | 'm' | 'l';

type TextfieldContextValue = {
    readonly size: TuiTextfieldSize;
};

const TextfieldContext = createContext<TextfieldContextValue>({size: 'l'});

export {TextfieldContext};

export type TuiTextfieldProps = HTMLAttributes<HTMLElement> & {
    size?: TuiTextfieldSize;
    iconStart?: string;
    iconEnd?: string;
    /** Крестик очистки справа (аналог tuiTextfieldCleaner в Angular). */
    cleaner?: boolean;
    onClear?: () => void;
    children?: ReactNode;
};

/**
 * Контейнер поля — порт tui-textfield: та же внутренняя структура
 * (input → .t-content с крестиком → .t-template-ячейка), те же атрибуты.
 */
export function TuiTextfield({
    size = 'l',
    iconStart,
    iconEnd,
    cleaner,
    onClear,
    className,
    style,
    children,
    ...rest
}: TuiTextfieldProps) {
    const [focused, setFocused] = useState(false);
    const hostRef = useRef<HTMLElement | null>(null);

    // начальное состояние ._empty (крестик скрыт у пустого поля, как в Angular)
    useLayoutEffect(() => {
        const host = hostRef.current;
        const input = host?.querySelector('input, textarea');

        if (host && input) {
            host.classList.toggle('_empty', (input as HTMLInputElement).value === '');
        }
    });

    return (
        <TextfieldContext.Provider value={{size}}>
            <tui-textfield
                ref={hostRef}
                tuiappearance=""
                tuiicons=""
                data-tui-version={TUI_VERSION}
                data-appearance="textfield"
                data-size={size}
                data-focus={focused}
                data-icon-start={iconStart ? 'tui' : undefined}
                data-icon-end={iconEnd ? 'tui' : undefined}
                className={join('tui-interactive', className)}
                style={{...iconVars({start: iconStart, end: iconEnd}), ...style} as CSSProperties}
                onFocusCapture={() => setFocused(true)}
                onBlurCapture={() => setFocused(false)}
                {...rest}
            >
                {children}
                <span className="t-content">
                    {cleaner ? (
                        <TuiIconButton
                            appearance="icon"
                            iconStart="@tui.x"
                            tuibuttonx=""
                            tabIndex={-1}
                            aria-label="Очистить"
                            onClick={(event) => {
                                const input = hostRef.current?.querySelector('input, textarea') as HTMLInputElement | null;

                                if (input) {
                                    input.value = '';
                                    syncEmptyClass(input);
                                }

                                onClear?.();
                                event.currentTarget.blur();
                            }}
                            style={{'--t-radius': '100%'} as CSSProperties}
                        >
                            Очистить
                        </TuiIconButton>
                    ) : null}
                </span>
                <span tuicell="" className="t-template" data-height="normal" data-size={size} />
            </tui-textfield>
        </TextfieldContext.Provider>
    );
}

export type TuiInputProps = InputHTMLAttributes<HTMLInputElement>;

/** Инпут — порт [tuiInput], вкладывается в TuiTextfield. */
export function TuiInput({value, defaultValue, className, onInput, ...rest}: TuiInputProps) {
    const {size} = useContext(TextfieldContext);
    const empty = value === '' || value === undefined || value === null;

    return (
        <input
            tuiinput=""
            data-tui-version={TUI_VERSION}
            data-size={size}
            className={join(empty && defaultValue === undefined ? '_empty' : null, className)}
            value={value}
            onInput={(event) => {
                syncEmptyClass(event.currentTarget);
                onInput?.(event);
            }}
            {...rest}
        />
    );
}

// Пустое поле прячет крестик очистки: класс ._empty ставится и на инпут,
// и на контейнер tui-textfield (селектор оригинальных стилей — по хосту).
function syncEmptyClass(input: HTMLInputElement): void {
    const field = input.closest('tui-textfield');

    input.classList.toggle('_empty', input.value === '');

    if (field) {
        field.classList.toggle('_empty', input.value === '');
    }
}
