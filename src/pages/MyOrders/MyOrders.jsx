import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../context/AuthContext/AuthContext";
import { Helmet } from "react-helmet-async";
import Swal from "sweetalert2";
import {
    FaBoxOpen,
    FaCartShopping,
    FaChevronLeft,
    FaChevronRight,
    FaCoins,
    FaLeaf,
    FaMagnifyingGlass,
    FaReceipt,
    FaTrashCan,
} from "react-icons/fa6";

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

const formatNumber = (n) => Number(n).toLocaleString("en-US", { maximumFractionDigits: 2 });
const formatMoney = (n) => `$${formatNumber(n)}`;

// The global `th` / `td` rules in index.css are overridden here with utility classes,
// so index.css itself does not need to change.
const thClass = `border-0 border-b border-base-300 bg-transparent px-4 py-3.5 text-[13px] font-bold first:pl-6 last:pr-6 ${headingColor}`;
const tdClass =
    "border-0 border-b border-base-300/60 px-4 py-2.5 text-sm font-normal first:pl-6 last:pr-6";

const selectClass =
    "select select-bordered h-11 min-h-0 w-full rounded-lg border-base-300 bg-base-100 text-xs focus:border-primary focus:outline-none sm:text-sm";

const MyOrders = () => {
    const { user } = useContext(AuthContext);

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // search / sorting / pagination
    const [searchValue, setSearchValue] = useState("");
    const [sortOrder, setSortOrder] = useState("newest"); // newest | asc | desc
    const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE_OPTIONS[0]); // default 10
    const [page, setPage] = useState(1);

    const topRef = useRef(null);

    useEffect(() => {
        if (!user?.email) return;
        let cancelled = false;
        setLoading(true);

        fetch(`https://elkano64-server.vercel.app/my-orders?email=${user.email}`)
            .then((res) => res.json())
            .then((data) => {
                if (!cancelled) setOrders(Array.isArray(data) ? data : []);
            })
            .catch((err) => console.log("ERROR", err.message))
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [user?.email]);

    const handleDelete = (_id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`https://elkano64-server.vercel.app/my-orders/${_id}`, {
                    method: "DELETE",
                })
                    .then((res) => res.json())
                    .then((data) => {
                        if (data.deletedCount > 0) {
                            Swal.fire({
                                title: "Deleted!",
                                text: "Your order has been deleted.",
                                icon: "success",
                            });
                            setOrders((prev) => prev.filter((order) => order._id !== _id));
                        }
                    });
            }
        });
    };

    // ---------- summary numbers (always from ALL of the user's orders, straight from the database) ----------
    const totalOrders = orders.length;
    const itemsPurchased = orders.reduce((sum, o) => sum + (Number(o.numQuantity) || 0), 0);
    const totalSpent = orders.reduce((sum, o) => sum + (Number(o.totalPrice) || 0), 0);

    const stats = [
        { icon: <FaCartShopping />, label: "Total Orders", value: formatNumber(totalOrders) },
        { icon: <FaBoxOpen />, label: "Items Purchased", value: formatNumber(itemsPurchased) },
        { icon: <FaCoins />, label: "Total Spent", value: formatMoney(totalSpent) },
    ];

    // ---------- search → sort ----------
    const processedOrders = useMemo(() => {
        const q = searchValue.trim().toLowerCase();
        let list = q ? orders.filter((o) => (o.name ?? "").toLowerCase().includes(q)) : [...orders];

        if (sortOrder === "asc") {
            list.sort((a, b) => (Number(a.totalPrice) || 0) - (Number(b.totalPrice) || 0));
        } else if (sortOrder === "desc") {
            list.sort((a, b) => (Number(b.totalPrice) || 0) - (Number(a.totalPrice) || 0));
        } else {
            // newest first – a MongoDB _id grows over time, so this does not depend on the date text format
            list.sort((a, b) => (String(b._id) > String(a._id) ? 1 : String(b._id) < String(a._id) ? -1 : 0));
        }
        return list;
    }, [orders, searchValue, sortOrder]);

    // ---------- pagination maths ----------
    const total = processedOrders.length;
    const totalPages = Math.max(1, Math.ceil(total / itemsPerPage));
    const currentPage = Math.min(page, totalPages);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const visibleOrders = processedOrders.slice(startIndex, startIndex + itemsPerPage);
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
                <title>Elkano64 - My Orders</title>
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
                        My Orders
                    </h1>
                    <p className="mt-2 text-xs text-base-content/70 sm:text-sm lg:text-base">
                        Track your orders and review your purchase history.
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
                                    {loading ? "—" : s.value}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ---------- Search + sort + items per page ---------- */}
                {(loading || orders.length > 0) && (
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
                                placeholder="Search food..."
                                aria-label="Search food"
                                className="h-11 w-full rounded-lg border border-base-300 bg-base-100 pl-10 pr-3 text-xs outline-none transition placeholder:text-base-content/50 focus:border-primary sm:text-sm"
                            />
                        </label>

                        <div className="grid grid-cols-[1fr_6.5rem] gap-3 sm:grid-cols-2 md:flex">
                            <label className="block md:w-48">
                                <span className="mb-1 block text-[10px] text-base-content/70">Sort by</span>
                                <select
                                    className={selectClass}
                                    value={sortOrder}
                                    onChange={(e) => {
                                        setSortOrder(e.target.value);
                                        setPage(1);
                                    }}
                                >
                                    <option value="newest">Newest First</option>
                                    <option value="asc">Price low to high</option>
                                    <option value="desc">Price high to low</option>
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

                {/* ---------- Orders ---------- */}
                {loading ? (
                    <div
                        role="status"
                        aria-live="polite"
                        className="mt-4 flex flex-col items-center justify-center rounded-xl border border-base-300 bg-base-100 px-6 py-16 text-center shadow-sm"
                    >
                        <span className="loading loading-spinner loading-lg text-primary" />
                        <p className="mt-4 text-sm font-medium text-base-content/70">Loading orders</p>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="mt-6 flex flex-col items-center rounded-xl border border-dashed border-base-300 bg-base-100 px-6 py-14 text-center">
                        <FaReceipt className="text-3xl text-primary/70" />
                        <h3 className={`mt-4 font-serif text-xl font-bold ${headingColor}`}>No orders yet</h3>
                        <p className="mt-1 text-sm text-base-content/70">
                            When you purchase a dish, it will show up here.
                        </p>
                        <Link to="/all-foods" className="btn btn-primary btn-sm mt-5 px-6">
                            Browse foods
                        </Link>
                    </div>
                ) : total === 0 ? (
                    <div className="mt-4 flex flex-col items-center rounded-xl border border-dashed border-base-300 bg-base-100 px-6 py-14 text-center">
                        <FaMagnifyingGlass className="text-3xl text-primary/70" />
                        <h3 className={`mt-4 font-serif text-xl font-bold ${headingColor}`}>No orders found</h3>
                        <p className="mt-1 text-sm text-base-content/70">Try a different food name.</p>
                        <button type="button" onClick={handleResetFilters} className="btn btn-primary btn-sm mt-5 px-6">
                            Reset filters
                        </button>
                    </div>
                ) : (
                    <div className="mt-4 overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-xl">
                        {/* ===== table (md and up) ===== */}
                        <div className="hidden overflow-x-auto md:block">
                            <table className="w-full min-w-[680px] text-left">
                                <thead>
                                    <tr>
                                        <th className={`${thClass} w-20`}>ID</th>
                                        <th className={thClass}>Food Name</th>
                                        <th className={`${thClass} text-center`}>Order Quantity</th>
                                        <th className={thClass}>Total Price</th>
                                        <th className={thClass}>Purchase Date &amp; Time</th>
                                        <th className={thClass}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {visibleOrders.map((order, i) => (
                                        <tr
                                            key={order._id}
                                            className="bg-base-100 transition-colors even:bg-base-200/50 hover:bg-base-200"
                                        >
                                            <td className={`${tdClass} text-base-content/80`}>{startIndex + i + 1}</td>
                                            <td className={`${tdClass} font-medium`}>{order.name}</td>
                                            <td className={`${tdClass} text-center`}>
                                                <span className="inline-block min-w-[2rem] rounded-full bg-base-200 px-2.5 py-0.5 text-xs font-medium">
                                                    {order.numQuantity}
                                                </span>
                                            </td>
                                            <td className={`${tdClass} font-medium`}>
                                                {formatMoney(Number(order.totalPrice) || 0)}
                                            </td>
                                            <td className={`${tdClass} text-base-content/80`}>
                                                {order.buyingDate || "—"}
                                            </td>
                                            <td className={tdClass}>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(order._id)}
                                                    className="btn btn-outline btn-primary btn-sm gap-1.5 text-xs font-normal normal-case"
                                                >
                                                    <FaTrashCan className="text-[11px]" /> Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* ===== card list (below md) ===== */}
                        <ul className="divide-y divide-base-300/60 md:hidden">
                            {visibleOrders.map((order, i) => (
                                <li key={order._id} className="flex items-start gap-3 p-4 even:bg-base-200/50">
                                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-base-200 text-xs font-semibold">
                                        {startIndex + i + 1}
                                    </span>

                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-semibold">{order.name}</p>
                                        <p className="mt-0.5 text-[11px] text-base-content/70">
                                            {order.buyingDate || "—"}
                                        </p>
                                        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                                            <span className="text-base-content/70">
                                                Qty:{" "}
                                                <span className="font-semibold text-base-content">
                                                    {order.numQuantity}
                                                </span>
                                            </span>
                                            <span className="font-bold text-primary">
                                                {formatMoney(Number(order.totalPrice) || 0)}
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => handleDelete(order._id)}
                                        aria-label={`Delete order of ${order.name}`}
                                        className="btn btn-outline btn-primary btn-sm gap-1.5 text-xs font-normal normal-case"
                                    >
                                        <FaTrashCan className="text-[11px]" /> Delete
                                    </button>
                                </li>
                            ))}
                        </ul>

                        {/* ===== footer: showing text + pagination ===== */}
                        <div className="flex flex-col items-center gap-3 border-t border-base-300 px-4 py-4 sm:flex-row sm:justify-between sm:px-6">
                            <p className="text-xs text-base-content/70">
                                Showing {showingFrom}–{showingTo} of {total} {total === 1 ? "order" : "orders"}
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
        </section>
    );
};

export default MyOrders;