import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
    FaArrowRight,
    FaLeaf,
    FaRegHeart,
    FaRegStar,
    FaUser,
    FaUserGroup,
    FaUsers,
    FaUtensils,
} from "react-icons/fa6";
import { GiChefToque } from "react-icons/gi";

// local images (src/assets)
import frontImg from "../assets/Elkano64_Front.webp";
import foodImg from "../assets/Food_1.webp";
import tableImg from "../assets/Table_1.webp";

// dark-green headings in light mode, light text in dark mode
const headingColor = "text-neutral [[data-theme=elkanoDark]_&]:text-base-content";

// same container (max width + side padding) as the Navbar
const container = "relative mx-auto max-w-screen-2xl px-3 md:px-8 lg:px-16";

const values = [
    {
        icon: <FaLeaf />,
        title: "Quality Ingredients",
        text: "We use only the freshest, highest quality ingredients in every dish.",
    },
    {
        icon: <GiChefToque />,
        title: "Authentic Flavors",
        text: "We stay true to traditional recipes while adding our own unique touch.",
    },
    {
        icon: <FaUserGroup />,
        title: "Great Hospitality",
        text: "We treat every guest like family, because your happiness matters.",
    },
    {
        icon: <FaRegHeart />,
        title: "Sustainable Future",
        text: "We care about our community, our environment, and future generations.",
    },
];

const team = [
    { name: "Lucas Moreau", role: "Head Chef" },
    { name: "Sofia Romano", role: "Sous Chef" },
    { name: "Mateo Fischer", role: "Restaurant Manager" },
    { name: "Elena Novak", role: "Service Manager" },
];

const stats = [
    { icon: <FaUtensils />, value: "1000+", label: "Happy Customers" },
    { icon: <FaRegStar />, value: "4.8", label: "Average Rating" },
    { icon: <FaUsers />, value: "15+", label: "Team Members" },
    { icon: <FaLeaf />, value: "5+", label: "Local Suppliers" },
];

