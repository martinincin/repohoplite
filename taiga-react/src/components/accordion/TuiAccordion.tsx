import {useState, type ButtonHTMLAttributes, type HTMLAttributes, type ReactNode} from 'react';

import {iconVars} from '../../utils/icons';
import {TUI_VERSION} from '../../version';
import {join} from '../button/TuiButton';
import {TuiExpand} from '../expand/TuiExpand';

export type TuiAccordionProps = HTMLAttributes<HTMLElement> & {
    children?: ReactNode;
};

/** Аккордеон — порт tui-accordion (вертикальная группа кнопок + tui-expand). */
export function TuiAccordion({children, ...rest}: TuiAccordionProps) {
    return (
        <tui-accordion data-tui-version={TUI_VERSION} {...rest}>
            {children}
        </tui-accordion>
    );
}

export type TuiAccordionItemProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> & {
    /** Заголовок (содержимое кнопки). */
    children?: ReactNode;
    /** Раскрываемое содержимое. */
    content?: ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    className?: string;
    size?: 's' | 'm' | 'l';
};

/** Пункт аккордеона — порт [tuiAccordion]: кнопка + шеврон + tui-expand рядом. */
export function TuiAccordionItem({
    children,
    content,
    open = false,
    onOpenChange,
    className,
    size = 'm',
    ...rest
}: TuiAccordionItemProps) {
    const [expanded, setExpanded] = useState(open);

    const toggle = () => {
        const next = !expanded;

        setExpanded(next);
        onOpenChange?.(next);
    };

    return (
        <>
            <button
                tuiaccordion=""
                tuibutton=""
                tuiappearance=""
                tuiicons=""
                tuichevron=""
                type="button"
                aria-expanded={expanded}
                data-tui-version={TUI_VERSION}
                data-appearance=""
                data-size={size}
                data-icon-end="tui"
                className={join('tui-interactive', className)}
                style={{...iconVars({end: '@tui.chevron-down'})} as React.CSSProperties}
                onClick={toggle}
                {...rest}
            >
                {children}
            </button>
            <TuiExpand expanded={expanded}>{content}</TuiExpand>
        </>
    );
}
