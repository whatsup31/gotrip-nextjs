'use client'

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import MainMenu from "../MainMenu";
import MobileMenu from "../MobileMenu";

const HeaderDashBoard = () => {
  const [navbar, setNavbar] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Progress data
  const [xp, setXp] = useState(586);
  const [xpTarget, setXpTarget] = useState(1000);
  const left = Math.max(0, xpTarget - xp);
  const percent = useMemo(() => Math.max(0, Math.min(100, (xp / xpTarget) * 100)), [xp, xpTarget]);

  const handleToggle = () => setIsOpen((v) => !v);
  const changeBackground = () => setNavbar(window.scrollY >= 10);

  useEffect(() => {
    window.addEventListener("scroll", changeBackground);
    const body = document.querySelector("body");
    if (isOpen) body.classList.add("-is-sidebar-open");
    else body.classList.remove("-is-sidebar-open");
    return () => window.removeEventListener("scroll", changeBackground);
  }, [isOpen]);

  return (
    <>
      <header className={`header -dashboard ${navbar ? "is-sticky bg-white" : ""}`}>
        <div className="header__container px-30 sm:px-20">
          <div className="-left-side">
            <Link href="/" className="header-logo">
              <img src="/img/general/logo-omi.png" alt="logo icon" />
            </Link>
          </div>

          <div className="row justify-between items-center pl-60 lg:pl-20">
            <div className="col-auto">
              <div className="d-flex items-center">
                <button className="d-flex" onClick={handleToggle}>
                  <i className="icon-menu-2 text-20"></i>
                </button>

                {/* Search */}
                <div className="single-field relative d-flex items-center md:d-none ml-30">
                  <input className="pl-50 border-light text-dark-1 h-50 rounded-8" type="text" placeholder="Search" />
                  <button className="absolute d-flex items-center h-full">
                    <i className="icon-search text-20 px-15 text-dark-1"></i>
                  </button>
                </div>

                {/* === XP pill progress === */}
                <div className="omi-pill md:d-none ml-120">
                  {/* Avatar */}
                  <div className="omi-pill__avatar">
                    <Image src="/img/general/euro.png" alt="Treasure" width={40} height={40} />
                  </div>

                  {/* Texte + Progress */}
                  <div className="omi-pill__body">
                    <div className="omi-pill__title">
                      {left} points cumulés
                    </div>

                    <div className="omi-pill__bar">
                      <div className="omi-pill__barFill" style={{ width: `${percent}%` }} />
                    </div>

                    <div className="omi-pill__sub">
                      <i className="icon-alert text-14 mr-6" style={{ color: "#ef4444" }} />
                      <span>Utilisez vos points pour réserver</span>
                    </div>
                  </div>

                  {/* Chevron */}
                  <button className="omi-pill__cta" aria-label="Open">
                    <i className="icon-chevron-right text-18" />
                  </button>
                </div>
              </div>
            </div>

            <div className="col-auto">
              <div className="d-flex items-center">
                <div className="header-menu">
                  <div className="header-menu__content">
                    <MainMenu style="text-dark-1" />
                  </div>
                </div>

                <div className="row items-center x-gap-5 y-gap-20 pl-20 lg:d-none">
                  <div className="col-auto">
                    <button className="button -blue-1-05 size-50 rounded-22 flex-center">
                      <i className="icon-email-2 text-20"></i>
                    </button>
                  </div>
                  <div className="col-auto">
                    <button className="button -blue-1-05 size-50 rounded-22 flex-center">
                      <i className="icon-notification text-20"></i>
                    </button>
                  </div>
                </div>

                <div className="pl-15">
                  <Image
                    width={50}
                    height={50}
                    src="/img/general/userpicture.webp"
                    alt="image"
                    className="size-50 rounded-22 object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Styles XP pill */}
      <style jsx>{`
        .omi-pill {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 4px 16px;
          border-radius: 12px;
          background: #fff9dc;

          min-width: 320px;
          max-width: 400px;
        }
        .omi-pill__avatar {
          flex: 0 0 auto;
          display: grid;
          place-items: center;
        }
        .omi-pill__body {
          flex: 1 1 auto;
        }
        .omi-pill__title {
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 2px;
          color: #111827;
        }
        .omi-pill__bar {
          height: 6px;
          border-radius: 999px;
          background: #e5e7eb;
          overflow: hidden;
          margin-bottom: 2px;
        }
        .omi-pill__barFill {
          height: 100%;
          background: #ffc70f;
          transition: width 0.3s ease;
        }
        .omi-pill__sub {
          font-size: 11px;
          color: #6b7280;
          align-items: left;
          gap: 4px;
        }
        .omi-pill__cta {
          flex: 0 0 auto;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          display: grid;
          place-items: center;
        }
      `}</style>
    </>
  );
};

export default HeaderDashBoard;
