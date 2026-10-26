

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
            <section className="bg-base-300 pt-7 md:pt-8 lg:pt-20 pb-10 md:pb-14 lg:pb-24">
                <div className="max-w-6xl mx-auto px-6">
                    <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-center mb-4 md:mb-6 lg:mb-8 underline">
                        Customer ReViews
                    </h2>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {reviews.map((review) => (
                            <div
                                key={review.id}
                                className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center text-center"
                            >
                                <img
                                    src={review.image}
                                    alt={review.name}
                                    className="w-20 h-20 rounded-full border-4 border-primary/80"
                                />
                                <h3 className="mt-4 text-xl font-semibold text-gray-800">
                                    {review.name}
                                </h3>
                                <p className="mt-2 text-gray-600">{review.review}</p>
                                <div className="mt-4 rating">
                                    <input
                                        type="radio"
                                        name={`rating-${review.id}`}
                                        className="mask mask-star bg-yellow-400"
                                        disabled
                                        checked={review.rating >= 1}
                                    />
                                    <input
                                        type="radio"
                                        name={`rating-${review.id}`}
                                        className="mask mask-star bg-yellow-400"
                                        disabled
                                        checked={review.rating >= 2}
                                    />
                                    <input
                                        type="radio"
                                        name={`rating-${review.id}`}
                                        className="mask mask-star bg-yellow-400"
                                        disabled
                                        checked={review.rating >= 3}
                                    />
                                    <input
                                        type="radio"
                                        name={`rating-${review.id}`}
                                        className="mask mask-star bg-yellow-400"
                                        disabled
                                        checked={review.rating >= 4}
                                    />
                                    <input
                                        type="radio"
                                        name={`rating-${review.id}`}
                                        className="mask mask-star bg-yellow-400"
                                        disabled
                                        checked={review.rating >= 5}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Review;