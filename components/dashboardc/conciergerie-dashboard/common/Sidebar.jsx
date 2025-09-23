import Image from "next/image";
import Link from "next/link";

const Sidebar = () => {
  const sidebarData = [

  ];

  return (
    <>
      <div className="sidebar -dashboard" id="vendorSidebarMenu">
        <div className="sidebar__item ">
          <Link
            href="/conciergerie-dashboard/dashboard"
            className="sidebar__button d-flex items-center text-15 lh-1 fw-500"
          >
            <Image
              width={20}
              height={20}
              src="/img/dashboard/sidebar/activites.png"
              alt="image"
              className="mr-15"
            />
            Revenus
          </Link>
        </div>
        {/* End accordion__item */}

        <div className="sidebar__item ">
          <a
            href="/conciergerie-dashboard/booking"
            className="sidebar__button d-flex items-center text-15 lh-1 fw-500"
          >
            <Image
              width={20}
              height={20}
              src="/img/dashboard/sidebar/reservation.png"
              alt="image"
              className="mr-15"
            />
            Réservations
          </a>
        </div>
        {/* End accordion__item */}

        <div className="sidebar__item ">
          <a
            href="/conciergerie-dashboard/hotels"
            className="sidebar__button d-flex items-center text-15 lh-1 fw-500"
          >
            <Image
              width={20}
              height={20}
              src="/img/dashboard/sidebar/logements.png"
              alt="image"
              className="mr-15"
            />
            Logements
          </a>
        </div>
        {/* End accordion__item */}

        <div className="sidebar__item ">
          <a
            href="/conciergerie-dashboard/owners"
            className="sidebar__button d-flex items-center text-15 lh-1 fw-500"
          >
            <Image
              width={20}
              height={20}
              src="/img/dashboard/sidebar/owners.png"
              alt="image"
              className="mr-15"
            />
            Propriétaires
          </a>
        </div>
        {/* End accordion__item */}


        <div className="sidebar__item ">
          <a
            href="/conciergerie-dashboard/partners"
            className="sidebar__button d-flex items-center text-15 lh-1 fw-500"
          >
            <Image
              width={20}
              height={20}
              src="/img/dashboard/sidebar/partenaires.png"
              alt="image"
              className="mr-15"
            />
            Partenaires
          </a>
        </div>
        {/* End accordion__item */}

        <div className="sidebar__item ">
          <a
            href="/conciergerie-dashboard/billing"
            className="sidebar__button d-flex items-center text-15 lh-1 fw-500"
          >
            <Image
              width={20}
              height={20}
              src="/img/dashboard/sidebar/facturation.png"
              alt="image"
              className="mr-15"
            />
            Facturation
          </a>
        </div>
        {/* End accordion__item */}

        <div className="sidebar__item ">

  <div className="d-flex flex-column gap-3 mt-30">
  <a
    href="/conciergerie-dashboard/add-hotel"
    className="button h-50 px-24 text-white"  style={{ backgroundColor: "#007cd2" }}
  >
    Ajouter un logement
    <div className="icon-plus ml-15" />
  </a>

</div>

        </div>
        {/* End accordion__item */}

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
                        alt="image"
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
                    {item.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <a href={link.href} className="text-15">
                          {link.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ))}

    
      </div>
    </>
  );
};

export default Sidebar;
