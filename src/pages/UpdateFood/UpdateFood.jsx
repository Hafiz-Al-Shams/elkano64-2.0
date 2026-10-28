import { useContext, useState } from "react";
import { Helmet } from "react-helmet-async";
import AuthContext from "../../context/AuthContext/AuthContext";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
    FaArrowLeft,
    FaBox,
    FaDollarSign,
    FaFloppyDisk,
    FaLeaf,
    FaLink,
    FaLocationDot,
    FaRegFileLines,
    FaRegImage,
    FaTag,
    FaUtensils,
    FaXmark,
} from "react-icons/fa6";

// dark-green headings in light mode, light text in dark mode
const headingColor = "text-neutral [[data-theme=elkanoDark]_&]:text-base-content";

const labelClass = `mb-1.5 block text-sm font-semibold ${headingColor}`;
const inputClass =
    "h-12 w-full rounded-lg border border-base-300 bg-base-100 pl-11 pr-3 text-sm outline-none transition placeholder:text-base-content/50 focus:border-primary focus:ring-2 focus:ring-primary/15";
const iconClass = "pointer-events-none absolute left-4 text-base-content/60";


const UpdateFood = () => {

    const { user } = useContext(AuthContext);

    // console.log(user.email);


    const navigate = useNavigate();


    const food = useLoaderData();

    const { _id, name, category, description, price, foodOrigin, availableQuantity, photo, userEmail } = food;

    // console.log(userEmail);

    // live preview shown in the left panel (name / category / image follow what the user types)
    const [preview, setPreview] = useState({ name, category, photo });
    const [failedPhoto, setFailedPhoto] = useState("");

    const handlePreviewChange = (field) => (e) => {
        setPreview((prev) => ({ ...prev, [field]: e.target.value }));
    };

    const myFoodsPath = `/my-foods/${user?.email}`;

    const handleUpdateFood = e => {
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

        const updatedFood = { name, category, description, price, foodOrigin, availableQuantity, photo };
        // console.log(updatedFood);

        if (user.email !== userEmail) {
            Swal.fire({
                title: 'Invalid Authority',
                text: 'You can only Edit food-items Added by You!',
                icon: 'error',
                confirmButtonText: 'understood'
            });
            return;
        }

        // // sending data to the server
        fetch(`https://elkano64-server.vercel.app/foods/${_id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedFood)
        })
            .then(res => res.json())
            .then(data => {
                // console.log(data);

                if (data.modifiedCount > 0) {
                    // console.log('successfully updated');
                    Swal.fire({
                        title: 'Success!',
                        text: 'Food updated successfully',
                        icon: 'success',
                        confirmButtonText: 'Cool'
                    });
                    // form.reset();
                    navigate(`/my-foods/${user.email}`);
                }
            })

    }


    return (
        <div className="relative min-h-screen overflow-hidden bg-base-200 pb-14 pt-6 lg:pb-20">
            <Helmet>
                <title>Elkano64 - Update Food Here</title>
            </Helmet>

            {/* decorative leaves */}
            <FaLeaf className="pointer-events-none absolute -left-4 top-14 -rotate-[35deg] text-7xl text-secondary/20 sm:text-8xl lg:text-9xl" />
            <FaLeaf className="pointer-events-none absolute -right-4 top-28 rotate-[35deg] scale-x-[-1] text-7xl text-secondary/20 sm:text-8xl lg:text-9xl" />

            {/* same container width as the navbar */}
            <div className="relative mx-auto max-w-screen-2xl px-3 md:px-8 lg:px-16">

                {/* ---------- Heading ---------- */}
                <div className="text-center">
                    <Link
                        to={myFoodsPath}
                        className="inline-flex items-center gap-2 text-xs text-base-content/80 transition-colors hover:text-primary sm:text-sm"
                    >
                        <FaArrowLeft className="text-[11px]" /> Back to My Food List
                    </Link>

                    <div className="mt-4 flex items-center justify-center gap-3">
                        <span className="h-px w-8 bg-primary md:w-14" />
                        <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-primary sm:text-xs">
                            Your Menu <span className="mx-1">•</span> Edit Item
                        </p>
                        <span className="h-px w-8 bg-primary md:w-14" />
                    </div>

                    <h1 className={`mt-3 font-serif text-3xl font-bold sm:text-4xl lg:text-5xl ${headingColor}`}>
                        Update Food Details
                    </h1>
                    <p className="mt-2 text-sm text-base-content/70 sm:text-base">
                        Keep your menu fresh and accurate.
                    </p>
                </div>

                {/* ---------- Card ---------- */}
                <div className="mt-8 rounded-2xl border border-base-300 bg-base-100/80 p-3 shadow-lg sm:p-5 lg:mt-10 lg:p-6">
                    <div className="grid gap-6 lg:grid-cols-[30%_1fr] lg:gap-8">

                        {/* ===== Left : preview ===== */}
                        <div className="relative overflow-hidden rounded-xl border border-base-300 bg-base-100 p-3 sm:p-4">
                            <div className="relative aspect-[5/4] overflow-hidden rounded-lg bg-base-300">
                                {preview.photo && failedPhoto !== preview.photo ? (
                                    <img
                                        src={preview.photo}
                                        alt={preview.name}
                                        onError={() => setFailedPhoto(preview.photo)}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="grid h-full w-full place-items-center text-4xl text-base-content/30">
                                        <FaRegImage />
                                    </div>
                                )}

                                <span className="absolute left-3 top-3 rounded-full bg-neutral px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-neutral-content shadow">
                                    Current food image
                                </span>
                            </div>

                            <h2 className={`mt-4 break-words font-serif text-2xl font-bold ${headingColor}`}>
                                {preview.name || "Food name"}
                            </h2>

                            <span className="mt-3 inline-flex max-w-full items-center gap-2 rounded-full bg-base-200 px-4 py-2 text-sm">
                                <FaTag className="shrink-0 text-xs text-base-content/70" />
                                <span className="truncate">{preview.category || "Category"}</span>
                            </span>

                            <div className="mt-5 border-t border-base-300 pt-4 pb-10 text-xs text-base-content/70 sm:text-sm">
                                Preview of your menu listing
                            </div>

                            <FaLeaf className="pointer-events-none absolute -bottom-1 left-1 rotate-[20deg] text-5xl text-secondary/30" />
                        </div>

                        {/* ===== Right : form ===== */}
                        <form onSubmit={handleUpdateFood} className="min-w-0">
                            <div className="grid gap-x-5 gap-y-4 sm:grid-cols-2">

                                {/* Food Name */}
                                <label className="block">
                                    <span className={labelClass}>Food Name</span>
                                    <span className="relative flex items-center">
                                        <FaUtensils className={iconClass} />
                                        <input
                                            type="text"
                                            name="name"
                                            defaultValue={name}
                                            onChange={handlePreviewChange("name")}
                                            placeholder="food name"
                                            className={inputClass}
                                            required
                                        />
                                    </span>
                                </label>

                                {/* Category */}
                                <label className="block">
                                    <span className={labelClass}>Food Category Name</span>
                                    <span className="relative flex items-center">
                                        <FaTag className={iconClass} />
                                        <input
                                            type="text"
                                            name="category"
                                            defaultValue={category}
                                            onChange={handlePreviewChange("category")}
                                            placeholder="food category"
                                            className={inputClass}
                                            required
                                        />
                                    </span>
                                </label>

                                {/* Description */}
                                <label className="block sm:col-span-2">
                                    <span className={labelClass}>Short Description</span>
                                    <span className="relative flex items-start">
                                        <FaRegFileLines className={`${iconClass} top-4`} />
                                        <textarea
                                            name="description"
                                            defaultValue={description}
                                            placeholder="ingredients, making procedure, etc."
                                            rows={3}
                                            className={`${inputClass} h-auto min-h-[96px] resize-y py-3`}
                                            required
                                        />
                                    </span>
                                </label>

                                {/* Price */}
                                <label className="block">
                                    <span className={labelClass}>Price</span>
                                    <span className="relative flex items-center">
                                        <FaDollarSign className={iconClass} />
                                        <input
                                            type="number"
                                            name="price"
                                            defaultValue={price}
                                            placeholder="price"
                                            className={inputClass}
                                            required
                                        />
                                    </span>
                                </label>

                                {/* Origin */}
                                <label className="block">
                                    <span className={labelClass}>{`Food Origin (Country)`}</span>
                                    <span className="relative flex items-center">
                                        <FaLocationDot className={iconClass} />
                                        <input
                                            type="text"
                                            name="foodOrigin"
                                            defaultValue={foodOrigin}
                                            placeholder="origin country"
                                            className={inputClass}
                                            required
                                        />
                                    </span>
                                </label>

                                {/* Quantity */}
                                <label className="block">
                                    <span className={labelClass}>Quantity</span>
                                    <span className="relative flex items-center">
                                        <FaBox className={iconClass} />
                                        <input
                                            type="number"
                                            name="availableQuantity"
                                            defaultValue={availableQuantity}
                                            placeholder="available food quantity"
                                            className={inputClass}
                                            required
                                        />
                                    </span>
                                </label>

                                {/* Image URL */}
                                <div className="sm:col-span-2">
                                    <label className="block">
                                        <span className={labelClass}>Food Image URL</span>
                                        <span className="relative flex items-center">
                                            <FaLink className={iconClass} />
                                            <input
                                                type="text"
                                                name="photo"
                                                defaultValue={photo}
                                                onChange={handlePreviewChange("photo")}
                                                placeholder="photoURL"
                                                className={inputClass}
                                                required
                                            />
                                        </span>
                                    </label>
                                    <p className="mt-2 flex items-center gap-2 text-[11px] text-base-content/70">
                                        <FaRegImage className="text-sm" />
                                        Paste a valid image URL (e.g. from i.ibb.co, imgur, etc.)
                                    </p>
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                                <button type="submit" className="btn btn-primary h-12 min-h-0 gap-2 px-8 text-sm sm:min-w-[250px]">
                                    <FaFloppyDisk /> Save Food Changes
                                </button>
                                <Link
                                    to={myFoodsPath}
                                    className="btn btn-outline h-12 min-h-0 gap-2 border-base-content/60 bg-transparent px-8 text-sm"
                                >
                                    <FaXmark /> Cancel
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateFood;