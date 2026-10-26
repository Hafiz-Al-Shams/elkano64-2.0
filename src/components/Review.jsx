import { Link } from "react-router-dom";
import { FaArrowRight, FaStar } from "react-icons/fa6";

const Review = () => {
    const reviews = [
        {
            id: 1,
            name: "Victor Leclerc",
            image: "https://i.ibb.co.com/6yjYftb/1.jpg",
            review:
                "Fast delivery and amazing customer service. Highly recommend this restaurant for all food enthusiasts.",
            rating: 5,
        },
        {
            id: 2,
            name: "Clara Schmidt",
            image: "https://i.ibb.co.com/HhHBKTk/2.jpg",
            review:
                "The quality of the foods is top-notch! I found everything I needed for any occasions or family events here.",
            rating: 4,
        },
        {
            id: 3,
            name: "Liam O'Connor",
            image: "https://i.ibb.co.com/QmdRJvm/3.jpg",
            review:
                "Great variety of foods! Found the perfect taste & flavours exactly like my home.",
            rating: 5,
        },
    ];

    return (
        <div>
            <div className="mb-5 flex items-center gap-4">
                <h2 className="font-serif text-xl font-bold lg:text-2xl">Customer Reviews</h2>
                <span className="hidden h-px w-16 bg-primary/60 sm:block" />
                <Link
                    to="/gallery"
                    className="ml-auto flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
                >
                    View All <FaArrowRight className="text-[10px]" />
                </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
                {reviews.map((review) => (
                    <div
                        key={review.id}
                        className="flex flex-col items-center rounded-xl border border-base-300 bg-base-100 p-4 text-center shadow-sm transition-shadow hover:shadow-lg"
                    >
                        <img
                            src={review.image}
                            alt={review.name}
                            className="h-14 w-14 rounded-full object-cover ring-2 ring-primary/70"
                        />
                        <h3 className="mt-3 font-serif text-sm font-semibold">{review.name}</h3>
                        <p className="mt-2 text-[11px] leading-relaxed text-base-content/75">{review.review}</p>

                        <div
                            className="mt-auto flex gap-0.5 pt-3 text-sm"
                            role="img"
                            aria-label={`${review.rating} out of 5 stars`}
                        >
                            {[1, 2, 3, 4, 5].map((n) => (
                                <FaStar key={n} className={n <= review.rating ? "text-warning" : "text-base-content/20"} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Review;