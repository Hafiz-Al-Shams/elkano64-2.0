import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useLoaderData } from "react-router-dom";
import {
    FaBan,
    FaChevronDown,
    FaLeaf,
    FaLocationDot,
    FaMagnifyingGlass,
    FaPencil,
    FaPlus,
    FaRegCalendarCheck,
    FaSliders,
    FaUtensils,
} from "react-icons/fa6";

// dark-green headings in light mode, light text in dark mode
const headingColor = "text-neutral [[data-theme=elkanoDark]_&]:text-base-content";

const inputBase =
    "h-11 w-full rounded-lg border border-base-300 bg-base-100 text-xs outline-none transition focus:border-primary sm:text-sm";

const MyFoods = () => {
    const loaderData = useLoaderData();
    const foods = useMemo(() => (Array.isArray(loaderData) ? loaderData : []), [loaderData]);

    const [searchValue, setSearchValue] = useState("");
    const [sortOrder, setSortOrder] = useState("recent"); // recent | asc | desc

    // client-side search + client-side sorting
    const visibleFoods = useMemo(() => {
        const q = searchValue.trim().toLowerCase();

        let list = q
            ? foods.filter((food) =>
                `${food.name ?? ""} ${food.category ?? ""} ${food.foodOrigin ?? ""}`.toLowerCase().includes(q)
            )
            : [...foods];

        if (sortOrder === "asc") {
            list.sort((a, b) => Number(a.price) - Number(b.price));
        } else if (sortOrder === "desc") {
            list.sort((a, b) => Number(b.price) - Number(a.price));
        } else {
            // "Recently added": MongoDB ids start with a creation timestamp, so newest id = newest food
            list.sort((a, b) => String(b._id).localeCompare(String(a._id)));
        }
        return list;
    }, [foods, searchValue, sortOrder]);

    const count = visibleFoods.length;

    return (
        <div className="relative overflow-hidden bg-base-200 pb-14 pt-8 lg:pb-20 lg:pt-10">
            <Helmet>
                <title>Elkano64 - My Foods</title>
            </Helmet>

            {/* decorative leaves */}
            <FaLeaf className="pointer-events-none absolute -left-4 top-10 -rotate-[35deg] text-7xl text-secondary/20 sm:text-8xl" />
            <FaLeaf className="pointer-events-none absolute -right-4 top-24 rotate-[35deg] scale-x-[-1] text-7xl text-secondary/20 sm:text-8xl" />

            {/* same container width as the navbar */}
            <div className="relative mx-auto max-w-screen-2xl px-3 md:px-8 lg:px-16">
                {/* ---------- Heading + search + sort ---------- */}
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-start gap-3">
                        {/* small ornament */}
                        <div className="mt-4 hidden items-center gap-1 text-primary sm:flex">
                            <span className="h-px w-4 bg-primary" />
                            <FaLeaf className="-rotate-[30deg] text-xs" />
                        </div>

                        <div>
                            <div className="flex flex-wrap items-center gap-3">
                                <h1 className={`font-serif text-3xl font-bold sm:text-4xl ${headingColor}`}>
                                    My Food List
                                </h1>
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-base-300 bg-base-100 px-3 py-1 text-[11px] text-base-content/70 shadow-sm">
                                    <FaLeaf className="text-[10px] text-primary" />
                                    {count} {count === 1 ? "dish" : "dishes"}
                                </span>
                            </div>
                            <p className="mt-1 text-xs text-base-content/70 sm:text-sm">
                                Manage your listed dishes and keep your menu up to date.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                        {/* search */}
                        <label className="relative block sm:w-64 lg:w-72">
                            <FaMagnifyingGlass className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-base-content/70" />
                            <input
                                type="text"
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                placeholder="Search your foods..."
                                aria-label="Search your foods"
                                className={`${inputBase} pl-10 pr-3 placeholder:text-base-content/50`}
                            />
                        </label>

                        {/* sort */}
                        <label className="relative block sm:w-56">
                            <FaSliders className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-base-content/70" />
                            <select
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value)}
                                aria-label="Sort foods"
                                className={`${inputBase} cursor-pointer appearance-none pl-10 pr-9 font-medium`}
                            >
                                <option value="recent">Recently added</option>
                                <option value="asc">Price low to high</option>
                                <option value="desc">Price high to low</option>
                            </select>
                            <FaChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] text-base-content/70" />
                        </label>
                    </div>
                </div>

                {/* ---------- Food cards ---------- */}
                {count > 0 ? (
                    <div className="mt-7 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 xl:grid-cols-3">
                        {visibleFoods.map((food) => {
                            const outOfStock = Number(food.availableQuantity) <= 0;

                            return (
                                <div
                                    key={food._id}
                                    className="flex gap-3 rounded-xl border border-base-300 bg-base-100 p-3 shadow-sm transition-shadow duration-300 hover:shadow-lg sm:gap-4"
                                >
                                    {/* image */}
                                    <div className="relative aspect-[6/5] w-[40%] max-w-[190px] shrink-0 self-start overflow-hidden rounded-xl bg-base-300">
                                        <img
                                            src={food.photo}
                                            alt={food.name}
                                            loading="lazy"
                                            className="absolute inset-0 h-full w-full object-cover"
                                        />
                                    </div>

                                    {/* details */}
                                    <div className="flex min-w-0 flex-1 flex-col">
                                        <h2 className={`break-words font-serif text-lg font-bold leading-snug ${headingColor}`}>
                                            {food.name}
                                        </h2>

                                        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                                            <p className="font-serif text-xl font-bold text-primary">${food.price}</p>
                                            {food.category && (
                                                <span className="rounded-full bg-base-200 px-2.5 py-0.5 text-[11px] text-base-content/70">
                                                    {food.category}
                                                </span>
                                            )}
                                        </div>

                                        <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-base-content/80">
                                            <span className="inline-flex items-center gap-1.5">
                                                <FaRegCalendarCheck className="text-base-content/60" />
                                                Purchased: {food.purchaseCount}
                                            </span>
                                            {outOfStock ? (
                                                <span className="inline-flex items-center gap-1.5 rounded-full bg-base-200 px-2 py-0.5 text-[10px] text-base-content/70">
                                                    <FaBan className="text-primary" /> Out of stock
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5">
                                                    <FaRegCalendarCheck className="text-base-content/60" />
                                                    Available: {food.availableQuantity}
                                                </span>
                                            )}
                                        </div>

                                        {food.description && (
                                            <p className="mt-2.5 line-clamp-2 text-[11px] leading-relaxed text-base-content/70">
                                                {food.description}
                                            </p>
                                        )}

                                        {food.foodOrigin && (
                                            <p className="mt-1.5 inline-flex items-center gap-1.5 text-[11px] text-base-content/70">
                                                <FaLocationDot className="text-base-content/60" />
                                                Origin: {food.foodOrigin}
                                            </p>
                                        )}

                                        <div className="mt-3 flex justify-end sm:mt-auto sm:pt-3">
                                            <Link
                                                to={`/update-food/${food._id}`}
                                                className="btn btn-primary btn-sm gap-1.5 px-5 text-xs"
                                            >
                                                <FaPencil className="text-[10px]" /> Update
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="mt-8 flex flex-col items-center rounded-xl border border-dashed border-base-300 bg-base-100 px-6 py-14 text-center">
                        <FaUtensils className="text-3xl text-primary/70" />
                        {foods.length === 0 ? (
                            <>
                                <h3 className={`mt-4 font-serif text-xl font-bold ${headingColor}`}>
                                    You haven’t added any foods yet
                                </h3>
                                <p className="mt-1 text-sm text-base-content/70">
                                    Add your first dish and it will show up here.
                                </p>
                                <Link to="/add-food" className="btn btn-primary btn-sm mt-5 gap-2 px-6">
                                    <FaPlus className="text-xs" /> Add Food
                                </Link>
                            </>
                        ) : (
                            <>
                                <h3 className={`mt-4 font-serif text-xl font-bold ${headingColor}`}>
                                    No dishes match your search
                                </h3>
                                <p className="mt-1 text-sm text-base-content/70">Try a different name, category or origin.</p>
                                <button
                                    type="button"
                                    onClick={() => setSearchValue("")}
                                    className="btn btn-primary btn-sm mt-5 px-6"
                                >
                                    Clear search
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyFoods;