import type {HTMLAttributes} from 'react';

import {TUI_VERSION} from '../../version';
import {join} from '../button/TuiButton';

export type TuiBadgeProps = HTMLAttributes<HTMLDivElement> & {
    appearance?: string;
    size?: 'xs' | 's' | 'm' | 'l';
};

/** Бейдж — порт [tuiBadge]. */
export function TuiBadge({appearance, size = 'm', className, ...rest}: TuiBadgeProps) {
    return (
        <div
            tuiappearance=""
            tuibadge=""
            data-tui-version={TUI_VERSION}
            data-appearance={appearance}
            data-size={size}
            className={join('tui-interactive', className)}
            {...rest}
        />
    );
}

export type TuiAvatarProps = HTMLAttributes<HTMLDivElement> & {
    /** Текст (инициалы) либо имя иконки. */
    content?: string;
    size?: 'xs' | 's' | 'm' | 'l';
};

/** Аватар — порт [tuiAvatar]. */
export function TuiAvatar({content, size = 'm', className, children, ...rest}: TuiAvatarProps) {
    return (
        <div
            tuiavatar=""
            data-tui-version={TUI_VERSION}
            data-size={size}
            className={className}
            {...rest}
        >
            {content ?? children}
        </div>
    );
}
