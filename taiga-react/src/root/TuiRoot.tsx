import type {ReactNode} from 'react';

import {PortalProvider} from '../portals/PortalProvider';
import {TUI_VERSION} from '../version';

/**
 * Корень приложения — аналог <tui-root> в Angular-версии: несёт версию
 * дизайн-токенов и общий контейнер порталов для оверлеев.
 */
export function TuiRoot({children}: {children: ReactNode}) {
    return (
        <tui-root data-tui-version={TUI_VERSION}>
            <PortalProvider>{children}</PortalProvider>
        </tui-root>
    );
}
