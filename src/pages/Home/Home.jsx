import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import Banner from "../../components/Banner";
import Categories from "../../components/Categories";
import TopFoods from "../../components/TopFoods";
import Services from "../../components/Services";
import OurStory from "../../components/OurStory";
import Review from "../../components/Review";
import ReserveTable from "../../components/ReserveTable";
import Events from "../../components/Events";

const Home = () => {
    const { hash } = useLocation();

    // smooth-scroll to #about / #contact when coming from the navbar / footer
    useEffect(() => {
        if (!hash) return;
        const timer = setTimeout(() => {
            document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 80);
        return () => clearTimeout(timer);
    }, [hash]);

    return (
        <>
            <Helmet>
                <title>Elkano64 - Home</title>
            </Helmet>

            <Banner />

            <div className="bg-base-100">
                <Categories />
                <TopFoods />
            </div>

            <Services />

            <section id="about" className="scroll-mt-24 bg-base-100 py-10 lg:py-14">
                <div className="mx-auto grid max-w-screen-2xl gap-8 px-4 md:px-8 lg:grid-cols-[1fr_1.15fr] lg:gap-10 lg:px-16">
                    <OurStory />
                    <Review />
                </div>
            </section>

            <ReserveTable />
            <Events />
        </>
    );
};

export default Home;