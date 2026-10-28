import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import ErrorPage from "../components/ErrorPage";
import Home from "../pages/Home/Home";
import Register from "../pages/Register/Register";
import SignIn from "../pages/SignIn/SignIn";
import PrivateRoute from "./PrivateRoute";
import FoodDetails from "../pages/FoodDetails/FoodDetails";
import AllFoods from "../pages/AllFoods/AllFoods";
import FoodPurchase from "../pages/FoodPurchase/FoodPurchase";
import AddFood from "../pages/AddFood/AddFood";
import UpdateFood from "../pages/UpdateFood/UpdateFood";
import MyFoods from "../pages/MyFoods/MyFoods";
import MyOrders from "../pages/MyOrders/MyOrders";
import Gallery from "../pages/Gallery/Gallery";
import About from "../components/About";
import Contact from "../components/Contact";


const API_BASE = "https://elkano64-server.vercel.app";

/**
 * Loader helper: fetches JSON and THROWS when something is wrong
 * (server error, food not found / null result, bad id, no connection...),
 * so React Router sends the user to the route's errorElement (your ErrorPage)
 * instead of rendering a broken page.
 * On success it returns exactly the same data your loaders returned before.
 */
const loadJson = async (path) => {
    const res = await fetch(`${API_BASE}${path}`);

    if (!res.ok) {
        throw new Response("Not Found", { status: res.status, statusText: res.statusText });
    }

    const data = await res.json();

    if (data === null || data === undefined) {
        throw new Response("Not Found", { status: 404, statusText: "Not Found" });
    }

    return data;
};


// Shown only during the very first load while route loaders are fetching data
const HydrateFallback = () => {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <span className="loading loading-spinner loading-lg"></span>
        </div>
    );
};


const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout></MainLayout>,
        // any loader / render error inside the app now shows your ErrorPage
        errorElement: <ErrorPage></ErrorPage>,
        HydrateFallback: HydrateFallback,
        children: [
            {
                path: '/',
                element: <Home></Home>,
            },
            {
                path: 'register',
                element: <Register></Register>,
            },
            {
                path: 'signIn',
                element: <SignIn></SignIn>,
            },
            {
                path: 'gallery',
                element: <Gallery></Gallery>,
                loader: () => loadJson(`/foods`)
            },
            {
                path: 'all-foods',
                element: <AllFoods></AllFoods>,
                loader: () => loadJson(`/foods`)
            },
            {
                path: 'about',
                element: <About></About>,
            },
            {
                path: 'contact',
                element: <Contact></Contact>,
            },
            {
                path: 'add-food',
                element: <PrivateRoute><AddFood></AddFood></PrivateRoute>,
            },
            {
                path: 'update-food/:foodId',
                element: <PrivateRoute><UpdateFood></UpdateFood></PrivateRoute>,
                loader: ({ params }) => loadJson(`/foods/${params.foodId}`)
            },
            {
                path: 'foods/:foodId',
                element: <FoodDetails></FoodDetails>,
                loader: ({ params }) => loadJson(`/foods/${params.foodId}`)
            },
            {
                path: 'food-purchase/:foodId',
                element: <PrivateRoute><FoodPurchase></FoodPurchase></PrivateRoute>,
                loader: ({ params }) => loadJson(`/foods/${params.foodId}`)
            },
            {
                path: 'my-foods/:emailId',
                element: <PrivateRoute><MyFoods></MyFoods></PrivateRoute>,
                loader: ({ params }) => loadJson(`/foods/email/${params.emailId}`)
            },
            {
                path: 'my-orders',
                element: <PrivateRoute><MyOrders></MyOrders></PrivateRoute>,
            },
        ]
    },
    {
        path: "*",
        element: <ErrorPage></ErrorPage>,
    },
]);

export default router;