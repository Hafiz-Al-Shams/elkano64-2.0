import { Outlet, ScrollRestoration } from "react-router-dom";
import Navbar from "../pages/shared/Navbar";
import Footer from "../pages/shared/Footer";



const MainLayout = () => {
    return (
        <>
            <Navbar></Navbar>
            <div className="min-h-screen">
                <Outlet></Outlet>
            </div>
            <Footer></Footer>

            <ScrollRestoration /> {/* every newly visited main-site page opens from the top */}
        </>
    );
};

export default MainLayout;