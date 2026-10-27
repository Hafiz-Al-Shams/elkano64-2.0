import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigation } from "react-router-dom";

/**
 * Shows a centered loading bar while React Router is waiting for a page's
 * loader (data fetch) to finish, so the screen never looks frozen.
 */
const RouteLoader = () => {
    const navigation = useNavigation();
    const isLoading = navigation.state === "loading";

    const [visible, setVisible] = useState(false);

    // small delay so very fast navigations don't flash the loader
    useEffect(() => {
        if (!isLoading) {
            setVisible(false);
            return;
        }
        const timer = setTimeout(() => setVisible(true), 150);
        return () => clearTimeout(timer);
    }, [isLoading]);

    if (!visible) return null;

    // Rendered in <body> so the navbar's blur/sticky styles can't affect its position
    return createPortal(
        <div
            role="status"
            aria-live="polite"
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-[2px]"
        >
            <div className="flex w-[260px] max-w-[85vw] flex-col items-center gap-4 rounded-2xl border border-base-300 bg-base-100 px-8 py-7 text-base-content shadow-2xl">
                <p className="font-serif text-lg font-bold text-neutral [[data-theme=elkanoDark]_&]:text-base-content">
                    Loading...
                </p>
                <progress className="progress progress-primary w-full" aria-label="Loading page"></progress>
                <p className="text-xs text-base-content/60">Preparing your page</p>
            </div>
        </div>,
        document.body
    );
};

export default RouteLoader;