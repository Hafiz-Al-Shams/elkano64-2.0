import { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import AuthContext from "../context/AuthContext/AuthContext";

/**
 * Controls the table-booking modal.
 * The modal only opens for logged-in users. A visitor who is not logged in
 * gets a popup asking them to login and is taken to the login page.
 * After login they come back to the page they were on.
 */
const useBookingModal = () => {
    const { user, loading } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const [bookingOpen, setBookingOpen] = useState(false);

    const openBooking = () => {
        // Firebase is still checking the session – don't show a wrong "login" popup yet
        if (loading) return;

        if (!user) {
            Swal.fire({
                title: "Login Required",
                text: "Please login to your account to book a table.",
                icon: "info",
                showCancelButton: true,
                confirmButtonText: "Go to Login",
                cancelButtonText: "Not now",
            }).then((result) => {
                if (result.isConfirmed) navigate("/signIn", { state: { from: location } });
            });
            return;
        }

        setBookingOpen(true);
    };

    const closeBooking = () => setBookingOpen(false);

    return { bookingOpen, openBooking, closeBooking };
};

export default useBookingModal;