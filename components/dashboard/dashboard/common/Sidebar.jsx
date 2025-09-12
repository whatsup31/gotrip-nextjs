'use client'

import Image from "next/image";
import Link from "next/link";

import { isActiveLink } from "@/utils/linkActiveChecker";
import { usePathname } from "next/navigation";

const Sidebar = () => {
const pathname = usePathname()

  const sidebarContent = [
    {
      id: 1,
      icon: "/img/dashboard/sidebar/compass.svg",
      name: "Revenus",
      routePath: "/dashboard/db-dashboard",
    },
    {
      id: 2,
      icon: "/img/dashboard/sidebar/booking.svg",
      name: "Réservations",
      routePath: "/vendor-dashboard/booking",
    },

    {
      id: 3,
      icon: "/img/dashboard/sidebar/booking.svg",
      name: "Logements",
      routePath: "/vendor-dashboard/hotels",
    },

    {
      id: 4,
      icon: "/img/dashboard/sidebar/booking.svg",
      name: "Partenaires",
      routePath: "/dashboard/db-booking",
    },

    {
      id: 5,
      icon: "/img/dashboard/sidebar/booking.svg",
      name: "Facturation",
      routePath: "/dashboard/db-booking",
    },

    {
      id: 7,
      icon: "/img/dashboard/sidebar/gear.svg",
      name: "Réglages",
      routePath: "/dashboard/db-settings",
    },
    {
      id: 8,
      icon: "/img/dashboard/sidebar/log-out.svg",
      name: "Déconnexion",
      routePath: "/login",
    },
    {
      id: 9,
      icon: "/img/dashboard/sidebar/log-out.svg",
      name: "Ajouter un logement",
      routePath: "/vendor-dashboard/add-hotel",
    },
  ];
  return (
    <div className="sidebar -dashboard">
      {sidebarContent.map((item) => (
        <div className="sidebar__item" key={item.id}>
          <div
            className={`${
              isActiveLink(item.routePath, pathname) ? "-is-active" : ""
            } sidebar__button `}
          >
            <Link
              href={item.routePath}
              className="d-flex items-center text-15 lh-1 fw-500"
            >
              <Image
                width={20}
                height={20}
                src={item.icon}
                alt="image"
                className="mr-15"
              />
              {item.name}
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
