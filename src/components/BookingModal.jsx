/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
    FaArrowRight,
    FaChevronDown,
    FaCircleExclamation,
    FaLeaf,
    FaRegCalendarDays,
    FaRegClock,
    FaUserGroup,
    FaUtensils,
    FaXmark,
} from "react-icons/fa6";
import { lockBodyScroll } from "../utils/lockBodyScroll";
import AuthContext from "../context/AuthContext/AuthContext";
import { createBooking } from "../utils/bookingApi";

// dark-green headings in light mode, light text in dark mode
const headingColor = "text-neutral [[data-theme=elkanoDark]_&]:text-base-content";

// short-screen helper: tightens the layout so the modal never needs a scrollbar
const short = "[@media(max-height:520px)]";

const pad = (n) => String(n).padStart(2, "0");

// time slots from 10:00 AM to 9:30 PM (kitchen closes at 9:30 PM), every 30 minutes
const TIME_SLOTS = Array.from({ length: 24 }, (_, i) => {
    const mins = 10 * 60 + i * 30;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    const suffix = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 || 12;
    return `${h12}:${pad(m)} ${suffix}`;
});

const GUEST_OPTIONS = Array.from({ length: 10 }, (_, i) => i + 1);

const getToday = () => {
    const d = new Date();
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const fieldBox =
    "h-9 w-full rounded-lg border border-base-300 bg-base-100 px-3 text-xs text-base-content outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15 sm:text-[13px]";

// red border for a field that needs attention (replaces the normal border color)
const invalidBox = "!border-error focus:!border-error focus:!ring-error/20";

/**
 * Table-booking modal.
 * It is mounted only while open (parent: {open && <BookingModal onClose={...} />}),
 * so everything the user entered is reset automatically every time it closes.
 */
const BookingModal = ({ onClose }) => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const [show, setShow] = useState(false);
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [guests, setGuests] = useState("1");
    const [invalidFields, setInvalidFields] = useState([]); // fields to mark red
    const [errorMessage, setErrorMessage] = useState(""); // small red message above the button
    const [isSubmitting, setIsSubmitting] = useState(false); // true while the request is running

    // fade / scale-in animation on open
    useEffect(() => {
        const id = requestAnimationFrame(() => setShow(true));
        return () => cancelAnimationFrame(id);
    }, []);

    // lock page scroll while open (without the page shifting sideways) + close on Esc
    useEffect(() => {
        const unlockScroll = lockBodyScroll();

        const handleKeyDown = (e) => {
            // don't close the modal while a booking request is running
            if (e.key === "Escape" && !isSubmitting) onClose();
        };
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            unlockScroll();
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [onClose, isSubmitting]);

    // clicking the dark area outside the card closes the modal
    const handleBackdropMouseDown = (e) => {
        if (e.target === e.currentTarget && !isSubmitting) onClose();
    };

    const openDatePicker = (e) => {
        try {
            e.target.showPicker?.();
        } catch {
            /* some browsers block showPicker – the field still works by typing */
        }
    };

    // remove the red mark of a field as soon as the user changes it
    const clearInvalid = (name) => {
        if (!invalidFields.includes(name)) return;
        const remaining = invalidFields.filter((field) => field !== name);
        setInvalidFields(remaining);
        if (remaining.length === 0) setErrorMessage("");
    };

    const handleConfirm = async () => {
        if (isSubmitting) return; // ignore double clicks

        // 1) not logged in: close the modal and ask the user to log in
        if (!user) {
            onClose();
            Swal.fire({
                icon: "warning",
                title: "Login required",
                text: "You must be logged in to book a table.",
                showCancelButton: true,
                confirmButtonText: "Go to Login",
                cancelButtonText: "Not now",
                confirmButtonColor: "#2f6b3f",
            }).then((result) => {
                if (result.isConfirmed) navigate("/signIn", { state: { from: location } });
            });
            return;
        }

        // 2) something is missing / invalid: red marks + message
        const missing = [];
        const pastDate = date && date < getToday();
        if (!date || pastDate) missing.push("date");
        if (!time) missing.push("time");
        if (!guests) missing.push("guests");

        if (missing.length > 0) {
            setInvalidFields(missing);
            setErrorMessage(
                pastDate
                    ? "Please choose today's date or a future date, and complete the marked fields."
                    : "Please complete the marked fields to book a table."
            );
            return;
        }

        // 3) everything is valid: send the booking to the server
        setInvalidFields([]);
        setErrorMessage("");
        setIsSubmitting(true);

        try {
            await createBooking({
                name: user.displayName || "",
                email: user.email,
                date,
                time,
                guests: Number(guests),
            });

            // booking saved: close the modal first, then confirm to the user
            onClose();
            Swal.fire({
                icon: "success",
                title: "Table booked!",
                text: `Your table for ${guests} ${Number(guests) === 1 ? "guest" : "guests"} on ${date} at ${time} is confirmed.`,
                confirmButtonText: "OK",
                confirmButtonColor: "#2f6b3f",
            });
        } catch (error) {
            // server message (e.g. duplicate booking) or a network failure
            const message =
                error instanceof TypeError
                    ? "Could not reach the server. Please check your connection and try again."
                    : error.message;

            Swal.fire({
                icon: "error",
                title: "Booking failed",
                text: message,
                confirmButtonColor: "#2f6b3f",
            });
            setIsSubmitting(false); // keep the modal open so the user can retry
        }
    };

    return createPortal(
        <div
            onMouseDown={handleBackdropMouseDown}
            className={`fixed inset-0 z-[90] flex items-center justify-center overflow-hidden bg-black/50 p-4 backdrop-blur-sm transition-opacity duration-200 ${show ? "opacity-100" : "opacity-0"
                }`}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="booking-modal-title"
                className={`relative w-full max-w-[600px] transition-all duration-300 ${show ? "translate-y-0 scale-100" : "translate-y-3 scale-95"
                    }`}
            >
                {/* ---------- round badge that bumps out of the top edge ---------- */}
                <div className="absolute -top-2 left-1/2 z-10 grid h-11 w-11 -translate-x-1/2 place-items-center rounded-full bg-base-100">
                    <span className={`grid h-8 w-8 place-items-center rounded-full bg-base-300/60 text-sm ${headingColor}`}>
                        <FaUtensils />
                    </span>
                </div>

                {/* ---------- card ---------- */}
                <div
                    className={`relative overflow-hidden rounded-2xl border border-base-300/60 bg-base-100 px-3 pb-4 pt-11 text-base-content shadow-2xl sm:px-7 sm:pb-6 ${short}:!pb-3 ${short}:!pt-10`}
                >
                    {/* decorative leaves */}
                    <FaLeaf className="pointer-events-none absolute -left-2 -top-1 -rotate-[35deg] text-5xl text-secondary/25 sm:text-6xl" />
                    <FaLeaf className="pointer-events-none absolute left-6 top-10 hidden rotate-[10deg] text-2xl text-secondary/15 sm:block" />
                    <FaLeaf className="pointer-events-none absolute -bottom-2 -right-1 rotate-[200deg] text-5xl text-secondary/25 sm:text-6xl" />

                    {/* lines on both sides of the badge */}
                    <div className="pointer-events-none absolute inset-x-4 top-3.5 hidden items-center sm:flex">
                        <span className="h-px flex-1 bg-gradient-to-r from-transparent to-accent/70" />
                        <span className="mx-1 h-1 w-1 rounded-full bg-accent" />
                        <span className="w-16" />
                        <span className="mx-1 h-1 w-1 rounded-full bg-accent" />
                        <span className="h-px flex-1 bg-gradient-to-l from-transparent to-accent/70" />
                    </div>

                    {/* close */}
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        aria-label="Close booking"
                        className="absolute right-3 top-3 z-20 text-primary transition-transform hover:rotate-90 disabled:opacity-50 sm:right-5 sm:top-4"
                    >
                        <FaXmark className="text-lg sm:text-xl" />
                    </button>

                    {/* title */}
                    <div className="relative text-center">
                        <h2
                            id="booking-modal-title"
                            className={`font-serif text-2xl font-bold sm:text-4xl ${short}:!text-2xl ${headingColor}`}
                        >
                            Book a Table
                        </h2>
                        <p className="mt-1.5 text-xs text-base-content/80 sm:mt-2 sm:text-[13px]">
                            Reserve your perfect dining experience at Elkano64
                        </p>
                    </div>

                    {/* fields */}
                    <div className={`relative mt-4 grid gap-2 sm:mt-5 sm:grid-cols-3 sm:gap-3 ${short}:!mt-3`}>
                        {/* Date */}
                        <div className="rounded-xl border border-base-300 bg-base-100 p-2 shadow-sm sm:p-2.5">
                            <p className={`mb-1.5 flex items-center gap-2 font-serif text-[13px] font-bold sm:text-sm ${headingColor}`}>
                                <FaRegCalendarDays className="text-sm sm:text-base" /> Date
                            </p>
                            <div className="relative">
                                <input
                                    type="date"
                                    value={date}
                                    min={getToday()}
                                    onChange={(e) => {
                                        setDate(e.target.value);
                                        clearInvalid("date");
                                    }}
                                    onClick={openDatePicker}
                                    disabled={isSubmitting}
                                    aria-label="Select date"
                                    aria-invalid={invalidFields.includes("date")}
                                    className={`${fieldBox} ${invalidFields.includes("date") ? invalidBox : ""} relative cursor-pointer pr-8 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0 [color-scheme:light] [[data-theme=elkanoDark]_&]:[color-scheme:dark] ${date ? "" : "text-transparent"
                                        }`}
                                />
                                {!date && (
                                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-base-content/55 sm:text-[13px]">
                                        Select Date
                                    </span>
                                )}
                                <FaRegCalendarDays className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-base-content/70" />
                            </div>
                        </div>

                        {/* Time */}
                        <div className="rounded-xl border border-base-300 bg-base-100 p-2 shadow-sm sm:p-2.5">
                            <p className={`mb-1.5 flex items-center gap-2 font-serif text-[13px] font-bold sm:text-sm ${headingColor}`}>
                                <FaRegClock className="text-sm sm:text-base" /> Time
                            </p>
                            <div className="relative">
                                <select
                                    value={time}
                                    onChange={(e) => {
                                        setTime(e.target.value);
                                        clearInvalid("time");
                                    }}
                                    disabled={isSubmitting}
                                    aria-label="Select time"
                                    aria-invalid={invalidFields.includes("time")}
                                    className={`${fieldBox} ${invalidFields.includes("time") ? invalidBox : ""} cursor-pointer appearance-none pr-8 ${time ? "" : "text-base-content/55"}`}
                                >
                                    <option value="">Select Time</option>
                                    {TIME_SLOTS.map((slot) => (
                                        <option key={slot} value={slot} className="text-base-content">
                                            {slot}
                                        </option>
                                    ))}
                                </select>
                                <FaChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-base-content/70" />
                            </div>
                        </div>

                        {/* Guests */}
                        <div className="rounded-xl border border-base-300 bg-base-100 p-2 shadow-sm sm:p-2.5">
                            <p className={`mb-1.5 flex items-center gap-2 font-serif text-[13px] font-bold sm:text-sm ${headingColor}`}>
                                <FaUserGroup className="text-sm sm:text-base" /> Guests
                            </p>
                            <div className="relative">
                                <select
                                    value={guests}
                                    onChange={(e) => {
                                        setGuests(e.target.value);
                                        clearInvalid("guests");
                                    }}
                                    disabled={isSubmitting}
                                    aria-label="Number of guests"
                                    aria-invalid={invalidFields.includes("guests")}
                                    className={`${fieldBox} ${invalidFields.includes("guests") ? invalidBox : ""} cursor-pointer appearance-none pr-8`}
                                >
                                    {GUEST_OPTIONS.map((n) => (
                                        <option key={n} value={n}>
                                            {n} {n === 1 ? "Guest" : "Guests"}
                                        </option>
                                    ))}
                                </select>
                                <FaChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-base-content/70" />
                            </div>
                        </div>
                    </div>

                    {/* red message for missing / invalid fields */}
                    {errorMessage && (
                        <p
                            role="alert"
                            className="relative mt-2.5 flex items-center justify-center gap-2 text-center text-xs font-medium text-error"
                        >
                            <FaCircleExclamation className="shrink-0" />
                            {errorMessage}
                        </p>
                    )}

                    {/* confirm */}
                    <button
                        type="button"
                        onClick={handleConfirm}
                        disabled={isSubmitting}
                        className={`btn btn-primary relative mt-3.5 h-9 min-h-0 w-full justify-center gap-2 rounded-lg font-serif text-sm font-semibold normal-case sm:mt-4 sm:h-10 sm:text-base ${short}:!mt-2.5`}
                    >
                        {isSubmitting ? (
                            <>
                                <span className="loading loading-spinner loading-sm"></span> Booking...
                            </>
                        ) : (
                            <>
                                Confirm Reservation <FaArrowRight className="text-sm" />
                            </>
                        )}
                    </button>

                    {/* footer tagline (hidden on very short screens to avoid scrolling) */}
                    <div className={`relative mt-3.5 ${short}:!hidden`}>
                        <div className="flex items-center justify-center gap-2">
                            <span className="h-px w-16 bg-base-300 sm:w-28" />
                            <svg viewBox="0 0 24 24" className="h-3 w-3 shrink-0 text-accent" fill="currentColor" aria-hidden="true">
                                <path d="M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4z" />
                            </svg>
                            <span className="h-px w-16 bg-base-300 sm:w-28" />
                        </div>
                        <p className="mt-2 text-center text-[10px] text-base-content/75 sm:text-[11px]">
                            Good food. Great company. Unforgettable moments.
                        </p>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default BookingModal;