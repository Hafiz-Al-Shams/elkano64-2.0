import { useContext, useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import Swal from "sweetalert2";
import { FaBars, FaMagnifyingGlass } from "react-icons/fa6";
import AuthContext from "../../context/AuthContext/AuthContext";
import SearchModal from "../../components/SearchModal";
import NotificationDropdown from "../../components/NotificationDropdown";
import AccountDropdown from "../../components/AccountDropdown";
import RouteLoader from "../../components/RouteLoader";

// Pages that really exist as routes
const routeLinks = [
    { label: "Home", to: "/", end: true },
    { label: "All Foods", to: "/all-foods" },
    { label: "Gallery", to: "/gallery" },
];

// Sections on the home page / footer (smooth-scrolled by Home.jsx)
const hashLinks = [
    { label: "About", to: "/#about" },
    { label: "Contact", to: "/#contact" },
];

const closeDropdown = () => document.activeElement?.blur();

const Navbar = () => {
    const { user, signOutUser } = useContext(AuthContext);

    const [profilePhoto, setProfilePhoto] = useState("");
    const [userName, setUserName] = useState("");
    const [searchOpen, setSearchOpen] = useState(false);

    useEffect(() => {
        if (user) {
            setProfilePhoto(user.photoURL);
            setUserName(user.displayName);
        }
    }, [user]);

    const handleLogOut = () => {
        closeDropdown();
        signOutUser()
            .then(() => {
                Swal.fire({
                    position: "center",
                    icon: "warning",
                    title: "Log out done!",
                    showConfirmButton: false,
                    timer: 2000,
                });
            })
            .catch((error) => console.log("ERROR", error.message));
    };

    const desktopLinkClass = ({ isActive }) =>
        `relative py-2 text-sm font-medium transition-colors hover:text-primary ${isActive
            ? "text-primary after:absolute after:-bottom-0.5 after:left-0 after:h-0.5 after:w-full after:bg-primary"
            : ""
        }`;

    const desktopLinks = (
        <>
            {routeLinks.map((l) => (
                <li key={l.label}>
                    <NavLink to={l.to} end={l.end} className={desktopLinkClass}>
                        {l.label}
                    </NavLink>
                </li>
            ))}
            {hashLinks.map((l) => (
                <li key={l.label}>
                    <Link to={l.to} className="py-2 text-sm font-medium transition-colors hover:text-primary">
                        {l.label}
                    </Link>
                </li>
            ))}
        </>
    );

    const mobileLinks = (
        <>
            {routeLinks.map((l) => (
                <li key={l.label}>
                    <NavLink to={l.to} end={l.end} onClick={closeDropdown}>
                        {l.label}
                    </NavLink>
                </li>
            ))}
            {hashLinks.map((l) => (
                <li key={l.label}>
                    <Link to={l.to} onClick={closeDropdown}>
                        {l.label}
                    </Link>
                </li>
            ))}
        </>
    );

    return (
        <header className="sticky top-0 z-50 border-b border-base-300/60 bg-base-100/95 text-base-content shadow-sm backdrop-blur">
            <div className="mx-auto flex h-14 lg:h-16 max-w-screen-2xl items-center justify-between gap-2 px-3 md:px-8 lg:px-16">
                {/* ---------- Left : burger + logo ---------- */}
                <div className="flex min-w-0 items-center gap-1">
                    <div className="dropdown lg:hidden">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-sm px-2" aria-label="Open menu">
                            <FaBars className="text-lg" />
                        </div>
                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content z-[60] mt-3 w-52 space-y-1 rounded-box border border-base-300 bg-base-100 p-2 shadow-xl"
                        >
                            {mobileLinks}
                        </ul>
                    </div>

                    <Link to="/" className="leading-none">
                        <span className="block font-serif text-xl font-bold md:text-2xl lg:text-[28px]">Elkano64</span>
                        <span className="mt-1 hidden text-[10px] tracking-wide text-base-content/60 sm:block">
                            Good Food <span className="mx-1 text-primary">•</span> Great Moments
                        </span>
                    </Link>
                </div>

                {/* ---------- Center : links ---------- */}
                <nav className="hidden lg:block">
                    <ul className="flex items-center gap-10">{desktopLinks}</ul>
                </nav>

                {/* ---------- Right : search + auth area ---------- */}
                <div className="flex shrink-0 items-center gap-1.5 md:gap-3">
                    <button
                        type="button"
                        onClick={() => setSearchOpen(true)}
                        aria-label="Search foods"
                        className="btn btn-ghost btn-circle btn-sm md:btn-md"
                    >
                        <FaMagnifyingGlass className="text-base" />
                    </button>

                    {user ? (
                        /* ============ LOGGED IN ============ */
                        <>
                            <NotificationDropdown />

                            <div
                                data-tooltip-id="my-tooltip"
                                data-tooltip-content={userName}
                                data-tooltip-place="bottom"
                            >
                                {profilePhoto ? (
                                    <img
                                        className="h-8 w-8 rounded-full object-cover ring-2 ring-primary/60 md:h-10 md:w-10"
                                        src={profilePhoto}
                                        alt="photo"
                                    />
                                ) : (
                                    <div className="grid h-8 w-8 place-items-center rounded-full bg-primary text-sm font-bold text-primary-content md:h-10 md:w-10">
                                        {(userName || user?.email || "U").charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>

                            <AccountDropdown user={user} onLogOut={handleLogOut} />
                        </>
                    ) : (
                        /* ============ LOGGED OUT ============ */
                        <>
                            <NavLink
                                to="/signIn"
                                className="btn btn-outline btn-sm h-8 min-h-0 rounded-full border-base-content/30 px-4 text-xs font-medium normal-case md:px-5"
                            >
                                Login
                            </NavLink>
                            {/* Register: hidden on small screens (reachable from the Login page), shown from md up */}
                            <NavLink
                                to="/register"
                                className="btn btn-primary btn-sm hidden h-8 min-h-0 rounded-full px-5 text-xs font-medium normal-case md:inline-flex"
                            >
                                Register
                            </NavLink>
                        </>
                    )}

                    <Tooltip id="my-tooltip" />
                </div>
            </div>

            {/* ---------- Search modal (opens from the search icon) ---------- */}
            {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}

            {/* ---------- Page loading bar (shown while a page's data is loading) ---------- */}
            <RouteLoader />
        </header>
    );
};

export default Navbar;