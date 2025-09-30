// app/(homes)/home_5/page.jsx
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
import HotelTypes from "@/components/home/home-7/HotelTypes";
import Hotels3 from "@/components/hotels/Hotels3";
import TopServices from "@/components/services/TopServicesV2";



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

      <section className="layout-pt-md layout-pb-lg">
        <div className="container">
          <div className="row y-gap-10 justify-between items-end">
            <div className="col-auto">
              <div className="sectionTitle -md">
                <h2 className="sectionTitle__title">Logements qui ont la côte</h2> 
              </div>
            </div>
            {/* End .col-auto */}

            <div className="col-auto tabs -pills-2 ">
              <div className="tabs__controls row x-gap-10 justify-center js-tabs-controls"></div>
            </div>
            {/* End .col-auto */}
          </div>
          {/* End .row */}

          <div className="relative  pt-40 sm:pt-20">
            <div className="row y-gap-30">
              <Hotels3 />
            </div>
          </div>
          {/* End relative */}
        </div>
      </section>
      {/* End Best Seller Hotels Sections */}

      <section className="layout-pt-md layout-pb-lg">
        <div className="container">
          <div className="row y-gap-10 justify-between items-end">
            <div className="col-auto">
              <div className="sectionTitle -md">
                <h2 className="sectionTitle__title">Services les plus demandés</h2> 
              </div>
            </div>
            {/* End .col-auto */}

            <div className="col-auto tabs -pills-2 ">
              <div className="tabs__controls row x-gap-10 justify-center js-tabs-controls"></div>
            </div>
            {/* End .col-auto */}
          </div>
          {/* End .row */}

          <div className="relative  pt-40 sm:pt-20">
            <div className="row y-gap-30">
              <TopServices />
            </div>
          </div>
          {/* End relative */}
        </div>
      </section>
      {/* End Best Seller Hotels Sections */}

      <CallToActions />
      {/* End CallToActions */}

      <Footer4 />
      {/* End Footer Section */}
    </>
  );
};

export default home_5;
