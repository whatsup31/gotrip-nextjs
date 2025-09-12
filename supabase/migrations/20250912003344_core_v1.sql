-- === CORE V1: profiles, listings, services ================================

-- 1) PROFILS (mappés à auth.users)
create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text check (role in ('voyageur','conciergerie','prestataire')) not null,
  display_name text,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

-- Chaque utilisateur peut lire son propre profil
create policy "profiles_select_own"
on public.profiles for select
using (auth.uid() = user_id);

-- 2) LISTINGS (logements) — liés à un host (conciergerie)
create table if not exists public.listings (
  id bigint generated always as identity primary key,
  host_id uuid not null references public.profiles(user_id),
  title text not null,
  location text,
  description text,
  price_per_night numeric not null,
  photos jsonb default '[]'::jsonb,
  amenities jsonb default '[]'::jsonb,
  created_at timestamptz default now()
);

alter table public.listings enable row level security;

-- Lecture publique (pour le POC)
create policy "listings_public_read"
on public.listings for select
using (true);

-- Le host gère ses propres listings (insert/update/delete)
create policy "listings_host_manage"
on public.listings
for all
using (auth.uid() = host_id)
with check (auth.uid() = host_id);

-- 3) SERVICES (prestations annexes) — liés à un provider (prestataire)
create table if not exists public.services (
  id bigint generated always as identity primary key,
  provider_id uuid not null references public.profiles(user_id),
  title text not null,
  category text,
  description text,
  price numeric not null,
  duration_min int,
  area text,
  rating_avg numeric default 0,
  created_at timestamptz default now()
);

alter table public.services enable row level security;

-- Lecture publique (pour le POC)
create policy "services_public_read"
on public.services for select
using (true);

-- Le prestataire gère ses propres services
create policy "services_provider_manage"
on public.services
for all
using (auth.uid() = provider_id)
with check (auth.uid() = provider_id);
