import { useEffect, useState } from "react";
import { Link } from "react-router-dom";



const TopFoods = () => {


    const [topFoods, setTopFoods] = useState([]);

    useEffect(() => {
        fetch('https://elkano64-server.vercel.app/fixedFoods')
            .then(res => res.json())
            .then(data => {
                setTopFoods(data);
            })
    }, [])



    return (
        <div className="w-11/12 mx-auto">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-center pb-4 md:pb-6 lg:pb-10 pt-10 md:pt-14 lg:pt-24 underline">Our 6 top-selling Food Items</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10 pb-6 md:pb-7 lg:pb-10 justify-items-center">
                {
                    topFoods.map(food => (
                        <div key={food._id} className="card card-compact bg-base-100 border-2 w-full max-w-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-lg">
                            <figure className="p-4">
                                <img
                                    className="rounded-2xl w-full h-48 md:h-56 lg:h-64 object-cover transition-transform duration-300 hover:scale-110"
                                    src={food.photo}
                                    alt={food.name} />
                            </figure>
                            <div className="card-body">
                                <h2 className="card-title text-lg md:text-xl lg:text-2xl font-semibold md:font-semibold lg:font-bold">{food.name}</h2>
                                <p className="font-medium text-sm md:text-base lg:text-lg text-base-content">Price: ${food.price}</p>
                                <p className="font-medium text-sm md:text-base lg:text-lg text-base-content">Purchase Count: {food.purchaseCount}</p>
                                <p className="font-medium text-sm md:text-base lg:text-lg text-base-content">Available Quantity: {food.availableQuantity}</p>
                                <div className="card-actions justify-end mt-3">
                                    <Link to={`/foods/${food._id}`}>
                                        <button className="bg-[#6B3AFF] hover:bg-[#3F00E7] text-white px-4 py-2 md:px-5 md:py-2.5 lg:px-6 lg:py-3 rounded-lg font-medium text-sm md:text-base lg:text-lg transition-all duration-300 hover:shadow-lg hover:scale-105">
                                            View Details
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
            <div className="text-center pb-10 md:pb-11 lg:pb-20">
                <Link to="/all-foods">
                    <button className="btn btn-outline btn-sm md:btn-md lg:btn-lg font-semibold hover:bg-[#3F00E7] hover:text-white hover:border-[#3F00E7] transition-all duration-300">View All</button>
                </Link>
            </div>

        </div>
    );
};

export default TopFoods;