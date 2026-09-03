import type {HTMLAttributes, ReactNode} from 'react';

import {TUI_VERSION} from '../../version';
import {join} from '../button/TuiButton';

export type TuiSkeletonProps = HTMLAttributes<HTMLDivElement> & {
    /** Показывать скелетон (иначе — обычное содержимое). */
    loading?: boolean;
    children?: ReactNode;
};

/** Скелетон — порт [tuiSkeleton]: пульсирующая заглушка содержимого. */
export function TuiSkeleton({loading = true, className, children, ...rest}: TuiSkeletonProps) {
    if (!loading) {
        return <>{children}</>;
    }

    return (
        <div tuiskeleton="" data-tui-version={TUI_VERSION} className={join(className)} {...rest}>
            {children}
        </div>
    );
}
