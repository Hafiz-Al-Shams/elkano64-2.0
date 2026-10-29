/* eslint-disable react/prop-types */
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import {
    FaBell,
    FaCalendarXmark,
    FaCartShopping,
    FaCheck,
    FaChevronRight,
    FaPenToSquare,
    FaTrashCan,
    FaUtensils,
} from "react-icons/fa6";
import { MdTableRestaurant } from "react-icons/md";
import AuthContext from "../context/AuthContext/AuthContext";
import { getNotifications, markAllNotificationsRead } from "../utils/notificationApi";

// how often the bell quietly checks the server for new activity
const POLL_INTERVAL_MS = 30 * 1000;

// icon + color for every activity type the server creates
const typeConfig = {
    order_created: { Icon: FaCartShopping },
    booking_created: { Icon: MdTableRestaurant },
    food_added: { Icon: FaUtensils },
    food_updated: { Icon: FaPenToSquare },
    order_deleted: { Icon: FaTrashCan, accent: true },
    booking_deleted: { Icon: FaCalendarXmark, accent: true },
};

// turns a date into "just now", "12 minutes ago", "2 days ago" ...
const timeAgo = (value) => {
    const then = new Date(value).getTime();
    if (isNaN(then)) return "";

    const seconds = Math.max(0, Math.floor((Date.now() - then) / 1000));
    if (seconds < 60) return "Just now";

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;

    const days = Math.floor(hours / 24);
    return `${days} ${days === 1 ? "day" : "days"} ago`;
};

// dark-green headings in light mode, light text in dark mode
const headingColor = "text-neutral [[data-theme=elkanoDark]_&]:text-base-content";

const Leading = ({ item }) => {
    const config = typeConfig[item.type] || {};
    const Icon = config.Icon || FaBell;
    return (
        <div
            className={`grid h-12 w-12 shrink-0 place-items-center rounded-full text-xl text-white sm:h-14 sm:w-14 sm:text-2xl ${config.accent ? "bg-primary" : "bg-[#4B5A3C]"
                }`}
        >
            <Icon />
        </div>
    );
};

