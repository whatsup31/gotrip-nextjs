import Header5 from "@/components/header/header-5";
import Hero5 from "@/components/hero/hero-5";
import Link from "next/link";
import Footer4 from "@/components/footer/footer-4";
import Tours2 from "@/components/tours/Tours2";
import TourCategories from "@/components/home/home-5/TourCategories";
import Locations from "@/components/home/home-5/Locations";
import CallToActions from "@/components/home/home-5/CallToActions";
import Blog from "@/components/blog/Blog3";
import Tours3 from "@/components/tours/Tours3";
import DiscountsBanner from "@/components/home/home-5/DiscountsBanner";
import Counter3 from "@/components/counter/Counter3";
import WhyChooseUs from "@/components/home/home-5/WhyChooseUs";
import Testimonial from "@/components/home/home-5/Testimonial";
import Brand2 from "@/components/brand/Brand2";

export const metadata = {
  title: "Home-5 || GoTrip - Travel & Tour React NextJS Template",
  description: "GoTrip - Travel & Tour React NextJS Template",
};

const home_5 = () => {
  return (
    <>
      {/* End Page Title */}

      <Header5 />
      {/* End Header 5 */}

      <Hero5 />
      {/* End Hero 5 */}

      <section className="layout-pt-md layout-pb-md">
        <div className="container">
          <div className="row y-gap-20 justify-between items-end">
            <div className="col-auto">
              <div className="sectionTitle -md">
                <h2 className="sectionTitle__title">Voyagez pas très loin</h2>
                <p className=" sectionTitle__text mt-5 sm:mt-0">
                  Logement les plus populaires en France
                </p>
              </div>
            </div>
            {/* End .col */}

            <div className="col-auto">
              <Link
                href="#"
                className="button -md -blue-1 bg-blue-1-05 text-blue-1"
              >
                More <div className="icon-arrow-top-right ml-15" />
              </Link>
            </div>
            {/* End .col */}
          </div>
          {/* End .row */}

          <div className="row y-gap-30 pt-40 sm:pt-20 item_gap-x30">
            <Tours2 />
          </div>
          {/* End .row */}
        </div>
        {/* End .container */}
      </section>
      {/* End Tours Sections */}

      <section className="layout-pt-lg layout-pb-md">
        <div className="container">
          <div className="row y-gap-20 justify-between items-end">
            <div className="col-auto">
              <div className="sectionTitle -md">
                <h2 className="sectionTitle__title">Découvrez le monde</h2>
                <p className=" sectionTitle__text mt-5 sm:mt-0">
                  Logements populaires tout autour du monde
                </p>
              </div>
            </div>
            {/* End .col */}

            <div className="col-auto">
              <Link
                href="#"
                className="button -md -blue-1 bg-blue-1-05 text-blue-1"
              >
                More <div className="icon-arrow-top-right ml-15" />
              </Link>
            </div>
            {/* End .col */}
          </div>
          {/* End .row */}

          <div className="row y-gap-30 pt-40 sm:pt-20 item_gap-x30">
            <Tours2 />
          </div>
          {/* End .row */}
        </div>
        {/* End .container */}
      </section>
      {/* End Tours Sections */}

      <section className="layout-pt-lg layout-pb-md">
        <div className="container">
          <div className="row y-gap-20 justify-between items-end">
            <div className="col-auto">
              <div className="sectionTitle -md">
                <h2 className="sectionTitle__title">Une expérience inoubliable</h2>
                <p className=" sectionTitle__text mt-5 sm:mt-0">
                  Interdum et malesuada fames ac ante ipsum
                </p>
              </div>
            </div>
            {/* End .col */}

            <div className="col-auto">
              <Link
                href="#"
                className="button -md -blue-1 bg-blue-1-05 text-blue-1"
              >
                Découvrir <div className="icon-arrow-top-right ml-15" />
              </Link>
            </div>
            {/* End .col */}
          </div>
          {/* End .row */}

          <div className="row y-gap-30 pt-40 sm:pt-20 item_gap-x30">
            <Tours2 />
          </div>
          {/* End .row */}
        </div>
        {/* End .container */}
      </section>
      {/* End Tours Sections */}

      <section className="layout-pt-md layout-pb-md">
        <div className="container">
          <div className="row justify-center text-center">
            <div className="col-auto">
              <div className="sectionTitle -md">
                <h2 className="sectionTitle__title">
                  Get inspiration for your next trip
                </h2>
                <p className=" sectionTitle__text mt-5 sm:mt-0">
                  Interdum et malesuada fames
                </p>
              </div>
            </div>
          </div>
          {/* End .row  */}
          <div className="row y-gap-30 pt-40">
            <Blog />
          </div>
          {/* End .row */}
        </div>
        {/* End .container */}
      </section>
      {/* End blog Section */}


     

      <CallToActions />
      {/* End CallToActions */}

      <Footer4 />
      {/* End Footer Section */}
    </>
  );
};

export default home_5;
