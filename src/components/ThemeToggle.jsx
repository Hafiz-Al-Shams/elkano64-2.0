import { useContext } from "react";
import { FaMoon, FaSun } from "react-icons/fa6";
import ThemeContext from "../context/ThemeContext/ThemeContext";

const ThemeToggle = () => {
    const { isDark, toggleTheme } = useContext(ThemeContext);

    return (
        <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            title={isDark ? "Light mode" : "Dark mode"}
            className="fixed right-3 md:right-6 top-[74px] lg:top-[94px] z-40 flex h-8 w-[60px] md:h-9 md:w-16 items-center justify-between rounded-full border border-white/30 bg-neutral/80 px-2 text-[11px] md:text-xs text-neutral-content shadow-lg backdrop-blur-md transition-colors hover:bg-neutral"
        >
            <FaSun className={`relative z-10 ${isDark ? "opacity-60" : "text-white"}`} />
            <FaMoon className={`relative z-10 ${isDark ? "text-white" : "opacity-60"}`} />
            {/* sliding knob */}
            <span
                className={`pointer-events-none absolute top-[3px] h-6 w-6 md:h-7 md:w-7 rounded-full bg-primary shadow transition-all duration-300 ${isDark ? "left-[calc(100%-1.75rem)] md:left-[calc(100%-2rem)]" : "left-[3px]"
                    }`}
            />
        </button>
    );
};

export default ThemeToggle;