const About = () => {
    return (
        <div className="relative min-h-screen overflow-hidden bg-base-100">
            <Helmet>
                <title>Elkano64 - About Us</title>
            </Helmet>

            {/* ===================== 1. OUR STORY ===================== */}
            <section className="relative overflow-hidden py-10 lg:py-16">
                <FaLeaf className="pointer-events-none absolute -left-3 top-10 -rotate-[25deg] text-7xl text-secondary/25 lg:left-6 lg:top-24 lg:text-8xl" />

                <div className={`${container} grid items-center gap-12 lg:grid-cols-2 lg:gap-16`}>
                    {/* ---- photo collage ---- */}
                    <div className="relative mx-auto w-full max-w-xl pb-16 pl-3 sm:pb-20">
                        {/* soft tilted backdrop */}
                        <div className="absolute right-2 top-4 h-[85%] w-[70%] rotate-3 rounded-2xl bg-secondary/15" />

                        {/* main photo */}
                        <div className="relative w-[82%] -rotate-3 rounded-lg bg-base-100 p-2 shadow-xl ring-1 ring-base-300 sm:p-2.5">
                            <img
                                src={frontImg}
                                alt="Elkano64 restaurant front"
                                className="aspect-[4/3] w-full rounded object-cover"
                            />
                        </div>

                        {/* small polaroid */}
                        <div className="absolute bottom-0 right-0 w-[44%] rotate-6 rounded-lg bg-base-100 p-1.5 shadow-xl ring-1 ring-base-300 sm:p-2">
                            <img
                                src={foodImg}
                                alt="Signature dish"
                                className="aspect-[4/3] w-full rounded object-cover"
                            />
                            <p className="py-1.5 text-center font-script text-sm leading-none text-base-content/80 sm:py-2 sm:text-lg">
                                Good food, great moments.
                            </p>
                        </div>
                    </div>

                    {/* ---- text ---- */}
                    <div>
                        <div className="flex items-center gap-3">
                            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-primary md:text-xs">
                                Our Story
                            </p>
                            <span className="h-px w-12 bg-primary/60" />
                        </div>

                        <h1 className={`mt-3 font-serif text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl ${headingColor}`}>
                            A Passion for <br className="hidden sm:block" /> Good Food
                        </h1>

                        <p className="mt-4 max-w-xl text-sm leading-relaxed text-base-content/80 lg:text-base">
                            Elkano64 was born from a simple belief — that food has the power to bring people
                            together. Inspired by the rich flavors of traditional cuisine and the warmth of
                            shared tables, we created a space where every meal feels special.
                        </p>
                        <p className="mt-3 max-w-xl text-sm leading-relaxed text-base-content/80 lg:text-base">
                            Our journey began with a dream to serve authentic, high-quality food in a welcoming
                            environment. Today, Elkano64 is more than a restaurant — it’s a place where great
                            food, good company, and unforgettable moments come together.
                        </p>

                        <Link to="/all-foods" className="btn btn-primary btn-sm mt-6 h-10 min-h-0 gap-2 rounded-full px-6 text-xs">
                            Our Menu <FaArrowRight className="text-[11px]" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ===================== 2. OUR VALUES ===================== */}
            <section className="relative overflow-hidden bg-base-200 py-10 lg:py-14">
                <FaLeaf className="pointer-events-none absolute -right-4 top-6 -rotate-[20deg] scale-x-[-1] text-6xl text-secondary/25 lg:text-8xl" />
                <FaLeaf className="pointer-events-none absolute -left-4 bottom-4 rotate-[20deg] text-6xl text-secondary/25 lg:text-8xl" />

                <div className={container}>
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-3">
                            <span className="h-px w-8 bg-primary/60 md:w-14" />
                            <h2 className={`font-serif text-2xl font-bold lg:text-3xl ${headingColor}`}>Our Values</h2>
                            <span className="h-px w-8 bg-primary/60 md:w-14" />
                        </div>
                        <p className="mt-2 text-xs text-base-content/70 sm:text-sm">
                            The principles that guide everything we do
                        </p>
                    </div>

                    <div className="mt-8 grid gap-y-8 sm:grid-cols-2 lg:mt-10 lg:grid-cols-4 lg:gap-y-0 lg:divide-x lg:divide-base-300">
                        {values.map((v) => (
                            <div key={v.title} className="flex flex-col items-center px-4 text-center lg:px-8">
                                <span
                                    className={`grid h-14 w-14 place-items-center rounded-full border border-base-300 bg-base-100 text-2xl shadow-sm lg:h-16 lg:w-16 lg:text-3xl ${headingColor}`}
                                >
                                    {v.icon}
                                </span>
                                <h3 className={`mt-4 font-serif text-base font-bold lg:text-lg ${headingColor}`}>
                                    {v.title}
                                </h3>
                                <p className="mt-2 max-w-[15rem] text-xs leading-relaxed text-base-content/75 lg:text-[13px]">
                                    {v.text}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===================== 3. THE TEAM ===================== */}
            <section className="py-10 lg:py-16">
                <div className={`${container} grid items-center gap-8 lg:grid-cols-[1fr_2fr] lg:gap-12`}>
                    <div>
                        <div className="flex items-center gap-3">
                            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-primary md:text-xs">
                                The Team
                            </p>
                            <span className="h-px w-12 bg-primary/60" />
                        </div>

                        <h2 className={`mt-3 font-serif text-3xl font-bold leading-tight lg:text-4xl ${headingColor}`}>
                            People Behind <br className="hidden sm:block" /> Elkano64
                        </h2>

                        <p className="mt-4 max-w-md text-sm leading-relaxed text-base-content/80">
                            Our team is a blend of passionate chefs, dedicated staff, and food lovers who work
                            together to bring you the best dining experience. We believe in quality, teamwork,
                            and a shared love for great food.
                        </p>

                        <Link to="/contact" className="btn btn-primary btn-sm mt-6 h-10 min-h-0 gap-2 rounded-full px-6 text-xs">
                            Join Our Team <FaArrowRight className="text-[11px]" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                        {team.map((member) => (
                            <div
                                key={member.name}
                                className="overflow-hidden rounded-xl border border-base-300 bg-base-100 shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                            >
                                {/* placeholder user icon instead of a photo */}
                                <div className="grid aspect-[4/5] place-items-center bg-base-200">
                                    <FaUser className="text-6xl text-base-content/30 sm:text-7xl" />
                                </div>
                                <div className="px-3 py-3">
                                    <p className={`font-serif text-sm font-bold ${headingColor}`}>{member.name}</p>
                                    <p className="mt-0.5 text-[11px] text-base-content/70">{member.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===================== 4. OUR IMPACT ===================== */}
            <section className="grid overflow-hidden bg-neutral text-neutral-content lg:grid-cols-[1fr_2fr]">
                <img
                    src={tableImg}
                    alt="Elkano64 dining table"
                    loading="lazy"
                    className="h-56 w-full object-cover sm:h-72 lg:h-full lg:min-h-[17rem]"
                />

                <div className="relative overflow-hidden px-4 py-10 md:px-8 lg:px-14 lg:py-12">
                    <FaLeaf className="pointer-events-none absolute -right-3 top-3 -rotate-[20deg] text-7xl text-neutral-content/10 lg:text-9xl" />

                    <div className="relative">
                        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-content/70">
                            Our Impact
                        </p>
                        <h2 className="mt-2 font-serif text-2xl font-bold text-neutral-content lg:text-3xl">
                            More Than Just a Restaurant
                        </h2>
                        <p className="mt-3 max-w-lg text-sm leading-relaxed text-neutral-content/85">
                            We’re proud to be a part of this community — serving great food, creating jobs,
                            supporting local suppliers, and helping people come together, one meal at a time.
                        </p>

                        <div className="mt-8 grid grid-cols-2 gap-y-6 lg:grid-cols-4 lg:gap-y-0">
                            {stats.map((s, i) => (
                                <div
                                    key={s.label}
                                    className={`flex items-center gap-3 pr-2 ${i > 0 ? "lg:border-l lg:border-neutral-content/20 lg:pl-5" : ""}`}
                                >
                                    <span className="text-xl text-neutral-content lg:text-2xl">{s.icon}</span>
                                    <div className="leading-tight">
                                        <p className="font-serif text-xl font-bold text-neutral-content lg:text-2xl">
                                            {s.value}
                                        </p>
                                        <p className="text-[11px] text-neutral-content/75">{s.label}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ===================== 5. VISIT US ===================== */}
            <section className="relative overflow-hidden py-12 lg:py-14">
                <FaLeaf className="pointer-events-none absolute -left-3 bottom-2 rotate-[20deg] text-6xl text-secondary/25 lg:left-6 lg:text-8xl" />
                <FaLeaf className="pointer-events-none absolute -right-3 bottom-2 -rotate-[20deg] scale-x-[-1] text-6xl text-secondary/25 lg:right-6 lg:text-8xl" />

                <div className={`${container} text-center`}>
                    <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-primary md:text-xs">
                        Come Visit Us
                    </p>
                    <h2 className={`mt-2 font-serif text-2xl font-bold lg:text-3xl ${headingColor}`}>
                        We’d Love to See You
                    </h2>
                    <p className="mt-2 text-xs text-base-content/75 sm:text-sm">
                        Good food, great company, and unforgettable moments await.
                    </p>

                    {/* no action yet – the booking feature will be connected later */}
                    <button type="button" className="btn btn-primary btn-sm mt-5 h-10 min-h-0 gap-2 rounded-full px-7 text-xs">
                        Book a Table <FaArrowRight className="text-[11px]" />
                    </button>
                </div>
            </section>
        </div>
    );
};

export default About;