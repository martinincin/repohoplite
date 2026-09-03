import type {CSSProperties, HTMLAttributes, TableHTMLAttributes, TdHTMLAttributes, ThHTMLAttributes} from 'react';

import {TUI_VERSION} from '../../version';
import {join} from '../button/TuiButton';
import {TuiButton} from '../button/TuiButton';
import {TuiDropdown} from '../dropdown/TuiDropdown';
import {TuiDataList, TuiOption} from '../data-list/TuiDataList';
import {iconVars} from '../../utils/icons';

/** Таблица — порт [tuiTable]: table/thead/tbody/th/td с теми же атрибутами. */
export function TuiTable({
    children,
    className,
    size = 'm',
    ...rest
}: TableHTMLAttributes<HTMLTableElement> & {size?: 's' | 'm' | 'l'}) {
    return (
        <table tuitable="" data-tui-version={TUI_VERSION} data-size={size} className={className} {...rest}>
            {children}
        </table>
    );
}

export function TuiTbody({children, ...rest}: HTMLAttributes<HTMLTableSectionElement>) {
    return (
        <tbody tuitbody="" data-tui-version={TUI_VERSION} {...rest}>
            {children}
        </tbody>
    );
}

export function TuiTh({children, sticky, className, ...rest}: ThHTMLAttributes<HTMLTableCellElement> & {sticky?: boolean}) {
    return (
        <th
            tuith=""
            data-tui-version={TUI_VERSION}
            className={join(sticky && '_sticky', className)}
            {...rest}
        >
            {children}
        </th>
    );
}

export function TuiTd({children, sticky, className, ...rest}: TdHTMLAttributes<HTMLTableCellElement> & {sticky?: boolean}) {
    return (
        <td
            tuitd=""
            data-tui-version={TUI_VERSION}
            className={join(sticky && '_sticky', className)}
            {...rest}
        >
            {children}
        </td>
    );
}

export type TuiTablePaginationProps = {
    total: number;
    page?: number;
    size?: number;
    items?: readonly number[];
    onPageChange?: (page: number) => void;
    onSizeChange?: (size: number) => void;
    texts?: Partial<{pages: string; linesPerPage: string; of: string; previous: string; next: string}>;
};

/** Пагинация таблицы — порт tui-table-pagination (та же DOM-структура). */
export function TuiTablePagination({
    total,
    page = 0,
    size = 10,
    items = [10, 20, 50, 100],
    onPageChange,
    onSizeChange,
    texts = {},
}: TuiTablePaginationProps) {
    const {pages = 'Pages', linesPerPage = 'Lines per page', of = 'of', previous = 'Previous', next = 'Next'} = texts;
    const pagesCount = Math.max(1, Math.ceil(total / size));
    const start = total === 0 ? 0 : page * size + 1;
    const end = Math.min(total, (page + 1) * size);

    return (
        <tui-table-pagination data-tui-version={TUI_VERSION}>
            <span className="t-pages">
                {pages} <strong className="t-strong">{pagesCount}</strong>
            </span>
            <span className="t-lines" automation-id="tui-table-pagination__lines-per-page-wrapper">
                {linesPerPage}{' '}
                <TuiDropdown
                    align="right"
                    content={
                        <TuiDataList>
                            {items.map((option) => (
                                <TuiOption
                                    key={option}
                                    selected={option === size}
                                    onClick={() => onSizeChange?.(option)}
                                >
                                    {option}
                                </TuiOption>
                            ))}
                        </TuiDataList>
                    }
                >
                    <button tuilink="" tuiappearance="" data-appearance="action" type="button">
                        <strong>
                            {start}–{end}
                        </strong>
                    </button>
                </TuiDropdown>{' '}
                {of} <strong className="t-strong">{total}</strong>
            </span>
            <TuiButton
                appearance="icon"
                size="xs"
                iconStart="@tui.chevron-left"
                className="t-button t-button_back"
                disabled={page === 0}
                onClick={() => onPageChange?.(page - 1)}
                style={{...iconVars({start: '@tui.chevron-left'})} as CSSProperties}
            >
                {previous}
            </TuiButton>
            <TuiButton
                appearance="icon"
                size="xs"
                iconStart="@tui.chevron-right"
                className="t-button"
                disabled={page >= pagesCount - 1}
                onClick={() => onPageChange?.(page + 1)}
                style={{...iconVars({start: '@tui.chevron-right'})} as CSSProperties}
            >
                {next}
            </TuiButton>
        </tui-table-pagination>
    );
}
