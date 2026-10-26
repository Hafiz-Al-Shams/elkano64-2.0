import { useContext } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext/AuthContext";
import Swal from "sweetalert2";
import { Helmet } from "react-helmet-async";


const FoodPurchase = () => {

    const date = new Date();
    const dateString = date.toLocaleString();

    const food = useLoaderData();

    // console.log(food.userEmail);

    const { user } = useContext(AuthContext);

    // console.log(user?.email);

    const navigate = useNavigate();

    const handlePurchaseFood = e => {
        e.preventDefault();

        const form = e.target;

        const name = form.name.value;
        const price = form.price.value;
        const numPrice = parseInt(price);
        // console.log(typeof parseInt(price), price)
        const quantity = form.quantity.value;
        const numQuantity = parseInt(quantity);
        // console.log(typeof numQuantity, typeof quantity);
        const totalPrice = numPrice * numQuantity;
        const buyerName = form.buyerName.value;
        const buyerEmail = form.buyerEmail.value;

        const newPurchase = { name, totalPrice, numQuantity, buyerName, buyerEmail };
        // console.log(newPurchase);


        // extra
        if (user.email == food.userEmail) {
            Swal.fire({
                title: 'Forbidden Action',
                text: 'You can not Purchase food-items Added by You!',
                icon: 'error',
                confirmButtonText: 'understood'
            });
            return;
        }

        else if (food.availableQuantity < 1) {
            Swal.fire({
                title: 'Food Not Available Today!',
                // text: 'You can not Purchase food-items Added by You!',
                icon: 'error',
                confirmButtonText: 'understood'
            });
            return;
        }

        else if (numQuantity < 1) {
            Swal.fire({
                title: 'invalid quantity!!!',
                // text: 'You can not Purchase food-items Added by You!',
                icon: 'error',
                confirmButtonText: 'try again'
            });
            return;
        }

        else if (numQuantity > food.availableQuantity) {
            Swal.fire({
                title: 'Sorry!! insufficient quantity!',
                text: 'You can not Purchase more than available quantity!',
                icon: 'error',
                confirmButtonText: 'understood'
            });
            return;
        }


        // sending data to the server
        fetch('https://elkano64-server.vercel.app/purchases', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newPurchase)
        })
            .then(res => res.json())
            .then(data => {
                // console.log(data);
                if (data.insertResult.insertedId) {
                    // console.log('successfully added');
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: `You Ordered ${numQuantity} ${food.name} Successfully, cost: $${totalPrice}`,
                        // text: `Cost: $${totalPrice}`,

                        confirmButtonText: 'cool',

                        // showConfirmButton: false,
                        // timer: 2000
                    });
                    // form.reset();
                    navigate('/my-orders');
                }
            })

    }





    return (
        <div>
            <Helmet>
                <title>Elkano64 - Food Purchase</title>
            </Helmet>

            <div className='lg:w-3/4 mx-auto mb-28'>

                <div className="flex justify-center items-center pt-6 pb-3">

                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">Purchase This Food</h1>
                </div>

                <div className="card bg-base-100 w-full shrink-0 shadow-2xl">
                    <form onSubmit={handlePurchaseFood} className="card-body">
                        {/* form first row */}
                        <div className='flex flex-col lg:flex-row gap-5'>
                            <div className="form-control flex-1">
                                <label className="label">
                                    <span className="label-text font-semibold text-xl">Food Name</span>
                                </label>
                                <input type="text" name='name' className="input input-bordered" defaultValue={food.name} readOnly required />
                            </div>
                            <div className="form-control flex-1">
                                <label className="label">
                                    <span className="label-text font-semibold text-xl">Price -Each</span>
                                </label>
                                <input type="number" name='price' className="input input-bordered" defaultValue={food.price} readOnly required />
                            </div>
                        </div>
                        {/* form third row */}
                        <div className='flex flex-col lg:flex-row gap-5'>
                            <div className="form-control flex-1">
                                <label className="label">
                                    <span className="label-text font-semibold text-xl">Quantity</span>
                                </label>
                                <input type="number" name='quantity' placeholder="quantity" className="input input-bordered" required />
                            </div>
                            <div className="form-control flex-1">
                                <label className="label">
                                    <span className="label-text font-semibold text-xl">Buying Date</span>
                                </label>
                                <input type="text" name='buyingDate' className="input input-bordered" defaultValue={dateString || "Loading..."} readOnly required />
                            </div>
                        </div>

                        {/* form sixth row */}
                        <div className='flex flex-col lg:flex-row gap-5'>
                            <div className="form-control flex-1">
                                <label className="label">
                                    <span className="label-text font-semibold text-xl">Buyer Name</span>
                                </label>
                                <input type="text" name='buyerName' defaultValue={user.displayName} readOnly className="input input-bordered" required />
                            </div>
                            <div className="form-control flex-1">
                                <label className="label">
                                    <span className="label-text font-semibold text-xl">Buyer Email</span>
                                </label>
                                <input type="text" name='buyerEmail' defaultValue={user.email} readOnly className="input input-bordered" required />
                            </div>
                        </div>

                        <div className="form-control mt-6">
                            <button className="btn btn-primary text-base">Purchase</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default FoodPurchase;