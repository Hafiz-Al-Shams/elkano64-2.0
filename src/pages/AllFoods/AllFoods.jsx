import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useLoaderData, useLocation, useSearchParams } from "react-router-dom";
import {
    FaCartShopping,
    FaChevronLeft,
    FaChevronRight,
    FaLeaf,
    FaMagnifyingGlass,
    FaUtensils,
} from "react-icons/fa6";

/* ------------------------------------------------------------------
   Category filters (9 options).
   A dish matches a filter when its category OR name contains one of the
   keywords. If your database uses different category words, just edit
   the keywords below – nothing else needs to change.
------------------------------------------------------------------- */
const CATEGORY_FILTERS = [
    { label: "All", keywords: [] },
    { label: "Biryani", keywords: ["biryani"] },
    { label: "Pizza", keywords: ["pizza"] },
    { label: "Indian Curry", keywords: ["curry", "indian"] },
    { label: "Chinese", keywords: ["chinese"] },
    { label: "BBQ & Grill", keywords: ["bbq", "grill"] },
    { label: "Seafood", keywords: ["seafood", "fish", "prawn"] },
    { label: "Pasta", keywords: ["pasta"] },
    { label: "Desserts", keywords: ["dessert", "sweet", "cake", "brulee"] },
];

const ITEMS_PER_PAGE_OPTIONS = [15, 30, 50];

const getValidCategory = (value) =>
    CATEGORY_FILTERS.some((c) => c.label === value) ? value : "All";

// 1 … 4 5 6 … 12  style page list
const getPageItems = (current, total) => {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const items = [1];
    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);
    if (start > 2) items.push("dots-start");
    for (let i = start; i <= end; i++) items.push(i);
    if (end < total - 1) items.push("dots-end");
    items.push(total);
    return items;
};

// dark-green headings in light mode, light text in dark mode
const headingColor = "text-neutral [[data-theme=elkanoDark]_&]:text-base-content";
// selected chip / page button look (dark green in light mode, terracotta in dark mode)
const activeBtn =
    "border-neutral bg-neutral text-neutral-content [[data-theme=elkanoDark]_&]:border-primary [[data-theme=elkanoDark]_&]:bg-primary";

const AllFoods = () => {
    const loaderData = useLoaderData();
    const foods = useMemo(() => (Array.isArray(loaderData) ? loaderData : []), [loaderData]);

    const location = useLocation();
    const [searchParams] = useSearchParams();

    // search (server side, debounced – same endpoint as before)
    const [searchValue, setSearchValue] = useState(searchParams.get("search") ?? "");
    const [searchResults, setSearchResults] = useState(null); // null = show all foods
    const [searching, setSearching] = useState(false);

    // filters / sorting / pagination
    const [category, setCategory] = useState(getValidCategory(searchParams.get("category")));
    const [sortOrder, setSortOrder] = useState(""); // "" = Newest First
    const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE_OPTIONS[0]);
    const [page, setPage] = useState(1);

    const debounceRef = useRef(null);
    const requestId = useRef(0);
    const topRef = useRef(null);

    const runSearch = useCallback(async (query) => {
        const q = query.trim();
        const id = ++requestId.current;

        if (!q) {
            setSearchResults(null);
            setSearching(false);
            return;
        }

        setSearching(true);
        try {
            const response = await fetch(
                `https://elkano64-server.vercel.app/searchFoods?search=${encodeURIComponent(q)}`
            );
            const data = await response.json();
            if (id === requestId.current) setSearchResults(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching search results:", error);
        } finally {
            if (id === requestId.current) setSearching(false);
        }
    }, []);

    // Reads ?search= and ?category= from the URL (navbar search modal / home categories)
    // every time the user navigates to this page, even if it is already open.
    useEffect(() => {
        const s = searchParams.get("search") ?? "";
        clearTimeout(debounceRef.current);
        setSearchValue(s);
        setCategory(getValidCategory(searchParams.get("category")));
        setPage(1);
        runSearch(s);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.key]);

    useEffect(() => () => clearTimeout(debounceRef.current), []);

    // Debounced search triggered by input change
    const handleInputChange = (event) => {
        const value = event.target.value;
        setSearchValue(value);
        setPage(1);

        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => runSearch(value), 300);
    };

    // category filter → sorting (same price sorting as before)
    const processedFoods = useMemo(() => {
        let list = searchResults ?? foods;

        const active = CATEGORY_FILTERS.find((c) => c.label === category);
        if (active && active.keywords.length) {
            list = list.filter((food) => {
                const haystack = `${food.category ?? ""} ${food.name ?? ""}`.toLowerCase();
                return active.keywords.some((k) => haystack.includes(k));
            });
        }

        if (sortOrder) {
            list = [...list].sort((a, b) =>
                sortOrder === "asc" ? a.price - b.price : b.price - a.price
            );
        }
        return list;
    }, [searchResults, foods, category, sortOrder]);

    // pagination maths
    const total = processedFoods.length;
    const totalPages = Math.max(1, Math.ceil(total / itemsPerPage));
    const currentPage = Math.min(page, totalPages);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const visibleFoods = processedFoods.slice(startIndex, startIndex + itemsPerPage);
    const showingFrom = total ? startIndex + 1 : 0;
    const showingTo = Math.min(startIndex + itemsPerPage, total);

    const goToPage = (p) => {
        setPage(p);
        topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const handleCategoryChange = (label) => {
        setCategory(label);
        setPage(1);
    };

    const handleResetFilters = () => {
        clearTimeout(debounceRef.current);
        setSearchValue("");
        runSearch("");
        setCategory("All");
        setSortOrder("");
        setPage(1);
    };

    const selectClass =
        "select select-bordered h-11 min-h-0 w-full rounded-lg border-base-300 bg-base-100 text-xs focus:border-primary focus:outline-none sm:text-sm";

    return (
        <div className="relative overflow-hidden bg-base-200 pb-14 lg:pb-20">
            <Helmet>
                <title>Elkano64 - All Foods</title>
            </Helmet>

            {/* decorative leaves */}
            <FaLeaf className="pointer-events-none absolute -left-3 top-3 -rotate-[30deg] text-7xl text-secondary/20 lg:text-8xl" />
            <FaLeaf className="pointer-events-none absolute -right-3 top-3 rotate-[30deg] scale-x-[-1] text-7xl text-secondary/20 lg:text-8xl" />

            {/* same container (max width + side padding) as the Navbar */}
            <div className="relative mx-auto max-w-screen-2xl px-3 md:px-8 lg:px-16">
                {/* ---------- Heading ---------- */}
                <div ref={topRef} className="scroll-mt-20 pt-8 text-center md:pt-10">
                    <div className="flex items-center justify-center gap-3">
                        <span className="h-px w-8 bg-primary/60 md:w-12" />
                        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-primary md:text-xs">
                            Fresh from our kitchen
                        </p>
                        <span className="h-px w-8 bg-primary/60 md:w-12" />
                    </div>

                    <h1 className={`mt-2 font-serif text-3xl font-bold sm:text-4xl lg:text-5xl ${headingColor}`}>
                        Explore All Foods
                    </h1>
                    <p className="mt-2 text-xs text-base-content/70 sm:text-sm">
                        Find your next favorite, freshly prepared at Elkano64.
                    </p>

                    <span className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-neutral px-4 py-1.5 text-xs font-medium text-neutral-content">
                        <FaUtensils className="text-[11px]" />
                        {total} {total === 1 ? "dish" : "dishes"}
                    </span>
                </div>

                {/* ---------- Search + filters + sorting ---------- */}
                <div className="mt-6 rounded-xl border border-base-300 bg-base-100/70 p-3 sm:p-4">
                    {/*
                        < 1024px : stacked (search → chips → sort / items per page)
                        1024–1399: row 1 = search + sort + items, row 2 = chips (one line)
                        >= 1400px: everything on ONE line = search | chips | sort | items
                    */}
                    <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-end min-[1400px]:flex-nowrap">
                        {/* search (compact on very wide screens) */}
                        <label className="relative order-1 block min-w-0 lg:flex-1 min-[1400px]:w-52 min-[1400px]:flex-none">
                            <FaMagnifyingGlass className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/50" />
                            <input
                                type="text"
                                name="search"
                                value={searchValue}
                                onChange={handleInputChange}
                                placeholder="Search by food name..."
                                aria-label="Search by food name"
                                className="h-11 w-full rounded-lg border border-base-300 bg-base-100 pl-10 pr-3 text-xs outline-none transition placeholder:text-base-content/50 focus:border-primary sm:text-sm"
                            />
                        </label>

                        {/* category chips */}
                        <div className="order-2 flex flex-wrap items-center gap-2 lg:order-3 lg:w-full lg:flex-nowrap lg:justify-between min-[1400px]:order-2 min-[1400px]:h-11 min-[1400px]:w-auto min-[1400px]:min-w-0 min-[1400px]:flex-1 min-[1400px]:justify-center">
                            {CATEGORY_FILTERS.map((c) => (
                                <button
                                    key={c.label}
                                    type="button"
                                    onClick={() => handleCategoryChange(c.label)}
                                    className={`whitespace-nowrap rounded-full border px-3 py-1 text-[11px] font-medium transition-colors lg:py-1.5 lg:text-xs ${category === c.label
                                        ? activeBtn
                                        : "border-base-300 bg-base-100 hover:border-primary hover:text-primary"
                                        }`}
                                >
                                    {c.label}
                                </button>
                            ))}
                        </div>

                        {/* sort + items per page */}
                        <div className="order-3 grid grid-cols-[1fr_6.5rem] gap-3 sm:grid-cols-2 lg:order-2 lg:flex min-[1400px]:order-3">
                            <label className="block lg:w-48 min-[1400px]:w-[11.5rem]">
                                <span className="mb-1 block text-[10px] text-base-content/70">Sort by</span>
                                <select
                                    className={selectClass}
                                    value={sortOrder}
                                    onChange={(e) => {
                                        setSortOrder(e.target.value);
                                        setPage(1);
                                    }}
                                >
                                    <option value="">Newest First</option>
                                    <option value="asc">Price low to high</option>
                                    <option value="desc">Price high to low</option>
                                </select>
                            </label>

                            <label className="block lg:w-32 min-[1400px]:w-[5.5rem]">
                                <span className="mb-1 block text-[10px] text-base-content/70">Items per page</span>
                                <select
                                    className={selectClass}
                                    value={itemsPerPage}
                                    onChange={(e) => {
                                        setItemsPerPage(Number(e.target.value));
                                        setPage(1);
                                    }}
                                >
                                    {ITEMS_PER_PAGE_OPTIONS.map((n) => (
                                        <option key={n} value={n}>
                                            {n}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        </div>
                    </div>
                </div>

                {/* ---------- Top pagination ---------- */}
                <div className="mt-4 flex items-center justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="btn btn-sm gap-1.5 border-base-300 bg-base-100 text-xs font-normal disabled:opacity-60"
                    >
                        <FaChevronLeft className="text-[10px]" /> Previous
                    </button>
                    <span className="text-xs text-base-content/70">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        type="button"
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="btn btn-primary btn-sm gap-1.5 text-xs disabled:opacity-60"
                    >
                        Next <FaChevronRight className="text-[10px]" />
                    </button>
                </div>

                {/* ---------- Food cards ---------- */}
                {searching ? (
                    /* loader shown while a search is running */
                    <div
                        role="status"
                        aria-live="polite"
                        className="mt-4 flex flex-col items-center justify-center rounded-xl border border-base-300 bg-base-100 px-6 py-16 text-center shadow-sm"
                    >
                        <span className="loading loading-spinner loading-lg text-primary" />
                        <p className="mt-4 text-sm font-medium text-base-content/70">Loading foods</p>
                    </div>
                ) : visibleFoods.length > 0 ? (
                    <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                        {visibleFoods.map((food) => (
                            <div
                                key={food._id}
                                className="flex gap-3 rounded-xl border border-base-300 bg-base-100 p-2.5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                            >
                                {/* clickable image → food details */}
                                <Link
                                    to={`/foods/${food._id}`}
                                    aria-label={`View details of ${food.name}`}
                                    className="group relative block min-h-[132px] w-[42%] max-w-[220px] shrink-0 overflow-hidden rounded-lg"
                                >
                                    <img
                                        src={food.photo}
                                        alt={food.name}
                                        loading="lazy"
                                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                </Link>

                                <div className="flex min-w-0 flex-1 flex-col py-0.5">
                                    <h3 className="truncate text-sm font-semibold">{food.name}</h3>
                                    <p className="truncate text-[11px] text-base-content/60">{food.category}</p>
                                    <p className="mt-1 text-base font-bold text-primary">${food.price}</p>

                                    <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] text-base-content/70">
                                        <span className="inline-flex items-center gap-1">
                                            <FaCartShopping className="text-primary" /> Purchased: {food.purchaseCount}
                                        </span>
                                        <span className="hidden h-3 w-px bg-base-content/20 sm:block" />
                                        <span>Available: {food.availableQuantity}</span>
                                    </div>

                                    <Link
                                        to={`/food-purchase/${food._id}`}
                                        className="btn btn-primary btn-sm mt-auto w-full text-xs"
                                    >
                                        Purchase
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="mt-6 flex flex-col items-center rounded-xl border border-dashed border-base-300 bg-base-100 px-6 py-14 text-center">
                        <FaUtensils className="text-3xl text-primary/70" />
                        <h3 className={`mt-4 font-serif text-xl font-bold ${headingColor}`}>
                            No dishes found
                        </h3>
                        <p className="mt-1 text-sm text-base-content/70">
                            Try a different search or category.
                        </p>
                        <button type="button" onClick={handleResetFilters} className="btn btn-primary btn-sm mt-5 px-6">
                            Reset filters
                        </button>
                    </div>
                )}

                {/* ---------- Bottom pagination ---------- */}
                {total > 0 && !searching && (
                    <div className="mt-8 flex flex-col items-center gap-3">
                        <div className="flex flex-wrap items-center justify-center gap-2">
                            <button
                                type="button"
                                onClick={() => goToPage(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="btn btn-sm gap-1.5 border-base-300 bg-base-100 text-xs font-normal disabled:opacity-60"
                            >
                                <FaChevronLeft className="text-[10px]" /> Previous
                            </button>

                            {getPageItems(currentPage, totalPages).map((item) =>
                                typeof item === "number" ? (
                                    <button
                                        key={item}
                                        type="button"
                                        onClick={() => goToPage(item)}
                                        aria-current={item === currentPage ? "page" : undefined}
                                        className={`btn btn-sm h-9 min-h-0 w-9 border px-0 text-xs font-medium ${item === currentPage
                                            ? `${activeBtn} hover:opacity-90`
                                            : "border-base-300 bg-base-100 font-normal"
                                            }`}
                                    >
                                        {item}
                                    </button>
                                ) : (
                                    <span key={item} className="px-1 text-base-content/50">
                                        …
                                    </span>
                                )
                            )}

                            <button
                                type="button"
                                onClick={() => goToPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="btn btn-sm gap-1.5 border-base-300 bg-base-100 text-xs font-normal disabled:opacity-60"
                            >
                                Next <FaChevronRight className="text-[10px]" />
                            </button>
                        </div>

                        <p className="text-xs text-base-content/70">
                            Showing {showingFrom} – {showingTo} of {total} {total === 1 ? "dish" : "dishes"}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllFoods;