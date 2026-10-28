import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useLoaderData } from "react-router-dom";
import {
    FaArrowLeft,
    FaArrowRight,
    FaAward,
    FaCartShopping,
    FaCircleArrowRight,
    FaCube,
    FaLeaf,
    FaLocationDot,
    FaShieldHalved,
    FaUtensils,
} from "react-icons/fa6";

// dark-green headings in light mode, light text in dark mode
const headingColor = "text-neutral [[data-theme=elkanoDark]_&]:text-base-content";

// Fisher–Yates shuffle (true random order, doesn't touch the original array)
const shuffle = (list) => {
    const arr = [...list];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
};

const trustItems = [
    { icon: <FaLeaf />, label: "Freshly Prepared" },
    { icon: <FaShieldHalved />, label: "Secure Checkout" },
    { icon: <FaAward />, label: "Quality Ingredients" },
];

const FoodDetails = () => {
    const food = useLoaderData();

    const { _id, name, category, description, price, purchaseCount, availableQuantity, photo, foodOrigin } = food;

    // "You may also enjoy" – 3 random foods (never the one being viewed)
    const [suggestions, setSuggestions] = useState([]);
    const [suggestionsLoading, setSuggestionsLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        setSuggestionsLoading(true);

        // every time a food-details page opens (or the food changes) → new random 3
        window.scrollTo({ top: 0, behavior: "auto" });

        fetch("https://elkano64-server.vercel.app/foods")
            .then((res) => res.json())
            .then((data) => {
                if (cancelled) return;
                const others = Array.isArray(data) ? data.filter((item) => item._id !== _id) : [];
                setSuggestions(shuffle(others).slice(0, 3));
            })
            .catch((err) => console.log("ERROR", err.message))
            .finally(() => {
                if (!cancelled) setSuggestionsLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [_id]);

    const inStock = Number(availableQuantity) > 0;

    return (
        // min-h-screen + bg-base-200 on the page itself = no empty gap under short pages
        <section className="relative min-h-screen overflow-hidden bg-base-200 pb-14 lg:pb-20">
            <Helmet>
                <title>Elkano64 - Food Details</title>
            </Helmet>

            {/* decorative leaves */}
            <FaLeaf className="pointer-events-none absolute -left-4 top-6 rotate-[35deg] text-7xl text-secondary/20 lg:text-9xl" />
            <FaLeaf className="pointer-events-none absolute -right-5 bottom-10 -rotate-[35deg] scale-x-[-1] text-7xl text-secondary/20 lg:text-9xl" />

            {/* same container (max width + side padding) as the Navbar */}
            <div className="relative mx-auto max-w-screen-2xl px-3 md:px-8 lg:px-16">
                {/* ---------- Breadcrumb + heading ---------- */}
                <div className="pt-6 text-center md:pt-8">
                    <nav aria-label="Breadcrumb" className="text-[11px] text-base-content/70 sm:text-xs">
                        <ol className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
                            <li>
                                <Link to="/" className="transition-colors hover:text-primary">
                                    Home
                                </Link>
                            </li>
                            <li aria-hidden="true">/</li>
                            <li>
                                <Link to="/all-foods" className="transition-colors hover:text-primary">
                                    All Foods
                                </Link>
                            </li>
                            <li aria-hidden="true">/</li>
                            <li>
                                <Link
                                    to={`/foods/${_id}`}
                                    aria-current="page"
                                    className="transition-colors hover:text-primary"
                                >
                                    {name}
                                </Link>
                            </li>
                        </ol>
                    </nav>

                    <div className="mt-3 flex items-center justify-center gap-3">
                        <span className="h-px w-8 bg-primary/60 md:w-12" />
                        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-primary md:text-xs">
                            Fresh from our kitchen
                        </p>
                        <span className="h-px w-8 bg-primary/60 md:w-12" />
                    </div>

                    <h1 className={`mt-2 font-serif text-3xl font-bold sm:text-4xl lg:text-5xl ${headingColor}`}>
                        {name}
                    </h1>
                    <p className="mt-2 font-serif text-sm text-base-content/70 sm:text-base lg:text-lg">
                        A comforting classic, made with care.
                    </p>
                </div>

                {/* ---------- Main card: image + info ---------- */}
                <div className="mt-6 grid gap-4 lg:mt-8 lg:grid-cols-[1.3fr_1fr] lg:gap-5">
                    {/* clean food image (no badge, thumbnails or icons) */}
                    <div className="flex flex-col rounded-2xl border border-base-300 bg-base-100 p-2.5 shadow-lg sm:p-3">
                        {/* the image is absolutely positioned, so its natural size can never stretch the card */}
                        <div className="relative min-h-[14rem] flex-1 overflow-hidden rounded-xl sm:min-h-[17rem] lg:min-h-[19rem]">
                            <img
                                src={photo}
                                alt={name}
                                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                            />
                        </div>
                    </div>

                    {/* info */}
                    <div className="flex flex-col rounded-2xl border border-base-300 bg-base-100 p-4 shadow-lg sm:p-5">
                        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-base-200 px-3 py-1 text-[11px] font-medium sm:text-xs">
                            <FaUtensils className="text-[10px] text-base-content/70" />
                            {category}
                        </span>

                        {/* price | Purchase Count | available */}
                        <div className="mt-3 grid grid-cols-2 gap-y-3 sm:grid-cols-[auto_1fr_1fr] sm:items-center">
                            <p className="col-span-2 font-serif text-3xl font-bold text-primary sm:col-span-1 sm:pr-5 lg:text-4xl">
                                ${price}
                            </p>

                            <div className="flex items-start gap-2 sm:border-l sm:border-base-300 sm:pl-3">
                                <FaCartShopping className="mt-0.5 shrink-0 text-base text-base-content/60" />
                                <div>
                                    <p className="text-[10px] text-base-content/70">Purchase Count</p>
                                    <p className={`text-lg font-bold leading-tight lg:text-xl ${headingColor}`}>
                                        {purchaseCount}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-2 border-l border-base-300 pl-3">
                                <FaCube className="mt-0.5 shrink-0 text-base text-base-content/60" />
                                <div>
                                    <p className="text-[10px] text-base-content/70">
                                        {inStock ? "Available in Stock" : "Out of Stock"}
                                    </p>
                                    <p className={`text-lg font-bold leading-tight lg:text-xl ${headingColor}`}>
                                        {availableQuantity}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 border-t border-base-300 pt-4">
                            <p className="text-[13px] leading-relaxed text-base-content/80">
                                {description || "A freshly prepared dish from the Elkano64 kitchen."}
                            </p>
                            <p className="mt-2 flex items-center gap-2 text-xs text-base-content/70">
                                <FaLocationDot className="shrink-0 text-primary" />
                                Origin: {foodOrigin}
                            </p>
                        </div>

                        {/* actions */}
                        <div className="mb-5 mt-5 space-y-2.5">
                            <Link
                                to={`/food-purchase/${_id}`}
                                className="btn btn-primary h-10 min-h-0 w-full gap-2 text-[13px]"
                            >
                                <FaCartShopping className="text-sm" />
                                Purchase This Food
                                <FaArrowRight className="text-xs" />
                            </Link>

                            <Link
                                to="/all-foods"
                                className="btn h-10 min-h-0 w-full gap-2 border-base-content/30 bg-base-100 text-[13px] font-medium hover:border-primary hover:bg-base-100 hover:text-primary"
                            >
                                <FaArrowLeft className="text-xs" />
                                Back to All Foods
                            </Link>
                        </div>

                        {/* trust row */}
                        <div className="mt-auto grid grid-cols-1 gap-2.5 border-t border-base-300 pt-4 sm:grid-cols-3 sm:gap-0">
                            {trustItems.map((item, i) => (
                                <div
                                    key={item.label}
                                    className={`flex items-center gap-1.5 text-[11px] text-base-content/80 sm:justify-center ${i > 0 ? "sm:border-l sm:border-base-300" : ""
                                        }`}
                                >
                                    <span className="text-base text-secondary">{item.icon}</span>
                                    {item.label}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ---------- You may also enjoy ---------- */}
                {(suggestionsLoading || suggestions.length > 0) && (
                    <div className="mt-10 lg:mt-14">
                        <div className="flex items-center justify-center gap-3 sm:gap-4">
                            <span className="h-px w-8 bg-primary/50 sm:w-20 lg:w-32" />
                            <FaLeaf className="-scale-x-100 text-xl text-secondary" />
                            <h2 className={`font-serif text-xl font-bold sm:text-2xl lg:text-3xl ${headingColor}`}>
                                You may also enjoy
                            </h2>
                            <FaLeaf className="text-xl text-secondary" />
                            <span className="h-px w-8 bg-primary/50 sm:w-20 lg:w-32" />
                        </div>

                        <div className="mt-6 grid gap-4 md:grid-cols-3">
                            {suggestionsLoading &&
                                Array.from({ length: 3 }).map((_, i) => (
                                    <div key={i} className="skeleton h-32 w-full sm:h-36" />
                                ))}

                            {!suggestionsLoading &&
                                suggestions.map((item) => (
                                    <Link
                                        key={item._id}
                                        to={`/foods/${item._id}`}
                                        aria-label={`View details of ${item.name}`}
                                        className="group flex gap-3 rounded-xl border border-base-300 bg-base-100 p-2.5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg sm:gap-4 sm:p-3"
                                    >
                                        <div className="relative w-[42%] max-w-[220px] shrink-0 overflow-hidden rounded-lg">
                                            <img
                                                src={item.photo}
                                                alt={item.name}
                                                loading="lazy"
                                                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                            <div className="pb-[75%]" />
                                        </div>

                                        <div className="flex min-w-0 flex-1 flex-col py-1">
                                            <h3
                                                className={`line-clamp-2 font-serif text-base font-bold sm:text-lg ${headingColor}`}
                                            >
                                                {item.name}
                                            </h3>
                                            <p className="mt-1 font-serif text-base font-bold text-primary sm:text-lg">
                                                ${item.price}
                                            </p>
                                            <FaCircleArrowRight className="mt-auto self-end text-xl text-secondary transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-primary" />
                                        </div>
                                    </Link>
                                ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default FoodDetails;