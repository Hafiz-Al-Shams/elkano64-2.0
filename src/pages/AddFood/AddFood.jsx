import { useContext } from "react";
import AuthContext from "../../context/AuthContext/AuthContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Helmet } from "react-helmet-async";



const AddFood = () => {

    const { user } = useContext(AuthContext);

    const navigate = useNavigate();


    const handleAddFood = e => {
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
        // console.log(newFood);

        // // sending data to the server
        fetch('https://elkano64-server.vercel.app/foods', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newFood)
        })
            .then(res => res.json())
            .then(data => {
                // console.log(data);
                if (data.insertedId) {
                    // console.log('successfully added');
                    Swal.fire({
                        title: 'Success!',
                        text: 'Food added successfully',
                        icon: 'success',
                        confirmButtonText: 'Cool'
                    });
                    // form.reset();
                    navigate('/all-foods');
                }
            })

    }





    return (
        <div>
            <Helmet>
                <title>Elkano64 - Add Food</title>
            </Helmet>

            <div className='lg:w-3/4 mx-auto mb-28'>

                <div className="flex justify-center items-center gap-12 pt-6 pb-8">


                    <h1 className="text-5xl font-bold pt-8">Add New FooD here!</h1>

                </div>

                <div className="card bg-base-100 w-full shrink-0 shadow-2xl">
                    <form onSubmit={handleAddFood} className="card-body">
                        {/* form first row */}
                        <div className='flex flex-col lg:flex-row gap-5'>
                            <div className="form-control flex-1">
                                <label className="label">
                                    <span className="label-text font-semibold text-xl">Food Name</span>
                                </label>
                                <input type="text" name='name' placeholder="food name" className="input input-bordered" required />
                            </div>
                            <div className="form-control flex-1">
                                <label className="label">
                                    <span className="label-text font-semibold text-xl">Food Category Name</span>
                                </label>
                                <input type="text" name='category' placeholder="food category" className="input input-bordered" required />
                            </div>
                        </div>
                        {/* form second row */}
                        <div className='flex flex-col lg:flex-row gap-5'>
                            <div className="form-control flex-1">
                                <label className="label">
                                    <span className="label-text font-semibold text-xl">Short Description</span>
                                </label>
                                <input type="text" name='description' placeholder="ingredients, making procedure, etc." className="input input-bordered" required />
                            </div>
                            <div className="form-control flex-1">
                                <label className="label">
                                    <span className="label-text font-semibold text-xl">Price</span>
                                </label>
                                <input type="number" name='price' placeholder="price" className="input input-bordered" required />
                            </div>
                        </div>
                        {/* form fourth row */}
                        <div className='flex flex-col lg:flex-row gap-5'>
                            <div className="form-control flex-1">
                                <label className="label">
                                    <span className="label-text font-semibold text-xl">{`Food Origin(Country)`}</span>
                                </label>
                                <input type="text" name='foodOrigin' placeholder="origin country" className="input input-bordered" required />
                            </div>
                            <div className="form-control flex-1">
                                <label className="label">
                                    <span className="label-text font-semibold text-xl">Quantity</span>
                                </label>
                                <input type="number" name='availableQuantity' placeholder="available food quantity" className="input input-bordered" required />
                            </div>
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold text-xl">Food Image</span>
                            </label>
                            <input type="text" name='photo' placeholder="photoURL" className="input input-bordered" required />

                        </div>

                        <div className="text-2xl font-semibold underline pt-6">
                            <h4>Add By</h4>
                        </div>

                        {/* form sixth row */}
                        <div className='flex flex-col lg:flex-row gap-5'>
                            <div className="form-control flex-1">
                                <label className="label">
                                    <span className="label-text font-semibold text-xl">name</span>
                                </label>
                                <input type="text" name='userName' defaultValue={user.displayName} readOnly className="input input-bordered" required />
                            </div>
                            <div className="form-control flex-1">
                                <label className="label">
                                    <span className="label-text font-semibold text-xl">email</span>
                                </label>
                                <input type="text" name='userEmail' defaultValue={user.email} readOnly className="input input-bordered" required />
                            </div>
                        </div>

                        <div className="form-control mt-6">
                            <button className="btn btn-primary text-base">Add Food Now</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddFood;