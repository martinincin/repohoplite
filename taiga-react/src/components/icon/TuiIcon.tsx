import type {CSSProperties, HTMLAttributes} from 'react';

import {iconVars} from '../../utils/icons';
import {TUI_VERSION} from '../../version';

export type TuiIconProps = HTMLAttributes<HTMLElement> & {
    /** Имя иконки Taiga («@tui.search») либо произвольный URL SVG. */
    icon: string;
    /** Размер (иконки Taiga масштабируются от font-size). */
    fontSize?: string;
};

/** Иконка — порт tui-icon: SVG-маска через --t-icon, цвет наследуется. */
export function TuiIcon({icon, fontSize, style, ...rest}: TuiIconProps) {
    return (
        <tui-icon
            tuiicons=""
            data-tui-version={TUI_VERSION}
            style={{...iconVars({icon}), ...(fontSize && {fontSize}), ...style} as CSSProperties}
            {...rest}
        />
    );
}
