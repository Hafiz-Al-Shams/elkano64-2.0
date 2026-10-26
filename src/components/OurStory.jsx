import { Link } from "react-router-dom";
import { FaArrowRight, FaLeaf } from "react-icons/fa6";

// 👉 Replace with your own restaurant / chef photo whenever you like
const STORY_IMAGE =
    "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1000&q=80";

const OurStory = () => {
    return (
        <div className="grid overflow-hidden rounded-xl border border-base-300 bg-base-100 shadow-md md:grid-cols-2">
            {/* image + floating note */}
            <div className="relative min-h-[240px] md:min-h-[320px]">
                <img
                    src={STORY_IMAGE}
                    alt="Our chef at work"
                    className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute bottom-0 right-0 flex items-end gap-2 rounded-tl-xl bg-base-100 px-4 py-3 text-[11px] leading-snug text-base-content">
                    <p>
                        <span className="block text-primary">Since 2018</span>
                        Serving Good Food <br /> &amp; Great Moments
                    </p>
                    <FaLeaf className="text-lg text-secondary" />
                </div>
            </div>

            {/* text */}
            <div className="flex flex-col justify-center p-6 lg:p-8">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">Our Restaurant</p>
                <h2 className="mt-2 font-serif text-2xl font-bold leading-tight lg:text-3xl">
                    A Journey of Flavor <br /> Since 2018
                </h2>
                <p className="mt-3 text-xs leading-relaxed text-base-content/75 md:text-sm">
                    At Elkano64, we believe that great food brings people together. Our chefs use fresh ingredients
                    and traditional recipes to create unforgettable dining experiences.
                </p>
                <Link to="/gallery" className="btn btn-primary btn-sm mt-5 w-fit gap-2 px-5">
                    Our Story <FaArrowRight className="text-xs" />
                </Link>
            </div>
        </div>
    );
};

export default OurStory;