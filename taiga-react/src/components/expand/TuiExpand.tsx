import {useEffect, useState, type HTMLAttributes, type ReactNode} from 'react';

import {TUI_VERSION} from '../../version';
import {join} from '../button/TuiButton';

export type TuiExpandProps = Omit<HTMLAttributes<HTMLElement>, 'onChange'> & {
    expanded?: boolean;
    children?: ReactNode;
};

/**
 * Раскрывающийся блок — порт tui-expand: анимация grid-template-rows
 * из оригинальных стилей, содержимое монтируется при открытии.
 */
export function TuiExpand({expanded = false, className, children, ...rest}: TuiExpandProps) {
    const [open, setOpen] = useState(expanded);

    useEffect(() => {
        if (expanded) {
            setOpen(true);
        }
    }, [expanded]);

    return (
        <tui-expand
            data-tui-version={TUI_VERSION}
            className={join(expanded && '_expanded', open && '_open', className)}
            onTransitionEnd={(event) => {
                if (event.propertyName === 'grid-template-rows') {
                    setOpen(expanded);
                }
            }}
            {...rest}
        >
            <div className="t-wrapper">{expanded || open ? children : null}</div>
        </tui-expand>
    );
}
