import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
    FaChevronDown,
    FaCircleExclamation,
    FaRegCalendar,
    FaRegClock,
    FaRegUser,
} from "react-icons/fa6";
import { MdTableRestaurant } from "react-icons/md";
import AuthContext from "../context/AuthContext/AuthContext";

// 👉 Replace with your own restaurant interior photo
const RESERVE_IMAGE =
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80";

const pad = (n) => String(n).padStart(2, "0");

// same slots as BookingModal: 10:00 AM to 9:30 PM, every 30 minutes
const TIME_SLOTS = Array.from({ length: 24 }, (_, i) => {
    const mins = 10 * 60 + i * 30;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    const suffix = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 || 12;
    return `${h12}:${pad(m)} ${suffix}`;
});

// same options as BookingModal: 1 to 10 guests
const GUEST_OPTIONS = Array.from({ length: 10 }, (_, i) => i + 1);

const getToday = () => {
    const d = new Date();
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const fieldClass =
    "h-11 w-full rounded-lg border bg-white/10 pl-10 pr-3 text-sm text-neutral-content outline-none transition focus:bg-white/15";

const ReserveTable = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    // guests defaults to "1", exactly like the booking modal
    const [form, setForm] = useState({ date: "", time: "", guests: "1" });
    const [invalidFields, setInvalidFields] = useState([]); // fields to mark red
    const [errorMessage, setErrorMessage] = useState(""); // small red message under the form

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));

        // the user is fixing the problem, so remove the red mark of this field
        if (invalidFields.includes(name)) {
            const remaining = invalidFields.filter((field) => field !== name);
            setInvalidFields(remaining);
            if (remaining.length === 0) setErrorMessage("");
        }
    };

    const showLoginAlert = () => {
        Swal.fire({
            icon: "warning",
            title: "Login required",
            text: "You must be logged in to book a table.",
            showCancelButton: true,
            confirmButtonText: "Go to Login",
            cancelButtonText: "Not now",
            confirmButtonColor: "#2f6b3f",
        }).then((result) => {
            if (result.isConfirmed) navigate("/signIn");
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // 1) not logged in: SweetAlert, even if every field is filled
        if (!user) {
            setInvalidFields([]);
            setErrorMessage("");
            showLoginAlert();
            return;
        }

        // 2) logged in but something is missing / invalid: red marks + message
        const missing = [];
        const pastDate = form.date && form.date < getToday();
        if (!form.date || pastDate) missing.push("date");
        if (!form.time) missing.push("time");
        if (!form.guests) missing.push("guests");

        if (missing.length > 0) {
            setInvalidFields(missing);
            setErrorMessage(
                pastDate
                    ? "Please choose today's date or a future date, and complete the marked fields."
                    : "Please complete the marked fields to book a table."
            );
            return;
        }

        // 3) everything is valid: the real booking will be connected later
        setInvalidFields([]);
        setErrorMessage("");
        // TODO: send the booking to the server here (form.date, form.time, form.guests, user).
    };

    const borderFor = (name) =>
        invalidFields.includes(name)
            ? "border-error focus:border-error"
            : "border-white/20 focus:border-primary";

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

                    {/* form + error message stay together as one block in the layout */}
                    <div>
                        <form
                            onSubmit={handleSubmit}
                            noValidate
                            className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:flex xl:items-center"
                        >
                            {/* Date */}
                            <label className="relative block xl:w-40">
                                <FaRegCalendar className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-content/70" />
                                <input
                                    type="date"
                                    name="date"
                                    value={form.date}
                                    min={getToday()}
                                    onChange={handleChange}
                                    aria-label="Date"
                                    aria-invalid={invalidFields.includes("date")}
                                    className={`${fieldClass} ${borderFor("date")} [color-scheme:dark]`}
                                />
                            </label>

                            {/* Time (dropdown, same slots as the booking modal) */}
                            <label className="relative block xl:w-36">
                                <FaRegClock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-content/70" />
                                <select
                                    name="time"
                                    value={form.time}
                                    onChange={handleChange}
                                    aria-label="Time"
                                    aria-invalid={invalidFields.includes("time")}
                                    className={`${fieldClass} ${borderFor("time")} cursor-pointer appearance-none pr-8 ${form.time ? "" : "text-neutral-content/60"
                                        }`}
                                >
                                    <option value="" className="bg-neutral text-neutral-content">
                                        Select Time
                                    </option>
                                    {TIME_SLOTS.map((slot) => (
                                        <option key={slot} value={slot} className="bg-neutral text-neutral-content">
                                            {slot}
                                        </option>
                                    ))}
                                </select>
                                <FaChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-content/70" />
                            </label>

                            {/* Guests */}
                            <label className="relative block xl:w-36">
                                <FaRegUser className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-content/70" />
                                <select
                                    name="guests"
                                    value={form.guests}
                                    onChange={handleChange}
                                    aria-label="Guests"
                                    aria-invalid={invalidFields.includes("guests")}
                                    className={`${fieldClass} ${borderFor("guests")} cursor-pointer appearance-none pr-8`}
                                >
                                    {GUEST_OPTIONS.map((n) => (
                                        <option key={n} value={n} className="bg-neutral text-neutral-content">
                                            {n} {n === 1 ? "Guest" : "Guests"}
                                        </option>
                                    ))}
                                </select>
                                <FaChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-content/70" />
                            </label>

                            <button type="submit" className="btn btn-primary h-11 min-h-0 gap-2 px-6">
                                <MdTableRestaurant className="text-lg" /> Book a Table
                            </button>
                        </form>

                        {/* red message for missing / invalid fields */}
                        {errorMessage && (
                            <p
                                role="alert"
                                className="mt-3 flex items-center gap-2 text-xs font-medium text-red-300 sm:text-sm"
                            >
                                <FaCircleExclamation className="shrink-0" />
                                {errorMessage}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ReserveTable;