import { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../context/AuthContext/AuthContext";


// eslint-disable-next-line react/prop-types
const PrivateRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return <div className="text-center mt-16"><span className="loading loading-bars loading-lg"></span></div>;
    }

    if (user) {
        return children;
    }


    return <Navigate to="/signIn"></Navigate>;
};

export default PrivateRoute;