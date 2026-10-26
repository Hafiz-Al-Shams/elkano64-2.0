import { useState } from "react";
import Swal from "sweetalert2";


const FixedBadge = () => {


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


    return (
        <>
            <div onClick={handleBookings} className="fixed z-20 bottom-5 md:bottom-2.5 right-7 md:right-16 lg:right-24 transform -translate-y-1/2 bg-amber-400/70 text-black/95 text-center w-20 md:w-28 lg:w-44 rounded-full shadow-lg flex flex-col items-center justify-center hover:scale-110 transition-transform duration-300 p-1.5 md:p-2.5 lg:p-5 cursor-pointer">
                <div className="border-2 border-white rounded-full p-1 md:p-2.5 lg:p-4">
                    <div className="badge badge-primary badge-xs sm:badge-sm md:badge-md text-[9px] sm:text-[10px] md:text-xs p-1">HURRY</div>
                    <h6 className="text-[8px] md:text-[10px] lg:text-[15px] font-medium">Book a Table <br />Right Now!!</h6>
                </div>


            </div>
            <div className="">
                {isProcessing && (
                    <div className="fixed inset-0 bg-orange-400 bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-8 rounded-xl flex flex-col items-center gap-4 shadow-lg">
                            {/* DaisyUI Spinner */}
                            <span className="loading loading-ring loading-lg text-primary"></span>
                            <p className="text-lg font-semibold">Processing...</p>
                        </div>
                    </div>
                )}
            </div>
        </>

    );
};

export default FixedBadge;