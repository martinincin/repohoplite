import type {HTMLAttributes, ReactNode} from 'react';

import {TUI_VERSION} from '../../version';
import {TuiIcon} from '../icon/TuiIcon';
import {TuiSubtitle, TuiTitle} from '../display/TuiTypography';

export type TuiBlockStatusProps = HTMLAttributes<HTMLElement> & {
    /** Иконка состояния. */
    icon?: string;
    /** Заголовок. */
    title?: ReactNode;
    /** Пояснение. */
    subtitle?: ReactNode;
    /** Действия (кнопки) под описанием. */
    actions?: ReactNode;
    size?: 'm' | 'l';
    children?: ReactNode;
};

/** Блок-состояние (пустые данные, ошибка) — порт tui-block-status. */
export function TuiBlockStatus({
    icon,
    title,
    subtitle,
    actions,
    size = 'l',
    children,
    ...rest
}: TuiBlockStatusProps) {
    return (
        <tui-block-status data-tui-version={TUI_VERSION} data-size={size} {...rest}>
            {icon ? <TuiIcon icon={icon} /> : null}
            {title ? (
                <TuiTitle level="h4">
                    {title}
                    {subtitle ? <TuiSubtitle>{subtitle}</TuiSubtitle> : null}
                </TuiTitle>
            ) : null}
            {children}
            {actions ? <div className="t-actions">{actions}</div> : null}
        </tui-block-status>
    );
}
