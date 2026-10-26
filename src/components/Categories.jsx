import { Link } from "react-router-dom";
import { FaBowlFood, FaBowlRice, FaFire, FaFish, FaPepperHot, FaPizzaSlice } from "react-icons/fa6";

const categories = [
    { name: "Biryani", Icon: FaBowlRice },
    { name: "Pizza", Icon: FaPizzaSlice },
    { name: "Indian Curry", Icon: FaPepperHot },
    { name: "Chinese", Icon: FaBowlFood },
    { name: "BBQ & Grill", Icon: FaFire },
    { name: "Seafood", Icon: FaFish },
];

const Categories = () => {
    return (
        <section className="mx-auto max-w-screen-2xl px-4 pt-12 md:px-8 lg:px-16 lg:pt-16">
            <div className="flex items-center justify-center gap-4">
                <span className="h-px w-10 bg-primary/60 md:w-20" />
                <h2 className="text-center font-serif text-xl font-bold md:text-2xl lg:text-3xl">
                    Explore Our Categories
                </h2>
                <span className="h-px w-10 bg-primary/60 md:w-20" />
            </div>

            <div className="mt-8 grid grid-cols-3 gap-y-7 md:grid-cols-6">
                {categories.map(({ name, Icon }) => (
                    <Link
                        key={name}
                        to={`/all-foods?category=${encodeURIComponent(name)}`}
                        className="group flex flex-col items-center gap-3"
                    >
                        <div className="grid h-20 w-20 place-items-center rounded-full border border-primary/20 bg-primary/10 text-3xl text-primary shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:bg-primary group-hover:text-primary-content group-hover:shadow-lg lg:h-24 lg:w-24 lg:text-4xl">
                            <Icon />
                        </div>
                        <span className="font-serif text-sm font-semibold md:text-base">{name}</span>
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default Categories;