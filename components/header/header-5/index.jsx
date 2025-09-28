// components/header/header-5/index.jsx
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import MainMenu from '../MainMenu';
import MobileMenu from '../MobileMenu';

import { supabaseBrowser } from '@/utils/supabase-browser';
import { getDashboardPath } from '@/utils/role-routing';

const Header5 = () => {
  const [navbar, setNavbar] = useState(false);

  // Auth state
  const [loaded, setLoaded] = useState(false);
  const [displayName, setDisplayName] = useState(null);
  const [role, setRole] = useState(null);

  // Sticky header
  useEffect(() => {
    const changeBackground = () => {
      setNavbar(window.scrollY >= 10);
    };
    window.addEventListener('scroll', changeBackground);
    return () => window.removeEventListener('scroll', changeBackground);
  }, []);

  // Load user + profile (display_name, role)
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
          console.error('[header-5] profiles fetch error:', error);
          setLoaded(true);
          return;
        }

        setDisplayName(profile?.display_name ?? 'Mon compte');
        setRole(profile?.role ?? null);
        setLoaded(true);
      } catch (e) {
        console.error('[header-5] auth error:', e);
        setLoaded(true);
      }
    })();
  }, []);

  const isLoggedIn = !!displayName;
  const dashboardHref = getDashboardPath(role);

  return (
    <header className={`header -type-5 ${navbar ? '-header-5-sticky' : ''}`}>
      <div className="header__container container">
        <div className="row justify-between items-center">
          <div className="col-auto mobile-col">
            <div className="d-flex items-center">
              <div className="mr-20 d-flex items-center">
                <div className="mr-15 d-none md:d-flex">
                  <Link
                    href={isLoggedIn ? dashboardHref : '/login'}
                    className="icon-user text-inherit text-22 "
                    aria-label={isLoggedIn ? displayName : 'Se connecter'}
                    title={isLoggedIn ? displayName : 'Se connecter'}
                  />
                </div>

                <button
                  className="d-flex items-center icon-menu text-dark-1 text-20"
                  data-bs-toggle="offcanvas"
                  aria-controls="mobile-sidebar_menu"
                  data-bs-target="#mobile-sidebar_menu"
                ></button>

                <div
                  className="offcanvas offcanvas-start mobile_menu-contnet"
                  tabIndex="-1"
                  id="mobile-sidebar_menu"
                  aria-labelledby="offcanvasMenuLabel"
                  data-bs-scroll="true"
                >
                  <MobileMenu />
                </div>
              </div>

              <Link href="/" className="header-logo mr-20">
                <img src="/img/general/logo-omi.png" alt="logo icon" />
                <img src="/img/general/logo-omi.png" alt="logo icon" />
              </Link>

              <div className="header-menu">
                <div className="header-menu__content">
                  <MainMenu style="text-dark-1" />
                </div>
              </div>
            </div>
          </div>

          <div className="col-auto">
            <div className="d-flex items-center ml-20 is-menu-opened-hide md:d-none">
              <div className="header__buttons d-flex items-center is-menu-opened-hide">
                <Link
                  href="/voyageur-dashboard/agent"
                  className="button h-50 px-24 text-white"
                  style={{ backgroundColor: '#007cd2' }}
                >
                  Mon assistant voyage
                  <div className="icon-star ml-15" />
                </Link>

                {loaded && isLoggedIn ? (
                  <Link
                    href={dashboardHref}
                    className="button h-50 px-30 fw-400 text-14 -outline-white text-white ml-20 sm:ml-0"
                  >
                    {displayName}
                    <div className="icon-user ml-15" />
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    className="button h-50 px-30 fw-400 text-14 -outline-white text-white ml-20 sm:ml-0"
                  >
                    Se connecter
                    <div className="icon-user ml-15" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header5;
