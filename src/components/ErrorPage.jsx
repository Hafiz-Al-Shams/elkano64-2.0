import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { FaHouse, FaLeaf } from 'react-icons/fa6';

// dark-green headings in light mode, light text in dark mode
const headingColor = "text-neutral [[data-theme=elkanoDark]_&]:text-base-content";

const ErrorPage = () => {
    return (
        <div>
            <Helmet>
                <title>ERROR</title>
            </Helmet>
            <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-base-200 px-4 py-12 text-base-content">

                {/* decorative leaves */}
                <FaLeaf className="pointer-events-none absolute -left-4 top-8 -rotate-[35deg] text-8xl text-secondary/20 sm:text-9xl" />
                <FaLeaf className="pointer-events-none absolute -right-4 bottom-8 rotate-[145deg] text-8xl text-secondary/20 sm:text-9xl" />

                <div className="relative text-center">
                    <div className="flex items-center justify-center gap-3">
                        <span className="h-px w-8 bg-primary/60 md:w-14" />
                        <FaLeaf className="-rotate-[30deg] text-sm text-primary" />
                        <span className="h-px w-8 bg-primary/60 md:w-14" />
                    </div>

                    <h1 className="mt-3 font-serif text-8xl font-bold text-primary drop-shadow-md sm:text-9xl">404</h1>
                    <p className={`mt-4 font-serif text-xl font-bold md:text-3xl ${headingColor}`}>
                        Oops! The page you are looking for does not exist.
                    </p>
                    <p className="mx-auto mt-3 max-w-xl text-sm text-base-content/70 md:text-base">
                        It seems like you may have taken a wrong turn. Lets get you back home!
                    </p>
                    <Link to="/" className="btn btn-primary mt-6 gap-2 rounded-full px-8 shadow-lg">
                        <FaHouse className="text-sm" /> Back to Home
                    </Link>
                </div>

                {/* animation kept – framed in a rounded card so it sits nicely on both themes */}
                <div className="relative mt-10 w-72 overflow-hidden rounded-2xl border border-base-300 bg-white shadow-lg sm:w-80 md:w-96">
                    <img
                        src="https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif"
                        alt="Lost in Space"
                        className="block w-full [[data-theme=elkanoDark]_&]:brightness-90"
                    />
                </div>
            </div>
        </div>
    );
};

export default ErrorPage;