import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useLoaderData } from "react-router-dom";


const AllFoods = () => {

    const foods = useLoaderData();
    const [resultFoods, setResultFoods] = useState(foods);
    const [searchValue, setSearchValue] = useState("");

    // Debounce state
    const [debounceTimer, setDebounceTimer] = useState(null);

    // Sorting state
    const [sortOrder, setSortOrder] = useState(""); // Tracks the selected sorting order

    const handleSearch = async (query) => {
        try {
            const response = await fetch(`https://elkano64-server.vercel.app/searchFoods?search=${encodeURIComponent(query)}`);
            const data = await response.json();
            setResultFoods(data);
        } catch (error) {
            console.error("Error fetching search results:", error);
        }
    };

    // Debounced search triggered by input change
    const handleInputChange = (event) => {
        const value = event.target.value;
        setSearchValue(value);

        if (debounceTimer) clearTimeout(debounceTimer);

        const timer = setTimeout(() => {
            handleSearch(value);
        }, 300);
        setDebounceTimer(timer);
    };

    // sorting foods by price
    const handleSortByPrice = (order) => {
        const sortedFoods = [...resultFoods].sort((a, b) =>
            order === "asc" ? a.price - b.price : b.price - a.price
        );
        setResultFoods(sortedFoods);
        setSortOrder(order);
    };



    return (
        <div className="px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24 pb-12 md:pb-16 lg:pb-24 bg-base-200/80">
            <Helmet>
                <title>Elkano64 - All Foods</title>
            </Helmet>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-center mb-6 md:mb-8 lg:mb-10 pt-8 md:pt-10 lg:pt-14 underline">{`All Foods (${resultFoods.length})`}</h2>

            {/* SEARCHing + SORTING CONTAINER */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6 md:mb-8 max-w-7xl mx-auto">

                {/* Search Input */}
                <label className="input input-bordered input-primary flex items-center gap-2 w-full sm:w-auto sm:flex-1 sm:max-w-md">
                    <input
                        type="text"
                        name="search"
                        className="grow text-sm md:text-base"
                        placeholder="Search by Food-Name"
                        value={searchValue}
                        onChange={handleInputChange}
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-5 w-5 md:h-6 md:w-6 opacity-95 text-neutral-content">
                        <path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" />
                    </svg>
                </label>


                {/* Sorting Dropdown */}
                <select
                    className="select select-bordered w-full sm:w-48 text-sm md:text-base"
                    value={sortOrder}
                    onChange={(e) => handleSortByPrice(e.target.value)}
                >
                    <option value="">Newest First</option>
                    <option value="asc">Price low to high</option>
                    <option value="desc">Price high to low</option>
                </select>
            </div>

            {/* FOOD CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10 pb-12 md:pb-16 lg:pb-24 justify-items-center max-w-7xl mx-auto">
                {resultFoods.map((food) => (
                    <div key={food._id} className="card card-compact bg-base-100 border-2 w-full max-w-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-lg">
                        <figure className="p-4">
                            <img className="rounded-2xl w-full h-48 md:h-56 lg:h-64 object-cover transition-transform duration-300 hover:scale-110" src={food.photo} alt="food" />
                        </figure>
                        <div className="card-body">
                            <h2 className="card-title text-lg md:text-xl lg:text-2xl font-semibold md:font-semibold lg:font-bold">{food.name}</h2>
                            <p className="font-medium text-sm md:text-base lg:text-lg text-base-content">Category: {food.category}</p>
                            <p className="font-medium text-sm md:text-base lg:text-lg text-base-content">Price: ${food.price}</p>
                            <p className="font-medium text-sm md:text-base lg:text-lg text-base-content">Purchase-Count Today: {food.purchaseCount}</p>
                            <p className="font-medium text-sm md:text-base lg:text-lg text-base-content">Available Quantity: {food.availableQuantity}</p>
                            <div className="card-actions justify-end mt-3">
                                <Link to={`/foods/${food._id}`}>
                                    <button className="btn btn-primary px-3 md:px-4 text-sm md:text-base lg:text-lg transition-all duration-300 hover:shadow-lg hover:scale-105">Details</button>
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AllFoods;