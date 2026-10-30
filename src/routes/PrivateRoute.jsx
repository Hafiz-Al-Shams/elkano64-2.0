import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import AuthContext from "../context/AuthContext/AuthContext";


// eslint-disable-next-line react/prop-types
const PrivateRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    const location = useLocation();

    if (loading) {
        return <div className="text-center mt-16"><span className="loading loading-bars loading-lg"></span></div>;
    }

    if (user) {
        return children;
    }


    // remember the page the visitor wanted, so login can send them back to it
    return <Navigate to="/signIn" state={{ from: location }} replace></Navigate>;
};

export default PrivateRoute;