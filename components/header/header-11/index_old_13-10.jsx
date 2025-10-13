// components/header/header-11/index.jsx
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import MainMenu from '../MainMenu';
import CurrenctyMegaMenu from '../CurrenctyMegaMenu';
import LanguageMegaMenu from '../LanguageMegaMenu';
import MobileMenu from '../MobileMenu';

import { supabaseBrowser } from '@/utils/supabase-browser';
import { getDashboardPath } from '@/utils/role-routing';

const Header11 = () => {
  const [navbar, setNavbar] = useState(false);

  // ---- Auth state ----
  const [loaded, setLoaded] = useState(false);
  const [displayName, setDisplayName] = useState(null);
  const [role, setRole] = useState(null);

  // Sticky header
  useEffect(() => {
    const onScroll = () => setNavbar(window.scrollY >= 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Fetch user + profile
  useEffect(() => {
    (async () => {
      try {
        const supabase = supabaseBrowser();
        const { data: userRes } = await supabase.auth.getUser();
        const user = userRes?.user;
        if (!user) {
          setLoaded(true);
          return;
        }

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('display_name, role')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('[header-11] profiles fetch error:', error);
          setLoaded(true);
          return;
        }

        setDisplayName(profile?.display_name ?? 'Mon compte');
        setRole(profile?.role ?? null);
        setLoaded(true);
      } catch (e) {
        console.error('[header-11] auth error:', e);
        setLoaded(true);
      }
    })();
  }, []);

  const isLoggedIn = !!displayName;
  const dashboardHref = getDashboardPath(role);

  return (
    <>
      <header className={`header bg-dark-3 ${navbar ? 'is-sticky' : ''}`}>
        <div className="header__container px-30 sm:px-20">
          <div className="row justify-between items-center">
            <div className="col-auto">
              <div className="d-flex items-center">
                <Link href="/" className="header-logo mr-20">
                  <img src="/img/general/logo-omi-white.png" alt="logo icon" />
                  <img src="/img/general/logo-omi.png" alt="logo icon" />
                </Link>

                <div className="header-menu">
                  <div className="header-menu__content">
                    <MainMenu style="text-white" />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-auto">
              <div className="d-flex items-center">
                <div className="row x-gap-20 items-center xxl:d-none">
                  <CurrenctyMegaMenu textClass="text-white" />

                  <div className="col-auto">
                    <div className="w-1 h-20 bg-white-20" />
                  </div>

                  <LanguageMegaMenu textClass="text-white" />
                </div>

                {/* Boutons desktop */}
                <div className="d-flex items-center ml-20 is-menu-opened-hide md:d-none">
                  <Link
                    href="/login"
                    className="button px-30 fw-400 text-14 -white bg-white h-50 text-dark-1"
                  >
                    Mon assistant voyage
                  </Link>

                  {loaded && isLoggedIn ? (
                    <Link
                      href={dashboardHref}
                      className="button px-30 fw-400 text-14 border-white -outline-white h-50 text-white ml-20"
                    >
                      {displayName}
                    </Link>
                  ) : (
                    <Link
                      href="/login"
                      className="button px-30 fw-400 text-14 border-white -outline-white h-50 text-white ml-20"
                    >
                      Se connecter
                    </Link>
                  )}
                </div>

                {/* Icône mobile */}
                <div className="d-none xl:d-flex x-gap-20 items-center pl-30 text-white">
                  <div>
                    <Link
                      href={loaded && isLoggedIn ? dashboardHref : '/login'}
                      className="d-flex items-center icon-user text-inherit text-22"
                      aria-label={loaded && isLoggedIn ? displayName : 'Se connecter'}
                      title={loaded && isLoggedIn ? displayName : 'Se connecter'}
                    />
                  </div>
                  <div>
                    <button
                      className="d-flex items-center icon-menu text-inherit text-20"
                      data-bs-toggle="offcanvas"
                      aria-controls="mobile-sidebar_menu"
                      data-bs-target="#mobile-sidebar_menu"
                    />
                    <div
                      className="offcanvas offcanvas-start  mobile_menu-contnet"
                      tabIndex="-1"
                      id="mobile-sidebar_menu"
                      aria-labelledby="offcanvasMenuLabel"
                      data-bs-scroll="true"
                    >
                      <MobileMenu />
                    </div>
                  </div>
                </div>
                {/* Fin mobile */}
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header11;
