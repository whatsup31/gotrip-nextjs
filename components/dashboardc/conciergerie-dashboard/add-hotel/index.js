
import Sidebar from "../common/Sidebar";
import Header from "../../../../components/header/dashboard-header";
import SettingsTabs from "./components/index";
import Footer from "../common/Footer";


const index = () => {
  return (
    <>
      {/*  */}
      {/* End Page Title */}

      <div className="header-margin"></div>

      <Header />
      {/* End dashboard-header */}

      <div className="dashboard">
        <div className="dashboard__sidebar bg-white scroll-bar-1">
          <Sidebar />
          {/* End sidebar */}
        </div>
        {/* End dashboard__sidebar */}

        <div className="dashboard__main">
        <div className="dashboard__content bg-light-2">
            <div className="row y-gap-20 justify-between items-end pb-60 lg:pb-40 md:pb-32">
              <div className="col-auto">
                <h1 className="text-30 lh-14 fw-600">Ajouter un logement</h1>
                <div className="text-15 text-light-1">
                  Ajouter un nouveau logement en quelques clics
                </div>
              </div>
              {/* End .col-auto */}

              <div className="col-auto">
              <a
 href="/conciergerie-dashboard/add-hotel"
 className="button h-50 px-24 text-white"  style={{ backgroundColor: "#00d2b5" }}
                >
                  Publier le logement<div className="icon-check ml-15"></div>
                </a>
              </div>
            </div>
            {/* End .row */}

            <div className="py-30 px-30 rounded-4 bg-white shadow-3">
              <SettingsTabs />
            </div>

            <Footer />
          </div>
          {/* End .dashboard__content */}
        </div>
        {/* End dashbaord content */}
      </div>
      {/* End dashbaord content */}
    </>
  );
};

export default index;
