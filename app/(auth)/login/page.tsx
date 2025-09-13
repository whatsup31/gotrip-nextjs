// app/(auth)/login/page.tsx
import CallToActions from '@/components/common/CallToActions';
import DefaultHeader from '@/components/header/default-header';
import DefaultFooter from '@/components/footer/default';
import LoginWithSocial from '@/components/common/LoginWithSocial';
import LoginClient from './LoginClient';

export const metadata = {
  title: 'Login || GoTrip - Travel & Tour React NextJS Template',
  description: 'GoTrip - Travel & Tour React NextJS Template',
};

export default function Page() {
  return (
    <>
      {/* margin under sticky header */}
      <div className="header-margin" />

      <DefaultHeader />

      <section className="layout-pt-lg layout-pb-lg bg-blue-2">
        <div className="container">
          <div className="row justify-center">
            <div className="col-xl-6 col-lg-7 col-md-9">
              <div className="px-50 py-50 sm:px-20 sm:py-20 bg-white shadow-4 rounded-4">
                {/* Client form with Supabase logic */}
                <LoginClient />

                <div className="row y-gap-20 pt-30">
                  <div className="col-12">
                    <div className="text-center">or sign in with</div>
                  </div>

                  {/* Optional social buttons (still UI-level for now) */}
                  <LoginWithSocial />

                  <div className="col-12">
                    <div className="text-center px-30">
                      By creating an account, you agree to our Terms of Service and Privacy Statement.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CallToActions />
      <DefaultFooter />
    </>
  );
}
