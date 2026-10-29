/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import {
    FaArrowRightFromBracket,
    FaBagShopping,
    FaCalendarCheck,
    FaChevronDown,
    FaChevronRight,
    FaChevronUp,
    FaPlus,
    FaUtensils,
} from "react-icons/fa6";

// dark-green headings in light mode, light text in dark mode
const headingColor = "text-neutral [[data-theme=elkanoDark]_&]:text-base-content";

const AccountDropdown = ({ user, onLogOut }) => {
    const wrapperRef = useRef(null);
    const [open, setOpen] = useState(false);

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

    const closeMenu = () => setOpen(false);

    const links = [
        { label: "My Foods", to: `/my-foods/${user?.email}`, Icon: FaUtensils },
        { label: "Add food", to: "/add-food", Icon: FaPlus },
        { label: "My Orders", to: "/my-orders", Icon: FaBagShopping },
        { label: "My Bookings", to: "/my-bookings", Icon: FaCalendarCheck },
    ];

    const handleLogOutClick = () => {
        closeMenu();
        onLogOut();
    };

    return (
        <div ref={wrapperRef} className="relative">
            {/* ---------- My Account button ---------- */}
            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                aria-haspopup="true"
                aria-expanded={open}
                className="btn btn-sm md:btn-md gap-2 border-base-300 bg-base-100 px-2.5 text-xs font-medium md:px-4 md:text-sm"
            >
                <span className="hidden sm:inline">My Account</span>
                {open ? <FaChevronUp className="text-[10px]" /> : <FaChevronDown className="text-[10px]" />}
            </button>

            {/* ---------- Dropdown panel ---------- */}
            <div
                className={`absolute right-0 top-full z-[60] mt-3 w-52 origin-top-right rounded-2xl border border-base-300 bg-base-100 p-2 text-base-content shadow-2xl transition-all duration-200 md:w-60 ${open
                    ? "visible translate-y-0 scale-100 opacity-100"
                    : "pointer-events-none invisible -translate-y-2 scale-95 opacity-0"
                    }`}
            >
                {/* arrow pointing to the button */}
                <span className="absolute -top-2 right-3 h-4 w-4 rotate-45 border-l border-t border-base-300 bg-base-100 sm:right-6" />

                <ul className="relative">
                    {links.map(({ label, to, Icon }) => (
                        <li key={label} className="border-b border-base-300/80">
                            <NavLink
                                to={to}
                                onClick={closeMenu}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 rounded-xl px-3 py-3 transition-colors ${isActive ? "bg-base-300/60" : "hover:bg-base-200"
                                    }`
                                }
                            >
                                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#4B5A3C] text-sm text-white">
                                    <Icon />
                                </span>
                                <span className={`min-w-0 flex-1 truncate font-serif text-[15px] font-bold ${headingColor}`}>
                                    {label}
                                </span>
                                <FaChevronRight className="shrink-0 text-sm text-base-content/70" />
                            </NavLink>
                        </li>
                    ))}
                </ul>

                {/* log out (same function as before) */}
                <div className="relative px-2 pb-1 pt-3 text-center">
                    <button
                        type="button"
                        onClick={handleLogOutClick}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                    >
                        <FaArrowRightFromBracket /> Log Out
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AccountDropdown;