import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLoaderData } from "react-router-dom";
import Lightbox from "yet-another-react-lightbox";
import Snowfall from "react-snowfall";



const Gallery = () => {

    const foods = useLoaderData();
    const [open, setOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    return (
        <>
            <Helmet>
                <title>Elkano64 - Gallery</title>
            </Helmet>
            <Snowfall snowflakeCount={1000} style={{ color: '#fff' }} />

            <div className="bg-neutral-400 text-white pt-10 pb-28 px-6">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-5xl text-neutral-900 font-semibold text-center mb-10 mt-14 underline">{`Gallery (${foods.length})`}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                        {foods.map((food, index) => (
                            <div
                                key={index}
                                className="cursor-pointer overflow-hidden rounded-xl group"
                                onClick={() => {
                                    setCurrentIndex(index);
                                    setOpen(true);
                                }}
                            >
                                <img
                                    src={food.photo}
                                    alt={food.name}
                                    className="w-full h-auto transform group-hover:scale-125 transition-transform duration-500"
                                />
                            </div>
                        ))}
                    </div>
                </div>
                <Lightbox
                    open={open}
                    close={() => setOpen(false)}
                    slides={foods.map((food) => ({ src: food.src, alt: food.name }))}
                    index={currentIndex}
                />
            </div>

            {/* testing area */}


            {/* testing area */}

        </>
    );
};

export default Gallery;