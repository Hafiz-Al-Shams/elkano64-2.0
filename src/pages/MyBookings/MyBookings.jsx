import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import Swal from "sweetalert2";
import {
    FaCalendarCheck,
    FaCalendarDays,
    FaCalendarXmark,
    FaChevronLeft,
    FaChevronRight,
    FaLeaf,
    FaMagnifyingGlass,
    FaTriangleExclamation,
    FaUserGroup,
} from "react-icons/fa6";
import AuthContext from "../../context/AuthContext/AuthContext";
import { deleteBooking, getUserBookings } from "../../utils/bookingApi";
import BookingModal from "../../components/BookingModal";
import useBookingModal from "../../hooks/useBookingModal";

const ITEMS_PER_PAGE_OPTIONS = [10, 20, 30, 50];

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
// selected page button look (dark green in light mode, terracotta in dark mode)
const activeBtn =
    "border-neutral bg-neutral text-neutral-content [[data-theme=elkanoDark]_&]:border-primary [[data-theme=elkanoDark]_&]:bg-primary";

// SweetAlert popups follow the current theme (they are white by default, even in dark mode)
const swalTheme = {
    popup: "!bg-base-100 !text-base-content",
    title: "!text-base-content",
    htmlContainer: "!text-base-content",
};

const formatNumber = (n) => Number(n).toLocaleString("en-US", { maximumFractionDigits: 2 });

// values coming from the server are escaped before they go into SweetAlert's html
const escapeHtml = (value) =>
    String(value ?? "").replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]);

// "2026-11-05" -> "Thu, Nov 5, 2026"
const formatBookingDate = (dateStr) => {
    const d = new Date(`${dateStr}T00:00:00`);
    if (isNaN(d.getTime())) return dateStr || "—";
    return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
};

// when the booking was made (createdAt comes from the server as an ISO string)
const formatCreatedAt = (value) => {
    if (!value) return "—";
    const d = new Date(value);
    return isNaN(d.getTime()) ? "—" : d.toLocaleString("en-US");
};

// date "2026-11-05" + time "7:30 PM" (or "19:30") -> a real Date object (used to know if a booking is upcoming)
const getBookingDateTime = (dateStr, timeStr) => {
    const d = new Date(`${dateStr}T00:00:00`);
    if (isNaN(d.getTime())) return null;
    const match = /^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i.exec((timeStr || "").trim());
    if (match) {
        let hours = Number(match[1]);
        if (match[3]) {
            hours = hours % 12;
            if (match[3].toUpperCase() === "PM") hours += 12;
        }
        d.setHours(hours, Number(match[2]), 0, 0);
    }
    return d;
};

// The global `th` / `td` rules in index.css are overridden here with utility classes,
// so index.css itself does not need to change.
const thClass = `border-0 border-b border-base-300 bg-transparent px-4 py-3.5 text-[13px] font-bold first:pl-6 last:pr-6 ${headingColor}`;
const tdClass =
    "border-0 border-b border-base-300/60 px-4 py-2.5 text-sm font-normal first:pl-6 last:pr-6";

const selectClass =
    "select select-bordered h-11 min-h-0 w-full rounded-lg border-base-300 bg-base-100 text-xs focus:border-primary focus:outline-none sm:text-sm";

const cancelBtnClass =
    "btn btn-outline btn-primary btn-sm shrink-0 flex-nowrap gap-1.5 whitespace-nowrap text-xs font-normal normal-case disabled:opacity-50";

// small badge: Upcoming / Past (the border keeps "Past" visible on striped rows in both themes)
// eslint-disable-next-line react/prop-types
const StatusBadge = ({ upcoming }) => (
    <span
        className={`inline-block shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-medium ${upcoming
            ? "border-primary/30 bg-primary/15 text-primary"
            : "border-base-300 bg-base-200 text-base-content/60"
            }`}
    >
        {upcoming ? "Upcoming" : "Past"}
    </span>
);

