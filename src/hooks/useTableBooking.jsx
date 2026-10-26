import { useState } from "react";
import Swal from "sweetalert2";

/**
 * Same "table booking" behaviour that used to live inside FixedBadge.jsx,
 * extracted so the Banner and the Reserve-Table section can both use it.
 */
const useTableBooking = () => {
    const [isProcessing, setIsProcessing] = useState(false);

    const handleBookings = () => {
        setIsProcessing(true);

        setTimeout(() => {
            setIsProcessing(false);
            Swal.fire({
                title: "you are Late!!!",
                text: "All Tables are Booked!! Try again tomorrow!",
                icon: "warning",
                confirmButtonText: "Understood",
            });
        }, 2500);
    };

    const processingOverlay = isProcessing ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4 rounded-xl border border-base-300 bg-base-100 p-8 text-base-content shadow-2xl">
                <span className="loading loading-ring loading-lg text-primary"></span>
                <p className="text-lg font-semibold">Processing...</p>
            </div>
        </div>
    ) : null;

    return { isProcessing, handleBookings, processingOverlay };
};

export default useTableBooking;