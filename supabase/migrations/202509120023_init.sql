-- table de test
create table if not exists public.healthcheck (
  id bigint generated always as identity primary key,
  created_at timestamptz default now()
);

-- activer RLS (row level security)
alter table public.healthcheck enable row level security;

-- policy de lecture ouverte (juste pour test)
create policy "Allow read"
on public.healthcheck
for select
using (true);
