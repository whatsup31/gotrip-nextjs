-- BOOKINGS (réservations)
create table if not exists public.bookings (
  id           bigint generated always as identity primary key,
  user_id      uuid    not null references public.profiles(user_id),
  listing_id   bigint  not null references public.listings(id),
  start_date   date    not null,
  end_date     date    not null,
  nights       int     not null,
  total_price  numeric not null,
  status       text    not null default 'created' check (status in ('created','paid','in_progress','done','cancelled')),
  created_at   timestamptz default now()
);
alter table public.bookings enable row level security;

-- RLS : le voyageur voit/ajoute ses propres bookings
drop policy if exists book_traveler_read on public.bookings;
create policy book_traveler_read
on public.bookings for select
using (auth.uid() = user_id);

drop policy if exists book_traveler_insert on public.bookings;
create policy book_traveler_insert
on public.bookings for insert
with check (auth.uid() = user_id);

-- RLS : le host peut lire les bookings de ses listings
drop policy if exists book_host_read on public.bookings;
create policy book_host_read
on public.bookings for select
using (exists (select 1 from public.listings l where l.id = bookings.listing_id and l.host_id = auth.uid()));

-- BOOKING_SERVICES (services attachés à la résa)
create table if not exists public.booking_services (
  booking_id  bigint  not null references public.bookings(id) on delete cascade,
  service_id  bigint  not null references public.services(id),
  quantity    int     not null default 1,
  unit_price  numeric not null,
  status      text    not null default 'pending' check (status in ('pending','assigned','in_progress','done')),
  primary key (booking_id, service_id)
);
alter table public.booking_services enable row level security;

-- RLS : le voyageur lit/ajoute des services à SES bookings
drop policy if exists bs_traveler_read on public.booking_services;
create policy bs_traveler_read
on public.booking_services for select
using (exists (select 1 from public.bookings b where b.id = booking_services.booking_id and b.user_id = auth.uid()));

drop policy if exists bs_traveler_insert on public.booking_services;
create policy bs_traveler_insert
on public.booking_services for insert
with check (exists (select 1 from public.bookings b where b.id = booking_services.booking_id and b.user_id = auth.uid()));

-- RLS : le host lit les services des bookings de SES listings
drop policy if exists bs_host_read on public.booking_services;
create policy bs_host_read
on public.booking_services for select
using (
  exists (
    select 1
    from public.bookings b
    join public.listings l on l.id = b.listing_id
    where b.id = booking_services.booking_id
      and l.host_id = auth.uid()
  )
);
