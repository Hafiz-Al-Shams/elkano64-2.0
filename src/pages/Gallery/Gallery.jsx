import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLoaderData } from "react-router-dom";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { FaArrowUpRightFromSquare, FaLeaf } from "react-icons/fa6";

// dark-green headings in light mode, light text in dark mode
const headingColor = "text-neutral [[data-theme=elkanoDark]_&]:text-base-content";

const Gallery = () => {
    const loaderData = useLoaderData();
    const foods = useMemo(() => (Array.isArray(loaderData) ? loaderData : []), [loaderData]);

    const [open, setOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    // slides for the lightbox (uses the real food photo field)
    const slides = useMemo(() => foods.map((food) => ({ src: food.photo, alt: food.name })), [foods]);

    return (
        <>
            <Helmet>
                <title>Elkano64 - Gallery</title>
            </Helmet>

            <div className="relative overflow-hidden bg-base-100 pb-14 pt-8 md:pt-10 lg:pb-20">
                {/* decorative leaves */}
                <FaLeaf className="pointer-events-none absolute -left-4 top-8 -rotate-[35deg] text-7xl text-secondary/20 sm:text-8xl lg:top-12 lg:text-9xl" />
                <FaLeaf className="pointer-events-none absolute -right-4 top-24 rotate-[35deg] scale-x-[-1] text-7xl text-secondary/20 sm:text-8xl lg:top-32 lg:text-9xl" />

                {/* same container width as the navbar */}
                <div className="relative mx-auto max-w-screen-2xl px-3 md:px-8 lg:px-16">
                    {/* ---------- Heading ---------- */}
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-3">
                            <span className="h-px w-8 bg-primary/60 md:w-12" />
                            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-primary md:text-xs">
                                A Taste of Elkano64
                            </p>
                            <span className="h-px w-8 bg-primary/60 md:w-12" />
                        </div>

                        <h1 className={`mt-3 font-serif text-4xl font-bold sm:text-5xl lg:text-6xl ${headingColor}`}>
                            Our Food Gallery
                        </h1>
                        <p className="mt-3 text-sm text-base-content/70 md:text-base">
                            A closer look at the dishes made for good moments.
                        </p>
                        <FaLeaf className="mx-auto mt-3 -rotate-[30deg] text-lg text-primary/80" />
                    </div>

                    {/* ---------- Photo grid (all photos, no pagination) ---------- */}
                    {foods.length > 0 ? (
                        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4 lg:mt-10 lg:grid-cols-3">
                            {foods.map((food, index) => (
                                <div
                                    key={food._id ?? index}
                                    className="group relative aspect-[16/9] overflow-hidden rounded-xl border border-base-300 bg-base-300 shadow-sm transition-shadow duration-500 hover:shadow-xl"
                                >
                                    {/* click the photo → open in lightbox */}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setCurrentIndex(index);
                                            setOpen(true);
                                        }}
                                        aria-label={`View ${food.name}`}
                                        className="block h-full w-full cursor-pointer"
                                    >
                                        <img
                                            src={food.photo}
                                            alt={food.name}
                                            loading="lazy"
                                            decoding="async"
                                            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                        />
                                    </button>

                                    {/* open the image in a new tab */}
                                    <a
                                        href={food.photo}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={`Open ${food.name} image in a new tab`}
                                        title="Open image in a new tab"
                                        className="absolute right-2.5 top-2.5 z-10 grid h-8 w-8 place-items-center rounded-md bg-black/40 text-sm text-white backdrop-blur-sm transition-colors hover:bg-primary"
                                    >
                                        <FaArrowUpRightFromSquare />
                                    </a>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="mt-12 text-center text-sm text-base-content/70">No photos to show yet.</p>
                    )}
                </div>

                <Lightbox
                    open={open}
                    close={() => setOpen(false)}
                    slides={slides}
                    index={currentIndex}
                />
            </div>
        </>
    );
};

export default Gallery;