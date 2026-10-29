import { useMemo, useState } from "react";
import { FaChevronDown, FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import event1Image from "../assets/event_1.jpg";
import event2Image from "../assets/event_2.webp";

const pad = (n) => String(n).padStart(2, "0");

// returns a new date that is `days` after `base`
const addDays = (base, days) => {
    const d = new Date(base);
    d.setDate(d.getDate() + days);
    return d;
};

// 15/03/2025 — 21/03/2025
const formatRange = (start, end) =>
    `${pad(start.getDate())}/${pad(start.getMonth() + 1)}/${start.getFullYear()} — ${pad(end.getDate())}/${pad(
        end.getMonth() + 1
    )}/${end.getFullYear()}`;

// Add more events here later – the arrows and dots will start working automatically.
// `startInDays` = how many days after TODAY the event begins, `durationDays` = how long it runs.
// Dates are calculated from today, so they are always in the future.
const EVENT_TEMPLATES = [
    {
        id: 1,
        startInDays: 10,
        durationDays: 6,
        title: "A Culinary Journey Through Europe",
        description:
            "Join us for an unforgettable week celebrating the rich culinary traditions of Europe. Indulge in a specially curated menu featuring French soufflés, Italian risottos, Spanish paellas, Greek mezze platters and more. Each dish is paired with exquisite wines to complement the flavors, while our chefs share the stories and family recipes behind every plate. Whether you are visiting with loved ones or celebrating a special occasion, this is a true feast for the senses that will take you across the continent without leaving your table.",
        image: event1Image,
    },
    {
        id: 2,
        startInDays: 20,
        durationDays: 3,
        title: "A Taste of the USA: Smokehouse & Grill Festival",
        description:
            "Get ready for a weekend of bold flavors inspired by the American smokehouse tradition. Enjoy slow-smoked brisket, juicy pulled pork, glazed baby back ribs, Southern fried chicken and golden cornbread, all served with house-made sauces and classic sides like creamy mac and cheese and tangy coleslaw. Finish with warm apple pie and freshly baked cookies. With live music, relaxed seating and plenty of sharing platters, it is the perfect plan for family dinners, friends' get-togethers and everyone who loves honest, hearty food.",
        image: event2Image,
    },
];

// turns the templates into real events with dates relative to today
const buildEvents = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return EVENT_TEMPLATES.map((template) => {
        const start = addDays(today, template.startInDays);
        const end = addDays(start, template.durationDays);
        return {
            id: template.id,
            day: pad(start.getDate()),
            month: start.toLocaleString("en-US", { month: "short" }).toUpperCase(),
            range: formatRange(start, end),
            title: template.title,
            description: template.description,
            image: template.image,
        };
    });
};

const Events = () => {
    // calculated once when the section loads, always relative to the visitor's today
    const events = useMemo(buildEvents, []);

    const [current, setCurrent] = useState(0);
    const [expanded, setExpanded] = useState(false); // "See more" state (phones and tablets only)
    const hasMany = events.length > 1;

    // every way of changing the event also collapses the description again,
    // so a card never stays tall after the user has moved on
    const goTo = (index) => {
        setCurrent(index);
        setExpanded(false);
    };
    const prev = () => goTo((current - 1 + events.length) % events.length);
    const next = () => goTo((current + 1) % events.length);

    return (
        <section className="bg-base-100 px-4 py-12 md:px-8 lg:px-16 lg:py-16">
            <div className="mx-auto max-w-screen-2xl">
                <div className="flex items-center justify-center gap-4">
                    <span className="h-px w-10 bg-primary/60 md:w-20" />
                    <h2 className="font-serif text-xl font-bold md:text-2xl lg:text-3xl">Upcoming Events</h2>
                    <span className="h-px w-10 bg-primary/60 md:w-20" />
                </div>

                <div className="mt-8 flex items-center gap-4 lg:gap-6">
                    {/* All cards sit in the same grid cell, so the section keeps the height of the
                        tallest card and never jumps when the user switches events. */}
                    <div className="grid min-w-0 flex-1">
                        {events.map((event, index) => {
                            const isActive = index === current;
                            const isOpen = isActive && expanded;
                            const descriptionId = `event-description-${event.id}`;

                            return (
                                <article
                                    key={event.id}
                                    aria-hidden={!isActive}
                                    className={`col-start-1 row-start-1 grid overflow-hidden rounded-xl bg-neutral text-neutral-content shadow-lg transition-opacity duration-500 md:grid-cols-[1fr_320px] ${isActive ? "opacity-100" : "pointer-events-none opacity-0"
                                        }`}
                                >
                                    <div className="flex items-start gap-4 p-5 md:p-6">
                                        <div className="shrink-0 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-center leading-none">
                                            <p className="font-serif text-2xl font-bold">{event.day}</p>
                                            <p className="mt-1 text-[10px] tracking-widest">{event.month}</p>
                                        </div>

                                        <div className="min-w-0">
                                            <p className="mb-1 text-[11px] text-accent">{event.range}</p>
                                            <h3 className="font-serif text-lg font-bold md:text-xl">{event.title}</h3>

                                            {/* short on phones / tablets (until opened), always full on large screens */}
                                            <p
                                                id={descriptionId}
                                                className={`mt-2 text-xs leading-relaxed text-neutral-content/75 md:text-[13px] ${isOpen ? "" : "line-clamp-4 lg:line-clamp-none"
                                                    }`}
                                            >
                                                {event.description}
                                            </p>

                                            {/* See more / See less: hidden on large screens */}
                                            <button
                                                type="button"
                                                onClick={() => setExpanded((open) => !open)}
                                                tabIndex={isActive ? 0 : -1}
                                                aria-expanded={isOpen}
                                                aria-controls={descriptionId}
                                                className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-accent transition-colors hover:underline lg:hidden"
                                            >
                                                {isOpen ? "See less" : "See more"}
                                                <FaChevronDown
                                                    className={`text-[9px] transition-transform duration-300 ${isOpen ? "rotate-180" : ""
                                                        }`}
                                                />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="h-48 md:h-full">
                                        <img
                                            src={event.image}
                                            alt={event.title}
                                            loading="lazy"
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                </article>
                            );
                        })}
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

                {/* dots: lets phone users switch events too (the arrows are hidden on small screens) */}
                {hasMany && (
                    <div className="mt-4 flex items-center justify-center gap-2">
                        {events.map((event, index) => (
                            <button
                                key={event.id}
                                type="button"
                                onClick={() => goTo(index)}
                                aria-label={`Show event ${index + 1}: ${event.title}`}
                                aria-current={index === current}
                                className={`h-2 rounded-full transition-all ${index === current ? "w-6 bg-primary" : "w-2 bg-base-content/25 hover:bg-base-content/40"
                                    }`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default Events;