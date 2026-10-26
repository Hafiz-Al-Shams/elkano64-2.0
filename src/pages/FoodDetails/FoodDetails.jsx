import { Helmet } from "react-helmet-async";
import { Link, useLoaderData } from "react-router-dom";


const FoodDetails = () => {

    const food = useLoaderData();

    const { _id, name, category, description, price, purchaseCount, availableQuantity, photo, foodOrigin } = food;


    return (
        <div className="px-4 sm:px-6 md:px-8 lg:px-12">
            <Helmet>
                <title>Elkano64 - Food Details</title>
            </Helmet>

            <div className="flex justify-center items-center pt-4 md:pt-6 pb-2">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold my-6 md:my-8 lg:my-10 text-center">{name} Details</h1>
            </div>

            <div className="card lg:card-side bg-base-200/40 shadow-xl w-full sm:w-11/12 md:w-10/12 lg:w-9/12 xl:w-8/12 mx-auto mt-1 p-4 sm:p-6 md:p-8 lg:px-10 mb-6 md:mb-8">
                <figure className="lg:w-1/2 overflow-hidden rounded-2xl">
                    <img
                        src={photo}
                        className="w-full h-64 sm:h-72 md:h-80 lg:h-96 object-cover p-4 sm:p-6 md:p-8 lg:p-10 rounded-3xl transition-transform duration-500 hover:scale-110"
                        alt={name} />
                </figure>
                <div className="card-body lg:w-1/2 p-4 sm:p-6">
                    <h2 className="card-title text-lg sm:text-xl md:text-2xl font-bold mb-3 md:mb-4">Category: {category}</h2>
                    <p className="font-medium text-sm sm:text-base md:text-lg text-base-content">Price: ${price}</p>
                    <p className="font-medium text-sm sm:text-base md:text-lg text-base-content">Purchase-Count Today: {purchaseCount}</p>
                    <p className="font-medium text-sm sm:text-base md:text-lg text-base-content">Available in Stock: {availableQuantity}</p>
                    <p className="font-medium text-sm sm:text-base md:text-lg text-base-content">Description: {description}</p>
                    <p className="font-medium text-sm sm:text-base md:text-lg text-base-content">Origin Country: {foodOrigin}</p>
                    <div className="card-actions justify-end mt-3 md:mt-4">
                        <Link to={`/food-purchase/${_id}`}>
                            <button className="btn btn-primary px-3 sm:px-4 text-sm sm:text-base md:text-lg transition-all duration-300 hover:shadow-lg hover:scale-105">Purchase</button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FoodDetails;