import { useCallback, useEffect, useMemo, useState } from "react";
import ThemeContext from "./ThemeContext";
import ThemeToggle from "../../components/ThemeToggle";

const STORAGE_KEY = "elkano64-theme";
const LIGHT = "elkanoLight";
const DARK = "elkanoDark";

const getInitialTheme = () => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved === LIGHT || saved === DARK) return saved;
    } catch {
        /* storage not available */
    }
    return LIGHT;
};

// eslint-disable-next-line react/prop-types
const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(getInitialTheme);

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        try {
            localStorage.setItem(STORAGE_KEY, theme);
        } catch {
            /* ignore */
        }
    }, [theme]);

    const toggleTheme = useCallback(() => {
        setTheme((prev) => (prev === LIGHT ? DARK : LIGHT));
    }, []);

    const value = useMemo(
        () => ({ theme, isDark: theme === DARK, toggleTheme }),
        [theme, toggleTheme]
    );

    return (
        <ThemeContext.Provider value={value}>
            {children}
            {/* One fixed toggle for every page (including the 404 page) */}
            <ThemeToggle />
        </ThemeContext.Provider>
    );
};

export default ThemeProvider;