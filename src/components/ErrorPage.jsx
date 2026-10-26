import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const ErrorPage = () => {
    return (
        <div>
            <Helmet>
                <title>ERROR</title>
            </Helmet>
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-100 to-blue-300 text-gray-800">
                <div className="text-center">
                    <h1 className="text-9xl font-extrabold text-blue-500 drop-shadow-md">404</h1>
                    <p className="mt-4 text-xl md:text-2xl font-semibold">Oops! The page you are looking for does not exist.</p>
                    <p className="mt-2 text-gray-600">It seems like you may have taken a wrong turn. Lets get you back home!</p>
                    <Link to="/" className="mt-6 inline-block bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-3 rounded-lg shadow-lg transition duration-300">
                        Back to Home
                    </Link>
                </div>
                <div className="mt-10">
                    <img
                        src="https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif"
                        alt="Lost in Space"
                        className="w-80 md:w-96"
                    />
                </div>
            </div>
        </div>
    );
};

export default ErrorPage;