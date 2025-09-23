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
<<<<<<< HEAD
            href="/voyageur-dashboard/dashboard"
=======
            href="/voyageur-dashboard/agent"
>>>>>>> frontend-2309
            className="sidebar__button d-flex items-center text-15 lh-1 fw-500"
          >
            <Image
              width={20}
              height={20}
<<<<<<< HEAD
              src="/img/dashboard/sidebar/compass.svg"
=======
              src="/img/dashboard/sidebar/agent.png"
>>>>>>> frontend-2309
              alt="image"
              className="mr-15"
            />
            Mon agent
          </Link>
        </div>
        {/* End accordion__item */}

        <div className="sidebar__item ">
          <a
            href="/voyageur-dashboard/booking"
            className="sidebar__button d-flex items-center text-15 lh-1 fw-500"
          >
            <Image
              width={20}
              height={20}
<<<<<<< HEAD
              src="/img/dashboard/sidebar/booking.svg"
=======
              src="/img/dashboard/sidebar/reservation.png"
>>>>>>> frontend-2309
              alt="image"
              className="mr-15"
            />
            Réservations
          </a>
        </div>
        {/* End accordion__item */}

        <div className="sidebar__item ">
          <a
<<<<<<< HEAD
            href="/voyageur-dashboard/hotels"
=======
            href="/voyageur-dashboard/orders"
>>>>>>> frontend-2309
            className="sidebar__button d-flex items-center text-15 lh-1 fw-500"
          >
            <Image
              width={20}
              height={20}
<<<<<<< HEAD
              src="/img/dashboard/sidebar/booking.svg"
=======
              src="/img/dashboard/sidebar/partenaires.png"
>>>>>>> frontend-2309
              alt="image"
              className="mr-15"
            />
            Commandes
          </a>
        </div>
        {/* End accordion__item */}

<<<<<<< HEAD
        <div className="sidebar__item ">
          <a
            href="/voyageur-dashboard/booking"
            className="sidebar__button d-flex items-center text-15 lh-1 fw-500"
          >
            <Image
              width={20}
              height={20}
              src="/img/dashboard/sidebar/booking.svg"
              alt="image"
              className="mr-15"
            />
            Facturation
          </a>
        </div>
        {/* End accordion__item */}

=======
>>>>>>> frontend-2309
       
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

     
<<<<<<< HEAD
<div className="sidebar__item ">

<a
href="/voyageur-dashboard/add-hotel"
className="button h-50 px-24 -dark-1 bg-white border-blue-1 text-blue"
>
Réserver un logement
<div className="icon-home ml-15" />
=======
<div className="d-flex flex-column gap-3 mt-30">
<a
href="/voyageur-dashboard/add-hotel"
className="button h-50 px-24 text-white"  style={{ backgroundColor: "#007cd2" }}
>
Réserver un logement
>>>>>>> frontend-2309
</a>

</div>
{/* End accordion__item */}
      </div>
    </>
  );
};

export default Sidebar;
