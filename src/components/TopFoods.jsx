import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaCartShopping } from "react-icons/fa6";

const TopFoods = () => {
    const [topFoods, setTopFoods] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("https://elkano64-server.vercel.app/fixedFoods")
            .then((res) => res.json())
            .then((data) => {
                setTopFoods(Array.isArray(data) ? data : []);
            })
            .catch((err) => console.log("ERROR", err.message))
            .finally(() => setLoading(false));
    }, []);

    return (
        <section className="mx-auto max-w-screen-2xl px-4 pb-12 pt-12 md:px-8 lg:px-16 lg:pb-16 lg:pt-16">
            {/* heading */}
            <div className="mb-6 flex items-center gap-4">
                <h2 className="font-serif text-xl font-bold md:text-2xl lg:text-3xl">Our Top-Selling Food Items</h2>
                <span className="hidden h-px w-24 bg-primary/60 sm:block" />
                <Link
                    to="/all-foods"
                    className="ml-auto flex items-center gap-1.5 text-xs font-medium text-primary hover:underline md:text-sm"
                >
                    View All <FaArrowRight className="text-[10px]" />
                </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 xl:grid-cols-6">
                {loading &&
                    Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton h-72 w-full" />)}

                {!loading &&
                    topFoods.map((food) => (
                        <div
                            key={food._id}
                            className="group flex flex-col overflow-hidden rounded-xl border border-base-300 bg-base-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                        >
                            <Link to={`/foods/${food._id}`} className="block p-2.5 pb-0">
                                <img
                                    className="h-32 w-full rounded-lg object-cover transition-transform duration-500 group-hover:scale-105 sm:h-36 xl:h-28 2xl:h-36"
                                    src={food.photo}
                                    alt={food.name}
                                />
                            </Link>

                            <div className="flex flex-1 flex-col gap-1 p-3">
                                <Link to={`/foods/${food._id}`}>
                                    <h3 className="line-clamp-1 font-serif text-base font-semibold hover:text-primary">
                                        {food.name}
                                    </h3>
                                </Link>
                                <p className="text-sm font-bold text-primary">${food.price}</p>
                                <p className="text-[11px] text-base-content/70">Purchase Count: {food.purchaseCount}</p>
                                <p className="text-[11px] text-base-content/70">
                                    Available Quantity: {food.availableQuantity}
                                </p>

                                {/* Add to Cart → existing purchase flow */}
                                <Link
                                    to={`/food-purchase/${food._id}`}
                                    className="btn btn-primary btn-sm mt-auto w-full gap-1.5 normal-case"
                                >
                                    <FaCartShopping className="text-xs" /> Add to Cart
                                </Link>
                            </div>
                        </div>
                    ))}
            </div>
        </section>
    );
};

export default TopFoods;