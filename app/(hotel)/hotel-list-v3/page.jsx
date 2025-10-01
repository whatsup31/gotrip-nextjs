// app/(hotel)/hotel-list-v3/page.jsx
import { headers } from "next/headers";
import Header11 from "@/components/header/header-11";
import DropdownSelelctBar from "@/components/hotel-list/common/DropdownSelelctBar";
import MapPropertyFinder from "@/components/hotel-list/common/MapPropertyFinder";
import Pagination from "@/components/hotel-list/common/Pagination";
import HotelProperties from "@/components/hotel-list/hotel-list-v3/HotelProperties";
import MainFilterSearchBox from "@/components/hotel-list/hotel-list-v3/MainFilterSearchBox";
import TopHeaderFilter from "@/components/hotel-list/hotel-list-v3/TopHeaderFilter";

export const metadata = {
  title: "Hotel List v3 || GoTrip - Travel & Tour React NextJS Template",
  description: "GoTrip - Travel & Tour React NextJS Template",
};

export default async function Page({ searchParams }) {
  const page = Number(searchParams?.page ?? 1);
  const pageSize = Number(searchParams?.pageSize ?? 10);
  const q = searchParams?.q ?? "";
  const city = searchParams?.city ?? "";
  const qs = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
    q,
    city,
  });

  // 🔒 Server Component => URL ABSOLUE
  const h = headers();
  const host = h.get("host") || "localhost:3000";
  const protocol = process.env.VERCEL ? "https" : "http";
  const base = process.env.NEXT_PUBLIC_BASE_URL || `${protocol}://${host}`;

  let items = [];
  let total = 0;

  try {
    const res = await fetch(`${base}/api/listings?${qs.toString()}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error(`❌ Fetch /api/listings failed: ${res.status}`);
    } else {
      const json = await res.json();
      items = json?.data?.items ?? [];
      total = json?.data?.total ?? 0;
    }
  } catch (err) {
    console.error("❌ Erreur fetch /api/listings:", err);
  }

  return (
    <>
      <div className="header-margin"></div>
      {/* header top margin */}

      <Header11 />
      {/* End Header 1 */}

      <section className="halfMap">
        <div className="halfMap__content">
          <MainFilterSearchBox />

          <div className="row x-gap-10 y-gap-10 pt-20">
            <DropdownSelelctBar />
          </div>
          {/* End .row */}

          <div className="row y-gap-10 justify-between items-center pt-20">
            <TopHeaderFilter />
          </div>
          {/* End .row */}

          <div className="row y-gap-20 pt-20">
            <HotelProperties listings={items} />
          </div>
          {/* End .row */}

          <Pagination total={total} page={page} pageSize={pageSize} />
          {/* End Pagination */}
        </div>
        {/* End .halfMap__content */}

        <div className="halfMap__map">
          <div className="map">
            <MapPropertyFinder />
          </div>
        </div>
        {/* End halfMap__map */}
      </section>
      {/* End halfMap content */}
    </>
  );
}
