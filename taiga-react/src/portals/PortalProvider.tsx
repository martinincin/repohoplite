import {createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode} from 'react';

type PortalMount = (node: ReactNode) => () => void;

const PortalContext = createContext<PortalMount | null>(null);

/**
 * Реестр порталов: оверлеи (дропдауны, хинты, диалоги, уведомления) рендерятся
 * в общий контейнер <tui-popups> внутри <tui-root> — та же архитектура, что в
 * Angular-версии Taiga UI v5 (единый портал-контейнер).
 */
export function PortalProvider({children}: {children: ReactNode}) {
    const [nodes, setNodes] = useState<Map<number, ReactNode>>(new Map());
    const nextId = useRef(0);

    const mount = useCallback<PortalMount>((node) => {
        const id = ++nextId.current;

        setNodes((current) => new Map(current).set(id, node));

        return () => {
            setNodes((current) => {
                const copy = new Map(current);

                copy.delete(id);

                return copy;
            });
        };
    }, []);

    const value = useMemo(() => mount, [mount]);

    return (
        <PortalContext.Provider value={value}>
            {children}
            <tui-popups>
                {[...nodes.entries()].map(([id, node]) => (
                    <portal-slot key={id}>{node}</portal-slot>
                ))}
            </tui-popups>
        </PortalContext.Provider>
    );
}

export function usePortal(): PortalMount {
    const mount = useContext(PortalContext);

    if (!mount) {
        throw new Error('TuiRoot обязателен: оберните приложение в <TuiRoot> из taiga-ui-react');
    }

    return mount;
}
