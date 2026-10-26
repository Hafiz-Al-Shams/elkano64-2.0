import { Link } from "react-router-dom";
import { AiOutlineCalendar } from "react-icons/ai";
import { BiSupport } from "react-icons/bi";
import { FaArrowRight, FaLeaf } from "react-icons/fa6";
import { MdOutlineLocalOffer, MdOutlineLocalShipping, MdOutlineVerifiedUser } from "react-icons/md";
import { RiSecurePaymentLine } from "react-icons/ri";

const services = [
    { Icon: MdOutlineLocalShipping, title: "Fast & Fresh Delivery", text: "Hot & fresh food delivered to your doorstep" },
    { Icon: BiSupport, title: "24/7 Customer Support", text: "We’re here to help anytime, anywhere" },
    { Icon: RiSecurePaymentLine, title: "Secure Online Payments", text: "Safe & hassle-free transactions" },
    { Icon: AiOutlineCalendar, title: "Easy Table Reservations", text: "Book your table in advance with ease" },
    { Icon: MdOutlineVerifiedUser, title: "Quality & Hygiene Assurance", text: "We maintain top hygiene & safety standards" },
    { Icon: MdOutlineLocalOffer, title: "Special Discounts & Offers", text: "Enjoy exciting deals & exclusive offers" },
];

const Services = () => {
    return (
        <section className="relative overflow-hidden bg-base-200">
            <FaLeaf className="pointer-events-none absolute -left-2 top-4 -rotate-12 text-7xl text-secondary/25" />
            <FaLeaf className="pointer-events-none absolute -right-2 bottom-2 rotate-[200deg] text-7xl text-secondary/25" />

            <div className="relative mx-auto grid max-w-screen-2xl items-center gap-8 px-4 py-10 md:px-8 lg:grid-cols-[1fr_2.2fr] lg:gap-12 lg:px-16 lg:py-14">
                {/* left */}
                <div>
                    <h2 className="font-serif text-2xl font-bold lg:text-3xl">Why Choose Elkano64?</h2>
                    <p className="mt-3 max-w-xs text-sm text-base-content/80">
                        We serve more than just food — we serve experiences.
                    </p>
                    <Link to="/#about" className="btn btn-primary btn-sm md:btn-md mt-5 gap-2 px-6">
                        Learn More <FaArrowRight className="text-xs" />
                    </Link>
                </div>

                {/* right */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {services.map(({ Icon, title, text }, i) => (
                        <div
                            key={title}
                            className={`flex items-start gap-3 ${i % 3 !== 0 ? "lg:border-l lg:border-base-content/10 lg:pl-5" : ""}`}
                        >
                            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-primary/30 bg-base-100 text-2xl text-primary">
                                <Icon />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold leading-snug">{title}</h3>
                                <p className="mt-1 text-xs text-base-content/70">{text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;