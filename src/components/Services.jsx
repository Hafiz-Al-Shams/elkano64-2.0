import { AiOutlineCalendar } from "react-icons/ai";
import { BiSupport } from "react-icons/bi";
import { FaHandsWash, FaTag } from "react-icons/fa";
import { MdOutlineLocalShipping } from "react-icons/md";
import { RiSecurePaymentLine } from "react-icons/ri";



const Services = () => {
    return (
        <div>
            <div className="">
                <h3 className="text-center font-bold text-xl md:text-2xl lg:text-3xl mt-8 md:mt-11 lg:mt-20 mb-0.5 md:mb-2.5 lg:mb-5 px-2.5 underline">Why Choose Our Restaurant?</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-9 md:gap-12 lg:gap-16 pt-8 bg-base-100 lg:pb-6 mb-10 lg:mb-16 px-4 md:px-12">
                    <div className="flex flex-col items-center space-y-2">
                        <h3 className="md:text-lg lg:text-xl font-semibold lg:pb-2">Fast & Fresh Delivery</h3>
                        <div className="text-4xl text-orange-600">
                            <MdOutlineLocalShipping />
                        </div>
                        <p className="text-base-content text-xs lg:text-base text-center">Hot & fresh food delivered to your doorstep</p>
                    </div>
                    <div className="flex flex-col items-center space-y-2">
                        <h3 className="md:text-lg lg:text-xl font-semibold lg:pb-2">24/7 Customer Support</h3>
                        <div className="text-4xl text-blue-600">
                            <BiSupport />
                        </div>
                        <p className="text-xs lg:text-base text-base-content text-center">We’re here to help anytime, anywhere</p>
                    </div>
                    <div className="flex flex-col items-center space-y-2">
                        <h3 className="md:text-lg lg:text-xl font-semibold lg:pb-2">Secure Online Payments</h3>
                        <div className="text-4xl text-orange-600">
                            <RiSecurePaymentLine />
                        </div>
                        <p className="text-xs lg:text-base text-base-content text-center">Safe & hassle-free transactions</p>
                    </div>
                    <div className="flex flex-col items-center space-y-2">
                        <h3 className="md:text-lg lg:text-xl font-semibold lg:pb-2">Easy Table Reservations</h3>
                        <div className="text-4xl text-blue-700">
                            <AiOutlineCalendar />
                        </div>
                        <p className="text-xs lg:text-base text-base-content text-center">Book your table in advance with ease</p>
                    </div>
                    <div className="flex flex-col items-center space-y-2">
                        <h3 className="md:text-lg lg:text-xl font-semibold lg:pb-2">Quality & Hygiene Assurance</h3>
                        <div className="text-4xl text-green-600">
                            <FaHandsWash />
                        </div>
                        <p className="text-xs lg:text-base text-base-content text-center">We maintain top hygiene & safety standards</p>
                    </div>
                    <div className="flex flex-col items-center space-y-2">
                        <h3 className="md:text-lg lg:text-xl font-semibold lg:pb-2">Special Discounts & Offers</h3>
                        <div className="text-4xl text-red-600">
                            <FaTag />
                        </div>
                        <p className="text-xs lg:text-base text-base-content text-center">Enjoy exciting deals & exclusive offers</p>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Services;