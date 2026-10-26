import { Link } from "react-router-dom";



const Banner = () => {
    return (
        <div className="carousel w-full min-h-screen">
            {/* Slide 1 */}
            <div id="slide1" className="carousel-item relative w-full bg-[url('https://i.ibb.co.com/KjTB1WT/slider33.jpg')] bg-no-repeat bg-cover bg-center bg-blend-overlay pt-[30vh] sm:pt-[35vh] md:pt-[40vh] lg:pt-[45vh]" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                <div className="text-center mx-auto space-y-3 px-4 sm:px-6 md:px-12">
                    <h1 className="font-bold text-4xl md:text-5xl lg:text-6xl text-white">Fresh Homemade Dishes</h1>
                    <h4 className="font-semibold text-base md:text-lg lg:text-2xl text-gray-300/90 pb-4">Our chefs cook with fresh and high quality ingredients. <br className="hidden sm:block" />We serve foods with finest tastes.</h4>
                    <Link to="/all-foods">
                        <button className="bg-[rgba(63,0,231,0.85)] hover:bg-[rgba(63,0,231,0.98)] text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-medium transition duration-300 shadow-[0_4px_6px_rgba(255,255,255,0.3),4px_0_6px_rgba(255,255,255,0.3),-4px_0_6px_rgba(255,255,255,0.3)] hover:shadow-[0_6px_12px_rgba(255,255,255,0.5),6px_0_12px_rgba(255,255,255,0.5),-6px_0_12px_rgba(255,255,255,0.5)]">
                            Shop The Hottest Foods
                        </button>
                    </Link>
                </div>
                <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                    <a href="#slide3" className="btn btn-sm sm:btn-md lg:btn-lg btn-circle">❮</a>
                    <a href="#slide2" className="btn btn-sm sm:btn-md lg:btn-lg btn-circle">❯</a>
                </div>
            </div>

            {/* Slide 2 */}
            <div id="slide2" className="carousel-item relative w-full bg-[url('https://i.ibb.co.com/mh8mC5L/slide11.jpg')] bg-no-repeat bg-cover bg-center bg-blend-overlay pt-[30vh] sm:pt-[35vh] md:pt-[40vh] lg:pt-[45vh]" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                <div className="text-center mx-auto space-y-3 px-4 sm:px-6 md:px-12">
                    <h1 className="font-bold text-4xl md:text-5xl lg:text-6xl text-white">Ingredients Grown on Our Farms</h1>
                    <h4 className="font-semibold text-base md:text-lg lg:text-2xl text-gray-300/90 pb-4">Enjoy the food experience mostly from our farms, through <br className="hidden sm:block" />our kitchen, and to your fork.</h4>
                    <Link to="/all-foods">
                        <button className="bg-[rgba(63,0,231,0.85)] hover:bg-[rgba(63,0,231,0.98)] text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-medium transition duration-300 shadow-[0_4px_6px_rgba(255,255,255,0.3),4px_0_6px_rgba(255,255,255,0.3),-4px_0_6px_rgba(255,255,255,0.3)] hover:shadow-[0_6px_12px_rgba(255,255,255,0.5),6px_0_12px_rgba(255,255,255,0.5),-6px_0_12px_rgba(255,255,255,0.5)]">
                            Shop The Hottest Foods
                        </button>
                    </Link>
                </div>
                <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                    <a href="#slide1" className="btn btn-sm sm:btn-md lg:btn-lg btn-circle">❮</a>
                    <a href="#slide3" className="btn btn-sm sm:btn-md lg:btn-lg btn-circle">❯</a>
                </div>
            </div>

            {/* Slide 3 */}
            <div id="slide3" className="carousel-item relative w-full bg-[url('https://i.ibb.co.com/0qs1h6t/slider22.jpg')] bg-no-repeat bg-cover bg-center bg-blend-overlay pt-[30vh] sm:pt-[35vh] md:pt-[40vh] lg:pt-[45vh]" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                <div className="text-center mx-auto space-y-3 px-4 sm:px-6 md:px-12">
                    <h1 className="font-bold text-4xl md:text-5xl lg:text-6xl text-white">We Take Care with Love</h1>
                    <h4 className="font-semibold text-base md:text-lg lg:text-2xl text-gray-300/90 pb-4">We are passionate about making amazing recipes. <br className="hidden sm:block" />We serve foods simply full of the finest tastes.</h4>
                    <Link to="/all-foods">
                        <button className="bg-[rgba(63,0,231,0.85)] hover:bg-[rgba(63,0,231,0.98)] text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-medium transition duration-300 shadow-[0_4px_6px_rgba(255,255,255,0.3),4px_0_6px_rgba(255,255,255,0.3),-4px_0_6px_rgba(255,255,255,0.3)] hover:shadow-[0_6px_12px_rgba(255,255,255,0.5),6px_0_12px_rgba(255,255,255,0.5),-6px_0_12px_rgba(255,255,255,0.5)]">
                            Shop The Hottest Foods
                        </button>
                    </Link>
                </div>
                <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                    <a href="#slide2" className="btn btn-sm sm:btn-md lg:btn-lg btn-circle">❮</a>
                    <a href="#slide1" className="btn btn-sm sm:btn-md lg:btn-lg btn-circle">❯</a>
                </div>
            </div>
        </div>

    );
};

export default Banner;