import { useContext, useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext/AuthContext";
import Swal from "sweetalert2";
import { Helmet } from "react-helmet-async";
import {
    FaArrowRight,
    FaCalendarDays,
    FaCartShopping,
    FaCube,
    FaDollarSign,
    FaEnvelope,
    FaLeaf,
    FaMinus,
    FaPlus,
    FaTag,
    FaUser,
    FaUtensils,
} from "react-icons/fa6";

// dark-green headings in light mode, light text in dark mode
const headingColor = "text-neutral [[data-theme=elkanoDark]_&]:text-base-content";

// shared field styles
const labelClass = `mb-1.5 block text-sm font-semibold ${headingColor}`;
const iconClass =
    "pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-base-content/60";
const editableClass =
    "h-11 w-full rounded-lg border border-base-300 bg-base-100 pl-10 pr-3.5 text-sm outline-none transition placeholder:text-base-content/50 focus:border-primary";
const readOnlyClass =
    "h-11 w-full cursor-not-allowed rounded-lg border border-base-300 bg-base-200 pl-10 pr-3.5 text-sm text-base-content/70 outline-none";

const FoodPurchase = () => {
    const date = new Date();
    const dateString = date.toLocaleString();

    const food = useLoaderData();

    const { user } = useContext(AuthContext);

    const navigate = useNavigate();

    // the ONLY editable value on this page – shared by the stepper (left card) and the Quantity field (right card)
    const [quantity, setQuantity] = useState("1");

    // true while the order request is running – blocks double clicks (which would reduce stock twice)
    const [isSubmitting, setIsSubmitting] = useState(false);

    const unitPrice = Number(food?.price) || 0;
    const available = Number(food?.availableQuantity) || 0;
    const qtyNumber = parseInt(quantity) || 0;
    const subtotal = unitPrice * qtyNumber;

    const decrease = () => setQuantity(String(Math.max(1, qtyNumber - 1)));
    const increase = () => setQuantity(String(Math.min(available, qtyNumber + 1)));

    const handlePurchaseFood = (e) => {
        e.preventDefault();

        // ignore the click if an order is already being sent
        if (isSubmitting) return;

        const form = e.target;

        const name = form.name.value;
        const price = form.price.value;
        const numPrice = parseInt(price);
        const quantityValue = form.quantity.value;
        const numQuantity = parseInt(quantityValue);
        const totalPrice = numPrice * numQuantity;
        const buyerName = form.buyerName.value;
        const buyerEmail = form.buyerEmail.value;

        // foodId lets the server find the exact food and reduce ITS available quantity
        const newPurchase = { foodId: food._id, name, totalPrice, numQuantity, buyerName, buyerEmail };

        // extra
        if (user.email == food.userEmail) {
            Swal.fire({
                title: "Forbidden Action",
                text: "You can not Purchase food-items Added by You!",
                icon: "error",
                confirmButtonText: "understood",
            });
            return;
        } else if (food.availableQuantity < 1) {
            Swal.fire({
                title: "Food Not Available Today!",
                icon: "error",
                confirmButtonText: "understood",
            });
            return;
        } else if (numQuantity < 1 || isNaN(numQuantity)) {
            Swal.fire({
                title: "invalid quantity!!!",
                icon: "error",
                confirmButtonText: "try again",
            });
            return;
        } else if (numQuantity > food.availableQuantity) {
            Swal.fire({
                title: "Sorry!! insufficient quantity!",
                text: "You can not Purchase more than available quantity!",
                icon: "error",
                confirmButtonText: "understood",
            });
            return;
        }

        setIsSubmitting(true);

        // sending data to the server
        fetch("https://elkano64-server.vercel.app/purchases", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newPurchase),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.insertResult?.insertedId) {
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: `You Ordered ${numQuantity} ${food.name} Successfully, cost: $${totalPrice}`,
                        confirmButtonText: "cool",
                    });
                    navigate("/my-orders");
                } else {
                    // the server refused the order (e.g. someone else just bought the stock)
                    setIsSubmitting(false);
                    Swal.fire({
                        title: "Order Failed",
                        text: data.message || "Something went wrong. Please try again.",
                        icon: "error",
                        confirmButtonText: "understood",
                    });
                }
            })
            .catch(() => {
                setIsSubmitting(false);
                Swal.fire({
                    title: "Order Failed",
                    text: "Could not reach the server. Please try again.",
                    icon: "error",
                    confirmButtonText: "understood",
                });
            });
    };

    return (
        // min-h-screen + bg-base-200 on the page itself = no empty gap under short pages
        <section className="relative min-h-screen overflow-hidden bg-base-200 pb-14 lg:pb-20">
            <Helmet>
                <title>Elkano64 - Food Purchase</title>
            </Helmet>

            {/* decorative leaves */}
            <FaLeaf className="pointer-events-none absolute -left-4 top-6 rotate-[35deg] text-7xl text-secondary/20 lg:text-9xl" />
            <FaLeaf className="pointer-events-none absolute -right-5 bottom-10 -rotate-[35deg] scale-x-[-1] text-7xl text-secondary/20 lg:text-9xl" />

            {/* same container (max width + side padding) as the Navbar */}
            <div className="relative mx-auto max-w-screen-2xl px-3 md:px-8 lg:px-16">
                {/* ---------- Heading ---------- */}
                <div className="pt-8 text-center md:pt-10">
                    <div className="flex items-center justify-center gap-3">
                        <span className="h-px w-8 bg-primary/60 md:w-12" />
                        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-primary md:text-xs">
                            Fresh flavors, delivered
                        </p>
                        <span className="h-px w-8 bg-primary/60 md:w-12" />
                    </div>

                    <h1 className={`mt-2 font-serif text-3xl font-bold sm:text-4xl lg:text-5xl ${headingColor}`}>
                        Purchase This Food
                    </h1>
                    <p className="mt-2 text-xs text-base-content/70 sm:text-sm lg:text-base">
                        Complete the details below to place your order.
                    </p>
                </div>

                <div className="mt-8 grid items-start gap-5 lg:mt-10 lg:grid-cols-5 lg:gap-6">
                    {/* =============== LEFT : food summary =============== */}
                    <div className="relative overflow-hidden rounded-2xl border border-base-300 bg-base-100 p-4 shadow-xl sm:p-5 lg:col-span-2">
                        <FaLeaf className="pointer-events-none absolute -bottom-2 -left-2 rotate-[20deg] text-6xl text-secondary/15" />

                        <div className="relative">
                            <img
                                src={food.photo}
                                alt={food.name}
                                className="aspect-[2/1] w-full rounded-lg object-cover"
                            />

                            <h2 className={`mt-4 font-serif text-2xl font-bold ${headingColor}`}>{food.name}</h2>
                            <p className="mt-1 text-sm text-base-content/80">
                                <span className="font-semibold">Category:</span> {food.category}
                            </p>

                            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-base-300 pt-4">
                                <div className="flex items-center gap-3">
                                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-base-content/40 text-xs text-base-content/70">
                                        <FaDollarSign />
                                    </span>
                                    <div>
                                        <p className="text-[11px] text-base-content/70">Price (Each)</p>
                                        <p className={`text-xl font-bold ${headingColor}`}>${food.price}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 border-l border-base-300 pl-3">
                                    <FaCube className="shrink-0 text-xl text-base-content/60" />
                                    <div>
                                        <p className="text-[11px] text-base-content/70">Available Quantity</p>
                                        <p className={`text-xl font-bold ${headingColor}`}>
                                            {food.availableQuantity}{" "}
                                            <span className="text-[10px] font-normal text-base-content/60">
                                                {available > 0 ? "(In Stock)" : "(Out of Stock)"}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <p className="mt-4 text-xs leading-relaxed text-base-content/75 sm:text-[13px]">
                                {food.description || "A freshly prepared dish from the Elkano64 kitchen."}
                            </p>

                            {/* quantity stepper */}
                            <div className="mt-4 flex items-center justify-between border-t border-base-300 pt-4">
                                <p className={`text-sm font-semibold ${headingColor}`}>Quantity</p>
                                <div className="inline-flex items-center gap-1 rounded-lg border border-base-300 bg-base-200 p-1">
                                    <button
                                        type="button"
                                        onClick={decrease}
                                        disabled={qtyNumber <= 1}
                                        aria-label="Decrease quantity"
                                        className="grid h-8 w-8 place-items-center rounded-md text-sm transition hover:bg-base-300 disabled:opacity-40"
                                    >
                                        <FaMinus />
                                    </button>
                                    <span className="min-w-[2.25rem] text-center text-sm font-medium">{qtyNumber}</span>
                                    <button
                                        type="button"
                                        onClick={increase}
                                        disabled={qtyNumber >= available}
                                        aria-label="Increase quantity"
                                        className="grid h-8 w-8 place-items-center rounded-md text-sm transition hover:bg-base-300 disabled:opacity-40"
                                    >
                                        <FaPlus />
                                    </button>
                                </div>
                            </div>

                            {/* subtotal + total */}
                            <div className="mt-4 flex items-center justify-between border-t border-base-300 pt-3 text-xs text-base-content/70">
                                <span>Item Subtotal</span>
                                <span className="font-semibold text-base-content">${subtotal}</span>
                            </div>

                            <div className="mt-3 flex items-center justify-between rounded-lg bg-base-200 px-4 py-3.5">
                                <span className={`flex items-center gap-2 text-base font-semibold ${headingColor}`}>
                                    <FaCartShopping /> Total
                                </span>
                                <span className="text-xl font-bold text-primary">${subtotal}</span>
                            </div>
                        </div>
                    </div>

                    {/* =============== RIGHT : purchase form =============== */}
                    <div className="rounded-2xl border border-base-300 bg-base-100 p-4 shadow-xl sm:p-6 lg:col-span-3 lg:p-8">
                        <div className="flex items-center gap-3">
                            <FaLeaf className="shrink-0 text-3xl text-secondary" />
                            <div>
                                <h2 className={`font-serif text-xl font-bold sm:text-2xl lg:text-3xl ${headingColor}`}>
                                    Complete Your Purchase
                                </h2>
                                <p className="text-xs text-base-content/70 sm:text-sm">
                                    Please fill in the details below to continue.
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handlePurchaseFood} className="mt-6">
                            <div className="grid gap-x-5 gap-y-4 sm:grid-cols-2">
                                {/* Food name (locked) */}
                                <div>
                                    <label htmlFor="purchase-name" className={labelClass}>
                                        Food Name
                                    </label>
                                    <div className="relative">
                                        <FaUtensils className={iconClass} />
                                        <input
                                            id="purchase-name"
                                            type="text"
                                            name="name"
                                            defaultValue={food.name}
                                            readOnly
                                            className={readOnlyClass}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Price each (locked) */}
                                <div>
                                    <label htmlFor="purchase-price" className={labelClass}>
                                        Price - Each
                                    </label>
                                    <div className="relative">
                                        <FaTag className={iconClass} />
                                        <input
                                            id="purchase-price"
                                            type="number"
                                            name="price"
                                            defaultValue={food.price}
                                            readOnly
                                            className={readOnlyClass}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Quantity (the only editable field) */}
                                <div>
                                    <label htmlFor="purchase-quantity" className={labelClass}>
                                        Quantity
                                    </label>
                                    <div className="relative">
                                        <FaCube className={iconClass} />
                                        <input
                                            id="purchase-quantity"
                                            type="number"
                                            name="quantity"
                                            value={quantity}
                                            onChange={(e) => setQuantity(e.target.value)}
                                            placeholder="Enter quantity"
                                            className={editableClass}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Buying date (locked) */}
                                <div>
                                    <label htmlFor="purchase-date" className={labelClass}>
                                        Buying Date
                                    </label>
                                    <div className="relative">
                                        <FaCalendarDays className={iconClass} />
                                        <input
                                            id="purchase-date"
                                            type="text"
                                            name="buyingDate"
                                            defaultValue={dateString || "Loading..."}
                                            readOnly
                                            className={readOnlyClass}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Buyer name (locked) */}
                                <div>
                                    <label htmlFor="buyer-name" className={labelClass}>
                                        Buyer Name
                                    </label>
                                    <div className="relative">
                                        <FaUser className={iconClass} />
                                        <input
                                            id="buyer-name"
                                            type="text"
                                            name="buyerName"
                                            defaultValue={user?.displayName}
                                            readOnly
                                            className={readOnlyClass}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Buyer email (locked) */}
                                <div>
                                    <label htmlFor="buyer-email" className={labelClass}>
                                        Buyer Email
                                    </label>
                                    <div className="relative">
                                        <FaEnvelope className={iconClass} />
                                        <input
                                            id="buyer-email"
                                            type="text"
                                            name="buyerEmail"
                                            defaultValue={user?.email}
                                            readOnly
                                            className={readOnlyClass}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="btn btn-primary mt-7 h-12 min-h-0 w-full gap-2 text-sm"
                            >
                                <FaCartShopping className="text-base" />
                                {isSubmitting ? "Processing..." : "Purchase"}
                                <FaArrowRight className="text-sm" />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FoodPurchase;