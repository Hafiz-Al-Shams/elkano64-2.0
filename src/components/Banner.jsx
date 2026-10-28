import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaCartShopping, FaLeaf, FaMagnifyingGlass, FaShieldHalved, FaTruckFast, FaUtensils } from "react-icons/fa6";
import { MdTableRestaurant } from "react-icons/md";
import useTableBooking from "../hooks/useTableBooking";

// local banner images (src/assets) – shown in this exact order
import slide1 from "../assets/slide_1.webp";
import slide2 from "../assets/slide_2.webp";
import slide3 from "../assets/slide_3.webp";

/**
 * Background slides. Only these images move; all text stays fixed.
 * Order on the banner: slide_1 → slide_2 → slide_3.
 */
const SLIDES = [slide1, slide2, slide3];

const AUTO_PLAY_MS = 5000;
const SLIDE_MS = 1200;

const features = [
    { Icon: FaUtensils, title: "Delicious Food", sub: "Fresh & Quality Ingredients" },
    { Icon: FaTruckFast, title: "Fast Delivery", sub: "To Your Doorstep" },
    { Icon: MdTableRestaurant, title: "Book a Table", sub: "Dine In Experience" },
    { Icon: FaShieldHalved, title: "Secure Payments", sub: "Safe & Easy" },
];

const Banner = () => {
    const navigate = useNavigate();
    const { handleBookings, processingOverlay } = useTableBooking();

    const [query, setQuery] = useState("");

    /* ---------- infinite auto-sliding background (clone of first slide at the end) ---------- */
    const total = SLIDES.length;
    const track = [...SLIDES, SLIDES[0]];
    const [index, setIndex] = useState(0);
    const [animate, setAnimate] = useState(true);

    useEffect(() => {
        const timer = setInterval(() => {
            setAnimate(true);
            setIndex((i) => (i >= total ? i : i + 1));
        }, AUTO_PLAY_MS);
        return () => clearInterval(timer);
    }, [total]);

    const handleTransitionEnd = (e) => {
        if (e.target !== e.currentTarget) return;
        // reached the clone → silently jump back to the real first slide
        if (index === total) {
            setAnimate(false);
            setIndex(0);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        const q = query.trim();
        navigate(q ? `/all-foods?search=${encodeURIComponent(q)}` : "/all-foods");
    };

    return (
        <section className="relative isolate flex min-h-[640px] flex-col overflow-hidden bg-black text-white lg:min-h-[700px]">
            {/* ---------- moving background ---------- */}
            <div className="absolute inset-0 -z-20 overflow-hidden" aria-hidden="true">
                <div
                    className="flex h-full"
                    style={{
                        width: `${track.length * 100}%`,
                        transform: `translateX(-${(index * 100) / track.length}%)`,
                        transition: animate ? `transform ${SLIDE_MS}ms cubic-bezier(0.65, 0, 0.35, 1)` : "none",
                    }}
                    onTransitionEnd={handleTransitionEnd}
                >
                    {track.map((src, i) => (
                        <div
                            key={i}
                            className="h-full bg-cover bg-center"
                            style={{ width: `${100 / track.length}%`, backgroundImage: `url(${src})` }}
                        />
                    ))}
                </div>
            </div>

            {/* ---------- readability overlays ---------- */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/85 via-black/55 to-black/10" />
            <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/70 via-transparent to-black/30" />

            {/* decorative leaves */}
            <FaLeaf className="pointer-events-none absolute left-0 top-6 -rotate-45 text-7xl text-secondary/70 lg:text-8xl" />
            <FaLeaf className="pointer-events-none absolute bottom-24 left-0 rotate-12 text-6xl text-secondary/60 lg:text-7xl" />

            {/* handwritten tag */}
            <p className="pointer-events-none absolute right-24 top-24 z-10 hidden -rotate-6 font-script text-3xl leading-tight md:block lg:right-40 lg:text-4xl">
                Fresh <br /> &amp; Tasty
            </p>

            {/* ---------- fixed content ---------- */}
            <div className="relative z-10 mx-auto flex w-full max-w-screen-2xl flex-1 flex-col justify-center px-4 pb-8 pt-14 md:px-8 lg:px-16 lg:pt-20">
                <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/90 md:text-xs">
                    Authentic Cuisine <span className="mx-2 text-primary">•</span> Fresh Ingredients
                </p>

                <h1 className="mt-4 max-w-2xl font-serif text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
                    Good Food <br /> Brings People Together
                </h1>

                <p className="mt-4 max-w-md text-sm text-white/85 md:text-base">
                    From delicious meals to memorable moments, Elkano64 brings you the best of food and dining.
                </p>

                {/* search */}
                <form
                    onSubmit={handleSearch}
                    className="mt-6 flex w-full max-w-xl items-center rounded-full bg-base-100 p-1 text-base-content shadow-lg ring-2 ring-primary/70"
                >
                    <FaUtensils className="mx-3 shrink-0 text-base-content/50" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search for your favorite dish..."
                        className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-base-content/50"
                    />
                    <button
                        type="submit"
                        className="btn btn-primary h-10 min-h-0 rounded-full px-5 text-sm sm:px-8"
                    >
                        <FaMagnifyingGlass className="sm:hidden" />
                        <span className="hidden sm:inline">Search</span>
                    </button>
                </form>

                {/* CTAs */}
                <div className="mt-5 flex flex-wrap gap-3">
                    <Link to="/all-foods" className="btn btn-primary rounded-full px-6 shadow-lg">
                        <FaCartShopping /> Order Food
                    </Link>
                    <button
                        type="button"
                        onClick={handleBookings}
                        className="btn rounded-full border-white/70 bg-black/20 px-6 text-white backdrop-blur hover:border-white hover:bg-white/20"
                    >
                        <MdTableRestaurant className="text-lg" /> Book a Table
                    </button>
                </div>
            </div>

            {/* ---------- feature strip ---------- */}
            <div className="relative z-10 border-t border-white/10 bg-gradient-to-t from-black/70 to-black/30">
                <div className="mx-auto grid max-w-screen-2xl grid-cols-2 gap-4 px-4 py-5 md:px-8 lg:grid-cols-4 lg:px-16">
                    {features.map(({ Icon, title, sub }) => (
                        <div key={title} className="flex items-center gap-3 lg:justify-center">
                            <Icon className="shrink-0 text-2xl text-white lg:text-3xl" />
                            <div className="leading-tight">
                                <p className="text-xs font-semibold md:text-sm">{title}</p>
                                <p className="text-[10px] text-white/70 md:text-xs">{sub}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {processingOverlay}
        </section>
    );
};

export default Banner;