const MyBookings = () => {
    const { user } = useContext(AuthContext);

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState("");
    const [reloadKey, setReloadKey] = useState(0); // changing it re-runs the fetch (Try again button)

    // search / sorting / pagination
    const [searchValue, setSearchValue] = useState("");
    const [sortOrder, setSortOrder] = useState("newest"); // newest | soonest | latest
    const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE_OPTIONS[0]); // default 10
    const [page, setPage] = useState(1);

    const topRef = useRef(null);

    // table-booking modal (same hook + modal the home page Banner uses)
    const { bookingOpen, openBooking, closeBooking } = useBookingModal();
    // true = the next reload is a quiet background refresh (no spinner, keeps the list on screen)
    const silentReloadRef = useRef(false);

    // ---------- load this user's bookings from the server ----------
    useEffect(() => {
        if (!user?.email) return;
        let cancelled = false;
        const silent = silentReloadRef.current;
        silentReloadRef.current = false;
        if (!silent) setLoading(true);
        setLoadError("");

        getUserBookings(user.email)
            .then((data) => {
                if (!cancelled) setBookings(Array.isArray(data) ? data : []);
            })
            .catch((err) => {
                if (cancelled || silent) return; // a failed quiet refresh keeps the current list
                setLoadError(
                    err instanceof TypeError
                        ? "Could not reach the server. Please check your connection."
                        : err.message
                );
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [user?.email, reloadKey]);

    // ---------- booking modal closed: quietly reload the list so a new booking shows up ----------
    const handleBookingClose = useCallback(() => {
        closeBooking();
        silentReloadRef.current = true;
        setReloadKey((k) => k + 1);
    }, [closeBooking]);

    // ---------- cancel a booking ----------
    const handleCancel = (booking) => {
        Swal.fire({
            title: "Cancel this booking?",
            html: `Are you sure you want to cancel your table for <b>${escapeHtml(booking.guests)} ${Number(booking.guests) === 1 ? "guest" : "guests"
                }</b> on <b>${escapeHtml(formatBookingDate(booking.date))}</b> at <b>${escapeHtml(booking.time)}</b>?<br/>This cannot be undone.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, cancel it",
            cancelButtonText: "Keep booking",
            showLoaderOnConfirm: true,
            customClass: swalTheme,
            allowOutsideClick: () => !Swal.isLoading(),
            // the delete request runs here, so the button shows a loader while waiting
            preConfirm: async () => {
                try {
                    await deleteBooking(booking._id, user.email);
                    return true;
                } catch (error) {
                    Swal.showValidationMessage(
                        error instanceof TypeError
                            ? "Could not reach the server. Please try again."
                            : error.message
                    );
                    return false;
                }
            },
        }).then((result) => {
            if (result.isConfirmed) {
                setBookings((prev) => prev.filter((b) => b._id !== booking._id));
                Swal.fire({
                    title: "Booking cancelled",
                    text: "Your booking has been cancelled.",
                    icon: "success",
                    confirmButtonColor: "#2f6b3f",
                    customClass: swalTheme,
                });
            }
        });
    };

    // ---------- add "upcoming" info to every booking ----------
    const enrichedBookings = useMemo(() => {
        const now = new Date();
        return bookings.map((b) => {
            const when = getBookingDateTime(b.date, b.time);
            return { ...b, whenMs: when ? when.getTime() : 0, upcoming: when ? when >= now : false };
        });
    }, [bookings]);

    // ---------- summary numbers (from ALL of the user's bookings) ----------
    const totalBookings = enrichedBookings.length;
    const upcomingCount = enrichedBookings.filter((b) => b.upcoming).length;
    const totalGuests = enrichedBookings.reduce((sum, b) => sum + (Number(b.guests) || 0), 0);

    const stats = [
        { icon: <FaCalendarCheck />, label: "Total Bookings", value: formatNumber(totalBookings) },
        { icon: <FaCalendarDays />, label: "Upcoming Bookings", value: formatNumber(upcomingCount) },
        { icon: <FaUserGroup />, label: "Total Guests", value: formatNumber(totalGuests) },
    ];

    // ---------- search → sort ----------
    const processedBookings = useMemo(() => {
        const q = searchValue.trim().toLowerCase();
        let list = q
            ? enrichedBookings.filter((b) =>
                `${b.date} ${formatBookingDate(b.date)} ${b.time}`.toLowerCase().includes(q)
            )
            : [...enrichedBookings];

        if (sortOrder === "soonest") {
            list.sort((a, b) => a.whenMs - b.whenMs);
        } else if (sortOrder === "latest") {
            list.sort((a, b) => b.whenMs - a.whenMs);
        } else {
            // most recently booked first – a MongoDB _id grows over time
            list.sort((a, b) => (String(b._id) > String(a._id) ? 1 : String(b._id) < String(a._id) ? -1 : 0));
        }
        return list;
    }, [enrichedBookings, searchValue, sortOrder]);

    // ---------- pagination maths ----------
    const total = processedBookings.length;
    const totalPages = Math.max(1, Math.ceil(total / itemsPerPage));
    const currentPage = Math.min(page, totalPages);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const visibleBookings = processedBookings.slice(startIndex, startIndex + itemsPerPage);
    const showingFrom = total ? startIndex + 1 : 0;
    const showingTo = Math.min(startIndex + itemsPerPage, total);

    const goToPage = (p) => {
        setPage(p);
        topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const handleResetFilters = () => {
        setSearchValue("");
        setSortOrder("newest");
        setPage(1);
    };

    return (
        // min-h-screen + bg-base-200 on the page itself = no empty gap under short pages
        <section className="relative min-h-screen overflow-hidden bg-base-200 pb-14 lg:pb-20">
            <Helmet>
                <title>Elkano64 - My Bookings</title>
            </Helmet>

            {/* decorative leaves */}
            <FaLeaf className="pointer-events-none absolute -left-4 top-6 rotate-[35deg] text-7xl text-secondary/20 lg:text-9xl" />
            <FaLeaf className="pointer-events-none absolute -right-5 top-[16%] -rotate-[35deg] scale-x-[-1] text-7xl text-secondary/20 lg:text-9xl" />

            {/* same container (max width + side padding) as the Navbar */}
            <div className="relative mx-auto max-w-screen-2xl px-3 md:px-8 lg:px-16">
                {/* ---------- Heading ---------- */}
                <div className="pt-8 text-center md:pt-10">
                    <div className="flex items-center justify-center gap-3">
                        <span className="h-px w-10 bg-primary/60 md:w-16" />
                        <FaLeaf className="text-lg text-secondary" />
                        <span className="h-px w-10 bg-primary/60 md:w-16" />
                    </div>

                    <h1 className={`mt-2 font-serif text-3xl font-bold sm:text-4xl lg:text-5xl ${headingColor}`}>
                        My Bookings
                    </h1>
                    <p className="mt-2 text-xs text-base-content/70 sm:text-sm lg:text-base">
                        Manage your table reservations and review your booking history.
                    </p>
                </div>

                {/* ---------- Summary cards ---------- */}
                <div className="mt-6 grid gap-3 sm:grid-cols-3 sm:gap-4 lg:mt-8">
                    {stats.map((s) => (
                        <div
                            key={s.label}
                            className="flex items-center gap-4 rounded-xl border border-base-300 bg-base-100 px-4 py-4 shadow-sm sm:px-5 lg:px-7 lg:py-5"
                        >
                            <span
                                className={`grid h-12 w-12 shrink-0 place-items-center rounded-full bg-base-200 text-xl lg:h-14 lg:w-14 lg:text-2xl ${headingColor}`}
                            >
                                {s.icon}
                            </span>
                            <div className="min-w-0">
                                <p className={`text-xs font-medium sm:text-sm ${headingColor}`}>{s.label}</p>
                                <p className={`truncate font-serif text-2xl font-bold lg:text-3xl ${headingColor}`}>
                                    {loading || loadError ? "—" : s.value}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ---------- Search + sort + items per page ---------- */}
                {!loading && !loadError && bookings.length > 0 && (
                    <div ref={topRef} className="mt-6 scroll-mt-20 flex flex-col gap-3 md:flex-row md:items-end">
                        <label className="relative block min-w-0 md:flex-1">
                            <FaMagnifyingGlass className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/50" />
                            <input
                                type="text"
                                name="search"
                                value={searchValue}
                                onChange={(e) => {
                                    setSearchValue(e.target.value);
                                    setPage(1);
                                }}
                                placeholder="Search by date or time..."
                                aria-label="Search bookings by date or time"
                                className="h-11 w-full rounded-lg border border-base-300 bg-base-100 pl-10 pr-3 text-xs outline-none transition placeholder:text-base-content/50 focus:border-primary sm:text-sm"
                            />
                        </label>

                        <div className="grid grid-cols-[1fr_6.5rem] gap-3 sm:grid-cols-2 md:flex">
                            <label className="block md:w-52">
                                <span className="mb-1 block text-[10px] text-base-content/70">Sort by</span>
                                <select
                                    className={selectClass}
                                    value={sortOrder}
                                    onChange={(e) => {
                                        setSortOrder(e.target.value);
                                        setPage(1);
                                    }}
                                >
                                    <option value="newest">Recently booked</option>
                                    <option value="soonest">Booking date: earliest</option>
                                    <option value="latest">Booking date: lately</option>
                                </select>
                            </label>

                            <label className="block md:w-32">
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
                )}

                {/* ---------- Bookings ---------- */}
                {loading ? (
                    <div
                        role="status"
                        aria-live="polite"
                        className="mt-4 flex flex-col items-center justify-center rounded-xl border border-base-300 bg-base-100 px-6 py-16 text-center shadow-sm"
                    >
                        <span className="loading loading-spinner loading-lg text-primary" />
                        <p className="mt-4 text-sm font-medium text-base-content/70">Loading bookings</p>
                    </div>
                ) : loadError ? (
                    <div
                        role="alert"
                        className="mt-6 flex flex-col items-center rounded-xl border border-dashed border-base-300 bg-base-100 px-6 py-14 text-center"
                    >
                        <FaTriangleExclamation className="text-3xl text-error/80" />
                        <h3 className={`mt-4 font-serif text-xl font-bold ${headingColor}`}>
                            Could not load your bookings
                        </h3>
                        <p className="mt-1 text-sm text-base-content/70">{loadError}</p>
                        <button
                            type="button"
                            onClick={() => setReloadKey((k) => k + 1)}
                            className="btn btn-primary btn-sm mt-5 px-6"
                        >
                            Try again
                        </button>
                    </div>
                ) : bookings.length === 0 ? (
                    <div className="mt-6 flex flex-col items-center rounded-xl border border-dashed border-base-300 bg-base-100 px-6 py-14 text-center">
                        <FaCalendarXmark className="text-3xl text-primary/70" />
                        <h3 className={`mt-4 font-serif text-xl font-bold ${headingColor}`}>No bookings yet</h3>
                        <p className="mt-1 text-sm text-base-content/70">
                            When you book a table, it will show up here.
                        </p>
                        <button type="button" onClick={openBooking} className="btn btn-primary btn-sm mt-5 px-6">
                            Book a table
                        </button>
                    </div>
                ) : total === 0 ? (
                    <div className="mt-4 flex flex-col items-center rounded-xl border border-dashed border-base-300 bg-base-100 px-6 py-14 text-center">
                        <FaMagnifyingGlass className="text-3xl text-primary/70" />
                        <h3 className={`mt-4 font-serif text-xl font-bold ${headingColor}`}>No bookings found</h3>
                        <p className="mt-1 text-sm text-base-content/70">Try a different date or time.</p>
                        <button type="button" onClick={handleResetFilters} className="btn btn-primary btn-sm mt-5 px-6">
                            Reset filters
                        </button>
                    </div>
                ) : (
                    <div className="mt-4 overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-xl">
                        {/* ===== table (md and up) ===== */}
                        <div className="hidden overflow-x-auto md:block">
                            <table className="w-full min-w-[620px] text-left lg:min-w-[820px]">
                                <thead>
                                    <tr>
                                        <th className={`${thClass} w-20`}>ID</th>
                                        <th className={thClass}>Booking Date</th>
                                        <th className={thClass}>Time</th>
                                        <th className={`${thClass} text-center`}>Guests</th>
                                        <th className={thClass}>Status</th>
                                        {/* "Booked On" gets its own column from lg up; on md it moves under the date */}
                                        <th className={`${thClass} hidden lg:table-cell`}>Booked On</th>
                                        <th className={thClass}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {visibleBookings.map((booking, i) => (
                                        <tr
                                            key={booking._id}
                                            className="bg-base-100 transition-colors even:bg-base-200/50 hover:bg-base-200"
                                        >
                                            <td className={`${tdClass} text-base-content/80`}>{startIndex + i + 1}</td>
                                            <td className={`${tdClass} font-medium`}>
                                                {formatBookingDate(booking.date)}
                                                <span className="mt-0.5 block text-[11px] font-normal text-base-content/60 lg:hidden">
                                                    Booked on {formatCreatedAt(booking.createdAt)}
                                                </span>
                                            </td>
                                            <td className={`${tdClass} whitespace-nowrap font-medium`}>{booking.time}</td>
                                            <td className={`${tdClass} text-center`}>
                                                <span className="inline-block min-w-[2rem] rounded-full bg-base-200 px-2.5 py-0.5 text-xs font-medium">
                                                    {booking.guests}
                                                </span>
                                            </td>
                                            <td className={tdClass}>
                                                <StatusBadge upcoming={booking.upcoming} />
                                            </td>
                                            <td className={`${tdClass} hidden text-base-content/80 lg:table-cell`}>
                                                {formatCreatedAt(booking.createdAt)}
                                            </td>
                                            <td className={tdClass}>
                                                <button
                                                    type="button"
                                                    onClick={() => handleCancel(booking)}
                                                    disabled={!booking.upcoming}
                                                    title={booking.upcoming ? "Cancel this booking" : "Past bookings cannot be cancelled"}
                                                    className={cancelBtnClass}
                                                >
                                                    <FaCalendarXmark className="text-[11px]" /> Cancel
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* ===== card list (below md) ===== */}
                        <ul className="divide-y divide-base-300/60 md:hidden">
                            {visibleBookings.map((booking, i) => (
                                <li key={booking._id} className="p-4 even:bg-base-200/50">
                                    {/* top row: number, date + time, status */}
                                    <div className="flex items-start gap-3">
                                        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-base-200 text-xs font-semibold">
                                            {startIndex + i + 1}
                                        </span>

                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-semibold">{formatBookingDate(booking.date)}</p>
                                            <p className="mt-0.5 text-xs text-base-content/80">{booking.time}</p>
                                        </div>

                                        <StatusBadge upcoming={booking.upcoming} />
                                    </div>

                                    {/* bottom row: details + cancel (its own row, so nothing gets squeezed on small phones) */}
                                    <div className="mt-3 flex items-end justify-between gap-3 pl-10">
                                        <div className="min-w-0 space-y-1 text-xs">
                                            <p className="text-base-content/70">
                                                Guests:{" "}
                                                <span className="font-semibold text-base-content">{booking.guests}</span>
                                            </p>
                                            <p className="text-[11px] text-base-content/60">
                                                Booked on {formatCreatedAt(booking.createdAt)}
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => handleCancel(booking)}
                                            disabled={!booking.upcoming}
                                            aria-label={`Cancel booking on ${formatBookingDate(booking.date)} at ${booking.time}`}
                                            className={cancelBtnClass}
                                        >
                                            <FaCalendarXmark className="text-[11px]" /> Cancel
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        {/* ===== footer: showing text + pagination ===== */}
                        <div className="flex flex-col items-center gap-3 border-t border-base-300 px-4 py-4 sm:flex-row sm:justify-between sm:px-6">
                            <p className="text-xs text-base-content/70">
                                Showing {showingFrom}–{showingTo} of {total} {total === 1 ? "booking" : "bookings"}
                            </p>

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
                        </div>
                    </div>
                )}
            </div>

            {/* ---------- table booking modal ---------- */}
            {bookingOpen && <BookingModal onClose={handleBookingClose} />}
        </section>
    );
};

export default MyBookings;