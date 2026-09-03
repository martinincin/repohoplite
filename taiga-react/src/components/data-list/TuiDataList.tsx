import type {CSSProperties, HTMLAttributes, ReactNode} from 'react';

import {TUI_VERSION} from '../../version';
import {iconVars} from '../../utils/icons';
import {join} from '../button/TuiButton';
import {TuiDropdown} from '../dropdown/TuiDropdown';
import {TuiIcon} from '../icon/TuiIcon';

export type TuiDataListProps = HTMLAttributes<HTMLElement> & {
    size?: 's' | 'm' | 'l';
    emptyContent?: ReactNode;
    children?: ReactNode;
};

/** Список опций — порт tui-data-list. */
export function TuiDataList({size = 's', emptyContent, children, ...rest}: TuiDataListProps) {
    return (
        <tui-data-list data-tui-version={TUI_VERSION} data-size={size} {...rest}>
            {children ?? (emptyContent ? <div className="t-empty">{emptyContent}</div> : null)}
        </tui-data-list>
    );
}

export type TuiOptionProps = Omit<HTMLAttributes<HTMLButtonElement>, 'value'> & {
    value?: unknown;
    selected?: boolean;
    disabled?: boolean;
};

/** Опция — порт [tuiOption]. */
export function TuiOption({value, selected, disabled, className, children, onClick, ...rest}: TuiOptionProps) {
    void value;

    return (
        <button
            tuioption=""
            type="button"
            aria-selected={selected}
            disabled={disabled}
            className={className}
            onClick={(event) => {
                onClick?.(event);
                // опция закрывает вмещающий дропдаун (как tuiDropdownClose в Angular)
                event.currentTarget.closest('tui-dropdown')?.dispatchEvent(
                    new CustomEvent('tui-dropdown-close', {bubbles: false}),
                );
                document.dispatchEvent(new CustomEvent('tui-dropdown-close'));
            }}
            {...rest}
        >
            {children}
            {selected ? <TuiIcon icon="@tui.check" /> : null}
        </button>
    );
}

export type TuiOptGroupProps = HTMLAttributes<HTMLElement> & {label?: string};

/** Группа опций — порт tui-opt-group. */
export function TuiOptGroup({label, children, ...rest}: TuiOptGroupProps) {
    return (
        <tui-opt-group data-tui-version={TUI_VERSION} label={label} {...rest}>
            {children}
        </tui-opt-group>
    );
}

export type TuiSelectProps = {
    items: readonly string[];
    value?: string | null;
    onValueChange?: (value: string | null) => void;
    placeholder?: string;
    size?: 's' | 'm' | 'l';
    iconStart?: string;
    disabled?: boolean;
};

/** Селект — порт input[tuiSelect]: поле + дропдаун со списком опций. */
export function TuiSelect({
    items,
    value,
    onValueChange,
    placeholder = 'Выберите значение',
    size = 'l',
    iconStart,
    disabled,
}: TuiSelectProps) {
    return (
        <TuiDropdown
            content={
                <TuiDataList>
                    {items.map((item) => (
                        <TuiOption
                            key={item}
                            selected={item === value}
                            onClick={() => onValueChange?.(item)}
                        >
                            <span>{item}</span>
                        </TuiOption>
                    ))}
                </TuiDataList>
            }
        >
            <tui-select style={{display: 'block'} as CSSProperties}>
                <tui-textfield
                    tuiappearance=""
                    tuiicons=""
                    data-tui-version={TUI_VERSION}
                    data-appearance="textfield"
                    data-size={size}
                    data-icon-start={iconStart ? 'tui' : undefined}
                    data-icon-end="tui"
                    className={join('tui-interactive')}
                    style={{...iconVars({start: iconStart, end: '@tui.chevron-down'})} as CSSProperties}
                >
                    <input
                        tuiinput=""
                        data-tui-version={TUI_VERSION}
                        data-size={size}
                        placeholder={placeholder}
                        value={value ?? ''}
                        disabled={disabled}
                        readOnly
                        className={value ? undefined : '_empty'}
                        onKeyDown={(event) => {
                            if (event.key.startsWith('Arrow') || event.key === 'Enter') {
                                event.preventDefault();
                            }
                        }}
                    />
                    <span className="t-content" />
                    <span tuicell="" className="t-template" data-height="normal" data-size={size} />
                </tui-textfield>
            </tui-select>
        </TuiDropdown>
    );
}
