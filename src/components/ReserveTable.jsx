import { useState } from "react";
import { FaRegCalendar, FaRegClock, FaRegUser } from "react-icons/fa6";
import { MdTableRestaurant } from "react-icons/md";
import useTableBooking from "../hooks/useTableBooking";

// 👉 Replace with your own restaurant interior photo
const RESERVE_IMAGE =
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80";

const fieldClass =
    "h-11 w-full rounded-lg border border-white/20 bg-white/10 pl-10 pr-3 text-sm text-neutral-content outline-none transition focus:border-primary focus:bg-white/15";

const ReserveTable = () => {
    const { handleBookings, processingOverlay } = useTableBooking();
    const [form, setForm] = useState({ date: "", time: "", guests: "2" });

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        handleBookings();
    };

    return (
        <section id="reserve" className="relative scroll-mt-24 overflow-hidden bg-neutral text-neutral-content">
            <div className="grid lg:grid-cols-[1fr_2.4fr]">
                {/* image strip */}
                <div className="relative hidden min-h-[130px] lg:block">
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${RESERVE_IMAGE})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-neutral" />
                </div>

                {/* content */}
                <div className="flex flex-col gap-5 px-4 py-8 md:px-8 xl:flex-row xl:items-center xl:justify-between xl:px-12">
                    <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-content/70">
                            Make a Reservation
                        </p>
                        <h2 className="mt-1 font-serif text-2xl font-bold lg:text-3xl">Reserve Your Table</h2>
                        <p className="mt-1 text-xs text-neutral-content/75 md:text-sm">
                            Enjoy a perfect dining experience with your loved ones.
                        </p>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:flex xl:items-center"
                    >
                        <label className="relative block xl:w-40">
                            <FaRegCalendar className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-content/70" />
                            <input
                                type="date"
                                name="date"
                                value={form.date}
                                onChange={handleChange}
                                aria-label="Date"
                                className={`${fieldClass} [color-scheme:dark]`}
                            />
                        </label>

                        <label className="relative block xl:w-36">
                            <FaRegClock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-content/70" />
                            <input
                                type="time"
                                name="time"
                                value={form.time}
                                onChange={handleChange}
                                aria-label="Time"
                                className={`${fieldClass} [color-scheme:dark]`}
                            />
                        </label>

                        <label className="relative block xl:w-36">
                            <FaRegUser className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-content/70" />
                            <select
                                name="guests"
                                value={form.guests}
                                onChange={handleChange}
                                aria-label="Guests"
                                className={fieldClass}
                            >
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                                    <option key={n} value={n} className="bg-neutral text-neutral-content">
                                        {n} {n === 1 ? "Guest" : "Guests"}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <button type="submit" className="btn btn-primary h-11 min-h-0 gap-2 px-6">
                            <MdTableRestaurant className="text-lg" /> Book a Table
                        </button>
                    </form>
                </div>
            </div>

            {processingOverlay}
        </section>
    );
};

export default ReserveTable;