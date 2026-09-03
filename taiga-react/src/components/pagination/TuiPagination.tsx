import type {HTMLAttributes} from 'react';

import {iconVars} from '../../utils/icons';
import {TUI_VERSION} from '../../version';
import {join, TuiButton, TuiIconButton} from '../button/TuiButton';
import type {CSSProperties} from 'react';

export type TuiPaginationProps = Omit<HTMLAttributes<HTMLElement>, 'onChange'> & {
    length: number;
    index?: number;
    onIndexChange?: (index: number) => void;
    size?: 's' | 'm' | 'l';
    /** Сколько номеров показывать вокруг активного (как в Angular: 1 + 2*radius). */
    radius?: number;
    texts?: Partial<{previous: string; next: string}>;
};

/** Пагинация страниц — порт tui-pagination (та же структура .t-content/.t-button). */
export function TuiPagination({
    length,
    index = 0,
    onIndexChange,
    size = 'm',
    radius = 1,
    texts = {},
    ...rest
}: TuiPaginationProps) {
    const {previous = 'Previous', next = 'Next'} = texts;
    const pages = Array.from({length}, (_, i) => i);
    const visible = visiblePages(pages, index, radius);

    return (
        <tui-pagination data-tui-version={TUI_VERSION} data-size={size} {...rest}>
            <div className="t-content">
                <TuiIconButton
                    appearance="icon"
                    size="xs"
                    iconStart="@tui.chevron-left"
                    className="t-button"
                    disabled={index === 0}
                    aria-label={previous}
                    onClick={() => onIndexChange?.(index - 1)}
                    style={{...iconVars({start: '@tui.chevron-left'})} as CSSProperties}
                >
                    {previous}
                </TuiIconButton>

                {visible.map((page, position) =>
                    page === null ? (
                        <TuiButton key={`gap-${position}`} appearance="flat-grayscale" size="xs" className="t-button" disabled>
                            …
                        </TuiButton>
                    ) : (
                        <TuiButton
                            key={page}
                            appearance={page === index ? 'primary' : 'flat-grayscale'}
                            size="xs"
                            className={join('t-button', page === index && 't-button_active')}
                            onClick={() => onIndexChange?.(page)}
                        >
                            {page + 1}
                        </TuiButton>
                    ),
                )}

                <TuiIconButton
                    appearance="icon"
                    size="xs"
                    iconStart="@tui.chevron-right"
                    className="t-button"
                    disabled={index === length - 1}
                    aria-label={next}
                    onClick={() => onIndexChange?.(index + 1)}
                    style={{...iconVars({start: '@tui.chevron-right'})} as CSSProperties}
                >
                    {next}
                </TuiIconButton>
            </div>
        </tui-pagination>
    );
}

function visiblePages(pages: readonly number[], index: number, radius: number): Array<number | null> {
    const result: Array<number | null> = [];
    let previous: number | null = null;

    for (const page of pages) {
        const visiblePage = page === 0 || page === pages.length - 1 || Math.abs(page - index) <= radius;

        if (visiblePage) {
            result.push(page);
            previous = page;
        } else if (previous !== null) {
            result.push(null);
            previous = null;
        }
    }

    return result;
}