const NotificationDropdown = () => {
    const { user } = useContext(AuthContext);
    const email = (user?.email || "").trim().toLowerCase();

    const wrapperRef = useRef(null);
    const mountedRef = useRef(false);

    const [open, setOpen] = useState(false);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // the bell number = real unread notifications saved in the database
    const unreadCount = items.filter((n) => !n.read).length;

    // keeps track of whether the component is still on screen (avoids updating state after unmount)
    useEffect(() => {
        mountedRef.current = true;
        return () => {
            mountedRef.current = false;
        };
    }, []);

    // loads this user's notifications from the server
    const loadNotifications = useCallback(async () => {
        if (!email) return;
        try {
            const data = await getNotifications(email);
            if (!mountedRef.current) return;
            setItems(Array.isArray(data) ? data : []);
            setError("");
        } catch (err) {
            if (!mountedRef.current) return;
            setError(err.message || "Failed to load notifications.");
        } finally {
            if (mountedRef.current) setLoading(false);
        }
    }, [email]);

    // load on first render, then keep checking quietly so new activity appears without a reload
    useEffect(() => {
        if (!email) return;

        loadNotifications();

        const refreshIfVisible = () => {
            if (!document.hidden) loadNotifications();
        };

        const intervalId = setInterval(refreshIfVisible, POLL_INTERVAL_MS);
        document.addEventListener("visibilitychange", refreshIfVisible);
        window.addEventListener("focus", refreshIfVisible);

        return () => {
            clearInterval(intervalId);
            document.removeEventListener("visibilitychange", refreshIfVisible);
            window.removeEventListener("focus", refreshIfVisible);
        };
    }, [email, loadNotifications]);

    // close on outside click / touch and on Esc (only while open)
    useEffect(() => {
        if (!open) return;

        const handleOutside = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        const handleKeyDown = (e) => {
            if (e.key === "Escape") setOpen(false);
        };

        document.addEventListener("mousedown", handleOutside);
        document.addEventListener("touchstart", handleOutside);
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("mousedown", handleOutside);
            document.removeEventListener("touchstart", handleOutside);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [open]);

    const handleToggle = () => {
        // always show the freshest activity when the panel opens
        if (!open) loadNotifications();
        setOpen((prev) => !prev);
    };

    const handleMarkAllRead = async () => {
        if (!email || unreadCount === 0) return;

        const previousItems = items;

        // update the screen instantly, then save it in the database
        setItems((prev) => prev.map((n) => ({ ...n, read: true })));
        setError("");

        try {
            await markAllNotificationsRead(email);
        } catch {
            // saving failed -> put the red dots back so the screen never lies
            if (!mountedRef.current) return;
            setItems(previousItems);
            setError("Could not mark notifications as read. Please try again.");
        }
    };

    return (
        // static on small screens (panel is positioned against the navbar),
        // relative from md up (panel hangs under the bell with an arrow)
        <div ref={wrapperRef} className="static md:relative">
            {/* ---------- Bell button ---------- */}
            <button
                type="button"
                onClick={handleToggle}
                aria-label="Notifications"
                aria-haspopup="true"
                aria-expanded={open}
                className={`btn btn-ghost btn-circle btn-sm md:btn-md ${open ? "border-base-300 bg-base-200" : ""
                    }`}
            >
                <div className="indicator">
                    <FaBell className="text-base" />
                    {unreadCount > 0 && (
                        <span className="badge badge-primary indicator-item h-4 min-h-0 min-w-4 border-0 px-1 text-[10px] font-semibold">
                            {unreadCount > 99 ? "99+" : unreadCount}
                        </span>
                    )}
                </div>
            </button>

            {/* ---------- Dropdown panel ---------- */}
            <div
                className={`absolute inset-x-3 top-full z-[60] mt-2 flex max-h-[calc(100vh-5.5rem)] origin-top-right flex-col rounded-2xl border border-base-300 bg-base-100 text-base-content shadow-2xl transition-all duration-200 md:inset-x-auto md:-right-10 md:mt-3 md:w-[480px] lg:w-[540px] ${open
                    ? "visible translate-y-0 scale-100 opacity-100"
                    : "pointer-events-none invisible -translate-y-2 scale-95 opacity-0"
                    }`}
            >
                {/* arrow pointing to the bell (md and up) */}
                <span className="absolute -top-2 right-[57px] hidden h-4 w-4 rotate-45 border-l border-t border-base-300 bg-base-100 md:block" />

                {/* header */}
                <div className="flex items-center justify-between gap-3 px-5 pb-3 pt-5 sm:px-7">
                    <h3 className={`font-serif text-xl font-bold sm:text-2xl ${headingColor}`}>Notifications</h3>
                    <button
                        type="button"
                        onClick={handleMarkAllRead}
                        disabled={unreadCount === 0}
                        className="flex items-center gap-2 whitespace-nowrap text-xs font-medium text-primary hover:underline disabled:cursor-default disabled:opacity-50 disabled:no-underline sm:text-sm"
                    >
                        <FaCheck className="text-sm" /> Mark all as read
                    </button>
                </div>

                {/* small error line (only when something went wrong) */}
                {error && <p className="px-5 pb-2 text-xs text-error sm:px-7">{error}</p>}

                {/* list (vertical scroll only when there are many notifications) */}
                <ul className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden rounded-b-2xl px-2 pb-3 sm:px-2.5 sm:pb-3.5">
                    {/* first load */}
                    {loading && items.length === 0 && !error && (
                        <li className="px-4 py-10 text-center text-sm text-base-content/60">
                            Loading notifications...
                        </li>
                    )}

                    {/* nothing to show yet */}
                    {!loading && items.length === 0 && !error && (
                        <li className="flex flex-col items-center gap-2 px-4 py-10 text-center">
                            <span className="grid h-12 w-12 place-items-center rounded-full bg-base-200 text-xl text-base-content/60">
                                <FaBell />
                            </span>
                            <p className={`font-serif text-base font-bold ${headingColor}`}>No activity yet</p>
                            <p className="text-xs text-base-content/60 sm:text-sm">
                                Your orders, bookings and food updates will show up here.
                            </p>
                        </li>
                    )}

                    {items.map((item, index) => {
                        const unread = !item.read;
                        return (
                            <li
                                key={item._id}
                                className={index !== items.length - 1 && !unread ? "border-b border-base-300/80" : ""}
                            >
                                <button
                                    type="button"
                                    className={`flex w-full items-start gap-3 rounded-xl px-3 py-3.5 text-left transition-colors sm:gap-4 sm:px-4 sm:py-4 ${unread ? "bg-base-300/60" : "hover:bg-base-200"
                                        }`}
                                >
                                    <Leading item={item} />

                                    <div className="min-w-0 flex-1">
                                        <p className={`break-words font-serif text-[15px] font-bold leading-snug sm:text-base ${headingColor}`}>
                                            {item.title}
                                        </p>
                                        <p className="mt-1 break-words text-xs leading-relaxed text-base-content/70 sm:text-sm">
                                            {item.text}
                                        </p>
                                        <p className="mt-1.5 text-[11px] text-base-content/60 sm:text-xs">
                                            {timeAgo(item.createdAt)}
                                        </p>
                                    </div>

                                    <div className={`flex shrink-0 items-center gap-2 ${unread ? "self-start pt-1" : "self-center"}`}>
                                        {unread && <span className="h-2 w-2 rounded-full bg-primary" />}
                                        <FaChevronRight className="text-sm text-base-content/70" />
                                    </div>
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
};

export default NotificationDropdown;