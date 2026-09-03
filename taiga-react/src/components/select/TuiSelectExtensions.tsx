import {useState, type CSSProperties} from 'react';

import {iconVars} from '../../utils/icons';
import {TUI_VERSION} from '../../version';
import {TuiCalendar, formatTuiDate, type TuiDate} from '../calendar/TuiCalendar';
import {TuiDropdown} from '../dropdown/TuiDropdown';
import {TuiDataList, TuiOption} from '../data-list/TuiDataList';
import {TuiChip} from '../form/TuiRadio';

export type TuiInputDateProps = {
    value?: TuiDate | null;
    onValueChange?: (value: TuiDate) => void;
    min?: TuiDate;
    max?: TuiDate;
    placeholder?: string;
    size?: 's' | 'm' | 'l';
    disabled?: boolean;
};

/** Датапикер — порт tui-input-date: поле + календарь в дропдауне. */
export function TuiInputDate({
    value,
    onValueChange,
    min,
    max,
    placeholder = 'Выберите дату',
    size = 'm',
    disabled,
}: TuiInputDateProps) {
    return (
        <TuiDropdown
            content={
                <TuiCalendar
                    value={value}
                    min={min}
                    max={max}
                    onValueChange={(next) => onValueChange?.(next)}
                />
            }
        >
            <tui-input-date style={{display: 'block'} as CSSProperties}>
                <tui-textfield
                    tuiappearance=""
                    tuiicons=""
                    data-tui-version={TUI_VERSION}
                    data-appearance="textfield"
                    data-size={size}
                    data-icon-end="tui"
                    className="tui-interactive"
                    style={{...iconVars({end: '@tui.calendar'})} as CSSProperties}
                >
                    <input
                        tuiinput=""
                        data-tui-version={TUI_VERSION}
                        data-size={size}
                        placeholder={placeholder}
                        value={value ? formatTuiDate(value) : ''}
                        readOnly
                        disabled={disabled}
                        className={value ? undefined : '_empty'}
                    />
                    <span className="t-content" />
                    <span tuicell="" className="t-template" data-height="normal" data-size={size} />
                </tui-textfield>
            </tui-input-date>
        </TuiDropdown>
    );
}

export type TuiComboBoxProps = {
    items: readonly string[];
    value?: string | null;
    onValueChange?: (value: string | null) => void;
    placeholder?: string;
    size?: 's' | 'm' | 'l';
    disabled?: boolean;
};

/** Комбобокс — порт tui-combo-box: поле с фильтрацией списка по вводу. */
export function TuiComboBox({
    items,
    value,
    onValueChange,
    placeholder = 'Начните вводить',
    size = 'm',
    disabled,
}: TuiComboBoxProps) {
    const [query, setQuery] = useState('');

    const filtered = query
        ? items.filter((item) => item.toLowerCase().includes(query.toLowerCase()))
        : items;

    return (
        <TuiDropdown
            content={
                <TuiDataList>
                    {filtered.map((item) => (
                        <TuiOption
                            key={item}
                            selected={item === value}
                            onClick={() => {
                                setQuery('');
                                onValueChange?.(item);
                            }}
                        >
                            <span>{item}</span>
                        </TuiOption>
                    ))}
                </TuiDataList>
            }
        >
            <tui-combo-box style={{display: 'block'} as CSSProperties}>
                <tui-textfield
                    tuiappearance=""
                    tuiicons=""
                    data-tui-version={TUI_VERSION}
                    data-appearance="textfield"
                    data-size={size}
                    data-icon-end="tui"
                    className="tui-interactive"
                    style={{...iconVars({end: '@tui.chevron-down'})} as CSSProperties}
                >
                    <input
                        tuiinput=""
                        data-tui-version={TUI_VERSION}
                        data-size={size}
                        placeholder={placeholder}
                        value={query || value || ''}
                        disabled={disabled}
                        className={query || value ? undefined : '_empty'}
                        onInput={(event) => {
                            setQuery(event.currentTarget.value);
                            onValueChange?.(event.currentTarget.value || null);
                        }}
                    />
                    <span className="t-content" />
                    <span tuicell="" className="t-template" data-height="normal" data-size={size} />
                </tui-textfield>
            </tui-combo-box>
        </TuiDropdown>
    );
}

export type TuiMultiSelectProps = {
    items: readonly string[];
    value?: readonly string[];
    onValueChange?: (value: readonly string[]) => void;
    placeholder?: string;
    size?: 's' | 'm' | 'l';
    disabled?: boolean;
};

function join2(...parts: Array<string | false | undefined>): string {
    return parts.filter(Boolean).join(' ');
}

/** Мультиселект — порт tui-multi-select: чипы выбранных + список с галочками. */
export function TuiMultiSelect({
    items,
    value = [],
    onValueChange,
    placeholder = 'Выберите значения',
    size = 'm',
    disabled,
}: TuiMultiSelectProps) {
    const toggle = (item: string) => {
        onValueChange?.(
            value.includes(item) ? value.filter((v) => v !== item) : [...value, item],
        );
    };

    return (
        <TuiDropdown
            content={
                <TuiDataList>
                    {items.map((item) => (
                        <TuiOption key={item} selected={value.includes(item)} onClick={() => toggle(item)}>
                            <span>{item}</span>
                        </TuiOption>
                    ))}
                </TuiDataList>
            }
        >
            <tui-multi-select style={{display: 'block'} as CSSProperties}>
                <tui-textfield
                    tuiappearance=""
                    tuiicons=""
                    data-tui-version={TUI_VERSION}
                    data-appearance="textfield"
                    data-size={size}
                    data-icon-end="tui"
                    className={join2('tui-interactive', value.length > 0 && '_with-value')}
                    style={{...iconVars({end: '@tui.chevron-down'})} as CSSProperties}
                >
                    {value.length ? (
                        <span className="t-chips">
                            {value.map((item) => (
                                <TuiChip key={item} size="s" onClick={() => toggle(item)}>
                                    {item}
                                </TuiChip>
                            ))}
                        </span>
                    ) : (
                        <input
                            tuiinput=""
                            data-tui-version={TUI_VERSION}
                            data-size={size}
                            placeholder={placeholder}
                            readOnly
                            disabled={disabled}
                            className="_empty"
                        />
                    )}
                    <span className="t-content" />
                    <span tuicell="" className="t-template" data-height="normal" data-size={size} />
                </tui-textfield>
            </tui-multi-select>
        </TuiDropdown>
    );
}

