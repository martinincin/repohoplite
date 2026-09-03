import {createContext, useContext, useEffect, useState, type ReactNode} from 'react';

type TuiThemeState = {
    readonly dark: boolean;
    readonly toggle: () => void;
    readonly set: (dark: boolean) => void;
};

const ThemeContext = createContext<TuiThemeState>({dark: false, toggle: () => {}, set: () => {}});

const STORAGE_KEY = 'taiga-ui-react.theme';

/**
 * Тема Taiga: переключает атрибут [tuiTheme] на <html> — палитры light/dark из
 * @taiga-ui/design-tokens применяются глобально, включая порталы.
 */
export function TuiThemeProvider({
    children,
    defaultDark = false,
    persist = true,
}: {
    children: ReactNode;
    defaultDark?: boolean;
    persist?: boolean;
}) {
    const [dark, setDark] = useState(() => {
        if (!persist) {
            return defaultDark;
        }

        const stored = localStorage.getItem(STORAGE_KEY);

        return stored ? stored === 'dark' : defaultDark;
    });

    useEffect(() => {
        document.documentElement.setAttribute('tuiTheme', dark ? 'dark' : 'light');

        if (persist) {
            localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light');
        }
    }, [dark, persist]);

    return (
        <ThemeContext.Provider
            value={{
                dark,
                set: setDark,
                toggle: () => setDark(!dark),
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
}

export function useTuiTheme(): TuiThemeState {
    return useContext(ThemeContext);
}
