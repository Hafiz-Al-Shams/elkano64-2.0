import { useContext } from "react";
import { Helmet } from "react-helmet-async";
import AuthContext from "../../context/AuthContext/AuthContext";
import { useLoaderData, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";


const UpdateFood = () => {

    const { user } = useContext(AuthContext);

    // console.log(user.email);


    const navigate = useNavigate();


    const food = useLoaderData();

    const { _id, name, category, description, price, foodOrigin, availableQuantity, photo, userEmail } = food;

    // console.log(userEmail);

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
        <div>
            <Helmet>
                <title>Elkano64 - Update Food Here</title>
            </Helmet>

            <div className='lg:w-3/4 mx-auto mb-28'>

                <div className="flex justify-center items-center gap-12 pt-6 pb-8">

                    <h1 className="text-5xl font-bold pt-8">Update Your fooD here!</h1>

                </div>

                <div className="card bg-base-100 w-full shrink-0 shadow-2xl">
                    <form onSubmit={handleUpdateFood} className="card-body">
                        {/* form first row */}
                        <div className='flex flex-col lg:flex-row gap-5'>
                            <div className="form-control flex-1">
                                <label className="label">
                                    <span className="label-text font-semibold text-xl">Food Name</span>
                                </label>
                                <input type="text" name='name' defaultValue={name} placeholder="food name" className="input input-bordered" required />
                            </div>
                            <div className="form-control flex-1">
                                <label className="label">
                                    <span className="label-text font-semibold text-xl">Food Category Name</span>
                                </label>
                                <input type="text" name='category' defaultValue={category} placeholder="food category" className="input input-bordered" required />
                            </div>
                        </div>
                        {/* form second row */}
                        <div className='flex flex-col lg:flex-row gap-5'>
                            <div className="form-control flex-1">
                                <label className="label">
                                    <span className="label-text font-semibold text-xl">Short Description</span>
                                </label>
                                <input type="text" name='description' defaultValue={description} placeholder="ingredients, making procedure, etc." className="input input-bordered" required />
                            </div>
                            <div className="form-control flex-1">
                                <label className="label">
                                    <span className="label-text font-semibold text-xl">Price</span>
                                </label>
                                <input type="number" name='price' defaultValue={price} placeholder="price" className="input input-bordered" required />
                            </div>
                        </div>
                        {/* form fourth row */}
                        <div className='flex flex-col lg:flex-row gap-5'>
                            <div className="form-control flex-1">
                                <label className="label">
                                    <span className="label-text font-semibold text-xl">{`Food Origin(Country)`}</span>
                                </label>
                                <input type="text" name='foodOrigin' defaultValue={foodOrigin} placeholder="origin country" className="input input-bordered" required />
                            </div>
                            <div className="form-control flex-1">
                                <label className="label">
                                    <span className="label-text font-semibold text-xl">Quantity</span>
                                </label>
                                <input type="number" name='availableQuantity' defaultValue={availableQuantity} placeholder="available food quantity" className="input input-bordered" required />
                            </div>
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold text-xl">Food Image</span>
                            </label>
                            <input type="text" name='photo' defaultValue={photo} placeholder="photoURL" className="input input-bordered" required />

                        </div>


                        <div className="form-control mt-6">
                            <button className="btn btn-primary text-base">Update Food</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UpdateFood;