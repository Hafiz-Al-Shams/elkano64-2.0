/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import {
    FaArrowRight,
    FaBell,
    FaCartShopping,
    FaCheck,
    FaChevronRight,
    FaPercent,
    FaRegUser,
} from "react-icons/fa6";
import { MdTableRestaurant } from "react-icons/md";

// 👉 Replace these two thumbnails with your own food photos whenever you like
const BIRYANI_IMG =
    "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=200&q=80";
const PIZZA_IMG =
    "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=200&q=80";

const initialNotifications = [
    {
        id: 1,
        title: "Order Placed Successfully",
        text: "Your order #ELK-1025 has been placed and is being prepared.",
        time: "12 minutes ago",
        unread: true,
        Icon: FaCartShopping,
    },
    {
        id: 2,
        title: "Order Confirmed",
        text: "Your order for Kacchi Biryani has been confirmed. Estimated delivery: 35 mins.",
        time: "45 minutes ago",
        unread: false,
        image: BIRYANI_IMG,
    },
    {
        id: 3,
        title: "Table Booking Confirmed",
        text: "Your table booking for 4 people on Oct 26, 2025 at 7:00 PM is confirmed.",
        time: "2 hours ago",
        unread: false,
        Icon: MdTableRestaurant,
    },
    {
        id: 4,
        title: "Order Shipped",
        text: "Your order #ELK-1018 is out for delivery.",
        time: "4 hours ago",
        unread: true,
        image: PIZZA_IMG,
    },
    {
        id: 5,
        title: "New Review",
        text: "A new review has been added for Butter Chicken.",
        time: "1 day ago",
        unread: false,
        Icon: FaRegUser,
    },
    {
        id: 6,
        title: "Special Offer",
        text: "Get 15% OFF on all pasta dishes this weekend!",
        time: "1 day ago",
        unread: false,
        Icon: FaPercent,
        accent: true,
    },
];

// dark-green headings in light mode, light text in dark mode
const headingColor = "text-neutral [[data-theme=elkanoDark]_&]:text-base-content";

const Leading = ({ item }) => {
    if (item.image) {
        return (
            <img
                src={item.image}
                alt=""
                className="h-12 w-12 shrink-0 rounded-lg object-cover sm:h-14 sm:w-14"
            />
        );
    }
    const Icon = item.Icon;
    return (
        <div
            className={`grid h-12 w-12 shrink-0 place-items-center rounded-full text-xl text-white sm:h-14 sm:w-14 sm:text-2xl ${item.accent ? "bg-primary" : "bg-[#4B5A3C]"
                }`}
        >
            <Icon />
        </div>
    );
};

const NotificationDropdown = () => {
    const wrapperRef = useRef(null);

    const [open, setOpen] = useState(false);
    const [items, setItems] = useState(initialNotifications);
    const [badgeCount, setBadgeCount] = useState(3);

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

    const handleMarkAllRead = () => {
        setItems((prev) => prev.map((n) => ({ ...n, unread: false })));
        setBadgeCount(0);
    };

    return (
        // static on small screens (panel is positioned against the navbar),
        // relative from md up (panel hangs under the bell with an arrow)
        <div ref={wrapperRef} className="static md:relative">
            {/* ---------- Bell button ---------- */}
            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                aria-label="Notifications"
                aria-haspopup="true"
                aria-expanded={open}
                className={`btn btn-ghost btn-circle btn-sm md:btn-md ${open ? "border-base-300 bg-base-200" : ""
                    }`}
            >
                <div className="indicator">
                    <FaBell className="text-base" />
                    {badgeCount > 0 && (
                        <span className="badge badge-primary indicator-item h-4 min-h-0 min-w-4 border-0 px-1 text-[10px] font-semibold">
                            {badgeCount}
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
                        className="flex items-center gap-2 whitespace-nowrap text-xs font-medium text-primary hover:underline sm:text-sm"
                    >
                        <FaCheck className="text-sm" /> Mark all as read
                    </button>
                </div>

                {/* list (vertical scroll only when there are many notifications) */}
                <ul className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-2 sm:px-2.5">
                    {items.map((item, index) => (
                        <li
                            key={item.id}
                            className={index !== items.length - 1 && !item.unread ? "border-b border-base-300/80" : ""}
                        >
                            <button
                                type="button"
                                className={`flex w-full items-start gap-3 rounded-xl px-3 py-3.5 text-left transition-colors sm:gap-4 sm:px-4 sm:py-4 ${item.unread ? "bg-base-300/60" : "hover:bg-base-200"
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
                                    <p className="mt-1.5 text-[11px] text-base-content/60 sm:text-xs">{item.time}</p>
                                </div>

                                <div className={`flex shrink-0 items-center gap-2 ${item.unread ? "self-start pt-1" : "self-center"}`}>
                                    {item.unread && <span className="h-2 w-2 rounded-full bg-primary" />}
                                    <FaChevronRight className="text-sm text-base-content/70" />
                                </div>
                            </button>
                        </li>
                    ))}
                </ul>

                {/* footer */}
                <div className="mx-2 border-t border-base-300/80 px-3 py-4 text-center sm:mx-2.5">
                    <button
                        type="button"
                        className="inline-flex items-center gap-2 text-xs font-medium text-primary hover:underline sm:text-sm"
                    >
                        View All Notifications <FaArrowRight />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotificationDropdown;