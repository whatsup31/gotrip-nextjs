import Sidebar from "../common/Sidebar";
import Header from "../../../header/dashboard-header";
import Footer from "../common/Footer";
import OmiChat from "@/components/omichat"

const Index = () => {
  return (
    <>
      <div className="header-margin"></div>

      <Header />

      <div className="dashboard">
        <div className="dashboard__sidebar bg-white scroll-bar-1">
          <Sidebar />
        </div>

        <div className="dashboard__main">
          <div className="dashboard__content bg-light-2">
            <div className="row y-gap-20 justify-between items-end pb-60 lg:pb-40 md:pb-32">
              <div className="col-auto">
                <h1 className="text-30 lh-14 fw-600">Mon agent voyage</h1>
                <div className="text-15 text-light-1">
                  Pour une expérience sur mesure et inoubliable
                </div>
              </div>

              <div className="col-auto">
                <a
                  href="/conciergerie-dashboard/add-hotel"
                  className="button h-50 px-24 text-white"
                  style={{ backgroundColor: "#007cd2" }}
                >
                  Historique <div className="icon-clock ml-15"></div>
                </a>
              </div>
            </div>

            {/* Bloc principal : on remplace l'ancien textarea+btn par OmiChat */}
            <div className="py-30 px-30 rounded-4 bg-white shadow-3">
              <OmiChat />
            </div>

            <Footer />
          </div>
        </div>
      </div>
    </>
  );
};

export default Index;
