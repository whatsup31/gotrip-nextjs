// components/hotel-list/common/Pagination.jsx
'use client'
import { useRouter, useSearchParams } from "next/navigation";

export default function Pagination({ total = 0, page = 1, pageSize = 10 }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const goTo = (p) => {
    const sp = new URLSearchParams(searchParams.toString());
    sp.set("page", String(p));
    sp.set("pageSize", String(pageSize));
    router.push(`?${sp.toString()}`);
  };

  const renderPage = (p) => {
    const isActive = p === page;
    const className = `size-40 flex-center rounded-full cursor-pointer ${isActive ? "bg-dark-1 text-white" : ""}`;
    return (
      <div key={p} className="col-auto">
        <div className={className} onClick={() => goTo(p)}>
          {p}
        </div>
      </div>
    );
  };

  const pages = [];
  const maxBtns = 7;
  let start = Math.max(1, page - 3);
  let end = Math.min(totalPages, start + maxBtns - 1);
  start = Math.max(1, end - maxBtns + 1);
  for (let p = start; p <= end; p++) pages.push(renderPage(p));

  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(total, page * pageSize);

  return (
    <div className="border-top-light mt-30 pt-30">
      <div className="row x-gap-10 y-gap-20 justify-between md:justify-center">
        <div className="col-auto md:order-1">
          <button className="button -blue-1 size-40 rounded-full border-light" onClick={() => goTo(Math.max(1, page - 1))} disabled={page === 1}>
            <i className="icon-chevron-left text-12" />
          </button>
        </div>

        <div className="col-md-auto md:order-3">
          <div className="row x-gap-10 y-gap-20 justify-center items-center">
            {pages}
          </div>
          <div className="text-center mt-20 md:mt-10">
            <div className="text-14 text-light-1">
              {from} – {to} sur {total} logements
            </div>
          </div>
        </div>

        <div className="col-auto md:order-2">
          <button className="button -blue-1 size-40 rounded-full border-light" onClick={() => goTo(Math.min(totalPages, page + 1))} disabled={page === totalPages}>
            <i className="icon-chevron-right text-12" />
          </button>
        </div>
      </div>
    </div>
  );
}
