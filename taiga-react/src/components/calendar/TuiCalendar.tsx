import {useMemo, useState, type HTMLAttributes} from 'react';

import {iconVars} from '../../utils/icons';
import {TUI_VERSION} from '../../version';
import {join, TuiIconButton} from '../button/TuiButton';
import type {CSSProperties} from 'react';

/** Дата в формате ISO 'YYYY-MM-DD'. */
export type TuiDate = string;

const WEEK_DAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

const MONTHS = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
];

const MONTHS_GENITIVE = [
    'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
    'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря',
];

export function isTuiToday(iso: TuiDate): boolean {
    return iso === toIso(new Date());
}

export function toIso(date: Date): TuiDate {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function fromIso(iso: TuiDate): Date {
    const [year, month, day] = iso.split('-').map(Number);

    return new Date(year, month - 1, day);
}

export function formatTuiDate(iso: TuiDate | null): string {
    if (!iso) {
        return '';
    }

    const date = fromIso(iso);

    return `${date.getDate()} ${MONTHS_GENITIVE[date.getMonth()]} ${date.getFullYear()}`;
}

export type TuiCalendarProps = Omit<HTMLAttributes<HTMLElement>, 'onChange'> & {
    value?: TuiDate | null;
    onValueChange?: (value: TuiDate) => void;
    min?: TuiDate;
    max?: TuiDate;
    /** Показывать дни смежных месяцев (showAdjacent в Angular). */
    showAdjacent?: boolean;
};

/**
 * Календарь — порт tui-calendar: шапка с навигацией по месяцам
 * (tui-calendar-spin) и сетка месяца (структура .t-row/.t-cell из
 * calendar-sheet) с today/selected/disabled/adjacent состояниями.
 */
export function TuiCalendar({
    value,
    onValueChange,
    min,
    max,
    showAdjacent = true,
    className,
    ...rest
}: TuiCalendarProps) {
    const initial = value ? fromIso(value) : new Date();
    const [year, setYear] = useState(initial.getFullYear());
    const [month, setMonth] = useState(initial.getMonth());

    const weeks = useMemo(() => buildMonth(year, month), [year, month]);
    const monthName = `${MONTHS[month]} ${year}`;
    const prevDisabled = min ? toIso(new Date(year, month, 0)) < min : false;
    const nextDisabled = max ? toIso(new Date(year, month + 1, 1)) > max : false;

    const shift = (delta: number) => {
        const next = new Date(year, month + delta, 1);

        setYear(next.getFullYear());
        setMonth(next.getMonth());
    };

    return (
        <tui-calendar data-tui-version={TUI_VERSION} className={className} {...rest}>
            <tui-calendar-spin data-tui-version={TUI_VERSION}>
                <TuiIconButton
                    appearance="icon"
                    size="xs"
                    iconStart="@tui.chevron-left"
                    disabled={prevDisabled}
                    aria-label="Предыдущий месяц"
                    onClick={() => shift(-1)}
                    style={{...iconVars({start: '@tui.chevron-left'})} as CSSProperties}
                >
                    Предыдущий месяц
                </TuiIconButton>
                <span className="t-month">{monthName}</span>
                <TuiIconButton
                    appearance="icon"
                    size="xs"
                    iconStart="@tui.chevron-right"
                    disabled={nextDisabled}
                    aria-label="Следующий месяц"
                    onClick={() => shift(1)}
                    style={{...iconVars({start: '@tui.chevron-right'})} as CSSProperties}
                >
                    Следующий месяц
                </TuiIconButton>
            </tui-calendar-spin>
            <tui-calendar-sheet data-tui-version={TUI_VERSION}>
                <div className="t-row t-row_weekday">
                    {WEEK_DAYS.map((day) => (
                        <div key={day} className="t-cell">
                            {day}
                        </div>
                    ))}
                </div>
                {weeks.map((week, index) => (
                    <div key={index} className="t-row">
                        {week.map((iso) => {
                            const date = fromIso(iso);
                            const adjacent = date.getMonth() !== month;
                            const disabled = (min && iso < min) || (max && iso > max) || false;
                            const selected = iso === value;

                            return (
                                <div
                                    key={iso}
                                    className={join(
                                        't-cell',
                                        adjacent && 't-cell_unavailable',
                                        disabled && 't-cell_disabled',
                                        isTuiToday(iso) && 't-cell_today',
                                    )}
                                    data-range={selected ? 'active' : undefined}
                                    aria-selected={selected}
                                    onClick={() => !disabled && !adjacent && onValueChange?.(iso)}
                                >
                                    {date.getDate()}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </tui-calendar-sheet>
        </tui-calendar>
    );
}

/** Матрица недель месяца (пн-вперед) с датами смежных месяцев, как tuiCalendarSheet. */
function buildMonth(year: number, month: number): Array<Array<TuiDate>> {
    const first = new Date(year, month, 1);
    const offsetFromMonday = (first.getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: TuiDate[] = [];

    // дни смежного месяца в начале (showAdjacent в Angular)
    for (let day = offsetFromMonday; day > 0; day--) {
        cells.push(toIso(new Date(year, month, -day + 1)));
    }

    for (let day = 1; day <= daysInMonth; day++) {
        cells.push(toIso(new Date(year, month, day)));
    }

    // хвост до полной недели
    let tail = 1;

    while (cells.length % 7 !== 0) {
        cells.push(toIso(new Date(year, month + 1, tail++)));
    }

    const weeks: TuiDate[][] = [];

    for (let i = 0; i < cells.length; i += 7) {
        weeks.push(cells.slice(i, i + 7));
    }

    return weeks;
}
