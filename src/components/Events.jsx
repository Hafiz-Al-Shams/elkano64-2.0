import { useState } from "react";
import { FaArrowRight, FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import Swal from "sweetalert2";

// Add more events here later – the arrows will start working automatically
const events = [
    {
        id: 1,
        day: "15",
        month: "MAR",
        range: "15/03/2025 — 21/03/2025",
        title: "A Culinary Journey Through Europe",
        description:
            "Join us for an unforgettable evening celebrating the rich culinary traditions of Europe. Indulge in a specially curated menu featuring French soufflés, Italian risottos, Spanish paellas, and more. Each dish is paired with exquisite wines to complement the flavors, making this a true feast for the senses ...",
        image: "https://i.ibb.co.com/Wyqhsyk/event.jpg",
    },
];

const Events = () => {
    const [current, setCurrent] = useState(0);
    const event = events[current];
    const hasMany = events.length > 1;

    const handleEventDetails = () => {
        Swal.fire({
            title: "Upcoming!",
            text: "Details will come next week..",
            icon: "info",
            confirmButtonText: "Cool",
        });
    };

    const prev = () => setCurrent((c) => (c - 1 + events.length) % events.length);
    const next = () => setCurrent((c) => (c + 1) % events.length);

    return (
        <section className="bg-base-100 px-4 py-12 md:px-8 lg:px-16 lg:py-16">
            <div className="mx-auto max-w-screen-2xl">
                <div className="flex items-center justify-center gap-4">
                    <span className="h-px w-10 bg-primary/60 md:w-20" />
                    <h2 className="font-serif text-xl font-bold md:text-2xl lg:text-3xl">Upcoming Events</h2>
                    <span className="h-px w-10 bg-primary/60 md:w-20" />
                </div>

                <div className="mt-8 flex items-center gap-4 lg:gap-6">
                    <button
                        type="button"
                        className="hidden items-center gap-1.5 whitespace-nowrap text-xs font-medium text-primary hover:underline xl:flex"
                    >
                        View All Events <FaArrowRight className="text-[10px]" />
                    </button>

                    {/* card */}
                    <div className="grid flex-1 overflow-hidden rounded-xl bg-neutral text-neutral-content shadow-lg md:grid-cols-[1fr_320px]">
                        <div className="flex items-start gap-4 p-5 md:p-6">
                            <div className="shrink-0 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-center leading-none">
                                <p className="font-serif text-2xl font-bold">{event.day}</p>
                                <p className="mt-1 text-[10px] tracking-widest">{event.month}</p>
                            </div>

                            <div>
                                <p className="mb-1 text-[11px] text-accent">{event.range}</p>
                                <h3 className="font-serif text-lg font-bold md:text-xl">{event.title}</h3>
                                <p className="mt-2 line-clamp-4 text-xs text-neutral-content/75 md:line-clamp-3">
                                    {event.description}
                                </p>
                                <button onClick={handleEventDetails} className="btn btn-primary btn-xs md:btn-sm mt-4 px-5">
                                    View Details
                                </button>
                            </div>
                        </div>

                        <div className="h-48 md:h-full">
                            <img src={event.image} alt={event.title} className="h-full w-full object-cover" />
                        </div>
                    </div>

                    {/* arrows */}
                    <div className="hidden gap-2 sm:flex">
                        <button
                            type="button"
                            onClick={prev}
                            disabled={!hasMany}
                            aria-label="Previous event"
                            className="btn btn-circle btn-sm btn-outline border-base-content/30 disabled:bg-transparent disabled:opacity-60"
                        >
                            <FaChevronLeft className="text-xs" />
                        </button>
                        <button
                            type="button"
                            onClick={next}
                            disabled={!hasMany}
                            aria-label="Next event"
                            className="btn btn-circle btn-sm btn-outline border-base-content/30 disabled:bg-transparent disabled:opacity-60"
                        >
                            <FaChevronRight className="text-xs" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Events;