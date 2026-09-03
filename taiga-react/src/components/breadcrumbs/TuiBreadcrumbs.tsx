import type {AnchorHTMLAttributes, HTMLAttributes, ReactNode} from 'react';

import {TUI_VERSION} from '../../version';

export type TuiBreadcrumbsProps = HTMLAttributes<HTMLElement> & {
    /** Разделитель (по умолчанию «/», как TUI_BREADCRUMBS_OPTIONS в Angular). */
    separator?: string;
    size?: 's' | 'm' | 'l';
    children?: ReactNode;
};

/** Хлебные крошки — порт tui-breadcrumbs: ссылки-дети с разделителями. */
export function TuiBreadcrumbs({separator = '/', size = 'm', children, ...rest}: TuiBreadcrumbsProps) {
    return (
        <tui-breadcrumbs data-tui-version={TUI_VERSION} data-size={size} {...rest}>
            {children}
        </tui-breadcrumbs>
    );
}

export type TuiBreadcrumbItemProps = AnchorHTMLAttributes<HTMLAnchorElement>;

/** Элемент крошек — ссылка; разделитель рисуется через CSS-соседа. */
export function TuiBreadcrumbItem({children, ...rest}: TuiBreadcrumbItemProps) {
    return (
        <a tuilink="" tuiappearance="" data-appearance="action" data-tui-version={TUI_VERSION} {...rest}>
            {children}
            <span className="t-separator" aria-hidden="true" />
        </a>
    );
}
