import { useContext } from "react";
import AuthContext from "../../context/AuthContext/AuthContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Helmet } from "react-helmet-async";
import { FaLeaf, FaLink, FaUtensils } from "react-icons/fa6";

// dark-green headings in light mode, light text in dark mode
const headingColor = "text-neutral [[data-theme=elkanoDark]_&]:text-base-content";

// Category options. The values match the keywords used by the filter chips on the All Foods page,
// so newly added dishes show up under the right chip.
const CATEGORY_OPTIONS = [
    "Biryani",
    "Pizza",
    "Indian Curry",
    "Chinese",
    "BBQ & Grill",
    "Seafood",
    "Pasta",
    "Desserts",
];

// shared styles
const labelClass = `mb-1.5 block text-sm font-semibold ${headingColor}`;
const inputClass =
    "h-11 w-full rounded-lg border border-base-300 bg-base-100 px-3.5 text-sm outline-none transition placeholder:text-base-content/50 focus:border-primary";
const readOnlyClass =
    "h-11 w-full cursor-not-allowed rounded-lg border border-base-300 bg-base-200 px-3.5 text-sm text-base-content/60 outline-none";

const AddFood = () => {
    const { user } = useContext(AuthContext);

    const navigate = useNavigate();

    const handleAddFood = (e) => {
        e.preventDefault();

        const form = e.target;

        const name = form.name.value;
        const category = form.category.value;
        const description = form.description.value;
        const stringPrice = form.price.value;
        const price = parseInt(stringPrice);
        const stringQuantity = form.availableQuantity.value;
        const availableQuantity = parseInt(stringQuantity);
        const photo = form.photo.value;
        const foodOrigin = form.foodOrigin.value;
        const userName = form.userName.value;
        const userEmail = form.userEmail.value;

        const newFood = { name, category, description, price, foodOrigin, availableQuantity, photo, userName, userEmail };

        // sending data to the server
        fetch("https://elkano64-server.vercel.app/foods", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newFood),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.insertedId) {
                    Swal.fire({
                        title: "Success!",
                        text: "Food added successfully",
                        icon: "success",
                        confirmButtonText: "OK",
                    });
                    navigate("/all-foods");
                }
            });
    };

    return (
        // min-h-screen + bg-base-200 on the page itself = no empty gap under short pages
        <section className="relative min-h-screen overflow-hidden bg-base-200 pb-14 lg:pb-20">
            <Helmet>
                <title>Elkano64 - Add Food</title>
            </Helmet>

            {/* decorative leaves */}
            <FaLeaf className="pointer-events-none absolute -left-4 top-6 rotate-[35deg] text-7xl text-secondary/20 lg:text-9xl" />
            <FaLeaf className="pointer-events-none absolute -right-5 bottom-10 -rotate-[35deg] scale-x-[-1] text-7xl text-secondary/20 lg:text-9xl" />
            <FaLeaf className="pointer-events-none absolute left-[6%] top-[38%] hidden rotate-[20deg] text-sm text-primary/60 xl:block" />
            <FaLeaf className="pointer-events-none absolute bottom-[30%] right-[5%] hidden -rotate-[40deg] text-sm text-primary/60 xl:block" />

            {/* same container (max width + side padding) as the Navbar */}
            <div className="relative mx-auto max-w-screen-2xl px-3 md:px-8 lg:px-16">
                {/* ---------- Heading ---------- */}
                <div className="pt-8 text-center md:pt-10">
                    <div className="flex items-center justify-center gap-3">
                        <span className="h-px w-8 bg-primary/60 md:w-12" />
                        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-primary md:text-xs">
                            Your Menu <span className="mx-1">•</span> Add Item
                        </p>
                        <span className="h-px w-8 bg-primary/60 md:w-12" />
                    </div>

                    <h1 className={`mt-2 font-serif text-3xl font-bold sm:text-4xl lg:text-5xl ${headingColor}`}>
                        Add a New Dish
                    </h1>
                    <p className="mt-2 text-xs text-base-content/70 sm:text-sm lg:text-base">
                        Fill in the details below to add a new dish to your menu.
                    </p>
                </div>

                {/* ---------- Form card ---------- */}
                <div className="mt-8 rounded-2xl border border-base-300 bg-base-100 p-4 shadow-xl sm:p-6 lg:mt-10 lg:p-8">
                    <form onSubmit={handleAddFood}>
                        <div className="grid gap-x-5 gap-y-4 md:grid-cols-2 md:items-start">
                            {/* Food name */}
                            <div>
                                <label htmlFor="food-name" className={labelClass}>
                                    Food Name
                                </label>
                                <input
                                    id="food-name"
                                    type="text"
                                    name="name"
                                    placeholder="Enter food name"
                                    className={inputClass}
                                    required
                                />
                            </div>

                            {/* Category */}
                            <div>
                                <label htmlFor="food-category" className={labelClass}>
                                    Food Category Name
                                </label>
                                <select
                                    id="food-category"
                                    name="category"
                                    defaultValue=""
                                    required
                                    className="select select-bordered h-11 min-h-0 w-full rounded-lg border-base-300 bg-base-100 text-sm focus:border-primary focus:outline-none invalid:text-base-content/50 [&>option]:text-base-content"
                                >
                                    <option value="" disabled>
                                        Select food category
                                    </option>
                                    {CATEGORY_OPTIONS.map((c) => (
                                        <option key={c} value={c}>
                                            {c}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Short description */}
                            <div>
                                <label htmlFor="food-description" className={labelClass}>
                                    Short Description
                                </label>
                                <textarea
                                    id="food-description"
                                    name="description"
                                    rows={3}
                                    placeholder="Enter a short description of the food..."
                                    className="min-h-[5.5rem] w-full resize-y rounded-lg border border-base-300 bg-base-100 px-3.5 py-3 text-sm outline-none transition placeholder:text-base-content/50 focus:border-primary"
                                    required
                                />
                            </div>

                            {/* Price */}
                            <div>
                                <label htmlFor="food-price" className={labelClass}>
                                    Price
                                </label>
                                <input
                                    id="food-price"
                                    type="number"
                                    name="price"
                                    placeholder="Enter price"
                                    className={inputClass}
                                    required
                                />
                            </div>

                            {/* Origin */}
                            <div>
                                <label htmlFor="food-origin" className={labelClass}>
                                    {`Food Origin(Country)`}
                                </label>
                                <input
                                    id="food-origin"
                                    type="text"
                                    name="foodOrigin"
                                    placeholder="Enter country name"
                                    className={inputClass}
                                    required
                                />
                            </div>

                            {/* Quantity */}
                            <div>
                                <label htmlFor="food-quantity" className={labelClass}>
                                    Quantity
                                </label>
                                <input
                                    id="food-quantity"
                                    type="number"
                                    name="availableQuantity"
                                    placeholder="Enter quantity"
                                    className={inputClass}
                                    required
                                />
                            </div>

                            {/* Image URL (full width) */}
                            <div className="md:col-span-2">
                                <label htmlFor="food-photo" className={labelClass}>
                                    Food Image URL
                                </label>
                                <input
                                    id="food-photo"
                                    type="text"
                                    name="photo"
                                    placeholder="Enter image URL (e.g. https://example.com/image.jpg)"
                                    className={inputClass}
                                    required
                                />
                                <p className="mt-2 flex items-start gap-1.5 text-[11px] text-base-content/70 sm:text-xs">
                                    <FaLink className="mt-0.5 shrink-0" />
                                    You can enter a direct image URL (e.g. from i.ibb.co, imgur, etc.)
                                </p>
                            </div>
                        </div>

                        {/* ---------- Add By divider ---------- */}
                        <div className="mt-6 flex items-center gap-3 sm:gap-4">
                            <span className="relative h-px flex-1 bg-base-300">
                                <span className="absolute right-0 top-0 h-px w-1/3 bg-primary/50" />
                            </span>
                            <h4 className={`font-serif text-base font-semibold sm:text-lg ${headingColor}`}>Add By</h4>
                            <span className="relative h-px flex-1 bg-base-300">
                                <span className="absolute left-0 top-0 h-px w-1/3 bg-primary/50" />
                            </span>
                        </div>

                        {/* ---------- Added by (read only) ---------- */}
                        <div className="mt-4 grid gap-x-5 gap-y-4 md:grid-cols-2">
                            <div>
                                <label htmlFor="user-name" className={labelClass}>
                                    Name
                                </label>
                                <input
                                    id="user-name"
                                    type="text"
                                    name="userName"
                                    defaultValue={user?.displayName}
                                    readOnly
                                    className={readOnlyClass}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="user-email" className={labelClass}>
                                    Email
                                </label>
                                <input
                                    id="user-email"
                                    type="text"
                                    name="userEmail"
                                    defaultValue={user?.email}
                                    readOnly
                                    className={readOnlyClass}
                                    required
                                />
                            </div>
                        </div>

                        {/* ---------- Submit ---------- */}
                        <button type="submit" className="btn btn-primary mt-6 h-11 min-h-0 w-full gap-2 text-sm">
                            <FaUtensils className="text-base" />
                            Add Food Now
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default AddFood;