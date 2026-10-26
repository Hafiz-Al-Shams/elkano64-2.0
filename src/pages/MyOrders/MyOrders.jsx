import { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/AuthContext/AuthContext";
import { Helmet } from "react-helmet-async";
import Swal from "sweetalert2";


const MyOrders = () => {


    const [orders, setOrders] = useState([]);
    const { user } = useContext(AuthContext);


    useEffect(() => {
        fetch(`https://elkano64-server.vercel.app/my-orders?email=${user.email}`)
            .then(res => res.json())
            .then(data => {
                // console.log(data);
                setOrders(data);
            })
    }, [user.email])


    const handleDelete = _id => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                // console.log('delete confirmed');

                fetch(`https://elkano64-server.vercel.app/my-orders/${_id}`, {
                    method: 'DELETE'
                })
                    .then(res => res.json())
                    .then(data => {
                        // console.log(data);
                        if (data.deletedCount > 0) {
                            Swal.fire({
                                title: "Deleted!",
                                text: "Your order has been deleted.",
                                icon: "success"
                            });
                            const remainingOrders = orders.filter(order => order._id !== _id);
                            setOrders(remainingOrders);
                        }
                    })

            }
        });
    }




    return (
        <div className="my-5 mx-auto max-w-5xl text-center">
            <Helmet>
                <title>Elkano64 - My Orders</title>
            </Helmet>
            <h2 className="mt-11 mb-8 text-4xl font-semibold">Order List: {orders.length}</h2>


            <table className="orders-table mb-28 mx-auto">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Order Quantity</th>
                        <th>Total Price ($)</th>
                        <th>Purchase Date & Time</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order, index) => (
                        <tr key={order._id} className="orders-table-row bg-gray-200 hover:bg-indigo-200 transition duration-100">
                            <td>{index + 1}</td>
                            <td className="py-2 px-4 border-b border-gray-700">{order.name}</td>
                            <td className="unique">{order.numQuantity}</td>
                            <td className="py-2 px-4 border-b border-gray-700">{order.totalPrice}</td>
                            <td>{order.buyingDate}</td>
                            <td>
                                <button onClick={() => handleDelete(order._id)} className="btn btn-primary btn-sm">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MyOrders;