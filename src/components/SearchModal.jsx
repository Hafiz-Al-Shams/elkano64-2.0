import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { FaFire, FaLeaf, FaMagnifyingGlass, FaXmark } from "react-icons/fa6";

const popularSearches = [
    "Biryani",
    "Pizza",
    "Butter Chicken",
    "Chinese",
    "Seafood",
    "Pasta",
    "Grill",
    "Desserts",
];

const SearchModal = ({ onClose }) => {
    const navigate = useNavigate();
    const inputRef = useRef(null);

    const [query, setQuery] = useState("");
    const [show, setShow] = useState(false);

    // fade / scale-in animation on open
    useEffect(() => {
        const id = requestAnimationFrame(() => setShow(true));
        return () => cancelAnimationFrame(id);
    }, []);

    // focus the input, lock page scroll, close on Esc
    useEffect(() => {
        inputRef.current?.focus();

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const handleKeyDown = (e) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [onClose]);

    const goToResults = (term) => {
        const q = term.trim();
        navigate(q ? `/all-foods?search=${encodeURIComponent(q)}` : "/all-foods");
        onClose();
    };

    const handleSubmit = (e) => {
        e.preventDefault(); // runs for both Enter key and the search button
        goToResults(query);
    };

    // clicking the dark backdrop (outside the card) closes the modal
    const handleBackdropMouseDown = (e) => {
        if (e.target === e.currentTarget) onClose();
    };

    // Rendered in <body> so the navbar's blur/sticky styles can't affect its position
    return createPortal(
        <div
            onMouseDown={handleBackdropMouseDown}
            className={`fixed inset-0 z-[90] flex items-center justify-center overflow-hidden bg-black/50 p-4 backdrop-blur-sm transition-opacity duration-200 ${show ? "opacity-100" : "opacity-0"
                }`}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="search-modal-title"
                className={`relative w-full max-w-[640px] overflow-hidden rounded-2xl border border-base-300/60 bg-base-100 p-6 text-base-content shadow-2xl transition-all duration-300 sm:p-10 [@media(max-height:620px)]:!p-5 ${show ? "translate-y-0 scale-100" : "translate-y-3 scale-95"
                    }`}
            >
                {/* decorative leaves (clipped by the card, so they never cause scrollbars) */}
                <FaLeaf className="pointer-events-none absolute -left-2 top-1 -rotate-[35deg] text-6xl text-secondary/20 sm:text-7xl" />
                <FaLeaf className="pointer-events-none absolute left-7 top-9 rotate-[10deg] text-3xl text-secondary/15 sm:text-4xl" />
                <FaLeaf className="pointer-events-none absolute -bottom-2 -right-1 rotate-[200deg] text-6xl text-secondary/20 sm:text-7xl" />
                <FaLeaf className="pointer-events-none absolute bottom-8 right-9 rotate-[150deg] text-3xl text-secondary/15 sm:text-4xl" />

                {/* close */}
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close search"
                    className="absolute right-4 top-4 text-primary transition-transform hover:rotate-90 sm:right-6 sm:top-6"
                >
                    <FaXmark className="text-2xl" />
                </button>

                {/* title */}
                <div className="relative flex items-center gap-3 pr-8">
                    <span className="flex items-center">
                        <span className="h-px w-3 bg-primary/60 sm:w-4" />
                        <FaMagnifyingGlass className="text-lg text-primary sm:text-xl" />
                    </span>
                    <h2
                        id="search-modal-title"
                        className="font-serif text-2xl font-bold text-neutral sm:text-3xl [[data-theme=elkanoDark]_&]:text-base-content"
                    >
                        Search Our Menu
                    </h2>
                </div>
                <p className="relative mt-3 text-sm text-base-content/80 sm:text-base">
                    Find your favorite food, cuisine or dish...
                </p>

                {/* search box */}
                <form
                    onSubmit={handleSubmit}
                    className="relative mt-6 flex items-center rounded-2xl border border-base-300 bg-base-100 p-1.5 shadow-md transition focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/20 sm:mt-8 [@media(max-height:620px)]:!mt-4"
                >
                    <FaMagnifyingGlass className="mx-3 shrink-0 text-base-content/40 sm:mx-4" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search for food, dish, or cuisine..."
                        aria-label="Search for food, dish, or cuisine"
                        className="min-w-0 flex-1 bg-transparent py-2 text-sm outline-none placeholder:text-base-content/45 sm:text-base"
                    />
                    <button
                        type="submit"
                        aria-label="Search"
                        className="grid h-11 w-12 shrink-0 place-items-center rounded-xl bg-primary text-primary-content shadow transition hover:brightness-110 sm:h-12 sm:w-16"
                    >
                        <FaMagnifyingGlass className="text-lg" />
                    </button>
                </form>

                {/* popular searches */}
                <div className="relative mt-6 sm:mt-8 [@media(max-height:620px)]:!mt-4">
                    <h3 className="flex items-center gap-2 text-sm font-bold sm:text-base">
                        <FaFire className="text-primary" />
                        <span className="text-neutral [[data-theme=elkanoDark]_&]:text-base-content">
                            Popular Searches
                        </span>
                    </h3>

                    <div className="mt-3 flex flex-wrap gap-2 sm:gap-3 [@media(max-height:620px)]:!gap-1.5">
                        {popularSearches.map((item) => (
                            <button
                                key={item}
                                type="button"
                                onClick={() => goToResults(item)}
                                className="rounded-full bg-base-300/70 px-4 py-1.5 text-xs font-medium transition-colors hover:bg-primary hover:text-primary-content sm:px-5 sm:py-2 sm:text-sm"
                            >
                                {item}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default SearchModal;