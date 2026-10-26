import { Helmet } from "react-helmet-async";
import { Link, useLoaderData } from "react-router-dom";



const MyFoods = () => {

    const foods = useLoaderData();

    return (
        <div className="w-11/12 mx-auto">
            <Helmet>
                <title>Elkano64 - My Foods</title>
            </Helmet>
            <h1 className="mt-11 mb-8 text-4xl font-semibold">{`My Food List: ${foods.length}`}</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-y-24 mb-28">
                {
                    foods.map(food => (
                        <div key={food._id} className="card card-compact bg-base-200/80 p-3.5 w-96 shadow-xl">
                            <figure>
                                <img
                                    className="p-4 rounded-3xl"
                                    src={food.photo}
                                    alt="food" />
                            </figure>
                            <div className="card-body">
                                <h2 className="card-title text-2xl font-bold">{food.name}</h2>
                                <p className="font-medium text-lg text-gray-700">Price: {food.price}</p>
                                <p className="font-medium text-lg text-gray-700">Category: {food.category}</p>

                                <p className="font-medium text-lg text-gray-700">Purchase-Count Today: {food.purchaseCount}</p>



                                <p className="font-medium text-lg text-gray-700">Available Quantity: {food.availableQuantity}</p>
                                <p className="font-medium text-lg text-gray-700">Description: {food.description}</p>
                                <p className="font-medium text-lg text-gray-700">Origin: {food.foodOrigin}</p>
                                <div className="card-actions justify-end mt-2">
                                    <Link to={`/update-food/${food._id}`}>
                                        <button className="btn btn-primary px-4 text-lg">Update</button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
};

export default MyFoods;