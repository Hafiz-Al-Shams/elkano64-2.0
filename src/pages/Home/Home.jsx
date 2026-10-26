import { Helmet } from "react-helmet-async";
import Banner from "../../components/Banner";
import FixedBadge from "../../components/FixedBadge";
import TopFoods from "../../components/TopFoods";
import Review from "../../components/Review";
import Events from "../../components/Events";
import Services from "../../components/Services";



const Home = () => {
    return (
        <>
            <Helmet>
                <title>Elkano64 - Home</title>
            </Helmet>

            <Banner></Banner>
            <FixedBadge></FixedBadge>
            <div className="bg-base-200/40">
                <TopFoods></TopFoods>
            </div>
            <div className="">
                <Services></Services>
            </div>
            <Review></Review>
            <Events></Events>
        </>
    );
};

export default Home;