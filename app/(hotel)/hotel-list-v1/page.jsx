// app/(hotel)/hotel-list-v1/page.jsx
import CallToActions from "@/components/common/CallToActions";
import Header11 from "@/components/header/header-11";
import DefaultFooter from "@/components/footer/default";
import MainFilterSearchBox from "@/components/hotel-list/hotel-list-v1/MainFilterSearchBox";
import TopHeaderFilter from "@/components/hotel-list/hotel-list-v1/TopHeaderFilter";
import HotelProperties from "@/components/hotel-list/hotel-list-v1/HotelProperties";
import Pagination from "@/components/hotel-list/common/Pagination";
import Sidebar from "@/components/hotel-list/hotel-list-v1/Sidebar";

export const metadata = { title: "Hotel List", description: "Listings" };

export default async function Page({ searchParams }) {
  const page = Number(searchParams?.page ?? 1);
  const pageSize = Number(searchParams?.pageSize ?? 10);
  const q = searchParams?.q ?? "";
  const city = searchParams?.city ?? "";

  const qs = new URLSearchParams({ page: String(page), pageSize: String(pageSize), q, city });
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/listings?` + qs.toString(), {
    cache: "no-store",
  });
  const json = await res.json();
  const { items = [], total = 0 } = json?.data ?? {};

  return (
    <>
      <div className="header-margin"></div>
      <Header11 />

      <section className="pt-40 pb-40 bg-light-2">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="text-center">
                <h1 className="text-30 fw-600">Find Your Dream Luxury Hotel</h1>
              </div>
              <MainFilterSearchBox />
            </div>
          </div>
        </div>
      </section>

      <section className="layout-pt-md layout-pb-lg">
        <div className="container">
          <div className="row y-gap-30">
            <div className="col-xl-3">
              <aside className="sidebar y-gap-40 xl:d-none">
                <Sidebar />
              </aside>
            </div>

            <div className="col-xl-9 ">
              <TopHeaderFilter />
              <div className="mt-30"></div>
              <div className="row y-gap-30">
                <HotelProperties listings={items} />
              </div>
              <Pagination total={total} page={page} pageSize={pageSize} />
            </div>
          </div>
        </div>
      </section>

      <CallToActions />
      <DefaultFooter />
    </>
  );
}
