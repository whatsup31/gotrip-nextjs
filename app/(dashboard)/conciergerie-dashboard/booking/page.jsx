// app/(dashboard)/conciergerie-dashboard/booking/page.jsx
import DashboardPage from "../../../../components/dashboardc/conciergerie-dashboard/booking";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

export const metadata = {
  title: "Vendor History | ômi",
  description: "ômi - votre voyage commence ici",
};

export const dynamic = "force-dynamic";

export default async function Page() {
  const cookieStore = await cookies();

  const supabase = createServerComponentClient({
    cookies: () => cookieStore,
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login?redirect=/conciergerie-dashboard/booking");
  }

  return <DashboardPage />;
}
