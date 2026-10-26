import Swal from "sweetalert2";


const Events = () => {


    const handleEventDetails = () => {

        Swal.fire({
            title: 'Upcoming!',
            text: 'Details will come next week..',
            icon: 'info',
            confirmButtonText: 'Cool'
        });
    }


    return (
        <div className="bg-gray-900 text-white pb-9 md:pb-12 lg:pb-20 pt-7 md:pt-10 lg:pt-16 px-6">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl lg:text-3xl font-semibold text-center mb-6 lg:mb-8 underline">Upcoming Events</h2>
                <div className="flex flex-col md:flex-row items-center gap-8 bg-gray-800 p-6 rounded-lg">
                    <div className="flex-1">
                        <p className="text-sm text-pink-400 mb-2">15/03/2025 — 21/03/2025</p>
                        <h3 className="text-xl font-bold mb-4">A Culinary Journey Through Europe</h3>
                        <p className="text-sm text-gray-400 mb-4">
                            Join us for an unforgettable evening celebrating the rich culinary traditions of Europe. Indulge in a specially curated menu featuring French soufflés, Italian risottos, Spanish paellas, and more. Each dish is paired with exquisite wines to complement the flavors, making this a true feast for the senses ...
                        </p>
                        <button onClick={handleEventDetails} className="btn btn-outline btn-sm md:btn-md btn-secondary">View Details</button>
                    </div>
                    <div className="w-full md:w-64 flex-shrink-0">
                        <img
                            src="https://i.ibb.co.com/Wyqhsyk/event.jpg"
                            alt="Napa Valley"
                            className="rounded-lg"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Events;