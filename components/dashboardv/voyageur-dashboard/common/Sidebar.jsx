import Image from "next/image";
import Link from "next/link";

const Sidebar = () => {
  const sidebarData = [
    // Laisse vide ou ajoute ici des items d’accordéon si nécessaire
  ];

  return (
    <>
      <div className="sidebar -dashboard" id="vendorSidebarMenu">
        {/* Mon agent */}
        <div className="sidebar__item ">
          <Link
            href="/voyageur-dashboard/agent"
            className="sidebar__button d-flex items-center text-15 lh-1 fw-500"
          >
            <Image
              width={20}
              height={20}
              src="/img/dashboard/sidebar/agent.png"
              alt="Mon agent"
              className="mr-15"
            />
            Mon agent
          </Link>
        </div>
        {/* End accordion__item */}

        {/* Réservations */}
        <div className="sidebar__item ">
          <Link
            href="/voyageur-dashboard/booking"
            className="sidebar__button d-flex items-center text-15 lh-1 fw-500"
          >
            <Image
              width={20}
              height={20}
              src="/img/dashboard/sidebar/reservation.png"
              alt="Réservations"
              className="mr-15"
            />
            Réservations
          </Link>
        </div>
        {/* End accordion__item */}

        {/* Commandes */}
        <div className="sidebar__item ">
          <Link
            href="/voyageur-dashboard/orders"
            className="sidebar__button d-flex items-center text-15 lh-1 fw-500"
          >
            <Image
              width={20}
              height={20}
              src="/img/dashboard/sidebar/partenaires.png"
              alt="Commandes"
              className="mr-15"
            />
            Commandes
          </Link>
        </div>
        {/* End accordion__item */}

        {/* Items dynamiques si tu en ajoutes dans sidebarData */}
        {sidebarData.map((item, index) => (
          <div className="sidebar__item" key={index}>
            <div className="accordion -db-sidebar js-accordion">
              <div className="accordion__item">
                <div
                  className="accordion__button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#sidebarItem${index}`}
                >
                  <div className="sidebar__button col-12 d-flex items-center justify-between">
                    <div className="d-flex items-center text-15 lh-1 fw-500">
                      <Image
                        width={20}
                        height={20}
                        src={item.icon}
                        alt={item.title}
                        className="mr-10"
                      />
                      {item.title}
                    </div>
                    <div className="icon-chevron-sm-down text-7" />
                  </div>
                </div>
                <div
                  id={`sidebarItem${index}`}
                  className="collapse"
                  data-bs-parent="#vendorSidebarMenu"
                >
                  <ul className="list-disc pt-15 pb-5 pl-40">
                    {item.links?.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <Link href={link.href} className="text-15">
                          {link.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Bouton footer de la sidebar */}
        <div className="sidebar__item mt-30">
          <Link
            href="/"
            className="button h-50 px-24 text-white d-flex items-center justify-center"
            style={{ backgroundColor: "#007ad5" }}
          >
            Réserver un logement
            <div className="icon-home ml-15" />
          </Link>
        </div>
        {/* End accordion__item */}
      </div>
    </>
  );
};

export default Sidebar;
